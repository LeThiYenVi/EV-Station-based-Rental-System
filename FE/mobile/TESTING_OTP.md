# Testing OTP Flow with Real Backend

## ✅ Đã Hoàn Thành

### 1. Tích hợp API Backend thật

- ✅ Kết nối với Spring Boot API (`localhost:8080/api`)
- ✅ Sử dụng endpoints từ API documentation
- ✅ Xử lý `ApiResponse<T>` wrapper

### 2. Flow Đăng Ký + OTP

```
User → Register Screen → Nhập Info → Submit
  ↓
Backend: POST /api/auth/register
  ↓
AWS Cognito: Gửi OTP qua Email
  ↓
App: Navigate to OTP Screen
  ↓
User: Nhập 6 số OTP từ Email
  ↓
Backend: POST /api/auth/confirm
  ↓
Auto Login: POST /api/auth/login
  ↓
App: Save Token & User → Navigate to Tabs
```

## 🧪 Hướng Dẫn Test

### Bước 1: Chạy Backend

```bash
# Đảm bảo Spring Boot backend đang chạy ở port 8080
cd ../../BE
./mvnw spring-boot:run
# hoặc
java -jar target/ev-rental-system.jar
```

### Bước 2: Kiểm tra Config

File: `config/env.ts`

```typescript
USE_MOCK_DATA: false; // ✅ Đã set về false
API_BASE_URL: "http://localhost:8080/api"; // ✅ Đúng port
```

### Bước 3: Chạy App

```bash
npm start
# hoặc
npx expo start
```

### Bước 4: Test Register Flow

#### 4.1. Mở màn hình Register

- Mở app → Bấm "Đăng Ký"

#### 4.2. Điền thông tin

- **Họ Tên**: Nguyen Van A
- **Email**: nguyenvana@gmail.com _(Email thật để nhận OTP)_
- **Số Điện Thoại**: 0912345678 _(Bắt buộc cho backend)_
- **Mật Khẩu**: Test@123 _(Tối thiểu 8 ký tự)_
- **Xác Nhận Mật Khẩu**: Test@123

#### 4.3. Bấm "Đăng Ký"

- App sẽ gọi: `POST /api/auth/register`
- Backend → AWS Cognito → Gửi OTP về email
- App chuyển sang màn OTP Verify

#### 4.4. Kiểm tra Email

- Mở email đã đăng ký
- Tìm email từ AWS Cognito với subject: "Your verification code"
- Copy mã 6 số

#### 4.5. Nhập OTP

- Paste hoặc gõ 6 số OTP
- Bấm "Xác Nhận"
- App gọi: `POST /api/auth/confirm`
- Auto login: `POST /api/auth/login`
- Lưu token + user info
- Chuyển vào app

## 🔍 Debug

### Console Logs để theo dõi

```
📧 Registration initiated. OTP sent to: email@example.com
📬 Check your email for the confirmation code
✅ Account confirmed successfully
✅ Login Success after OTP verification: User Name
```

### Network Request (Chrome DevTools)

1. Mở Metro bundler terminal
2. Bấm `j` để mở debugger
3. Vào Network tab
4. Xem các request:
   - `POST /api/auth/register`
   - `POST /api/auth/confirm`
   - `POST /api/auth/login`

### Common Issues

#### ❌ "Network request failed"

**Nguyên nhân**: Backend chưa chạy hoặc sai port
**Giải pháp**:

```bash
# Kiểm tra backend đang chạy
curl http://localhost:8080/api/auth/url
# Phải trả về status 200
```

#### ❌ "Email already exists"

**Nguyên nhân**: Email đã được đăng ký
**Giải pháp**: Dùng email khác hoặc xóa user trong database

#### ❌ "Invalid verification code"

**Nguyên nhân**:

- Mã OTP sai
- Mã đã hết hạn (5 phút)
- Đã dùng mã cũ

**Giải pháp**:

- Kiểm tra lại email mới nhất
- Nếu hết hạn → Đăng ký lại

#### ❌ "Password does not conform to policy"

**Nguyên nhân**: Mật khẩu không đủ mạnh
**Giải pháp**:

- Tối thiểu 8 ký tự
- Có chữ hoa, chữ thường, số, ký tự đặc biệt
- Ví dụ: `Test@123`, `MyP@ssw0rd`

## 📝 API Endpoints Đã Tích Hợp

### 1. Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "Nguyen Van A",
  "phone": "0912345678",
  "password": "Test@123",
  "confirmPassword": "Test@123",
  "role": "RENTER"
}

Response: ApiResponse<AuthResponse>
```

### 2. Confirm Account

```http
POST /api/auth/confirm
Content-Type: application/json

{
  "email": "user@example.com",
  "confirmationCode": "123456"
}

Response: ApiResponse<void>
```

### 3. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test@123"
}

Response: ApiResponse<AuthResponse>
```

## 🎯 Validation Rules

### Email

- ✅ Format: `user@domain.com`
- ✅ Phải là email thật (để nhận OTP)
- ✅ Unique (chưa được đăng ký)

### Password

- ✅ Minimum 8 ký tự
- ✅ Có chữ hoa (A-Z)
- ✅ Có chữ thường (a-z)
- ✅ Có số (0-9)
- ✅ Có ký tự đặc biệt (@, #, $, %, etc.)

### Phone

- ✅ Required (bắt buộc)
- ✅ Format: 10-11 số
- ✅ Ví dụ: `0912345678`, `0123456789`

### OTP

- ✅ 6 chữ số
- ✅ Hết hạn sau 5 phút
- ✅ Chỉ dùng được 1 lần

## 🚀 Next Steps

Sau khi test thành công OTP flow:

1. ✅ Test login flow
2. ✅ Test forgot password
3. ✅ Tích hợp các API khác (stations, vehicles, bookings)
4. ✅ Add error handling UI (Toast, Alert)
5. ✅ Add loading states

## 📞 Support

Nếu gặp lỗi, check:

1. Backend logs (Spring Boot console)
2. App logs (Metro bundler terminal)
3. Network requests (Chrome DevTools)
4. AWS Cognito console (nếu có access)
