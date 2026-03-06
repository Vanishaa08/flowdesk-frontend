import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, CircularProgress,
  IconButton, MenuItem, Select, FormControl,
  InputLabel, FormHelperText
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createIssue } from '../../store/slices/issueSlice'
import { showSuccess, showError } from '../../utils/toast'
import CloseIcon from '@mui/icons-material/Close'

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  type: z.enum(['bug', 'feature', 'task', 'improvement']),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done'])
})

const selectSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7C6EF4' }
}

function CreateIssueModal({ open, onClose, projectId, defaultStatus = 'todo' }) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.issues)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '', description: '',
      priority: 'medium', type: 'task',
      status: defaultStatus
    }
  })

  const onSubmit = async (data) => {
    try {
      await dispatch(createIssue({ projectId, issueData: data })).unwrap()
      showSuccess('Issue created! ✅')
      reset()
      onClose()
    } catch (error) {
      showError(error || 'Failed to create issue')
    }
  }

  const handleClose = () => { reset(); onClose() }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Create Issue</Typography>
        <IconButton size="small" onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {/* Title */}
          <TextField fullWidth label="Issue Title" size="small" margin="normal"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="e.g. Fix login button not working"
            autoFocus
          />

          {/* Description */}
          <TextField fullWidth label="Description (optional)" size="small" margin="normal"
            multiline rows={3}
            {...register('description')}
            placeholder="Describe the issue in detail..."
          />

          {/* Type + Priority Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <FormControl size="small" error={!!errors.type}>
              <InputLabel>Type</InputLabel>
              <Controller name="type" control={control} render={({ field }) => (
                <Select {...field} label="Type" sx={selectSx}>
                  <MenuItem value="task">📋 Task</MenuItem>
                  <MenuItem value="bug">🐛 Bug</MenuItem>
                  <MenuItem value="feature">⭐ Feature</MenuItem>
                  <MenuItem value="improvement">📈 Improvement</MenuItem>
                </Select>
              )} />
              {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
            </FormControl>

            <FormControl size="small" error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Controller name="priority" control={control} render={({ field }) => (
                <Select {...field} label="Priority" sx={selectSx}>
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                  <MenuItem value="critical">🚨 Critical</MenuItem>
                </Select>
              )} />
              {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
            </FormControl>
          </Box>

          {/* Status */}
          <FormControl size="small" fullWidth sx={{ mt: 2 }} error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Controller name="status" control={control} render={({ field }) => (
              <Select {...field} label="Status" sx={selectSx}>
                <MenuItem value="todo">📋 Todo</MenuItem>
                <MenuItem value="in_progress">⚡ In Progress</MenuItem>
                <MenuItem value="in_review">👀 In Review</MenuItem>
                <MenuItem value="done">✅ Done</MenuItem>
              </Select>
            )} />
            {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}
            sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}>
            {isLoading ? 'Creating...' : 'Create Issue'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateIssueModal