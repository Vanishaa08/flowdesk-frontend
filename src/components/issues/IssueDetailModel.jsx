import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, Box,
  Typography, Chip, Avatar, IconButton, TextField,
  Button, Select, MenuItem, FormControl, Divider,
  CircularProgress, Tooltip
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updateIssue, addComment } from '../../store/slices/issueSlice'
import { showSuccess, showError } from '../../utils/toast'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import SendIcon from '@mui/icons-material/Send'

const PRIORITY_COLORS = {
  low: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  high: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  critical: { bg: 'rgba(139,0,0,0.15)', color: '#FF0000' }
}

const STATUS_COLORS = {
  todo: { bg: 'rgba(156,163,175,0.1)', color: '#9CA3AF', label: 'Todo' },
  in_progress: { bg: 'rgba(34,211,238,0.1)', color: '#22D3EE', label: 'In Progress' },
  in_review: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'In Review' },
  done: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'Done' }
}

const selectSx = {
  fontSize: '0.82rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3ECF8E' }
}

function IssueDetailModal({ open, onClose, issue, projectId }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isLoading } = useSelector(state => state.issues)

  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [storyPoints, setStoryPoints] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (issue) {
      setTitle(issue.title || '')
      setDescription(issue.description || '')
      setStatus(issue.status || 'todo')
      setPriority(issue.priority || 'medium')
      setStoryPoints(issue.storyPoints || 0)
    }
  }, [issue])

  if (!issue) return null

  const handleSaveTitle = async () => {
    if (!title.trim()) return
    try {
      await dispatch(updateIssue({
        projectId, issueId: issue._id,
        issueData: { title }
      })).unwrap()
      showSuccess('Title updated!')
      setEditingTitle(false)
    } catch (error) {
      showError(error || 'Failed to update')
    }
  }

  const handleSaveDesc = async () => {
    try {
      await dispatch(updateIssue({
        projectId, issueId: issue._id,
        issueData: { description }
      })).unwrap()
      showSuccess('Description updated!')
      setEditingDesc(false)
    } catch (error) {
      showError(error || 'Failed to update')
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    try {
      await dispatch(updateIssue({
        projectId, issueId: issue._id,
        issueData: { status: newStatus }
      })).unwrap()
      showSuccess('Status updated!')
    } catch (error) {
      showError(error || 'Failed to update')
    }
  }

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority)
    try {
      await dispatch(updateIssue({
        projectId, issueId: issue._id,
        issueData: { priority: newPriority }
      })).unwrap()
      showSuccess('Priority updated!')
    } catch (error) {
      showError(error || 'Failed to update')
    }
  }

  const handleStoryPointsChange = async (newPoints) => {
    setStoryPoints(newPoints)
    try {
      await dispatch(updateIssue({
        projectId, issueId: issue._id,
        issueData: { storyPoints: newPoints }
      })).unwrap()
      showSuccess('Story points updated!')
    } catch (error) {
      showError(error || 'Failed to update')
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    setSubmittingComment(true)
    try {
      await dispatch(addComment({
        projectId, issueId: issue._id,
        text: comment
      })).unwrap()
      showSuccess('Comment added!')
      setComment('')
    } catch (error) {
      showError(error || 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const statusConfig = STATUS_COLORS[status]
  const priorityConfig = PRIORITY_COLORS[priority]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { bgcolor: '#1c1c24', borderRadius: 2, border: '1px solid rgba(255,255,255,0.07)' } }}>

      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip label={issue.type} size="small" sx={{
                height: 18, fontSize: '0.62rem', fontWeight: 700,
                textTransform: 'capitalize',
                bgcolor: 'rgba(62,207,142,0.08)', color: '#3ECF8E'
              }} />
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                #{issue._id?.slice(-6).toUpperCase()}
              </Typography>
            </Box>

            {/* Editable Title */}
            {editingTitle ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth size="small" value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: 700 } }}
                />
                <IconButton size="small" onClick={handleSaveTitle} sx={{ color: '#3ECF8E' }}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setEditingTitle(false)} sx={{ color: 'text.disabled' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                onClick={() => setEditingTitle(true)}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.3 }}>
                  {title}
                </Typography>
                <EditIcon sx={{ fontSize: 14, color: 'text.disabled', opacity: 0.5 }} />
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.disabled', mt: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 3 }}>

          {/* Left — Description + Comments */}
          <Box>
            {/* Description */}
            <Typography variant="caption" sx={{
              color: 'text.disabled', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontSize: '0.68rem', display: 'block', mb: 1
            }}>
              Description
            </Typography>

            {editingDesc ? (
              <Box>
                <TextField fullWidth multiline rows={4} size="small"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  autoFocus
                  placeholder="Add a description..."
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button size="small" variant="contained" onClick={handleSaveDesc}>
                    Save
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setEditingDesc(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box onClick={() => setEditingDesc(true)} sx={{
                p: 1.5, borderRadius: 1.5, cursor: 'pointer', minHeight: 60,
                border: '1px solid rgba(255,255,255,0.05)',
                bgcolor: 'rgba(255,255,255,0.02)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
              }}>
                <Typography variant="body2" sx={{
                  color: description ? 'text.primary' : 'text.disabled',
                  fontSize: '0.85rem', lineHeight: 1.6
                }}>
                  {description || 'Click to add description...'}
                </Typography>
              </Box>
            )}

            {/* Comments */}
            <Typography variant="caption" sx={{
              color: 'text.disabled', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontSize: '0.68rem', display: 'block', mt: 3, mb: 1.5
            }}>
              Comments ({issue.comments?.length || 0})
            </Typography>

            {/* Add Comment */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#3ECF8E', fontSize: '0.7rem', color: '#0f1117', fontWeight: 700, flexShrink: 0 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <TextField fullWidth multiline rows={2} size="small"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <Button
                  size="small" variant="contained"
                  onClick={handleAddComment}
                  disabled={!comment.trim() || submittingComment}
                  endIcon={submittingComment
                    ? <CircularProgress size={12} color="inherit" />
                    : <SendIcon fontSize="small" />}
                  sx={{ mt: 1, fontSize: '0.75rem' }}
                >
                  Comment
                </Button>
              </Box>
            </Box>

            {/* Comments List */}
            {issue.comments?.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {issue.comments.map((c, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#3ECF8E', fontSize: '0.7rem', color: '#0f1117', fontWeight: 700, flexShrink: 0 }}>
                      {c.user?.name?.charAt(0) || '?'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                          {c.user?.name || 'User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{
                        p: 1.2, borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '0.83rem', lineHeight: 1.5 }}>
                          {c.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                No comments yet
              </Typography>
            )}
          </Box>

          {/* Right — Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Status */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={status} onChange={e => handleStatusChange(e.target.value)} sx={selectSx}>
                  <MenuItem value="todo">📋 Todo</MenuItem>
                  <MenuItem value="in_progress">⚡ In Progress</MenuItem>
                  <MenuItem value="in_review">👀 In Review</MenuItem>
                  <MenuItem value="done">✅ Done</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Priority */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Priority
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={priority} onChange={e => handlePriorityChange(e.target.value)} sx={selectSx}>
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                  <MenuItem value="critical">🚨 Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Story Points */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Story Points
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={storyPoints} onChange={e => handleStoryPointsChange(e.target.value)} sx={selectSx}>
                  {[0,1,2,3,5,8,13,21].map(pt => (
                    <MenuItem key={pt} value={pt}>
                      {pt === 0 ? '— No estimate' : `${pt} points`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Assignee */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Assignee
              </Typography>
              {issue.assignee ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#3ECF8E', fontSize: '0.65rem', color: '#0f1117', fontWeight: 700 }}>
                    {issue.assignee.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                    {issue.assignee.name}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  Unassigned
                </Typography>
              )}
            </Box>

            {/* Reporter */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Reporter
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: '#3ECF8E', fontSize: '0.65rem', color: '#0f1117', fontWeight: 700 }}>
                  {issue.reporter?.name?.charAt(0) || '?'}
                </Avatar>
                <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                  {issue.reporter?.name || 'Unknown'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Dates */}
            <Box>
              <Typography variant="caption" sx={{
                color: 'text.disabled', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontSize: '0.65rem', display: 'block', mb: 0.8
              }}>
                Created
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {new Date(issue.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </Typography>
            </Box>

            {issue.completedAt && (
              <Box>
                <Typography variant="caption" sx={{
                  color: 'text.disabled', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontSize: '0.65rem', display: 'block', mb: 0.8
                }}>
                  Completed
                </Typography>
                <Typography variant="caption" sx={{ color: '#3ECF8E' }}>
                  {new Date(issue.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IssueDetailModal