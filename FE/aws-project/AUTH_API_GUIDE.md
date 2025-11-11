# Auth API Service Documentation

## Setup

### 1. Install Dependencies

```bash
pnpm add axios
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Import the Service

```typescript
import { authService } from "@/service";
```

---

## API Methods

### Registration

**Register a new user**

```typescript
import { authService } from "@/service";
import type { RegisterRequest } from "@/service";

const handleRegister = async () => {
  try {
    const data: RegisterRequest = {
      email: "user@example.com",
      password: "SecurePassword123!",
      fullName: "John Doe",
      phoneNumber: "+84123456789", // optional
    };

    const response = await authService.register(data);
    console.log("Registration successful:", response);

    // Redirect to verification page
    navigate("/verify-account");
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data);
  }
};
```

---

### Account Verification

**Verify account with confirmation code**

```typescript
import type { VerifyAccountRequest } from "@/service";

const handleVerifyAccount = async () => {
  try {
    const data: VerifyAccountRequest = {
      email: "user@example.com",
      code: "123456", // code from email
    };

    await authService.verifyAccount(data);
    console.log("Account verified successfully");

    navigate("/login");
  } catch (error: any) {
    console.error("Verification failed:", error.response?.data);
  }
};
```

---

### Login

**Login with email and password**

```typescript
import type { LoginRequest } from "@/service";

const handleLogin = async () => {
  try {
    const data: LoginRequest = {
      email: "user@example.com",
      password: "SecurePassword123!",
    };

    const response = await authService.login(data);
    console.log("Login successful:", response.user);

    // Tokens are automatically stored
    // Redirect to home
    navigate("/");
  } catch (error: any) {
    console.error("Login failed:", error.response?.data);
  }
};
```

---

### Google OAuth Login

**Step 1: Get Google Authorization URL**

```typescript
const handleGoogleLogin = async () => {
  try {
    const { authorizationUrl, state } = await authService.getGoogleAuthUrl();

    // Store state for validation
    sessionStorage.setItem("oauth_state", state);

    // Redirect to Google
    window.location.href = authorizationUrl;
  } catch (error: any) {
    console.error("Failed to get Google auth URL:", error.response?.data);
  }
};
```

**Step 2: Handle OAuth Callback**

```typescript
// In your callback component (e.g., /auth/callback)
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('Missing code or state');
        }

        // Validate state
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }

        // Login with Google
        const response = await authService.loginWithGoogle(code, state);
        console.log('Google login successful:', response.user);

        // Clean up
        sessionStorage.removeItem('oauth_state');

        // Redirect to home
        navigate('/');

      } catch (error: any) {
        console.error('Google callback failed:', error.response?.data);
        navigate('/login?error=google_auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return <div>Processing Google login...</div>;
};
```

---

### Forgot Password

**Send reset code to email**

```typescript
import type { ForgotPasswordRequest } from "@/service";

const handleForgotPassword = async () => {
  try {
    const data: ForgotPasswordRequest = {
      email: "user@example.com",
    };

    await authService.forgotPassword(data);
    console.log("Reset code sent to email");

    navigate("/reset-password");
  } catch (error: any) {
    console.error("Forgot password failed:", error.response?.data);
  }
};
```

---

### Reset Password

**Reset password with code from email**

```typescript
import type { ResetPasswordRequest } from "@/service";

const handleResetPassword = async () => {
  try {
    const data: ResetPasswordRequest = {
      email: "user@example.com",
      code: "123456", // code from email
      newPassword: "NewSecurePassword123!",
    };

    await authService.resetPassword(data);
    console.log("Password reset successful");

    navigate("/login");
  } catch (error: any) {
    console.error("Reset password failed:", error.response?.data);
  }
};
```

---

### Change Password

**Change password for logged-in users**

```typescript
import type { ChangePasswordRequest } from "@/service";

const handleChangePassword = async () => {
  try {
    const data: ChangePasswordRequest = {
      oldPassword: "OldPassword123!",
      newPassword: "NewSecurePassword123!",
    };

    await authService.changePassword(data);
    console.log("Password changed successfully");
  } catch (error: any) {
    console.error("Change password failed:", error.response?.data);
  }
};
```

---

### Logout

**Logout current user**

```typescript
const handleLogout = async () => {
  try {
    await authService.logout();
    console.log("Logout successful");

    // All tokens are automatically cleared
    navigate("/login");
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data);
  }
};
```

---

## Helper Methods

### Check Authentication Status

```typescript
const isLoggedIn = authService.isAuthenticated();
console.log("User is logged in:", isLoggedIn);
```

### Get Current User

```typescript
const currentUser = authService.getCurrentUser();
console.log("Current user:", currentUser);
```

### Get Access Token

```typescript
const accessToken = authService.getAccessToken();
```

### Get ID Token

```typescript
const idToken = authService.getIdToken();
```

---

## Protected Route Example

```typescript
import { Navigate } from 'react-router-dom';
import { authService } from '@/service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Usage in routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## Error Handling

All API methods throw errors that can be caught and handled:

```typescript
try {
  await authService.login(data);
} catch (error: any) {
  if (error.response) {
    // Server responded with error
    const { statusCode, message, errors } = error.response.data;
    console.error("Error:", statusCode, message, errors);

    // Show error to user
    toast.error(message);
  } else if (error.request) {
    // Request made but no response
    console.error("No response from server");
    toast.error("Unable to connect to server");
  } else {
    // Something else happened
    console.error("Error:", error.message);
    toast.error("An unexpected error occurred");
  }
}
```

---

## Token Refresh

The API client automatically handles token refresh when receiving 401 errors:

1. When a request fails with 401 status
2. The client automatically calls `/api/auth/refresh`
3. New tokens are saved to localStorage
4. The original request is retried with new token

If refresh fails, user is automatically logged out and redirected to login page.

---

## Listen to Login Status Changes

```typescript
useEffect(() => {
  const handleLoginStatusChange = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("Login status changed:", isLoggedIn);
  };

  window.addEventListener("loginStatusChanged", handleLoginStatusChange);

  return () => {
    window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
  };
}, []);
```
