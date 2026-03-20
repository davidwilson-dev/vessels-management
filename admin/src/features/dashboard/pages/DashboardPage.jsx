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
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

import MetricCard from '../../../shared/components/MetricCard'
import PageHeader from '../../../shared/components/PageHeader'
import StatusBadge from '../../../shared/components/StatusBadge'
import { fetchUsers, selectUsers, selectUsersError, selectUsersStatus } from '../../users/usersSlice'
import {
  buildDisplayName,
  compareByNewest,
  formatDate,
  getUserPosition,
} from '../../../shared/utils/format'

function DashboardPage() {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const status = useSelector(selectUsersStatus)
  const error = useSelector(selectUsersError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, status])

  const dashboardData = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.isActive).length
    const verifiedUsers = users.filter((user) => user.emailVerified).length
    const attentionUsers = users.filter((user) => !user.isActive || !user.emailVerified)
    const completeProfiles = users.filter(
      (user) => user.profile?.position && user.profile?.phoneNumber && user.profile?.address,
    ).length

    const positionCounts = users.reduce((accumulator, user) => {
      const position = getUserPosition(user)
      accumulator[position] = (accumulator[position] || 0) + 1
      return accumulator
    }, {})

    const topPositions = Object.entries(positionCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)

    const newestUsers = [...users].sort(compareByNewest).slice(0, 5)

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      attentionUsers,
      completeProfiles,
      topPositions,
      newestUsers,
    }
  }, [users])

  return (
    <Box className="admin-page-stack">
      <PageHeader
        eyebrow="Command Deck"
        title="User Operations Dashboard"
        description="Track account readiness, onboarding quality, and access health across the admin workforce before we expand the same shell for vessel management."
        action={
          <Button
            component={RouterLink}
            to="/users"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Open Manager Users
          </Button>
        }
      />

      {error ? (
        <Alert severity="error" action={<Button onClick={() => dispatch(fetchUsers())}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      <Box className="admin-grid admin-grid--metrics">
        <MetricCard
          title="Total Accounts"
          value={dashboardData.totalUsers}
          caption="Combined admin, staff, and guest records in the workspace."
          icon={<Groups2RoundedIcon />}
        />
        <MetricCard
          title="Verified Access"
          value={dashboardData.verifiedUsers}
          caption="Profiles already verified and ready for production sign-in."
          icon={<ShieldRoundedIcon />}
          tone="secondary"
        />
        <MetricCard
          title="Active Roster"
          value={dashboardData.activeUsers}
          caption="Users who can currently access the operations flow."
          icon={<TaskAltRoundedIcon />}
          tone="success"
        />
        <MetricCard
          title="Needs Attention"
          value={dashboardData.attentionUsers.length}
          caption="Accounts still locked or waiting for verification follow-up."
          icon={<WarningAmberRoundedIcon />}
          tone="warning"
        />
      </Box>

      <Box className="admin-grid admin-grid--main">
        <Paper className="admin-panel admin-panel--hero">
          <Box className="admin-page-header">
            <Box className="admin-page-header__content">
              <Typography component="span" className="admin-panel__eyebrow admin-panel__eyebrow--light">
                Readiness Snapshot
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Keep user administration aligned with fleet operations.
              </Typography>
              <Typography variant="body1" className="admin-panel__copy--light">
                The new interface uses the same app shell, service layer, and feature-first folders you can reuse for manager-vessels. That keeps the admin suite coherent as we scale.
              </Typography>
            </Box>
            <Box className="admin-chip-row admin-chip-row--end">
              <Chip label={`${dashboardData.totalUsers} accounts`} className="admin-chip-light" />
              <Chip label={`${dashboardData.topPositions.length} active positions`} className="admin-chip-light" />
            </Box>
          </Box>

          <Box className="admin-progress-grid" sx={{ mt: 3 }}>
            {[
              {
                label: 'Activation rate',
                value: dashboardData.totalUsers
                  ? Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)
                  : 0,
              },
              {
                label: 'Verification rate',
                value: dashboardData.totalUsers
                  ? Math.round((dashboardData.verifiedUsers / dashboardData.totalUsers) * 100)
                  : 0,
              },
              {
                label: 'Profile completeness',
                value: dashboardData.totalUsers
                  ? Math.round((dashboardData.completeProfiles / dashboardData.totalUsers) * 100)
                  : 0,
              },
            ].map((item) => (
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
          <Box className="admin-page-stack" sx={{ gap: 2 }}>
            <Typography variant="h5">Role Coverage</Typography>
            {dashboardData.topPositions.length ? (
              dashboardData.topPositions.map(([position, count]) => {
                const coverage = Math.round((count / dashboardData.totalUsers) * 100)
                return (
                  <Box key={position}>
                    <Box className="admin-progress-row">
                      <Typography variant="body2">{position}</Typography>
                      <Typography variant="subtitle2">{count}</Typography>
                    </Box>
                    <LinearProgress value={coverage} variant="determinate" />
                  </Box>
                )
              })
            ) : (
              <Typography variant="body2" className="admin-panel__muted">
                No role data is available yet.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      <Box className="admin-grid admin-grid--bottom">
        <Paper className="admin-panel">
          <Box className="admin-page-stack" sx={{ gap: 2.5 }}>
            <Typography variant="h5">Attention Queue</Typography>
            {dashboardData.attentionUsers.length ? (
              <Box className="admin-list">
                {dashboardData.attentionUsers.slice(0, 5).map((user) => (
                  <Box key={user.id} className="admin-list__item">
                    <Box className="admin-list__row">
                      <Box className="admin-list__meta">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {buildDisplayName(user)}
                        </Typography>
                        <Typography variant="body2" className="admin-panel__muted">
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip label={getUserPosition(user)} variant="outlined" />
                    </Box>
                    <StatusBadge user={user} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" className="admin-panel__muted">
                Everything looks calm right now. No user records currently need manual follow-up.
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper className="admin-panel">
          <Box className="admin-page-stack" sx={{ gap: 2.5 }}>
            <Box className="admin-list__row">
              <Typography variant="h5">Newest Crew Records</Typography>
              {status === 'loading' ? <Chip label="Syncing" color="secondary" /> : null}
            </Box>
            {dashboardData.newestUsers.length ? (
              <Box className="admin-list">
                {dashboardData.newestUsers.map((user) => (
                  <Box key={user.id} className="admin-list__row">
                    <Box className="admin-list__meta">
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {buildDisplayName(user)}
                      </Typography>
                      <Typography variant="body2" className="admin-panel__muted">
                        {getUserPosition(user)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="admin-list__date">
                      Created {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" className="admin-panel__muted">
                No users have been created yet.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default DashboardPage
