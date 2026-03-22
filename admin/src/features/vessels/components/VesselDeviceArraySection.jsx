import { Controller, useFieldArray } from 'react-hook-form'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { buildEmptyDeviceItem } from '../vesselDeviceConfig'

function getRequiredMessage(field) {
  return `${field.label} is required.`
}

function getValidationRules(field) {
  if (!field.required) {
    return undefined
  }

  return {
    validate: (value) => {
      if (value === '' || value === null || value === undefined) {
        return getRequiredMessage(field)
      }

      return true
    },
  }
}

function VesselDeviceArraySection({ config, control, register, errors, disabled }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: config.key,
    keyName: 'fieldId',
  })

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {config.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {config.helperText}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={() => append(buildEmptyDeviceItem(config))}
          disabled={disabled}
        >
          Add {config.singularLabel}
        </Button>
      </Stack>

      {fields.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderStyle: 'dashed',
            backgroundColor: 'rgba(15, 39, 66, 0.02)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No {config.label.toLowerCase()} added yet.
          </Typography>
        </Paper>
      ) : null}

      {fields.map((fieldItem, index) => (
        <Paper
          key={fieldItem.fieldId}
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 39, 66, 0.02)',
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {config.singularLabel} {index + 1}
              </Typography>
              <IconButton
                color="error"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label={`Remove ${config.singularLabel} ${index + 1}`}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {config.fields.map((deviceField) => {
                const fieldPath = `${config.key}.${index}.${deviceField.name}`
                const fieldError = errors?.[config.key]?.[index]?.[deviceField.name]

                if (deviceField.type === 'checkbox') {
                  return (
                    <Controller
                      key={fieldPath}
                      name={fieldPath}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          sx={{ gridColumn: { md: deviceField.fullWidth ? '1 / -1' : 'auto' } }}
                          control={(
                            <Checkbox
                              disabled={disabled}
                              checked={Boolean(field.value)}
                              onChange={(event) => field.onChange(event.target.checked)}
                            />
                          )}
                          label={deviceField.label}
                        />
                      )}
                    />
                  )
                }

                if (deviceField.type === 'select') {
                  return (
                    <Controller
                      key={fieldPath}
                      name={fieldPath}
                      control={control}
                      rules={getValidationRules(deviceField)}
                      render={({ field }) => (
                        <TextField
                          select
                          label={deviceField.label}
                          required={deviceField.required}
                          disabled={disabled}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          error={Boolean(fieldError)}
                          helperText={fieldError?.message}
                          sx={{ gridColumn: { md: deviceField.fullWidth ? '1 / -1' : 'auto' } }}
                        >
                          <MenuItem value="">Not set</MenuItem>
                          {deviceField.options.map((optionItem) => (
                            <MenuItem key={optionItem.value} value={optionItem.value}>
                              {optionItem.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  )
                }

                return (
                  <TextField
                    key={fieldPath}
                    label={deviceField.label}
                    type={deviceField.type === 'number' ? 'number' : deviceField.type === 'date' ? 'date' : 'text'}
                    required={deviceField.required}
                    error={Boolean(fieldError)}
                    helperText={fieldError?.message}
                    multiline={Boolean(deviceField.multiline)}
                    minRows={deviceField.minRows}
                    disabled={disabled}
                    InputLabelProps={deviceField.type === 'date' ? { shrink: true } : undefined}
                    inputProps={deviceField.type === 'number' && deviceField.min !== undefined ? { min: deviceField.min } : undefined}
                    sx={{ gridColumn: { md: deviceField.fullWidth ? '1 / -1' : 'auto' } }}
                    {...register(fieldPath, getValidationRules(deviceField))}
                  />
                )
              })}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

export default VesselDeviceArraySection
