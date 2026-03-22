import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const companyStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function normalizeTrimmed(value) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizeNullableText(value) {
  const normalizedValue = normalizeTrimmed(value)
  return normalizedValue ? normalizedValue : null
}

function CompanyFormDialog({
  open,
  mode,
  initialCompany,
  onClose,
  onSubmit,
  submitting,
}) {
  const isEditMode = mode === 'edit'

  const initialValues = useMemo(
    () => ({
      companyCode: initialCompany?.companyCode || '',
      name: initialCompany?.name || '',
      email: initialCompany?.email || '',
      phone: initialCompany?.phone || '',
      address: initialCompany?.address || '',
      status: initialCompany?.status || 'active',
      notes: initialCompany?.notes || '',
    }),
    [initialCompany],
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

  useEffect(() => {
    if (open) {
      reset(initialValues)
    }
  }, [initialValues, open, reset])

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit({
      companyCode: normalizeTrimmed(values.companyCode),
      name: normalizeTrimmed(values.name),
      email: normalizeNullableText(values.email),
      phone: normalizeNullableText(values.phone),
      address: normalizeNullableText(values.address),
      status: values.status,
      notes: normalizeTrimmed(values.notes),
    })
  })

  const isBusy = submitting || isSubmitting

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditMode ? 'Edit Company' : 'Create Company'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? 'Update the company profile and keep linked vessel and crew ownership records aligned.'
              : 'Create a company profile that can be linked to vessels and crew members across the admin console.'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <TextField
              label="Company code"
              error={Boolean(errors.companyCode)}
              helperText={errors.companyCode?.message || 'Unique code such as COMP-001.'}
              {...register('companyCode', {
                required: 'Company code is required.',
                pattern: {
                  value: /^[A-Za-z0-9-]+$/,
                  message: 'Use only letters, numbers, and hyphens.',
                },
              })}
            />
            <TextField
              label="Company name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name', {
                required: 'Company name is required.',
              })}
            />
            <TextField
              label="Email"
              type="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                validate: (value) => !value || /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address.',
              })}
            />
            <TextField label="Phone" {...register('phone')} />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select label="Status" {...field}>
                  {companyStatusOptions.map((optionItem) => (
                    <MenuItem key={optionItem.value} value={optionItem.value}>
                      {optionItem.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              label="Address"
              multiline
              minRows={3}
              sx={{ gridColumn: { md: '1 / -1' } }}
              {...register('address')}
            />
            <TextField
              label="Notes"
              multiline
              minRows={4}
              sx={{ gridColumn: { md: '1 / -1' } }}
              {...register('notes')}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} variant="contained" disabled={isBusy}>
          {isBusy ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Company'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompanyFormDialog
