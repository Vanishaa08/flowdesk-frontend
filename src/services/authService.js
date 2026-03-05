import api from './api'

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData)
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData)
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}