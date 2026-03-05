import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent,
  CardActionArea, Chip, Avatar, Skeleton, IconButton,
  Menu, MenuItem
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects, deleteProject } from '../store/slices/projectSlice'
import { showSuccess, showError } from '../utils/toast'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <Card sx={{
      bgcolor: 'background.paper',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 3, height: '100%',
      transition: 'all 0.2s ease',
      '&:hover': {
        border: '1px solid rgba(124,110,244,0.3)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: 'rgba(124,110,244,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              {project.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {project.name}
              </Typography>
              <Chip label={project.key} size="small" sx={{
                height: 18, fontSize: '0.65rem', fontWeight: 700,
                bgcolor: 'rgba(124,110,244,0.1)', color: '#7C6EF4',
                mt: 0.3
              }} />
            </Box>
          </Box>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget) }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { navigate(`/projects/${project._id}`); setAnchorEl(null) }}>
              Open Project
            </MenuItem>
            <MenuItem onClick={() => { onDelete(project._id); setAnchorEl(null) }}
              sx={{ color: '#EF4444' }}>
              Delete Project
            </MenuItem>
          </Menu>
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{
          color: 'text.secondary', mb: 2,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: 40
        }}>
          {project.description || 'No description'}
        </Typography>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: '#7C6EF4', fontSize: '0.7rem' }}>
              {project.owner?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {project.owner?.name}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {project.issueCount || 0} issues
          </Typography>
        </Box>

        {/* Open Button */}
        <Button fullWidth variant="outlined" size="small"
          onClick={() => navigate(`/projects/${project._id}`)}
          sx={{
            mt: 2, borderColor: 'rgba(255,255,255,0.08)',
            color: 'text.secondary', fontSize: '0.75rem',
            '&:hover': { borderColor: '#7C6EF4', color: '#7C6EF4' }
          }}>
          Open Project
        </Button>
      </CardContent>
    </Card>
  )
}

function ProjectsPage() {
  const dispatch = useDispatch()
  const { projects, isLoading } = useSelector(state => state.projects)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project? This cannot be undone.')) {
      try {
        await dispatch(deleteProject(id)).unwrap()
        showSuccess('Project deleted')
      } catch (error) {
        showError(error || 'Failed to delete project')
      }
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2 }}>
          New Project
        </Button>
      </Box>

      {/* Loading Skeletons */}
      {isLoading && (
        <Grid container spacing={3}>
          {[1,2,3].map(i => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: 3
        }}>
          <FolderOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No projects yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create your first project to get started
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
            Create Project
          </Button>
        </Box>
      )}

      {/* Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map(project => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard project={project} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  )
}

export default ProjectsPage