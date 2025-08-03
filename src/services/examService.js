import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Lưu kết quả thi lên Firestore
export const saveExamResult = async (examData) => {
  try {
    if (!db) {
      throw new Error('Firestore không được cấu hình')
    }

    const examResultsRef = collection(db, 'examResults')
    
    const resultData = {
      userId: examData.userId,
      userEmail: examData.userEmail,
      userName: examData.userName,
      examId: examData.examId,
      examTitle: examData.examTitle,
      examType: examData.examType,
      score: examData.score,
      totalQuestions: examData.totalQuestions,
      percentage: examData.percentage,
      grade: examData.grade,
      timeSpent: examData.timeSpent, // in seconds
      answers: examData.answers, // user answers object
      flaggedQuestions: examData.flaggedQuestions, // array of flagged question indices
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(examResultsRef, resultData)
    console.log('✅ Kết quả thi đã được lưu với ID:', docRef.id)
    
    return {
      success: true,
      id: docRef.id
    }
  } catch (error) {
    console.error('❌ Lỗi khi lưu kết quả thi:', error)
    throw error
  }
}

// Lấy lịch sử thi của user
export const getUserExamHistory = async (userId, limitCount = 10) => {
  try {
    if (!db) {
      throw new Error('Firestore không được cấu hình')
    }

    const examResultsRef = collection(db, 'examResults')
    const q = query(
      examResultsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const history = []
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return history
  } catch (error) {
    console.error('❌ Lỗi khi lấy lịch sử thi:', error)
    throw error
  }
}

// Lấy thống kê thi của user
export const getUserExamStats = async (userId) => {
  try {
    if (!db) {
      throw new Error('Firestore không được cấu hình')
    }

    const examResultsRef = collection(db, 'examResults')
    const q = query(
      examResultsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push(doc.data())
    })

    // Tính toán thống kê
    const totalExams = results.length
    const averageScore = results.length > 0 
      ? results.reduce((sum, result) => sum + result.percentage, 0) / results.length 
      : 0
    
    const highestScore = results.length > 0 
      ? Math.max(...results.map(result => result.percentage)) 
      : 0

    const examTypes = {}
    results.forEach(result => {
      if (!examTypes[result.examType]) {
        examTypes[result.examType] = { count: 0, averageScore: 0 }
      }
      examTypes[result.examType].count++
    })

    // Tính average score cho từng loại thi
    Object.keys(examTypes).forEach(type => {
      const typeResults = results.filter(result => result.examType === type)
      examTypes[type].averageScore = typeResults.reduce((sum, result) => sum + result.percentage, 0) / typeResults.length
    })

    return {
      totalExams,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore: Math.round(highestScore * 10) / 10,
      examTypes,
      recentResults: results.slice(0, 5)
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy thống kê thi:', error)
    throw error
  }
}