import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

import { formatDateInput, toIsoDateString } from '../../../shared/utils/format'
import VesselDeviceArraySection from './VesselDeviceArraySection'
import {
  buildDeviceFormItems,
  normalizeDeviceFormItems,
  vesselDeviceConfigs,
  vesselDeviceTabs,
  vesselStatusOptions,
  vesselTypeOptions,
} from '../vesselDeviceConfig'

const numericFields = [
  'buildYear',
  'lengthOverall',
  'beam',
  'draft',
  'grossTonnage',
  'netTonnage',
  'noOfCrew',
  'noOfPax',
  'noOfBerthed',
  'noOfUnberthedPax',
]

const dateFields = [
  'cosExpiryDate',
  'surveyAnniversaryDate',
  'classCertExpiryDate',
  'cooExpiryDate',
  'trailerRegExpiryDate',
  'rcdTestExpiryDate',
  'meggerTestExpiryDate',
  'ecocExpiryDate',
  'gasCocExpiryDate',
]

function normalizeTrimmed(value) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizeNullableText(value) {
  const normalizedValue = normalizeTrimmed(value)
  return normalizedValue ? normalizedValue : null
}

function normalizeNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  return Number(value)
}

function buildCompanyOptionLabel(company) {
  return company.companyCode
    ? `${company.name} (${company.companyCode})`
    : company.name
}

function TabPanel({ activeTab, tabKey, children }) {
  if (activeTab !== tabKey) {
    return null
  }

  return <Stack spacing={3}>{children}</Stack>
}

function SectionHeading({ title, description }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Box>
  )
}

function VesselFormDialog({
  open,
  mode,
  initialVessel,
  companies = [],
  onClose,
  onSubmit,
  loading = false,
  submitting,
}) {
  const isEditMode = mode === 'edit'
  const [activeTab, setActiveTab] = useState('overview')

  const initialValues = useMemo(
    () =>
      vesselDeviceConfigs.reduce(
        (values, config) => {
          values[config.key] = buildDeviceFormItems(config, initialVessel?.[config.key])
          return values
        },
        {
          vesselCode: initialVessel?.vesselCode || '',
          name: initialVessel?.name || '',
          officialNumber: initialVessel?.officialNumber || '',
          imoNumber: initialVessel?.imoNumber || '',
          amsaUvi: initialVessel?.amsaUvi || '',
          trailerRegNo: initialVessel?.trailerRegNo || '',
          homePort: initialVessel?.homePort || '',
          builder: initialVessel?.builder || '',
          buildYear: initialVessel?.buildYear ?? '',
          buildersPlateNo: initialVessel?.buildersPlateNo || '',
          surveyClass: initialVessel?.surveyClass || '',
          surveyAuthority: initialVessel?.surveyAuthority || '',
          vesselType: initialVessel?.vesselType || 'other',
          flagState: initialVessel?.flagState || '',
          lengthOverall: initialVessel?.lengthOverall ?? '',
          beam: initialVessel?.beam ?? '',
          draft: initialVessel?.draft ?? '',
          grossTonnage: initialVessel?.grossTonnage ?? '',
          netTonnage: initialVessel?.netTonnage ?? '',
          hullMaterial: initialVessel?.hullMaterial || '',
          noOfCrew: initialVessel?.noOfCrew ?? 0,
          noOfPax: initialVessel?.noOfPax ?? 0,
          noOfBerthed: initialVessel?.noOfBerthed ?? 0,
          noOfUnberthedPax: initialVessel?.noOfUnberthedPax ?? 0,
          cosExpiryDate: formatDateInput(initialVessel?.cosExpiryDate),
          surveyAnniversaryDate: formatDateInput(initialVessel?.surveyAnniversaryDate),
          classCertExpiryDate: formatDateInput(initialVessel?.classCertExpiryDate),
          cooExpiryDate: formatDateInput(initialVessel?.cooExpiryDate),
          trailerRegExpiryDate: formatDateInput(initialVessel?.trailerRegExpiryDate),
          rcdTestExpiryDate: formatDateInput(initialVessel?.rcdTestExpiryDate),
          meggerTestExpiryDate: formatDateInput(initialVessel?.meggerTestExpiryDate),
          ecocExpiryDate: formatDateInput(initialVessel?.ecocExpiryDate),
          gasCocExpiryDate: formatDateInput(initialVessel?.gasCocExpiryDate),
          workOrderNo: initialVessel?.workOrderNo || '',
          company: initialVessel?.company?.id || initialVessel?.company || '',
          status: initialVessel?.status || 'active',
          notes: initialVessel?.notes || '',
        },
      ),
    [initialVessel],
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
      vesselCode: normalizeTrimmed(values.vesselCode),
      name: normalizeTrimmed(values.name),
      officialNumber: normalizeTrimmed(values.officialNumber),
      imoNumber: normalizeTrimmed(values.imoNumber),
      amsaUvi: normalizeTrimmed(values.amsaUvi),
      trailerRegNo: normalizeTrimmed(values.trailerRegNo),
      homePort: normalizeTrimmed(values.homePort),
      builder: normalizeTrimmed(values.builder),
      buildersPlateNo: normalizeTrimmed(values.buildersPlateNo),
      surveyClass: normalizeTrimmed(values.surveyClass),
      surveyAuthority: normalizeTrimmed(values.surveyAuthority),
      vesselType: values.vesselType,
      flagState: normalizeTrimmed(values.flagState),
      hullMaterial: normalizeTrimmed(values.hullMaterial),
      workOrderNo: normalizeTrimmed(values.workOrderNo),
      company: normalizeNullableText(values.company),
      status: values.status,
      notes: normalizeTrimmed(values.notes),
    }

    numericFields.forEach((field) => {
      payload[field] = normalizeNullableNumber(values[field])
    })

    dateFields.forEach((field) => {
      payload[field] = values[field] ? toIsoDateString(values[field]) : null
    })

    vesselDeviceConfigs.forEach((config) => {
      payload[config.key] = normalizeDeviceFormItems(config, values[config.key])
    })

    await onSubmit(payload)
  })

  const isBusy = loading || submitting || isSubmitting

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        {loading
          ? 'Loading Vessel'
          : isEditMode
            ? 'Edit Vessel'
            : 'Create Vessel'}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={32} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Loading vessel details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preparing the edit form for this vessel.
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? 'Update registration, command, compliance, and onboard device records in one place.'
                : 'Create a vessel profile and add onboard devices across machinery, navigation, and safety tabs.'}
            </Typography>

            <Tabs
              value={activeTab}
              onChange={(_, nextTab) => setActiveTab(nextTab)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Compliance" value="compliance" />
              <Tab label="Machinery" value="machinery" />
              <Tab label="Navigation" value="navigation" />
              <Tab label="Safety" value="safety" />
            </Tabs>

            <TabPanel activeTab={activeTab} tabKey="overview">
              <SectionHeading
                title="Vessel Identity"
                description="Capture the baseline registration, classification, and physical profile for this vessel."
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <TextField
                  label="Vessel code"
                  error={Boolean(errors.vesselCode)}
                  helperText={errors.vesselCode?.message || 'Unique code such as VESSEL-CNT-0001.'}
                  {...register('vesselCode', {
                    required: 'Vessel code is required.',
                    pattern: {
                      value: /^[A-Za-z0-9-]+$/,
                      message: 'Use only letters, numbers, and hyphens.',
                    },
                  })}
                />
                <TextField
                  label="Vessel name"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  {...register('name', {
                    required: 'Vessel name is required.',
                  })}
                />
                <TextField label="Official number" {...register('officialNumber')} />
                <TextField label="IMO number" {...register('imoNumber')} />
                <TextField label="AMSA UVI" {...register('amsaUvi')} />
                <TextField label="Trailer registration" {...register('trailerRegNo')} />
                <TextField label="Home port" {...register('homePort')} />
                <TextField label="Builder" {...register('builder')} />
                <TextField
                  label="Build year"
                  type="number"
                  error={Boolean(errors.buildYear)}
                  helperText={errors.buildYear?.message}
                  {...register('buildYear', {
                    validate: (value) => {
                      if (!value) return true
                      const year = Number(value)
                      if (year < 1900 || year > new Date().getFullYear()) {
                        return 'Enter a valid build year.'
                      }
                      return true
                    },
                  })}
                />
                <TextField label="Builder plate number" {...register('buildersPlateNo')} />
                <TextField label="Survey class" {...register('surveyClass')} />
                <TextField label="Survey authority" {...register('surveyAuthority')} />

                <Controller
                  name="vesselType"
                  control={control}
                  render={({ field }) => (
                    <TextField select label="Vessel type" {...field}>
                      {vesselTypeOptions.map((optionItem) => (
                        <MenuItem key={optionItem.value} value={optionItem.value}>
                          {optionItem.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <TextField label="Flag state" {...register('flagState')} />
                <TextField label="Length overall" type="number" {...register('lengthOverall')} />
                <TextField label="Beam" type="number" {...register('beam')} />
                <TextField label="Draft" type="number" {...register('draft')} />
                <TextField label="Gross tonnage" type="number" {...register('grossTonnage')} />
                <TextField label="Net tonnage" type="number" {...register('netTonnage')} />
                <TextField label="Hull material" {...register('hullMaterial')} />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField select label="Status" {...field}>
                      {vesselStatusOptions.map((optionItem) => (
                        <MenuItem key={optionItem.value} value={optionItem.value}>
                          {optionItem.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <TextField label="Crew capacity" type="number" {...register('noOfCrew')} />
                <TextField label="Passenger capacity" type="number" {...register('noOfPax')} />
                <TextField label="Berthed pax" type="number" {...register('noOfBerthed')} />
                <TextField label="Unberthed pax" type="number" {...register('noOfUnberthedPax')} />

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
              </Box>
            </TabPanel>

            <TabPanel activeTab={activeTab} tabKey="compliance">
              <SectionHeading
                title="Certificates And Renewals"
                description="Keep the vessel certification timeline up to date for admin and operations teams."
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <TextField label="COS expiry date" type="date" InputLabelProps={{ shrink: true }} {...register('cosExpiryDate')} />
                <TextField label="Survey anniversary" type="date" InputLabelProps={{ shrink: true }} {...register('surveyAnniversaryDate')} />
                <TextField label="Class cert expiry" type="date" InputLabelProps={{ shrink: true }} {...register('classCertExpiryDate')} />
                <TextField label="COO expiry" type="date" InputLabelProps={{ shrink: true }} {...register('cooExpiryDate')} />
                <TextField label="Trailer reg expiry" type="date" InputLabelProps={{ shrink: true }} {...register('trailerRegExpiryDate')} />
                <TextField label="RCD test expiry" type="date" InputLabelProps={{ shrink: true }} {...register('rcdTestExpiryDate')} />
                <TextField label="Megger test expiry" type="date" InputLabelProps={{ shrink: true }} {...register('meggerTestExpiryDate')} />
                <TextField label="ECOC expiry" type="date" InputLabelProps={{ shrink: true }} {...register('ecocExpiryDate')} />
                <TextField label="Gas COC expiry" type="date" InputLabelProps={{ shrink: true }} {...register('gasCocExpiryDate')} />
                <TextField label="Work order number" {...register('workOrderNo')} />
                <TextField
                  label="Notes"
                  multiline
                  minRows={5}
                  sx={{ gridColumn: { md: '1 / -1' } }}
                  {...register('notes')}
                />
              </Box>
            </TabPanel>

            {vesselDeviceTabs.map((tab) => (
              <TabPanel key={tab.value} activeTab={activeTab} tabKey={tab.value}>
                {tab.sections.map((config) => (
                  <VesselDeviceArraySection
                    key={config.key}
                    config={config}
                    control={control}
                    register={register}
                    errors={errors}
                    disabled={isBusy}
                  />
                ))}
              </TabPanel>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting || isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} variant="contained" disabled={isBusy}>
          {loading ? 'Loading...' : isBusy ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Vessel'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VesselFormDialog
