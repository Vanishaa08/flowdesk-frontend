import { useEffect, useState } from 'react'
import { Box, Typography, IconButton, Button, Chip } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { getProject } from '../store/slices/projectSlice'
import { getIssues, moveIssue, moveIssueOptimistic } from '../store/slices/issueSlice'
import { showSuccess, showError } from '../utils/toast'
import KanbanColumn from '../components/kanban/KanbanColumn'
import KanbanCard from '../components/kanban/KanbanCard'
import CreateIssueModal from '../components/issues/CreateIssueModal'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

const STATUSES = ['todo', 'in_progress', 'in_review', 'done']

function KanbanPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector(state => state.projects)
  const { issues } = useSelector(state => state.issues)
  const [activeIssue, setActiveIssue] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState('todo')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  useEffect(() => {
    dispatch(getProject(projectId))
    dispatch(getIssues({ projectId, filters: {} }))
  }, [dispatch, projectId])

  // Group issues by status
  const getIssuesByStatus = (status) =>
    issues.filter(i => i.status === status)

  const handleDragStart = (event) => {
    const { active } = event
    const issue = issues.find(i => i._id === active.id)
    setActiveIssue(issue)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveIssue(null)

    if (!over) return

    const activeIssueId = active.id
    const overStatus = over.id

    // Find the issue being dragged
    const draggedIssue = issues.find(i => i._id === activeIssueId)
    if (!draggedIssue) return

    // Check if dropped on a column (status) or another card
    let newStatus = overStatus

    // If dropped on a card, get that card's status
    if (!STATUSES.includes(overStatus)) {
      const overIssue = issues.find(i => i._id === overStatus)
      if (overIssue) newStatus = overIssue.status
    }

    // No change
    if (draggedIssue.status === newStatus) return

    // Optimistic update — update UI immediately
    dispatch(moveIssueOptimistic({ issueId: activeIssueId, newStatus }))

    // Then update in backend
    try {
      await dispatch(moveIssue({
        projectId,
        issueId: activeIssueId,
        status: newStatus,
        order: getIssuesByStatus(newStatus).length
      })).unwrap()
    } catch (error) {
      showError('Failed to move issue')
      // Revert by refetching
      dispatch(getIssues({ projectId, filters: {} }))
    }
  }

  const handleAddIssue = (status) => {
    setDefaultStatus(status)
    setModalOpen(true)
  }

  return (
    <Box sx={{ height: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton size="small" onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentProject?.icon} {currentProject?.name}
            </Typography>
            <Chip label="Kanban" size="small" sx={{
              height: 20, fontSize: '0.65rem', fontWeight: 700,
              bgcolor: 'rgba(124,110,244,0.15)', color: '#7C6EF4'
            }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {issues.length} issues · Drag cards to update status
          </Typography>
        </Box>

        {/* View Toggle */}
        <IconButton size="small"
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }}>
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ flexGrow: 1, overflowX: 'auto', pb: 2 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Box sx={{ display: 'flex', gap: 2, height: '100%', minWidth: 'max-content' }}>
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                issues={getIssuesByStatus(status)}
                onAddIssue={handleAddIssue}
                onIssueClick={(issue) => console.log('clicked', issue)}
              />
            ))}
          </Box>

          {/* Drag Overlay — shows card while dragging */}
          <DragOverlay>
            {activeIssue ? (
              <Box sx={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
                <KanbanCard issue={activeIssue} />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>

      {/* Create Issue Modal */}
      <CreateIssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        defaultStatus={defaultStatus}
      />
    </Box>
  )
}

export default KanbanPage