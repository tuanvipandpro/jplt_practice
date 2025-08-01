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

const VocabularyPractice = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [completedCategories, setCompletedCategories] = useState([])
  const [markdownDialogOpen, setMarkdownDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Phân loại từ vựng theo chủ đề
  const categories = [
    {
      id: 'basic',
      title: 'Từ vựng cơ bản (1-150)',
      description: 'Những từ vựng cơ bản nhất trong tiếng Nhật',
      cards: vocabularyData.cards.slice(0, 150)
    },
    {
      id: 'family',
      title: 'Gia đình & Quan hệ',
      description: 'Từ vựng về các thành viên trong gia đình và quan hệ',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('bố') || 
        card.meaning.includes('mẹ') || 
        card.meaning.includes('anh') || 
        card.meaning.includes('chị') ||
        card.meaning.includes('em') ||
        card.meaning.includes('ông') ||
        card.meaning.includes('bà') ||
        card.meaning.includes('chồng') ||
        card.meaning.includes('vợ') ||
        card.meaning.includes('con') ||
        card.meaning.includes('gia đình') ||
        card.meaning.includes('cha') ||
        card.meaning.includes('mẹ') ||
        card.meaning.includes('anh trai') ||
        card.meaning.includes('chị gái') ||
        card.meaning.includes('em trai') ||
        card.meaning.includes('em gái')
      )
    },
    {
      id: 'school',
      title: 'Trường học & Học tập',
      description: 'Từ vựng liên quan đến trường học và học tập',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('học') || 
        card.meaning.includes('trường') || 
        card.meaning.includes('sách') || 
        card.meaning.includes('bút') ||
        card.meaning.includes('giáo viên') ||
        card.meaning.includes('học sinh') ||
        card.meaning.includes('sinh viên') ||
        card.meaning.includes('thầy') ||
        card.meaning.includes('cô') ||
        card.meaning.includes('bài') ||
        card.meaning.includes('từ điển') ||
        card.meaning.includes('chữ') ||
        card.meaning.includes('lớp') ||
        card.meaning.includes('môn học') ||
        card.meaning.includes('kiểm tra') ||
        card.meaning.includes('thi') ||
        card.meaning.includes('điểm')
      )
    },
    {
      id: 'daily',
      title: 'Cuộc sống hàng ngày',
      description: 'Từ vựng về các hoạt động và đồ vật hàng ngày',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('ăn') || 
        card.meaning.includes('uống') || 
        card.meaning.includes('ngủ') || 
        card.meaning.includes('nhà') ||
        card.meaning.includes('xe') ||
        card.meaning.includes('đi') ||
        card.meaning.includes('làm') ||
        card.meaning.includes('mua') ||
        card.meaning.includes('cửa hàng') ||
        card.meaning.includes('nhà hàng') ||
        card.meaning.includes('công việc') ||
        card.meaning.includes('tắm') ||
        card.meaning.includes('rửa') ||
        card.meaning.includes('mặc') ||
        card.meaning.includes('điện thoại') ||
        card.meaning.includes('ti vi') ||
        card.meaning.includes('máy tính')
      )
    },
    {
      id: 'food',
      title: 'Đồ ăn & Thức uống',
      description: 'Từ vựng về đồ ăn, thức uống và ẩm thực',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('cơm') || 
        card.meaning.includes('bánh') || 
        card.meaning.includes('sữa') || 
        card.meaning.includes('nước') ||
        card.meaning.includes('cà phê') ||
        card.meaning.includes('trà') ||
        card.meaning.includes('bánh mì') ||
        card.meaning.includes('thịt') ||
        card.meaning.includes('cá') ||
        card.meaning.includes('rau') ||
        card.meaning.includes('hoa quả') ||
        card.meaning.includes('ngon') ||
        card.meaning.includes('đồ ăn') ||
        card.meaning.includes('thức uống') ||
        card.meaning.includes('gạo') ||
        card.meaning.includes('mì') ||
        card.meaning.includes('súp') ||
        card.meaning.includes('salad') ||
        card.meaning.includes('kem') ||
        card.meaning.includes('kẹo')
      )
    },
    {
      id: 'colors',
      title: 'Màu sắc & Tính từ',
      description: 'Từ vựng về màu sắc và tính từ miêu tả',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('đỏ') || 
        card.meaning.includes('xanh') || 
        card.meaning.includes('trắng') || 
        card.meaning.includes('đen') ||
        card.meaning.includes('vàng') ||
        card.meaning.includes('to') ||
        card.meaning.includes('nhỏ') ||
        card.meaning.includes('mới') ||
        card.meaning.includes('cũ') ||
        card.meaning.includes('tốt') ||
        card.meaning.includes('xấu') ||
        card.meaning.includes('nóng') ||
        card.meaning.includes('lạnh') ||
        card.meaning.includes('đẹp') ||
        card.meaning.includes('khó') ||
        card.meaning.includes('dễ') ||
        card.meaning.includes('xanh lá') ||
        card.meaning.includes('xanh dương') ||
        card.meaning.includes('nâu') ||
        card.meaning.includes('tím') ||
        card.meaning.includes('cam') ||
        card.meaning.includes('hồng')
      )
    },
    {
      id: 'time',
      title: 'Thời gian & Số đếm',
      description: 'Từ vựng về thời gian, số đếm và thời tiết',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('thời gian') || 
        card.meaning.includes('ngày') || 
        card.meaning.includes('tuần') || 
        card.meaning.includes('tháng') ||
        card.meaning.includes('năm') ||
        card.meaning.includes('giờ') ||
        card.meaning.includes('phút') ||
        card.meaning.includes('số') ||
        card.meaning.includes('một') ||
        card.meaning.includes('hai') ||
        card.meaning.includes('ba') ||
        card.meaning.includes('bốn') ||
        card.meaning.includes('năm') ||
        card.meaning.includes('sáu') ||
        card.meaning.includes('bảy') ||
        card.meaning.includes('tám') ||
        card.meaning.includes('chín') ||
        card.meaning.includes('mười') ||
        card.meaning.includes('trăm') ||
        card.meaning.includes('nghìn') ||
        card.meaning.includes('triệu') ||
        card.meaning.includes('sáng') ||
        card.meaning.includes('trưa') ||
        card.meaning.includes('chiều') ||
        card.meaning.includes('tối') ||
        card.meaning.includes('đêm')
      )
    },
    {
      id: 'places',
      title: 'Địa điểm & Du lịch',
      description: 'Từ vựng về địa điểm, du lịch và phương tiện',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('nhà') || 
        card.meaning.includes('trường') || 
        card.meaning.includes('công ty') || 
        card.meaning.includes('bệnh viện') ||
        card.meaning.includes('ngân hàng') ||
        card.meaning.includes('bưu điện') ||
        card.meaning.includes('cửa hàng') ||
        card.meaning.includes('nhà hàng') ||
        card.meaning.includes('khách sạn') ||
        card.meaning.includes('sân bay') ||
        card.meaning.includes('ga') ||
        card.meaning.includes('xe') ||
        card.meaning.includes('máy bay') ||
        card.meaning.includes('tàu') ||
        card.meaning.includes('du lịch') ||
        card.meaning.includes('thành phố') ||
        card.meaning.includes('nước') ||
        card.meaning.includes('quốc gia') ||
        card.meaning.includes('tỉnh') ||
        card.meaning.includes('quận') ||
        card.meaning.includes('phố') ||
        card.meaning.includes('đường') ||
        card.meaning.includes('cầu') ||
        card.meaning.includes('công viên')
      )
    },
    {
      id: 'hobbies',
      title: 'Sở thích & Giải trí',
      description: 'Từ vựng về sở thích, thể thao và giải trí',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('thích') || 
        card.meaning.includes('ghét') || 
        card.meaning.includes('thể thao') || 
        card.meaning.includes('bóng') ||
        card.meaning.includes('nhạc') ||
        card.meaning.includes('phim') ||
        card.meaning.includes('sách') ||
        card.meaning.includes('hát') ||
        card.meaning.includes('nhảy') ||
        card.meaning.includes('vẽ') ||
        card.meaning.includes('đọc') ||
        card.meaning.includes('xem') ||
        card.meaning.includes('nghe') ||
        card.meaning.includes('chơi') ||
        card.meaning.includes('karaoke') ||
        card.meaning.includes('concert') ||
        card.meaning.includes('game') ||
        card.meaning.includes('thể dục') ||
        card.meaning.includes('bơi') ||
        card.meaning.includes('chạy') ||
        card.meaning.includes('đi bộ')
      )
    },
    {
      id: 'work',
      title: 'Công việc & Nghề nghiệp',
      description: 'Từ vựng về công việc và các nghề nghiệp',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('công việc') || 
        card.meaning.includes('nghề') || 
        card.meaning.includes('giáo viên') || 
        card.meaning.includes('bác sĩ') ||
        card.meaning.includes('kỹ sư') ||
        card.meaning.includes('nhân viên') ||
        card.meaning.includes('quản lý') ||
        card.meaning.includes('chủ tịch') ||
        card.meaning.includes('thư ký') ||
        card.meaning.includes('công ty') ||
        card.meaning.includes('văn phòng') ||
        card.meaning.includes('làm thêm') ||
        card.meaning.includes('lương') ||
        card.meaning.includes('nghỉ') ||
        card.meaning.includes('luật sư') ||
        card.meaning.includes('y tá') ||
        card.meaning.includes('thợ') ||
        card.meaning.includes('tài xế') ||
        card.meaning.includes('cảnh sát') ||
        card.meaning.includes('lính cứu hỏa')
      )
    },
    {
      id: 'communication',
      title: 'Giao tiếp & Cảm xúc',
      description: 'Từ vựng về giao tiếp, cảm xúc và tình huống',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('xin chào') || 
        card.meaning.includes('cảm ơn') || 
        card.meaning.includes('xin lỗi') || 
        card.meaning.includes('tạm biệt') ||
        card.meaning.includes('vâng') ||
        card.meaning.includes('không') ||
        card.meaning.includes('xin phép') ||
        card.meaning.includes('hẹn gặp') ||
        card.meaning.includes('vui') ||
        card.meaning.includes('buồn') ||
        card.meaning.includes('giận') ||
        card.meaning.includes('sợ') ||
        card.meaning.includes('ngạc nhiên') ||
        card.meaning.includes('thích') ||
        card.meaning.includes('ghét') ||
        card.meaning.includes('yêu') ||
        card.meaning.includes('hạnh phúc') ||
        card.meaning.includes('tức giận') ||
        card.meaning.includes('lo lắng') ||
        card.meaning.includes('bình tĩnh') ||
        card.meaning.includes('hồi hộp') ||
        card.meaning.includes('thất vọng')
      )
    },
    {
      id: 'body',
      title: 'Cơ thể & Sức khỏe',
      description: 'Từ vựng về cơ thể, sức khỏe và y tế',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('đầu') || 
        card.meaning.includes('mắt') || 
        card.meaning.includes('mũi') || 
        card.meaning.includes('miệng') ||
        card.meaning.includes('tay') ||
        card.meaning.includes('chân') ||
        card.meaning.includes('tay') ||
        card.meaning.includes('chân') ||
        card.meaning.includes('bụng') ||
        card.meaning.includes('lưng') ||
        card.meaning.includes('cổ') ||
        card.meaning.includes('vai') ||
        card.meaning.includes('đau') ||
        card.meaning.includes('bệnh') ||
        card.meaning.includes('sốt') ||
        card.meaning.includes('ho') ||
        card.meaning.includes('cảm') ||
        card.meaning.includes('mệt') ||
        card.meaning.includes('khỏe') ||
        card.meaning.includes('bác sĩ') ||
        card.meaning.includes('thuốc')
      )
    },
    {
      id: 'clothing',
      title: 'Quần áo & Thời trang',
      description: 'Từ vựng về quần áo, thời trang và phụ kiện',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('áo') || 
        card.meaning.includes('quần') || 
        card.meaning.includes('giày') || 
        card.meaning.includes('mũ') ||
        card.meaning.includes('túi') ||
        card.meaning.includes('váy') ||
        card.meaning.includes('áo sơ mi') ||
        card.meaning.includes('áo khoác') ||
        card.meaning.includes('giày dép') ||
        card.meaning.includes('tất') ||
        card.meaning.includes('cà vạt') ||
        card.meaning.includes('đồng hồ') ||
        card.meaning.includes('kính') ||
        card.meaning.includes('nhẫn') ||
        card.meaning.includes('vòng tay') ||
        card.meaning.includes('thắt lưng') ||
        card.meaning.includes('khăn') ||
        card.meaning.includes('găng tay')
      )
    },
    {
      id: 'weather',
      title: 'Thời tiết & Môi trường',
      description: 'Từ vựng về thời tiết, môi trường và thiên nhiên',
      cards: vocabularyData.cards.filter(card => 
        card.meaning.includes('nắng') || 
        card.meaning.includes('mưa') || 
        card.meaning.includes('tuyết') || 
        card.meaning.includes('gió') ||
        card.meaning.includes('nóng') ||
        card.meaning.includes('lạnh') ||
        card.meaning.includes('ấm') ||
        card.meaning.includes('mát') ||
        card.meaning.includes('ẩm') ||
        card.meaning.includes('khô') ||
        card.meaning.includes('mây') ||
        card.meaning.includes('sấm') ||
        card.meaning.includes('sét') ||
        card.meaning.includes('bão') ||
        card.meaning.includes('sương mù') ||
        card.meaning.includes('cầu vồng') ||
        card.meaning.includes('mùa xuân') ||
        card.meaning.includes('mùa hè') ||
        card.meaning.includes('mùa thu') ||
        card.meaning.includes('mùa đông')
      )
    },
    {
      id: 'advanced',
      title: 'Từ vựng nâng cao (151-600)',
      description: 'Từ vựng nâng cao và phức tạp hơn',
      cards: vocabularyData.cards.slice(150, 600)
    },
    {
      id: 'expert',
      title: 'Từ vựng chuyên sâu (601+)',
      description: 'Từ vựng chuyên sâu và khó nhất',
      cards: vocabularyData.cards.slice(600)
    },

  ]



  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const handleCompleteCategory = (categoryId) => {
    if (!completedCategories.includes(categoryId)) {
      setCompletedCategories([...completedCategories, categoryId])
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
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
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

      {/* Categories */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Card 
              elevation={4} 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
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
          </Grid>
        ))}
      </Grid>

      {/* Progress Summary */}
      {completedCategories.length > 0 && (
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