import React, { useState } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material'
import { SmartToy, Close, Refresh, School } from '@mui/icons-material'
import testDemoData from '../data/test-demo.json'

const ExamGenerator = ({ open, onClose, onExamGenerated }) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('')
  const [error, setError] = useState('')
  const [generatedExam, setGeneratedExam] = useState(null)
  
  // Form state
  const [examConfig, setExamConfig] = useState({
    level: 'N5',
    title: '',
    sections: ['vocabulary', 'grammar', 'reading', 'listening'],
    questionsPerSection: 10
  })

  const sectionTitles = {
    vocabulary: 'PHẦN TỪ VỰNG',
    grammar: 'PHẦN NGỮ PHÁP', 
    reading: 'PHẦN ĐỌC HIỂU',
    listening: 'PHẦN NGHE HIỂU',
    questionWords: 'PHẦN NGHI VẤN TỪ',
    sentenceOrder: 'PHẦN ĐIỀN DẤU ★',
    synonyms: 'CÂU ĐỒNG NGHĨA'
  }

  const generatePromptForSection = (sectionType, level, questionCount) => {
    const sectionTitle = sectionTitles[sectionType]
    
    let prompt = `Tôi đang tạo đề thi tiếng Nhật trình độ ${level}.

**Phần thi:** ${sectionTitle}
**Số câu hỏi:** ${questionCount}
**Trình độ:** ${level}

Hãy tạo ${questionCount} câu hỏi trắc nghiệm cho phần này. Mỗi câu hỏi phải có:
- 1 câu hỏi chính bằng tiếng Nhật
- 4 lựa chọn A, B, C, D
- 1 đáp án đúng
- Độ khó phù hợp với trình độ ${level}

**Format trả lời bằng JSON:**
\`\`\`json
[
  {
    "question": "Câu hỏi chính bằng tiếng Nhật",
    "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
    "answer": "A"
  }
]
\`\`\`

**Yêu cầu đặc biệt cho từng phần:**

`

    switch (sectionType) {
      case 'vocabulary':
        prompt += `- Câu hỏi về từ vựng, nghĩa của từ, cách sử dụng từ
- Có thể hỏi về danh từ, động từ, tính từ, trạng từ
- Độ khó từ vựng phù hợp với ${level}`
        break
      case 'grammar':
        prompt += `- Câu hỏi về ngữ pháp, cấu trúc câu
- Có thể hỏi về trợ từ, động từ, tính từ, cách chia động từ
- Ngữ pháp phù hợp với ${level}`
        break
      case 'reading':
        prompt += `- Câu hỏi đọc hiểu với đoạn văn ngắn
- Có thể hỏi về nội dung, ý chính, chi tiết trong đoạn văn
- Độ dài đoạn văn phù hợp với ${level}`
        break
      case 'listening':
        prompt += `- Câu hỏi nghe hiểu (có thể có audio file)
- Có thể hỏi về hội thoại, thông tin trong audio
- Độ khó nghe hiểu phù hợp với ${level}`
        break
      case 'questionWords':
        prompt += `- Câu hỏi về từ nghi vấn (なに、どこ、いつ、だれ、どうして、など)
- Có thể hỏi về cách sử dụng từ nghi vấn trong câu
- Ngữ pháp từ nghi vấn phù hợp với ${level}`
        break
      case 'sentenceOrder':
        prompt += `- Câu hỏi sắp xếp từ thành câu hoàn chỉnh
- Có thể hỏi về thứ tự từ trong câu, cấu trúc câu
- Độ khó sắp xếp phù hợp với ${level}`
        break
      case 'synonyms':
        prompt += `- Câu hỏi về câu đồng nghĩa hoặc cách diễn đạt tương đương
- Có thể hỏi về cách nói khác của cùng một ý
- Độ khó từ vựng và ngữ pháp phù hợp với ${level}`
        break
    }

    prompt += `

**Lưu ý:**
- Câu hỏi phải bằng tiếng Nhật
- Đáp án phải chính xác về ngữ pháp và từ vựng
- Độ khó phù hợp với trình độ ${level}
- Trả lời chính xác theo format JSON
- Chỉ trả lời JSON, không có text khác`

    return prompt
  }

  const callGeminiAPI = async (sectionType, level, questionCount) => {
    try {
      const prompt = generatePromptForSection(sectionType, level, questionCount)
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
      
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
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
          timeout: 30000
        }
      )

      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const aiText = response.data.candidates[0].content.parts[0].text
        
        // Extract JSON from response
        const jsonMatch = aiText.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          const jsonStr = jsonMatch[1]
          const questions = JSON.parse(jsonStr)
          
          return questions
        } else {
          throw new Error('Không tìm thấy JSON trong response')
        }
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (err) {
      console.error('AI API Error:', err)
      throw err
    }
  }

  const generateExam = async () => {
    setLoading(true)
    setError('')
    setGeneratedExam(null)
    
    const exam = {
      title: examConfig.title || `Đề Thi Tiếng Nhật ${examConfig.level} (Tổng hợp ${examConfig.sections.join(', ')})`,
      sections: []
    }
    
    const totalSections = examConfig.sections.length
    
    try {
      for (let i = 0; i < examConfig.sections.length; i++) {
        const sectionType = examConfig.sections[i]
        setCurrentSection(sectionTitles[sectionType])
        setProgress(((i + 1) / totalSections) * 100)
        
        try {
          const questions = await callGeminiAPI(sectionType, examConfig.level, examConfig.questionsPerSection)
          
          exam.sections.push({
            section_title: sectionTitles[sectionType],
            questions: questions
          })
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (err) {
          console.error(`Error generating questions for section ${sectionType}:`, err)
          // Continue with next section
        }
      }
      
      setGeneratedExam(exam)
      onExamGenerated(exam)
      
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
      setProgress(0)
      setCurrentSection('')
    }
  }

  const handleGenerate = () => {
    generateExam()
  }

  const handleSectionChange = (event) => {
    setExamConfig({
      ...examConfig,
      sections: event.target.value
    })
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
          maxHeight: '90vh'
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
        <School />
        Tạo đề thi với AI
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!loading && !generatedExam && !error && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Cấu hình đề thi
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tiêu đề đề thi"
                  value={examConfig.title}
                  onChange={(e) => setExamConfig({...examConfig, title: e.target.value})}
                  placeholder="Để trống để tự động tạo tiêu đề"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Trình độ</InputLabel>
                  <Select
                    value={examConfig.level}
                    label="Trình độ"
                    onChange={(e) => setExamConfig({...examConfig, level: e.target.value})}
                  >
                    <MenuItem value="N5">N5</MenuItem>
                    <MenuItem value="N4">N4</MenuItem>
                    <MenuItem value="N3">N3</MenuItem>
                    <MenuItem value="N2">N2</MenuItem>
                    <MenuItem value="N1">N1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Các phần thi</InputLabel>
                  <Select
                    multiple
                    value={examConfig.sections}
                    label="Các phần thi"
                    onChange={handleSectionChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={sectionTitles[value]} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="vocabulary">PHẦN TỪ VỰNG</MenuItem>
                    <MenuItem value="grammar">PHẦN NGỮ PHÁP</MenuItem>
                    <MenuItem value="reading">PHẦN ĐỌC HIỂU</MenuItem>
                    <MenuItem value="listening">PHẦN NGHE HIỂU</MenuItem>
                    <MenuItem value="questionWords">PHẦN NGHI VẤN TỪ</MenuItem>
                    <MenuItem value="sentenceOrder">PHẦN ĐIỀN DẤU ★</MenuItem>
                    <MenuItem value="synonyms">CÂU ĐỒNG NGHĨA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số câu hỏi mỗi phần"
                  value={examConfig.questionsPerSection}
                  onChange={(e) => setExamConfig({...examConfig, questionsPerSection: parseInt(e.target.value)})}
                  inputProps={{ min: 5, max: 20 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Sẽ tạo {examConfig.sections.length} phần × {examConfig.questionsPerSection} câu = {examConfig.sections.length * examConfig.questionsPerSection} câu hỏi
              </Typography>
              <Button
                variant="contained"
                onClick={handleGenerate}
                startIcon={<SmartToy />}
                sx={{ bgcolor: '#2196F3' }}
              >
                Bắt đầu tạo đề thi
              </Button>
            </Box>
          </Box>
        )}

        {loading && (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Đang tạo đề thi...
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {currentSection}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}% hoàn thành
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {generatedExam && !loading && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              ✅ Đã tạo thành công đề thi
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              maxHeight: '40vh',
              overflow: 'auto'
            }}>
              <Typography variant="body2" gutterBottom>
                <strong>Thông tin đề thi:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Tiêu đề:</strong> {generatedExam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Số phần:</strong> {generatedExam.sections.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Tổng câu hỏi:</strong> {generatedExam.sections.reduce((total, section) => total + section.questions.length, 0)}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {generatedExam.sections.map((section, index) => (
                  <Chip
                    key={index}
                    label={`${section.section_title}: ${section.questions.length} câu`}
                    size="small"
                    color="success"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Đề thi đã được tạo với format tương tự test-demo.json và sẵn sàng sử dụng.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {generatedExam && !loading && (
          <Button 
            onClick={handleGenerate} 
            startIcon={<Refresh />}
            variant="outlined"
          >
            Tạo lại
          </Button>
        )}
        <Button onClick={onClose} startIcon={<Close />}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExamGenerator 