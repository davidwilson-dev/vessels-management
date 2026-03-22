import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import StatusBadge from '../../../shared/components/StatusBadge'
import {
  buildDisplayName,
  formatDate,
  formatDateTime,
  getInitials,
  getUserPosition,
} from '../../../shared/utils/format'

function DetailRow({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        background: 'linear-gradient(145deg, #082033 0%, #0f2742 65%, #14466c 100%)',
        color: '#ffffff',
      }}
    >
      <Typography variant="overline" sx={{ fontWeight: 800, color: 'inherit' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'inherit' }}>
        {value || 'Not provided'}
      </Typography>
    </Box>
  )
}

function UserDetailsDrawer({ user, open, onClose, onEdit, canManageUsers }) {
  if (!user) {
    return null
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 460 }, maxWidth: '100vw' }}>
        <Box
          sx={{
            p: 3,
            color: '#ffffff',
            background: 'linear-gradient(145deg, #082033 0%, #0f2742 60%, #0f5b8d 100%)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.profile?.avatarUrl || undefined} sx={{ width: 68, height: 68 }}>
              {getInitials(buildDisplayName(user))}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {buildDisplayName(user)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.76, mb: 1 }}>
                {getUserPosition(user)}
              </Typography>
              <StatusBadge user={user} />
            </Box>
          </Stack>
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {canManageUsers ? (
            <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => onEdit(user)}>
              Edit Profile
            </Button>
          ) : null}

          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Phone" value={user.profile?.phoneNumber} />
          <DetailRow label="Date of Birth" value={formatDate(user.profile?.dateOfBirth)} />
          <DetailRow label="Gender" value={user.profile?.gender} />
          <DetailRow label="Address" value={user.profile?.address} />
          <DetailRow label="ID Card Number" value={user.profile?.idCardNumber} />
          <DetailRow label="Bio" value={user.profile?.bio} />

          <Divider />

          <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
          <DetailRow label="Last Updated" value={formatDateTime(user.updatedAt)} />
        </Stack>
      </Box>
    </Drawer>
  )
}

export default UserDetailsDrawer
