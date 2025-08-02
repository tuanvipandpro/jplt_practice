import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material'
import { updatePersonalInfo } from '../services/userService'

const UserProfile = ({ open, onClose, user, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: userData?.personalInfo?.fullName || user?.name || '',
    nickname: userData?.personalInfo?.nickname || '',
    dateOfBirth: userData?.personalInfo?.dateOfBirth || '',
    phoneNumber: userData?.personalInfo?.phoneNumber || '',
    address: userData?.personalInfo?.address || '',
    bio: userData?.personalInfo?.bio || '',
    learningGoals: userData?.personalInfo?.learningGoals || '',
    preferredLanguage: userData?.personalInfo?.preferredLanguage || 'vi'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await updatePersonalInfo(user.uid, formData)
      onUpdate && onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.picture} alt={user?.name} sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h6">Thông tin cá nhân</Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật thông tin cá nhân của bạn
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Biệt danh"
              value={formData.nickname}
              onChange={handleChange('nickname')}
              margin="normal"
              helperText="Tên gọi thân mật"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={handleChange('address')}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Giới thiệu"
              value={formData.bio}
              onChange={handleChange('bio')}
              margin="normal"
              multiline
              rows={3}
              helperText="Giới thiệu ngắn về bản thân"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mục tiêu học tập"
              value={formData.learningGoals}
              onChange={handleChange('learningGoals')}
              margin="normal"
              multiline
              rows={3}
              helperText="Mô tả mục tiêu học tập tiếng Nhật của bạn"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Ngôn ngữ ưa thích</InputLabel>
              <Select
                value={formData.preferredLanguage}
                onChange={handleChange('preferredLanguage')}
                label="Ngôn ngữ ưa thích"
              >
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ja">日本語</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Thống kê học tập:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${userData?.learningStats?.totalSessions || 0} buổi học`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`${userData?.learningStats?.currentStreak || 0} ngày liên tiếp`} 
                  color="secondary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`${userData?.learningStats?.completedLessons || 0} bài học hoàn thành`} 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserProfile 