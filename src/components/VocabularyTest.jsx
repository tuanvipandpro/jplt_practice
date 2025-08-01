import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Card,
  CardContent
} from '@mui/material'
import { ArrowBack, CheckCircle, PlayArrow, SmartToy } from '@mui/icons-material'
import vocabularyData from '../data/vocabulary.json'
import AIHelper from './AIHelper'

const VocabularyTest = ({ onBack, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questions, setQuestions] = useState([])
  const [answered, setAnswered] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)

  // Tạo câu hỏi từ dữ liệu Vocabulary
  useEffect(() => {
    const generateQuestions = () => {
      const allCards = vocabularyData.cards
      const shuffled = [...allCards].sort(() => Math.random() - 0.5)
      const selectedCards = shuffled.slice(0, 100) // 100 câu hỏi
      
      const questions = selectedCards.map((card, index) => {
        // Tạo 4 đáp án ngẫu nhiên
        const allMeanings = allCards.map(c => c.meaning)
        const correctAnswer = card.meaning
        let wrongAnswers = allMeanings.filter(m => m !== correctAnswer)
        wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        
        const answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        
        return {
          id: index,
          question: card.front,
          correctAnswer: correctAnswer,
          answers: answers,
          card: card,
          questionType: 'meaning'
        }
      })
      
      setQuestions(questions)
    }
    
    generateQuestions()
  }, [])

  const handleAnswerSelect = (answer) => {
    if (answered) return
    setSelectedAnswer(answer)
    
    // Tự động check kết quả khi chọn đáp án
    const currentQ = questions[currentQuestion]
    if (answer === currentQ.correctAnswer) {
      setScore(score + 1)
    }
    
    setAnswered(true)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answered) return
    
    const currentQ = questions[currentQuestion]
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(score + 1)
    }
    
    setAnswered(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const handleFinish = () => {
    onFinish({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    })
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer('')
    setAnswered(false)
    // Tạo lại câu hỏi
    const generateQuestions = () => {
      const allCards = vocabularyData.cards
      const shuffled = [...allCards].sort(() => Math.random() - 0.5)
      const selectedCards = shuffled.slice(0, 100)
      
      const questions = selectedCards.map((card, index) => {
        const allMeanings = allCards.map(c => c.meaning)
        const correctAnswer = card.meaning
        let wrongAnswers = allMeanings.filter(m => m !== correctAnswer)
        wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        
        const answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        
        return {
          id: index,
          question: card.front,
          correctAnswer: correctAnswer,
          answers: answers,
          card: card,
          questionType: 'meaning'
        }
      })
      
      setQuestions(questions)
    }
    
    generateQuestions()
  }

  if (showResult) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Kết quả bài thi
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="div" sx={{ color: '#2196F3', mb: 2 }}>
              {score}/{questions.length}
            </Typography>
            <Typography variant="h5" sx={{ color: '#666' }}>
              {Math.round((score / questions.length) * 100)}%
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleRestart}
              startIcon={<PlayArrow />}
              sx={{ bgcolor: '#2196F3' }}
            >
              Làm lại
            </Button>
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
            >
              Quay lại
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Đang tải câu hỏi...</Typography>
      </Box>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
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
          <Typography variant="h4" component="h2">
            Bài thi từ vựng
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {vocabularyData.name}
          </Typography>
        </Box>
        <Button
          startIcon={<SmartToy />}
          onClick={() => setAiDialogOpen(true)}
          sx={{
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          AI Helper
        </Button>
      </Box>

      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Câu {currentQuestion + 1}/{questions.length}
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Điểm: {score}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#2196F3'
            }
          }}
        />
      </Box>

      {/* Question */}
      <Paper elevation={4} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3 }}>
          Từ vựng: <strong>{currentQ.question}</strong>
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
          Hãy chọn nghĩa đúng của từ vựng trên:
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {currentQ.answers.map((answer, index) => (
              <FormControlLabel
                key={index}
                value={answer}
                control={<Radio />}
                label={answer}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                  },
                  '&.Mui-checked': {
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                    borderColor: '#2196F3',
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {answered && (
          <Box sx={{ mt: 3, p: 2, bgcolor: selectedAnswer === currentQ.correctAnswer ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: selectedAnswer === currentQ.correctAnswer ? '#4CAF50' : '#F44336', mb: 1 }}>
              {selectedAnswer === currentQ.correctAnswer ? '✓ Đúng!' : '✗ Sai!'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Đáp án đúng:</strong> {currentQ.correctAnswer}
            </Typography>
            {currentQ.card.example && (
              <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                Ví dụ: {currentQ.card.example}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          Câu trước
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={!answered}
          sx={{ bgcolor: '#2196F3' }}
        >
          {currentQuestion === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp'}
        </Button>
      </Box>

      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        currentQuestion={currentQ}
        subject="vocabulary"
      />
    </Box>
  )
}

export default VocabularyTest 