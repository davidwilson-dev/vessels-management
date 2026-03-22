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

const crewRoleOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'captain', label: 'Captain' },
  { value: 'chief_engineer', label: 'Chief engineer' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'sailor', label: 'Sailor' },
  { value: 'deckhand', label: 'Deckhand' },
  { value: 'radio_operator', label: 'Radio operator' },
  { value: 'line_manager', label: 'Line manager' },
  { value: 'crew', label: 'Crew' },
  { value: 'other', label: 'Other' },
]

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'retired', label: 'Retired' },
]

function CrewMemberFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
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
          label="Search crew members"
          placeholder="Name, email, rank, vessel, employee code..."
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

        <TextField
          select
          label="Crew role"
          value={roleFilter}
          onChange={(event) => onRoleChange(event.target.value)}
          sx={{ minWidth: { lg: 200 } }}
        >
          {crewRoleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
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

export default CrewMemberFilters
