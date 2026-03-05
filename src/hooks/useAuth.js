import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register, logout, reset } from '../store/slices/authSlice'
import { showSuccess, showError } from '../utils/toast'

const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap()
      showSuccess('Welcome back! 👋')
      navigate('/')
    } catch (error) {
      showError(error || 'Login failed')
    }
  }

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap()
      showSuccess('Account created! Welcome to FlowDesk 🎉')
      navigate('/')
    } catch (error) {
      showError(error || 'Registration failed')
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      showSuccess('Logged out successfully')
      navigate('/login')
    } catch (error) {
      navigate('/login')
    } finally {
      dispatch(reset())
    }
  }

  const isAuthenticated = !!user && !!token

  const isAdmin = user?.role === 'admin'

  const getUserInitials = () => {
    if (!user?.name) return '?'
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const hasPermission = (requiredRole) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.role === requiredRole
  }

  return {
    user,
    token,
    isLoading,
    isError,
    isSuccess,
    message,
    isAuthenticated,
    isAdmin,
    handleLogin,
    handleRegister,
    handleLogout,
    getUserInitials,
    hasPermission
  }
}

export default useAuth