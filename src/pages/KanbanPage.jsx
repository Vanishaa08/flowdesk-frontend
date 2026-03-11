import { useEffect, useState, useCallback } from 'react'
import {
  Box, Typography, IconButton, Chip, Avatar, Tooltip
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { getProject } from '../store/slices/projectSlice'
import { getIssues, moveIssueOptimistic } from '../store/slices/issueSlice'
import { moveIssue } from '../store/slices/issueSlice'
import KanbanColumn from '../components/kanban/KanbanColumn'
import KanbanCard from '../components/kanban/KanbanCard'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  connectSocket, disconnectSocket, joinProject,
  leaveProject, emitIssueMoved, getSocket
} from '../services/socketService'

const COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#9CA3AF' },
  { id: 'in_progress', label: 'In Progress', color: '#22D3EE' },
  { id: 'in_review', label: 'In Review', color: '#F59E0B' },
  { id: 'done', label: 'Done', color: '#3ECF8E' }
]

function KanbanPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector(state => state.projects)
  const { issues } = useSelector(state => state.issues)
  const { token, user } = useSelector(state => state.auth)
  const [activeIssue, setActiveIssue] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    dispatch(getProject(projectId))
    dispatch(getIssues({ projectId, filters: {} }))
  }, [dispatch, projectId])

  // Socket.io setup
  useEffect(() => {
    const socket = connectSocket(token)
    joinProject(projectId)

    // Tell others I'm online
    socket.emit('user_online', {
      projectId,
      user: { _id: user?._id, name: user?.name }
    })

    // Listen for issue moved by others
    socket.on('issue_moved', (data) => {
      if (data.projectId === projectId) {
        dispatch(moveIssueOptimistic({
          issueId: data.issueId,
          newStatus: data.newStatus
        }))
      }
    })

    // Listen for issue created by others
    socket.on('issue_created', (data) => {
      if (data.projectId === projectId) {
        dispatch(getIssues({ projectId, filters: {} }))
      }
    })

    // Listen for issue deleted by others
    socket.on('issue_deleted', (data) => {
      if (data.projectId === projectId) {
        dispatch(getIssues({ projectId, filters: {} }))
      }
    })

    // Listen for online users
    socket.on('user_online', (data) => {
      if (data.projectId === projectId) {
        setOnlineUsers(prev => {
          const exists = prev.find(u => u._id === data.user._id)
          if (exists) return prev
          return [...prev, data.user]
        })
      }
    })

    return () => {
      leaveProject(projectId)
      const s = getSocket()
      if (s) {
        s.off('issue_moved')
        s.off('issue_created')
        s.off('issue_deleted')
        s.off('user_online')
      }
    }
  }, [projectId, token])

  const handleDragStart = (event) => {
    const issue = issues.find(i => i._id === event.active.id)
    setActiveIssue(issue)
  }

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event
    setActiveIssue(null)
    if (!over) return

    const issue = issues.find(i => i._id === active.id)
    if (!issue) return

    const newStatus = over.id
    if (issue.status === newStatus) return

    // Optimistic update
    dispatch(moveIssueOptimistic({ issueId: issue._id, newStatus }))

    // Emit to other users via socket
    emitIssueMoved(projectId, issue._id, newStatus)

    // Update backend
    try {
      await dispatch(moveIssue({
        projectId,
        issueId: issue._id,
        newStatus
      })).unwrap()
    } catch (error) {
      // Revert on failure
      dispatch(moveIssueOptimistic({ issueId: issue._id, newStatus: issue.status }))
    }
  }, [issues, projectId, dispatch])

  const getColumnIssues = (status) =>
    issues.filter(i => i.status === status)

  return (
    <Box sx={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexShrink: 0 }}>
        <IconButton size="small"
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {currentProject?.icon} {currentProject?.name} — Board
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {issues.length} issues
          </Typography>
        </Box>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              bgcolor: '#3ECF8E',
              boxShadow: '0 0 6px #3ECF8E'
            }} />
            <Typography variant="caption" sx={{ color: '#3ECF8E', fontWeight: 600 }}>
              {onlineUsers.length} online
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {onlineUsers.slice(0, 3).map(u => (
                <Tooltip key={u._id} title={u.name}>
                  <Avatar sx={{
                    width: 22, height: 22,
                    bgcolor: '#3ECF8E', fontSize: '0.6rem',
                    color: '#0f1117', fontWeight: 700
                  }}>
                    {u.name?.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}

        <Chip
          label="⚡ Live"
          size="small"
          sx={{
            bgcolor: 'rgba(62,207,142,0.1)',
            color: '#3ECF8E',
            fontWeight: 700,
            fontSize: '0.72rem',
            height: 22
          }}
        />
      </Box>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          flexGrow: 1,
          overflow: 'hidden'
        }}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              issues={getColumnIssues(col.id)}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeIssue && (
            <Box sx={{ transform: 'rotate(3deg)', opacity: 0.95 }}>
              <KanbanCard issue={activeIssue} />
            </Box>
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  )
}

export default KanbanPage