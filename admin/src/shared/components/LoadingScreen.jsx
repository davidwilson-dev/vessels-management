import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box className="admin-loading-screen">
      <Box className="admin-loading-screen__content">
        <CircularProgress size={52} thickness={4.2} />
        <Typography variant="h6" align="center">
          {message}
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingScreen
