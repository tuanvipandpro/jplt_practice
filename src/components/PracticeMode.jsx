import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  IconButton,
  Paper,
  Divider,
  Chip
} from '@mui/material'
import {
  ArrowBack,
  Book,
  Translate,
  Language,
  School,
  NavigateNext,
  NavigateBefore,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import hiraganaData from '../data/hiragana.json'
import katakanaData from '../data/katakana.json'
import kanjiData from '../data/kanji.json'
import vocabularyData from '../data/vocabulary.json'
import grammarData from '../data/grammar.json'

const PracticeMode = ({ level, onBack }) => {
  const [currentPractice, setCurrentPractice] = useState(null)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const practiceTypes = [
    {
      id: 'hiragana',
      name: 'Bảng chữ cái Hiragana',
      description: 'Học bảng chữ cái cơ bản',
      icon: <Language />,
      color: '#2196F3',
      data: hiraganaData
    },
    {
      id: 'katakana',
      name: 'Bảng chữ cái Katakana',
      description: 'Học bảng chữ cái ngoại lai',
      icon: <Translate />,
      color: '#FF9800',
      data: katakanaData
    },
    {
      id: 'kanji',
      name: 'Hán tự',
      description: 'Học Hán tự N5',
      icon: <Translate />,
      color: '#F44336',
      data: kanjiData
    },
    {
      id: 'vocabulary',
      name: 'Từ vựng',
      description: 'Học từ vựng N5',
      icon: <School />,
      color: '#4CAF50',
      data: vocabularyData
    },
    {
      id: 'grammar',
      name: 'Ngữ pháp',
      description: 'Học ngữ pháp theo bài',
      icon: <Book />,
      color: '#9C27B0',
      data: grammarData
    }
  ]

  const startPractice = (practiceType) => {
    // Khởi tạo cards từ data nếu cần
    let cards = practiceType.cards
    if (practiceType.data) {
      cards = practiceType.data.cards
    }

    setCurrentPractice({
      ...practiceType,
      cards: cards
    })
    setCurrentCard(0)
    setShowAnswer(false)
  }

  const nextCard = () => {
    if (currentCard < currentPractice.cards.length - 1) {
      setCurrentCard(currentCard + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setShowAnswer(false)
    }
  }

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  if (currentPractice && currentPractice.cards && currentPractice.cards.length > 0) {
    const card = currentPractice.cards[currentCard]
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
            onClick={() => setCurrentPractice(null)}
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
          <Typography variant="h4" component="h2">
            {currentPractice.name}
          </Typography>
          <Chip
            label={`${currentCard + 1} / ${currentPractice.cards.length}`}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(5px)'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 600,
              minHeight: 400,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={toggleAnswer}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              {/* Ký tự chính */}
              <Typography variant="h1" component="div" gutterBottom sx={{ mb: 3 }}>
                {card.front}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Thông tin chi tiết */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Phiên âm */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Phiên âm:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                    {card.pronunciation}
                  </Typography>
                </Box>

                {/* Romanji (hiển thị cho từ vựng, ngữ pháp và hán tự) */}
                {(currentPractice.id === 'vocabulary' || currentPractice.id === 'grammar' || currentPractice.id === 'kanji') && card.romanji && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h6" color="text.secondary">
                      Romanji:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                      {card.romanji}
                    </Typography>
                  </Box>
                )}

                {/* Hiragana/Katakana (hiển thị cho từ vựng, ngữ pháp và hán tự) */}
                {(currentPractice.id === 'vocabulary' || currentPractice.id === 'grammar' || currentPractice.id === 'kanji') && card.hiragana && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h6" color="text.secondary">
                      Hiragana/Katakana:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                      {card.hiragana}
                    </Typography>
                  </Box>
                )}

                {/* Nghĩa */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Nghĩa:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {card.meaning}
                  </Typography>
                </Box>

                {/* Ví dụ */}
                {showAnswer && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Ví dụ:
                    </Typography>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#666' }}>
                      {card.example}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Paper>

          {/* Controls */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <IconButton
              onClick={prevCard}
              disabled={currentCard === 0}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <NavigateBefore />
            </IconButton>

            <Button
              variant="contained"
              onClick={toggleAnswer}
              startIcon={showAnswer ? <VisibilityOff /> : <Visibility />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
            </Button>

            <IconButton
              onClick={nextCard}
              disabled={currentCard === currentPractice.cards.length - 1}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        </Box>
      </Box>
    )
  }

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
            Chế độ luyện tập
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Trình độ: {level.name}
          </Typography>
        </Box>
        <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
      </Box>

      <Grid container spacing={3} direction="column">
        {practiceTypes.map((practice, index) => {
          // Get card count from data or cards array
          const cardCount = practice.data ? practice.data.cards.length : practice.cards.length

          return (
            <Grid item key={practice.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: 3,
                  borderColor: 'transparent',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: practice.color,
                  },
                }}
                onClick={() => startPractice(practice)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: practice.color,
                        fontSize: '1.5rem',
                      }}
                    >
                      {practice.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {practice.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {practice.description}
                      </Typography>
                      <Chip
                        label={`${cardCount} thẻ`}
                        size="small"
                        sx={{ bgcolor: practice.color, color: 'white' }}
                      />
                    </Box>
                    <Typography variant="h4" color="text.disabled">
                      →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default PracticeMode 