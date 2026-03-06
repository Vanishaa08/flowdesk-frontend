import { Box, Typography, Chip, Avatar, Tooltip } from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import StarIcon from '@mui/icons-material/Star'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const PRIORITY_COLORS = {
  low: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'Low' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'Medium' },
  high: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'High' },
  critical: { bg: 'rgba(139,0,0,0.15)', color: '#FF0000', label: 'Critical' }
}

const TYPE_ICONS = {
  bug: <BugReportIcon sx={{ fontSize: 14 }} />,
  feature: <StarIcon sx={{ fontSize: 14 }} />,
  task: <TaskAltIcon sx={{ fontSize: 14 }} />,
  improvement: <TrendingUpIcon sx={{ fontSize: 14 }} />
}

const TYPE_COLORS = {
  bug: '#EF4444',
  feature: '#7C6EF4',
  task: '#22D3EE',
  improvement: '#22C55E'
}

function IssueCard({ issue, onClick }) {
  const priority = PRIORITY_COLORS[issue.priority] || PRIORITY_COLORS.medium

  return (
    <Box onClick={() => onClick && onClick(issue)} sx={{
      p: 2, borderRadius: 2, cursor: 'pointer',
      bgcolor: 'background.default',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.15s ease',
      '&:hover': {
        border: '1px solid rgba(124,110,244,0.3)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }
    }}>
      {/* Type + Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: TYPE_COLORS[issue.type] }}>
          {TYPE_ICONS[issue.type]}
          <Typography variant="caption" sx={{ color: TYPE_COLORS[issue.type], fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }}>
            {issue.type}
          </Typography>
        </Box>
        <Chip label={priority.label} size="small" sx={{
          height: 18, fontSize: '0.65rem', fontWeight: 700,
          bgcolor: priority.bg, color: priority.color,
          border: `1px solid ${priority.color}33`
        }} />
      </Box>

      {/* Title */}
      <Typography variant="body2" sx={{
        fontWeight: 600, mb: 1.5, lineHeight: 1.4,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {issue.title}
      </Typography>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
          {new Date(issue.createdAt).toLocaleDateString()}
        </Typography>
        {issue.assignee ? (
          <Tooltip title={issue.assignee.name}>
            <Avatar sx={{ width: 22, height: 22, bgcolor: '#7C6EF4', fontSize: '0.65rem' }}>
              {issue.assignee.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        ) : (
          <Avatar sx={{ width: 22, height: 22, bgcolor: 'rgba(255,255,255,0.08)', fontSize: '0.65rem' }}>
            ?
          </Avatar>
        )}
      </Box>
    </Box>
  )
}

export default IssueCard
export { PRIORITY_COLORS, TYPE_COLORS, TYPE_ICONS }