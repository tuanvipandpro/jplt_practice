# Cấu hình AI Helper

## Bước 1: Lấy Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google account
3. Tạo API key mới
4. Copy API key

## Bước 2: Cấu hình Local Development

1. Tạo file `.env` trong thư mục gốc
2. Thêm dòng sau:
```
VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```
3. Thay `YOUR_API_KEY_HERE` bằng API key thật

## Bước 3: Cấu hình GitHub Actions (Deploy)

1. Vào repository settings trên GitHub
2. Chọn "Secrets and variables" > "Actions"
3. Tạo secret mới với tên `GEMINI_API_KEY`
4. Paste API key vào value
5. Save secret

## Bước 4: Khởi động ứng dụng

```bash
# Local development
npm run dev

# Build cho production
npm run build
```

## Tính năng AI Helper

- **Grammar Test**: AI giải thích cấu trúc ngữ pháp
- **Hiragana/Katakana Test**: AI giải thích cách đọc và ý nghĩa
- **Prompt tùy chỉnh** theo từng loại câu hỏi
- **Markdown Rendering**: Hiển thị response với format đẹp
- **Giao diện thân thiện** với loading và error handling
- **Axios integration** với timeout và error handling tốt hơn

## Cấu hình Environment Variables

### Local Development
- `VITE_GEMINI_API_KEY`: API key cho development

### GitHub Actions
- `GEMINI_API_KEY`: API key cho production build
- Tự động được map thành `VITE_GEMINI_API_KEY` trong build process

## Lưu ý

- API key được bảo mật trong GitHub Secrets
- Axios với timeout 30s để tránh hang
- Error handling chi tiết cho network issues
- CORS được xử lý tự động bởi Gemini API
- Markdown rendering với react-markdown và remark-gfm
- Custom styling cho tất cả markdown elements 