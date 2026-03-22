import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'

import { formatDate } from '../../../shared/utils/format'

function StatusChip({ status }) {
  const colorMap = {
    active: 'success',
    inactive: 'default',
    maintenance: 'warning',
    retired: 'secondary',
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={(status || 'unknown').replace('_', ' ')} />
}

function buildCrewLabel(crewMember, fallback) {
  return crewMember?.fullName || fallback
}

function buildCrewMeta(crewMember) {
  if (!crewMember) {
    return null
  }

  const details = [crewMember.rank, crewMember.employeeCode].filter(Boolean)

  return details.length ? details.join(' · ') : null
}

function buildCompanyLabel(company) {
  return company?.name || 'Not yet updated'
}

function VesselsTable({ vessels, canManageVessels, onView, onEdit, onDelete }) {
  return (
    <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Vessel</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Command</TableCell>
              <TableCell>AMSA UVI</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {vessels.map((vessel) => (
            <TableRow key={vessel.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {vessel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {vessel.vesselCode || 'No vessel code saved'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {(vessel.vesselType || 'other').replace('_', ' ')}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                    Captain
                  </Typography>
                  <Typography variant="body2">
                    {buildCrewLabel(vessel.captain, 'Not yet updated')}
                  </Typography>
                  {buildCrewMeta(vessel.captain) ? (
                    <Typography variant="body2" color="text.secondary">
                      {buildCrewMeta(vessel.captain)}
                    </Typography>
                  ) : null}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                    Line manager
                  </Typography>
                  <Typography variant="body2">
                    {buildCrewLabel(vessel.lineManager, 'Not yet updated')}
                  </Typography>
                  {buildCrewMeta(vessel.lineManager) ? (
                    <Typography variant="body2" color="text.secondary">
                      {buildCrewMeta(vessel.lineManager)}
                    </Typography>
                  ) : null}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {vessel.amsaUvi || 'Not available'}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={vessel.status} />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {buildCompanyLabel(vessel.company)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(vessel.updatedAt || vessel.createdAt)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="View details">
                    <IconButton color="primary" onClick={() => onView(vessel)}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={canManageVessels ? 'Edit vessel' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(vessel)}
                        disabled={!canManageVessels}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={canManageVessels ? 'Delete vessel' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(vessel)}
                        disabled={!canManageVessels}
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default VesselsTable
