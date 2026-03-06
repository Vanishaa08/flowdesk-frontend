import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Box, Drawer, IconButton,
  Toolbar, Typography, Button, List,
  ListItemButton, ListItemIcon, ListItemText,
  Avatar, Chip, Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { logout } from '../../store/slices/authSlice'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, path: '/' },
  { label: 'Projects', icon: <FolderOutlinedIcon fontSize="small" />, path: '/projects' },
]

function MainLayout() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { projects } = useSelector(state => state.projects)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" onClick={() => setOpen(!open)} edge="start">
            <MenuIcon fontSize="small" />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C6EF4, #22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BoltOutlinedIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 700, fontSize: '1rem',
              background: 'linear-gradient(135deg, #F1F1F3, #8B8B9E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              FlowDesk
            </Typography>
            <Chip label="Beta" size="small" sx={{
              height: 18, fontSize: '0.6rem', fontWeight: 600,
              bgcolor: 'rgba(124,110,244,0.15)', color: '#7C6EF4',
              border: '1px solid rgba(124,110,244,0.3)'
            }} />
          </Box>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#7C6EF4', fontSize: '0.8rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                {user.name}
              </Typography>
              <IconButton size="small" onClick={handleLogout} sx={{ color: 'text.secondary' }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary', fontSize: '0.8rem' }}>
                Login
              </Button>
              <Button variant="contained" size="small" onClick={() => navigate('/register')}
                sx={{ fontSize: '0.8rem' }}>
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer variant="permanent" open={open} sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : 0,
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
          mt: '64px'
        }
      }}>
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Workspace */}
          <Box sx={{
            p: 1.5, mb: 2, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 1.5
          }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#7C6EF4', fontSize: '0.75rem' }}>
              {user ? user.name?.charAt(0).toUpperCase() : 'W'}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                {user ? `${user.name}'s Space` : 'My Workspace'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Free Plan
              </Typography>
            </Box>
          </Box>

          {/* Nav */}
          <List dense disablePadding>
            {navItems.map((item) => (
              <ListItemButton key={item.label}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2, mb: 0.5, py: 0.8,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(124,110,244,0.15)',
                    color: '#7C6EF4',
                    '& .MuiListItemIcon-root': { color: '#7C6EF4' }
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                }}>
                <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" sx={{
            color: 'text.secondary', px: 1, mb: 1,
            fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontSize: '0.65rem'
          }}>
            Projects
          </Typography>

          {projects && projects.length > 0 ? (
            projects.map(project => (
              <ListItemButton key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                selected={location.pathname === `/projects/${project._id}`}
                sx={{
                  borderRadius: 2, mb: 0.5, py: 0.6,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(124,110,244,0.15)',
                    color: '#7C6EF4'
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                }}>
                <ListItemText
                  primary={`${project.icon} ${project.name}`}
                  primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500 }}
                />
              </ListItemButton>
            ))
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 1, fontSize: '0.8rem' }}>
              No projects yet
            </Typography>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout