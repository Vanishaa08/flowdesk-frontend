import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000'

let socket = null

export const connectSocket = (token) => {
  if (socket?.connected) return socket

  console.log('Connecting socket to:', SOCKET_URL)

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  })

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.log('❌ Socket error:', error.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const joinProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('join_project', projectId)
    console.log('Joined project room:', projectId)
  }
}

export const leaveProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('leave_project', projectId)
  }
}

export const emitIssueMoved = (projectId, issueId, newStatus) => {
  if (socket?.connected) {
    socket.emit('issue_moved', { projectId, issueId, newStatus })
  }
}

export const emitIssueCreated = (projectId, issue) => {
  if (socket?.connected) {
    socket.emit('issue_created', { projectId, issue })
  }
}

export const emitIssueDeleted = (projectId, issueId) => {
  if (socket?.connected) {
    socket.emit('issue_deleted', { projectId, issueId })
  }
}
