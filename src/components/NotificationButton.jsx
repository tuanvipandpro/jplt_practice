import { useState, useEffect } from 'react'
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { 
  subscribeToNotifications, 
  subscribeToUnreadCount,
  markNotificationAsRead,
  getNotifications,
  createDemoNotification
} from '../services/notificationService'

const NotificationButton = () => {
  const { user } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState('0')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return
      
      try {
        setInitialLoading(true)
        setError(null)
        
        // Load initial notifications
        const initialNotifications = await getNotifications()
        setNotifications(initialNotifications)
        
        console.log('📱 Loaded initial notifications:', initialNotifications.length)
        
        // If no notifications, create a demo one
        if (initialNotifications.length === 0) {
          console.log('📝 Creating demo notification...')
          try {
            await createDemoNotification()
          } catch (error) {
            console.log('⚠️ Could not create demo notification:', error.message)
          }
        }
      } catch (error) {
        console.error('❌ Error loading initial notifications:', error)
        setError('Không thể tải thông báo')
      } finally {
        setInitialLoading(false)
      }
    }

    loadInitialData()
  }, [user])

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user || initialLoading) return

    console.log('🔄 Setting up realtime subscriptions...')

    // Subscribe to unread count
    const unsubscribeCount = subscribeToUnreadCount(user.uid, (count) => {
      console.log('📊 Unread count updated:', count)
      setUnreadCount(count)
    })

    // Subscribe to notifications
    const unsubscribeNotifications = subscribeToNotifications((notifs) => {
      console.log('📱 Notifications updated:', notifs.length)
      setNotifications(notifs)
    })

    return () => {
      console.log('🔄 Cleaning up subscriptions...')
      unsubscribeCount()
      unsubscribeNotifications()
    }
  }, [user, initialLoading])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notificationId) => {
    if (!user) return
    
    try {
      setLoading(true)
      await markNotificationAsRead(user.uid, notificationId)
      console.log('✅ Marked notification as read:', notificationId)
    } catch (error) {
      console.error('❌ Error marking notification as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const freshNotifications = await getNotifications()
      setNotifications(freshNotifications)
      console.log('🔄 Refreshed notifications:', freshNotifications.length)
    } catch (error) {
      console.error('❌ Error refreshing notifications:', error)
      setError('Không thể tải lại thông báo')
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <SuccessIcon color="success" />
      case 'warning':
        return <WarningIcon color="warning" />
      case 'error':
        return <ErrorIcon color="error" />
      default:
        return <InfoIcon color="info" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'info'
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Vừa xong'
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else {
      return date.toLocaleDateString('vi-VN')
    }
  }

  if (!user) return null

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        disabled={initialLoading}
        sx={{
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s'
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              minWidth: '20px',
              height: '20px'
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            '& .MuiMenuItem-root': {
              py: 1.5,
            }
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon />
              Thông báo
              {unreadCount !== '0' && (
                <Chip 
                  label={unreadCount} 
                  color="error" 
                  size="small"
                />
              )}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {initialLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          </Box>
        )}

        {!initialLoading && notifications.length === 0 && (
          <MenuItem disabled>
            <Box sx={{ textAlign: 'center', width: '100%', py: 2 }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>
                Không có thông báo mới
              </Box>
            </Box>
          </MenuItem>
        )}

        {!initialLoading && notifications.length > 0 && (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItemButton 
                  onClick={() => handleNotificationClick(notification.id)}
                  disabled={loading}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {notification.title}
                    </Box>
                    <Box sx={{ color: 'text.secondary', mb: 1 }}>
                      {notification.message}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 14 }} />
                      <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {formatDate(notification.createdAt)}
                      </Box>
                      {notification.priority === 'high' && (
                        <Chip 
                          label="Quan trọng" 
                          color="error" 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </ListItemButton>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Menu>
    </>
  )
}

export default NotificationButton 