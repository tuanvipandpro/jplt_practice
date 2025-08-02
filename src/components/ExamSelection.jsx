import React, { useState } from 'react'
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
  Grid,
  Avatar,
  Chip
} from '@mui/material'
import { 
  SmartToy, 
  Close, 
  PlayArrow, 
  Book,
  AutoAwesome,
  School
} from '@mui/icons-material'
import ExamManager from './ExamManager'
import QuestionGenerator from './QuestionGenerator'
import ExamGenerator from './ExamGenerator'
import sampleExamData from '../data/test-demo.json'


const ExamSelection = ({ open, onClose, onStartExam }) => {
  const [showExamManager, setShowExamManager] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [showExamGenerator, setShowExamGenerator] = useState(false)
  const [currentExam, setCurrentExam] = useState(null)

  const examOptions = [
    {
      id: 'sample',
      name: 'Đề mẫu',
      description: 'Sử dụng bộ đề thi mẫu có sẵn với 50 câu hỏi đa dạng về từ vựng, ngữ pháp, đọc hiểu và câu đồng nghĩa',
      icon: <Book />,
      color: '#2196F3',
      features: ['Từ vựng', 'Ngữ pháp', 'Đọc hiểu', 'Câu đồng nghĩa'],
      questionCount: 50
    },

    {
      id: 'ai-generated',
      name: 'Tạo đề mới bằng AI',
      description: 'Tạo bộ đề thi mới với câu hỏi được tạo bởi AI dựa trên nội dung học tập',
      icon: <SmartToy />,
      color: '#FF5722',
      features: ['Tùy chỉnh nội dung', 'AI tạo câu hỏi', 'Lưu trữ đề thi', 'Quản lý đề thi'],
      questionCount: 'Tùy chỉnh'
    }
  ]

  const handleOptionSelect = (option) => {
    if (option.id === 'sample') {
      // Create sample exam from the imported data
      const sampleExam = {
        id: 'sample-exam',
        name: 'Đề thi mẫu - Tổng hợp',
        questions: sampleExamData.sections.flatMap(section => 
          section.questions.map(q => ({
            ...q,
            section: section.section_title
          }))
        ),
        totalQuestions: sampleExamData.sections.reduce((total, section) => total + section.questions.length, 0),
        createdAt: new Date().toISOString(),
        isSample: true
      }
      onStartExam(sampleExam)
      onClose()
    } else if (option.id === 'ai-generated') {
      setShowExamGenerator(true)
    }
  }

  const handleStartExam = (exam) => {
    setCurrentExam(exam)
    setShowExamManager(false)
    onStartExam(exam)
    onClose()
  }

  const handleExamGenerated = (generatedExam) => {
    onStartExam(generatedExam)
    setShowExamGenerator(false)
    onClose()
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
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
          Chọn loại đề thi
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Chọn cách bạn muốn làm bài thi:
          </Typography>

          <Grid container spacing={3} sx={{ alignItems: 'stretch', justifyContent: 'space-between' }}>
            {examOptions.map((option) => (
              <Grid item xs={12} md={6} key={option.id} sx={{ display: 'flex', minHeight: 280, flex: 1, maxWidth: '50%' }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 3,
                    borderColor: 'transparent',
                    height: '100%',
                    width: '100%',
                    minHeight: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      borderColor: option.color,
                    },
                  }}
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: option.color,
                          fontSize: '1.5rem',
                        }}
                      >
                        {option.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {option.name}
                        </Typography>
                        <Chip
                          label={`${option.questionCount} câu hỏi`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.4 }}>
                      {option.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                      {option.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      fullWidth
                      sx={{
                        bgcolor: option.color,
                        '&:hover': {
                          bgcolor: option.color,
                          opacity: 0.9
                        }
                      }}
                    >
                      {option.id === 'sample' ? 'Bắt đầu làm bài' : 'Tạo đề thi'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} startIcon={<Close />}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exam Manager Dialog */}
      <ExamManager
        open={showExamManager}
        onClose={() => setShowExamManager(false)}
        onStartExam={handleStartExam}
      />

      {/* Exam Generator Dialog */}
      <ExamGenerator
        open={showExamGenerator}
        onClose={() => setShowExamGenerator(false)}
        onExamGenerated={handleExamGenerated}
      />
    </>
  )
}

export default ExamSelection 