import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { createTheme, ThemeProvider } from '@mui/material'
import App from './App.jsx'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fa',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f7fa',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)