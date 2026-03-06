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
        <Toolbar sx={{ gap: 2, minHeight: '56px !important' }}>
          <IconButton color="inherit" onClick={() => setOpen(!open)} edge="start" size="small">
            <MenuIcon fontSize="small" />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box sx={{
              width: 26, height: 26, borderRadius: '7px',
              background: '#3ECF8E',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BoltOutlinedIcon sx={{ fontSize: 15, color: '#0f1117' }} />
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 700, fontSize: '0.95rem', color: '#ededed'
            }}>
              FlowDesk
            </Typography>
            <Chip label="Beta" size="small" sx={{
              height: 16, fontSize: '0.6rem', fontWeight: 600,
              bgcolor: 'rgba(62,207,142,0.1)', color: '#3ECF8E',
              border: '1px solid rgba(62,207,142,0.2)'
            }} />
          </Box>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#3ECF8E', fontSize: '0.75rem', color: '#0f1117', fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                {user.name}
              </Typography>
              <IconButton size="small" onClick={handleLogout}
                sx={{ color: 'text.secondary', '&:hover': { color: '#ededed' } }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                sx={{ fontSize: '0.8rem' }}>
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
          mt: '56px'
        }
      }}>
        <Box sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Workspace */}
          <Box sx={{
            p: 1.5, mb: 1.5, borderRadius: 1.5,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 1.5
          }}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: '#3ECF8E', fontSize: '0.7rem', color: '#0f1117', fontWeight: 700 }}>
              {user ? user.name?.charAt(0).toUpperCase() : 'W'}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.3, fontSize: '0.78rem' }}>
                {user ? `${user.name?.split(' ')[0]}'s Space` : 'My Workspace'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem' }}>
                Free Plan
              </Typography>
            </Box>
          </Box>

          {/* Nav */}
          <List dense disablePadding sx={{ mb: 1 }}>
            {navItems.map((item) => (
              <ListItemButton key={item.label}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1.5, mb: 0.3, py: 0.7, px: 1.2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(62,207,142,0.08)',
                    color: '#3ECF8E',
                    '& .MuiListItemIcon-root': { color: '#3ECF8E' }
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary', fontSize: '0.85rem' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: 500 }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 1.5 }} />

          {/* Projects Section */}
          <Typography variant="caption" sx={{
            color: 'text.disabled', px: 1.2, mb: 1,
            fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', fontSize: '0.62rem',
            display: 'block'
          }}>
            Projects
          </Typography>

          <List dense disablePadding>
            {projects && projects.length > 0 ? (
              projects.map(project => (
                <ListItemButton key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  selected={location.pathname.startsWith(`/projects/${project._id}`)}
                  sx={{
                    borderRadius: 1.5, mb: 0.3, py: 0.6, px: 1.2,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(62,207,142,0.08)',
                      color: '#3ECF8E'
                    },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                  }}>
                  <ListItemText
                    primary={`${project.icon} ${project.name}`}
                    primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500, noWrap: true }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Typography variant="caption" sx={{
                color: 'text.disabled', px: 1.2,
                fontSize: '0.78rem', display: 'block'
              }}>
                No projects yet
              </Typography>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{
        flexGrow: 1, p: 3,
        mt: '56px',
        minHeight: 'calc(100vh - 56px)',
        bgcolor: 'background.default'
      }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout