import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material'
import { 
  SmartToy, 
  Close, 
  PlayArrow, 
  Edit, 
  Delete, 
  Add,
  School,
  Timer,
  Assignment
} from '@mui/icons-material'
import QuestionGenerator from './QuestionGenerator'

const ExamManager = ({ open, onClose, onStartExam }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [exams, setExams] = useState([])
  const [showGenerator, setShowGenerator] = useState(false)

  // Load saved questions from localStorage
  useEffect(() => {
    const savedQuestions = localStorage.getItem('generatedGrammarQuestions')
    if (savedQuestions) {
      setGeneratedQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  // Save questions to localStorage
  useEffect(() => {
    if (generatedQuestions.length > 0) {
      localStorage.setItem('generatedGrammarQuestions', JSON.stringify(generatedQuestions))
    }
  }, [generatedQuestions])

  const handleQuestionsGenerated = (questions) => {
    setGeneratedQuestions(questions)
    setShowGenerator(false)
  }

  const createExam = (questions, examName) => {
    const exam = {
      id: Date.now(),
      name: examName,
      questions: questions,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString()
    }
    
    const updatedExams = [...exams, exam]
    setExams(updatedExams)
    localStorage.setItem('grammarExams', JSON.stringify(updatedExams))
  }

  const deleteExam = (examId) => {
    const updatedExams = exams.filter(exam => exam.id !== examId)
    setExams(updatedExams)
    localStorage.setItem('grammarExams', updatedExams.length > 0 ? JSON.stringify(updatedExams) : '[]')
  }

  const startExam = (exam) => {
    onStartExam(exam)
    onClose()
  }

  // Load saved exams from localStorage
  useEffect(() => {
    const savedExams = localStorage.getItem('grammarExams')
    if (savedExams) {
      setExams(JSON.parse(savedExams))
    }
  }, [])

  const getLessonStats = () => {
    const stats = {}
    generatedQuestions.forEach(q => {
      if (!stats[q.lessonId]) {
        stats[q.lessonId] = {
          title: q.lessonTitle,
          count: 0
        }
      }
      stats[q.lessonId].count++
    })
    return Object.values(stats)
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
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
          <School />
          Quản lý bộ đề thi
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {/* Generated Questions Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Câu hỏi đã tạo ({generatedQuestions.length})
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowGenerator(true)}
                startIcon={<SmartToy />}
                size="small"
              >
                Tạo câu hỏi mới
              </Button>
            </Box>

            {generatedQuestions.length > 0 ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Thống kê theo bài học:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {getLessonStats().map((stat, index) => (
                    <Chip
                      key={index}
                      label={`${stat.title}: ${stat.count} câu`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    const examName = `Đề thi Grammar - ${new Date().toLocaleDateString('vi-VN')}`
                    createExam(generatedQuestions, examName)
                  }}
                  startIcon={<Add />}
                  disabled={exams.some(exam => exam.questions.length === generatedQuestions.length)}
                >
                  Tạo đề thi từ tất cả câu hỏi
                </Button>
              </Box>
            ) : (
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Chưa có câu hỏi nào được tạo. Hãy tạo câu hỏi trắc nghiệm trước.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Exams Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Bộ đề thi ({exams.length})
            </Typography>

            {exams.length > 0 ? (
              <Grid container spacing={2}>
                {exams.map((exam) => (
                  <Grid item xs={12} sm={6} md={4} key={exam.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {exam.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Assignment fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {exam.totalQuestions} câu hỏi
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Timer fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button
                          size="small"
                          onClick={() => startExam(exam)}
                          startIcon={<PlayArrow />}
                          variant="contained"
                        >
                          Bắt đầu
                        </Button>
                        <Box>
                          <Tooltip title="Xóa đề thi">
                            <IconButton
                              size="small"
                              onClick={() => deleteExam(exam.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Chưa có bộ đề thi nào. Tạo câu hỏi và tạo đề thi để bắt đầu.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} startIcon={<Close />}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Generator Dialog */}
      <QuestionGenerator
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
        onQuestionsGenerated={handleQuestionsGenerated}
      />
    </>
  )
}

export default ExamManager 