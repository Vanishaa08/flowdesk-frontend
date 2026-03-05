import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import store from './store/index'
import theme from './styles/theme'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#F1F1F3',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
              }
            }}
          />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)