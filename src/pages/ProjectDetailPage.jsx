import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  MenuItem, Select, FormControl, Skeleton, Tooltip
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProject } from '../store/slices/projectSlice'
import { getIssues, deleteIssue } from '../store/slices/issueSlice'
import { showSuccess, showError } from '../utils/toast'
import CreateIssueModal from '../components/issues/CreateIssueModal'
import IssueDetailModal from '../components/issues/IssueDetailModal'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

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

function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector(state => state.projects)
  const { issues, isLoading } = useSelector(state => state.issues)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [view, setView] = useState('list')

  useEffect(() => {
    dispatch(getProject(projectId))
    dispatch(getIssues({ projectId, filters: {} }))
  }, [dispatch, projectId])

  // Keep selectedIssue in sync with Redux updates
  useEffect(() => {
    if (selectedIssue) {
      const updated = issues.find(i => i._id === selectedIssue._id)
      if (updated) setSelectedIssue(updated)
    }
  }, [issues])

  const handleDelete = async (issueId) => {
    if (window.confirm('Delete this issue?')) {
      try {
        await dispatch(deleteIssue({ projectId, issueId })).unwrap()
        showSuccess('Issue deleted')
        setSelectedIssue(null)
      } catch (error) {
        showError(error || 'Failed to delete issue')
      }
    }
  }

  const filteredIssues = issues.filter(issue => {
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false
    return true
  })

  const selectSx = {
    height: 34, fontSize: '0.8rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3ECF8E' }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton size="small" onClick={() => navigate('/projects')}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontSize: '1.4rem' }}>
            {currentProject?.icon}
          </Typography>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {currentProject?.name || 'Loading...'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {currentProject?.key} · {issues.length} issues
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}>
          Add Issue
        </Button>
      </Box>

      {/* Filters + View Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)} sx={selectSx}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="in_review">In Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)} sx={selectSx}>
            <MenuItem value="all">All Priority</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>

        {/* View Toggle */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="List View">
            <IconButton size="small" onClick={() => setView('list')}
              sx={{
                bgcolor: view === 'list' ? 'rgba(62,207,142,0.1)' : 'transparent',
                color: view === 'list' ? '#3ECF8E' : 'text.secondary'
              }}>
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Kanban Board">
            <IconButton size="small"
              onClick={() => navigate(`/projects/${projectId}/board`)}
              sx={{ color: 'text.secondary', '&:hover': { color: '#3ECF8E' } }}>
              <ViewKanbanOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sprints">
            <IconButton size="small"
              onClick={() => navigate(`/projects/${projectId}/sprints`)}
              sx={{ color: 'text.secondary', '&:hover': { color: '#3ECF8E' } }}>
              <FlagOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Issues Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1,2,3,4].map(i => (
            <Skeleton key={i} variant="rounded" height={52}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          ))}
        </Box>
      ) : filteredIssues.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '1px dashed rgba(255,255,255,0.07)',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No issues found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try changing your filters'
              : 'Create your first issue to get started'}
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}>
            Add Issue
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{
          bgcolor: 'background.paper',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 2
        }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Type', 'Title', 'Status', 'Priority', 'Assignee', 'Created', ''].map(h => (
                  <TableCell key={h} sx={{
                    color: 'text.secondary', fontWeight: 700,
                    fontSize: '0.72rem', textTransform: 'uppercase',
                    letterSpacing: '0.06em', py: 1.5
                  }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIssues.map((issue) => {
                const status = STATUS_COLORS[issue.status]
                const priority = PRIORITY_COLORS[issue.priority]
                return (
                  <TableRow key={issue._id} hover
                    onClick={() => setSelectedIssue(issue)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                    }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip label={issue.type} size="small" sx={{
                        height: 18, fontSize: '0.62rem', fontWeight: 700,
                        textTransform: 'capitalize',
                        bgcolor: 'rgba(62,207,142,0.08)', color: '#3ECF8E'
                      }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, maxWidth: 300 }}>
                      <Typography variant="body2" sx={{
                        fontWeight: 600, fontSize: '0.85rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {issue.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip label={status?.label} size="small" sx={{
                        height: 18, fontSize: '0.62rem', fontWeight: 700,
                        bgcolor: status?.bg, color: status?.color
                      }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip label={issue.priority} size="small" sx={{
                        height: 18, fontSize: '0.62rem', fontWeight: 700,
                        textTransform: 'capitalize',
                        bgcolor: priority?.bg, color: priority?.color
                      }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {issue.assignee ? (
                        <Tooltip title={issue.assignee.name}>
                          <Avatar sx={{ width: 22, height: 22, bgcolor: '#3ECF8E', fontSize: '0.65rem', color: '#0f1117', fontWeight: 700 }}>
                            {issue.assignee.name?.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <IconButton size="small"
                        onClick={(e) => { e.stopPropagation(); handleDelete(issue._id) }}
                        sx={{ color: 'text.disabled', '&:hover': { color: '#EF4444' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateIssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
      />

      <IssueDetailModal
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
        projectId={projectId}
      />
    </Box>
  )
}

export default ProjectDetailPage