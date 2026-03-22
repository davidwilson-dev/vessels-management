import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  formatDateInput,
  toIsoDateString,
} from '../../../shared/utils/format'

function UserFormDialog({ open, mode, initialUser, onClose, onSubmit, loading = false, submitting }) {
  const isEditMode = mode === 'edit'

  const initialValues = useMemo(
    () => ({
      email: initialUser?.email || '',
      password: '',
      name: initialUser?.profile?.name || '',
      dateOfBirth: formatDateInput(initialUser?.profile?.dateOfBirth),
      address: initialUser?.profile?.address || '',
      idCardNumber: initialUser?.profile?.idCardNumber || '',
      phoneNumber: initialUser?.profile?.phoneNumber || '',
      gender: initialUser?.profile?.gender || 'Other',
      position: initialUser?.profile?.position || '',
      avatarUrl: initialUser?.profile?.avatarUrl || '',
      bio: initialUser?.profile?.bio || '',
      isActive: initialUser?.isActive ?? true,
      emailVerified: initialUser?.emailVerified ?? true,
    }),
    [initialUser],
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
    const payload = {
      email: values.email.trim().toLowerCase(),
      name: values.name.trim(),
      address: values.address.trim(),
      idCardNumber: values.idCardNumber.trim(),
      phoneNumber: values.phoneNumber.trim(),
      gender: values.gender,
      position: values.position.trim(),
      avatarUrl: values.avatarUrl.trim(),
      bio: values.bio.trim(),
    }

    if (values.dateOfBirth) {
      payload.dateOfBirth = toIsoDateString(values.dateOfBirth)
    }

    if (values.password.trim()) {
      payload.password = values.password.trim()
    }

    if (isEditMode) {
      payload.isActive = Boolean(values.isActive)
      payload.emailVerified = Boolean(values.emailVerified)
    }

    await onSubmit(payload)
  })

  const isBusy = loading || submitting || isSubmitting

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {loading
          ? 'Loading User'
          : isEditMode
            ? 'Edit User'
            : 'Create User'}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={32} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Loading user details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preparing the edit form for this account.
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? 'Update access settings and profile details for this team member.'
                : 'Create a staff user that fits the same operational structure as the vessel manager interface.'}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <TextField
                label="Full name"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register('name', {
                  required: 'Name is required.',
                  minLength: {
                    value: 3,
                    message: 'Name should have at least 3 characters.',
                  },
                })}
              />

              <TextField
                label="Email"
                type="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
              />

              <TextField
                label="Password"
                type="password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message || (isEditMode ? 'Leave blank to keep the current password.' : PASSWORD_RULE_MESSAGE)}
                {...register('password', {
                  validate: (value) => {
                    if (!value) {
                      return isEditMode ? true : 'Password is required.'
                    }

                    return PASSWORD_RULE.test(value) || PASSWORD_RULE_MESSAGE
                  },
                })}
              />

              <TextField
                label="Date of birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.dateOfBirth)}
                helperText={errors.dateOfBirth?.message}
                {...register('dateOfBirth', {
                  required: isEditMode ? undefined : 'Date of birth is required.',
                })}
              />

              <TextField
                label="Phone number"
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              <TextField
                label="Position"
                error={Boolean(errors.position)}
                helperText={errors.position?.message}
                {...register('position')}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField select label="Gender" {...field}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />

              <TextField
                label="ID card number"
                error={Boolean(errors.idCardNumber)}
                helperText={errors.idCardNumber?.message}
                {...register('idCardNumber')}
              />

              <TextField
                label="Address"
                sx={{ gridColumn: { md: '1 / -1' } }}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                {...register('address')}
              />

              <TextField
                label="Avatar URL"
                sx={{ gridColumn: { md: '1 / -1' } }}
                error={Boolean(errors.avatarUrl)}
                helperText={errors.avatarUrl?.message || 'Optional. Must be an http(s) URL if provided.'}
                {...register('avatarUrl', {
                  validate: (value) => !value || /^https?:\/\//.test(value) || 'Use a valid http(s) URL.',
                })}
              />

              <TextField
                label="Bio"
                multiline
                minRows={3}
                sx={{ gridColumn: { md: '1 / -1' } }}
                error={Boolean(errors.bio)}
                helperText={errors.bio?.message}
                {...register('bio')}
              />
            </Box>

            {isEditMode ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                      label="Account is active"
                    />
                  )}
                />
                <Controller
                  name="emailVerified"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                      label="Email is verified"
                    />
                  )}
                />
              </Box>
            ) : null}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting || isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} variant="contained" disabled={isBusy}>
          {loading ? 'Loading...' : isBusy ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserFormDialog
