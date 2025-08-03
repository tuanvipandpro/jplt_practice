import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Cấu hình Firebase với fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo'
}

// Kiểm tra cấu hình Firebase
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                            import.meta.env.VITE_FIREBASE_PROJECT_ID

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig)

// Khởi tạo Auth
export const auth = getAuth(app)

// Khởi tạo Firestore (chỉ khi có cấu hình đúng)
let db = null
if (isFirebaseConfigured) {
  db = getFirestore(app)
  
  // Kết nối emulator trong development (nếu cần)
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('🔧 Connected to Firestore emulator')
    } catch (error) {
      console.log('⚠️ Firestore emulator already connected or not available')
    }
  }
} else {
  console.warn(
    "⚠️  Firebase chưa được cấu hình đúng cách. " +
    "Vui lòng tạo file .env và thêm các thông tin Firebase. " +
    "Firestore sẽ bị disable."
  )
}

// Khởi tạo Google Provider
export const googleProvider = new GoogleAuthProvider()

export { db }
export default app 