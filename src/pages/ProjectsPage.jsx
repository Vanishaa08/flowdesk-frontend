import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Chip, Avatar, Skeleton, IconButton, Menu, MenuItem
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects, deleteProject } from '../store/slices/projectSlice'
import { showSuccess, showError } from '../utils/toast'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <Card sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      transition: 'all 0.2s ease',
      '&:hover': {
        border: '1px solid rgba(62,207,142,0.2)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 1.5,
              bgcolor: 'rgba(62,207,142,0.1)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '17px'
            }}>
              {project.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>
                {project.name}
              </Typography>
              <Chip label={project.key} size="small" sx={{
                height: 16, fontSize: '0.6rem', fontWeight: 700,
                bgcolor: 'rgba(62,207,142,0.1)', color: '#3ECF8E', mt: 0.3
              }} />
            </Box>
          </Box>
          <IconButton size="small"
            onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget) }}
            sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
            <MoreVertIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { navigate(`/projects/${project._id}`); setAnchorEl(null) }}>
              Open Project
            </MenuItem>
            <MenuItem onClick={() => { navigate(`/projects/${project._id}/board`); setAnchorEl(null) }}>
              Kanban Board
            </MenuItem>
            <MenuItem onClick={() => { onDelete(project._id); setAnchorEl(null) }}
              sx={{ color: '#EF4444' }}>
              Delete
            </MenuItem>
          </Menu>
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{
          color: 'text.secondary', mb: 2, fontSize: '0.8rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 34
        }}>
          {project.description || 'No description added yet'}
        </Typography>

        {/* Meta */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 20, height: 20, bgcolor: '#3ECF8E', fontSize: '0.6rem', color: '#0f1117', fontWeight: 700 }}>
              {project.owner?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              {project.owner?.name}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{
            color: 'text.disabled', fontSize: '0.72rem',
            bgcolor: 'rgba(255,255,255,0.04)', px: 1, py: 0.3, borderRadius: 1
          }}>
            {project.issueCount || 0} issues
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <Button fullWidth variant="outlined" size="small"
            startIcon={<FormatListBulletedIcon sx={{ fontSize: 13 }} />}
            onClick={() => navigate(`/projects/${project._id}`)}
            sx={{ fontSize: '0.75rem', py: 0.6 }}>
            Issues
          </Button>
          <Button fullWidth variant="outlined" size="small"
            startIcon={<ViewKanbanOutlinedIcon sx={{ fontSize: 13 }} />}
            onClick={() => navigate(`/projects/${project._id}/board`)}
            sx={{
              fontSize: '0.75rem', py: 0.6,
              borderColor: 'rgba(62,207,142,0.2)', color: '#3ECF8E',
              '&:hover': { bgcolor: 'rgba(62,207,142,0.05)', borderColor: '#3ECF8E' }
            }}>
            Board
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

function ProjectsPage() {
  const dispatch = useDispatch()
  const { projects, isLoading } = useSelector(state => state.projects)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { dispatch(getProjects()) }, [dispatch])

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await dispatch(deleteProject(id)).unwrap()
        showSuccess('Project deleted')
      } catch (error) {
        showError(error || 'Failed to delete project')
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.3 }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)} sx={{ fontWeight: 600 }}>
          New Project
        </Button>
      </Box>

      {isLoading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={200}
                sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && projects.length === 0 && (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '1px dashed rgba(255,255,255,0.07)',
          borderRadius: 2, bgcolor: 'background.paper'
        }}>
          <FolderOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>No projects yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.82rem' }}>
            Create your first project to get started
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
            Create Project
          </Button>
        </Box>
      )}

      {!isLoading && projects.length > 0 && (
        <Grid container spacing={2.5}>
          {projects.map(project => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard project={project} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}

export default ProjectsPage