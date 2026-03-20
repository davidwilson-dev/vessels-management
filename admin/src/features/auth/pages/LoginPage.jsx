import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import { toast } from 'react-toastify'

import { loginUser, selectAuthState } from '../authSlice'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const featureCards = [
  {
    icon: <Groups2RoundedIcon />,
    title: 'Roster Control',
    description: 'Manage profiles, roles, and readiness in one place.',
  },
  {
    icon: <ShieldRoundedIcon />,
    title: 'Access Rules',
    description: 'Separate staff visibility from full admin actions.',
  },
  {
    icon: <SpeedRoundedIcon />,
    title: 'Operational Flow',
    description: 'Fast filters, detailed drawers, and quick actions.',
  },
]

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginStatus, error } = useSelector(selectAuthState)
  const isSubmitting = loginStatus === 'loading'
  const redirectPath = useMemo(
    () => location.state?.from?.pathname || '/dashboard',
    [location.state],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const action = loginUser(values)
      dispatch(action)
      await action.meta.deferred.promise
      toast.success('Welcome aboard. Your admin console is ready.')
      navigate(redirectPath, { replace: true })
    } catch {
      // The error state is already stored in Redux for the form alert.
    }
  })

  return (
    <Box className="admin-auth-screen">
      <Box className="admin-auth-grid">
        <Paper className="admin-auth-showcase">
          <Box className="admin-auth-showcase__body">
            <Stack spacing={2}>
              <Chip
                icon={<AdminPanelSettingsRoundedIcon />}
                label="Admin Management Suite"
                className="admin-auth-chip"
              />
              <Typography variant="h1" sx={{ maxWidth: 560 }}>
                Command the crew directory with a vessel-ready control room.
              </Typography>
              <Typography variant="body1" className="admin-auth-copy">
                We built this admin shell with shared components, page-level features, and API services so the manager-users flow can sit naturally beside the future manager-vessels interface.
              </Typography>
            </Stack>

            <Box className="admin-auth-feature-grid">
              {featureCards.map((item) => (
                <Paper key={item.title} className="admin-auth-feature-card">
                  <Stack spacing={1.25}>
                    <Box className="admin-auth-feature-card__icon">{item.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className="admin-auth-feature-card__description">
                      {item.description}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Box>
        </Paper>

        <Paper className="admin-auth-form">
          <Stack spacing={3} component="form" onSubmit={onSubmit}>
            <Box>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Sign In
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Use an active <code>admin</code> or <code>staff</code> account from the backend API.
              </Typography>
            </Box>

            <Alert severity="info">
              API endpoint: <strong>{apiBaseUrl}</strong>
            </Alert>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email address.',
                },
              })}
            />

            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message || 'The API returns the session token and refresh cookie.'}
              {...register('password', {
                required: 'Password is required.',
              })}
            />

            <Button
              type="submit"
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Open Admin Console'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}

export default LoginPage
