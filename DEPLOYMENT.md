# Hướng dẫn Deploy lên GitHub Pages

## Cấu hình GitHub Pages

### Bước 1: Bật GitHub Pages
1. Vào repository trên GitHub
2. Vào **Settings** > **Pages**
3. Trong **Source**, chọn **GitHub Actions**

### Bước 2: Cấu hình Repository
1. Đảm bảo repository có tên `jplt_practice`
2. Nếu tên repository khác, cập nhật `base` trong `vite.config.js`:
   ```js
   base: '/your-repo-name/'
   ```

### Bước 3: Push code
1. Commit và push code lên branch `master`
2. GitHub Actions sẽ tự động build và deploy

## Workflow hoạt động

- **Trigger**: Mỗi khi push lên branch `master` hoặc tạo Pull Request
- **Build**: Sử dụng Node.js 18, cài dependencies và build project
- **Deploy**: Tự động deploy lên GitHub Pages

## URL Deployment

Sau khi deploy thành công, website sẽ có sẵn tại:
`https://your-username.github.io/jplt_practice/`

## Troubleshooting

### Lỗi thường gặp:
1. **404 Error**: Kiểm tra `base` path trong `vite.config.js`
2. **Build failed**: Kiểm tra logs trong GitHub Actions
3. **Permissions**: Đảm bảo repository có quyền deploy Pages

### Kiểm tra deployment:
1. Vào **Actions** tab trên GitHub
2. Xem workflow "Deploy to GitHub Pages"
3. Kiểm tra logs nếu có lỗi 