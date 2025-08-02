import { useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import { createOrUpdateUser, getUserData } from '../services/userService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User đã đăng nhập
        const userInfo = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL
        }
        
        setUser(userInfo)
        
        try {
          // Lưu/cập nhật thông tin user vào Firestore
          await createOrUpdateUser(userInfo)
          
          // Lấy thông tin chi tiết từ Firestore
          const detailedUserData = await getUserData(firebaseUser.uid)
          setUserData(detailedUserData)
        } catch (error) {
          console.error('Error handling user data:', error)
        }
      } else {
        // User đã đăng xuất
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return {
    user,
    userData,
    loading,
    login,
    logout
  }
} 