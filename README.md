# JP Vui Nhộn

Ứng dụng học tiếng Nhật với các bài test và practice cho Hiragana, Katakana và Grammar.

## 🚀 Development

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## 📦 Deployment

Project được cấu hình để tự động deploy lên GitHub Pages thông qua GitHub Actions.

### Cấu hình GitHub Pages:
1. Vào repository Settings > Pages
2. Chọn "GitHub Actions" làm source
3. Push code lên branch `master` để trigger deployment

### URL Deployment:
`https://your-username.github.io/jplt_practice/`
E.g: `https://tuanvipandpro.github.io/jplt_practice/`

Xem file [DEPLOYMENT.md](./DEPLOYMENT.md) để biết thêm chi tiết về cấu hình deployment.

## 🚀 Tính năng

- **Grammar Test**: Test ngữ pháp với AI hỗ trợ
- **Hiragana Test**: Test bảng chữ cái Hiragana
- **Katakana Test**: Test bảng chữ cái Katakana
- **Practice Mode**: Chế độ luyện tập
- **AI Helper**: Hỏi đáp cùng AI Gemini
- **Responsive Design**: Tương thích mobile/desktop

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool
- **Material-UI** - UI Components
- **Axios** - HTTP Client
- **ESLint** - Code linting
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting
