import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, CircularProgress,
  IconButton
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProject } from '../../store/slices/projectSlice'
import { showSuccess, showError } from '../../utils/toast'
import CloseIcon from '@mui/icons-material/Close'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Too long'),
  key: z.string().min(1, 'Project key is required').max(10, 'Max 10 characters')
    .regex(/^[A-Za-z]+$/, 'Key can only contain letters'),
  description: z.string().max(500, 'Too long').optional()
})

const ICONS = ['📋', '⚡', '🚀', '🎯', '💡', '🔥', '🌟', '🛠️', '📱', '🎨']

function CreateProjectModal({ open, onClose }) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.projects)
  const [selectedIcon, setSelectedIcon] = useState('📋')

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', key: '', description: '' }
  })

  const handleNameChange = (e) => {
    const name = e.target.value
    setValue('name', name)
    const autoKey = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
    setValue('key', autoKey)
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(createProject({ ...data, icon: selectedIcon })).unwrap()
      showSuccess('Project created! 🎉')
      reset()
      setSelectedIcon('📋')
      onClose()
    } catch (error) {
      showError(error || 'Failed to create project')
    }
  }

  const handleClose = () => {
    reset()
    setSelectedIcon('📋')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3
        }
      }}>

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Project</Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>

          {/* Icon Picker */}
          <Typography variant="caption" sx={{
            color: 'text.secondary', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            Project Icon
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 2.5 }}>
            {ICONS.map(icon => (
              <Box key={icon} onClick={() => setSelectedIcon(icon)} sx={{
                width: 40, height: 40, borderRadius: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', transition: 'all 0.15s',
                bgcolor: selectedIcon === icon ? 'rgba(124,110,244,0.2)' : 'rgba(255,255,255,0.04)',
                border: selectedIcon === icon ? '1px solid #7C6EF4' : '1px solid transparent',
                '&:hover': { bgcolor: 'rgba(124,110,244,0.1)' }
              }}>
                {icon}
              </Box>
            ))}
          </Box>

          {/* Name */}
          <TextField fullWidth label="Project Name" size="small" margin="normal"
            {...register('name')}
            onChange={handleNameChange}
            error={!!errors.name}
            helperText={errors.name?.message}
            placeholder="e.g. FlowDesk App"
          />

          {/* Key */}
          <TextField fullWidth label="Project Key" size="small" margin="normal"
            {...register('key')}
            error={!!errors.key}
            helperText={errors.key?.message || 'Short identifier for issues (e.g. FLOW-1)'}
            placeholder="e.g. FLOW"
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />

          {/* Description */}
          <TextField fullWidth label="Description (optional)" size="small" margin="normal"
            multiline rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            placeholder="What is this project about?"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}
            sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateProjectModal