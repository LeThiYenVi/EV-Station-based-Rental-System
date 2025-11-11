# Google Login Integration Guide

## Overview

Successfully integrated Google OAuth 2.0 authentication into the Login page.

## API Endpoints

### 1. Get Google Authorization URL

```
POST /api/auth/url
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
    "state": "random-state-string"
  }
}
```

### 2. Google OAuth Callback

```
GET /api/auth/callback?code={code}&state={state}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJraWQ...",
    "idToken": "eyJraWQ...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "user-id",
      "email": "user@gmail.com",
      "fullName": "User Name",
      "role": "RENTER",
      "emailVerified": true,
      ...
    }
  }
}
```

## Implementation

### 1. Fixed useAuth Hook

**File:** `client/hooks/useAuth.ts`

**Issue:** Method signature mismatch for `changePassword`

- ❌ Old: `changePassword(data: ChangePasswordRequest)`
- ✅ New: `changePassword(currentPassword: string, newPassword: string)`

**Changes:**

```typescript
// Removed ChangePasswordRequest from imports
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  AuthResponse,
} from "@/service";

// Updated interface
interface UseAuthReturn {
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  // ... other methods
}

// Updated implementation
const changePassword = useCallback(
  async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await authService.changePassword(currentPassword, newPassword);

      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Failed to change password";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  },
  [],
);
```

### 2. Login Page Integration

**File:** `client/pages/Login/Login.tsx`

#### Added Imports

```typescript
import { authService } from "@/service/auth/authService";
```

#### Added Handler Functions

```typescript
const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    // User will be redirected to Google OAuth page
  } catch (error) {
    console.error("Google login error:", error);
    showError("Không thể kết nối với Google. Vui lòng thử lại.");
  }
};

const handleGoogleCallback = async (code: string, state: string) => {
  try {
    // Verify state to prevent CSRF attacks
    const savedState = sessionStorage.getItem("oauth_state");
    if (savedState !== state) {
      showError("Xác thực không hợp lệ. Vui lòng thử lại.");
      navigate("/login", { replace: true });
      return;
    }

    // Call API to exchange code for tokens
    const result = await authService.loginWithGoogle(code, state);

    if (result && result.user) {
      // Save login info and navigate based on role
      // ... (implementation details)
    }
  } catch (error: any) {
    console.error("Google callback error:", error);
    const errorMessage =
      error?.response?.data?.message || "Đăng nhập Google thất bại.";
    showError(errorMessage);
    navigate("/login", { replace: true });
  }
};
```

#### Updated useEffect for Callback Handling

```typescript
useEffect(() => {
  const mode = searchParams.get("mode");
  if (mode === "register") {
    setActiveTab("register");
  }

  // Handle Google OAuth callback
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code && state) {
    handleGoogleCallback(code, state);
  }
}, [searchParams]);
```

#### Added Google Login Button

```tsx
{
  /* Divider */
}
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-gray-300" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
  </div>
</div>;

{
  /* Google Login Button */
}
<Button
  type="button"
  variant="outline"
  className="w-full h-11 border-gray-300 hover:bg-gray-50"
  onClick={handleGoogleLogin}
  disabled={loading}
>
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    {/* Google logo SVG */}
  </svg>
  Đăng nhập với Google
</Button>;
```

## OAuth 2.0 Flow

### Step-by-Step Process

1. **User Clicks "Đăng nhập với Google"**
   - `handleGoogleLogin()` is called
   - Calls `useAuth.loginWithGoogle()`

2. **Get Authorization URL**
   - `authService.getGoogleAuthUrl()` calls `POST /api/auth/url`
   - Backend returns Google OAuth URL and state
   - State is saved to `sessionStorage` for verification

3. **Redirect to Google**
   - Browser redirects to Google OAuth consent page
   - User logs in with Google account
   - User grants permissions

4. **Google Redirects Back**
   - Google redirects to: `/login?code=xxx&state=yyy`
   - `useEffect` detects `code` and `state` in URL params
   - Calls `handleGoogleCallback(code, state)`

5. **Exchange Code for Tokens**
   - Verify state matches saved value (CSRF protection)
   - Call `authService.loginWithGoogle(code, state)`
   - Backend calls Google to exchange code for tokens
   - Backend creates/updates user and returns auth response

6. **Complete Login**
   - Save tokens and user info to localStorage
   - Dispatch `loginStatusChanged` event
   - Navigate based on user role (admin/staff/customer)

## Security Features

### 1. CSRF Protection

- ✅ State parameter generated by backend
- ✅ Stored in `sessionStorage` before redirect
- ✅ Verified on callback to prevent CSRF attacks

### 2. Token Management

- ✅ Access token stored in localStorage
- ✅ ID token stored in localStorage
- ✅ Tokens automatically included in API requests via interceptor

### 3. Error Handling

- ✅ Invalid state detection
- ✅ API error messages displayed to user
- ✅ Automatic redirect to login on failure
- ✅ Clean up sessionStorage on completion

## UI/UX Features

### Visual Design

```
┌──────────────────────────────────┐
│  [Email Input]                   │
│  [Password Input]                │
│  [Captcha Input]                 │
│                                  │
│  [TRUY CẬP HỆ THỐNG]            │
│                                  │
│  ─── Hoặc đăng nhập với ───     │
│                                  │
│  [🔵🔴🟡🟢 Đăng nhập với Google] │
│                                  │
│  Quên mật khẩu?                 │
└──────────────────────────────────┘
```

### Loading States

- ✅ Submit button disabled during loading
- ✅ Google button disabled during loading
- ✅ Loading text: "Đang xử lý..."

### User Feedback

- ✅ Success message: "Đăng nhập Google thành công! Chào mừng [Name]"
- ✅ Error messages for various scenarios
- ✅ Toast notifications via `useMessage`

## Testing Checklist

### Manual Testing

- [ ] Click "Đăng nhập với Google" button
- [ ] Verify redirect to Google OAuth page
- [ ] Complete Google login flow
- [ ] Verify redirect back to app with code and state
- [ ] Verify successful login and navigation
- [ ] Check localStorage for tokens and user data
- [ ] Test with different roles (admin/staff/customer)
- [ ] Test error scenarios:
  - [ ] Invalid state (CSRF attempt)
  - [ ] Network errors
  - [ ] Google OAuth cancellation

### Integration Testing

- [ ] Backend `/auth/url` endpoint working
- [ ] Backend `/auth/callback` endpoint working
- [ ] Google OAuth app configured correctly
- [ ] Redirect URI whitelisted in Google Console
- [ ] Token refresh working
- [ ] Role-based navigation working

## Configuration Requirements

### Backend Setup

1. ✅ Google OAuth Client ID configured
2. ✅ Google OAuth Client Secret configured
3. ✅ Redirect URI: `http://localhost:5173/login` (development)
4. ✅ Redirect URI: `https://yourdomain.com/login` (production)

### Google Cloud Console

1. Create OAuth 2.0 Client ID
2. Add authorized redirect URIs
3. Enable Google+ API (if required)
4. Set OAuth consent screen

## Error Messages

| Error Scenario           | Vietnamese Message                                |
| ------------------------ | ------------------------------------------------- |
| Cannot connect to Google | "Không thể kết nối với Google. Vui lòng thử lại." |
| Invalid state (CSRF)     | "Xác thực không hợp lệ. Vui lòng thử lại."        |
| Google login failed      | "Đăng nhập Google thất bại. Vui lòng thử lại."    |
| API error                | Display actual error message from API             |
| Success                  | "Đăng nhập Google thành công! Chào mừng [Name]"   |

## Files Modified

1. ✅ `client/hooks/useAuth.ts` - Fixed changePassword signature
2. ✅ `client/pages/Login/Login.tsx` - Added Google login UI and handlers
3. ✅ `client/service/auth/authService.ts` - Already had Google methods
4. ✅ `client/service/config/apiConfig.ts` - Already had endpoints

## Next Steps

### Recommended Enhancements

1. Add Google avatar to user profile after login
2. Handle existing user with same email (link accounts)
3. Add Apple Sign In option
4. Add Facebook Login option
5. Add "Remember me" functionality
6. Add account linking UI for users who registered with email

### Production Considerations

1. Update redirect URIs for production domain
2. Add rate limiting for OAuth endpoints
3. Implement token rotation
4. Add OAuth audit logging
5. Monitor OAuth success/failure metrics
