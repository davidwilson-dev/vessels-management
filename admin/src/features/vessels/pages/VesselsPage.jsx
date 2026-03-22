import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded'
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded'
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { toast } from 'react-toastify'

import EmptyState from '../../../shared/components/EmptyState'
import PageHeader from '../../../shared/components/PageHeader'
import { formatDateTime } from '../../../shared/utils/format'
import {
  selectCanManageAdminResources,
} from '../../auth/authSlice'
import {
  fetchCompanies,
  selectCompanies,
  selectCompaniesStatus,
} from '../../companies/companiesSlice'
import VesselDetailsDrawer from '../components/VesselDetailsDrawer'
import VesselFilters from '../components/VesselFilters'
import VesselFormDialog from '../components/VesselFormDialog'
import VesselsTable from '../components/VesselsTable'
import {
  clearSelectedVessel,
  createVessel,
  deleteVessel,
  fetchVesselDetail,
  fetchVessels,
  selectSelectedVessel,
  selectSelectedVesselError,
  selectSelectedVesselStatus,
  selectVessels,
  selectVesselsError,
  selectVesselsStatus,
  updateVessel,
} from '../vesselsSlice'

function getVesselSearchText(vessel) {
  return [
    vessel.vesselCode,
    vessel.name,
    vessel.officialNumber,
    vessel.imoNumber,
    vessel.amsaUvi,
    vessel.homePort,
    vessel.company?.name,
    vessel.company?.companyCode,
    vessel.captain?.fullName,
    vessel.lineManager?.fullName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function VesselsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedVesselId = searchParams.get('selected')
  const vessels = useSelector(selectVessels)
  const status = useSelector(selectVesselsStatus)
  const error = useSelector(selectVesselsError)
  const selectedVessel = useSelector(selectSelectedVessel)
  const detailStatus = useSelector(selectSelectedVesselStatus)
  const detailError = useSelector(selectSelectedVesselError)
  const companies = useSelector(selectCompanies)
  const companiesStatus = useSelector(selectCompaniesStatus)
  const canManageResources = useSelector(selectCanManageAdminResources)
  const mutationStatus = useSelector((state) => state.vessels.mutationStatus)
  const lastSyncedAt = useSelector((state) => state.vessels.lastSyncedAt)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [formMode, setFormMode] = useState('create')
  const [editingVessel, setEditingVessel] = useState(null)
  const [isEditFormLoading, setIsEditFormLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [vesselToDelete, setVesselToDelete] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVessels())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (canManageResources && companiesStatus === 'idle') {
      dispatch(fetchCompanies())
    }
  }, [canManageResources, companiesStatus, dispatch])

  useEffect(() => {
    if (!selectedVesselId) {
      dispatch(clearSelectedVessel())
      return
    }

    const action = fetchVesselDetail(selectedVesselId)
    dispatch(action)
  }, [dispatch, selectedVesselId])

  const filteredVessels = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return vessels.filter((vessel) => {
      if (normalizedSearch && !getVesselSearchText(vessel).includes(normalizedSearch)) {
        return false
      }

      if (typeFilter !== 'all' && vessel.vesselType !== typeFilter) {
        return false
      }

      if (statusFilter !== 'all' && vessel.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [search, statusFilter, typeFilter, vessels])

  const currentPage = Math.min(page, Math.max(Math.ceil(filteredVessels.length / rowsPerPage) - 1, 0))

  const paginatedVessels = useMemo(
    () =>
      filteredVessels.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [currentPage, filteredVessels, rowsPerPage],
  )

  const companyOptions = useMemo(
    () => [...companies].sort((left, right) => left.name.localeCompare(right.name)),
    [companies],
  )

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setTypeFilter('all')
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(fetchVessels())
    if (canManageResources) {
      dispatch(fetchCompanies())
    }
  }

  const handleOpenCreate = () => {
    if (selectedVesselId) {
      navigate('/vessels')
    }

    setFormMode('create')
    setEditingVessel(null)
    setIsEditFormLoading(false)
    setIsFormOpen(true)
  }

  const handleView = (vessel) => {
    navigate(`/vessels?selected=${vessel.id}`)
  }

  const handleEdit = async (vessel) => {
    if (!canManageResources) {
      toast.warning('Only admin users can create or update vessel records.')
      return
    }

    setFormMode('edit')
    setEditingVessel(null)
    setIsEditFormLoading(true)
    setIsFormOpen(true)

    try {
      const action = fetchVesselDetail(vessel.id)
      dispatch(action)
      const detailedVessel = await action.meta.deferred.promise
      setEditingVessel(detailedVessel)
      setIsEditFormLoading(false)
    } catch {
      setIsEditFormLoading(false)
      setIsFormOpen(false)
      setEditingVessel(null)
      // Errors are handled through Redux and toasts.
    }
  }

  const handleFormSubmit = async (payload) => {
    try {
      if (formMode === 'edit' && editingVessel) {
        const action = updateVessel({ id: editingVessel.id, payload })
        dispatch(action)
        await action.meta.deferred.promise
        toast.success(`${editingVessel.name} has been updated.`)
      } else {
        const action = createVessel(payload)
        dispatch(action)
        const createdVessel = await action.meta.deferred.promise
        toast.success('New vessel created successfully.')
        navigate(`/vessels?selected=${createdVessel.id}`)
      }

      setIsFormOpen(false)
      setEditingVessel(null)
      setIsEditFormLoading(false)
    } catch (error) {
      toast.error(
        error?.message || (formMode === 'edit'
          ? 'Unable to update the vessel.'
          : 'Unable to create the vessel.'),
      )
    }
  }

  const handleDeleteRequest = (vessel) => {
    if (!canManageResources) {
      toast.warning('Only admin users can delete vessel records.')
      return
    }

    setVesselToDelete(vessel)
  }

  const handleDeleteVessel = async () => {
    if (!vesselToDelete) {
      return
    }

    try {
      const action = deleteVessel(vesselToDelete.id)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success(`${vesselToDelete.name} has been removed.`)
      setVesselToDelete(null)
      if (selectedVesselId === vesselToDelete.id) {
        navigate('/vessels', { replace: true })
      }
    } catch {
      // Mutation errors are already surfaced through Redux state.
    }
  }

  const isDetailOpen = Boolean(selectedVesselId) && !isFormOpen

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Fleet Vessels"
        title="Vessel Register"
        description="Track vessel identity, command assignments, and operational readiness across the fleet."
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
              Add Vessel
            </Button>
          </Box>
        )}
      />

      {!canManageResources ? (
        <Alert severity="info">
          You are signed in with staff access. Viewing vessel lists and details is available, while create, edit, and delete actions stay reserved for admins.
        </Alert>
      ) : null}

      {error ? (
        <Alert severity="error" action={<Button onClick={handleRefresh}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      <Paper className="admin-panel">
        <VesselFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(0)
          }}
          typeFilter={typeFilter}
          onTypeChange={(value) => {
            setTypeFilter(value)
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
            <Typography variant="h5">Vessel Table</Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredVessels.length} record{filteredVessels.length === 1 ? '' : 's'}{' '}
              {lastSyncedAt ? `· Last synced ${formatDateTime(lastSyncedAt)}` : ''}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Mutation status: {mutationStatus}
          </Typography>
        </Box>

        {status === 'loading' && !vessels.length ? (
          <Box className="admin-users-empty-wrap">
            <EmptyState
              icon={<SyncRoundedIcon sx={{ fontSize: 44 }} />}
              title="Loading vessels"
              description="Fetching the latest vessel records for the register."
            />
          </Box>
        ) : filteredVessels.length ? (
          <>
            <VesselsTable
              vessels={paginatedVessels}
              canManageVessels={canManageResources}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
            <TablePagination
              component="div"
              count={filteredVessels.length}
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
              icon={<SailingRoundedIcon sx={{ fontSize: 44 }} />}
              title="No vessels match these filters"
              description="Try widening the search or clearing the current filters to bring more vessel records into view."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </Box>
        )}
      </Paper>

      <VesselFormDialog
        key={`${formMode}-${editingVessel?.id || 'new'}-${isFormOpen ? 'open' : 'closed'}`}
        open={isFormOpen}
        mode={formMode}
        initialVessel={editingVessel}
        companies={companyOptions}
        loading={isEditFormLoading}
        onClose={() => {
          setIsFormOpen(false)
          setEditingVessel(null)
          setIsEditFormLoading(false)
        }}
        onSubmit={handleFormSubmit}
        submitting={mutationStatus === 'loading'}
      />

      <VesselDetailsDrawer
        vessel={selectedVessel}
        open={isDetailOpen}
        loading={detailStatus === 'loading'}
        error={detailError}
        onClose={() => {
          navigate('/vessels')
        }}
        onEdit={handleEdit}
        canManageVessels={canManageResources}
      />

      <Dialog open={Boolean(vesselToDelete)} onClose={() => setVesselToDelete(null)}>
        <DialogTitle>Delete Vessel</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {vesselToDelete?.name || 'this vessel'}? This also removes linked crew assignments, onboard device records, and vessel references from crew records.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVesselToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteVessel}
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

export default VesselsPage
