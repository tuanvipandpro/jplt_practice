import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
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
  DialogActions,
  DialogContentText,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import { ArrowBack, CheckCircle, PlayArrow, SmartToy, NavigateNext, NavigateBefore, Flag, FlagOutlined, Visibility, Send, Save, CloudUpload, Info, Error, Warning } from '@mui/icons-material'
import AIHelper from './AIHelper'
import { useAuth } from '../hooks/useAuth'
import { saveExamResult } from '../services/examService'

// Review Component - moved outside to prevent recreation
const ReviewComponent = ({ 
  allQuestions, 
  userAnswers, 
  flaggedQuestions, 
  reviewScrollRef,
  setCurrentQuestionIndex,
  setShowReview,
  handleSubmitExam
}) => {
  const answeredCount = Object.keys(userAnswers).length
  const flaggedCount = flaggedQuestions.size

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      p: { xs: 1, sm: 2 },
      maxWidth: '900px',
      mx: 'auto'
    }}>
      <Paper elevation={8} sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '90vh',
        p: { xs: 2, sm: 3 }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          <Button onClick={() => setShowReview(false)} startIcon={<ArrowBack />} size="small">
            Quay lại
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            Review bài thi
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`Đã trả lời: ${answeredCount}/${allQuestions.length}`} 
              size="small"
              color="primary"
              sx={{ fontSize: '0.8rem' }}
            />
            {flaggedCount > 0 && (
              <Chip 
                label={`Flag: ${flaggedCount}`} 
                size="small"
                color="warning"
                sx={{ fontSize: '0.8rem' }}
              />
            )}
          </Box>
        </Box>

        {/* Review Content */}
        <Box 
          ref={reviewScrollRef}
          sx={{ 
            overflow: 'auto', 
            p: 1,
            height: 'calc(90vh - 120px)', // Fixed height minus header and buttons
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555'
            }
          }}
        >
          <Grid container spacing={2}>
            {allQuestions.map((question, index) => {
              const userAnswer = userAnswers[index]
              const isFlagged = flaggedQuestions.has(index)
              const isAnswered = !!userAnswer
              
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: isFlagged ? 'warning.main' : 
                                 isAnswered ? 'success.main' : 'grey.300',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => {
                      setCurrentQuestionIndex(index)
                      setShowReview(false)
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          Câu {index + 1}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {isFlagged && <Flag sx={{ color: 'warning.main', fontSize: '1rem' }} />}
                          {isAnswered && <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {question.question}
                      </Typography>

                      {isAnswered && (
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.7rem'
                        }}>
                          Đáp án: {userAnswer}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          <Button
            variant="outlined"
            onClick={() => setShowReview(false)}
            startIcon={<ArrowBack />}
            size="small"
          >
            Tiếp tục làm bài
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitExam}
            startIcon={<Send />}
            size="small"
            color="success"
          >
            Nộp bài
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

const GrammarExam = ({ exam, onBack, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [userAnswers, setUserAnswers] = useState({}) // Store all user answers
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set()) // Store flagged questions
  const [showReview, setShowReview] = useState(false) // Show review mode
  const [reviewScrollTop, setReviewScrollTop] = useState(0) // Store scroll position in state
  const [saving, setSaving] = useState(false) // Save result state
  const [saved, setSaved] = useState(false) // Saved successfully state
  const [startTime] = useState(Date.now()) // Track start time for calculating duration
  const [notification, setNotification] = useState({ // Notification dialog state
    open: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    title: '',
    message: ''
  })
  const reviewScrollRef = useRef(null)
  const { user } = useAuth()

  // Helper function to show notification
  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  // Handle both old format (exam.questions) and new format (exam.sections)
  const allQuestions = useMemo(() => {
    let questions = exam.sections 
      ? exam.sections.flatMap(section => section.questions)
      : exam.questions || []

    // For sample exam, ensure we have exactly 50 questions
    if (exam.isSample && questions.length > 50) {
      questions = questions.slice(0, 50)
    }
    
    return questions
  }, [exam.sections, exam.questions, exam.isSample])

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
    if (question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
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

  // Helper function to get image path
  const getImagePath = (imageName) => {
    if (!imageName) return null
    // Use relative path from public directory with base path
    return `/jplt_practice/data/images/demo/${imageName}`
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

  // Initialize selectedAnswer when question changes
  useEffect(() => {
    setSelectedAnswer(userAnswers[currentQuestionIndex] || '')
    setAnswered(!!userAnswers[currentQuestionIndex])
  }, [currentQuestionIndex, userAnswers])

  // Restore scroll position when entering review mode
  useLayoutEffect(() => {
    if (showReview && reviewScrollRef.current && reviewScrollTop > 0) {
      reviewScrollRef.current.scrollTop = reviewScrollTop
    }
  }, [showReview])

  // Add scroll event listener for review mode
  useEffect(() => {
    if (!showReview || !reviewScrollRef.current) return

    const handleScroll = () => {
      if (reviewScrollRef.current) {
        setReviewScrollTop(reviewScrollRef.current.scrollTop)
      }
    }
    
    const scrollElement = reviewScrollRef.current
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [showReview])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (value) => {
    const previousAnswer = userAnswers[currentQuestionIndex]
    const wasCorrect = previousAnswer === correctAnswer
    const isCorrect = value === correctAnswer
    

    
    setSelectedAnswer(value)
    setAnswered(true)
    
    // Store user answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }))
    
    // Update score: only change score if this is a new answer or changed answer
    setScore(prev => {
      let newScore = prev
      
      // If this is the first time answering this question
      if (previousAnswer === undefined) {
        if (isCorrect) {
          newScore = prev + 1
        }
      } else {
        // If changing answer
        if (wasCorrect && !isCorrect) {
          // Was correct, now wrong - decrease score
          newScore = Math.max(0, prev - 1)
        } else if (!wasCorrect && isCorrect) {
          // Was wrong, now correct - increase score
          newScore = prev + 1
        }
        // If was wrong and still wrong, no change
      }
      
      return newScore
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || '')
      setAnswered(!!userAnswers[currentQuestionIndex + 1])
    } else {
      handleFinishExam()
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '')
      setAnswered(!!userAnswers[currentQuestionIndex - 1])
    }
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex)
      } else {
        newSet.add(currentQuestionIndex)
      }
      return newSet
    })
  }

  const handleSubmitExam = () => {
    handleFinishExam()
  }

  const handleReviewExam = () => {
    setShowReview(true)
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
    setShowReview(false)
    setTimeLeft(30 * 60)
    setUserAnswers({})
    setFlaggedQuestions(new Set())
    setSaved(false)
    hideNotification() // Reset notification state
  }

  const handleSaveResult = async () => {
    if (!user) {
      showNotification('warning', 'Yêu cầu đăng nhập', 'Bạn cần đăng nhập để lưu kết quả thi!')
      return
    }

    if (saved) {
      showNotification('info', 'Đã lưu', 'Kết quả đã được lưu rồi!')
      return
    }

    setSaving(true)
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000) // seconds
      const percentage = (score / allQuestions.length) * 100
      const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'

      const examData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
        examId: exam.id || `exam_${Date.now()}`,
        examTitle: exam.title || exam.name || 'Bài thi ngữ pháp',
        examType: 'grammar',
        score: score,
        totalQuestions: allQuestions.length,
        percentage: Math.round(percentage * 10) / 10,
        grade: grade,
        timeSpent: timeSpent,
        answers: userAnswers,
        flaggedQuestions: Array.from(flaggedQuestions)
      }

      await saveExamResult(examData)
      setSaved(true)
      showNotification('success', 'Lưu thành công!', 'Kết quả thi đã được lưu thành công vào hệ thống.')
    } catch (error) {
      console.error('Lỗi khi lưu kết quả:', error)
      showNotification('error', 'Lỗi lưu kết quả', 'Có lỗi xảy ra khi lưu kết quả. Vui lòng thử lại!')
    } finally {
      setSaving(false)
    }
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

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleRetake}
                startIcon={<PlayArrow />}
              >
                Làm lại
              </Button>
              
              {user && (
                <Button
                  variant="contained"
                  onClick={handleSaveResult}
                  startIcon={saved ? <CheckCircle /> : <CloudUpload />}
                  disabled={saving || saved}
                  color={saved ? "success" : "primary"}
                  sx={{
                    bgcolor: saved ? 'success.main' : 'primary.main',
                    '&:hover': {
                      bgcolor: saved ? 'success.dark' : 'primary.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: saved ? 'success.main' : 'grey.400',
                      color: 'white',
                    }
                  }}
                >
                  {saving ? 'Đang lưu...' : saved ? 'Đã lưu' : 'Lưu kết quả'}
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={onBack}
              >
                Quay lại menu
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Notification Dialog */}
        <Dialog
          open={notification.open}
          onClose={hideNotification}
          aria-labelledby="notification-dialog-title"
          aria-describedby="notification-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            id="notification-dialog-title"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: notification.type === 'success' ? 'success.main' :
                     notification.type === 'error' ? 'error.main' :
                     notification.type === 'warning' ? 'warning.main' : 'info.main'
            }}
          >
            {notification.type === 'success' && <CheckCircle />}
            {notification.type === 'error' && <Error />}
            {notification.type === 'warning' && <Warning />}
            {notification.type === 'info' && <Info />}
            {notification.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText 
              id="notification-dialog-description"
              sx={{ fontSize: '1rem', lineHeight: 1.6 }}
            >
              {notification.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={hideNotification}
              variant="contained"
              color={notification.type === 'success' ? 'success' :
                     notification.type === 'error' ? 'error' :
                     notification.type === 'warning' ? 'warning' : 'primary'}
              autoFocus
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }



  if (showReview) {
    return (
      <>
        <ReviewComponent 
          allQuestions={allQuestions}
          userAnswers={userAnswers}
          flaggedQuestions={flaggedQuestions}
          reviewScrollRef={reviewScrollRef}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          setShowReview={setShowReview}
          handleSubmitExam={handleSubmitExam}
        />

        {/* Notification Dialog */}
        <Dialog
          open={notification.open}
          onClose={hideNotification}
          aria-labelledby="notification-dialog-title"
          aria-describedby="notification-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            id="notification-dialog-title"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: notification.type === 'success' ? 'success.main' :
                     notification.type === 'error' ? 'error.main' :
                     notification.type === 'warning' ? 'warning.main' : 'info.main'
            }}
          >
            {notification.type === 'success' && <CheckCircle />}
            {notification.type === 'error' && <Error />}
            {notification.type === 'warning' && <Warning />}
            {notification.type === 'info' && <Info />}
            {notification.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText 
              id="notification-dialog-description"
              sx={{ fontSize: '1rem', lineHeight: 1.6 }}
            >
              {notification.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={hideNotification}
              variant="contained"
              color={notification.type === 'success' ? 'success' :
                     notification.type === 'error' ? 'error' :
                     notification.type === 'warning' ? 'warning' : 'primary'}
              autoFocus
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  const options = getOptions(currentQuestion)
  const correctAnswer = getCorrectAnswer(currentQuestion)
  const imagePath = getImagePath(currentQuestion.image)

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '90vh',
      p: { xs: 1, sm: 2 },
      maxWidth: '900px',
      mx: 'auto'
    }}>
      <Paper elevation={8} sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        maxHeight: '85vh'
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

        {/* Action Buttons - Moved to top */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 1, sm: 2 },
          flexShrink: 0
        }}>
          {/* Left side - Flag and Review */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleFlagQuestion}
              startIcon={flaggedQuestions.has(currentQuestionIndex) ? <Flag /> : <FlagOutlined />}
              size="small"
              color={flaggedQuestions.has(currentQuestionIndex) ? 'warning' : 'primary'}
            >
              {flaggedQuestions.has(currentQuestionIndex) ? 'Bỏ flag' : 'Flag'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReviewExam}
              startIcon={<Visibility />}
              size="small"
            >
              Review
            </Button>
          </Box>

          {/* Right side - Submit */}
          <Button
            variant="contained"
            onClick={handleSubmitExam}
            startIcon={<Send />}
            size="small"
            color="success"
          >
            Nộp bài
          </Button>
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / allQuestions.length) * 100}
          sx={{ mb: { xs: 1, sm: 2 }, flexShrink: 0 }}
        />

        {/* Question Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Question Text */}
          <Typography variant="h6" gutterBottom sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: { xs: 1, sm: 2 },
            flexShrink: 0
          }}>
            <strong>Câu {currentQuestionIndex + 1}:</strong> {currentQuestion.question}
          </Typography>

          {/* Image Display - Reduced size */}
          {imagePath && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: { xs: 1, sm: 1.5 },
              flexShrink: 0
            }}>
              <Box sx={{
                maxWidth: '60%', // Reduced from 80%
                maxHeight: '120px', // Reduced from 200px
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'grey.300',
                bgcolor: 'grey.50'
              }}>
                <img
                  src={imagePath}
                  alt="Question Image"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '120px', // Reduced from 200px
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Failed to load image:', imagePath)
                    e.target.style.display = 'none'
                  }}
                />
              </Box>
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
        </Box>

        {/* Feedback - Moved to bottom */}
        {answered && (
          <Box sx={{ 
            mt: { xs: 1, sm: 1.5 }, 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: 'grey.50', 
            borderRadius: 2, 
            flexShrink: 0,
            border: '1px solid',
            borderColor: selectedAnswer === correctAnswer ? 'success.main' : 'error.main'
          }}>
            {/* Result Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 'bold',
                color: selectedAnswer === correctAnswer ? 'success.main' : 'error.main',
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {selectedAnswer === correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                Đáp án đúng: <strong>{correctAnswer}. {options[correctAnswer] || 'Không có thông tin'}</strong>
              </Typography>
            </Box>

            {/* AI Explanation */}
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setAiDialogOpen(true)}
                startIcon={<SmartToy />}
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  py: 1,
                  px: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark'
                  }
                }}
              >
                Giải thích chi tiết với AI
              </Button>
            </Box>

                       </Box>
         )}

         {/* Navigation Buttons */}
         <Box sx={{ 
           display: 'flex', 
           justifyContent: 'space-between',
           alignItems: 'center',
           mt: { xs: 1, sm: 2 },
           flexShrink: 0
         }}>
           {/* Left side - Navigation */}
           <Box sx={{ display: 'flex', gap: 1 }}>
             <Button
               variant="outlined"
               onClick={handlePrevQuestion}
               disabled={currentQuestionIndex === 0}
               startIcon={<NavigateBefore />}
               size="small"
             >
               Trước
             </Button>
             <Button
               variant="outlined"
               onClick={handleNextQuestion}
               disabled={currentQuestionIndex === allQuestions.length - 1}
               endIcon={<NavigateNext />}
               size="small"
             >
               Tiếp
             </Button>
           </Box>


         </Box>
      </Paper>

      {/* AI Helper Dialog - show for all questions */}
      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        question={currentQuestion.question}
        userAnswer={selectedAnswer}
        correctAnswer={correctAnswer}
        questionType="grammar"
        options={options}
        isSample={exam.isSample}
      />

      {/* Notification Dialog */}
      <Dialog
        open={notification.open}
        onClose={hideNotification}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          id="notification-dialog-title"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: notification.type === 'success' ? 'success.main' :
                   notification.type === 'error' ? 'error.main' :
                   notification.type === 'warning' ? 'warning.main' : 'info.main'
          }}
        >
          {notification.type === 'success' && <CheckCircle />}
          {notification.type === 'error' && <Error />}
          {notification.type === 'warning' && <Warning />}
          {notification.type === 'info' && <Info />}
          {notification.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="notification-dialog-description"
            sx={{ fontSize: '1rem', lineHeight: 1.6 }}
          >
            {notification.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={hideNotification}
            variant="contained"
            color={notification.type === 'success' ? 'success' :
                   notification.type === 'error' ? 'error' :
                   notification.type === 'warning' ? 'warning' : 'primary'}
            autoFocus
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GrammarExam 