# 🔌 API Services - Quick Reference

## 📁 Files Created

### Core Services

- `client/service/api/apiClient.ts` - Axios client với auto token refresh
- `client/service/auth/authService.ts` - Authentication service
- `client/service/config/apiConfig.ts` - API endpoints configuration
- `client/service/types/auth.types.ts` - TypeScript interfaces
- `client/service/index.ts` - Main export file

### React Integration

- `client/hooks/useAuth.ts` - Custom hook cho authentication
- `client/components/auth/ProtectedRoute.tsx` - Protected route wrapper

### Examples

- `client/components/examples/LoginExample.tsx`
- `client/components/examples/RegisterExample.tsx`
- `client/components/examples/GoogleCallbackPage.tsx`

### Documentation

- `SETUP_GUIDE.md` - Setup & integration guide
- `AUTH_API_GUIDE.md` - Detailed API documentation

---

## 🚀 Quick Start

### 1. Import và sử dụng

```typescript
import { authService } from "@/service";
// hoặc
import { useAuth } from "@/hooks/useAuth";
```

### 2. Login Example

```typescript
const { login, loading, error } = useAuth();

const handleLogin = async () => {
  const result = await login({
    email: "user@example.com",
    password: "password",
  });

  if (result) {
    // Success!
  }
};
```

### 3. Protected Route

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📚 Full Documentation

Xem chi tiết trong:

- **SETUP_GUIDE.md** - Hướng dẫn setup đầy đủ
- **AUTH_API_GUIDE.md** - API methods & examples

---

## ✨ Features

✅ Auto token refresh  
✅ Cookie-based refresh token  
✅ Request/Response interceptors  
✅ TypeScript support  
✅ Google OAuth integration  
✅ Protected routes  
✅ Custom React hooks  
✅ Error handling

---

## 🔗 Backend Mapping

All backend endpoints from `AuthController` are implemented:

- ✅ `/api/auth/register`
- ✅ `/api/auth/confirm`
- ✅ `/api/auth/login`
- ✅ `/api/auth/logout`
- ✅ `/api/auth/refresh`
- ✅ `/api/auth/forgot-password`
- ✅ `/api/auth/reset-password`
- ✅ `/api/auth/change-password`
- ✅ `/api/auth/url` (Google OAuth)
- ✅ `/api/auth/callback` (Google OAuth)

---

Sẵn sàng để tích hợp! 🎉
