import {
  Avatar,
  Box,
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
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'

import StatusBadge from '../../../shared/components/StatusBadge'
import { buildDisplayName, formatDate, getInitials, getUserPosition } from '../../../shared/utils/format'

function UsersTable({ users, canManageUsers, onView, onEdit, onLock, onDelete }) {
  return (
    <TableContainer>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={user.profile?.avatarUrl || undefined}>
                    {getInitials(buildDisplayName(user))}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {buildDisplayName(user)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{getUserPosition(user)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.profile?.phoneNumber || 'No phone yet'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.profile?.address || 'No address saved'}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusBadge user={user} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="View details">
                    <IconButton color="primary" onClick={() => onView(user)}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={canManageUsers ? 'Edit user' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(user)}
                        disabled={!canManageUsers}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={
                      canManageUsers
                        ? user.isActive
                          ? 'Lock access'
                          : 'User already locked'
                        : 'Admin permission required'
                    }
                  >
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => onLock(user)}
                        disabled={canManageUsers && !user.isActive}
                      >
                        <LockPersonRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={canManageUsers ? 'Delete user' : 'Admin permission required'}>
                    <IconButton color="error" onClick={() => onDelete(user)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
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

export default UsersTable
