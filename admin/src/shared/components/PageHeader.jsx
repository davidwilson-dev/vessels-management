import { Box, Typography } from '@mui/material'

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <Box className="admin-page-header">
      <Box className="admin-page-header__content">
        {eyebrow ? (
          <Typography component="span" className="admin-page-header__eyebrow">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h3" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body1" className="admin-page-header__description">
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box className="admin-page-header__action">{action}</Box> : null}
    </Box>
  )
}

export default PageHeader
