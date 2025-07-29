import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip
} from '@mui/material'
import { School } from '@mui/icons-material'

const LevelSelection = ({ onLevelSelect }) => {
  const levels = [
    {
      id: 'n5',
      name: 'JLPT N5',
      description: 'Cơ bản - Sơ cấp',
      color: '#4CAF50',
      icon: <School />
    }
    // Có thể thêm N4, N3, N2, N1 sau này
  ]

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Chọn trình độ
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Bắt đầu với trình độ phù hợp
        </Typography>
      </Box>

      <Grid container spacing={3} direction="column">
        {levels.map((level) => (
          <Grid item key={level.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 3,
                borderColor: 'transparent',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: level.color,
                },
              }}
              onClick={() => onLevelSelect(level)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: level.color,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {level.id.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {level.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {level.description}
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

      <Box sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', mt: 4 }}>
        <Chip
          label="N4, N3, N2, N1 sẽ có sẵn sớm!"
          variant="outlined"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            fontStyle: 'italic'
          }}
        />
      </Box>
    </Box>
  )
}

export default LevelSelection 