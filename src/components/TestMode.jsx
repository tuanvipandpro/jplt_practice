import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Translate,
  Language,
  School,
  Headphones,
  CheckCircle,
  PlayArrow,
  Block,
  SmartToy
} from '@mui/icons-material'
import HiraganaTest from './HiraganaTest'
import KatakanaTest from './KatakanaTest'
import GrammarTest from './GrammarTest'
import KanjiTest from './KanjiTest'
import ExamManager from './ExamManager'
import GrammarExam from './GrammarExam'

const TestMode = ({ level, onBack }) => {
  const [currentTest, setCurrentTest] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [showExamManager, setShowExamManager] = useState(false)
  const [currentExam, setCurrentExam] = useState(null)

  const testTypes = [
    {
      id: 'hiragana',
      name: 'Test Hiragana',
      description: 'Kiểm tra bảng chữ cái Hiragana',
      icon: <Language />,
      color: '#2196F3',
      available: true
    },
    {
      id: 'katakana',
      name: 'Test Katakana',
      description: 'Kiểm tra bảng chữ cái Katakana',
      icon: <Translate />,
      color: '#FF9800',
      available: true
    },
    {
      id: 'kanji',
      name: 'Hán tự',
      description: 'Kiểm tra Hán tự N5',
      icon: <Translate />,
      color: '#F44336',
      available: true
    },
    {
      id: 'grammar',
      name: 'Ngữ pháp',
      description: 'Kiểm tra ngữ pháp cơ bản',
      icon: <Edit />,
      color: '#9C27B0',
      available: true
    },
    {
      id: 'grammar-exam',
      name: 'Bộ đề thi AI',
      description: 'Làm bài thi với câu hỏi được tạo bởi AI',
      icon: <SmartToy />,
      color: '#FF5722',
      available: true
    },
    {
      id: 'vocabulary',
      name: 'Từ vựng',
      description: 'Kiểm tra từ vựng N5',
      icon: <School />,
      color: '#FF9800',
      available: false
    },
    {
      id: 'listening',
      name: 'Nghe hiểu',
      description: 'Kiểm tra kỹ năng nghe',
      icon: <Headphones />,
      color: '#4CAF50',
      available: false
    }
  ]

  const startTest = (testType) => {
    if (!testType.available) return
    
    if (testType.id === 'grammar-exam') {
      setShowExamManager(true)
    } else {
      setCurrentTest(testType)
    }
  }

  const finishTest = (results) => {
    setTestResults(results)
    setCurrentTest(null)
  }

  const handleBackFromTest = () => {
    setCurrentTest(null)
    setCurrentExam(null)
  }

  const handleStartExam = (exam) => {
    setCurrentExam(exam)
    setShowExamManager(false)
  }

  // Render specific test components
  if (currentTest) {
    if (currentTest.id === 'hiragana') {
      return <HiraganaTest onBack={handleBackFromTest} onFinish={finishTest} />
    }
    if (currentTest.id === 'katakana') {
      return <KatakanaTest onBack={handleBackFromTest} onFinish={finishTest} />
    }
    if (currentTest.id === 'grammar') {
      return <GrammarTest onBack={handleBackFromTest} onFinish={finishTest} />
    }
    if (currentTest.id === 'kanji') {
      return <KanjiTest onBack={handleBackFromTest} onFinish={finishTest} />
    }
    
    // Fallback for other tests (not implemented yet)
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          mb: 4
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackFromTest}
            sx={{
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            Test: {currentTest.name}
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
        </Box>

        <Paper elevation={8} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Test đang được phát triển...
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => finishTest({ score: 85, total: 100 })}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#45a049',
                },
              }}
            >
              Kết thúc test (Demo)
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Render exam components
  if (currentExam) {
    return <GrammarExam exam={currentExam} onBack={handleBackFromTest} onFinish={finishTest} />
  }

  if (testResults) {
    const percentage = Math.round((testResults.score / testResults.total) * 100)
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          mb: 4
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => setTestResults(null)}
            sx={{
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            Kết quả test
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
        </Box>

        <Paper elevation={8} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom>
              Điểm số: {testResults.score}/{testResults.total}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4CAF50',
                }
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={() => setTestResults(null)}
            sx={{
              bgcolor: '#2196F3',
              '&:hover': {
                bgcolor: '#1976D2',
              },
            }}
          >
            Làm test khác
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          mb: 4
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Quay lại
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Chế độ làm test
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Trình độ: {level.name}
            </Typography>
          </Box>
          <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
        </Box>

        <Grid container spacing={3} direction="column">
          {testTypes.map((test) => (
            <Grid item key={test.id}>
              <Card
                sx={{
                  cursor: test.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  border: 3,
                  borderColor: 'transparent',
                  opacity: test.available ? 1 : 0.6,
                  '&:hover': test.available ? {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: test.color,
                  } : {},
                }}
                onClick={() => startTest(test)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: test.available ? test.color : 'grey.400',
                        fontSize: '1.5rem',
                      }}
                    >
                      {test.available ? test.icon : <Block />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {test.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {test.description}
                      </Typography>
                      {!test.available && (
                        <Chip
                          label="Đang phát triển"
                          size="small"
                          sx={{ 
                            bgcolor: 'grey.500', 
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h4" color="text.disabled">
                      {test.available ? '→' : '🚧'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Exam Manager Dialog */}
      <ExamManager
        open={showExamManager}
        onClose={() => setShowExamManager(false)}
        onStartExam={handleStartExam}
      />
    </>
  )
}

export default TestMode 