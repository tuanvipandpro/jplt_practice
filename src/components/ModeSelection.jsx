import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Button
} from '@mui/material'
import { ArrowBack, Edit, Book } from '@mui/icons-material'

const ModeSelection = ({ level, onModeSelect, onBack }) => {
  const modes = [
    {
      id: 'test',
      name: 'Làm Test',
      description: 'Kiểm tra kiến thức với các bài test',
      icon: <Edit />,
      color: '#FF5722'
    },
    {
      id: 'practice',
      name: 'Luyện tập',
      description: 'Học và ôn tập với flashcards',
      icon: <Book />,
      color: '#2196F3'
    }
  ]

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
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
          <Typography variant="h4" component="h2" gutterBottom>
            Chọn chế độ học
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Trình độ: {level.name}
          </Typography>
        </Box>
        <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
      </Box>

      <Grid container spacing={3} direction="column">
        {modes.map((mode) => (
          <Grid item key={mode.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 3,
                borderColor: 'transparent',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: mode.color,
                },
              }}
              onClick={() => onModeSelect(mode.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: mode.color,
                      fontSize: '1.5rem',
                    }}
                  >
                    {mode.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {mode.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {mode.description}
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="text.disabled">
                    →
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

export default ModeSelection 