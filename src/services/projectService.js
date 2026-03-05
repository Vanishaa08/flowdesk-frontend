import api from './api'

export const fetchProjects = async () => {
  const response = await api.get('/projects')
  return response.data
}

export const fetchProject = async (id) => {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

export const createNewProject = async (projectData) => {
  const response = await api.post('/projects', projectData)
  return response.data
}

export const updateExistingProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData)
  return response.data
}

export const removeProject = async (id) => {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}