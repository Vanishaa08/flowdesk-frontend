import { useState, useEffect } from 'react'
import {
  Box, Typography, TextField, Button, Link,
  Divider, CircularProgress, IconButton,
  InputAdornment
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { register as registerUser, reset } from '../store/slices/authSlice'
import { registerSchema } from '../utils/validationSchemas'
import { showSuccess, showError } from '../utils/toast'
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message, user } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  // Watch password for strength meter
  const passwordValue = watch('password')

  useEffect(() => {
    if (isSuccess || user) {
      showSuccess('Account created! Welcome to FlowDesk 🎉')
      navigate('/')
    }
    if (isError) {
      showError(message || 'Registration failed. Please try again.')
    }
    return () => dispatch(reset())
  }, [isSuccess, isError, user, message, navigate, dispatch])

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data
    dispatch(registerUser(userData))
  }

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Box sx={{
        width: '100%', maxWidth: 420, p: 4, borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '9px',
            background: 'linear-gradient(135deg, #7C6EF4, #22D3EE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BoltOutlinedIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>FlowDesk</Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Create your account</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Start managing projects for free
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Name */}
          <TextField
            fullWidth label="Full name"
            size="small" margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Email */}
          <TextField
            fullWidth label="Email address" type="email"
            size="small" margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <TextField
            fullWidth label="Password"
            type={showPassword ? 'text' : 'password'}
            size="small" margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword
                      ? <VisibilityOffIcon fontSize="small" />
                      : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={passwordValue} />

          {/* Confirm Password */}
          <TextField
            fullWidth label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            size="small" margin="normal"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm
                      ? <VisibilityOffIcon fontSize="small" />
                      : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Submit */}
          <Button
            type="submit" fullWidth variant="contained"
            disabled={isLoading || isSubmitting}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
            sx={{ mt: 2.5, py: 1.2 }}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link onClick={() => navigate('/login')}
            sx={{ color: '#7C6EF4', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default RegisterPage