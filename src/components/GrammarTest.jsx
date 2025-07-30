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
import grammarData from '../data/grammar.json'

const GrammarTest = ({ onBack, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questions, setQuestions] = useState([])
  const [answered, setAnswered] = useState(false)

  // Tạo câu hỏi từ dữ liệu Grammar
  useEffect(() => {
    const generateQuestions = () => {
      const allStructures = []
      
      // Lấy tất cả các cấu trúc từ tất cả các bài
      Object.keys(grammarData).forEach(lessonId => {
        const lesson = grammarData[lessonId]
        lesson.structures.forEach((structure, index) => {
          allStructures.push({
            lessonId,
            lessonTitle: lesson.title,
            structure: structure.pattern,
            example: structure.example,
            id: `${lessonId}-${index}`
          })
        })
      })
      
      const shuffled = [...allStructures].sort(() => Math.random() - 0.5)
      const selectedStructures = shuffled // Tất cả câu hỏi
      
      const questions = selectedStructures.map((structure, index) => {
        // Tạo 4 đáp án ngẫu nhiên
        const allPatterns = allStructures.map(s => s.structure)
        const correctAnswer = structure.structure
        let wrongAnswers = allPatterns.filter(p => p !== correctAnswer)
        wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        
        const answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        
        return {
          id: index,
          question: structure.example || structure.structure,
          correctAnswer: correctAnswer,
          answers: answers,
          structure: structure,
          questionType: structure.example ? 'example' : 'pattern'
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
      // Kết thúc test - không cần cộng thêm điểm vì đã được tính trong handleAnswerSelect
      onFinish({ score: score, total: questions.length })
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
    <Box sx={{ 
      maxWidth: { xs: '95%', sm: 600 }, 
      mx: 'auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      py: { xs: 1, sm: 2 }
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        mb: { xs: 1, sm: 2 },
        flexShrink: 0,
        gap: 1
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
          <Typography variant="h5" component="h2" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Test Ngữ Pháp
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            Câu {currentQuestion + 1} / {questions.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={!answered}
          startIcon={currentQuestion < questions.length - 1 ? <PlayArrow /> : <CheckCircle />}
          sx={{
            bgcolor: answered ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
            color: answered ? 'white' : 'rgba(255, 255, 255, 0.6)',
            '&:hover': {
              bgcolor: answered ? '#45a049' : 'rgba(255, 255, 255, 0.3)',
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.6)',
            },
          }}
        >
          {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Kết thúc'}
        </Button>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: { xs: 4, sm: 6 },
          borderRadius: 4,
          mb: { xs: 1, sm: 2 },
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          '& .MuiLinearProgress-bar': {
            bgcolor: '#2196F3',
          }
        }}
      />

      {/* Question Card */}
      <Paper elevation={8} sx={{ 
        p: { xs: 2, sm: 3 }, 
        textAlign: 'center', 
        mb: { xs: 1, sm: 2 },
        maxHeight: { xs: '70vh', sm: '75vh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Lesson Info */}
        <Box sx={{ mb: { xs: 1, sm: 2 }, p: { xs: 1, sm: 1.5 }, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2, flexShrink: 0 }}>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Bài {currentQ.structure.lessonId}: {currentQ.structure.lessonTitle}
          </Typography>
        </Box>

        {/* Question */}
        <Typography variant="body1" component="div" gutterBottom sx={{ mb: { xs: 1, sm: 2 }, flexShrink: 0, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {currentQ.questionType === 'example' ? currentQ.question : currentQ.question}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ flexShrink: 0, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
          {currentQ.questionType === 'example' 
            ? 'Chọn cấu trúc ngữ pháp đúng cho câu trên:' 
            : 'Chọn cấu trúc ngữ pháp đúng:'}
        </Typography>

        {/* Answer Options */}
        <FormControl component="fieldset" sx={{ width: '100%', mt: { xs: 1, sm: 2 }, maxHeight: { xs: '40vh', sm: '50vh' }, display: 'flex', flexDirection: 'column' }}>
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {currentQ.answers.map((answer, index) => (
              <FormControlLabel
                key={index}
                value={answer}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {answer}
                    </Typography>
                  </Box>
                }
                sx={{
                  display: 'block',
                  margin: { xs: '2px 0', sm: '4px 0' },
                  padding: { xs: '6px', sm: '8px' },
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
                  },
                  cursor: answered ? 'default' : 'pointer',
                  flexShrink: 0,
                  fontSize: { xs: '0.8rem', sm: '1rem' }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>



        {/* Feedback */}
        {answered && (
          <Box sx={{ mt: { xs: 1, sm: 2 }, p: { xs: 1, sm: 1.5 }, bgcolor: 'grey.50', borderRadius: 2, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block', mb: 0.5 }}>
              {selectedAnswer === currentQ.correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block', mb: 0.5 }}>
              Đáp án đúng: <strong style={{ fontFamily: 'monospace' }}>{currentQ.correctAnswer}</strong>
            </Typography>
            {currentQ.questionType === 'example' && (
              <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic', color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: 'block' }}>
                Cấu trúc: {currentQ.correctAnswer}
              </Typography>
            )}
            {currentQ.questionType === 'pattern' && currentQ.structure.example && (
              <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic', color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: 'block' }}>
                Ví dụ: {currentQ.structure.example}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default GrammarTest 