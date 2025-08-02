# JP Vui Nhộn - Ứng Dụng Học Tiếng Nhật Toàn Diện

Ứng dụng học tiếng Nhật hiện đại với đầy đủ tính năng từ cơ bản đến nâng cao, hỗ trợ người học từ trình độ N5 đến N1.

## 🎯 Chức Năng Chính

### 📚 **Học Tập Đa Dạng**
- **Hiragana & Katakana**: Học và luyện tập bảng chữ cái cơ bản
- **Kanji**: Học Hán tự với giải thích chi tiết và cách nhớ
- **Grammar**: Ngữ pháp tiếng Nhật từ cơ bản đến nâng cao
- **Vocabulary**: Từ vựng theo chủ đề và cấp độ
- **Listening**: Bài nghe hiểu với audio và transcript

### 🎮 **Chế Độ Học Tập**
- **Test Mode**: Kiểm tra kiến thức với bài thi đa dạng
- **Practice Mode**: Luyện tập không giới hạn với feedback chi tiết
- **Level Selection**: Chọn cấp độ phù hợp (N5, N4, N3, N2, N1)
- **Exam Manager**: Quản lý bài thi và kết quả

### 🤖 **AI Hỗ Trợ Thông Minh**
- **AI Helper**: Giải thích chi tiết với AI Gemini
- **Smart Feedback**: Phân tích lỗi và đưa ra gợi ý cải thiện
- **Personalized Learning**: Học tập theo năng lực cá nhân
- **Question Generator**: Tạo câu hỏi động dựa trên AI
- **Exam Generator**: Tạo đề thi hoàn chỉnh với AI theo format chuẩn

### 🔐 **Authentication & User Management**
- **Google Sign-in**: Đăng nhập nhanh chóng bằng Google
- **User Profiles**: Quản lý thông tin cá nhân chi tiết
- **Learning Stats**: Theo dõi tiến độ học tập
- **Personal Settings**: Tùy chỉnh cài đặt cá nhân
- **Real-time Sync**: Đồng bộ dữ liệu real-time với Firebase

### 🎵 **Tính Năng Audio**
- **Audio Player**: Phát audio cho bài nghe hiểu
- **Pronunciation Guide**: Hướng dẫn phát âm chính xác
- **Listening Practice**: Luyện kỹ năng nghe với nhiều accent

## 🚀 Features Nổi Bật

### 📱 **Responsive Design**
- Tương thích hoàn hảo trên mobile, tablet và desktop
- UI/UX hiện đại với Material-UI
- Dark/Light theme tùy chỉnh
- Smooth animations và transitions

### 📊 **Theo Dõi Tiến Độ**
- Dashboard thống kê học tập
- Biểu đồ tiến độ theo thời gian
- Điểm số và ranking
- Lịch sử bài thi chi tiết

### 🎯 **Học Tập Cá Nhân Hóa**
- Adaptive learning algorithm
- Spaced repetition system
- Weak point identification
- Custom study plans

### 🔧 **Tính Năng Kỹ Thuật**
- Offline mode support
- Data persistence với Firebase Firestore
- Real-time synchronization
- Cross-platform compatibility

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19** - UI Framework hiện đại với hooks và functional components
- **Vite** - Build tool nhanh với hot reload
- **Material-UI (MUI)** - Component library đẹp và responsive

### **Backend & Database**
- **Firebase Authentication** - User authentication và authorization
- **Firebase Firestore** - NoSQL database real-time
- **Firebase Hosting** - Static hosting (optional)

### **State Management & Data**
- **React Hooks** - State management với useState, useEffect
- **Context API** - Global state management
- **Firebase SDK** - Real-time data synchronization

### **AI & APIs**
- **Google Gemini AI** - AI assistant cho giải thích và hỗ trợ
- **Axios** - HTTP client cho API calls
- **React Markdown** - Render markdown content

### **Development Tools**
- **ESLint** - Code linting và formatting
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting

### **Audio & Media**
- **HTML5 Audio API** - Audio playback
- **Web Audio API** - Advanced audio processing
- **Media Session API** - Media controls

## 📦 Cài Đặt & Chạy

### **Prerequisites**
- Node.js 18+ 
- npm hoặc yarn
- Firebase project (xem [FIREBASE_SETUP.md](FIREBASE_SETUP.md))

### **Local Development**

```bash
# Clone repository
git clone https://github.com/tuanvipandpro/jplt_practice.git
cd jplt_practice

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env

# Cấu hình environment variables trong .env
# VITE_GEMINI_API_KEY=your-gemini-api-key
# VITE_FIREBASE_API_KEY=your-firebase-api-key
# VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=your-project-id
# VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
# VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
# VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

### **Production Deployment**

#### **GitHub Pages (Recommended)**
1. Cấu hình GitHub Secrets trong repository Settings > Secrets and variables > Actions
2. Thêm các secrets: `GEMINI_API_KEY`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`
3. Push code lên branch `master`
4. GitHub Actions sẽ tự động build và deploy

#### **Firebase Hosting**
```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Login Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

## 📁 Cấu Trúc Project

```
src/
├── components/          # React components
│   ├── Header.jsx      # Header với authentication
│   ├── UserProfile.jsx # User profile editor
│   ├── AIHelper.jsx    # AI assistant
│   ├── AudioPlayer.jsx # Audio controls
│   ├── TestMode.jsx    # Test interface
│   ├── PracticeMode.jsx # Practice interface
│   └── ...
├── hooks/              # Custom hooks
│   └── useAuth.js      # Authentication hook
├── services/           # API services
│   └── userService.js  # Firebase user management
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── data/               # JSON data files
│   ├── grammar.json    # Grammar questions
│   ├── kanji.json     # Kanji data
│   ├── vocabulary.json # Vocabulary data
│   └── ...
└── assets/            # Static assets
```

## 🔐 Authentication & User Data

### **User Profile Structure**
```javascript
{
  uid: "user-id",
  displayName: "Tên hiển thị",
  email: "email@example.com",
  photoURL: "https://...",
  
  // Thông tin cá nhân
  personalInfo: {
    fullName: "Họ và tên",
    nickname: "Biệt danh",
    dateOfBirth: "1990-01-01",
    phoneNumber: "0123456789",
    address: "Địa chỉ",
    bio: "Giới thiệu",
    learningGoals: "Mục tiêu học tập",
    preferredLanguage: "vi"
  },
  
  // Thống kê học tập
  learningStats: {
    totalStudyTime: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
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

## 🎨 UI/UX Features

### **Design System**
- Material Design principles
- Consistent color palette
- Typography hierarchy
- Spacing system

### **Interactive Elements**
- Smooth hover effects
- Loading states
- Error handling
- Success feedback

### **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🔮 Roadmap

### **Phase 1 - Core Features** ✅
- [x] Basic test modes
- [x] AI integration
- [x] Audio support
- [x] Responsive design
- [x] AI Exam Generator
- [x] Firebase Authentication
- [x] User Profile Management

### **Phase 2 - Advanced Features** 🚧
- [ ] Spaced repetition
- [ ] Progress tracking với Firestore
- [ ] Social features
- [ ] Offline mode
- [ ] Learning analytics

### **Phase 3 - Premium Features** 📋
- [ ] Advanced AI tutor
- [ ] Video lessons
- [ ] Live classes
- [ ] Certification prep
- [ ] Multi-language support

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tuanvipandpro/jplt_practice/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tuanvipandpro/jplt_practice/discussions)
- **Email**: tuanvipandpro@gmail.com

## 📚 Documentation

- [Firebase Setup](FIREBASE_SETUP.md) - Hướng dẫn cấu hình Firebase
- [Audio Setup](AUDIO_SETUP.md) - Cấu hình audio features
- [AI Setup](AI_SETUP.md) - Cấu hình AI features

---

**JP Vui Nhộn** - Học tiếng Nhật vui vẻ và hiệu quả! 🇯🇵✨
