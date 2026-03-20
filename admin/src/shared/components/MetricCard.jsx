import { alpha, useTheme } from '@mui/material/styles'
import { Avatar, Box, Paper, Typography } from '@mui/material'

function MetricCard({ title, value, caption, icon, tone = 'primary' }) {
  const theme = useTheme()
  const accent = theme.palette[tone]?.main || theme.palette.primary.main

  return (
    <Paper
      className="admin-metric-card"
      style={{
        '--metric-accent': accent,
        '--metric-accent-soft': alpha(accent, 0.16),
        '--metric-accent-wash': alpha(accent, 0.14),
      }}
    >
      <Box className="admin-metric-card__orb" />
      <Box className="admin-metric-card__body">
        <Box>
          <Typography component="div" className="admin-metric-card__eyebrow">
            {title}
          </Typography>
          <Typography variant="h4" className="admin-metric-card__value">
            {value}
          </Typography>
          <Typography variant="body2" className="admin-metric-card__caption">
            {caption}
          </Typography>
        </Box>
        <Avatar className="admin-metric-card__avatar">{icon}</Avatar>
      </Box>
    </Paper>
  )
}

export default MetricCard
