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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  IconButton as MuiIconButton
} from '@mui/material'
import { ArrowBack, ExpandMore, School, CheckCircle, Close, Lightbulb, NavigateNext, NavigateBefore } from '@mui/icons-material'
import vocabularyData from '../data/vocabulary.json'
import ReactMarkdown from 'react-markdown'
import AudioPlayer from './AudioPlayer'
import { db } from '../config/firebase'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'

const VocabularyPractice = ({ onBack }) => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [completedCategories, setCompletedCategories] = useState([])
  const [markdownDialogOpen, setMarkdownDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  // Lưu tiến độ vào Firestore
  const saveProgress = async (categoryId) => {
    if (!user) return
    
    try {
      const userDocRef = doc(db, 'users', user.uid)
      const progressRef = doc(userDocRef, 'vocabulary_progress', 'completed_categories')
      
      await setDoc(progressRef, {
        completedCategories: [...completedCategories, categoryId],
        updatedAt: new Date()
      }, { merge: true })
    } catch (error) {
      console.error('Lỗi khi lưu tiến độ:', error)
    }
  }

  // Load tiến độ từ Firestore
  const loadProgress = () => {
    if (!user) return null

    try {
      const userDocRef = doc(db, 'users', user.uid)
      const progressRef = doc(userDocRef, 'vocabulary_progress', 'completed_categories')
      
      return onSnapshot(progressRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setCompletedCategories(data.completedCategories || [])
        } else {
          setCompletedCategories([])
        }
        setLoading(false)
      }, (error) => {
        console.error('Error loading progress:', error)
        setCompletedCategories([])
        setLoading(false)
      })
    } catch (error) {
      console.error('Error setting up progress listener:', error)
      setCompletedCategories([])
      setLoading(false)
      return null
    }
  }

  // Load tiến độ khi component mount hoặc user thay đổi
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const unsubscribe = loadProgress()
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [user])

  // Phân loại từ vựng theo chủ đề
  const categories = [
    {
      id: 'part1',
      title: 'Phần 1: Từ vựng cơ bản (1-80)',
      description: 'Từ vựng cơ bản nhất trong tiếng Nhật',
      cards: vocabularyData.cards.slice(0, 80)
    },
    {
      id: 'part2',
      title: 'Phần 2: Từ vựng cơ bản (81-160)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(80, 160)
    },
    {
      id: 'part3',
      title: 'Phần 3: Từ vựng cơ bản (161-240)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(160, 240)
    },
    {
      id: 'part4',
      title: 'Phần 4: Từ vựng cơ bản (241-320)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(240, 320)
    },
    {
      id: 'part5',
      title: 'Phần 5: Từ vựng cơ bản (321-400)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(320, 400)
    },
    {
      id: 'part6',
      title: 'Phần 6: Từ vựng cơ bản (401-480)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(400, 480)
    },
    {
      id: 'part7',
      title: 'Phần 7: Từ vựng cơ bản (481-560)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(480, 560)
    },
    {
      id: 'part8',
      title: 'Phần 8: Từ vựng cơ bản (561-640)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(560, 640)
    },
    {
      id: 'part9',
      title: 'Phần 9: Từ vựng cơ bản (641-720)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(640, 720)
    },
    {
      id: 'part10',
      title: 'Phần 10: Từ vựng cơ bản (721-800)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(720, 800)
    },
    {
      id: 'part11',
      title: 'Phần 11: Từ vựng cơ bản (801-880)',
      description: 'Từ vựng cơ bản tiếp theo',
      cards: vocabularyData.cards.slice(800, 880)
    },
    {
      id: 'part12',
      title: 'Phần 12: Từ vựng cơ bản (881-958)',
      description: 'Từ vựng cơ bản cuối cùng',
      cards: vocabularyData.cards.slice(880, 958)
    }
  ]



  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const handleCompleteCategory = async (categoryId) => {
    if (!completedCategories.includes(categoryId)) {
      const newCompletedCategories = [...completedCategories, categoryId]
      setCompletedCategories(newCompletedCategories)
      
      // Lưu vào Firestore
      await saveProgress(categoryId)
    }
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
    setMarkdownDialogOpen(true)
  }

  const handleCloseMarkdownDialog = () => {
    setMarkdownDialogOpen(false)
    setSelectedCard(null)
  }

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNextCard = () => {
    if (selectedCategory && currentCardIndex < selectedCategory.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const generateMarkdownContent = (card) => {
    return `
# ${card.front}

## Nghĩa tiếng Việt
${card.meaning}

## Cách đọc
- **Hiragana:** ${card.hiragana}
- **Romaji:** ${card.romanji}
- **Phát âm:** ${card.pronunciation}

## Ví dụ sử dụng
${card.example || 'Chưa có ví dụ'}

## Thông tin thêm
- **Loại từ:** ${card.meaning.includes('động từ') ? 'Động từ' : card.meaning.includes('tính từ') ? 'Tính từ' : 'Danh từ'}
- **Mức độ:** N5 (Cơ bản)

## Ghi chú học tập
- Hãy luyện tập đọc từ này nhiều lần
- Thử đặt câu với từ vựng này
- Liên kết với các từ vựng tương tự
    `
  }

  if (selectedCategory) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
            onClick={handleBackToCategories}
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
              {selectedCategory.title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {selectedCategory.description}
            </Typography>
          </Box>
          <Chip
            label={completedCategories.includes(selectedCategory.id) ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            icon={completedCategories.includes(selectedCategory.id) ? <CheckCircle /> : <School />}
            sx={{
              bgcolor: completedCategories.includes(selectedCategory.id) 
                ? 'rgba(76, 175, 80, 0.2)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(5px)'
            }}
          />
        </Box>

        {/* Flashcard */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          {selectedCategory.cards.length > 0 && (
            <>
              {/* Progress indicator */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {currentCardIndex + 1} / {selectedCategory.cards.length}
                </Typography>
              </Box>

              {/* Flashcard */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 400,
                  perspective: '1000px',
                  mb: 3
                }}
              >
                <Box
                  onClick={handleCardFlip}
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front of card */}
                  <Card
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 4,
                      bgcolor: 'primary.main',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                      {selectedCategory.cards[currentCardIndex].front}
                    </Typography>
                    <AudioPlayer
                      text={selectedCategory.cards[currentCardIndex].front}
                      pronunciation={selectedCategory.cards[currentCardIndex].pronunciation}
                      size="large"
                      sx={{ color: 'white' }}
                    />
                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
                      Nhấn để xem nghĩa
                    </Typography>
                  </Card>

                  {/* Back of card */}
                  <Card
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 4,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                      {selectedCategory.cards[currentCardIndex].meaning}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                      {selectedCategory.cards[currentCardIndex].romanji}
                    </Typography>
                    {selectedCategory.cards[currentCardIndex].example && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        {selectedCategory.cards[currentCardIndex].example}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.6 }}>
                      Nhấn để xem từ
                    </Typography>
                  </Card>
                </Box>
              </Box>

              {/* Navigation buttons */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <MuiIconButton
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&:disabled': { bgcolor: 'grey.300' }
                  }}
                >
                  <NavigateBefore />
                </MuiIconButton>
                
                <Typography variant="body1" sx={{ minWidth: 60, textAlign: 'center' }}>
                  {currentCardIndex + 1} / {selectedCategory.cards.length}
                </Typography>
                
                <MuiIconButton
                  onClick={handleNextCard}
                  disabled={currentCardIndex === selectedCategory.cards.length - 1}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&:disabled': { bgcolor: 'grey.300' }
                  }}
                >
                  <NavigateNext />
                </MuiIconButton>
              </Box>
            </>
          )}
        </Box>

        {/* Complete Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleCompleteCategory(selectedCategory.id)}
            startIcon={<CheckCircle />}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#45a049'
              }
            }}
          >
            Hoàn thành chủ đề này
          </Button>
        </Box>

        {/* Markdown Dialog */}
        <Dialog
          open={markdownDialogOpen}
          onClose={handleCloseMarkdownDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Chi tiết từ vựng</Typography>
              <IconButton onClick={handleCloseMarkdownDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedCard && (
              <Box sx={{ p: 2 }}>
                <ReactMarkdown>
                  {generateMarkdownContent(selectedCard)}
                </ReactMarkdown>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMarkdownDialog}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
            Luyện tập từ vựng
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {vocabularyData.name} - {vocabularyData.description}
          </Typography>
        </Box>
        <Chip
          label={`${completedCategories.length}/${categories.length} chủ đề hoàn thành`}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            backdropFilter: 'blur(5px)'
          }}
        />
      </Box>

      {/* Thông báo đăng nhập */}
      {!user && (
        <Paper elevation={4} sx={{ p: 3, mb: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <Typography variant="body1">
            ⚠️ Đăng nhập để lưu tiến độ học tập của bạn
          </Typography>
        </Paper>
      )}

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Đang tải tiến độ học tập...
          </Typography>
        </Box>
      )}

      {/* Categories */}
      {!loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((category) => (
            <Card 
              key={category.id}
              elevation={4} 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 8,
                }
              }}
              onClick={() => handleCategorySelect(category)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={completedCategories.includes(category.id) ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    icon={completedCategories.includes(category.id) ? <CheckCircle /> : <School />}
                    sx={{
                      bgcolor: completedCategories.includes(category.id) 
                        ? 'rgba(76, 175, 80, 0.2)' 
                        : 'rgba(33, 150, 243, 0.2)',
                      color: completedCategories.includes(category.id) ? '#4CAF50' : '#2196F3',
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                    {category.title}
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                  {category.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {category.cards.length} từ vựng
                  </Typography>
                  <ExpandMore />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Progress Summary */}
      {!loading && completedCategories.length > 0 && (
        <Paper elevation={4} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tiến độ học tập
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {completedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId)
              return (
                <Chip
                  key={categoryId}
                  label={category?.title}
                  icon={<CheckCircle />}
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    color: '#4CAF50',
                    fontWeight: 'bold'
                  }}
                />
              )
            })}
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default VocabularyPractice 