import { Chip, Stack } from '@mui/material'

function StatusBadge({ user, showRole = true }) {
  if (!user) {
    return null
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {showRole ? (
        <Chip
          size="small"
          color={user.role === 'admin' ? 'primary' : 'secondary'}
          label={(user.role || 'guest').toUpperCase()}
        />
      ) : null}
      <Chip
        size="small"
        color={user.isActive ? 'success' : 'warning'}
        label={user.isActive ? 'Active' : 'Locked'}
        variant={user.isActive ? 'filled' : 'outlined'}
      />
      <Chip
        size="small"
        color={user.emailVerified ? 'primary' : 'default'}
        label={user.emailVerified ? 'Verified' : 'Pending Verify'}
        variant={user.emailVerified ? 'outlined' : 'filled'}
      />
    </Stack>
  )
}

export default StatusBadge
