import api from './api'

export const fetchSprints = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/sprints`)
  return response.data
}

export const fetchSprint = async (projectId, sprintId) => {
  const response = await api.get(`/projects/${projectId}/sprints/${sprintId}`)
  return response.data
}

export const createNewSprint = async (projectId, sprintData) => {
  const response = await api.post(`/projects/${projectId}/sprints`, sprintData)
  return response.data
}

export const updateExistingSprint = async (projectId, sprintId, sprintData) => {
  const response = await api.put(`/projects/${projectId}/sprints/${sprintId}`, sprintData)
  return response.data
}

export const startExistingSprint = async (projectId, sprintId) => {
  const response = await api.patch(`/projects/${projectId}/sprints/${sprintId}/start`)
  return response.data
}

export const completeExistingSprint = async (projectId, sprintId) => {
  const response = await api.patch(`/projects/${projectId}/sprints/${sprintId}/complete`)
  return response.data
}

export const addIssueToExistingSprint = async (projectId, sprintId, issueId) => {
  const response = await api.post(`/projects/${projectId}/sprints/${sprintId}/issues`, { issueId })
  return response.data
}

export const removeIssueFromExistingSprint = async (projectId, sprintId, issueId) => {
  const response = await api.delete(`/projects/${projectId}/sprints/${sprintId}/issues/${issueId}`)
  return response.data
}

export const removeExistingSprint = async (projectId, sprintId) => {
  const response = await api.delete(`/projects/${projectId}/sprints/${sprintId}`)
  return response.data
}