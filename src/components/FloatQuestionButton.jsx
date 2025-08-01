import React, { useState, useRef, useEffect } from 'react'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Chip,
  List,
  ListItem,
  Divider
} from '@mui/material'
import {
  QuestionAnswer,
  Send,
  Close,
  SmartToy,
  Lightbulb,
  Person,
  SmartToy as BotIcon,
  Delete
} from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const FloatQuestionButton = () => {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const chatEndRef = useRef(null)
  const questionInputRef = useRef(null)

  const handleOpen = () => {
    setOpen(true)
    setQuestion('')
    setError('')
    // Focus vào input khi mở dialog
    setTimeout(() => {
      if (questionInputRef.current) {
        questionInputRef.current.focus()
      }
    }, 100)
  }

  const handleClose = () => {
    setOpen(false)
    setQuestion('')
    setError('')
  }

  const clearChatHistory = () => {
    setChatHistory([])
    localStorage.removeItem('aiChatHistory')
  }

  // Function để xử lý markdown syntax đặc biệt
  const processMarkdownContent = (content) => {
    if (!content) return content
    
    let processed = content
    
    // Xử lý highlight syntax ==text==
    processed = processed.replace(/==([^=]+)==/g, '<mark>$1</mark>')
    
    // Xử lý strikethrough ~~text~~
    processed = processed.replace(/~~([^~]+)~~/g, '<del>$1</del>')
    
    // Xử lý superscript ^text^
    processed = processed.replace(/\^([^^]+)\^/g, '<sup>$1</sup>')
    
    // Xử lý subscript ~text~ (không phải trong code blocks)
    processed = processed.replace(/(?<!`.*)~([^~`]+)~(?!.*`)/g, '<sub>$1</sub>')
    
    return processed
  }

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  // Lưu chat history vào localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory))
    }
  }, [chatHistory])

  // Load chat history từ localStorage khi component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiChatHistory')
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
  }, [])

  const optimizeQuestion = (userQuestion) => {
    // Tối ưu hóa câu hỏi để có kết quả tốt hơn
    let optimized = userQuestion.trim()
    
    // Thêm context nếu câu hỏi ngắn
    if (optimized.length < 10) {
      optimized = `Về tiếng Nhật: ${optimized}`
    }
    
    // Thêm yêu cầu trả lời bằng tiếng Việt
    if (!optimized.includes('tiếng Việt') && !optimized.includes('Vietnamese')) {
      optimized += ' (Trả lời bằng tiếng Việt)'
    }
    
    // Thêm yêu cầu format markdown nếu chưa có
    if (!optimized.includes('markdown') && !optimized.includes('format')) {
      optimized += ' (Sử dụng markdown để format đẹp)'
    }
    
    return optimized
  }

  const askAI = async () => {
    if (!question.trim()) {
      setError('Vui lòng nhập câu hỏi')
      return
    }

    const userQuestion = question.trim()
    setLoading(true)
    setError('')

    // Thêm câu hỏi của user vào chat history
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userQuestion,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    }
    
    setChatHistory(prev => [...prev, newUserMessage])
    setQuestion('')

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
      const optimizedQuestion = optimizeQuestion(userQuestion)
      
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
                  text: `Bạn là một giáo viên tiếng Nhật chuyên nghiệp. Hãy trả lời câu hỏi sau một cách chi tiết và hữu ích:

${optimizedQuestion}

Hãy trả lời bằng tiếng Việt, sử dụng markdown để format đẹp và dễ đọc. Bạn có thể sử dụng:

**Bold text** cho nhấn mạnh
*Italic text* cho chú thích
# ## ### Headers cho tiêu đề
- Lists cho danh sách
> Blockquotes cho trích dẫn
\`code\` cho code inline
\`\`\`language
code blocks
\`\`\` cho code blocks
| Tables | cho bảng |
|--------|----------|
| Data   | Data     |
[Links](url) cho liên kết
~~Strikethrough~~ cho gạch ngang
==Highlight== cho highlight
^superscript^ và ~subscript~

Hãy sử dụng markdown một cách hợp lý để làm cho câu trả lời dễ đọc và có cấu trúc rõ ràng.`
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
        
        // Thêm câu trả lời của AI vào chat history
        const newAIMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiText,
          timestamp: new Date().toLocaleTimeString('vi-VN')
        }
        
        setChatHistory(prev => [...prev, newAIMessage])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('AI API Error:', err)
      const errorMessage = 'Không thể kết nối với AI. Vui lòng kiểm tra API key hoặc thử lại sau.'
      
      // Thêm thông báo lỗi vào chat history
      const errorMsg = {
        id: Date.now() + 1,
        type: 'error',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      }
      
      setChatHistory(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    askAI()
  }

  const suggestedQuestions = [
    'Cách phân biệt は và が?',
    'Khi nào dùng です và だ?',
    'Cách đọc số đếm trong tiếng Nhật?',
    'Sự khác biệt giữa Hiragana và Katakana?',
    'Cách nhớ Kanji hiệu quả?',
    'Ngữ pháp cơ bản N5?'
  ]

  return (
    <>
      <Fab
        color="primary"
        aria-label="Hỏi AI"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
      >
        <QuestionAnswer />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh'
          }
        }}
      >
                 <DialogTitle sx={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'space-between',
           bgcolor: 'primary.main',
           color: 'white',
           py: 1.5
         }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <SmartToy />
             <Typography variant="h6">Hỏi đáp cùng AI</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             {chatHistory.length > 0 && (
               <IconButton 
                 onClick={clearChatHistory} 
                 sx={{ color: 'white' }}
                 title="Xóa lịch sử chat"
               >
                 <Delete />
               </IconButton>
             )}
             <IconButton onClick={handleClose} sx={{ color: 'white' }}>
               <Close />
             </IconButton>
           </Box>
         </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '70vh' }}>
          {/* Chat History */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {chatHistory.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}>
                <SmartToy sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Chào bạn! 👋
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                  Tôi là trợ lý AI chuyên về tiếng Nhật. Hãy hỏi tôi bất kỳ điều gì về ngữ pháp, từ vựng, hoặc văn hóa Nhật Bản nhé!
                </Typography>
                
                {/* Suggested Questions */}
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Câu hỏi gợi ý:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {suggestedQuestions.map((suggested, index) => (
                      <Chip
                        key={index}
                        label={suggested}
                        size="small"
                        onClick={() => setQuestion(suggested)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.light'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <>
                {chatHistory.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '80%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: message.type === 'user' ? 'primary.main' : 
                                message.type === 'error' ? 'error.light' : 'grey.100',
                        color: message.type === 'user' ? 'white' : 'text.primary',
                        position: 'relative'
                      }}
                    >
                      {/* Message Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 1,
                        opacity: 0.8
                      }}>
                        {message.type === 'user' ? (
                          <Person sx={{ fontSize: 16 }} />
                        ) : message.type === 'error' ? (
                          <Typography variant="caption" sx={{ color: 'error.dark' }}>
                            ⚠️ Lỗi
                          </Typography>
                        ) : (
                          <BotIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        )}
                        <Typography variant="caption">
                          {message.timestamp}
                        </Typography>
                      </Box>

                      {/* Message Content */}
                      {message.type === 'ai' ? (
                        <Box sx={{
                          '& h1, & h2, & h3, & h4, & h5, & h6': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mt: 1,
                            mb: 0.5,
                            fontSize: '1rem'
                          },
                          '& p': {
                            mb: 0.5,
                            lineHeight: 1.5
                          },
                          '& strong': {
                            fontWeight: 'bold',
                            color: 'primary.main'
                          },
                          '& em': {
                            fontStyle: 'italic'
                          },
                          '& ul, & ol': {
                            pl: 1.5,
                            mb: 0.5
                          },
                          '& li': {
                            mb: 0.25
                          },
                          '& blockquote': {
                            borderLeft: '3px solid',
                            borderColor: 'primary.main',
                            pl: 1,
                            ml: 0,
                            fontStyle: 'italic',
                            bgcolor: 'grey.50',
                            py: 0.5
                          },
                          '& code': {
                            bgcolor: 'grey.200',
                            px: 0.5,
                            py: 0.25,
                            borderRadius: 0.5,
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          },
                          '& pre': {
                            bgcolor: 'grey.200',
                            p: 0.5,
                            borderRadius: 0.5,
                            overflow: 'auto',
                            fontSize: '0.85rem',
                            border: '1px solid',
                            borderColor: 'grey.300'
                          },
                          '& table': {
                            borderCollapse: 'collapse',
                            width: '100%',
                            mb: 0.5,
                            fontSize: '0.85rem',
                            border: '1px solid',
                            borderColor: 'grey.300'
                          },
                          '& th, & td': {
                            border: '1px solid #ddd',
                            p: 0.5,
                            textAlign: 'left'
                          },
                          '& th': {
                            bgcolor: 'grey.200',
                            fontWeight: 'bold'
                          },
                          '& hr': {
                            border: 'none',
                            borderTop: '1px solid',
                            borderColor: 'grey.300',
                            my: 1
                          },
                          '& a': {
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          },
                          '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1
                          },
                          '& del': {
                            textDecoration: 'line-through',
                            color: 'text.secondary'
                          },
                          '& mark': {
                            bgcolor: 'warning.light',
                            color: 'warning.contrastText',
                            px: 0.25
                          },
                          '& .highlight': {
                            bgcolor: 'warning.light',
                            color: 'warning.contrastText',
                            px: 0.25
                          },
                          '& sup': {
                            fontSize: '0.75rem',
                            verticalAlign: 'super'
                          },
                          '& sub': {
                            fontSize: '0.75rem',
                            verticalAlign: 'sub'
                          }
                        }}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              // Custom components for better styling
                              h1: ({children}) => <h1 style={{fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '0.25rem'}}>{children}</h1>,
                              h2: ({children}) => <h2 style={{fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.25rem'}}>{children}</h2>,
                              h3: ({children}) => <h3 style={{fontSize: '1rem', marginTop: '0.5rem', marginBottom: '0.25rem'}}>{children}</h3>,
                              code: ({node, inline, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline ? (
                                  <pre style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    overflow: 'auto',
                                    fontSize: '0.85rem',
                                    border: '1px solid #e0e0e0'
                                  }}>
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code className={className} {...props} style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem'
                                  }}>
                                    {children}
                                  </code>
                                )
                              },
                              table: ({children}) => (
                                <div style={{overflow: 'auto', marginBottom: '0.5rem'}}>
                                  <table style={{
                                    borderCollapse: 'collapse',
                                    width: '100%',
                                    fontSize: '0.85rem',
                                    border: '1px solid #e0e0e0'
                                  }}>
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({children}) => (
                                <th style={{
                                  border: '1px solid #ddd',
                                  padding: '0.5rem',
                                  textAlign: 'left',
                                  backgroundColor: '#f5f5f5',
                                  fontWeight: 'bold'
                                }}>
                                  {children}
                                </th>
                              ),
                              td: ({children}) => (
                                <td style={{
                                  border: '1px solid #ddd',
                                  padding: '0.5rem',
                                  textAlign: 'left'
                                }}>
                                  {children}
                                </td>
                              ),
                              // Custom component để xử lý HTML tags đặc biệt
                              div: ({children, ...props}) => {
                                if (props.dangerouslySetInnerHTML) {
                                  return <div {...props} />
                                }
                                return <div {...props}>{children}</div>
                              }
                            }}
                          >
                            {processMarkdownContent(message.content)}
                          </ReactMarkdown>
                        </Box>
                      ) : (
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                
                {/* Loading indicator */}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        AI đang suy nghĩ...
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Nhập câu hỏi của bạn..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                  inputRef={questionInputRef}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !question.trim()}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    borderRadius: 2
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : <Send />}
                </Button>
              </Box>
            </form>

            {/* Error Message */}
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FloatQuestionButton 