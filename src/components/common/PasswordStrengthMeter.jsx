import { Box, Typography, LinearProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

const requirements = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) }
]

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'transparent' }
  const passed = requirements.filter(r => r.test(password)).length
  if (passed <= 1) return { score: 25, label: 'Weak', color: '#EF4444' }
  if (passed === 2) return { score: 50, label: 'Fair', color: '#F59E0B' }
  if (passed === 3) return { score: 75, label: 'Good', color: '#3B82F6' }
  return { score: 100, label: 'Strong', color: '#22C55E' }
}

function PasswordStrengthMeter({ password }) {
  const strength = getStrength(password || '')
  const hasPassword = password && password.length > 0

  if (!hasPassword) return null

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      {/* Strength Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={strength.score}
          sx={{
            flexGrow: 1, height: 6, borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              bgcolor: strength.color,
              borderRadius: 3,
              transition: 'transform 0.4s ease, background-color 0.3s ease'
            }
          }}
        />
        <Typography variant="caption" sx={{ color: strength.color, fontWeight: 600, minWidth: 45 }}>
          {strength.label}
        </Typography>
      </Box>

      {/* Requirements Checklist */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
        {requirements.map((req) => {
          const passed = req.test(password || '')
          return (
            <Box key={req.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {passed
                ? <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#22C55E' }} />
                : <RadioButtonUncheckedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
              }
              <Typography variant="caption" sx={{
                color: passed ? '#22C55E' : 'text.disabled',
                fontSize: '0.7rem',
                transition: 'color 0.2s'
              }}>
                {req.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default PasswordStrengthMeter