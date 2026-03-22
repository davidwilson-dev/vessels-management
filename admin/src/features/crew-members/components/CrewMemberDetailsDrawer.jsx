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
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        background: 'linear-gradient(145deg, #082033 0%, #0f2742 65%, #14466c 100%)',
        color: '#ffffff',
      }}
    >
      <Typography variant="overline" sx={{ fontWeight: 800, color: 'inherit' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'inherit' }}>
        {value || 'Not provided'}
      </Typography>
    </Box>
  )
}

function StatusChip({ status }) {
  const colorMap = {
    active: 'success',
    inactive: 'default',
    on_leave: 'warning',
    retired: 'secondary',
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={(status || 'unknown').replace('_', ' ')} />
}

function formatRole(role) {
  return role ? role.replace('_', ' ') : 'No role assigned'
}

function CrewMemberDetailsDrawer({
  crewMember,
  open,
  loading,
  error,
  onClose,
  onEdit,
  canManageCrewMembers,
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
            Crew Member Detail
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {crewMember?.fullName || 'Loading crew member'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusChip status={crewMember?.status} />
            {crewMember?.role ? (
              <Chip
                key={crewMember.role}
                size="small"
                label={formatRole(crewMember.role)}
                variant="outlined"
                sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
              />
            ) : null}
          </Stack>
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {loading ? <Alert severity="info">Loading crew member details...</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          {crewMember && !loading ? (
            <>
              {canManageCrewMembers ? (
                <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => onEdit(crewMember)}>
                  Edit Crew Member
                </Button>
              ) : null}

              <DetailRow label="Employee Code" value={crewMember.employeeCode} />
              <DetailRow label="Role" value={formatRole(crewMember.role)} />
              <DetailRow label="Rank" value={crewMember.rank} />
              <DetailRow label="Nationality" value={crewMember.nationality} />
              <DetailRow label="Email" value={crewMember.email} />
              <DetailRow label="Phone" value={crewMember.phone} />
              <DetailRow label="Date of Birth" value={formatDate(crewMember.dateOfBirth)} />
              <DetailRow label="Medical Expiry" value={formatDate(crewMember.medicalExpiryDate)} />
              <DetailRow label="Contract Start" value={formatDate(crewMember.contractStartDate)} />
              <DetailRow label="Contract End" value={formatDate(crewMember.contractEndDate)} />
              <DetailRow
                label="Assigned Vessels"
                value={crewMember.assignedVessels?.map((vessel) => vessel.vesselCode ? `${vessel.name} (${vessel.vesselCode})` : vessel.name).join(', ')}
              />
              <DetailRow
                label="Emergency Contact"
                value={crewMember.emergencyContact
                  ? `${crewMember.emergencyContact.name || 'Unknown'} · ${crewMember.emergencyContact.phone || 'No phone'}`
                  : ''}
              />
              <DetailRow label="Notes" value={crewMember.notes} />

              <Divider />

              <Box>
                <Typography variant="overline" color="text.white" sx={{ fontWeight: 800 }}>
                  Certificates
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  {crewMember.certificates?.length ? (
                    crewMember.certificates.map((certificate, index) => (
                      <Box
                        key={`${certificate.name}-${certificate.number}-${index}`}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(15, 39, 66, 0.04)',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {certificate.name || 'Unnamed certificate'}
                        </Typography>
                        <Typography variant="body2" color="text.white">
                          {certificate.number || 'No number'} · {certificate.issuedBy || 'Unknown issuer'}
                        </Typography>
                        <Typography variant="body2" color="text.white">
                          Issued {formatDate(certificate.issueDate)} · Expires {formatDate(certificate.expiryDate)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.white">
                      No certificates are recorded yet.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="overline" color="text.white" sx={{ fontWeight: 800 }}>
                  Assignment History
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  {crewMember.assignments?.length ? (
                    crewMember.assignments.map((assignment) => (
                      <Box
                        key={assignment.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(15, 39, 66, 0.04)',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {assignment.vessel?.vesselCode
                            ? `${assignment.vessel.name} (${assignment.vessel.vesselCode})`
                            : assignment.vessel?.name || 'Unknown vessel'}
                        </Typography>
                        <Typography variant="body2" color="text.white">
                          {(assignment.role || 'other').replace('_', ' ')} · {formatDate(assignment.startDate)}
                          {assignment.endDate ? ` to ${formatDate(assignment.endDate)}` : ''}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.white">
                      No assignment history is linked to this crew member yet.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              <DetailRow label="Created" value={formatDateTime(crewMember.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(crewMember.updatedAt)} />
            </>
          ) : null}
        </Stack>
      </Box>
    </Drawer>
  )
}

export default CrewMemberDetailsDrawer
