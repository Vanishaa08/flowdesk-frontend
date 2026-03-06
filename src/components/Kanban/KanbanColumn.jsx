import { Box, Typography, Chip, Button } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import AddIcon from '@mui/icons-material/Add'
import KanbanCard from './KanbanCard'

const COLUMN_CONFIG = {
  todo: {
    label: 'Todo',
    color: '#9CA3AF',
    bg: 'rgba(156,163,175,0.06)',
    border: 'rgba(156,163,175,0.15)',
    dot: '#9CA3AF'
  },
  in_progress: {
    label: 'In Progress',
    color: '#22D3EE',
    bg: 'rgba(34,211,238,0.06)',
    border: 'rgba(34,211,238,0.15)',
    dot: '#22D3EE'
  },
  in_review: {
    label: 'In Review',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.15)',
    dot: '#F59E0B'
  },
  done: {
    label: 'Done',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.06)',
    border: 'rgba(34,197,94,0.15)',
    dot: '#22C55E'
  }
}

function KanbanColumn({ status, issues, onAddIssue, onIssueClick }) {
  const config = COLUMN_CONFIG[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const issueIds = issues.map(i => i._id)

  return (
    <Box sx={{
      width: 300, minWidth: 300,
      display: 'flex', flexDirection: 'column',
      bgcolor: isOver ? config.bg : '#0f0f17',
      border: `1px solid ${isOver ? config.border : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 2.5,
      transition: 'all 0.2s ease',
      maxHeight: 'calc(100vh - 220px)'
    }}>

      {/* Column Header */}
      <Box sx={{
        px: 2, py: 1.5,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%',
            bgcolor: config.color,
            boxShadow: `0 0 6px ${config.color}80`
          }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.01em' }}>
            {config.label}
          </Typography>
        </Box>
        <Box sx={{
          minWidth: 22, height: 22, borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary' }}>
            {issues.length}
          </Typography>
        </Box>
      </Box>

      {/* Cards Area */}
      <Box ref={setNodeRef} sx={{
        p: 1.5, flexGrow: 1,
        overflowY: 'auto', minHeight: 80,
        display: 'flex', flexDirection: 'column', gap: 1.5,
        '&::-webkit-scrollbar': { width: 3 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2
        }
      }}>
        <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
          {issues.map(issue => (
            <KanbanCard
              key={issue._id}
              issue={issue}
              onClick={() => onIssueClick && onIssueClick(issue)}
            />
          ))}
        </SortableContext>

        {issues.length === 0 && (
          <Box sx={{
            height: 72, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: `1px dashed ${isOver ? config.border : 'rgba(255,255,255,0.05)'}`,
            borderRadius: 2, transition: 'all 0.2s'
          }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              {isOver ? '↓ Drop here' : 'No issues'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Button */}
      <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <Button fullWidth size="small"
          startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => onAddIssue(status)}
          sx={{
            color: 'text.disabled', justifyContent: 'flex-start',
            fontSize: '0.75rem', py: 0.6, borderRadius: 1.5,
            '&:hover': { color: config.color, bgcolor: config.bg }
          }}>
          Add issue
        </Button>
      </Box>
    </Box>
  )
}

export default KanbanColumn
export { COLUMN_CONFIG }