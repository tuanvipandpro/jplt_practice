import { useState } from 'react'
import { Box, Typography, Avatar, Button, Menu, MenuItem, IconButton, CircularProgress, Divider, Chip } from '@mui/material'
import { Google as GoogleIcon, Edit as EditIcon, Settings as SettingsIcon, School as SchoolIcon, Assessment as AssessmentIcon } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import UserProfile from './UserProfile'
import ExamHistory from './ExamHistory'
import NotificationButton from './NotificationButton'

const Header = () => {
  const { user, userData, loading, login, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [examHistoryOpen, setExamHistoryOpen] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setAnchorEl(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileOpen = () => {
    setProfileOpen(true)
    handleMenuClose()
  }

  const handleExamHistoryOpen = () => {
    setExamHistoryOpen(true)
    handleMenuClose()
  }

  const handleProfileUpdate = () => {
    // Refresh user data after profile update
    // This will be handled by the useAuth hook automatically
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Chưa có'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <>
      <Box 
        className="app-header"
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: 1,
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          px: 3,
          minHeight: '60px',
        }}
      >
        {/* Phần đăng nhập/người dùng */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : user ? (
            <>
              {/* Notification Button */}
              <NotificationButton />
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <Avatar 
                  src={user.picture} 
                  alt={user.name}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 320,
                    maxWidth: 400,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                    }
                  }
                }}
              >
                {/* User Info Section */}
                <MenuItem onClick={handleMenuClose} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Avatar src={user.picture} alt={user.name} sx={{ width: 48, height: 48 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {userData?.personalInfo?.fullName || user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                      {userData?.personalInfo?.nickname && (
                        <Typography variant="caption" sx={{ color: 'primary.main', display: 'block' }}>
                          "{userData.personalInfo.nickname}"
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Learning Stats */}
                  {userData?.learningStats && (
                    <Box sx={{ mt: 2, width: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SchoolIcon sx={{ fontSize: 16 }} />
                        Thống kê học tập
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${userData.learningStats.totalSessions || 0} buổi`} 
                          size="small"
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`${userData.learningStats.currentStreak || 0} ngày`} 
                          size="small"
                          color="secondary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`${userData.learningStats.completedLessons || 0} bài`} 
                          size="small"
                          color="success" 
                          variant="outlined" 
                        />
                      </Box>
                    </Box>
                  )}
                </MenuItem>
                
                <Divider />
                
                                {/* Action Buttons */}
                <MenuItem onClick={handleProfileOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EditIcon sx={{ fontSize: 18 }} />
                  Chỉnh sửa thông tin
                </MenuItem>
                
                <MenuItem onClick={handleExamHistoryOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon sx={{ fontSize: 18 }} />
                  Xem kết quả thi
                </MenuItem>
                
                <MenuItem onClick={handleMenuClose} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon sx={{ fontSize: 18 }} />
                  Cài đặt
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={isLoggingIn ? <CircularProgress size={16} /> : <GoogleIcon />}
              onClick={handleLogin}
              disabled={isLoggingIn}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s'
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          )}
        </Box>
      </Box>
      
      {/* User Profile Dialog */}
      <UserProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />

      {/* Exam History Dialog */}
      <ExamHistory
        open={examHistoryOpen}
        onClose={() => setExamHistoryOpen(false)}
        user={user}
      />
    </>
  )
}

export default Header 