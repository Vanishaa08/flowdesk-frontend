import api from './api'

export const testConnection = async () => {
  try {
    const response = await api.get('/test/public')
    console.log(' Backend connected:', response.data)
    
    const healthResponse = await fetch('/health')
    const healthData = await healthResponse.json()
    console.log(' Health check:', healthData)
    
    return { success: true }
  } catch (error) {
    console.error(' Connection failed:', error.message)
    return { success: false, error: error.message }
  }
}