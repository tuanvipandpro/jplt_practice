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
import { ArrowBack, CheckCircle, PlayArrow, SmartToy } from '@mui/icons-material'
import kanjiData from '../data/kanji.json'
import AIHelper from './AIHelper'

const KanjiTest = ({ onBack, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questions, setQuestions] = useState([])
  const [answered, setAnswered] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)

  // Tạo câu hỏi từ dữ liệu Kanji
  useEffect(() => {
    const generateQuestions = () => {
      const allKanji = kanjiData.cards
      const shuffled = [...allKanji].sort(() => Math.random() - 0.5)
      const selectedKanji = shuffled // Tất cả câu hỏi
      
      const questions = selectedKanji.map((kanji, index) => {
        // Tạo 4 đáp án ngẫu nhiên
        const allMeanings = allKanji.map(k => k.meaning)
        const correctAnswer = kanji.meaning
        let wrongAnswers = allMeanings.filter(m => m !== correctAnswer)
        wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        
        const answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        
        // Tạo thông tin chi tiết cho từng đáp án
        const answerDetails = answers.map(answer => {
          const kanjiForAnswer = allKanji.find(k => k.meaning === answer)
          return {
            meaning: answer,
            kanji: kanjiForAnswer
          }
        })
        
        return {
          id: index,
          question: kanji.front,
          correctAnswer: correctAnswer,
          answers: answers,
          answerDetails: answerDetails,
          kanji: kanji,
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

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer('')
      setAnswered(false)
    } else {
      handleFinishTest()
    }
  }

  const handleFinishTest = () => {
    onFinish({
      score: score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    })
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Đang tải câu hỏi...</Typography>
      </Box>
    )
  }

  const currentQ = questions[currentQuestion]

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
            Test: Hán tự
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${currentQuestion + 1}/${questions.length}`} 
              size="small"
              color="primary"
            />
          </Box>
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestion + 1) / questions.length) * 100}
          sx={{ mb: { xs: 2, sm: 3 }, flexShrink: 0 }}
        />

        {/* Question */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: { xs: 2, sm: 3 },
            flexShrink: 0
          }}>
            <strong>Câu {currentQuestion + 1}:</strong> Hán tự này có nghĩa là gì?
          </Typography>

          {/* Kanji Display */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: { xs: 2, sm: 3 },
            flexShrink: 0
          }}>
            <Typography variant="h1" sx={{ 
              fontSize: { xs: '4rem', sm: '6rem' },
              fontWeight: 'bold',
              color: 'primary.main'
            }}>
              {currentQ.question}
            </Typography>
          </Box>

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
              {currentQ.answerDetails.map((answerDetail, index) => (
                <FormControlLabel
                  key={index}
                  value={answerDetail.meaning}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {answerDetail.meaning}
                      </Typography>
                      {answerDetail.kanji && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {answerDetail.kanji.romanji} ({answerDetail.kanji.hiragana})
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: answered && answerDetail.meaning === currentQ.correctAnswer ? 'success.main' : 
                               answered && answerDetail.meaning === selectedAnswer && answerDetail.meaning !== currentQ.correctAnswer ? 'error.main' : 
                               'grey.300',
                    bgcolor: answered && answerDetail.meaning === currentQ.correctAnswer ? 'success.light' : 
                            answered && answerDetail.meaning === selectedAnswer && answerDetail.meaning !== currentQ.correctAnswer ? 'error.light' : 
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
                {selectedAnswer === currentQ.correctAnswer ? '✅ Đúng!' : '❌ Sai!'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block', mb: 0.5 }}>
                Đáp án đúng: <strong>{currentQ.correctAnswer}</strong>
              </Typography>
                              {currentQ.kanji.example && (
                  <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic', color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: 'block' }}>
                    Ví dụ: {currentQ.kanji.example}
                  </Typography>
                )}
              
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
            startIcon={currentQuestion === questions.length - 1 ? <CheckCircle /> : <PlayArrow />}
            sx={{ minWidth: 150 }}
          >
            {currentQuestion === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
          </Button>
        </Box>
      </Paper>

      {/* AI Helper Dialog */}
      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        question={currentQ.question}
        userAnswer={selectedAnswer}
        correctAnswer={currentQ.correctAnswer}
        questionType="kanji"
      />
    </Box>
  )
}

export default KanjiTest 