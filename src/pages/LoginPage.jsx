import { useState, useEffect } from 'react'
import {
  Box, Typography, TextField, Button, Link,
  Divider, CircularProgress, IconButton,
  InputAdornment, Checkbox, FormControlLabel
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login, reset } from '../store/slices/authSlice'
import { loginSchema } from '../utils/validationSchemas'
import { showSuccess, showError } from '../utils/toast'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message, user } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    if (isSuccess || user) {
      showSuccess('Welcome back! 👋')
      navigate('/')
    }
    if (isError) showError(message || 'Login failed')
    return () => dispatch(reset())
  }, [isSuccess, isError, user, message, navigate, dispatch])

  const onSubmit = (data) => { dispatch(login(data)) }

  const fillDemo = () => {
    setValue('email', 'vanisha@test.com')
    setValue('password', 'Password123')
  }

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{
        width: '100%', maxWidth: 400, p: 4, borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.07)'
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: '7px',
            background: '#3ECF8E',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BoltOutlinedIcon sx={{ fontSize: 16, color: '#0f1117' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>FlowDesk</Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Welcome back</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Sign in to your workspace
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField fullWidth label="Email address" type="email"
            size="small" margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField fullWidth label="Password"
            type={showPassword ? 'text' : 'password'}
            size="small" margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: 'text.disabled', '&.Mui-checked': { color: '#3ECF8E' } }} />}
              label={<Typography variant="caption" sx={{ color: 'text.secondary' }}>Remember me</Typography>}
            />
            <Link sx={{ fontSize: '0.78rem', color: '#3ECF8E', cursor: 'pointer', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" fullWidth variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
            sx={{ mt: 2.5, py: 1.1 }}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Button fullWidth variant="outlined" size="small" onClick={fillDemo}
            sx={{ mt: 1.5, py: 0.9, fontSize: '0.78rem' }}>
            Fill demo credentials
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Don't have an account?{' '}
          <Link onClick={() => navigate('/register')}
            sx={{ color: '#3ECF8E', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginPage