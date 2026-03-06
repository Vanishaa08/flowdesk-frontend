import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3ECF8E' },
    background: {
      default: '#0f1117',
      paper: '#1c1c24'
    },
    text: {
      primary: '#ededed',
      secondary: '#8a8a9a',
      disabled: '#4a4a5a'
    },
    divider: 'rgba(255,255,255,0.06)'
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { fontSize: '0.9rem', lineHeight: 1.6 },
    body2: { fontSize: '0.82rem', lineHeight: 1.6 }
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.85rem',
          boxShadow: 'none',
          borderRadius: 6,
          '&:hover': { boxShadow: 'none' }
        },
        contained: {
          background: '#3ECF8E',
          color: '#0f1117',
          fontWeight: 600,
          '&:hover': { background: '#36b87d' }
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.1)',
          color: '#ededed',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.04)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0f1117',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0f1117',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: '1px solid rgba(255,255,255,0.07)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
            '&.Mui-focused fieldset': { borderColor: '#3ECF8E' }
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          background: '#1c1c24',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 4 }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(255,255,255,0.04)' }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#1c1c24',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          borderRadius: 8
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          borderRadius: 4,
          margin: '2px 4px',
          '&:hover': { background: 'rgba(255,255,255,0.05)' }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, background: 'rgba(255,255,255,0.06)' },
        bar: { borderRadius: 4 }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)' }
      }
    }
  }
})

export default theme