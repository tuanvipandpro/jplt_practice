import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material'
import { ArrowBack, ExpandMore, School, CheckCircle } from '@mui/icons-material'
import grammarData from '../data/grammar.json'

const GrammarPractice = ({ onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])

  const lessons = Object.keys(grammarData).map(lessonId => ({
    id: lessonId,
    title: grammarData[lessonId].title,
    structures: grammarData[lessonId].structures
  }))

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson)
  }

  const handleBackToLessons = () => {
    setSelectedLesson(null)
  }

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  if (selectedLesson) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
            onClick={handleBackToLessons}
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
              Bài {selectedLesson.id}: {selectedLesson.title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {selectedLesson.structures.length} cấu trúc ngữ pháp
            </Typography>
          </Box>
          <Chip
            label={completedLessons.includes(selectedLesson.id) ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            icon={completedLessons.includes(selectedLesson.id) ? <CheckCircle /> : <School />}
            sx={{
              bgcolor: completedLessons.includes(selectedLesson.id) 
                ? 'rgba(76, 175, 80, 0.2)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(5px)'
            }}
          />
        </Box>

        {/* Lesson Content */}
        <Grid container spacing={3}>
          {selectedLesson.structures.map((structure, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={4} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={`Cấu trúc ${index + 1}`}
                    size="small"
                    sx={{
                      bgcolor: '#2196F3',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  {structure.example && (
                    <Chip
                      label="Có ví dụ"
                      size="small"
                      sx={{
                        bgcolor: '#4CAF50',
                        color: 'white'
                      }}
                    />
                  )}
                </Box>

                <Typography 
                  variant="h6" 
                  component="div" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: 'monospace',
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid rgba(33, 150, 243, 0.3)'
                  }}
                >
                  {structure.pattern}
                </Typography>

                {structure.example && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ví dụ:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic',
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }}
                    >
                      {structure.example}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Complete Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleCompleteLesson(selectedLesson.id)}
            disabled={completedLessons.includes(selectedLesson.id)}
            startIcon={<CheckCircle />}
            sx={{
              bgcolor: completedLessons.includes(selectedLesson.id) ? '#4CAF50' : '#2196F3',
              '&:hover': {
                bgcolor: completedLessons.includes(selectedLesson.id) ? '#45a049' : '#1976D2',
              },
              '&:disabled': {
                bgcolor: '#4CAF50',
                color: 'white'
              },
            }}
          >
            {completedLessons.includes(selectedLesson.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
            Luyện tập ngữ pháp
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {lessons.length} bài học ngữ pháp
          </Typography>
        </Box>
        <Chip
          label={`${completedLessons.length}/${lessons.length} hoàn thành`}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            backdropFilter: 'blur(5px)'
          }}
        />
      </Box>

      {/* Progress Overview */}
      <Paper elevation={4} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tiến độ học tập
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${(completedLessons.length / lessons.length) * 100}%`,
                height: '100%',
                bgcolor: '#4CAF50',
                transition: 'width 0.3s ease'
              }} />
            </Box>
          </Box>
          <Typography variant="body2" color="white">
            {Math.round((completedLessons.length / lessons.length) * 100)}%
          </Typography>
        </Box>
      </Paper>

      {/* Lessons Grid */}
      <Grid container spacing={3}>
        {lessons.map((lesson) => (
          <Grid item xs={12} md={6} key={lesson.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 3,
                borderColor: completedLessons.includes(lesson.id) ? '#4CAF50' : 'transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                },
              }}
              onClick={() => handleLessonSelect(lesson)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={`Bài ${lesson.id}`}
                    size="small"
                    sx={{
                      bgcolor: completedLessons.includes(lesson.id) ? '#4CAF50' : '#2196F3',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  {completedLessons.includes(lesson.id) && (
                    <CheckCircle sx={{ color: '#4CAF50' }} />
                  )}
                </Box>
                
                <Typography variant="h6" component="h3" gutterBottom>
                  {lesson.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {lesson.structures.length} cấu trúc ngữ pháp
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cấu trúc đầu tiên:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      p: 1,
                      borderRadius: 1,
                      mt: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {lesson.structures[0]?.pattern}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default GrammarPractice 