import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Stack,
  Typography,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import { formatDate, formatDateTime } from '../../../shared/utils/format'
import { vesselDeviceTabs } from '../vesselDeviceConfig'

function DetailRow({ label, value }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography variant="body1">{value || 'Not provided'}</Typography>
    </Box>
  )
}

function StatusChip({ status }) {
  const colorMap = {
    active: 'success',
    inactive: 'default',
    maintenance: 'warning',
    retired: 'secondary',
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={(status || 'unknown').replace('_', ' ')} />
}

function VesselDetailsDrawer({
  vessel,
  open,
  loading,
  error,
  onClose,
  onEdit,
  canManageVessels,
}) {
  const deviceSections = vesselDeviceTabs
    .map((tab) => ({
      ...tab,
      counts: tab.sections
        .map((config) => ({
          key: config.key,
          label: config.label,
          count: vessel?.[config.key]?.length ?? 0,
        }))
        .filter((entry) => entry.count > 0),
    }))
    .filter((tab) => tab.counts.length > 0)

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 480 }, maxWidth: '100vw' }}>
        <Box
          sx={{
            p: 3,
            color: '#ffffff',
            background: 'linear-gradient(145deg, #082033 0%, #0f2742 60%, #0f5b8d 100%)',
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 1.4, opacity: 0.76 }}>
            Vessel Detail
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {vessel?.name || 'Loading vessel'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusChip status={vessel?.status} />
            <Chip
              size="small"
              label={(vessel?.vesselType || 'other').replace('_', ' ')}
              variant="outlined"
              sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
            />
          </Stack>
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {loading ? <Alert severity="info">Loading vessel details...</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          {vessel && !loading ? (
            <>
              {canManageVessels ? (
                <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => onEdit(vessel)}>
                  Edit Vessel
                </Button>
              ) : null}

              <DetailRow label="Vessel Code" value={vessel.vesselCode} />
              <DetailRow label="Official Number" value={vessel.officialNumber} />
              <DetailRow label="IMO Number" value={vessel.imoNumber} />
              <DetailRow label="AMSA UVI" value={vessel.amsaUvi} />
              <DetailRow label="Home Port" value={vessel.homePort} />
              <DetailRow label="Builder" value={vessel.builder} />
              <DetailRow label="Build Year" value={vessel.buildYear ? String(vessel.buildYear) : ''} />
              <DetailRow label="Flag State" value={vessel.flagState} />
              <DetailRow label="Hull Material" value={vessel.hullMaterial} />
              <DetailRow label="Captain" value={vessel.captain?.fullName} />
              <DetailRow label="Line Manager" value={vessel.lineManager?.fullName} />
              <DetailRow label="Crew Capacity" value={String(vessel.noOfCrew ?? 0)} />
              <DetailRow label="Passenger Capacity" value={String(vessel.noOfPax ?? 0)} />
              <DetailRow label="Certificate of Survey" value={formatDate(vessel.cosExpiryDate)} />
              <DetailRow label="Class Certificate" value={formatDate(vessel.classCertExpiryDate)} />
              <DetailRow label="Work Order" value={vessel.workOrderNo} />
              <DetailRow label="Notes" value={vessel.notes} />

              <Divider />

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                  Crew Assignments
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  {vessel.crewAssignments?.length ? (
                    vessel.crewAssignments.map((assignment) => (
                      <Box
                        key={assignment.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(15, 39, 66, 0.04)',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {assignment.crewMember?.fullName || 'Unknown crew member'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(assignment.role || 'other').replace('_', ' ')} · {formatDate(assignment.startDate)}
                          {assignment.endDate ? ` to ${formatDate(assignment.endDate)}` : ''}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No crew assignments are linked to this vessel yet.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                  Device Register
                </Typography>
                {deviceSections.length ? (
                  <Stack spacing={1.5} sx={{ mt: 1 }}>
                    {deviceSections.map((section) => (
                      <Box key={section.value}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
                          {section.label}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {section.counts.map((entry) => (
                            <Chip
                              key={entry.key}
                              size="small"
                              variant="outlined"
                              label={`${entry.label}: ${entry.count}`}
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No onboard devices are linked to this vessel yet.
                  </Typography>
                )}
              </Box>

              <Divider />

              <DetailRow label="Created" value={formatDateTime(vessel.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(vessel.updatedAt)} />
            </>
          ) : null}
        </Stack>
      </Box>
    </Drawer>
  )
}

export default VesselDetailsDrawer
