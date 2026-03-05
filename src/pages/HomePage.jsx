import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'

const features = [
  { icon: <DashboardOutlinedIcon />, title: 'Kanban Boards', desc: 'Drag & drop issues across status columns in real-time' },
  { icon: <PeopleOutlinedIcon />, title: 'Team Collaboration', desc: 'Assign issues, leave comments, track activity live' },
  { icon: <SpeedOutlinedIcon />, title: 'Real-time Updates', desc: 'See changes instantly across all team members' }
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '90vh' }}>
      {/* Hero */}
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', pt: 10, pb: 8 }}>
          <Chip
            icon={<BoltOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            label="Now in Beta — Free to use"
            size="small"
            sx={{
              mb: 4, bgcolor: 'rgba(124,110,244,0.1)',
              color: '#9D92F7', border: '1px solid rgba(124,110,244,0.25)',
              fontWeight: 500, fontSize: '0.75rem'
            }}
          />

          <Typography variant="h2" sx={{
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            fontWeight: 700, lineHeight: 1.15,
            letterSpacing: '-0.03em', mb: 3,
            background: 'linear-gradient(135deg, #F1F1F3 30%, #8B8B9E 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Project management<br />built for modern teams
          </Typography>

          <Typography variant="h6" sx={{
            color: 'text.secondary', fontWeight: 400,
            fontSize: '1.1rem', mb: 5, maxWidth: 480, mx: 'auto', lineHeight: 1.7
          }}>
            FlowDesk brings your issues, projects, and team together —
            with real-time collaboration that actually works.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained" size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5, fontSize: '0.95rem' }}>
              Start for free
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4, py: 1.5, fontSize: '0.95rem',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'text.secondary',
                '&:hover': { borderColor: '#7C6EF4', color: '#7C6EF4' }
              }}>
              Sign in
            </Button>
          </Box>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={2} sx={{ pb: 8 }}>
          {features.map((f) => (
            <Grid item xs={12} md={4} key={f.title}>
              <Box sx={{
                p: 3, borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.06)',
                height: '100%',
                transition: 'border-color 0.2s, transform 0.2s',
                '&:hover': {
                  borderColor: 'rgba(124,110,244,0.3)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: 'rgba(124,110,244,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7C6EF4', mb: 2
                }}>
                  {f.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {f.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default HomePage