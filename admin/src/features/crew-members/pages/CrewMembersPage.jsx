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
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { toast } from 'react-toastify'

import EmptyState from '../../../shared/components/EmptyState'
import PageHeader from '../../../shared/components/PageHeader'
import { formatDateTime } from '../../../shared/utils/format'
import { selectCanManageAdminResources } from '../../auth/authSlice'
import {
  fetchCompanies,
  selectCompanies,
  selectCompaniesStatus,
} from '../../companies/companiesSlice'
import {
  fetchVessels,
  selectVessels,
  selectVesselsStatus,
} from '../../vessels/vesselsSlice'
import CrewMemberDetailsDrawer from '../components/CrewMemberDetailsDrawer'
import CrewMemberFilters from '../components/CrewMemberFilters'
import CrewMemberFormDialog from '../components/CrewMemberFormDialog'
import CrewMembersTable from '../components/CrewMembersTable'
import {
  clearSelectedCrewMember,
  createCrewMember,
  deleteCrewMember,
  fetchCrewMemberDetail,
  fetchCrewMembers,
  selectCrewMembers,
  selectCrewMembersError,
  selectCrewMembersStatus,
  selectSelectedCrewMember,
  selectSelectedCrewMemberError,
  selectSelectedCrewMemberStatus,
  updateCrewMember,
} from '../crewMembersSlice'

function getCrewMemberSearchText(crewMember) {
  return [
    crewMember.fullName,
    crewMember.employeeCode,
    crewMember.email,
    crewMember.phone,
    crewMember.rank,
    crewMember.role,
    ...(crewMember.assignedVessels || []).map((vessel) => vessel.name),
    ...(crewMember.assignedVessels || []).map((vessel) => vessel.vesselCode),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function CrewMembersPage() {
  const dispatch = useDispatch()
  const crewMembers = useSelector(selectCrewMembers)
  const status = useSelector(selectCrewMembersStatus)
  const error = useSelector(selectCrewMembersError)
  const selectedCrewMember = useSelector(selectSelectedCrewMember)
  const detailStatus = useSelector(selectSelectedCrewMemberStatus)
  const detailError = useSelector(selectSelectedCrewMemberError)
  const companies = useSelector(selectCompanies)
  const companiesStatus = useSelector(selectCompaniesStatus)
  const vessels = useSelector(selectVessels)
  const vesselsStatus = useSelector(selectVesselsStatus)
  const canManageResources = useSelector(selectCanManageAdminResources)
  const mutationStatus = useSelector((state) => state.crewMembers.mutationStatus)
  const lastSyncedAt = useSelector((state) => state.crewMembers.lastSyncedAt)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingCrewMember, setEditingCrewMember] = useState(null)
  const [isEditFormLoading, setIsEditFormLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [crewMemberToDelete, setCrewMemberToDelete] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCrewMembers())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (canManageResources && vesselsStatus === 'idle') {
      dispatch(fetchVessels())
    }
  }, [canManageResources, vesselsStatus, dispatch])

  useEffect(() => {
    if (canManageResources && companiesStatus === 'idle') {
      dispatch(fetchCompanies())
    }
  }, [canManageResources, companiesStatus, dispatch])

  const filteredCrewMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return crewMembers.filter((crewMember) => {
      if (normalizedSearch && !getCrewMemberSearchText(crewMember).includes(normalizedSearch)) {
        return false
      }

      if (roleFilter !== 'all' && crewMember.role !== roleFilter) {
        return false
      }

      if (statusFilter !== 'all' && crewMember.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [crewMembers, roleFilter, search, statusFilter])

  const currentPage = Math.min(page, Math.max(Math.ceil(filteredCrewMembers.length / rowsPerPage) - 1, 0))

  const paginatedCrewMembers = useMemo(
    () =>
      filteredCrewMembers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [currentPage, filteredCrewMembers, rowsPerPage],
  )

  const vesselOptions = useMemo(
    () => [...vessels].sort((left, right) => left.name.localeCompare(right.name)),
    [vessels],
  )

  const companyOptions = useMemo(
    () => [...companies].sort((left, right) => left.name.localeCompare(right.name)),
    [companies],
  )

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setRoleFilter('all')
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(fetchCrewMembers())
    if (canManageResources) {
      dispatch(fetchCompanies())
      dispatch(fetchVessels())
    }
  }

  const handleOpenCreate = () => {
    setFormMode('create')
    setEditingCrewMember(null)
    setIsEditFormLoading(false)
    setIsFormOpen(true)
  }

  const handleView = (crewMember) => {
    setIsDetailOpen(true)
    const action = fetchCrewMemberDetail(crewMember.id)
    dispatch(action)
  }

  const handleEdit = async (crewMember) => {
    if (!canManageResources) {
      toast.warning('Only admin users can create or update crew member records.')
      return
    }

    setFormMode('edit')
    setEditingCrewMember(null)
    setIsEditFormLoading(true)
    setIsDetailOpen(false)
    setIsFormOpen(true)

    try {
      const action = fetchCrewMemberDetail(crewMember.id)
      dispatch(action)
      const detailedCrewMember = await action.meta.deferred.promise
      setEditingCrewMember(detailedCrewMember)
      setIsEditFormLoading(false)
    } catch {
      setIsEditFormLoading(false)
      setIsFormOpen(false)
      setEditingCrewMember(null)
      // Errors are handled through Redux and toasts.
    }
  }

  const handleFormSubmit = async (payload) => {
    try {
      if (formMode === 'edit' && editingCrewMember) {
        const action = updateCrewMember({ id: editingCrewMember.id, payload })
        dispatch(action)
        await action.meta.deferred.promise
        toast.success(`${editingCrewMember.fullName} has been updated.`)
      } else {
        const action = createCrewMember(payload)
        dispatch(action)
        await action.meta.deferred.promise
        toast.success('New crew member created successfully.')
      }

      setIsFormOpen(false)
      setEditingCrewMember(null)
      setIsEditFormLoading(false)
    } catch (error) {
      toast.error(
        error?.message || (formMode === 'edit'
          ? 'Unable to update the crew member.'
          : 'Unable to create the crew member.'),
      )
    }
  }

  const handleDeleteRequest = (crewMember) => {
    if (!canManageResources) {
      toast.warning('Only admin users can delete crew member records.')
      return
    }

    setCrewMemberToDelete(crewMember)
  }

  const handleDeleteCrewMember = async () => {
    if (!crewMemberToDelete) {
      return
    }

    try {
      const action = deleteCrewMember(crewMemberToDelete.id)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success(`${crewMemberToDelete.fullName} has been removed.`)
      setCrewMemberToDelete(null)
      setIsDetailOpen(false)
    } catch {
      // Mutation errors are already surfaced through Redux state.
    }
  }

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Crew Members"
        title="Crew Directory"
        description="Review crew availability, assignments, and certification records across the vessel operation."
        action={(
          <Box className="admin-users-toolbar">
            <Button variant="outlined" startIcon={<SyncRoundedIcon />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreate}
              disabled={!canManageResources}
            >
              Add Crew Member
            </Button>
          </Box>
        )}
      />

      {!canManageResources ? (
        <Alert severity="info">
          You are signed in with staff access. Viewing crew lists and details is available, while create, edit, and delete actions stay reserved for admins.
        </Alert>
      ) : null}

      {error ? (
        <Alert severity="error" action={<Button onClick={handleRefresh}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      <Paper className="admin-panel">
        <CrewMemberFilters
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
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setPage(0)
          }}
          onReset={handleResetFilters}
        />
      </Paper>

      <Paper sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <Box className="admin-users-table-header">
          <Box>
            <Typography variant="h5">Crew Table</Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredCrewMembers.length} record{filteredCrewMembers.length === 1 ? '' : 's'}{' '}
              {lastSyncedAt ? `· Last synced ${formatDateTime(lastSyncedAt)}` : ''}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Mutation status: {mutationStatus}
          </Typography>
        </Box>

        {filteredCrewMembers.length ? (
          <>
            <CrewMembersTable
              crewMembers={paginatedCrewMembers}
              canManageCrewMembers={canManageResources}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
            <TablePagination
              component="div"
              count={filteredCrewMembers.length}
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
              icon={<Groups2RoundedIcon sx={{ fontSize: 44 }} />}
              title="No crew members match these filters"
              description="Try widening the search or clearing the current filters to bring more crew records into view."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </Box>
        )}
      </Paper>

      <CrewMemberFormDialog
        open={isFormOpen}
        mode={formMode}
        initialCrewMember={editingCrewMember}
        vessels={vesselOptions}
        companies={companyOptions}
        loading={isEditFormLoading}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCrewMember(null)
          setIsEditFormLoading(false)
        }}
        onSubmit={handleFormSubmit}
        submitting={mutationStatus === 'loading'}
      />

      <CrewMemberDetailsDrawer
        crewMember={selectedCrewMember}
        open={isDetailOpen}
        loading={detailStatus === 'loading'}
        error={detailError}
        onClose={() => {
          setIsDetailOpen(false)
          dispatch(clearSelectedCrewMember())
        }}
        onEdit={handleEdit}
        canManageCrewMembers={canManageResources}
      />

      <Dialog open={Boolean(crewMemberToDelete)} onClose={() => setCrewMemberToDelete(null)}>
        <DialogTitle>Delete Crew Member</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {crewMemberToDelete?.fullName || 'this crew member'}? This also removes linked vessel assignments and captain or line-manager references.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCrewMemberToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCrewMember}
            color="error"
            variant="contained"
            disabled={mutationStatus === 'loading'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CrewMembersPage
