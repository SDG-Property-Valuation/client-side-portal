import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'

const theme = extendTheme({
  fonts: {
    heading: "'Playfair Display', 'Noto Serif Devanagari', serif",
    body: "'Sora', 'Noto Sans Devanagari', sans-serif",
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
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ChakraProvider>
  </StrictMode>,
)
