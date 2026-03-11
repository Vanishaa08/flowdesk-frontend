import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { connectSocket, disconnectSocket } from '../services/socketService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, isLoading } = useSelector(state => state.auth)

  // Connect socket when logged in
  useEffect(() => {
    if (token) {
      connectSocket(token)
    } else {
      disconnectSocket()
    }
  }, [token])

  const handleLogout = () => {
    disconnectSocket()
    dispatch(logout())
    navigate('/login')
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    logout: handleLogout
  }
}

export default useAuth