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
    on_leave: 'warning',
    retired: 'secondary',
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={(status || 'unknown').replace('_', ' ')} />
}

function formatRole(role) {
  if (!role) {
    return 'No role assigned'
  }

  return role.replace('_', ' ')
}

function CrewMembersTable({ crewMembers, canManageCrewMembers, onView, onEdit, onDelete }) {
  return (
    <TableContainer>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Crew member</TableCell>
            <TableCell>Rank & role</TableCell>
            <TableCell>Assigned vessels</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crewMembers.map((crewMember) => (
            <TableRow key={crewMember.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {crewMember.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {crewMember.employeeCode || 'No employee code'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{crewMember.rank || 'No rank assigned'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatRole(crewMember.role)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {crewMember.assignedVessels?.length || 0} vessel{crewMember.assignedVessels?.length === 1 ? '' : 's'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {crewMember.assignedVessels?.slice(0, 2).map((vessel) => vessel.vesselCode || vessel.name).join(', ') || 'No assignments'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{crewMember.email || 'No email saved'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {crewMember.phone || 'No phone saved'}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={crewMember.status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(crewMember.updatedAt || crewMember.createdAt)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="View details">
                    <IconButton color="primary" onClick={() => onView(crewMember)}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={canManageCrewMembers ? 'Edit crew member' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(crewMember)}
                        disabled={!canManageCrewMembers}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={canManageCrewMembers ? 'Delete crew member' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(crewMember)}
                        disabled={!canManageCrewMembers}
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

export default CrewMembersTable
