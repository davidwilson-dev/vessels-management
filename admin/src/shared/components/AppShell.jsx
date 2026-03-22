import { useMemo, useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import { useTheme } from '@mui/material/styles'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logoutUser, selectAuthState } from '../../features/auth/authSlice'
import { buildDisplayName, getInitials } from '../utils/format'

const drawerWidth = 300

const navigation = [
  {
    label: 'Dashboard',
    description: 'Operations pulse and staffing health',
    to: '/dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    label: 'Manager Users',
    description: 'Crew records and access controls',
    to: '/users',
    icon: <Groups2RoundedIcon />,
  },
  {
    label: 'Companies',
    description: 'Ownership records for vessels and crew',
    to: '/companies',
    icon: <ApartmentRoundedIcon />,
  },
  {
    label: 'Fleet Vessels',
    description: 'Registration, status, and command details',
    to: '/vessels',
    icon: <SailingRoundedIcon />,
  },
  {
    label: 'Crew Members',
    description: 'Assignments, certifications, and availability',
    to: '/crew-members',
    icon: <PeopleAltRoundedIcon />,
  },
]

function AppShell() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logoutStatus } = useSelector(selectAuthState)
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentSection = useMemo(
    () =>
      navigation.find((item) => location.pathname.startsWith(item.to)) || navigation[0],
    [location.pathname],
  )

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open)
  }

  const handleLogout = async () => {
    const action = logoutUser()
    dispatch(action)
    await action.meta.deferred.promise
    navigate('/login', { replace: true })
  }

  const drawerContent = (
    <Box className="admin-shell__drawer">
      <Box className="admin-shell__brand">
        <Box className="admin-shell__brand-row">
          <Avatar className="admin-shell__brand-mark">
            <SailingRoundedIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" className="admin-shell__brand-title">
              Vessel Admin
            </Typography>
            <Typography variant="body2" className="admin-shell__brand-subtitle">
              Fleet operations console
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="admin-shell__nav">
        <Typography component="span" className="admin-shell__nav-label">
          Navigation
        </Typography>
        <List disablePadding className="admin-shell__nav-list">
          {navigation.map((item) => (
            <ListItem disablePadding key={item.to}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                selected={
                  location.pathname === item.to ||
                  location.pathname.startsWith(`${item.to}/`)
                }
                onClick={() => setMobileOpen(false)}
                className="admin-shell__nav-item"
              >
                <ListItemIcon className="admin-shell__nav-icon">{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{ fontWeight: 800 }}
                  secondaryTypographyProps={{ color: 'inherit', sx: { opacity: 0.7 } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className="admin-shell__account">
        <Divider className="admin-shell__divider" />
        <Box className="admin-shell__account-row">
          <Avatar className="admin-shell__account-avatar">
            {getInitials(buildDisplayName(currentUser))}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" className="admin-shell__account-name" noWrap>
              {buildDisplayName(currentUser)}
            </Typography>
            <Typography variant="body2" className="admin-shell__account-email" noWrap>
              {currentUser?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box className="admin-shell">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 74, md: 82 } }}>
          <Box className="admin-shell__toolbar">
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' } }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Box className="admin-shell__section">
              <Typography variant="body2" className="admin-shell__section-path">
                Operations / {currentSection.label}
              </Typography>
              <Typography variant="h6" className="admin-shell__section-title" noWrap>
                {currentSection.description}
              </Typography>
            </Box>

            <Chip
              icon={<ShieldRoundedIcon />}
              label={(currentUser?.role || 'guest').toUpperCase()}
              className="admin-shell__role-chip"
            />

            <Tooltip title="Sign out">
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                className="admin-shell__logout"
                disabled={logoutStatus === 'loading'}
              >
                {logoutStatus === 'loading' ? 'Signing out...' : 'Logout'}
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" className="admin-main">
        <Box className="admin-main__content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AppShell
