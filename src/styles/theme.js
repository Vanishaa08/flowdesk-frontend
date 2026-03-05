import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C6EF4',
      light: '#9D92F7',
      dark: '#5B4ED4'
    },
    secondary: {
      main: '#22D3EE'
    },
    background: {
      default: '#0A0A0F',
      paper: '#111118'
    },
    text: {
      primary: '#F1F1F3',
      secondary: '#8B8B9E'
    },
    divider: 'rgba(255,255,255,0.06)'
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 18px'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C6EF4, #5B4ED4)',
          boxShadow: '0 0 20px rgba(124,110,244,0.3)',
          '&:hover': {
            boxShadow: '0 0 30px rgba(124,110,244,0.5)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(124,110,244,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#7C6EF4' }
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0D0D14',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none'
        }
      }
    }
  }
})

export default theme