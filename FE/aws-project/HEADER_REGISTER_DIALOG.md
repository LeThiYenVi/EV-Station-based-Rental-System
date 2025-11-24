# Tích Hợp Form Đăng Ký vào Header Dialog

## Tổng Quan

Form đăng ký đã được tích hợp vào Header component dưới dạng Dialog popup thay vì trang riêng biệt (`/register`).

## Thay Đổi Chính

### 1. Header.tsx - Thêm Register Dialog

**Location**: `client/components/site/Header.tsx`

**Imports mới**:

```tsx
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
```

**State mới**:

```tsx
// Register Dialog State
const [isRegisterOpen, setIsRegisterOpen] = useState(false);
const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
const [registerFormData, setRegisterFormData] = useState({
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phoneNumber: "",
});
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [validationErrors, setValidationErrors] = useState<
  Record<string, string>
>({});
```

**Functions thêm vào**:

1. `validateEmail()` - Validate email format
2. `validatePassword()` - Validate password (min 8 chars, uppercase, lowercase, number)
3. `validatePhoneNumber()` - Validate Vietnamese phone format
4. `validateRegisterForm()` - Validate toàn bộ form
5. `handleRegisterInputChange()` - Handle input change + clear errors
6. `handleRegisterSubmit()` - Submit form register
7. `openRegisterDialog()` - Open dialog và reset state

### 2. Button Đăng Ký

**Trước**:

```tsx
<Button variant="ghost" asChild>
  <Link to="/login?mode=register">Đăng ký</Link>
</Button>
```

**Sau**:

```tsx
<Button
  variant="ghost"
  className="hidden md:flex text-gray-700 hover:text-green-500 hover:bg-green-50"
  onClick={openRegisterDialog}
>
  Đăng ký
</Button>
```

### 3. Register Dialog Component

Dialog có 2 trạng thái:

**Success State**:

```tsx
{isRegisterSuccess ? (
  <div className="text-center space-y-4 py-6">
    <CheckCircle2 icon />
    <DialogTitle>Đăng ký thành công!</DialogTitle>
    <p>Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng nhập...</p>
    <Loading spinner />
  </div>
) : (
  // Form đăng ký
)}
```

**Form State** - Gồm các fields:

1. Họ và tên (required)
2. Email (required)
3. Số điện thoại (optional)
4. Mật khẩu (required) - có toggle show/hide
5. Xác nhận mật khẩu (required) - có toggle show/hide

## Flow Đăng Ký

```
1. User click "Đăng ký" button trên Header
   ↓
2. Dialog popup mở ra với form đăng ký
   ↓
3. User điền thông tin và submit
   ↓
4. Client-side validation
   ↓
5. Call API POST /auth/register
   ↓
6. Nếu thành công:
   - Hiển thị success screen 2 giây
   - Đóng dialog
   - Navigate to /login với email pre-filled
   ↓
7. Nếu lỗi:
   - Hiển thị error message
   - User có thể sửa và submit lại
```

## Validation Rules

### Email

- **Required**: Yes
- **Format**: `email@domain.com`
- **Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Error**: "Email không hợp lệ"

### Password

- **Required**: Yes
- **Min Length**: 8 characters
- **Pattern**: Phải có chữ hoa, chữ thường, số
- **Regex**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/`
- **Error**: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"

### Confirm Password

- **Required**: Yes
- **Rule**: Phải khớp với password
- **Error**: "Mật khẩu không khớp"

### Full Name

- **Required**: Yes
- **Min Length**: 2 characters
- **Error**: "Họ và tên phải có ít nhất 2 ký tự"

### Phone Number

- **Required**: No
- **Format**: Vietnamese phone (0912345678 hoặc +84912345678)
- **Regex**: `/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/`
- **Error**: "Số điện thoại không hợp lệ (VD: 0912345678)"

## UI/UX Features

### 1. Real-time Validation

- Lỗi xóa ngay khi user bắt đầu sửa field
- Validation chạy khi submit form
- Error messages hiển thị dưới mỗi field

### 2. Password Visibility Toggle

- Icon Eye/EyeOff để show/hide password
- Áp dụng cho cả password và confirm password

### 3. Loading States

- Button disabled khi đang submit
- Loading spinner hiển thị trong button
- Text thay đổi "Đăng ký" → "Đang đăng ký..."

### 4. Success Animation

- CheckCircle2 icon màu xanh
- Success message
- Loading spinner
- Auto close sau 2 giây

### 5. Dialog Control

- Click outside để đóng
- Press ESC để đóng
- Click X button để đóng
- Auto close sau register success

## Responsive Design

- Dialog responsive với `sm:max-w-[500px]`
- Max height `max-h-[90vh]` với scroll
- Form layout tối ưu cho mobile và desktop

## Integration với Login Page

Sau khi đăng ký thành công:

```tsx
navigate("/login?mode=login", {
  state: {
    message: "Đăng ký thành công! Vui lòng đăng nhập.",
    email: registerFormData.email,
  },
});
```

Login page sẽ:

- Hiển thị success message
- Pre-fill email field
- Switch về tab "ĐĂNG NHẬP"

## So Sánh với Register Page

| Feature      | Register Page (/register) | Register Dialog (Header) |
| ------------ | ------------------------- | ------------------------ |
| Access       | Navigate to new page      | Popup dialog             |
| Form Fields  | ✅ Same                   | ✅ Same                  |
| Validation   | ✅ Same                   | ✅ Same                  |
| API Call     | ✅ Same                   | ✅ Same                  |
| Success Flow | Full page → redirect      | Dialog → redirect        |
| UX           | Slower (page load)        | Faster (instant)         |
| Mobile       | Full screen               | Overlay dialog           |

## Advantages của Dialog Approach

1. **Faster UX**: Không cần load trang mới
2. **Less Disruption**: User không rời khỏi trang hiện tại
3. **Better Flow**: Đăng ký → Login liền mạch
4. **Consistent**: Giống với các modal khác trong app
5. **Responsive**: Tốt cho cả desktop và mobile

## Files Changed

1. ✅ `client/components/site/Header.tsx`
   - Added register dialog
   - Added validation functions
   - Added form state management
   - Changed "Đăng ký" button from Link to onClick

2. 📝 `client/pages/Login/Register.tsx`
   - Vẫn giữ nguyên (backup hoặc có thể xóa)
   - Route `/register` vẫn hoạt động nếu cần

3. 📝 `client/pages/Login/Login.tsx`
   - Không thay đổi
   - Vẫn có tab "ĐĂNG KÝ" trong Login page

## Testing

### Test Cases

1. **Open Dialog**
   - Click "Đăng ký" button
   - ✅ Dialog should open
   - ✅ Form should be empty
   - ✅ No validation errors

2. **Form Validation**
   - Submit empty form
   - ✅ All required field errors show
3. **Email Validation**
   - Input: "notanemail"
   - ✅ Error: "Email không hợp lệ"

4. **Password Validation**
   - Input: "weak"
   - ✅ Error: "Mật khẩu phải có ít nhất 8 ký tự..."

5. **Password Match**
   - Password: "Strong123"
   - Confirm: "Strong456"
   - ✅ Error: "Mật khẩu không khớp"

6. **Phone Validation**
   - Input: "123"
   - ✅ Error: "Số điện thoại không hợp lệ"

7. **Successful Register**
   - Valid inputs
   - ✅ API called
   - ✅ Success screen shows
   - ✅ Redirects to login after 2s

8. **API Error**
   - Email already exists
   - ✅ Error message displays
   - ✅ Form stays open for retry

## Future Enhancements

1. Add Google Sign Up button
2. Add Terms & Conditions checkbox
3. Add email verification step
4. Add CAPTCHA
5. Add password strength meter
6. Add "Already have account? Login" link in dialog
