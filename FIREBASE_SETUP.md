# Hướng dẫn cấu hình Firebase Authentication & Firestore

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project** hoặc **Add project**
3. Đặt tên project và làm theo các bước

## Bước 2: Thêm ứng dụng Web

1. Trong Firebase Console, click **Add app** (biểu tượng web)
2. Đặt tên cho ứng dụng
3. Copy cấu hình Firebase (sẽ hiển thị sau khi tạo)

## Bước 3: Kích hoạt Google Authentication

1. Trong Firebase Console, vào **Authentication**
2. Click **Get started**
3. Chọn tab **Sign-in method**
4. Click **Google** và kích hoạt
5. Điền **Project support email**
6. Click **Save**

## Bước 4: Kích hoạt Firestore Database

1. Trong Firebase Console, vào **Firestore Database**
2. Click **Create database**
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần nhất (ví dụ: asia-southeast1)
5. Click **Done**

## Bước 5: Cấu hình Firestore Rules

1. Trong Firestore Database, vào tab **Rules**
2. Cập nhật rules như sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Vocabulary progress - users can read/write their own progress
      match /vocabulary_progress/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User notifications - users can read/write their own
      match /userNotifications/{userNotificationId} {
        allow read, write: if request.auth != null && 
          userNotificationId.matches(request.auth.uid + '_.*');
      }
    }
    
    // Notifications - all authenticated users can read, server can write
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null || request.auth == null; // Cho phép server-side writes
    }
    
    // User notifications collection - users can read/write their own
    match /userNotifications/{userNotificationId} {
      allow read, write: if request.auth != null && 
        userNotificationId.matches(request.auth.uid + '_.*');
    }
    
    // Public data (optional)
    match /public/{document=**} {
      allow read: if true;
    }
    
    // Allow all reads for development (remove in production)
    match /{document=**} {
      allow read: if true;
    }
  }
}
```

**Lưu ý quan trọng:**

1. **Development Mode**: Rules hiện tại cho phép tất cả reads để dễ development
2. **Production**: Trước khi deploy production, hãy thay đổi rules thành:
   ```javascript
   // Production rules - chỉ cho phép authenticated users
   match /{document=**} {
     allow read, write: if request.auth != null;
   }
   ```

3. **Vocabulary Progress**: Users có thể lưu tiến độ học tập của mình
4. **Notifications**: Hệ thống notification hoạt động cho tất cả users
5. **Server-side**: Cho phép GitHub Actions tạo notifications tự động

## Bước 6: Lấy cấu hình Firebase

1. Trong Firebase Console, vào **Project settings** (biểu tượng bánh răng)
2. Scroll xuống phần **Your apps**
3. Click vào app web đã tạo
4. Copy cấu hình:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

## Bước 7: Cấu hình Environment Variables

1. Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

2. Thêm thông tin Firebase vào file `.env`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Bước 8: Cấu hình nhanh cho Development

### Nếu bạn muốn test ngay mà không cần cấu hình Firebase:

1. **Tạm thời disable Firebase**: Ứng dụng sẽ hoạt động bình thường với demo data
2. **Không cần file .env**: Firebase sẽ sử dụng demo config
3. **Chức năng bị hạn chế**: 
   - Không lưu tiến độ học tập
   - Không có notifications
   - Không có user authentication

### Để bật đầy đủ tính năng:

1. Tạo Firebase project theo hướng dẫn trên
2. Copy cấu hình vào file `.env`
3. Deploy Firestore rules
4. Restart development server

## Bước 9: Kiểm tra cấu hình

1. Mở browser console
2. Kiểm tra các thông báo:
   - ✅ "Firebase configured successfully" = Cấu hình đúng
   - ⚠️ "Firebase chưa được cấu hình" = Cần cấu hình thêm
   - 🔧 "Connected to Firestore emulator" = Đang dùng emulator

## Tính năng Firebase Authentication & Firestore

### ✅ Đã tích hợp:
- **Google Sign-in**: Đăng nhập bằng Google
- **Auto-login**: Tự động đăng nhập khi refresh trang
- **Real-time auth state**: Cập nhật trạng thái real-time
- **User Profile**: Lưu và quản lý thông tin cá nhân
- **Learning Stats**: Theo dõi tiến độ học tập
- **Profile Editor**: Chỉnh sửa thông tin cá nhân
- **Notifications**: Hệ thống thông báo real-time
- **Secure logout**: Đăng xuất an toàn
- **Loading states**: Hiển thị trạng thái loading
- **Error handling**: Xử lý lỗi đăng nhập

### 📊 **Cấu trúc dữ liệu Firestore:**

#### Collection: `users`
```javascript
{
  uid: "user-id",
  displayName: "Tên hiển thị",
  email: "email@example.com",
  photoURL: "https://...",
  createdAt: timestamp,
  lastLoginAt: timestamp,
  updatedAt: timestamp,
  
  // Thông tin cá nhân
  personalInfo: {
    fullName: "Họ và tên",
    nickname: "Biệt danh",
    dateOfBirth: "1990-01-01",
    phoneNumber: "0123456789",
    address: "Địa chỉ",
    bio: "Giới thiệu",
    learningGoals: "Mục tiêu học tập",
    preferredLanguage: "vi",
    timezone: "Asia/Ho_Chi_Minh"
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
    theme: "light",
    language: "vi"
  }
}
```

#### Collection: `notifications`
```javascript
{
  id: "notification-id",
  title: "Tiêu đề thông báo",
  message: "Nội dung thông báo",
  type: "info", // info, success, warning, error
  priority: "normal", // low, normal, high
  createdAt: timestamp,
  isActive: true,
  targetUsers: "all", // all, specific
  expiresAt: null
}
```

#### Collection: `userNotifications`
```javascript
{
  id: "userId_notificationId",
  userId: "user-id",
  notificationId: "notification-id",
  isRead: false,
  readAt: null,
  createdAt: timestamp
}
```

### 🔧 Có thể mở rộng:
- **Email/Password**: Đăng nhập bằng email
- **Phone**: Đăng nhập bằng số điện thoại
- **Anonymous**: Đăng nhập ẩn danh
- **Social providers**: Facebook, Twitter, GitHub
- **Role-based access**: Phân quyền người dùng
- **Learning Progress**: Lưu tiến độ học tập
- **Achievements**: Hệ thống thành tích
- **Study Sessions**: Lưu lịch sử học tập
- **Push Notifications**: Thông báo push
- **Notification Preferences**: Tùy chỉnh thông báo

## Lưu ý quan trọng

- **Security**: Firebase tự động xử lý bảo mật
- **Real-time**: Dữ liệu cập nhật real-time
- **Offline Support**: Firestore hỗ trợ offline
- **Production**: Tự động hoạt động trên production
- **Analytics**: Firebase cung cấp analytics miễn phí
- **Backup**: Dữ liệu được backup tự động
- **Notifications**: Tự động tạo thông báo khi deploy

## Troubleshooting

### Lỗi "auth/unauthorized-domain"
- Thêm domain vào Firebase Console > Authentication > Settings > Authorized domains

### Lỗi "auth/popup-closed-by-user"
- Kiểm tra popup blocker
- Đảm bảo domain được authorize

### Lỗi "permission-denied" trong Firestore
- Kiểm tra Firestore Rules
- Đảm bảo user đã đăng nhập

### Lỗi "network-request-failed"
- Kiểm tra kết nối internet
- Đảm bảo Firebase project đã được tạo đúng

### Lỗi "notifications not showing"
- Kiểm tra Firestore Rules cho notifications
- Đảm bảo user đã đăng nhập
- Kiểm tra console logs 