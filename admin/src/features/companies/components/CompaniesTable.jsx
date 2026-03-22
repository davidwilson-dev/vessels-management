import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'

import { formatDate } from '../../../shared/utils/format'

function StatusChip({ status }) {
  const colorMap = {
    active: 'success',
    inactive: 'default',
  }

  return <Chip size="small" color={colorMap[status] || 'default'} label={status || 'unknown'} />
}

function CompaniesTable({ companies, canManageCompanies, onView, onEdit, onDelete }) {
  return (
    <TableContainer>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {company.companyCode || 'No company code'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{company.email || 'No email saved'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {company.phone || 'No phone saved'}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={company.status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(company.updatedAt || company.createdAt)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="View details">
                    <IconButton color="primary" onClick={() => onView(company)}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={canManageCompanies ? 'Edit company' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(company)}
                        disabled={!canManageCompanies}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={canManageCompanies ? 'Delete company' : 'Admin permission required'}>
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(company)}
                        disabled={!canManageCompanies}
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CompaniesTable
