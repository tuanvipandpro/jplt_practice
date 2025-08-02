import React, { useState, useEffect, useRef } from 'react'
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import { 
  ArrowBack, 
  CheckCircle, 
  PlayArrow, 
  SmartToy,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material'
import AIHelper from './AIHelper'

const ListeningTest = ({ onBack, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes for listening
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Audio ref
  const audioRef = useRef(null)

  // Import listening exam data
  const [listeningData, setListeningData] = useState(null)

  useEffect(() => {
    import('../data/listening-demo.json').then((module) => {
      setListeningData(module.default)
    })
  }, [])

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
      const currentQuestion = listeningData.sections[0].questions[currentQuestionIndex]
      if (value === currentQuestion.answer) {
        setScore(prev => prev + 1)
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < listeningData.sections[0].questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer('')
      setAnswered(false)
      setIsPlaying(false)
      setShowTranscript(false)
      setAudioError(false)
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
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
    setTimeLeft(20 * 60)
    setIsPlaying(false)
    setShowTranscript(false)
    setAudioError(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handlePlayAudio = () => {
    if (!listeningData) return

    const currentQuestion = listeningData.sections[0].questions[currentQuestionIndex]
    const audioPath = `/audio/${currentQuestion.audio}`

    if (isPlaying) {
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsPlaying(false)
    } else {
      // Play audio
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      audioRef.current.src = audioPath
      audioRef.current.onloadstart = () => {
        setIsPlaying(true)
        setAudioError(false)
      }
      audioRef.current.onerror = () => {
        setIsPlaying(false)
        setAudioError(true)
      }
      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
        setAudioError(true)
      })
    }
  }

  if (!listeningData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  const currentQuestion = listeningData.sections[0].questions[currentQuestionIndex]
  const totalQuestions = listeningData.sections[0].questions.length

  if (showResults) {
    const percentage = (score / totalQuestions) * 100
    const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'
    
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
              Kết quả bài thi nghe hiểu
            </Typography>
            <Box />
          </Box>

          {/* Results */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              {listeningData.title}
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
                {score}/{totalQuestions} điểm
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
                label={`Sai: ${totalQuestions - score}`} 
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
            {listeningData.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {formatTime(timeLeft)}
            </Typography>
            <Chip 
              label={`${currentQuestionIndex + 1}/${totalQuestions}`} 
              size="small"
              color="primary"
              sx={{ fontSize: '0.8rem' }}
            />
          </Box>
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / totalQuestions) * 100}
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

          {/* Audio Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={isPlaying ? <VolumeOff /> : <VolumeUp />}
              onClick={handlePlayAudio}
              size="small"
              disabled={audioError}
            >
              {isPlaying ? 'Dừng' : 'Nghe'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowTranscript(!showTranscript)}
              size="small"
            >
              {showTranscript ? 'Ẩn' : 'Xem'} Script
            </Button>
          </Box>

          {/* Audio Error Alert */}
          {audioError && (
            <Alert severity="warning" sx={{ mb: 2, flexShrink: 0 }}>
              Không thể phát file âm thanh. Vui lòng xem script để làm bài.
            </Alert>
          )}

          {/* Transcript */}
          {showTranscript && (
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              flexShrink: 0,
              border: '1px solid',
              borderColor: 'grey.300'
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                {currentQuestion.transcript}
              </Typography>
            </Box>
          )}

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
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={String.fromCharCode(65 + index)} // A, B, C, D...
                  control={<Radio size="small" />}
                  label={`${String.fromCharCode(65 + index)}. ${option}`}
                  sx={{
                    mb: 0.5,
                    p: 0.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: answered && String.fromCharCode(65 + index) === currentQuestion.answer ? 'success.main' : 
                               answered && String.fromCharCode(65 + index) === selectedAnswer && String.fromCharCode(65 + index) !== currentQuestion.answer ? 'error.main' : 
                               'grey.300',
                    bgcolor: answered && String.fromCharCode(65 + index) === currentQuestion.answer ? 'success.light' : 
                            answered && String.fromCharCode(65 + index) === selectedAnswer && String.fromCharCode(65 + index) !== currentQuestion.answer ? 'error.light' : 
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
                {selectedAnswer === currentQuestion.answer ? '✅ Đúng!' : '❌ Sai!'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: 'block', mb: 0.5 }}>
                Đáp án đúng: <strong>{currentQuestion.answer}</strong>
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
          mt: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={!answered}
            startIcon={currentQuestionIndex === totalQuestions - 1 ? <CheckCircle /> : <PlayArrow />}
            sx={{ minWidth: 140, fontSize: '0.9rem' }}
            size="small"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
          </Button>
        </Box>
      </Paper>

      {/* AI Helper Dialog */}
      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        question={currentQuestion.question}
        userAnswer={selectedAnswer}
        correctAnswer={currentQuestion.answer}
        questionType="listening"
      />
    </Box>
  )
}

export default ListeningTest 