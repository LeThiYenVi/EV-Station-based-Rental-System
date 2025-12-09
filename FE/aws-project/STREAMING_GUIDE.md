# 🚀 Chat Streaming Implementation Guide

## ✅ Đã implement

### Backend (AI Service)
- ✅ `/chat/stream` endpoint - Server-Sent Events (SSE)
- ✅ Streaming text theo chunks (3 words mỗi lần)
- ✅ Delay 50ms giữa các chunks để có hiệu ứng typing
- ✅ Stream session_id, text chunks, structured data, metadata riêng biệt

### Frontend
- ✅ `chatService.sendMessageStream()` - Handle SSE stream
- ✅ ChatBot component cập nhật real-time khi nhận chunks
- ✅ Progressive rendering - text hiện dần dần
- ✅ Structured data (vehicles/stations) xuất hiện sau text

## 🎯 Cách hoạt động

### 1. Streaming Flow

```
User sends message
    ↓
Frontend creates placeholder bot message (empty text)
    ↓
Call /chat/stream endpoint
    ↓
Backend processes with Agent
    ↓
Stream events back to frontend:
  1. type: "session" → session_id
  2. type: "text" → text chunks (3 words at a time, 50ms delay)
  3. type: "data" → structured data (vehicles/stations/bookings)
  4. type: "metadata" → response metadata
  5. type: "done" → streaming complete
    ↓
Frontend appends each chunk to bot message
    ↓
User sees text appearing word by word
```

### 2. SSE Event Types

| Type | Payload | Purpose |
|------|---------|---------|
| `session` | `{session_id}` | Session ID cho cuộc hội thoại |
| `text` | `{content}` | Text chunk (3 words) |
| `data` | `{data: {...}}` | Structured data (vehicles, stations, etc.) |
| `metadata` | `{metadata: {...}}` | Response metadata |
| `error` | `{error, message}` | Error info |
| `done` | - | Stream hoàn thành |

### 3. Frontend Implementation

#### Streaming Service
```typescript
await chatService.sendMessageStream(
  request,
  {
    onSessionId: (sessionId) => {
      // Update session ID
    },
    onChunk: (text) => {
      // Append text chunk to message
    },
    onData: (data) => {
      // Add structured data
    },
    onMetadata: (metadata) => {
      // Add metadata
    },
    onError: (error) => {
      // Handle error
    },
    onComplete: () => {
      // Streaming done
    }
  }
);
```

#### ChatBot Component
- Tạo placeholder message với `text: ""`
- Mỗi chunk nhận được → append vào `message.text`
- React tự động re-render → user thấy text hiện dần
- Khi nhận structured data → render cards

## 🔧 Configuration

### Chunk Size (Backend)
```python
# ai-service/app/main.py
chunk_size = 3  # Số words mỗi chunk
await asyncio.sleep(0.05)  # 50ms delay
```

Có thể điều chỉnh:
- `chunk_size = 1` → streaming chậm hơn, hiệu ứng rõ hơn
- `chunk_size = 5` → streaming nhanh hơn
- `sleep(0.1)` → delay lâu hơn
- `sleep(0.02)` → delay ngắn hơn

### Timeout (Frontend)
```typescript
// Fetch API không có built-in timeout cho streaming
// Có thể add AbortController nếu cần:
const controller = new AbortController();
setTimeout(() => controller.abort(), 60000); // 60s timeout

fetch(url, {
  signal: controller.signal,
  // ...
});
```

## 🧪 Testing

### Test Streaming

1. **Start AI Service**
```bash
cd ai-service
python -m app.main
```

2. **Start Backend**
```bash
cd BE
mvn spring-boot:run
```

3. **Start Frontend**
```bash
cd FE/aws-project
npm run dev
```

4. **Test trong Browser**
- Mở chat
- Gửi message: "Xe nào đang có?"
- Quan sát text xuất hiện từng chunk
- Cards xuất hiện sau khi text hoàn thành

### Test với cURL
```bash
curl -N -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Xe nào đang có?", "user_id": "test"}'
```

Kết quả:
```
data: {"type": "session", "session_id": "..."}

data: {"type": "text", "content": "Hiện có "}

data: {"type": "text", "content": "3 xe "}

data: {"type": "text", "content": "VinFast đang "}

...

data: {"type": "data", "data": {"type": "vehicles", "items": [...]}}

data: {"type": "metadata", "metadata": {...}}

data: {"type": "done"}
```

## 📊 Performance

### Trước (Non-streaming)
- User gửi message
- Đợi 3-5s
- Toàn bộ response xuất hiện cùng lúc
- **UX**: User không biết đang xảy ra gì

### Sau (Streaming)
- User gửi message
- Text bắt đầu xuất hiện ngay (< 1s)
- Text hiện dần như đang typing
- Cards xuất hiện sau text
- **UX**: User thấy progress, engaging hơn

### Bandwidth
- Streaming không giảm bandwidth
- Tổng data vẫn như cũ
- Nhưng **perceived performance** tốt hơn nhiều

## 🎨 UI/UX Improvements

### Đã có:
✅ Text streaming từng chunk
✅ Auto-scroll khi nhận chunks mới
✅ Typing indicator (3 dots) khi bắt đầu
✅ Smooth transitions

### Có thể thêm:
- [ ] Cursor blinking effect ở cuối text đang stream
- [ ] Sound effect khi nhận chunks
- [ ] Progress bar cho streaming
- [ ] Cancel button để stop streaming
- [ ] Retry button nếu stream bị disconnect

## 🐛 Error Handling

### Network Errors
- Connection lost → `onError` callback
- Frontend hiển thị error message
- User có thể retry

### Stream Errors
- Parsing error → log to console, continue
- Invalid JSON → skip chunk
- Backend error → send error event

### Timeout
- Fetch API stream có thể timeout
- Add AbortController để handle

## 📝 Notes

### Tại sao dùng SSE thay vì WebSocket?
- ✅ SSE đơn giản hơn (HTTP only)
- ✅ Tự động reconnect
- ✅ Phù hợp với unidirectional streaming (server → client)
- ✅ Không cần maintain persistent connection
- ✅ Works với standard HTTP/HTTPS

WebSocket tốt hơn khi cần:
- Bidirectional communication
- Real-time collaboration
- Lower latency

Cho chatbot, SSE là lựa chọn tốt hơn.

### Why 3 words per chunk?
- 1 word: Quá chậm, annoying
- 5+ words: Mất hiệu ứng typing
- 3 words: Balance giữa speed và UX

### Có stream được Markdown không?
Có! ReactMarkdown tự động render khi `message.text` update.

Nhưng cần lưu ý:
- Headers (##, ###) có thể bị break nếu stream giữa chừng
- Lists có thể render không đúng khi đang stream
- Có thể cải thiện bằng cách stream theo sentences thay vì words

## ✨ Ready to test!

Streaming đã sẵn sàng! Start cả 3 services và test:
1. AI service: http://localhost:8000
2. Backend: http://localhost:8080
3. Frontend: http://localhost:5173

Gửi message và xem text hiện dần như ChatGPT! 🎉
