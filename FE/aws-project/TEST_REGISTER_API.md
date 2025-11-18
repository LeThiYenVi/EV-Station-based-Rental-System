# Test Register API

## Các bước kiểm tra lỗi "Request method 'GET' is not supported"

### 1. Kiểm tra Backend đang chạy

```bash
# Kiểm tra xem backend có đang chạy trên port 8080 không
curl http://localhost:8080/api/auth/register
```

### 2. Test API trực tiếp với curl (POST)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "fullName": "Test User",
    "phone": "0912345678",
    "role": "RENTER"
  }'
```

### 3. Kiểm tra trong Browser DevTools

1. Mở Browser DevTools (F12)
2. Vào tab **Network**
3. Thử đăng ký tài khoản
4. Tìm request đến `/api/auth/register`
5. Kiểm tra:
   - **Method**: Phải là `POST` (nếu là `GET` thì có lỗi)
   - **Request Headers**:
     ```
     Content-Type: application/json
     ```
   - **Request Payload**:
     ```json
     {
       "email": "...",
       "password": "...",
       "confirmPassword": "...",
       "fullName": "...",
       "phone": "...",
       "role": "RENTER"
     }
     ```
   - **Response**: Kiểm tra status code và message

### 4. Các lỗi thường gặp

#### Lỗi: "Request method 'GET' is not supported"

**Nguyên nhân:**

- Backend đang nhận GET request thay vì POST
- Có thể do CORS preflight request không được xử lý

**Giải pháp:**

1. Kiểm tra backend có CORS configuration:

   ```java
   @Configuration
   public class WebConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/api/**")
                           .allowedOrigins("http://localhost:5173")
                           .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                           .allowedHeaders("*")
                           .allowCredentials(true);
               }
           };
       }
   }
   ```

2. Kiểm tra Controller có `@PostMapping`:
   ```java
   @PostMapping("/auth/register")
   public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
       // ...
   }
   ```

#### Lỗi: CORS Policy

**Nguyên nhân:**

- Backend không cho phép request từ `http://localhost:5173`

**Giải pháp:**

- Thêm CORS configuration ở backend (xem trên)

#### Lỗi: Network Error / Connection Refused

**Nguyên nhân:**

- Backend không chạy
- Backend chạy trên port khác (không phải 8080)

**Giải pháp:**

1. Start backend service
2. Kiểm tra port backend đang chạy
3. Cập nhật Vite proxy config nếu cần:
   ```typescript
   // vite.config.ts
   proxy: {
     '/api': {
       target: 'http://localhost:BACKEND_PORT',
       changeOrigin: true,
       secure: false,
     },
   }
   ```

### 5. Debug Console Logs

Khi submit form đăng ký, bạn sẽ thấy các console logs:

```
Submitting registration with data: {email: "...", fullName: "...", phone: "...", role: "RENTER"}
AuthService.register called with data: {email: "...", fullName: "...", phone: "...", role: "RENTER"}
Making POST request to: /auth/register
```

Nếu thành công:

```
Register response: {statusCode: 200, message: "...", data: {...}}
```

Nếu lỗi:

```
Register error: AxiosError {...}
Error response: {data: {...}, status: 500, ...}
```

### 6. Kiểm tra API Response Format

Backend phải trả về format:

```json
{
  "statusCode": 200,
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": {
    "message": "OTP sent to email"
  }
}
```

### 7. Test với Postman/Thunder Client

1. Tạo POST request đến `http://localhost:8080/api/auth/register`
2. Headers:
   ```
   Content-Type: application/json
   ```
3. Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "Password123",
     "confirmPassword": "Password123",
     "fullName": "Test User",
     "phone": "0912345678",
     "role": "RENTER"
   }
   ```
4. Send và kiểm tra response

### 8. Checklist

- [ ] Backend đang chạy trên port 8080
- [ ] CORS đã được config ở backend
- [ ] Controller có `@PostMapping("/auth/register")`
- [ ] Frontend Vite proxy đã được config đúng
- [ ] Network tab hiển thị method là POST (không phải GET)
- [ ] Request payload có đầy đủ fields
- [ ] Response trả về đúng format

### 9. Temporary Workaround (nếu vẫn lỗi)

Nếu vẫn gặp lỗi, có thể tạm thời bypass và test OTP flow:

```typescript
// Login.tsx - handleRegisterSubmit
const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ... validation ...

  try {
    // TEMPORARY: Mock success response for testing OTP flow
    if (import.meta.env.DEV) {
      console.log("DEV MODE: Mocking register success");
      showSuccess("Đăng ký thành công! Vui lòng nhập mã OTP (mock mode).");
      setRegisteredEmail(registerData.email);
      setShowOtpForm(true);
      return;
    }

    // Real API call
    const result = await register({...});
    // ...
  } catch (error) {
    // ...
  }
};
```

Sau khi backend fix xong, xóa phần mock đi.
