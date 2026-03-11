import { Box, Typography, Chip } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

const COLUMN_CONFIG = {
  todo: { bg: 'rgba(156,163,175,0.08)', color: '#9CA3AF', border: 'rgba(156,163,175,0.15)' },
  in_progress: { bg: 'rgba(34,211,238,0.08)', color: '#22D3EE', border: 'rgba(34,211,238,0.15)' },
  in_review: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.15)' },
  done: { bg: 'rgba(62,207,142,0.08)', color: '#3ECF8E', border: 'rgba(62,207,142,0.15)' }
}

function KanbanColumn({ column, issues }) {
  const config = COLUMN_CONFIG[column.id] || COLUMN_CONFIG.todo

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: isOver ? config.bg : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isOver ? config.border : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 2,
      transition: 'all 0.2s ease',
      overflow: 'hidden'
    }}>
      {/* Column Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        p: 2, pb: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%',
            bgcolor: config.color
          }} />
          <Typography variant="subtitle2" sx={{
            fontWeight: 700, fontSize: '0.8rem',
            color: config.color, textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            {column.label}
          </Typography>
        </Box>
        <Chip label={issues.length} size="small" sx={{
          height: 18, fontSize: '0.65rem', fontWeight: 700,
          bgcolor: config.bg, color: config.color,
          minWidth: 24
        }} />
      </Box>

      {/* Cards */}
      <Box
        ref={setNodeRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 100,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 2
          }
        }}
      >
        <SortableContext
          items={issues.map(i => i._id)}
          strategy={verticalListSortingStrategy}
        >
          {issues.map(issue => (
            <KanbanCard key={issue._id} issue={issue} />
          ))}
        </SortableContext>

        {issues.length === 0 && (
          <Box sx={{
            textAlign: 'center', py: 4,
            border: '1px dashed rgba(255,255,255,0.06)',
            borderRadius: 1.5, mt: 1
          }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              Drop issues here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default KanbanColumn