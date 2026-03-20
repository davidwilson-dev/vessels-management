import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import { toast } from 'react-toastify'

import EmptyState from '../../../shared/components/EmptyState'
import MetricCard from '../../../shared/components/MetricCard'
import PageHeader from '../../../shared/components/PageHeader'
import { selectCanManageUsers } from '../../auth/authSlice'
import UserDetailsDrawer from '../components/UserDetailsDrawer'
import UserFilters from '../components/UserFilters'
import UserFormDialog from '../components/UserFormDialog'
import UsersTable from '../components/UsersTable'
import {
  createUser,
  deleteUser,
  fetchUsers,
  lockUser,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
  updateUser,
} from '../usersSlice'
import {
  buildDisplayName,
  compareByNewest,
  formatDateTime,
  getUserGender,
  getUserPosition,
  getUserSearchText,
} from '../../../shared/utils/format'

function UsersPage() {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const status = useSelector(selectUsersStatus)
  const error = useSelector(selectUsersError)
  const canManageUsers = useSelector(selectCanManageUsers)
  const mutationStatus = useSelector((state) => state.users.mutationStatus)
  const lastSyncedAt = useSelector((state) => state.users.lastSyncedAt)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formMode, setFormMode] = useState('create')
  const [editingUser, setEditingUser] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userToLock, setUserToLock] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, status])

  const positionOptions = useMemo(
    () =>
      Array.from(new Set(users.map((user) => getUserPosition(user))))
        .filter((position) => position && position !== 'Unassigned')
        .sort(),
    [users],
  )

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users
      .filter((user) => {
        if (normalizedSearch && !getUserSearchText(user).includes(normalizedSearch)) {
          return false
        }

        if (roleFilter !== 'all' && user.role !== roleFilter) {
          return false
        }

        if (genderFilter !== 'all' && getUserGender(user) !== genderFilter) {
          return false
        }

        if (positionFilter !== 'all' && getUserPosition(user) !== positionFilter) {
          return false
        }

        if (statusFilter === 'active' && !user.isActive) {
          return false
        }

        if (statusFilter === 'locked' && user.isActive) {
          return false
        }

        if (statusFilter === 'verified' && !user.emailVerified) {
          return false
        }

        if (statusFilter === 'attention' && user.isActive && user.emailVerified) {
          return false
        }

        return true
      })
      .sort(compareByNewest)
  }, [genderFilter, positionFilter, roleFilter, search, statusFilter, users])

  const currentPage = Math.min(
    page,
    Math.max(Math.ceil(filteredUsers.length / rowsPerPage) - 1, 0),
  )

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [currentPage, filteredUsers, rowsPerPage],
  )

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setRoleFilter('all')
    setGenderFilter('all')
    setPositionFilter('all')
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(fetchUsers())
  }

  const handleCreateOpen = () => {
    setFormMode('create')
    setEditingUser(null)
    setIsFormOpen(true)
    setPage(0)
  }

  const handleEditOpen = (user) => {
    setFormMode('edit')
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    try {
      if (formMode === 'edit' && editingUser) {
        const action = updateUser({ id: editingUser.id, payload })
        dispatch(action)
        await action.meta.deferred.promise
        toast.success(`${buildDisplayName(editingUser)} has been updated.`)
      } else {
        const action = createUser(payload)
        dispatch(action)
        await action.meta.deferred.promise
        toast.success('New staff user created successfully.')
      }

      setIsFormOpen(false)
      setEditingUser(null)
    } catch {
      // Mutation errors are already surfaced through Redux state.
    }
  }

  const handleLockRequest = (user) => {
    if (!canManageUsers) {
      toast.warning('Only admin users can lock user accounts.')
      return
    }

    if (!user.isActive) {
      toast.info(`${buildDisplayName(user)} is already locked.`)
      return
    }

    setUserToLock(user)
  }

  const handleDeleteRequest = (user) => {
    if (!canManageUsers) {
      toast.warning('Only admin users can delete user accounts.')
      return
    }

    setUserToDelete(user)
  }

  const handleLockUser = async () => {
    if (!userToLock) {
      return
    }

    try {
      const action = lockUser(userToLock.id)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success(`${buildDisplayName(userToLock)} has been locked.`)
      setUserToLock(null)
    } catch {
      // Mutation errors are already surfaced through Redux state.
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return
    }

    try {
      const action = deleteUser(userToDelete.id)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success(`${buildDisplayName(userToDelete)} has been removed.`)
      setUserToDelete(null)
    } catch {
      // Mutation errors are already surfaced through Redux state.
    }
  }

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Manager Users"
        title="Admin User Directory"
        description="Review user records, update access, and keep the people-side interface consistent with the planned manager-vessels experience."
        action={
          <Box className="admin-users-toolbar">
            <Button variant="outlined" startIcon={<SyncRoundedIcon />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleCreateOpen}
              disabled={!canManageUsers}
            >
              Add User
            </Button>
          </Box>
        }
      />

      {!canManageUsers ? (
        <Alert severity="info">
          You are signed in with staff access. Viewing records is available, while create, edit, lock, and delete actions stay reserved for admins.
        </Alert>
      ) : null}

      {error ? (
        <Alert severity="error" action={<Button onClick={handleRefresh}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      <Paper className="admin-panel">
        <UserFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(0)
          }}
          roleFilter={roleFilter}
          onRoleChange={(value) => {
            setRoleFilter(value)
            setPage(0)
          }}
          genderFilter={genderFilter}
          onGenderChange={(value) => {
            setGenderFilter(value)
            setPage(0)
          }}
          positionFilter={positionFilter}
          onPositionChange={(value) => {
            setPositionFilter(value)
            setPage(0)
          }}
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setPage(0)
          }}
          positionOptions={positionOptions}
          onReset={handleResetFilters}
        />
      </Paper>

      <Paper sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <Box className="admin-users-table-header">
          <Box>
            <Typography variant="h5">User Table</Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredUsers.length} record{filteredUsers.length === 1 ? '' : 's'}{' '}
              {lastSyncedAt ? `· Last synced ${formatDateTime(lastSyncedAt)}` : ''}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Mutation status: {mutationStatus}
          </Typography>
        </Box>

        {filteredUsers.length ? (
          <>
            <UsersTable
              users={paginatedUsers}
              canManageUsers={canManageUsers}
              onView={setSelectedUser}
              onEdit={handleEditOpen}
              onLock={handleLockRequest}
              onDelete={handleDeleteRequest}
            />
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={currentPage}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value))
                setPage(0)
              }}
              rowsPerPageOptions={[5, 8, 10, 20]}
            />
          </>
        ) : (
          <Box className="admin-users-empty-wrap">
            <EmptyState
              icon={<LockPersonRoundedIcon sx={{ fontSize: 44 }} />}
              title="No users match these filters"
              description="Try widening the search or clearing the current filters to bring more records back into view."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </Box>
        )}
      </Paper>

      <UserFormDialog
        open={isFormOpen}
        mode={formMode}
        initialUser={editingUser}
        onClose={() => {
          setIsFormOpen(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        submitting={mutationStatus === 'loading'}
      />

      <UserDetailsDrawer
        user={selectedUser}
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onEdit={(user) => {
          setSelectedUser(null)
          handleEditOpen(user)
        }}
        canManageUsers={canManageUsers}
      />

      <Dialog open={Boolean(userToDelete)} onClose={() => setUserToDelete(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {userToDelete ? buildDisplayName(userToDelete) : 'this user'}? This also removes the linked profile record.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={mutationStatus === 'loading'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(userToLock)} onClose={() => setUserToLock(null)}>
        <DialogTitle>Lock User Access</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to lock {userToLock ? buildDisplayName(userToLock) : 'this user'}? They will no longer be able to access the platform until an admin re-enables the account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToLock(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleLockUser}
            color="warning"
            variant="contained"
            disabled={mutationStatus === 'loading'}
          >
            Lock User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UsersPage
