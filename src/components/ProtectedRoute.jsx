import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

export function ProtectedRoute({ children }) {
  const { user, token, isLoading } = useSelector(state => state.auth)
  const location = useLocation()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#7C6EF4' }} />
      </Box>
    )
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export function PublicRoute({ children }) {
  const { user, token } = useSelector(state => state.auth)

  if (user && token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute