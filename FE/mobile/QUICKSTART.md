# 🚀 Quick Start Guide

## Chạy Project Trong 3 Bước

### 1️⃣ Cài Đặt Dependencies

```bash
npm install
```

### 2️⃣ Chọn Môi Trường API

#### **Option A: Dùng Mock Data (Mặc định - Không cần backend)**

```bash
# Mở file config/env.ts và set:
USE_MOCK_DATA: true
```

#### **Option B: Kết Nối Backend Thật**

```bash
# Mở file config/env.ts và set:
USE_MOCK_DATA: false
API_BASE_URL: "http://localhost:8080"  # Hoặc IP backend của bạn
```

**Lưu ý quan trọng:**

- **Trên web:** Dùng `localhost:8080`
- **Trên Android Emulator:** Dùng `10.0.2.2:8080`
- **Trên iOS Simulator:** Dùng `localhost:8080`
- **Trên điện thoại thật:** Dùng IP máy tính (VD: `192.168.1.100:8080`)

### 3️⃣ Chạy Trên Web

```bash
npm run web
```

Mở trình duyệt tại: **http://localhost:8081**

---

## 🔧 Cấu Hình Backend URL

### Cách 1: Sửa File `config/env.ts`

```typescript
export const ENV_CONFIG = {
  USE_MOCK_DATA: false, // 👈 false = dùng API thật

  API_BASE_URL: __DEV__
    ? "http://localhost:8080" // 👈 ĐỔI IP/PORT backend ở đây
    : "https://api.evrental.vn",

  REQUEST_TIMEOUT: 30000,
};
```

### Cách 2: Tìm IP Máy Tính (Cho điện thoại thật)

**macOS/Linux:**

```bash
# Option 1
ifconfig | grep "inet " | grep -v 127.0.0.1

# Option 2
ipconfig getifaddr en0  # Wifi
ipconfig getifaddr en1  # Ethernet
```

**Windows:**

```bash
ipconfig | findstr IPv4
```

Sau đó update `API_BASE_URL` thành `http://192.168.x.x:8080`

---

## 🧪 Test Kết Nối Backend

### Bước 1: Kiểm tra backend đang chạy

```bash
# Test từ terminal
curl http://localhost:8080/api/health
# Hoặc
curl http://localhost:8080/api/auth/login
```

### Bước 2: Test từ app

1. Mở app trên web: `npm run web`
2. Vào trang Login
3. Nhập email/password
4. Xem Console logs:
   - ✅ Success: "✅ User loaded from storage"
   - ❌ Error: "Network Error" hoặc "ERR_CONNECTION_REFUSED"

### Bước 3: Debug network errors

**Nếu gặp lỗi kết nối:**

```bash
# 1. Check backend có chạy không
netstat -an | grep 8080

# 2. Check CORS enabled ở backend
# Backend phải có:
# @CrossOrigin(origins = "*") hoặc
# CORS config cho localhost:8081

# 3. Thử dùng IP thay vì localhost
API_BASE_URL: "http://127.0.0.1:8080"
```

---

## 📱 Chạy Trên Thiết Bị Khác

### Android Emulator

```bash
npm run android

# Trong config/env.ts:
API_BASE_URL: "http://10.0.2.2:8080"  # 10.0.2.2 = localhost từ Android Emulator
```

### iOS Simulator

```bash
npm run ios

# Dùng localhost như bình thường:
API_BASE_URL: "http://localhost:8080"
```

### Điện Thoại Thật (qua Expo Go)

```bash
npm start
# Scan QR code bằng Expo Go app

# Trong config/env.ts:
API_BASE_URL: "http://192.168.x.x:8080"  # IP máy tính của bạn
```

**Lưu ý:** Điện thoại và máy tính phải cùng mạng Wifi!

---

## 🐛 Nếu Gặp Lỗi

### Lỗi "Network Error" / "ERR_CONNECTION_REFUSED"

```bash
# 1. Backend chưa chạy
cd ../backend
./mvnw spring-boot:run  # Hoặc lệnh start backend của bạn

# 2. Sai URL
# Check console log khi app start: "🔗 API URL: ..."
# Phải match với backend URL

# 3. CORS blocked
# Backend cần enable CORS cho localhost:8081
```

### Lỗi "401 Unauthorized"

```bash
# Token hết hạn hoặc invalid
# → Logout và login lại
# → App sẽ tự động refresh token
```

### Lỗi "500 Internal Server Error"

```bash
# Backend error
# → Check backend console logs
# → Check database connection
```

### Clear Cache & Restart

```bash
# Clear Expo cache
npx expo start --web --clear

# Clear Metro cache
npm run reset

# Reinstall dependencies
rm -rf node_modules
npm install
npm run web
```

---

## 📋 Checklist Trước Khi Test

- [ ] Backend đang chạy (test với `curl`)
- [ ] `config/env.ts` đã set đúng:
  - [ ] `USE_MOCK_DATA: false`
  - [ ] `API_BASE_URL` đúng IP/PORT
- [ ] CORS enabled ở backend
- [ ] Cùng network (nếu dùng điện thoại thật)
- [ ] Port 8080 không bị firewall block

---

## 💡 Tips Quan Trọng

✅ **Development:**

- Web (localhost) = Nhanh nhất để develop UI
- Mock data = Không cần backend, test UI thuần

✅ **Testing API:**

- Web + localhost backend = Dễ debug nhất
- Check Network tab trong DevTools
- Check Console logs: "🔗 API URL: ..."

✅ **Production:**

- Set `API_BASE_URL` thành domain thật
- Set `USE_MOCK_DATA: false`

---

## 🔗 Các Endpoint Có Sẵn (Phases 1-7 Done)

Đã implement 78% API integration:

**✅ Hoạt động (Phases 1-7):**

- `/api/auth/login` - Đăng nhập
- `/api/auth/register` - Đăng ký
- `/api/users/me` - Lấy thông tin user
- `/api/users/{id}` - Update profile
- `/api/stations` - Lấy danh sách trạm
- `/api/stations/active` - Trạm đang hoạt động
- `/api/vehicles` - Lấy danh sách xe
- `/api/payments/{id}` - Thông tin thanh toán

**⏳ Chưa implement (Phase 6):**

- `/api/bookings` - Đặt xe (TODO)
- QR Scanner (TODO)
- MoMo Payment (TODO)

---

Xem **README.md** để biết chi tiết đầy đủ!  
Xem **test.md** để biết test cases!
