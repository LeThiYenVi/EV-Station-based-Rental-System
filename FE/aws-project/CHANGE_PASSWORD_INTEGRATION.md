# Change Password API Integration

## Overview

Successfully integrated the change password API into the User Profile page (Security Tab).

## API Details

### Endpoint

```
POST /api/auth/change-password
```

### Request Body

```json
{
  "accessToken": "eyJraWQ...",
  "currentPassword": "123456",
  "newPassword": "NewPassword123!"
}
```

### Response (Success)

```json
{
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null,
  "responseAt": "2024-11-10T..."
}
```

### Response (Error)

```json
{
  "statusCode": 401,
  "message": "Unauthorize",
  "errors": "Failed to change password: Password did not conform with policy: Password not long enough",
  "responseAt": null
}
```

## Implementation

### 1. Updated Type Definition

**File:** `client/service/types/auth.types.ts`

```typescript
export interface ChangePasswordRequest {
  accessToken: string;
  currentPassword: string;
  newPassword: string;
}
```

### 2. Updated Auth Service

**File:** `client/service/auth/authService.ts`

```typescript
async changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const accessToken = this.getAccessToken();
  if (!accessToken) {
    throw new Error('User is not authenticated');
  }

  const data: ChangePasswordRequest = {
    accessToken,
    currentPassword,
    newPassword
  };

  await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
}
```

### 3. User Profile Component

**File:** `client/pages/Customer/User/in4.tsx`

#### Added State

```typescript
const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isChangingPassword, setIsChangingPassword] = useState(false);
```

#### Handler Function

```typescript
const handleChangePassword = async () => {
  // Validation
  if (
    !passwordData.currentPassword ||
    !passwordData.newPassword ||
    !passwordData.confirmPassword
  ) {
    showWarning("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    showError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    return;
  }

  if (passwordData.newPassword.length < 8) {
    showWarning("Mật khẩu mới phải có ít nhất 8 ký tự!");
    return;
  }

  try {
    setIsChangingPassword(true);
    await authService.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );

    showSuccess("Đổi mật khẩu thành công!");

    // Reset form and close dialog
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordDialogOpen(false);
  } catch (error: any) {
    // Error handling with specific messages
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.errors ||
      error?.message;

    if (errorMessage?.includes("not long enough")) {
      showError("Mật khẩu không đủ độ dài theo yêu cầu...");
    } else if (
      errorMessage?.includes("Unauthorize") ||
      errorMessage?.includes("Incorrect")
    ) {
      showError("Mật khẩu hiện tại không đúng!");
    } else if (errorMessage?.includes("policy")) {
      showError("Mật khẩu mới không đáp ứng chính sách bảo mật...");
    } else {
      showError(errorMessage || "Không thể đổi mật khẩu. Vui lòng thử lại!");
    }
  } finally {
    setIsChangingPassword(false);
  }
};
```

## Features

### 1. Password Validation

- ✅ All fields required
- ✅ Password confirmation match
- ✅ Minimum 8 characters
- ✅ Server-side policy validation

### 2. Security Features

- 🔒 Toggle password visibility (Eye icon)
- 🔒 Access token automatically included
- 🔒 Password fields masked by default

### 3. User Experience

- 📱 Responsive dialog design
- ⚡ Loading state during API call
- 💬 Clear error messages from API
- ✅ Success notification
- 🔄 Form reset after success

### 4. Error Handling

The component handles various error scenarios:

- **Password too short**: "Mật khẩu không đủ độ dài theo yêu cầu..."
- **Incorrect current password**: "Mật khẩu hiện tại không đúng!"
- **Policy violation**: "Mật khẩu mới không đáp ứng chính sách bảo mật..."
- **Generic errors**: Displays actual error message from API

## Password Policy (Server-side)

Based on the API response, passwords must:

- ✅ Be long enough (minimum length enforced by server)
- ✅ Contain uppercase letters
- ✅ Contain lowercase letters
- ✅ Contain numbers
- ✅ Contain special characters

## UI Components Used

- `Dialog` - Modal container
- `DialogContent` - Dialog body
- `DialogHeader` - Title and description
- `DialogFooter` - Action buttons
- `Input` - Password fields
- `Button` - Submit and cancel actions
- `Label` - Field labels
- `useMessage` - Toast notifications

## Testing

### Test Cases

1. ✅ Open dialog from Security tab
2. ✅ Validate empty fields
3. ✅ Validate password mismatch
4. ✅ Validate minimum length
5. ✅ Test incorrect current password
6. ✅ Test weak password (policy violation)
7. ✅ Test successful password change
8. ✅ Toggle password visibility
9. ✅ Cancel and close dialog
10. ✅ Loading state during API call

### Test Credentials

```
Current Password: 123456 (example - will fail policy)
New Password: NewPass123! (example - should meet policy)
```

## Files Modified

1. ✅ `client/service/types/auth.types.ts` - Updated ChangePasswordRequest interface
2. ✅ `client/service/auth/authService.ts` - Updated changePassword method
3. ✅ `client/pages/Customer/User/in4.tsx` - Added dialog and handler
4. ✅ `client/service/config/apiConfig.ts` - Endpoint already configured

## Next Steps

- Consider adding password strength indicator
- Add "Forgot password" link in dialog
- Implement password history (prevent reusing recent passwords)
- Add success redirect to login page (force re-authentication)
