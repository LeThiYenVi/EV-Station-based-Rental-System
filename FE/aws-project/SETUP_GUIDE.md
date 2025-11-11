# API Integration Setup Guide

## 📁 Cấu trúc thư mục đã tạo

```
client/
├── service/
│   ├── api/
│   │   └── apiClient.ts          # Axios client với interceptors
│   ├── auth/
│   │   └── authService.ts        # Authentication service
│   ├── config/
│   │   └── apiConfig.ts          # API endpoints & config
│   ├── types/
│   │   └── auth.types.ts         # TypeScript types
│   └── index.ts                  # Export tất cả services
├── hooks/
│   └── useAuth.ts                # Custom React hook cho auth
└── components/
    ├── auth/
    │   └── ProtectedRoute.tsx    # Protected route component
    └── examples/
        ├── LoginExample.tsx      # Example login component
        ├── RegisterExample.tsx   # Example register component
        └── GoogleCallbackPage.tsx # Google OAuth callback handler
```

---

## 🚀 Bước 1: Cấu hình Environment

### Tạo file `.env` trong thư mục root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

**Lưu ý:** Thay đổi URL này khi deploy production.

---

## 🔧 Bước 2: Kiểm tra Dependencies

Axios đã được cài đặt:

```bash
pnpm add axios
```

---

## 📝 Bước 3: Sử dụng trong Components

### 3.1. Sử dụng useAuth Hook (Recommended)

```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    const result = await login({ email, password });
    if (result) {
      // Success - user is logged in
      console.log('User:', result.user);
    }
  };

  return (
    // Your JSX
  );
}
```

### 3.2. Sử dụng trực tiếp authService

```tsx
import { authService } from "@/service";

const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: "user@example.com",
      password: "password123",
    });
    console.log("Logged in:", response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

---

## 🛡️ Bước 4: Thiết lập Protected Routes

### Cập nhật Routes của bạn:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GoogleCallbackPage from "@/components/examples/GoogleCallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected with role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔐 Bước 5: Các API Methods có sẵn

### Authentication

```typescript
// Register
await authService.register({
  email: string,
  password: string,
  fullName: string,
  phoneNumber?: string
});

// Verify account
await authService.verifyAccount({
  email: string,
  code: string
});

// Login
await authService.login({
  email: string,
  password: string
});

// Google Login
const { authorizationUrl } = await authService.getGoogleAuthUrl();
window.location.href = authorizationUrl;

// Logout
await authService.logout();

// Forgot password
await authService.forgotPassword({
  email: string
});

// Reset password
await authService.resetPassword({
  email: string,
  code: string,
  newPassword: string
});

// Change password
await authService.changePassword({
  oldPassword: string,
  newPassword: string
});
```

### Helper Methods

```typescript
// Check if authenticated
const isLoggedIn = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Get tokens
const accessToken = authService.getAccessToken();
const idToken = authService.getIdToken();
```

---

## 🔄 Bước 6: Auto Token Refresh

API client tự động xử lý token refresh:

1. Khi request nhận 401 (Unauthorized)
2. Tự động gọi `/api/auth/refresh`
3. Lưu token mới vào localStorage
4. Retry request ban đầu

Nếu refresh thất bại → tự động logout và chuyển về trang login.

---

## 📱 Bước 7: Listen to Login Status Changes

Lắng nghe thay đổi trạng thái đăng nhập:

```tsx
useEffect(() => {
  const handleLoginStatusChange = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("Login status changed:", isLoggedIn);
    // Update UI
  };

  window.addEventListener("loginStatusChanged", handleLoginStatusChange);

  return () => {
    window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
  };
}, []);
```

---

## 🎨 Bước 8: Cập nhật Component hiện tại

### Trong file `Index.tsx` của bạn:

Thay thế logic login hiện tại:

```tsx
// Thay vì:
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// Sử dụng:
import { authService } from "@/service";
const isLoggedIn = authService.isAuthenticated();

// Hoặc dùng hook:
import { useAuth } from "@/hooks/useAuth";
const { isAuthenticated } = useAuth();
```

---

## ⚠️ Error Handling

Tất cả API calls đều throw errors có thể catch:

```tsx
try {
  await authService.login(data);
} catch (error: any) {
  if (error.response) {
    // Server error
    const { statusCode, message } = error.response.data;
    console.error("Server error:", statusCode, message);
  } else if (error.request) {
    // No response
    console.error("Network error");
  } else {
    // Other errors
    console.error("Error:", error.message);
  }
}
```

---

## 🧪 Testing với Backend

### 1. Khởi động Backend

```bash
# Backend Spring Boot
./mvnw spring-boot:run
```

### 2. Khởi động Frontend

```bash
cd d:\SWP391\aws\EV-Station-based-Rental-System\FE\aws-project
pnpm dev
```

### 3. Test các API:

- **Register:** POST http://localhost:8080/api/auth/register
- **Login:** POST http://localhost:8080/api/auth/login
- **Verify:** POST http://localhost:8080/api/auth/confirm

---

## 📚 Tài liệu chi tiết

Xem thêm:

- `AUTH_API_GUIDE.md` - Hướng dẫn chi tiết về Auth API
- `client/service/` - Source code các services
- `client/hooks/useAuth.ts` - React hook
- `client/components/examples/` - Example components

---

## 🔗 API Endpoints Backend

Tất cả endpoints được cấu hình trong `client/service/config/apiConfig.ts`:

```typescript
/api/auth/register        - POST  - Đăng ký
/api/auth/confirm         - POST  - Xác thực tài khoản
/api/auth/login           - POST  - Đăng nhập
/api/auth/logout          - POST  - Đăng xuất
/api/auth/refresh         - POST  - Refresh token
/api/auth/forgot-password - POST  - Quên mật khẩu
/api/auth/reset-password  - POST  - Reset mật khẩu
/api/auth/change-password - POST  - Đổi mật khẩu
/api/auth/url             - POST  - Get Google OAuth URL
/api/auth/callback        - GET   - Google OAuth callback
```

---

## ✅ Checklist

- [x] Cài đặt axios
- [x] Tạo API client với interceptors
- [x] Tạo Auth service với tất cả methods
- [x] Tạo TypeScript types
- [x] Tạo useAuth hook
- [x] Tạo ProtectedRoute component
- [x] Tạo example components
- [x] Cấu hình environment variables
- [ ] Test với Backend
- [ ] Cập nhật components hiện tại sử dụng services mới

---

## 🆘 Troubleshooting

### CORS Error?

Backend cần enable CORS cho `http://localhost:5173`

### 401 Unauthorized?

Kiểm tra token trong localStorage và cookie refresh_token

### Network Error?

Kiểm tra `VITE_API_BASE_URL` trong `.env` và backend đang chạy

---

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. Backend đã chạy chưa?
2. `.env` đã cấu hình đúng URL chưa?
3. Console có lỗi gì không?
4. Network tab trong DevTools

---

**Chúc bạn code vui vẻ! 🚀**
