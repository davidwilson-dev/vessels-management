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
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={status || 'unknown'} />
}

function buildVesselLabel(vessel) {
  if (vessel?.vesselCode) {
    return `${vessel.name} (${vessel.vesselCode})`
  }

  return vessel?.name || 'Unknown vessel'
}

function buildCrewLabel(crewMember) {
  if (crewMember?.employeeCode) {
    return `${crewMember.fullName} (${crewMember.employeeCode})`
  }

  return crewMember?.fullName || 'Unknown crew member'
}

function CompanyDetailsDrawer({
  company,
  open,
  loading,
  error,
  onClose,
  onEdit,
  canManageCompanies,
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 500 }, maxWidth: '100vw' }}>
        <Box
          sx={{
            p: 3,
            color: '#ffffff',
            background: 'linear-gradient(145deg, #082033 0%, #0f2742 60%, #0f5b8d 100%)',
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 1.4, opacity: 0.76 }}>
            Company Detail
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {company?.name || 'Loading company'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusChip status={company?.status} />
            <Chip
              size="small"
              label={`${company?.linkedVessels?.length ?? 0} vessel${company?.linkedVessels?.length === 1 ? '' : 's'}`}
              variant="outlined"
              sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
            />
            <Chip
              size="small"
              label={`${company?.linkedCrewMembers?.length ?? 0} crew`}
              variant="outlined"
              sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
            />
          </Stack>
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {loading ? <Alert severity="info">Loading company details...</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          {company && !loading ? (
            <>
              {canManageCompanies ? (
                <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => onEdit(company)}>
                  Edit Company
                </Button>
              ) : null}

              <DetailRow label="Company Code" value={company.companyCode} />
              <DetailRow label="Email" value={company.email} />
              <DetailRow label="Phone" value={company.phone} />
              <DetailRow label="Address" value={company.address} />
              <DetailRow label="Notes" value={company.notes} />

              <Divider />

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                  Linked Vessels
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  {company.linkedVessels?.length ? (
                    company.linkedVessels.map((vessel) => (
                      <Box
                        key={`${vessel.id}-${vessel.startDate}`}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(15, 39, 66, 0.04)',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {buildVesselLabel(vessel)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(vessel.vesselType || 'other').replace('_', ' ')} · {formatDate(vessel.startDate)}
                          {vessel.endDate ? ` to ${formatDate(vessel.endDate)}` : ''}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No vessels are currently linked to this company.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                  Linked Crew Members
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  {company.linkedCrewMembers?.length ? (
                    company.linkedCrewMembers.map((crewMember) => (
                      <Box
                        key={`${crewMember.id}-${crewMember.startDate}`}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(15, 39, 66, 0.04)',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {buildCrewLabel(crewMember)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {crewMember.rank || 'No rank assigned'} · {formatDate(crewMember.startDate)}
                          {crewMember.endDate ? ` to ${formatDate(crewMember.endDate)}` : ''}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No crew members are currently linked to this company.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              <DetailRow label="Created" value={formatDateTime(company.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(company.updatedAt)} />
            </>
          ) : null}
        </Stack>
      </Box>
    </Drawer>
  )
}

export default CompanyDetailsDrawer
