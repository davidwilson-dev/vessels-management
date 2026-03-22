import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

import MetricCard from '../../../shared/components/MetricCard'
import PageHeader from '../../../shared/components/PageHeader'
import {
  buildDisplayName,
  compareByNewest,
  formatDate,
  getUserPosition,
} from '../../../shared/utils/format'
import {
  fetchCompanies,
  selectCompanies,
  selectCompaniesError,
  selectCompaniesStatus,
} from '../../companies/companiesSlice'
import {
  fetchCrewMembers,
  selectCrewMembers,
  selectCrewMembersError,
  selectCrewMembersStatus,
} from '../../crew-members/crewMembersSlice'
import {
  fetchUsers,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
} from '../../users/usersSlice'
import {
  fetchVessels,
  selectVessels,
  selectVesselsError,
  selectVesselsStatus,
} from '../../vessels/vesselsSlice'

function calculatePercent(part, total) {
  return total ? Math.round((part / total) * 100) : 0
}

function formatStatusLabel(value) {
  return (value || 'unknown').replaceAll('_', ' ')
}

function getMetricValue(status, value) {
  return status === 'idle' || status === 'loading' ? '...' : value
}

function SummaryTile({ title, description, stats, to, actionLabel }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid rgba(15, 39, 66, 0.08)',
        backgroundColor: 'rgba(15, 39, 66, 0.03)',
      }}
    >
      <Box className="admin-list__row" sx={{ alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body2" className="admin-panel__muted">
            {description}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to={to}
          size="small"
          endIcon={<ArrowForwardRoundedIcon />}
        >
          {actionLabel}
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
              {stat.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function RecentRecord({ label, title, subtitle, createdAt, to }) {
  return (
    <Box className="admin-list__item">
      <Box className="admin-list__row" sx={{ alignItems: 'flex-start', gap: 1.5 }}>
        <Box className="admin-list__meta">
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            {label}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body2" className="admin-panel__muted">
            {subtitle}
          </Typography>
        </Box>
        <Button component={RouterLink} to={to} size="small">
          Open
        </Button>
      </Box>
      <Typography variant="body2" className="admin-list__date">
        Created {formatDate(createdAt)}
      </Typography>
    </Box>
  )
}

function DashboardPage() {
  const dispatch = useDispatch()

  const users = useSelector(selectUsers)
  const usersStatus = useSelector(selectUsersStatus)
  const usersError = useSelector(selectUsersError)

  const vessels = useSelector(selectVessels)
  const vesselsStatus = useSelector(selectVesselsStatus)
  const vesselsError = useSelector(selectVesselsError)

  const companies = useSelector(selectCompanies)
  const companiesStatus = useSelector(selectCompaniesStatus)
  const companiesError = useSelector(selectCompaniesError)

  const crewMembers = useSelector(selectCrewMembers)
  const crewMembersStatus = useSelector(selectCrewMembersStatus)
  const crewMembersError = useSelector(selectCrewMembersError)

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  useEffect(() => {
    if (vesselsStatus === 'idle') {
      dispatch(fetchVessels())
    }
  }, [dispatch, vesselsStatus])

  useEffect(() => {
    if (companiesStatus === 'idle') {
      dispatch(fetchCompanies())
    }
  }, [dispatch, companiesStatus])

  useEffect(() => {
    if (crewMembersStatus === 'idle') {
      dispatch(fetchCrewMembers())
    }
  }, [dispatch, crewMembersStatus])

  const dashboardData = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.isActive).length
    const verifiedUsers = users.filter((user) => user.emailVerified).length
    const attentionUsers = users.filter((user) => !user.isActive || !user.emailVerified)
    const completeProfiles = users.filter(
      (user) => user.profile?.position && user.profile?.phoneNumber && user.profile?.address,
    ).length

    const totalVessels = vessels.length
    const activeVessels = vessels.filter((vessel) => vessel.status === 'active').length
    const maintenanceVessels = vessels.filter((vessel) => vessel.status === 'maintenance').length
    const companyLinkedVessels = vessels.filter((vessel) => vessel.company?.id).length
    const nonReadyVessels = vessels.filter((vessel) => vessel.status !== 'active')

    const totalCompanies = companies.length
    const activeCompanies = companies.filter((company) => company.status === 'active').length
    const nonActiveCompanies = companies.filter((company) => company.status !== 'active')

    const totalCrewMembers = crewMembers.length
    const activeCrewMembers = crewMembers.filter((crewMember) => crewMember.status === 'active').length
    const assignedCrewMembers = crewMembers.filter(
      (crewMember) => (crewMember.assignedVessels?.length ?? 0) > 0,
    ).length
    const leadershipCrewMembers = crewMembers.filter(
      (crewMember) => crewMember.role === 'captain' || crewMember.role === 'line_manager',
    ).length
    const unavailableCrewMembers = crewMembers.filter((crewMember) => crewMember.status !== 'active')

    const newestUsers = [...users].sort(compareByNewest).slice(0, 1)
    const newestVessels = [...vessels].sort(compareByNewest).slice(0, 1)
    const newestCompanies = [...companies].sort(compareByNewest).slice(0, 1)
    const newestCrewMembers = [...crewMembers].sort(compareByNewest).slice(0, 1)

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      attentionUsers,
      completeProfiles,
      totalVessels,
      activeVessels,
      maintenanceVessels,
      companyLinkedVessels,
      nonReadyVessels,
      totalCompanies,
      activeCompanies,
      nonActiveCompanies,
      totalCrewMembers,
      activeCrewMembers,
      assignedCrewMembers,
      leadershipCrewMembers,
      unavailableCrewMembers,
      newestUsers,
      newestVessels,
      newestCompanies,
      newestCrewMembers,
    }
  }, [companies, crewMembers, users, vessels])

  const loading = [usersStatus, vesselsStatus, companiesStatus, crewMembersStatus].some(
    (value) => value === 'loading',
  )

  const errors = [
    {
      key: 'users',
      label: 'users',
      message: usersError,
      retry: () => dispatch(fetchUsers()),
    },
    {
      key: 'vessels',
      label: 'vessels',
      message: vesselsError,
      retry: () => dispatch(fetchVessels()),
    },
    {
      key: 'companies',
      label: 'companies',
      message: companiesError,
      retry: () => dispatch(fetchCompanies()),
    },
    {
      key: 'crew',
      label: 'crew members',
      message: crewMembersError,
      retry: () => dispatch(fetchCrewMembers()),
    },
  ].filter((item) => item.message)

  const readinessItems = [
    {
      label: 'User verification',
      value: calculatePercent(dashboardData.verifiedUsers, dashboardData.totalUsers),
    },
    {
      label: 'Fleet availability',
      value: calculatePercent(dashboardData.activeVessels, dashboardData.totalVessels),
    },
    {
      label: 'Company activation',
      value: calculatePercent(dashboardData.activeCompanies, dashboardData.totalCompanies),
    },
    {
      label: 'Crew assignment',
      value: calculatePercent(dashboardData.assignedCrewMembers, dashboardData.totalCrewMembers),
    },
  ]

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Command Deck"
        title="Operations Overview"
        description="Track the current picture across users, vessels, companies, and crew from one dashboard before diving into each register."
        action={
          <Button
            component={RouterLink}
            to="/vessels"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Open Vessel Register
          </Button>
        }
      />

      {loading ? <LinearProgress /> : null}

      {errors.map((item) => (
        <Alert
          key={item.key}
          severity="error"
          action={<Button onClick={item.retry}>Retry</Button>}
        >
          Unable to load {item.label}: {item.message}
        </Alert>
      ))}

      <Box className="admin-grid admin-grid--metrics">
        <MetricCard
          title="Users"
          value={getMetricValue(usersStatus, dashboardData.totalUsers)}
          caption="Admin, staff, and guest accounts in the workspace."
          icon={<PeopleAltRoundedIcon />}
        />
        <MetricCard
          title="Vessels"
          value={getMetricValue(vesselsStatus, dashboardData.totalVessels)}
          caption="Fleet records currently tracked in the register."
          icon={<SailingRoundedIcon />}
          tone="secondary"
        />
        <MetricCard
          title="Companies"
          value={getMetricValue(companiesStatus, dashboardData.totalCompanies)}
          caption="Operating companies linked to vessels and crew."
          icon={<ApartmentRoundedIcon />}
          tone="success"
        />
        <MetricCard
          title="Crew"
          value={getMetricValue(crewMembersStatus, dashboardData.totalCrewMembers)}
          caption="Crew profiles available for assignments and leadership."
          icon={<Groups2RoundedIcon />}
          tone="warning"
        />
      </Box>

      <Box className="admin-grid admin-grid--main">
        <Paper className="admin-panel admin-panel--hero">
          <Box className="admin-page-header">
            <Box className="admin-page-header__content">
              <Typography component="span" className="admin-panel__eyebrow admin-panel__eyebrow--light">
                Operations Snapshot
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Keep people, vessels, companies, and crew aligned.
              </Typography>
              <Typography variant="body1" className="admin-panel__copy--light">
                This overview combines fleet readiness, staffing coverage, company activity, and account health so the admin team can spot gaps before they become operational issues.
              </Typography>
            </Box>
            <Box className="admin-chip-row admin-chip-row--end">
              <Chip label={`${dashboardData.activeVessels} active vessels`} className="admin-chip-light" />
              <Chip label={`${dashboardData.activeCrewMembers} active crew`} className="admin-chip-light" />
              <Chip label={`${dashboardData.activeCompanies} active companies`} className="admin-chip-light" />
              <Chip label={`${dashboardData.verifiedUsers} verified users`} className="admin-chip-light" />
            </Box>
          </Box>

          <Box className="admin-progress-grid" sx={{ mt: 3 }}>
            {readinessItems.map((item) => (
              <Box key={item.label}>
                <Box className="admin-progress-row">
                  <Typography variant="body2" className="admin-panel__muted--light">
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle2">{item.value}%</Typography>
                </Box>
                <LinearProgress value={item.value} variant="determinate" color="secondary" />
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper className="admin-panel">
          <Box className="admin-page-stack" sx={{ gap: 2.5 }}>
            <Box className="admin-list__row">
              <Typography variant="h5">Operational Watchlist</Typography>
              {loading ? <Chip label="Refreshing" color="secondary" /> : null}
            </Box>

            <Box className="admin-list">
              {[
                {
                  label: 'User follow-up',
                  value: dashboardData.attentionUsers.length,
                  description: 'accounts locked or still waiting for verification',
                  icon: <WarningAmberRoundedIcon color="warning" />,
                },
                {
                  label: 'Fleet exceptions',
                  value: dashboardData.nonReadyVessels.length,
                  description: 'vessels not currently marked active',
                  icon: <SailingRoundedIcon color="secondary" />,
                },
                {
                  label: 'Company follow-up',
                  value: dashboardData.nonActiveCompanies.length,
                  description: 'company records currently outside active status',
                  icon: <ApartmentRoundedIcon color="action" />,
                },
                {
                  label: 'Crew unavailable',
                  value: dashboardData.unavailableCrewMembers.length,
                  description: 'crew members not currently in active status',
                  icon: <Groups2RoundedIcon color="action" />,
                },
              ].map((item) => (
                <Box key={item.label} className="admin-list__item">
                  <Box className="admin-list__row" sx={{ gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {item.icon}
                      <Box className="admin-list__meta">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" className="admin-panel__muted">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box className="admin-grid admin-grid--bottom">
        <Paper className="admin-panel">
          <Box className="admin-page-stack" sx={{ gap: 2.5 }}>
            <Typography variant="h5">Domain Summaries</Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <SummaryTile
                title="Users"
                description="Monitor sign-in readiness and profile completeness."
                to="/users"
                actionLabel="Open Users"
                stats={[
                  { label: 'Active', value: dashboardData.activeUsers },
                  { label: 'Verified', value: dashboardData.verifiedUsers },
                  { label: 'Profiles', value: dashboardData.completeProfiles },
                ]}
              />
              <SummaryTile
                title="Vessels"
                description="Track command coverage and fleet status at a glance."
                to="/vessels"
                actionLabel="Open Vessels"
                stats={[
                  { label: 'Active', value: dashboardData.activeVessels },
                  { label: 'Maintain', value: dashboardData.maintenanceVessels },
                  { label: 'Company', value: dashboardData.companyLinkedVessels },
                ]}
              />
              <SummaryTile
                title="Companies"
                description="See which operating companies are active in the system."
                to="/companies"
                actionLabel="Open Companies"
                stats={[
                  { label: 'Active', value: dashboardData.activeCompanies },
                  { label: 'Non-active', value: dashboardData.nonActiveCompanies.length },
                  { label: 'Total', value: dashboardData.totalCompanies },
                ]}
              />
              <SummaryTile
                title="Crew"
                description="Check assignment coverage and leadership availability."
                to="/crew-members"
                actionLabel="Open Crew"
                stats={[
                  { label: 'Active', value: dashboardData.activeCrewMembers },
                  { label: 'Assigned', value: dashboardData.assignedCrewMembers },
                  { label: 'Leadership', value: dashboardData.leadershipCrewMembers },
                ]}
              />
            </Box>
          </Box>
        </Paper>

        <Paper className="admin-panel">
          <Box className="admin-page-stack" sx={{ gap: 2.5 }}>
            <Typography variant="h5">Recent Records</Typography>

            <Box className="admin-list">
              {dashboardData.newestUsers[0] ? (
                <RecentRecord
                  label="Newest user"
                  title={buildDisplayName(dashboardData.newestUsers[0])}
                  subtitle={getUserPosition(dashboardData.newestUsers[0])}
                  createdAt={dashboardData.newestUsers[0].createdAt}
                  to="/users"
                />
              ) : null}

              {dashboardData.newestVessels[0] ? (
                <RecentRecord
                  label="Newest vessel"
                  title={dashboardData.newestVessels[0].name || 'Unnamed vessel'}
                  subtitle={[
                    dashboardData.newestVessels[0].vesselCode,
                    formatStatusLabel(dashboardData.newestVessels[0].status),
                  ].filter(Boolean).join(' · ')}
                  createdAt={dashboardData.newestVessels[0].createdAt}
                  to="/vessels"
                />
              ) : null}

              {dashboardData.newestCompanies[0] ? (
                <RecentRecord
                  label="Newest company"
                  title={dashboardData.newestCompanies[0].name || 'Unnamed company'}
                  subtitle={[
                    dashboardData.newestCompanies[0].companyCode,
                    formatStatusLabel(dashboardData.newestCompanies[0].status),
                  ].filter(Boolean).join(' · ')}
                  createdAt={dashboardData.newestCompanies[0].createdAt}
                  to="/companies"
                />
              ) : null}

              {dashboardData.newestCrewMembers[0] ? (
                <RecentRecord
                  label="Newest crew member"
                  title={dashboardData.newestCrewMembers[0].fullName || 'Unnamed crew member'}
                  subtitle={[
                    dashboardData.newestCrewMembers[0].role
                      ? formatStatusLabel(dashboardData.newestCrewMembers[0].role)
                      : null,
                    dashboardData.newestCrewMembers[0].rank,
                  ].filter(Boolean).join(' · ')}
                  createdAt={dashboardData.newestCrewMembers[0].createdAt}
                  to="/crew-members"
                />
              ) : null}

              {!dashboardData.newestUsers[0]
              && !dashboardData.newestVessels[0]
              && !dashboardData.newestCompanies[0]
              && !dashboardData.newestCrewMembers[0] ? (
                <Typography variant="body2" className="admin-panel__muted">
                  No records have been created yet.
                </Typography>
                ) : null}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default DashboardPage
