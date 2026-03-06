import api from './api'

export const fetchIssues = async (projectId, filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  const response = await api.get(`/projects/${projectId}/issues?${params}`)
  return response.data
}

export const fetchIssue = async (projectId, issueId) => {
  const response = await api.get(`/projects/${projectId}/issues/${issueId}`)
  return response.data
}

export const createNewIssue = async (projectId, issueData) => {
  const response = await api.post(`/projects/${projectId}/issues`, issueData)
  return response.data
}

export const updateExistingIssue = async (projectId, issueId, issueData) => {
  const response = await api.put(`/projects/${projectId}/issues/${issueId}`, issueData)
  return response.data
}

export const updateStatus = async (projectId, issueId, status, order) => {
  const response = await api.patch(
    `/projects/${projectId}/issues/${issueId}/status`,
    { status, order }
  )
  return response.data
}

export const removeIssue = async (projectId, issueId) => {
  const response = await api.delete(`/projects/${projectId}/issues/${issueId}`)
  return response.data
}

export const postComment = async (projectId, issueId, text) => {
  const response = await api.post(
    `/projects/${projectId}/issues/${issueId}/comments`,
    { text }
  )
  return response.data
}