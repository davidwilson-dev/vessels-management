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
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded'
import DomainAddRoundedIcon from '@mui/icons-material/DomainAddRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import { toast } from 'react-toastify'

import EmptyState from '../../../shared/components/EmptyState'
import PageHeader from '../../../shared/components/PageHeader'
import { formatDateTime } from '../../../shared/utils/format'
import { selectCanManageAdminResources } from '../../auth/authSlice'
import CompaniesTable from '../components/CompaniesTable'
import CompanyDetailsDrawer from '../components/CompanyDetailsDrawer'
import CompanyFilters from '../components/CompanyFilters'
import CompanyFormDialog from '../components/CompanyFormDialog'
import {
  clearSelectedCompany,
  createCompany,
  deleteCompany,
  fetchCompanies,
  fetchCompanyDetail,
  selectCompanies,
  selectCompaniesError,
  selectCompaniesStatus,
  selectSelectedCompany,
  selectSelectedCompanyError,
  selectSelectedCompanyStatus,
  updateCompany,
} from '../companiesSlice'

function getCompanySearchText(company) {
  return [
    company.companyCode,
    company.name,
    company.email,
    company.phone,
    company.address,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function CompaniesPage() {
  const dispatch = useDispatch()
  const companies = useSelector(selectCompanies)
  const status = useSelector(selectCompaniesStatus)
  const error = useSelector(selectCompaniesError)
  const selectedCompany = useSelector(selectSelectedCompany)
  const detailStatus = useSelector(selectSelectedCompanyStatus)
  const detailError = useSelector(selectSelectedCompanyError)
  const canManageResources = useSelector(selectCanManageAdminResources)
  const mutationStatus = useSelector((state) => state.companies.mutationStatus)
  const lastSyncedAt = useSelector((state) => state.companies.lastSyncedAt)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingCompany, setEditingCompany] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCompanies())
    }
  }, [dispatch, status])

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return companies.filter((company) => {
      if (normalizedSearch && !getCompanySearchText(company).includes(normalizedSearch)) {
        return false
      }

      if (statusFilter !== 'all' && company.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [companies, search, statusFilter])

  const currentPage = Math.min(page, Math.max(Math.ceil(filteredCompanies.length / rowsPerPage) - 1, 0))

  const paginatedCompanies = useMemo(
    () =>
      filteredCompanies.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [currentPage, filteredCompanies, rowsPerPage],
  )

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(fetchCompanies())
  }

  const handleOpenCreate = () => {
    setFormMode('create')
    setEditingCompany(null)
    setIsFormOpen(true)
  }

  const handleView = (company) => {
    setIsDetailOpen(true)
    const action = fetchCompanyDetail(company.id)
    dispatch(action)
  }

  const handleEdit = async (company) => {
    if (!canManageResources) {
      toast.warning('Only admin users can create or update company records.')
      return
    }

    try {
      const action = fetchCompanyDetail(company.id)
      dispatch(action)
      const detailedCompany = await action.meta.deferred.promise
      setEditingCompany(detailedCompany)
      setFormMode('edit')
      setIsDetailOpen(false)
      setIsFormOpen(true)
    } catch (submitError) {
      toast.error(submitError?.message || 'Unable to load the company details.')
    }
  }

  const handleFormSubmit = async (payload) => {
    try {
      if (formMode === 'edit' && editingCompany) {
        const action = updateCompany({ id: editingCompany.id, payload })
        dispatch(action)
        await action.meta.deferred.promise
        toast.success(`${editingCompany.name} has been updated.`)
      } else {
        const action = createCompany(payload)
        dispatch(action)
        await action.meta.deferred.promise
        toast.success('New company created successfully.')
      }

      setIsFormOpen(false)
      setEditingCompany(null)
    } catch (submitError) {
      toast.error(
        submitError?.message || (formMode === 'edit'
          ? 'Unable to update the company.'
          : 'Unable to create the company.'),
      )
    }
  }

  const handleDeleteRequest = (company) => {
    if (!canManageResources) {
      toast.warning('Only admin users can delete company records.')
      return
    }

    setCompanyToDelete(company)
  }

  const handleDeleteCompany = async () => {
    if (!companyToDelete) {
      return
    }

    try {
      const action = deleteCompany(companyToDelete.id)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success(`${companyToDelete.name} has been removed.`)
      setCompanyToDelete(null)
      setIsDetailOpen(false)
    } catch (deleteError) {
      toast.error(deleteError?.message || 'Unable to remove the company.')
    }
  }

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Companies"
        title="Company Directory"
        description="Manage ownership records and keep vessel and crew company links aligned from one place."
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
              Add Company
            </Button>
          </Box>
        )}
      />

      {!canManageResources ? (
        <Alert severity="info">
          You are signed in with staff access. Viewing company lists and details is available, while create, edit, and delete actions stay reserved for admins.
        </Alert>
      ) : null}

      {error ? (
        <Alert severity="error" action={<Button onClick={handleRefresh}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      <Paper className="admin-panel">
        <CompanyFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
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
            <Typography variant="h5">Company Table</Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredCompanies.length} record{filteredCompanies.length === 1 ? '' : 's'}{' '}
              {lastSyncedAt ? `· Last synced ${formatDateTime(lastSyncedAt)}` : ''}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Mutation status: {mutationStatus}
          </Typography>
        </Box>

        {status === 'loading' && !companies.length ? (
          <Box className="admin-users-empty-wrap">
            <EmptyState
              icon={<SyncRoundedIcon sx={{ fontSize: 44 }} />}
              title="Loading companies"
              description="Fetching the latest company records for the directory."
            />
          </Box>
        ) : filteredCompanies.length ? (
          <>
            <CompaniesTable
              companies={paginatedCompanies}
              canManageCompanies={canManageResources}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
            <TablePagination
              component="div"
              count={filteredCompanies.length}
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
              icon={<ApartmentRoundedIcon sx={{ fontSize: 44 }} />}
              title="No companies match these filters"
              description="Try widening the search or clearing the current filters to bring more company records into view."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </Box>
        )}
      </Paper>

      <CompanyFormDialog
        open={isFormOpen}
        mode={formMode}
        initialCompany={editingCompany}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCompany(null)
        }}
        onSubmit={handleFormSubmit}
        submitting={mutationStatus === 'loading'}
      />

      <CompanyDetailsDrawer
        company={selectedCompany}
        open={isDetailOpen}
        loading={detailStatus === 'loading'}
        error={detailError}
        onClose={() => {
          setIsDetailOpen(false)
          dispatch(clearSelectedCompany())
        }}
        onEdit={handleEdit}
        canManageCompanies={canManageResources}
      />

      <Dialog open={Boolean(companyToDelete)} onClose={() => setCompanyToDelete(null)}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {companyToDelete?.name || 'this company'}? This also removes linked ownership relations from vessels and crew members.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCompany}
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

export default CompaniesPage
