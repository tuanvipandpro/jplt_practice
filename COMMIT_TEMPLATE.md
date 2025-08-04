# 📝 Commit Message Template

## 🎯 **Format Chuẩn**
```
<type>: <description>
```

## 📋 **Types**

| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `feat` | Tính năng mới | `feat: add voice recognition for pronunciation practice` |
| `fix` | Sửa lỗi | `fix: resolve mobile overlap in exam components` |
| `perf` | Cải thiện hiệu suất | `perf: upgrade to gemini-2.5-flash-lite for faster AI responses` |
| `style` | Cải thiện UI/UX | `style: enhance notification layout with version display` |
| `refactor` | Tái cấu trúc code | `refactor: simplify notification parsing logic` |
| `docs` | Cập nhật tài liệu | `docs: add setup guide for Firebase notifications` |
| `build` | Build system/dependencies | `build: add auto-tagging workflow for deployments` |
| `ci` | CI/CD changes | `ci: improve deployment notification with release notes` |

## ✅ **Ví dụ Tốt** (sẽ hiển thị đẹp trong notification)

```bash
# Tính năng mới
feat: add AI-powered grammar explanations with detailed analysis

# Sửa lỗi
fix: resolve duplicate question numbering in exam components  

# Cải thiện hiệu suất
perf: optimize AI response time with lighter model integration

# Cải thiện giao diện
style: improve mobile responsive design for all exam types

# Refactor
refactor: streamline notification display logic for better UX
```

## ❌ **Tránh** (sẽ hiển thị kém trong notification)

```bash
# Quá ngắn, không rõ ràng
fix: bug
update: stuff
refactor: code

# Quá dài, khó đọc
feat: add a new comprehensive AI-powered grammar explanation system that provides detailed analysis of Japanese grammar structures with multiple examples and learning tips for students of all levels

# Không có type
Fixed the mobile responsive issues
Added new feature for AI
```

## 🚀 **Template Nhanh**

### **Khi fix lỗi:**
```
fix: resolve [vấn đề gì] in [component/feature nào]
```

### **Khi thêm tính năng:**
```
feat: add [tính năng gì] for [mục đích gì]
```

### **Khi cải thiện hiệu suất:**
```
perf: optimize [cái gì] by [làm thế nào]
```

### **Khi cải thiện giao diện:**
```
style: enhance [component nào] with [cải thiện gì]
```

## 📱 **Notification Preview**

Khi bạn commit:
```bash
git commit -m "feat: add voice recognition for pronunciation practice"
```

Notification sẽ hiển thị:
```
🚀 Cập nhật v2024.01.15.1430                    [v2024.01.15.1430]
────────────────────────────────────────────────────────────────────
Ứng dụng đã được cập nhật với các tính năng mới!

📝 CÓ GÌ MỚI
┌──────────────────────────────────────────────────────────────────┐
│ "feat: add voice recognition for pronunciation practice"         │
└──────────────────────────────────────────────────────────────────┘

🕐 Vừa xong                              [Quan trọng] [Cập nhật]
```

## 🎯 **Nguyên tắc vàng:**

1. **50 ký tự tối đa** cho title
2. **Bắt đầu bằng động từ** (add, fix, improve, etc.)
3. **Không kết thúc bằng dấu chấm**
4. **Viết ở thì hiện tại** (add thay vì added)
5. **Mô tả TÁC ĐỘNG, không mô tả code**

## 💡 **Pro Tips:**

- **Nghĩ như user**: "Tính năng này giúp gì cho người dùng?"
- **Tập trung vào kết quả**: "resolve mobile overlap" thay vì "fix CSS margin"
- **Sử dụng từ khóa**: "AI", "mobile", "performance", "fix", "add"
- **Consistent**: Luôn follow cùng một format