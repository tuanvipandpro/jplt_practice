import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Tạo hoặc cập nhật thông tin user
export const createOrUpdateUser = async (userData) => {
  try {
    const userRef = doc(db, 'users', userData.uid)
    
    // Kiểm tra xem user đã tồn tại chưa
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      // Cập nhật thông tin user
      await updateDoc(userRef, {
        displayName: userData.name,
        email: userData.email,
        photoURL: userData.picture,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } else {
      // Tạo user mới
      await setDoc(userRef, {
        uid: userData.uid,
        displayName: userData.name,
        email: userData.email,
        photoURL: userData.picture,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Thông tin cá nhân mặc định
        personalInfo: {
          fullName: userData.name,
          nickname: '',
          dateOfBirth: '',
          phoneNumber: '',
          address: '',
          bio: '',
          learningGoals: '',
          preferredLanguage: 'vi',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        // Thống kê học tập
        learningStats: {
          totalStudyTime: 0,
          totalSessions: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          favoriteTopics: [],
          completedLessons: 0
        },
        // Cài đặt ứng dụng
        settings: {
          notifications: true,
          soundEnabled: true,
          autoPlay: false,
          theme: 'light',
          language: 'vi'
        }
      })
    }
    
    return true
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}

// Lấy thông tin user từ Firestore
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return userDoc.data()
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// Cập nhật thông tin cá nhân
export const updatePersonalInfo = async (uid, personalInfo) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      personalInfo: {
        ...personalInfo,
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating personal info:', error)
    throw error
  }
}

// Cập nhật thống kê học tập
export const updateLearningStats = async (uid, stats) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      learningStats: {
        ...stats,
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating learning stats:', error)
    throw error
  }
}

// Cập nhật cài đặt
export const updateSettings = async (uid, settings) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      settings: {
        ...settings,
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
} 