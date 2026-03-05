import toast from 'react-hot-toast'

const toastStyle = {
  background: '#1a1a2e',
  color: '#F1F1F3',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  fontSize: '14px',
  fontFamily: 'DM Sans, sans-serif',
  padding: '12px 16px',
}

export const showSuccess = (message) => toast.success(message, {
  style: toastStyle,
  iconTheme: { primary: '#22C55E', secondary: '#1a1a2e' },
  duration: 3000,
})

export const showError = (message) => toast.error(message, {
  style: toastStyle,
  iconTheme: { primary: '#EF4444', secondary: '#1a1a2e' },
  duration: 4000,
})

export const showInfo = (message) => toast(message, {
  style: toastStyle,
  icon: 'ℹ️',
  duration: 3000,
})

export const showPromise = (promise, messages) => toast.promise(promise, {
  loading: messages.loading || 'Loading...',
  success: messages.success || 'Done!',
  error: messages.error || 'Something went wrong',
}, { style: toastStyle })