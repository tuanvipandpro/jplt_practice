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
  onSnapshot,
  setDoc
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Kiểm tra Firestore có sẵn không
const isFirestoreAvailable = () => {
  return db !== null
}

// Tạo thông báo mới (chỉ admin)
export const createNotification = async (notificationData) => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Skipping notification creation.')
    return null
  }

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
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Returning empty notifications.')
    return []
  }

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
    // Trả về mảng rỗng thay vì throw error
    return []
  }
}

// Subscribe to notifications real-time
export const subscribeToNotifications = (callback) => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Notifications disabled.')
    callback([])
    return () => {}
  }

  try {
    const q = query(
      collection(db, 'notifications'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
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
    }, (error) => {
      console.error('Error in notifications subscription:', error)
      // Tạm thời disable notification khi chưa có quyền
      if (error.code === 'permission-denied' || error.code === 'missing-permissions') {
        console.warn('Firestore permissions not configured. Notifications disabled.')
        callback([])
      } else {
        callback([]) // Trả về array rỗng khi có lỗi
      }
    })
  } catch (error) {
    console.error('Error subscribing to notifications:', error)
    callback([]) // Trả về array rỗng khi có lỗi
    return () => {} // Return empty function
  }
}

// Đánh dấu thông báo đã đọc (simplified)
export const markNotificationAsRead = async (userId, notificationId) => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Skipping mark as read.')
    return
  }

  try {
    const userNotificationRef = doc(db, 'userNotifications', `${userId}_${notificationId}`)
    await setDoc(userNotificationRef, {
      userId,
      notificationId,
      isRead: true,
      readAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    // Không throw error để không ảnh hưởng UI
  }
}

// Lấy số thông báo chưa đọc của user (simplified)
export const getUnreadNotificationCount = async (userId) => {
  if (!userId || !isFirestoreAvailable()) return 0

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
    // Tạm thời disable notification khi chưa có quyền
    if (error.code === 'permission-denied' || error.code === 'missing-permissions') {
      console.warn('Firestore permissions not configured. Notifications disabled.')
    }
    return 0
  }
}

// Lấy số thông báo chưa đọc real-time với error handling
export const subscribeToUnreadCount = (userId, callback) => {
  if (!userId || !isFirestoreAvailable()) {
    callback('0')
    return () => {}
  }

  try {
    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const count = querySnapshot.size
      callback(count > 99 ? '99+' : count.toString())
    }, (error) => {
      console.error('Error in unread count subscription:', error)
      // Tạm thời disable notification khi chưa có quyền
      if (error.code === 'permission-denied' || error.code === 'missing-permissions') {
        console.warn('Firestore permissions not configured. Notifications disabled.')
        callback('0')
      } else {
        callback('0') // Trả về 0 khi có lỗi khác
      }
    })
  } catch (error) {
    console.error('Error subscribing to unread count:', error)
    callback('0') // Trả về 0 khi có lỗi
    return () => {} // Return empty function
  }
}

// Tạo thông báo deployment (tự động)
export const createDeploymentNotification = async () => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Skipping deployment notification creation.')
    return null
  }

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

// Tạo thông báo demo để test
export const createDemoNotification = async () => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available. Skipping demo notification creation.')
    return null
  }

  try {
    const notification = {
      title: '🎉 Chào mừng!',
      message: 'Chào mừng bạn đến với ứng dụng học tiếng Nhật! Hãy bắt đầu học ngay hôm nay.',
      type: 'info',
      priority: 'normal',
      createdAt: serverTimestamp(),
      isActive: true,
      targetUsers: 'all',
      expiresAt: null
    }
    
    const docRef = await addDoc(collection(db, 'notifications'), notification)
    console.log('✅ Demo notification created:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error creating demo notification:', error)
    throw error
  }
} 