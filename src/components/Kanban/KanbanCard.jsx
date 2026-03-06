import { Box, Typography, Chip, Avatar, Tooltip } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import BugReportIcon from '@mui/icons-material/BugReport'
import StarIcon from '@mui/icons-material/Star'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

const PRIORITY_COLORS = {
  low: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  high: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  critical: { bg: 'rgba(139,0,0,0.15)', color: '#FF0000' }
}

const TYPE_ICONS = {
  bug: <BugReportIcon sx={{ fontSize: 12 }} />,
  feature: <StarIcon sx={{ fontSize: 12 }} />,
  task: <TaskAltIcon sx={{ fontSize: 12 }} />,
  improvement: <TrendingUpIcon sx={{ fontSize: 12 }} />
}

const TYPE_COLORS = {
  bug: '#EF4444',
  feature: '#3ECF8E',
  task: '#22D3EE',
  improvement: '#22C55E'
}

function KanbanCard({ issue, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition, opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto'
  }

  const priority = PRIORITY_COLORS[issue.priority] || PRIORITY_COLORS.medium

  return (
    <Box ref={setNodeRef} style={style} sx={{
      p: 1.8, borderRadius: 1.5,
      bgcolor: 'background.default',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: 'border-color 0.15s ease',
      position: 'relative',
      '&:hover': {
        border: '1px solid rgba(62,207,142,0.2)',
        '& .drag-handle': { opacity: 1 }
      }
    }}>

      {/* Drag Handle */}
      <Box className="drag-handle" {...attributes} {...listeners} sx={{
        position: 'absolute', top: 8, right: 8,
        opacity: 0, transition: 'opacity 0.15s',
        color: 'text.disabled', cursor: 'grab',
        display: 'flex', alignItems: 'center'
      }}>
        <DragIndicatorIcon sx={{ fontSize: 15 }} />
      </Box>

      {/* Type + Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: TYPE_COLORS[issue.type] }}>
          {TYPE_ICONS[issue.type]}
          <Typography variant="caption" sx={{
            color: TYPE_COLORS[issue.type], fontWeight: 600,
            fontSize: '0.65rem', textTransform: 'capitalize'
          }}>
            {issue.type}
          </Typography>
        </Box>
        <Chip label={issue.priority} size="small" sx={{
          height: 16, fontSize: '0.6rem', fontWeight: 700,
          textTransform: 'capitalize',
          bgcolor: priority.bg, color: priority.color
        }} />
      </Box>

      {/* Title */}
      <Typography variant="body2" onClick={onClick} sx={{
        fontWeight: 600, mb: 1.5, fontSize: '0.82rem', lineHeight: 1.4,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        cursor: 'pointer', '&:hover': { color: '#3ECF8E' }
      }}>
        {issue.title}
      </Typography>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {issue.storyPoints ? (
          <Chip label={`${issue.storyPoints} pts`} size="small" sx={{
            height: 16, fontSize: '0.6rem', fontWeight: 700,
            bgcolor: 'rgba(62,207,142,0.1)', color: '#3ECF8E'
          }} />
        ) : <Box />}
        {issue.assignee ? (
          <Tooltip title={issue.assignee.name}>
            <Avatar sx={{ width: 20, height: 20, bgcolor: '#3ECF8E', fontSize: '0.6rem', color: '#0f1117', fontWeight: 700 }}>
              {issue.assignee.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        ) : (
          <Avatar sx={{ width: 20, height: 20, bgcolor: 'rgba(255,255,255,0.06)', fontSize: '0.6rem' }}>?</Avatar>
        )}
      </Box>
    </Box>
  )
}

export default KanbanCard