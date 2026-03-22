import { useEffect, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

import { formatDateInput, toIsoDateString } from '../../../shared/utils/format'

const crewRoleOptions = [
  'captain',
  'chief_engineer',
  'engineer',
  'sailor',
  'deckhand',
  'radio_operator',
  'line_manager',
  'crew',
  'other',
]

const statusOptions = ['active', 'inactive', 'on_leave', 'retired']

function normalizeTrimmed(value) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizeNullableText(value) {
  const normalizedValue = normalizeTrimmed(value)
  return normalizedValue ? normalizedValue : null
}

function buildVesselOptionLabel(vessel) {
  return vessel.vesselCode
    ? `${vessel.name} (${vessel.vesselCode})`
    : vessel.officialNumber
      ? `${vessel.name} (${vessel.officialNumber})`
    : vessel.name
}

function buildCompanyOptionLabel(company) {
  return company.companyCode
    ? `${company.name} (${company.companyCode})`
    : company.name
}

function CrewMemberFormDialog({
  open,
  mode,
  initialCrewMember,
  vessels,
  companies = [],
  onClose,
  onSubmit,
  loading = false,
  submitting,
}) {
  const isEditMode = mode === 'edit'

  const initialValues = useMemo(
    () => ({
      employeeCode: initialCrewMember?.employeeCode || '',
      fullName: initialCrewMember?.fullName || '',
      dateOfBirth: formatDateInput(initialCrewMember?.dateOfBirth),
      nationality: initialCrewMember?.nationality || '',
      phone: initialCrewMember?.phone || '',
      email: initialCrewMember?.email || '',
      role: initialCrewMember?.role || initialCrewMember?.roles?.[0] || '',
      rank: initialCrewMember?.rank || '',
      company: initialCrewMember?.company?.id || initialCrewMember?.company || '',
      assignedVessels: initialCrewMember?.assignedVessels?.map((vessel) => vessel.id) || [],
      medicalExpiryDate: formatDateInput(initialCrewMember?.medicalExpiryDate),
      contractStartDate: formatDateInput(initialCrewMember?.contractStartDate),
      contractEndDate: formatDateInput(initialCrewMember?.contractEndDate),
      emergencyContact: {
        name: initialCrewMember?.emergencyContact?.name || '',
        phone: initialCrewMember?.emergencyContact?.phone || '',
        relationship: initialCrewMember?.emergencyContact?.relationship || '',
      },
      certificates: initialCrewMember?.certificates?.length
        ? initialCrewMember.certificates.map((certificate) => ({
            name: certificate.name || '',
            number: certificate.number || '',
            issuedBy: certificate.issuedBy || '',
            issueDate: formatDateInput(certificate.issueDate),
            expiryDate: formatDateInput(certificate.expiryDate),
          }))
        : [],
      status: initialCrewMember?.status || 'active',
      notes: initialCrewMember?.notes || '',
    }),
    [initialCrewMember],
  )

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certificates',
  })

  useEffect(() => {
    if (open) {
      reset(initialValues)
    }
  }, [initialValues, open, reset])

  const handleFormSubmit = handleSubmit(async (values) => {
    const payload = {
      employeeCode: normalizeTrimmed(values.employeeCode),
      fullName: normalizeTrimmed(values.fullName),
      dateOfBirth: values.dateOfBirth ? toIsoDateString(values.dateOfBirth) : null,
      nationality: normalizeTrimmed(values.nationality),
      phone: normalizeTrimmed(values.phone),
      email: normalizeTrimmed(values.email),
      role: normalizeNullableText(values.role),
      rank: normalizeTrimmed(values.rank),
      company: normalizeNullableText(values.company),
      assignedVessels: values.assignedVessels,
      medicalExpiryDate: values.medicalExpiryDate ? toIsoDateString(values.medicalExpiryDate) : null,
      contractStartDate: values.contractStartDate ? toIsoDateString(values.contractStartDate) : null,
      contractEndDate: values.contractEndDate ? toIsoDateString(values.contractEndDate) : null,
      emergencyContact:
        values.emergencyContact.name || values.emergencyContact.phone || values.emergencyContact.relationship
          ? {
              name: normalizeTrimmed(values.emergencyContact.name),
              phone: normalizeTrimmed(values.emergencyContact.phone),
              relationship: normalizeTrimmed(values.emergencyContact.relationship),
            }
          : null,
      certificates: values.certificates
        .map((certificate) => ({
          name: normalizeTrimmed(certificate.name),
          number: normalizeTrimmed(certificate.number),
          issuedBy: normalizeTrimmed(certificate.issuedBy),
          issueDate: certificate.issueDate ? toIsoDateString(certificate.issueDate) : null,
          expiryDate: certificate.expiryDate ? toIsoDateString(certificate.expiryDate) : null,
        }))
        .filter((certificate) =>
          Object.values(certificate).some((value) => value !== null && value !== ''),
        ),
      status: values.status,
      notes: normalizeTrimmed(values.notes),
    }

    await onSubmit(payload)
  })

  const isBusy = loading || submitting || isSubmitting

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {loading
          ? 'Loading Crew Member'
          : isEditMode
            ? 'Edit Crew Member'
            : 'Create Crew Member'}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={32} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Loading crew member details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preparing the edit form for this crew profile.
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? 'Update assignments, contact details, and certification records for this crew member.'
                : 'Create a crew profile that can be attached to vessels and assignment history.'}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <TextField
                label="Full name"
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                {...register('fullName', {
                  required: 'Full name is required.',
                })}
              />
              <TextField label="Employee code" {...register('employeeCode')} />
              <TextField label="Rank" {...register('rank')} />
              <TextField label="Date of birth" type="date" InputLabelProps={{ shrink: true }} {...register('dateOfBirth')} />
              <TextField label="Nationality" {...register('nationality')} />
              <TextField label="Phone" {...register('phone')} />
              <TextField
                label="Email"
                type="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email', {
                  validate: (value) => !value || /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address.',
                })}
              />
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <TextField select label="Company" helperText="Optional company ownership link" {...field}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {buildCompanyOptionLabel(company)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField select label="Status" {...field}>
                    {statusOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField select label="Role" {...field}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {crewRoleOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="assignedVessels"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Assigned vessels"
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => {
                        if (!selected.length) {
                          return 'No vessel assignments'
                        }

                        return selected
                          .map((id) => vessels.find((vessel) => vessel.id === id)?.name || id)
                          .join(', ')
                      },
                    }}
                    {...field}
                  >
                    {vessels.map((vessel) => (
                      <MenuItem key={vessel.id} value={vessel.id}>
                        {buildVesselOptionLabel(vessel)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <TextField label="Medical expiry" type="date" InputLabelProps={{ shrink: true }} {...register('medicalExpiryDate')} />
              <TextField label="Contract start" type="date" InputLabelProps={{ shrink: true }} {...register('contractStartDate')} />
              <TextField label="Contract end" type="date" InputLabelProps={{ shrink: true }} {...register('contractEndDate')} />
              <TextField label="Emergency contact name" {...register('emergencyContact.name')} />
              <TextField label="Emergency contact phone" {...register('emergencyContact.phone')} />
              <TextField label="Relationship" {...register('emergencyContact.relationship')} />
              <TextField
                label="Notes"
                multiline
                minRows={4}
                sx={{ gridColumn: { md: '1 / -1' } }}
                {...register('notes')}
              />
            </Box>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">Certificates</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => append({ name: '', number: '', issuedBy: '', issueDate: '', expiryDate: '' })}
                >
                  Add Certificate
                </Button>
              </Box>

              {fields.length ? (
                fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(6, minmax(0, 1fr))' },
                      gap: 2,
                      alignItems: 'start',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(15, 39, 66, 0.04)',
                    }}
                  >
                    <TextField label="Certificate name" {...register(`certificates.${index}.name`)} />
                    <TextField label="Number" {...register(`certificates.${index}.number`)} />
                    <TextField label="Issued by" {...register(`certificates.${index}.issuedBy`)} />
                    <TextField label="Issue date" type="date" InputLabelProps={{ shrink: true }} {...register(`certificates.${index}.issueDate`)} />
                    <TextField label="Expiry date" type="date" InputLabelProps={{ shrink: true }} {...register(`certificates.${index}.expiryDate`)} />
                    <Button
                      color="error"
                      variant="text"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => remove(index)}
                      sx={{ alignSelf: 'center' }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No certificates added yet.
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting || isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} variant="contained" disabled={isBusy}>
          {loading ? 'Loading...' : isBusy ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Crew Member'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CrewMemberFormDialog
