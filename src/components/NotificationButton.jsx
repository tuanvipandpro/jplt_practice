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
  Alert,
  Card,
  CardContent
} from '@mui/material'
import { 
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  LocalOffer as VersionIcon,
  Description as ReleaseNotesIcon,
  Rocket as UpdateIcon
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

  // Parse and format notification message
  const parseNotificationMessage = (message) => {
    if (!message) return { mainMessage: '', releaseNotes: '' }
    
    // Split message to extract release notes
    const parts = message.split('\n\n📝 **Có gì mới:**\n')
    const mainMessage = parts[0]
    
    if (parts.length > 1) {
      const releaseNotesSection = parts[1].split('\n\n✨ Hãy khám phá ngay!')[0]
      return {
        mainMessage,
        releaseNotes: releaseNotesSection.trim()
      }
    }
    
    return {
      mainMessage,
      releaseNotes: ''
    }
  }

  // Check if notification is a deployment notification
  const isDeploymentNotification = (notification) => {
    return notification.version || notification.metadata?.source === 'github-actions'
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
            width: { xs: 300, sm: 360 },
            maxHeight: { xs: 400, sm: 450 },
            '& .MuiMenuItem-root': {
              py: 0.8,
            }
          }
        }}
      >
        <Box sx={{ p: 1.2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.6, fontWeight: 600, fontSize: '0.95rem' }}>
              <NotificationsIcon sx={{ fontSize: 18 }} />
              Thông báo
              {unreadCount !== '0' && (
                <Chip 
                  label={unreadCount} 
                  color="error" 
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              )}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={loading}
              sx={{ p: 0.4 }}
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {initialLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={18} />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 1.2 }}>
            <Alert severity="error" sx={{ mb: 0.4, fontSize: '0.8rem' }}>
              {error}
            </Alert>
          </Box>
        )}

        {!initialLoading && notifications.length === 0 && (
          <MenuItem disabled>
            <Box sx={{ textAlign: 'center', width: '100%', py: 1.2 }}>
              <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Không có thông báo mới
              </Box>
            </Box>
          </MenuItem>
        )}

        {!initialLoading && notifications.length > 0 && (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => {
              const { mainMessage, releaseNotes } = parseNotificationMessage(notification.message)
              const isDeployment = isDeploymentNotification(notification)
              
              return (
                <Box key={notification.id}>
                  <ListItemButton 
                    onClick={() => handleNotificationClick(notification.id)}
                    disabled={loading}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      px: 0
                    }}
                  >
                    <Box sx={{ width: '100%', p: 1 }}>
                      {isDeployment ? (
                        // Enhanced layout for deployment notifications
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            bgcolor: 'primary.50',
                            border: '1px solid',
                            borderColor: 'primary.200'
                          }}
                        >
                          <CardContent sx={{ p: 1.2, '&:last-child': { pb: 1.2 } }}>
                            {/* Header with version */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
                              <UpdateIcon color="primary" sx={{ fontSize: 16 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1, fontSize: '0.9rem' }}>
                                {notification.title}
                              </Typography>
                              {notification.version && (
                                <Chip 
                                  icon={<VersionIcon sx={{ fontSize: 12 }} />}
                                  label={notification.version}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                              )}
                            </Box>
                            
                            {/* Main message */}
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.8rem', lineHeight: 1.3 }}>
                              {mainMessage}
                            </Typography>
                            
                            {/* Release notes section */}
                            {releaseNotes && (
                              <Box sx={{ 
                                bgcolor: 'grey.50', 
                                borderRadius: 0.6, 
                                p: 0.8, 
                                mb: 1,
                                border: '1px solid',
                                borderColor: 'grey.200'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 0.3 }}>
                                  <ReleaseNotesIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                                    Có gì mới
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.primary',
                                  fontStyle: 'italic',
                                  pl: 0.6,
                                  fontSize: '0.75rem',
                                  lineHeight: 1.2
                                }}>
                                  "{releaseNotes}"
                                </Typography>
                              </Box>
                            )}
                            
                            {/* Footer with metadata */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                <ScheduleIcon sx={{ fontSize: 10 }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                  {formatDate(notification.createdAt)}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 0.3 }}>
                                {notification.priority === 'high' && (
                                  <Chip 
                                    label="Quan trọng" 
                                    color="error" 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ height: 16, fontSize: '0.6rem' }}
                                  />
                                )}
                                <Chip 
                                  label="Cập nhật" 
                                  color="success" 
                                  size="small"
                                  sx={{ height: 16, fontSize: '0.6rem' }}
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ) : (
                        // Standard layout for regular notifications
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6 }}>
                          <ListItemIcon sx={{ minWidth: 24, mt: 0.2 }}>
                            {getNotificationIcon(notification.type)}
                          </ListItemIcon>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.3, fontSize: '0.85rem' }}>
                              {notification.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.6, lineHeight: 1.2, fontSize: '0.78rem' }}>
                              {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                              <ScheduleIcon sx={{ fontSize: 10 }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                {formatDate(notification.createdAt)}
                              </Typography>
                              {notification.priority === 'high' && (
                                <Chip 
                                  label="Quan trọng" 
                                  color="error" 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ height: 16, fontSize: '0.6rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </ListItemButton>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              )
            })}
          </List>
        )}
      </Menu>
    </>
  )
}

export default NotificationButton 