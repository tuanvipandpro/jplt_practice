# Hướng dẫn thêm file âm thanh cho đề thi nghe hiểu

## Cách 1: Tự tạo file âm thanh

### Bước 1: Tạo thư mục audio
```bash
mkdir -p public/audio
```

### Bước 2: Thêm file âm thanh
Đặt các file âm thanh vào thư mục `public/audio/` với tên tương ứng:
- `listening_1.mp3`
- `listening_2.mp3`
- `listening_3.mp3`
- ...
- `listening_10.mp3`

### Bước 3: Định dạng file
- **Định dạng**: MP3, WAV, OGG
- **Chất lượng**: 128kbps trở lên
- **Thời lượng**: 10-30 giây cho mỗi đoạn hội thoại

## Cách 2: Sử dụng Text-to-Speech (TTS)

### Sử dụng Google Translate TTS:
1. Truy cập: https://translate.google.com/
2. Nhập text tiếng Nhật
3. Chọn ngôn ngữ: Japanese
4. Nhấn nút "Listen" để nghe
5. Sử dụng extension để tải audio

### Sử dụng Online TTS:
- **Google Text-to-Speech API**
- **Amazon Polly**
- **Microsoft Azure Speech Service**

## Cách 3: Sử dụng AI để tạo audio

### Sử dụng ChatGPT Voice:
1. Mở ChatGPT
2. Chọn Voice Chat
3. Đọc script tiếng Nhật
4. Ghi âm cuộc hội thoại

### Sử dụng ElevenLabs:
1. Truy cập: https://elevenlabs.io/
2. Tạo tài khoản
3. Chọn voice tiếng Nhật
4. Nhập text và tạo audio

## Cách 4: Tìm audio có sẵn

### Nguồn audio miễn phí:
- **NHK Easy Japanese**: https://www3.nhk.or.jp/news/easy/
- **JapanesePod101**: https://www.japanesepod101.com/
- **Tofugu**: https://www.tofugu.com/

### Tạo script cho audio:
Dựa trên file `listening-demo.json`, mỗi câu hỏi có script như:

```
女：すみません、りんごをください。
店員：はい、りんごですね。
女：はい、お願いします。
```

## Cách 5: Sử dụng demo audio

### Tạo file demo:
```bash
# Tạo file audio demo (1 giây silence)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame public/audio/listening_1.mp3
```

### Hoặc sử dụng online tone generator:
- https://www.szynalski.com/tone-generator/
- Tạo tone 440Hz, 1 giây
- Export thành MP3

## Cấu trúc thư mục:
```
public/
└── audio/
    ├── listening_1.mp3
    ├── listening_2.mp3
    ├── listening_3.mp3
    ├── ...
    └── listening_10.mp3
```

## Lưu ý:
- File audio phải có định dạng web-compatible (MP3, WAV, OGG)
- Kích thước file nên < 1MB mỗi file
- Tên file phải khớp với `audio` field trong JSON
- Test audio trên nhiều trình duyệt khác nhau

## Troubleshooting:
- Nếu audio không phát: Kiểm tra console để xem lỗi
- Nếu file không tải: Kiểm tra đường dẫn và tên file
- Nếu format không hỗ trợ: Chuyển đổi sang MP3 