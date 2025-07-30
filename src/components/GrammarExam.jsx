import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { ArrowBack, CheckCircle, PlayArrow, SmartToy } from '@mui/icons-material'
import AIHelper from './AIHelper'

const GrammarExam = ({ exam, onBack, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes

  const currentQuestion = exam.questions[currentQuestionIndex]

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleFinishExam()
    }
  }, [timeLeft, showResults])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (value) => {
    if (!answered) {
      setSelectedAnswer(value)
      setAnswered(true)
      
      // Check if answer is correct
      if (value === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1)
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer('')
      setAnswered(false)
    } else {
      handleFinishExam()
    }
  }

  const handleFinishExam = () => {
    setShowResults(true)
  }

  const handleRetake = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setScore(0)
    setAnswered(false)
    setShowResults(false)
    setTimeLeft(30 * 60)
  }

  if (showResults) {
    const percentage = (score / exam.questions.length) * 100
    const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        p: { xs: 1, sm: 2 },
        maxWidth: '800px',
        mx: 'auto'
      }}>
        <Paper elevation={8} sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 2, sm: 3 },
          maxHeight: '90vh'
        }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: { xs: 2, sm: 3 },
            flexShrink: 0
          }}>
            <Button onClick={onBack} startIcon={<ArrowBack />}>
              Quay lại
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Kết quả bài thi
            </Typography>
            <Box />
          </Box>

          {/* Results */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              {exam.name}
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h2" sx={{ 
                color: percentage >= 60 ? 'success.main' : 'error.main',
                fontWeight: 'bold',
                mb: 1
              }}>
                {grade}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {score}/{exam.questions.length} điểm
              </Typography>
              <Typography variant="h6" color="text.secondary">
                ({percentage.toFixed(1)}%)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Chip 
                label={`Đúng: ${score}`} 
                color="success" 
                variant="outlined"
              />
              <Chip 
                label={`Sai: ${exam.questions.length - score}`} 
                color="error" 
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleRetake}
                startIcon={<PlayArrow />}
              >
                Làm lại
              </Button>
              <Button
                variant="outlined"
                onClick={onBack}
              >
                Quay lại menu
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      p: { xs: 1, sm: 2 },
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Paper elevation={8} sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          <Button onClick={onBack} startIcon={<ArrowBack />}>
            Quay lại
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {exam.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatTime(timeLeft)}
            </Typography>
            <Chip 
              label={`${currentQuestionIndex + 1}/${exam.questions.length}`} 
              size="small"
              color="primary"
            />
          </Box>
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / exam.questions.length) * 100}
          sx={{ mb: { xs: 2, sm: 3 }, flexShrink: 0 }}
        />

        {/* Question */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: { xs: 2, sm: 3 },
            flexShrink: 0
          }}>
            <strong>Câu {currentQuestionIndex + 1}:</strong> {currentQuestion.question}
          </Typography>

          {/* Answer Options */}
          <FormControl component="fieldset" sx={{ 
            width: '100%', 
            mt: { xs: 1, sm: 2 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            maxHeight: '40vh'
          }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Chọn đáp án đúng:
            </FormLabel>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              sx={{ flex: 1 }}
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={`${key}. ${value}`}
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: answered && key === currentQuestion.correctAnswer ? 'success.main' : 
                               answered && key === selectedAnswer && key !== currentQuestion.correctAnswer ? 'error.main' : 
                               'grey.300',
                    bgcolor: answered && key === currentQuestion.correctAnswer ? 'success.light' : 
                            answered && key === selectedAnswer && key !== currentQuestion.correctAnswer ? 'error.light' : 
                            'transparent'
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Feedback */}
          {answered && (
            <Box sx={{ mt: { xs: 1, sm: 2 }, p: { xs: 1, sm: 1.5 }, bgcolor: 'grey.50', borderRadius: 2, flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block', mb: 0.5 }}>
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block', mb: 0.5 }}>
                Đáp án đúng: <strong>{currentQuestion.correctAnswer}</strong>
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic', color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: 'block' }}>
                {currentQuestion.explanation}
              </Typography>
              
              {/* AI Helper Button */}
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAiDialogOpen(true)}
                  startIcon={<SmartToy />}
                  sx={{
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    py: 0.5,
                    px: 1
                  }}
                >
                  Hỏi đáp cùng AI
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Next Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={!answered}
            startIcon={currentQuestionIndex === exam.questions.length - 1 ? <CheckCircle /> : <PlayArrow />}
            sx={{ minWidth: 150 }}
          >
            {currentQuestionIndex === exam.questions.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
          </Button>
        </Box>
      </Paper>

      {/* AI Helper Dialog */}
      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        question={currentQuestion.question}
        userAnswer={selectedAnswer}
        correctAnswer={currentQuestion.correctAnswer}
        questionType="grammar"
      />
    </Box>
  )
}

export default GrammarExam 