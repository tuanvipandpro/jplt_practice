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

  // Handle both old format (exam.questions) and new format (exam.sections)
  const allQuestions = exam.sections 
    ? exam.sections.flatMap(section => section.questions)
    : exam.questions || []

  const currentQuestion = allQuestions[currentQuestionIndex]

  // Helper function to get correct answer based on question format
  const getCorrectAnswer = (question) => {
    if (question.correctAnswer) {
      return question.correctAnswer
    } else if (question.answer) {
      return question.answer
    }
    return null
  }

  // Helper function to get options based on question format
  const getOptions = (question) => {
    if (question.options && typeof question.options === 'object') {
      // For AI-generated questions: { A: "option1", B: "option2", ... }
      return question.options
    } else if (Array.isArray(question.options)) {
      // For sample questions: ["A. option1", "B. option2", ...]
      const options = {}
      question.options.forEach((option, index) => {
        const key = String.fromCharCode(65 + index) // A, B, C, D...
        options[key] = option
      })
      return options
    }
    return {}
  }

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
      const correctAnswer = getCorrectAnswer(currentQuestion)
      if (value === correctAnswer) {
        setScore(prev => prev + 1)
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
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
    const percentage = (score / allQuestions.length) * 100
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
              {exam.title || exam.name}
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
                {score}/{allQuestions.length} điểm
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
                label={`Sai: ${allQuestions.length - score}`} 
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

  const options = getOptions(currentQuestion)
  const correctAnswer = getCorrectAnswer(currentQuestion)

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '75vh',
      p: { xs: 1, sm: 2 },
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Paper elevation={8} sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        maxHeight: '70vh'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          <Button onClick={onBack} startIcon={<ArrowBack />} size="small">
            Quay lại
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {exam.title || exam.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {formatTime(timeLeft)}
            </Typography>
            <Chip 
                              label={`${currentQuestionIndex + 1}/${allQuestions.length}`} 
              size="small"
              color="primary"
              sx={{ fontSize: '0.8rem' }}
            />
          </Box>
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
                          value={((currentQuestionIndex + 1) / allQuestions.length) * 100}
          sx={{ mb: { xs: 1, sm: 2 }, flexShrink: 0 }}
        />

        {/* Question */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: { xs: 1, sm: 2 },
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
            minHeight: 0,
            overflow: 'auto'
          }}>
            <FormLabel component="legend" sx={{ mb: 1, flexShrink: 0, fontSize: '0.9rem' }}>
              Chọn đáp án đúng:
            </FormLabel>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              sx={{ flex: 1, overflow: 'auto' }}
            >
              {Object.entries(options).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio size="small" />}
                  label={`${key}. ${value}`}
                  sx={{
                    mb: 0.5,
                    p: 0.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: answered && key === correctAnswer ? 'success.main' : 
                               answered && key === selectedAnswer && key !== correctAnswer ? 'error.main' : 
                               'grey.300',
                    bgcolor: answered && key === correctAnswer ? 'success.light' : 
                            answered && key === selectedAnswer && key !== correctAnswer ? 'error.light' : 
                            'transparent',
                    fontSize: '0.9rem'
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Feedback */}
          {answered && (
            <Box sx={{ mt: { xs: 1, sm: 1.5 }, p: { xs: 1, sm: 1.5 }, bgcolor: 'grey.50', borderRadius: 2, flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: 'block', mb: 0.5 }}>
                {selectedAnswer === correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: 'block', mb: 0.5 }}>
                Đáp án đúng: <strong>{correctAnswer}</strong>
              </Typography>
              {currentQuestion.explanation && (
                <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic', color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: 'block' }}>
                  {currentQuestion.explanation}
                </Typography>
              )}
              
              {/* AI Helper Button - only show for AI-generated questions */}
              {!exam.isSample && (
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
              )}
            </Box>
          )}
        </Box>

        {/* Next Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={!answered}
                            startIcon={currentQuestionIndex === allQuestions.length - 1 ? <CheckCircle /> : <PlayArrow />}
            sx={{ minWidth: 140, fontSize: '0.9rem' }}
            size="small"
          >
                            {currentQuestionIndex === allQuestions.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
          </Button>
        </Box>
      </Paper>

      {/* AI Helper Dialog - only show for AI-generated questions */}
      {!exam.isSample && (
        <AIHelper
          open={aiDialogOpen}
          onClose={() => setAiDialogOpen(false)}
          question={currentQuestion.question}
          userAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          questionType="grammar"
        />
      )}
    </Box>
  )
}

export default GrammarExam 