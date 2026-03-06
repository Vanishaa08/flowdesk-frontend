import { useEffect } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Chip, LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects } from '../store/slices/projectSlice'
import AddIcon from '@mui/icons-material/Add'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'

function StatCard({ icon, label, value, color, sub }) {
  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.8rem' }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {value}
            </Typography>
            {sub && (
              <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Box sx={{
            width: 38, height: 38, borderRadius: 1.5,
            bgcolor: `${color}18`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: color
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { projects } = useSelector(state => state.projects)
  const { issues } = useSelector(state => state.issues)

  useEffect(() => { dispatch(getProjects()) }, [dispatch])

  const todoCount = issues.filter(i => i.status === 'todo').length
  const inProgressCount = issues.filter(i => i.status === 'in_progress').length
  const doneCount = issues.filter(i => i.status === 'done').length
  const totalIssues = issues.length
  const progress = totalIssues > 0 ? Math.round((doneCount / totalIssues) * 100) : 0
  const recentProjects = projects.slice(0, 4)

  return (
    <Box sx={{ maxWidth: 1000 }}>
      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Here's what's happening with your projects today
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard icon={<FolderOutlinedIcon fontSize="small" />}
            label="Total Projects" value={projects.length}
            color="#3ECF8E" sub="Active workspaces" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<BugReportOutlinedIcon fontSize="small" />}
            label="Open Issues" value={todoCount + inProgressCount}
            color="#F59E0B" sub={`${todoCount} todo · ${inProgressCount} in progress`} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<TaskAltOutlinedIcon fontSize="small" />}
            label="Completed" value={doneCount}
            color="#22C55E" sub="Issues resolved" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<TrendingUpOutlinedIcon fontSize="small" />}
            label="Progress" value={`${progress}%`}
            color="#22D3EE" sub="Overall completion" />
        </Grid>
      </Grid>

      {/* Two Columns */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} md={7}>
          <Box sx={{
            bgcolor: 'background.paper',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2, p: 2.5
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Recent Projects</Typography>
              <Button size="small" onClick={() => navigate('/projects')}
                sx={{ color: '#3ECF8E', fontSize: '0.75rem' }}>
                View all
              </Button>
            </Box>

            {recentProjects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  No projects yet
                </Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />}
                  onClick={() => navigate('/projects')}>
                  Create Project
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {recentProjects.map(project => (
                  <Box key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    sx={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5, borderRadius: 1.5, cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor: 'rgba(62,207,142,0.05)',
                        border: '1px solid rgba(62,207,142,0.15)'
                      }
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: 1.5,
                        bgcolor: 'rgba(62,207,142,0.1)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '15px'
                      }}>
                        {project.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {project.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {project.issueCount || 0} issues
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label={project.key} size="small" sx={{
                      height: 18, fontSize: '0.65rem', fontWeight: 700,
                      bgcolor: 'rgba(62,207,142,0.1)', color: '#3ECF8E'
                    }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={5}>
          {/* Quick Actions */}
          <Box sx={{
            bgcolor: 'background.paper',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2, p: 2.5, mb: 2
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {[
                { label: 'New Project', icon: '📁', path: '/projects' },
                { label: 'Kanban Board', icon: '📋', path: projects[0] ? `/projects/${projects[0]._id}/board` : '/projects' },
                { label: 'Browse Issues', icon: '🐛', path: projects[0] ? `/projects/${projects[0]._id}` : '/projects' },
              ].map(action => (
                <Box key={action.label} onClick={() => navigate(action.path)} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.2, borderRadius: 1.5, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: 'rgba(62,207,142,0.05)',
                    border: '1px solid rgba(62,207,142,0.15)'
                  }
                }}>
                  <Typography sx={{ fontSize: '15px' }}>{action.icon}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.83rem' }}>
                    {action.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{
            bgcolor: 'background.paper',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2, p: 2.5
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Overall Progress
            </Typography>
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Issues completed
                </Typography>
                <Typography variant="caption" sx={{ color: '#3ECF8E', fontWeight: 700 }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{
                height: 5, borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.06)',
                '& .MuiLinearProgress-bar': { bgcolor: '#3ECF8E', borderRadius: 3 }
              }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {[
                { label: 'Todo', count: todoCount, color: '#9CA3AF' },
                { label: 'In Progress', count: inProgressCount, color: '#22D3EE' },
                { label: 'Done', count: doneCount, color: '#3ECF8E' }
              ].map(s => (
                <Box key={s.label} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: s.color }}>
                    {s.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomePage