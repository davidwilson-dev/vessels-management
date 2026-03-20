import { Box, Button, Paper, Typography } from '@mui/material'

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Paper className="admin-empty-state">
      <Box className="admin-empty-state__content">
        <Box className="admin-empty-state__icon">{icon}</Box>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1" className="admin-empty-state__description">
          {description}
        </Typography>
        {actionLabel && onAction ? (
          <Button variant="contained" color="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Box>
    </Paper>
  )
}

export default EmptyState
