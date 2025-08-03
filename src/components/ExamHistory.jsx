import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Assessment as AssessmentIcon,
  Grade as GradeIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { getUserExamHistory, getUserExamStats } from '../services/examService'

const ExamHistory = ({ open, onClose, user }) => {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open && user) {
      loadExamData()
    }
  }, [open, user])

  const loadExamData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [historyData, statsData] = await Promise.all([
        getUserExamHistory(user.uid, 20),
        getUserExamStats(user.uid)
      ])
      
      setHistory(historyData)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading exam data:', err)
      setError('Không thể tải dữ liệu. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'success'
      case 'B': return 'info' 
      case 'C': return 'warning'
      case 'D': return 'error'
      default: return 'default'
    }
  }

  const getExamTypeLabel = (examType) => {
    const labels = {
      grammar: 'Ngữ pháp',
      vocabulary: 'Từ vựng',
      kanji: 'Hán tự',
      hiragana: 'Hiragana',
      katakana: 'Katakana',
      listening: 'Nghe hiểu'
    }
    return labels[examType] || examType
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6">Lịch sử kết quả thi</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Tải lại">
              <IconButton onClick={loadExamData} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Statistics Cards */}
            {stats && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{stats.totalExams}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Tổng số bài thi
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{stats.averageScore}%</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Điểm trung bình
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <TrophyIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{stats.highestScore}%</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Điểm cao nhất
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <GradeIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">
                        {Object.keys(stats.examTypes).length}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Loại thi đã làm
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Exam History List */}
            {history.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Chưa có kết quả thi nào
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Hãy thực hiện bài thi đầu tiên của bạn!
                </Typography>
              </Box>
            ) : (
              <List>
                {history.map((exam, index) => (
                  <ListItem key={exam.id} sx={{ px: 0 }}>
                    <Card sx={{ width: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {exam.examTitle}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip 
                                label={getExamTypeLabel(exam.examType)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip 
                                label={`Grade ${exam.grade}`}
                                size="small"
                                color={getGradeColor(exam.grade)}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                              {exam.score}/{exam.totalQuestions}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ({exam.percentage}%)
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="textSecondary">
                                {formatDate(exam.completedAt)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="textSecondary">
                                Thời gian: {formatDuration(exam.timeSpent)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {exam.flaggedQuestions && exam.flaggedQuestions.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                              Câu đã đánh dấu: {exam.flaggedQuestions.length} câu
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExamHistory