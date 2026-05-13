import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { registerServiceWorker } from './pwa/registerServiceWorker.js'

const theme = extendTheme({
  fonts: {
    heading: "'Manrope', 'Noto Sans Devanagari', sans-serif",
    body: "'Manrope', 'Noto Sans Devanagari', sans-serif",
  },
  colors: {
    brand: {
      50: '#ecf7f6',
      100: '#d1eeeb',
      200: '#a7ddd9',
      300: '#74c8c4',
      400: '#40b2ab',
      500: '#279891',
      600: '#1e7b76',
      700: '#1a605c',
      800: '#164947',
      900: '#123635',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f7f2e8',
        color: 'gray.800',
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
)

registerServiceWorker()
