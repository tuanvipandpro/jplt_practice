import React, { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { SmartToy, Close } from '@mui/icons-material'

const AIHelper = ({ open, onClose, question, userAnswer, correctAnswer, questionType, options, isSample }) => {
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState('')

  const generatePrompt = () => {
    let prompt = `Tôi đang học tiếng Nhật và gặp câu hỏi sau:\n\n`
    
    if (questionType === 'grammar') {
      prompt += `**Câu hỏi:** ${question}\n`
      prompt += `**Các lựa chọn:**\n`
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          prompt += `- ${key}: ${value}\n`
        })
      }
      prompt += `**Đáp án của tôi:** ${userAnswer}${options && options[userAnswer] ? ` (${options[userAnswer]})` : ''}\n`
      prompt += `**Đáp án đúng:** ${correctAnswer}${options && options[correctAnswer] ? ` (${options[correctAnswer]})` : ''}\n\n`
      prompt += `Hãy giải thích chi tiết bằng tiếng Việt, sử dụng markdown format:\n\n`
      prompt += `## 📝 Phân tích\n`
      prompt += `### 1. Tại sao đáp án đúng là "${correctAnswer}"?\n`
      prompt += `### 2. Tại sao các đáp án khác sai?\n`
      prompt += `### 3. Cấu trúc ngữ pháp liên quan\n`
      prompt += `### 4. Ví dụ tương tự\n`
      prompt += `### 5. Lời khuyên học tập\n\n`
      prompt += `**Lưu ý:** Sử dụng markdown để format đẹp, bao gồm:\n`
      prompt += `- **Bold** cho từ khóa quan trọng\n`
      prompt += `- *Italic* cho nhấn mạnh\n`
      prompt += `- \`code\` cho ví dụ ngắn\n`
      prompt += `- Lists cho các điểm chính\n`
      prompt += `- > Blockquote cho lưu ý đặc biệt`
    } else if (questionType === 'kanji') {
      prompt += `**Hán tự:** ${question}\n`
      prompt += `**Đáp án của tôi:** ${userAnswer}\n`
      prompt += `**Đáp án đúng:** ${correctAnswer}\n\n`
      prompt += `Hãy giải thích chi tiết về Hán tự này bằng tiếng Việt, sử dụng markdown format:\n\n`
      prompt += `## 📝 Phân tích Hán tự\n`
      prompt += `### 1. Ý nghĩa và cách đọc\n`
      prompt += `### 2. Cách nhớ Hán tự\n`
      prompt += `### 3. Từ ghép thường gặp\n`
      prompt += `### 4. Lịch sử và nguồn gốc\n`
      prompt += `### 5. Lời khuyên học tập\n\n`
      prompt += `**Lưu ý:** Sử dụng markdown để format đẹp, bao gồm:\n`
      prompt += `- **Bold** cho từ khóa quan trọng\n`
      prompt += `- *Italic* cho nhấn mạnh\n`
      prompt += `- \`code\` cho ví dụ ngắn\n`
      prompt += `- Lists cho các điểm chính\n`
      prompt += `- > Blockquote cho lưu ý đặc biệt`
    } else {
      prompt += `**Câu hỏi:** ${question}\n`
      prompt += `**Đáp án của tôi:** ${userAnswer}\n`
      prompt += `**Đáp án đúng:** ${correctAnswer}\n\n`
      prompt += `Hãy giải thích chi tiết bằng tiếng Việt, sử dụng markdown format:\n\n`
      prompt += `## 📝 Phân tích\n`
      prompt += `### 1. Cách đọc và ý nghĩa\n`
      prompt += `### 2. Cách nhớ ký tự\n`
      prompt += `### 3. Từ liên quan\n`
      prompt += `### 4. Lời khuyên học tập\n\n`
      prompt += `**Lưu ý:** Sử dụng markdown để format đẹp, bao gồm:\n`
      prompt += `- **Bold** cho từ khóa quan trọng\n`
      prompt += `- *Italic* cho nhấn mạnh\n`
      prompt += `- \`code\` cho ví dụ ngắn\n`
      prompt += `- Lists cho các điểm chính\n`
      prompt += `- > Blockquote cho lưu ý đặc biệt`
    }
    
    return prompt
  }

  const callGeminiAPI = async () => {
    setLoading(true)
    setError('')
    setAiResponse('')

    try {
      const prompt = generatePrompt()
      
      // Lấy API key từ environment hoặc GitHub Actions
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                    'YOUR_API_KEY_HERE'
      
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          timeout: 30000 // 30 seconds timeout
        }
      )

      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const aiText = response.data.candidates[0].content.parts[0].text
        setAiResponse(aiText)
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (err) {
      console.error('AI API Error:', err)
      if (err.response) {
        // Server responded with error status
        setError(`Lỗi API: ${err.response.status} - ${err.response.data?.error?.message || 'Unknown error'}`)
      } else if (err.request) {
        // Request was made but no response received
        setError('Không thể kết nối với AI. Vui lòng kiểm tra kết nối mạng.')
      } else {
        // Something else happened
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAskAI = () => {
    callGeminiAPI()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
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
        <SmartToy />
        Giải thích chi tiết với AI
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!loading && !aiResponse && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Bạn muốn AI giải thích chi tiết về câu hỏi này?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              AI sẽ phân tích tại sao đáp án đúng và tại sao các đáp án khác sai, cùng với cấu trúc ngữ pháp liên quan
            </Typography>
            <Button
              variant="contained"
              onClick={handleAskAI}
              startIcon={<SmartToy />}
              sx={{ bgcolor: '#2196F3' }}
            >
              Giải thích với AI
            </Button>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">
              AI đang phân tích câu hỏi...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {aiResponse && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Phân tích từ AI:
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              maxHeight: '60vh',
              overflow: 'auto'
            }}>
              <Box sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mt: 2,
                  mb: 1
                },
                '& h1': { fontSize: '1.5rem' },
                '& h2': { fontSize: '1.3rem' },
                '& h3': { fontSize: '1.1rem' },
                '& p': {
                  mb: 1,
                  lineHeight: 1.6
                },
                '& ul, & ol': {
                  pl: 2,
                  mb: 1
                },
                '& li': {
                  mb: 0.5
                },
                '& strong': {
                  fontWeight: 'bold',
                  color: 'primary.main'
                },
                '& em': {
                  fontStyle: 'italic'
                },
                '& code': {
                  bgcolor: 'grey.200',
                  px: 0.5,
                  py: 0.2,
                  borderRadius: 0.5,
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                },
                '& pre': {
                  bgcolor: 'grey.200',
                  p: 1,
                  borderRadius: 1,
                  overflow: 'auto',
                  mb: 1
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  ml: 0,
                  fontStyle: 'italic',
                  color: 'text.secondary'
                },
                '& table': {
                  borderCollapse: 'collapse',
                  width: '100%',
                  mb: 1
                },
                '& th, & td': {
                  border: '1px solid',
                  borderColor: 'grey.300',
                  p: 0.5,
                  textAlign: 'left'
                },
                '& th': {
                  bgcolor: 'grey.100',
                  fontWeight: 'bold'
                }
              }}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom components for better styling
                    h1: ({node, ...props}) => <Typography variant="h5" component="h1" {...props} />,
                    h2: ({node, ...props}) => <Typography variant="h6" component="h2" {...props} />,
                    h3: ({node, ...props}) => <Typography variant="subtitle1" component="h3" {...props} />,
                    p: ({node, ...props}) => <Typography variant="body1" component="p" {...props} />,
                    li: ({node, ...props}) => <Typography variant="body1" component="li" {...props} />,
                    strong: ({node, ...props}) => <Typography variant="body1" component="strong" {...props} />,
                    em: ({node, ...props}) => <Typography variant="body1" component="em" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                        <Typography variant="body1" component="code" {...props} /> :
                        <Typography variant="body2" component="pre" {...props} />,
                    blockquote: ({node, ...props}) => <Typography variant="body1" component="blockquote" {...props} />
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} startIcon={<Close />}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AIHelper 