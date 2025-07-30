import React, { useState } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material'
import { SmartToy, Close, Refresh } from '@mui/icons-material'
import grammarData from '../data/grammar.json'

const QuestionGenerator = ({ open, onClose, onQuestionsGenerated }) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentLesson, setCurrentLesson] = useState('')
  const [error, setError] = useState('')
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  const generatePromptForLesson = (lesson) => {
    const structures = lesson.structures.map(s => `${s.pattern} - ${s.example}`).join('\n')
    
    return `Tôi đang tạo câu hỏi trắc nghiệm cho bài học ngữ pháp tiếng Nhật.

**Bài học:** ${lesson.title}
**Cấu trúc ngữ pháp:**
${structures}

Hãy tạo 5 câu hỏi trắc nghiệm (multiple choice) cho bài học này. Mỗi câu hỏi phải có:
- 1 câu hỏi chính
- 4 lựa chọn A, B, C, D
- 1 đáp án đúng
- Giải thích ngắn gọn tại sao đáp án đó đúng

**Format trả lời bằng JSON:**
\`\`\`json
[
  {
    "question": "Câu hỏi chính",
    "options": {
      "A": "Lựa chọn A",
      "B": "Lựa chọn B", 
      "C": "Lựa chọn C",
      "D": "Lựa chọn D"
    },
    "correctAnswer": "A",
    "explanation": "Giải thích tại sao đáp án đúng"
  }
]
\`\`\`

**Lưu ý:**
- Câu hỏi phải liên quan đến cấu trúc ngữ pháp trong bài học
- Độ khó phù hợp với trình độ N5
- Trả lời chính xác theo format JSON
- Chỉ trả lời JSON, không có text khác`
  }

  const callGeminiAPI = async (lesson) => {
    try {
      const prompt = generatePromptForLesson(lesson)
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
      
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          timeout: 30000
        }
      )

      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const aiText = response.data.candidates[0].content.parts[0].text
        
        // Extract JSON from response
        const jsonMatch = aiText.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          const jsonStr = jsonMatch[1]
          const questions = JSON.parse(jsonStr)
          
          // Add lesson info to each question
          const questionsWithLesson = questions.map(q => ({
            ...q,
            lessonId: lesson.id,
            lessonTitle: lesson.title
          }))
          
          return questionsWithLesson
        } else {
          throw new Error('Không tìm thấy JSON trong response')
        }
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (err) {
      console.error('AI API Error:', err)
      throw err
    }
  }

  const generateAllQuestions = async () => {
    setLoading(true)
    setError('')
    setGeneratedQuestions([])
    
    const allQuestions = []
    // Convert object to array of lessons
    const lessons = Object.entries(grammarData).map(([id, lesson]) => ({
      id,
      ...lesson
    }))
    const totalLessons = lessons.length
    
    try {
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i]
        setCurrentLesson(lesson.title)
        setProgress(((i + 1) / totalLessons) * 100)
        
        try {
          const questions = await callGeminiAPI(lesson)
          allQuestions.push(...questions)
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (err) {
          console.error(`Error generating questions for lesson ${lesson.title}:`, err)
          // Continue with next lesson
        }
      }
      
      setGeneratedQuestions(allQuestions)
      onQuestionsGenerated(allQuestions)
      
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo câu hỏi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
      setProgress(0)
      setCurrentLesson('')
    }
  }

  const handleGenerate = () => {
    generateAllQuestions()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <SmartToy />
        Tạo câu hỏi trắc nghiệm
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!loading && generatedQuestions.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tạo câu hỏi trắc nghiệm từ Grammar Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              AI sẽ tạo câu hỏi trắc nghiệm cho tất cả bài học ngữ pháp
            </Typography>
            <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
              Sẽ tạo {Object.keys(grammarData).length} bài học × 5 câu hỏi = {Object.keys(grammarData).length * 5} câu hỏi
            </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleGenerate}
              startIcon={<SmartToy />}
              sx={{ bgcolor: '#2196F3' }}
            >
              Bắt đầu tạo
            </Button>
          </Box>
        )}

        {loading && (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Đang tạo câu hỏi...
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {currentLesson}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}% hoàn thành
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {generatedQuestions.length > 0 && !loading && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              ✅ Đã tạo thành công {generatedQuestions.length} câu hỏi
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              maxHeight: '40vh',
              overflow: 'auto'
            }}>
              <Typography variant="body2" gutterBottom>
                <strong>Thống kê:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {Object.entries(grammarData).map(([id, lesson]) => {
                  const lessonQuestions = generatedQuestions.filter(q => q.lessonId === id)
                  return (
                    <Chip
                      key={id}
                      label={`${lesson.title}: ${lessonQuestions.length} câu`}
                      size="small"
                      color={lessonQuestions.length > 0 ? "success" : "default"}
                    />
                  )
                })}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Câu hỏi đã được lưu và sẵn sàng sử dụng trong bài test.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {generatedQuestions.length > 0 && !loading && (
          <Button 
            onClick={handleGenerate} 
            startIcon={<Refresh />}
            variant="outlined"
          >
            Tạo lại
          </Button>
        )}
        <Button onClick={onClose} startIcon={<Close />}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QuestionGenerator 