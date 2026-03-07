import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Chip, IconButton,
  LinearProgress, Avatar, Tooltip, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Skeleton
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProject } from '../store/slices/projectSlice'
import { getIssues } from '../store/slices/issueSlice'
import {
  getSprints, createSprint, startSprint,
  completeSprint, deleteSprint, addIssueToSprint
} from '../store/slices/sprintSlice'
import { showSuccess, showError } from '../utils/toast'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

const STATUS_CONFIG = {
  planned: { label: 'Planned', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
  active: { label: 'Active', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)' },
  completed: { label: 'Completed', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' }
}

const ISSUE_STATUS_COLORS = {
  todo: '#9CA3AF',
  in_progress: '#22D3EE',
  in_review: '#F59E0B',
  done: '#3ECF8E'
}

function CreateSprintModal({ open, onClose, projectId }) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.sprints)
  const [form, setForm] = useState({ name: '', goal: '', startDate: '', endDate: '' })

  const handleSubmit = async () => {
    if (!form.name) return showError('Sprint name is required')
    try {
      await dispatch(createSprint({ projectId, sprintData: form })).unwrap()
      showSuccess('Sprint created! 🏃')
      setForm({ name: '', goal: '', startDate: '', endDate: '' })
      onClose()
    } catch (error) {
      showError(error || 'Failed to create sprint')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Create Sprint</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField fullWidth label="Sprint Name" size="small" margin="normal"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Sprint 1" />
        <TextField fullWidth label="Sprint Goal (optional)" size="small" margin="normal"
          multiline rows={2} value={form.goal}
          onChange={e => setForm({ ...form, goal: e.target.value })}
          placeholder="What do you want to achieve in this sprint?" />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
          <TextField fullWidth label="Start Date" type="date" size="small"
            value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }} />
          <TextField fullWidth label="End Date" type="date" size="small"
            value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Sprint'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function SprintCard({ sprint, projectId, issues, onStart, onComplete, onDelete, onAddIssue }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const config = STATUS_CONFIG[sprint.status]

  const sprintIssues = issues.filter(issue =>
    sprint.issues?.some(si => (si._id || si) === issue._id)
  )

  const doneCount = sprintIssues.filter(i => i.status === 'done').length
  const totalCount = sprintIssues.length
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const daysLeft = sprint.endDate
    ? Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      border: `1px solid ${sprint.status === 'active' ? 'rgba(62,207,142,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 2, p: 2.5, mb: 2
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {sprint.name}
            </Typography>
            <Chip label={config.label} size="small" sx={{
              height: 18, fontSize: '0.65rem', fontWeight: 700,
              bgcolor: config.bg, color: config.color
            }} />
            {sprint.status === 'active' && daysLeft !== null && (
              <Chip
                label={daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                size="small" sx={{
                  height: 18, fontSize: '0.65rem', fontWeight: 700,
                  bgcolor: daysLeft > 0 ? 'rgba(34,211,238,0.1)' : 'rgba(239,68,68,0.1)',
                  color: daysLeft > 0 ? '#22D3EE' : '#EF4444'
                }}
              />
            )}
          </Box>
          {sprint.goal && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <FlagOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                {sprint.goal}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {sprint.status === 'planned' && (
            <Button size="small" variant="contained"
              startIcon={<PlayArrowIcon fontSize="small" />}
              onClick={() => onStart(sprint._id)}
              sx={{ fontSize: '0.75rem', py: 0.5 }}>
              Start
            </Button>
          )}
          {sprint.status === 'active' && (
            <Button size="small" variant="outlined"
              startIcon={<CheckCircleOutlineIcon fontSize="small" />}
              onClick={() => onComplete(sprint._id)}
              sx={{
                fontSize: '0.75rem', py: 0.5,
                borderColor: '#3ECF8E', color: '#3ECF8E',
                '&:hover': { bgcolor: 'rgba(62,207,142,0.05)' }
              }}>
              Complete
            </Button>
          )}
          <IconButton size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: 'text.disabled' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { onAddIssue(sprint._id); setAnchorEl(null) }}>
              Add Issue
            </MenuItem>
            {sprint.status !== 'active' && (
              <MenuItem onClick={() => { onDelete(sprint._id); setAnchorEl(null) }}
                sx={{ color: '#EF4444' }}>
                Delete Sprint
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {doneCount} of {totalCount} issues done
            </Typography>
            <Typography variant="caption" sx={{ color: '#3ECF8E', fontWeight: 700, fontSize: '0.75rem' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{
            height: 4, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': { bgcolor: '#3ECF8E', borderRadius: 2 }
          }} />
        </Box>
      )}

      {/* Issues */}
      {sprintIssues.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {sprintIssues.map(issue => (
            <Box key={issue._id} sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.2, borderRadius: 1.5,
              border: '1px solid rgba(255,255,255,0.05)',
              bgcolor: 'rgba(255,255,255,0.02)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  bgcolor: ISSUE_STATUS_COLORS[issue.status] || '#9CA3AF',
                  flexShrink: 0
                }} />
                <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 500 }}>
                  {issue.title}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={issue.priority} size="small" sx={{
                  height: 16, fontSize: '0.6rem', fontWeight: 600,
                  textTransform: 'capitalize',
                  bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary'
                }} />
                {issue.assignee && (
                  <Tooltip title={issue.assignee.name}>
                    <Avatar sx={{ width: 18, height: 18, bgcolor: '#3ECF8E', fontSize: '0.55rem', color: '#0f1117', fontWeight: 700 }}>
                      {issue.assignee.name?.charAt(0)}
                    </Avatar>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{
          textAlign: 'center', py: 3,
          border: '1px dashed rgba(255,255,255,0.06)',
          borderRadius: 1.5
        }}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            No issues in this sprint
          </Typography>
          <Box>
            <Button size="small" startIcon={<AddIcon fontSize="small" />}
              onClick={() => onAddIssue(sprint._id)}
              sx={{ color: '#3ECF8E', fontSize: '0.75rem', mt: 0.5 }}>
              Add issues
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

function AddIssueToSprintModal({ open, onClose, projectId, sprintId }) {
  const dispatch = useDispatch()
  const { issues } = useSelector(state => state.issues)
  const { sprints } = useSelector(state => state.sprints)

  const sprint = sprints.find(s => s._id === sprintId)
  const sprintIssueIds = sprint?.issues?.map(i => i._id || i) || []
  const availableIssues = issues.filter(i =>
    !sprintIssueIds.includes(i._id) && i.status !== 'done'
  )

  const handleAdd = async (issueId) => {
    try {
      await dispatch(addIssueToSprint({ projectId, sprintId, issueId })).unwrap()
      showSuccess('Issue added to sprint!')
    } catch (error) {
      showError(error || 'Failed to add issue')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Issues to Sprint</Typography>
      </DialogTitle>
      <DialogContent>
        {availableIssues.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
            No available issues to add
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {availableIssues.map(issue => (
              <Box key={issue._id} sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5, borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.07)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
              }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {issue.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                    {issue.type} · {issue.priority}
                  </Typography>
                </Box>
                <Button size="small" variant="outlined"
                  onClick={() => handleAdd(issue._id)}
                  sx={{
                    fontSize: '0.72rem', py: 0.4,
                    borderColor: 'rgba(62,207,142,0.3)', color: '#3ECF8E',
                    '&:hover': { bgcolor: 'rgba(62,207,142,0.05)' }
                  }}>
                  Add
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}

function SprintPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector(state => state.projects)
  const { sprints, isLoading } = useSelector(state => state.sprints)
  const { issues } = useSelector(state => state.issues)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [addIssueModal, setAddIssueModal] = useState({ open: false, sprintId: null })

  useEffect(() => {
    dispatch(getProject(projectId))
    dispatch(getSprints(projectId))
    dispatch(getIssues({ projectId, filters: {} }))
  }, [dispatch, projectId])

  const handleStart = async (sprintId) => {
    try {
      await dispatch(startSprint({ projectId, sprintId })).unwrap()
      showSuccess('Sprint started! 🚀')
    } catch (error) {
      showError(error || 'Failed to start sprint')
    }
  }

  const handleComplete = async (sprintId) => {
    if (window.confirm('Complete this sprint? Incomplete issues will remain in the backlog.')) {
      try {
        const result = await dispatch(completeSprint({ projectId, sprintId })).unwrap()
        showSuccess(`Sprint completed! ✅ ${result.summary.completedIssues}/${result.summary.totalIssues} issues done`)
      } catch (error) {
        showError(error || 'Failed to complete sprint')
      }
    }
  }

  const handleDelete = async (sprintId) => {
    if (window.confirm('Delete this sprint?')) {
      try {
        await dispatch(deleteSprint({ projectId, sprintId })).unwrap()
        showSuccess('Sprint deleted')
      } catch (error) {
        showError(error || 'Failed to delete sprint')
      }
    }
  }

  const activeSprints = sprints.filter(s => s.status === 'active')
  const plannedSprints = sprints.filter(s => s.status === 'planned')
  const completedSprints = sprints.filter(s => s.status === 'completed')

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton size="small" onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {currentProject?.icon} {currentProject?.name} — Sprints
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {sprints.length} sprints · {activeSprints.length} active
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}>
          New Sprint
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2].map(i => (
            <Skeleton key={i} variant="rounded" height={160}
              sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
          ))}
        </Box>
      ) : sprints.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '1px dashed rgba(255,255,255,0.07)',
          borderRadius: 2, bgcolor: 'background.paper'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>No sprints yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create your first sprint to start planning
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}>
            Create Sprint
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Active */}
          {activeSprints.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{
                color: '#3ECF8E', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.68rem', display: 'block', mb: 1.5
              }}>
                🟢 Active Sprint
              </Typography>
              {activeSprints.map(sprint => (
                <SprintCard key={sprint._id} sprint={sprint}
                  projectId={projectId} issues={issues}
                  onStart={handleStart} onComplete={handleComplete}
                  onDelete={handleDelete}
                  onAddIssue={(sprintId) => setAddIssueModal({ open: true, sprintId })}
                />
              ))}
            </Box>
          )}

          {/* Planned */}
          {plannedSprints.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.68rem', display: 'block', mb: 1.5
              }}>
                Planned
              </Typography>
              {plannedSprints.map(sprint => (
                <SprintCard key={sprint._id} sprint={sprint}
                  projectId={projectId} issues={issues}
                  onStart={handleStart} onComplete={handleComplete}
                  onDelete={handleDelete}
                  onAddIssue={(sprintId) => setAddIssueModal({ open: true, sprintId })}
                />
              ))}
            </Box>
          )}

          {/* Completed */}
          {completedSprints.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.68rem', display: 'block', mb: 1.5
              }}>
                Completed
              </Typography>
              {completedSprints.map(sprint => (
                <SprintCard key={sprint._id} sprint={sprint}
                  projectId={projectId} issues={issues}
                  onStart={handleStart} onComplete={handleComplete}
                  onDelete={handleDelete}
                  onAddIssue={(sprintId) => setAddIssueModal({ open: true, sprintId })}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      <CreateSprintModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={projectId}
      />
      <AddIssueToSprintModal
        open={addIssueModal.open}
        onClose={() => setAddIssueModal({ open: false, sprintId: null })}
        projectId={projectId}
        sprintId={addIssueModal.sprintId}
      />
    </Box>
  )
}

export default SprintPage