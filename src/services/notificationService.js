import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Tạo thông báo mới (chỉ admin)
export const createNotification = async (notificationData) => {
  try {
    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info', // info, success, warning, error
      priority: notificationData.priority || 'normal', // low, normal, high
      createdAt: serverTimestamp(),
      isActive: true,
      targetUsers: notificationData.targetUsers || 'all', // all, specific
      expiresAt: notificationData.expiresAt || null
    }
    
    const docRef = await addDoc(collection(db, 'notifications'), notification)
    return docRef.id
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Lấy tất cả thông báo
export const getNotifications = async () => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    const querySnapshot = await getDocs(q)
    const notifications = []
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return notifications
  } catch (error) {
    console.error('Error getting notifications:', error)
    throw error
  }
}

// Lấy thông báo real-time
export const subscribeToNotifications = (callback) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const notifications = []
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        })
      })
      callback(notifications)
    })
  } catch (error) {
    console.error('Error subscribing to notifications:', error)
    throw error
  }
}

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const userNotificationRef = doc(db, 'userNotifications', `${userId}_${notificationId}`)
    await updateDoc(userNotificationRef, {
      isRead: true,
      readAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

// Lấy số thông báo chưa đọc của user
export const getUnreadNotificationCount = async (userId) => {
  try {
    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

// Lấy số thông báo chưa đọc real-time
export const subscribeToUnreadCount = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const count = querySnapshot.size
      callback(count > 99 ? '99+' : count.toString())
    })
  } catch (error) {
    console.error('Error subscribing to unread count:', error)
    callback('0')
  }
}

// Tạo thông báo deployment (tự động)
export const createDeploymentNotification = async () => {
  try {
    const notification = {
      title: '🚀 Cập nhật mới',
      message: 'Ứng dụng đã được cập nhật với các tính năng mới! Hãy khám phá ngay.',
      type: 'success',
      priority: 'normal',
      createdAt: serverTimestamp(),
      isActive: true,
      targetUsers: 'all',
      expiresAt: null
    }
    
    const docRef = await addDoc(collection(db, 'notifications'), notification)
    return docRef.id
  } catch (error) {
    console.error('Error creating deployment notification:', error)
    throw error
  }
} 