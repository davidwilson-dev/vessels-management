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
  { value: 'inactive', label: 'Inactive' },
]

function CompanyFilters({
  search,
  onSearchChange,
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
          label="Search companies"
          placeholder="Name, company code, email, phone..."
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
          label="Status"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={{ minWidth: { lg: 200 } }}
        >
          {statusOptions.map((option) => (
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

export default CompanyFilters
