import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục audio nếu chưa có
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Tạo file HTML để tạo audio demo
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Audio Generator</title>
</head>
<body>
    <h1>Audio Generator for Listening Test</h1>
    <p>Mở Console (F12) và chạy các lệnh sau:</p>
    
    <script>
        // Hàm tạo audio demo
        function createDemoAudio(filename, duration = 2000) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
            
            // Tạo blob và download
            setTimeout(() => {
                const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration / 1000, audioContext.sampleRate);
                const channelData = audioBuffer.getChannelData(0);
                
                for (let i = 0; i < audioBuffer.length; i++) {
                    channelData[i] = Math.sin(2 * Math.PI * 440 * i / audioContext.sampleRate) * 0.1;
                }
                
                const blob = new Blob([audioBuffer], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }, duration + 100);
        }
        
        // Tạo 10 file audio demo
        function createAllDemoAudios() {
            for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                    createDemoAudio(\`listening_\${i}.wav\`);
                }, i * 3000);
            }
        }
        
        console.log('Để tạo audio demo, chạy: createAllDemoAudios()');
        console.log('Hoặc tạo từng file: createDemoAudio("listening_1.wav")');
    </script>
</body>
</html>
`;

// Ghi file HTML
const htmlPath = path.join(__dirname, 'audio-generator.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Đã tạo file audio-generator.html');
console.log('📝 Hướng dẫn:');
console.log('1. Mở file audio-generator.html trong trình duyệt');
console.log('2. Mở Console (F12)');
console.log('3. Chạy: createAllDemoAudios()');
console.log('4. Các file audio sẽ được tải về');
console.log('5. Di chuyển các file vào thư mục public/audio/'); 