import { useEffect, useState } from 'react'
import {
  Box, Typography, IconButton, FormControl,
  Select, MenuItem, Chip, Skeleton
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { getProject } from '../store/slices/projectSlice'
import { getSprints } from '../store/slices/sprintSlice'
import api from '../services/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        bgcolor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 1.5, p: 1.5
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          entry.value !== null && (
            <Typography key={index} variant="caption" sx={{
              color: entry.color, display: 'block', fontWeight: 600
            }}>
              {entry.name}: {entry.value} pts
            </Typography>
          )
        ))}
      </Box>
    )
  }
  return null
}

function BurndownPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector(state => state.projects)
  const { sprints } = useSelector(state => state.sprints)
  const [selectedSprintId, setSelectedSprintId] = useState('')
  const [burndownData, setBurndownData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(getProject(projectId))
    dispatch(getSprints(projectId))
  }, [dispatch, projectId])

  // Auto select active sprint
  useEffect(() => {
    if (sprints.length > 0 && !selectedSprintId) {
      const active = sprints.find(s => s.status === 'active')
      if (active) setSelectedSprintId(active._id)
      else setSelectedSprintId(sprints[0]._id)
    }
  }, [sprints, selectedSprintId])

  // Fetch burndown data when sprint selected
  useEffect(() => {
    if (!selectedSprintId) return
    const fetchBurndown = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(
          `/projects/${projectId}/sprints/${selectedSprintId}/burndown`
        )
        setBurndownData(response.data.burndown)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load burndown data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBurndown()
  }, [selectedSprintId, projectId])

  const selectedSprint = sprints.find(s => s._id === selectedSprintId)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const chartData = burndownData?.data?.map(d => ({
    ...d,
    date: formatDate(d.date)
  })) || []

  return (
    <Box sx={{ maxWidth: 1000 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton size="small"
          onClick={() => navigate(`/projects/${projectId}/sprints`)}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {currentProject?.icon} Burndown Chart
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Track sprint progress over time
          </Typography>
        </Box>

        {/* Sprint Selector */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            sx={{
              fontSize: '0.82rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3ECF8E' }
            }}>
            {sprints.map(sprint => (
              <MenuItem key={sprint._id} value={sprint._id}>
                {sprint.name}
                {sprint.status === 'active' && ' 🟢'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Sprint Info Cards */}
      {burndownData && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Points', value: burndownData.totalPoints, color: '#3ECF8E' },
            {
              label: 'Remaining',
              value: burndownData.data?.findLast(d => d.actual !== null)?.actual ?? burndownData.totalPoints,
              color: '#F59E0B'
            },
            {
              label: 'Completed',
              value: burndownData.data?.findLast(d => d.actual !== null)?.completed ?? 0,
              color: '#22D3EE'
            },
            {
              label: 'Sprint Status',
              value: selectedSprint?.status,
              color: selectedSprint?.status === 'active' ? '#3ECF8E' : '#9CA3AF',
              isChip: true
            }
          ].map(stat => (
            <Box key={stat.label} sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 2, p: 2, minWidth: 130, flexGrow: 1
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                {stat.label}
              </Typography>
              {stat.isChip ? (
                <Chip label={stat.value} size="small" sx={{
                  fontWeight: 700, fontSize: '0.75rem',
                  bgcolor: `${stat.color}18`, color: stat.color,
                  textTransform: 'capitalize'
                }} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>
                  {stat.value}
                  <Typography component="span" variant="caption"
                    sx={{ color: 'text.disabled', ml: 0.5 }}>
                    pts
                  </Typography>
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Chart */}
      <Box sx={{
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 2, p: 3
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
          Story Points Remaining
        </Typography>

        {isLoading ? (
          <Skeleton variant="rounded" height={350}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {error}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block' }}>
              Make sure the sprint has start and end dates set
            </Typography>
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No data available for this sprint
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#4a4a5a"
                tick={{ fontSize: 11, fill: '#8a8a9a' }} />
              <YAxis stroke="#4a4a5a"
                tick={{ fontSize: 11, fill: '#8a8a9a' }}
                label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: '#8a8a9a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '0.78rem', paddingTop: '16px' }}
                formatter={(value) => (
                  <span style={{ color: '#8a8a9a' }}>{value}</span>
                )}
              />

              {/* Ideal burndown line */}
              <Line
                type="monotone"
                dataKey="ideal"
                name="Ideal"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />

              {/* Actual burndown line */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#3ECF8E"
                strokeWidth={2.5}
                dot={{ fill: '#3ECF8E', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#3ECF8E' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Legend explanation */}
      <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 2, bgcolor: '#3ECF8E' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Actual remaining points
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 2, bgcolor: 'rgba(255,255,255,0.2)', borderTop: '2px dashed rgba(255,255,255,0.2)' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ideal burndown
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default BurndownPage