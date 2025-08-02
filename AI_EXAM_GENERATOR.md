# AI Exam Generator - Tạo Đề Thi Với AI

## 🎯 Tổng Quan

Chức năng **AI Exam Generator** cho phép tạo đề thi tiếng Nhật hoàn chỉnh với sự hỗ trợ của AI Gemini. Đề thi được tạo theo format chuẩn tương tự `test-demo.json` với các phần thi đa dạng.

## 🚀 Tính Năng Chính

### **Cấu Hình Đề Thi**
- **Trình độ**: N5, N4, N3, N2, N1
- **Tiêu đề**: Tùy chỉnh hoặc tự động tạo
- **Các phần thi**: Chọn nhiều phần thi khác nhau
- **Số câu hỏi**: 5-20 câu mỗi phần

### **Các Loại Phần Thi**
1. **PHẦN TỪ VỰNG** - Câu hỏi về từ vựng, nghĩa của từ
2. **PHẦN NGỮ PHÁP** - Câu hỏi về ngữ pháp, cấu trúc câu
3. **PHẦN ĐỌC HIỂU** - Câu hỏi đọc hiểu với đoạn văn
4. **PHẦN NGHE HIỂU** - Câu hỏi nghe hiểu (có thể có audio)
5. **PHẦN NGHI VẤN TỪ** - Câu hỏi về từ nghi vấn
6. **PHẦN ĐIỀN DẤU ★** - Câu hỏi sắp xếp từ thành câu
7. **CÂU ĐỒNG NGHĨA** - Câu hỏi về câu đồng nghĩa

## 📋 Format Đề Thi

### **Cấu Trúc JSON**
```json
{
  "title": "Đề Thi Tiếng Nhật N5 (AI Generated)",
  "sections": [
    {
      "section_title": "PHẦN TỪ VỰNG",
      "questions": [
        {
          "question": "Câu hỏi bằng tiếng Nhật",
          "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
          "answer": "A"
        }
      ]
    }
  ]
}
```

### **Tương Thích**
- Tương thích với format hiện tại của `test-demo.json`
- Hỗ trợ cả format cũ và mới trong GrammarExam component
- Tự động chuyển đổi format khi cần thiết

## 🛠️ Cách Sử Dụng

### **Bước 1: Truy Cập**
1. Vào **Chế độ làm test**
2. Chọn **Bộ đề thi**
3. Chọn **Tạo đề mới bằng AI**

### **Bước 2: Cấu Hình**
1. **Tiêu đề**: Nhập tiêu đề hoặc để trống để tự động tạo
2. **Trình độ**: Chọn N5-N1 phù hợp
3. **Các phần thi**: Chọn các phần thi mong muốn
4. **Số câu hỏi**: Đặt số câu hỏi mỗi phần (5-20)

### **Bước 3: Tạo Đề Thi**
1. Nhấn **Bắt đầu tạo đề thi**
2. AI sẽ tạo từng phần thi theo thứ tự
3. Hiển thị tiến độ tạo đề thi
4. Đề thi hoàn thành sẽ sẵn sàng sử dụng

## 🔧 Kỹ Thuật

### **AI Prompt Engineering**
- Prompt được tối ưu cho từng loại phần thi
- Yêu cầu cụ thể về độ khó và format
- Xử lý lỗi và retry mechanism

### **API Integration**
- Sử dụng Google Gemini AI API
- Rate limiting để tránh quá tải
- Error handling và fallback

### **Component Architecture**
```
ExamGenerator
├── Form Configuration
├── AI API Call
├── Progress Tracking
└── Result Display
```

## 📊 Tính Năng Nâng Cao

### **Progress Tracking**
- Hiển thị tiến độ tạo từng phần
- Thời gian ước tính còn lại
- Thống kê số câu hỏi đã tạo

### **Error Handling**
- Xử lý lỗi API timeout
- Retry mechanism cho từng phần
- Fallback cho phần thi lỗi

### **Quality Control**
- Kiểm tra format JSON trả về
- Validate câu hỏi và đáp án
- Đảm bảo độ khó phù hợp

## 🎨 UI/UX Features

### **Responsive Design**
- Tương thích mobile/desktop
- Form layout linh hoạt
- Progress indicators trực quan

### **User Experience**
- Loading states rõ ràng
- Error messages chi tiết
- Success feedback đầy đủ

## 🔮 Roadmap

### **Phase 1** ✅
- [x] Basic exam generation
- [x] Multiple section types
- [x] Progress tracking
- [x] Error handling

### **Phase 2** 🚧
- [ ] Save generated exams
- [ ] Exam templates
- [ ] Batch generation
- [ ] Quality scoring

### **Phase 3** 📋
- [ ] Advanced AI models
- [ ] Custom prompts
- [ ] Exam analytics
- [ ] Collaborative features

## 📝 Lưu Ý

### **API Key**
- Cần cấu hình `VITE_GEMINI_API_KEY` trong environment
- API key được sử dụng cho tất cả AI features

### **Rate Limiting**
- Delay 1 giây giữa các API calls
- Tối đa 20 câu hỏi mỗi phần
- Timeout 30 giây cho mỗi request

### **Quality Assurance**
- Test với nhiều trình độ khác nhau
- Validate format và nội dung
- Monitor AI response quality

---

**AI Exam Generator** - Tạo đề thi thông minh với AI! 🤖✨ 