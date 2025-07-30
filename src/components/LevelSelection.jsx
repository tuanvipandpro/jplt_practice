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
      icon: <School />,
      available: true
    },
    {
      id: 'n4',
      name: 'JLPT N4',
      description: 'Sơ trung cấp',
      color: '#2196F3',
      icon: <School />,
      available: false
    },
    {
      id: 'n3',
      name: 'JLPT N3',
      description: 'Trung cấp',
      color: '#FF9800',
      icon: <School />,
      available: false
    },
    {
      id: 'n2',
      name: 'JLPT N2',
      description: 'Trung cao cấp',
      color: '#F44336',
      icon: <School />,
      available: false
    },
    {
      id: 'n1',
      name: 'JLPT N1',
      description: 'Cao cấp',
      color: '#9C27B0',
      icon: <School />,
      available: false
    }
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
                cursor: level.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                border: 3,
                borderColor: 'transparent',
                opacity: level.available ? 1 : 0.6,
                '&:hover': level.available ? {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: level.color,
                } : {},
              }}
              onClick={() => level.available && onLevelSelect(level)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: level.available ? level.color : 'grey.400',
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
                    {!level.available && (
                      <Chip
                        label="Sắp có"
                        size="small"
                        sx={{ 
                          bgcolor: 'grey.500', 
                          color: 'white',
                          fontSize: '0.75rem',
                          mt: 1
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="h4" color="text.disabled">
                    {level.available ? '→' : '🚧'}
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

export default LevelSelection 