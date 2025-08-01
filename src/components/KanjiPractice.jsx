import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Divider
} from '@mui/material'
import {
  ArrowBack,
  NavigateNext,
  NavigateBefore,
  Visibility,
  VisibilityOff,
  SmartToy,
  Lightbulb,
  School,
  History,
  Psychology
} from '@mui/icons-material'
import kanjiData from '../data/kanji.json'
import AIHelper from './AIHelper'
import ReactMarkdown from 'react-markdown'
import AudioPlayer from './AudioPlayer'

const KanjiPractice = ({ onBack }) => {
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [funFactDialogOpen, setFunFactDialogOpen] = useState(false)
  const [funFact, setFunFact] = useState('')
  const [loadingFunFact, setLoadingFunFact] = useState(false)

  const currentKanji = kanjiData.cards[currentCard]

  const nextCard = () => {
    if (currentCard < kanjiData.cards.length - 1) {
      setCurrentCard(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1)
      setShowAnswer(false)
    }
  }

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const generateFunFact = async () => {
    setLoadingFunFact(true)
    setFunFactDialogOpen(true)
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Tôi đang học Hán tự tiếng Nhật và gặp chữ "${currentKanji.front}" (${currentKanji.meaning}).

Hãy tạo ra một điều thú vị hoặc bất ngờ về Hán tự này mà có thể tôi chưa biết. Ví dụ:
- Lịch sử hình thành của chữ này
- Mối liên hệ với các Hán tự khác
- Cách nhớ thú vị
- Sự thật bất ngờ về ý nghĩa
- Cách sử dụng trong văn hóa Nhật Bản

Trả lời bằng tiếng Việt, ngắn gọn và thú vị. Sử dụng markdown để format đẹp với các thẻ như:
- **Bold** cho tiêu đề quan trọng
- *Italic* cho nhấn mạnh
- ### Tiêu đề cho các phần
- - Danh sách cho các điểm chính
- > Quote cho thông tin đặc biệt`
                }
              ]
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('API Error')
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiText = data.candidates[0].content.parts[0].text
        setFunFact(aiText)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('AI API Error:', err)
      setFunFact('Không thể tải thông tin thú vị. Vui lòng thử lại sau.')
    } finally {
      setLoadingFunFact(false)
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      p: { xs: 1, sm: 2 },
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Paper elevation={8} sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          <Button onClick={onBack} startIcon={<ArrowBack />}>
            Quay lại
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Luyện tập: Hán tự
          </Typography>
          <Chip 
            label={`${currentCard + 1}/${kanjiData.cards.length}`} 
            size="small"
            color="primary"
          />
        </Box>

        {/* Kanji Card */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ 
            width: '100%', 
            maxWidth: 400,
            textAlign: 'center',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Kanji Character */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h1" sx={{ 
                  fontSize: { xs: '4rem', sm: '6rem' },
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}>
                  {currentKanji.front}
                </Typography>
                <AudioPlayer 
                  text={currentKanji.front}
                  pronunciation={currentKanji.pronunciation}
                  size="large"
                />
              </Box>

              {/* Answer Section */}
              {showAnswer ? (
                <Box>
                  <Typography variant="h5" gutterBottom color="success.main">
                    {currentKanji.meaning}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Cách đọc: {currentKanji.romanji}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Hiragana: {currentKanji.hiragana}
                  </Typography>
                  {currentKanji.example && (
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                      Ví dụ: {currentKanji.example}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Nhấn để xem đáp án
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="outlined"
                onClick={toggleAnswer}
                startIcon={showAnswer ? <VisibilityOff /> : <Visibility />}
              >
                {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
              </Button>
            </CardActions>
          </Card>

          {/* Fun Features */}
          {showAnswer && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => setAiDialogOpen(true)}
                startIcon={<SmartToy />}
                color="primary"
              >
                Hỏi đáp cùng AI
              </Button>
              <Button
                variant="outlined"
                onClick={generateFunFact}
                startIcon={<Lightbulb />}
                color="secondary"
                disabled={loadingFunFact}
              >
                {loadingFunFact ? 'Đang tải...' : 'Điều thú vị'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          <IconButton 
            onClick={prevCard} 
            disabled={currentCard === 0}
            size="large"
          >
            <NavigateBefore />
          </IconButton>
          <IconButton 
            onClick={nextCard} 
            disabled={currentCard === kanjiData.cards.length - 1}
            size="large"
          >
            <NavigateNext />
          </IconButton>
        </Box>
      </Paper>

      {/* AI Helper Dialog */}
      <AIHelper
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        question={currentKanji.front}
        userAnswer=""
        correctAnswer={currentKanji.meaning}
        questionType="kanji"
      />

      {/* Fun Fact Dialog */}
      <Dialog 
        open={funFactDialogOpen} 
        onClose={() => setFunFactDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: 'secondary.main',
          color: 'white'
        }}>
          <Lightbulb />
          Điều thú vị về Hán tự {currentKanji.front}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loadingFunFact ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Đang tạo điều thú vị...</Typography>
            </Box>
          ) : (
            <Box sx={{
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: 'secondary.main',
                fontWeight: 'bold',
                mt: 2,
                mb: 1
              },
              '& p': {
                mb: 1,
                lineHeight: 1.6
              },
              '& strong': {
                fontWeight: 'bold',
                color: 'secondary.main'
              },
              '& em': {
                fontStyle: 'italic'
              },
              '& ul, & ol': {
                pl: 2,
                mb: 1
              },
              '& li': {
                mb: 0.5
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'secondary.main',
                pl: 2,
                ml: 0,
                fontStyle: 'italic'
              },
              '& code': {
                bgcolor: 'grey.100',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: 'monospace'
              }
            }}>
              <ReactMarkdown>
                {funFact}
              </ReactMarkdown>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFunFactDialogOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KanjiPractice 