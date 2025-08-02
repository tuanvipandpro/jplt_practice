import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig)

// Khởi tạo Auth
export const auth = getAuth(app)

// Khởi tạo Firestore
export const db = getFirestore(app)

// Khởi tạo Google Provider
export const googleProvider = new GoogleAuthProvider()

// Kiểm tra cấu hình
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn(
    "⚠️  Firebase chưa được cấu hình. " +
    "Vui lòng tạo file .env và thêm các thông tin Firebase"
  )
}

export default app 