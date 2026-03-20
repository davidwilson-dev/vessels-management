import {
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
  { value: 'verified', label: 'Verified' },
  { value: 'attention', label: 'Attention' },
]

function UserFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  genderFilter,
  onGenderChange,
  positionFilter,
  onPositionChange,
  statusFilter,
  onStatusChange,
  positionOptions,
  onReset,
}) {
  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', lg: 'center' }}
      >
        <TextField
          fullWidth
          label="Search users"
          placeholder="Name, email, phone, address..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField select label="Role" value={roleFilter} onChange={(event) => onRoleChange(event.target.value)} sx={{ minWidth: { lg: 160 } }}>
          <MenuItem value="all">All roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="guest">Guest</MenuItem>
        </TextField>

        <TextField select label="Gender" value={genderFilter} onChange={(event) => onGenderChange(event.target.value)} sx={{ minWidth: { lg: 160 } }}>
          <MenuItem value="all">All genders</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField select label="Position" value={positionFilter} onChange={(event) => onPositionChange(event.target.value)} sx={{ minWidth: { lg: 200 } }}>
          <MenuItem value="all">All positions</MenuItem>
          {positionOptions.map((position) => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" startIcon={<FilterAltOffRoundedIcon />} onClick={onReset}>
          Reset
        </Button>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Quick status filters
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {statusOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              color={statusFilter === option.value ? 'primary' : 'default'}
              variant={statusFilter === option.value ? 'filled' : 'outlined'}
              onClick={() => onStatusChange(option.value)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default UserFilters
