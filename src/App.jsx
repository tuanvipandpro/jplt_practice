import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Box } from '@mui/material'
import './App.css'
import LevelSelection from './components/LevelSelection'
import ModeSelection from './components/ModeSelection'
import TestMode from './components/TestMode'
import PracticeMode from './components/PracticeMode'

// Tạo theme Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

function App() {
  const [currentView, setCurrentView] = useState('level') // level, mode, test, practice
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setCurrentView('mode')
  }

  const handleModeSelect = (mode) => {
    setSelectedMode(mode)
    setCurrentView(mode)
  }

  const handleBack = () => {
    if (currentView === 'mode') {
      setCurrentView('level')
      setSelectedLevel(null)
    } else if (currentView === 'test' || currentView === 'practice') {
      setCurrentView('mode')
      setSelectedMode(null)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'level':
        return <LevelSelection onLevelSelect={handleLevelSelect} />
      case 'mode':
        return (
          <ModeSelection 
            level={selectedLevel}
            onModeSelect={handleModeSelect}
            onBack={handleBack}
          />
        )
      case 'test':
        return (
          <TestMode 
            level={selectedLevel}
            onBack={handleBack}
          />
        )
      case 'practice':
        return (
          <PracticeMode 
            level={selectedLevel}
            onBack={handleBack}
          />
        )
      default:
        return <LevelSelection onLevelSelect={handleLevelSelect} />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        className="app"
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box 
          className="app-header"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: 2,
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1>日本語学習</h1>
          <p>Japanese Learning App</p>
        </Box>
        <Container 
          className="app-main"
          maxWidth="lg"
          sx={{
            flex: 1,
            padding: { xs: 1, sm: 2 },
            py: 2,
          }}
        >
          {renderCurrentView()}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
