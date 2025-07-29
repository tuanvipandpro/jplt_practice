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
  FormLabel
} from '@mui/material'
import { ArrowBack, CheckCircle, PlayArrow } from '@mui/icons-material'
import hiraganaData from '../data/hiragana.json'

const HiraganaTest = ({ onBack, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questions, setQuestions] = useState([])
  const [answered, setAnswered] = useState(false)

  // Tạo câu hỏi từ dữ liệu Hiragana
  useEffect(() => {
    const generateQuestions = () => {
      const allCards = hiraganaData.cards
      const shuffled = [...allCards].sort(() => Math.random() - 0.5)
      const selectedCards = shuffled.slice(0, 10) // 10 câu hỏi
      
      const questions = selectedCards.map((card, index) => {
        // Tạo 4 đáp án ngẫu nhiên
        const allPronunciations = allCards.map(c => c.pronunciation)
        const correctAnswer = card.pronunciation
        let wrongAnswers = allPronunciations.filter(p => p !== correctAnswer)
        wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        
        const answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        
        return {
          id: index,
          question: card.front,
          correctAnswer: correctAnswer,
          answers: answers,
          card: card
        }
      })
      
      setQuestions(questions)
    }
    
    generateQuestions()
  }, [])

  const handleAnswerSelect = (answer) => {
    if (answered) return
    setSelectedAnswer(answer)
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
      // Kết thúc test
      const finalScore = selectedAnswer === questions[currentQuestion].correctAnswer ? score + 1 : score
      onFinish({ score: finalScore, total: questions.length })
    }
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <Typography variant="h6">Đang tải câu hỏi...</Typography>
      </Box>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
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
            Test Hiragana
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Câu {currentQuestion + 1} / {questions.length}
          </Typography>
        </Box>
        <Chip
          label={`${score} điểm`}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            backdropFilter: 'blur(5px)'
          }}
        />
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          mb: 3,
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          '& .MuiLinearProgress-bar': {
            bgcolor: '#2196F3',
          }
        }}
      />

      {/* Question Card */}
      <Paper elevation={8} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" component="div" gutterBottom sx={{ mb: 3 }}>
          {currentQ.question}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Chọn phiên âm đúng:
        </Typography>

        {/* Answer Options */}
        <FormControl component="fieldset" sx={{ width: '100%', mt: 3 }}>
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
                  display: 'block',
                  margin: '8px 0',
                  padding: '12px',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: answered 
                    ? answer === currentQ.correctAnswer 
                      ? '#4CAF50' 
                      : answer === selectedAnswer 
                        ? '#F44336' 
                        : 'transparent'
                    : selectedAnswer === answer 
                      ? '#2196F3' 
                      : 'transparent',
                  bgcolor: answered 
                    ? answer === currentQ.correctAnswer 
                      ? 'rgba(76, 175, 80, 0.1)' 
                      : answer === selectedAnswer 
                        ? 'rgba(244, 67, 54, 0.1)' 
                        : 'transparent'
                    : selectedAnswer === answer 
                      ? 'rgba(33, 150, 243, 0.1)' 
                      : 'transparent',
                  '&:hover': {
                    bgcolor: answered ? 'transparent' : 'rgba(33, 150, 243, 0.05)',
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Feedback */}
        {answered && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {selectedAnswer === currentQ.correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Đáp án đúng: <strong>{currentQ.correctAnswer}</strong>
            </Typography>
            {currentQ.card.example && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#666' }}>
                Ví dụ: {currentQ.card.example}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!answered ? (
          <Button
            variant="contained"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            sx={{
              bgcolor: '#2196F3',
              '&:hover': {
                bgcolor: '#1976D2',
              },
              '&:disabled': {
                bgcolor: 'grey.400',
              },
            }}
          >
            Trả lời
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            startIcon={currentQuestion < questions.length - 1 ? <PlayArrow /> : <CheckCircle />}
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#45a049',
              },
            }}
          >
            {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Kết thúc'}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default HiraganaTest 