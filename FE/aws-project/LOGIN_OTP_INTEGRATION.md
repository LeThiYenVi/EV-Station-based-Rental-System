# Tích Hợp Đăng Ký với OTP Verification

## Tổng Quan

Đã cập nhật hoàn toàn hệ thống đăng ký tài khoản với OTP verification flow. Giờ chỉ có 1 trang Login duy nhất với 2 tabs: **Đăng nhập** và **Đăng ký**.

## Thay Đổi Chính

### 1. API Types Mới

**RegisterRequest** - Cập nhật theo format backend:

```typescript
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string; // Bắt buộc, không phải phoneNumber
  role: string; // "RENTER" cho customer
}
```

**VerifyOtpRequest** - Mới thêm:

```typescript
export interface VerifyOtpRequest {
  email: string;
  otpCode: string; // 6 số
}
```

### 2. API Endpoints

**Đăng ký**: `POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "password": "StrongPass123@",
  "confirmPassword": "StrongPass123@",
  "role": "RENTER"
}
```

**Response**:

```json
{
  "message": "Đăng ký thành công. Mã OTP đã được gửi đến email của bạn."
}
```

**Xác thực OTP**: `POST /api/auth/verify-otp`

```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Response**: AuthResponse với tokens

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

### 3. AuthService Updates

```typescript
class AuthService {
  // Register - returns message, NOT tokens
  async register(data: RegisterRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
    return response.data!;
  }

  // Verify OTP - returns tokens after successful verification
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    );

    const authData = response.data!;

    // Store tokens ONLY after OTP verification
    this.saveTokens(authData);
    this.updateLoginStatus(true);

    return authData;
  }
}
```

### 4. useAuth Hook Updates

```typescript
interface UseAuthReturn {
  register: (data: RegisterRequest) => Promise<{ message: string } | null>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<AuthResponse | null>;
  // ... other methods
}

const { register, verifyOtp, loading, error } = useAuth();
```

### 5. Login.tsx - Register Tab với OTP

**State mới**:

```typescript
const [showOtpForm, setShowOtpForm] = useState(false);
const [registeredEmail, setRegisteredEmail] = useState("");
const [otpCode, setOtpCode] = useState("");

const [registerData, setRegisterData] = useState({
  fullName: "",
  email: "",
  phone: "", // Thay đổi từ username
  password: "",
  confirmPassword: "",
  captcha: "",
});
```

**Flow đăng ký**:

```
1. User điền form đăng ký (fullName, email, phone, password, confirmPassword, captcha)
   ↓
2. Click "ĐĂNG KÝ TÀI KHOẢN"
   ↓
3. Validate captcha + password match
   ↓
4. Call register API với role="RENTER"
   ↓
5. Backend gửi OTP email, trả về message
   ↓
6. Frontend hiển thị OTP form (replace register form)
   ↓
7. User nhập 6 số OTP
   ↓
8. Click "XÁC THỰC OTP"
   ↓
9. Call verifyOtp API
   ↓
10. Backend verify OTP, trả về tokens
    ↓
11. Frontend lưu tokens + chuyển về tab "ĐĂNG NHẬP"
    ↓
12. User có thể đăng nhập ngay
```

### 6. Register Form Fields

**Đã xóa**: `username` field
**Đã thêm**: `phone` field (bắt buộc)

```tsx
{
  /* Họ và tên */
}
<Input placeholder="Nguyễn Văn A" required />;

{
  /* Email */
}
<Input type="email" placeholder="example@email.com" required />;

{
  /* Số điện thoại - MỚI */
}
<Input type="tel" placeholder="0912345678" required />;

{
  /* Mật khẩu */
}
<Input type="password" minLength={8} required />;

{
  /* Xác nhận mật khẩu */
}
<Input type="password" required />;

{
  /* Captcha */
}
<Input placeholder="Nhập captcha" required />;
```

### 7. OTP Verification Form

```tsx
{showOtpForm ? (
  <form onSubmit={handleOtpSubmit}>
    <h3>Xác thực OTP</h3>
    <p>Mã OTP đã được gửi đến email: {registeredEmail}</p>

    <Input
      type="text"
      placeholder="000000"
      value={otpCode}
      maxLength={6}
      className="text-center text-2xl tracking-widest"
      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
    />

    <Button disabled={otpCode.length !== 6}>
      XÁC THỰC OTP
    </Button>

    <Button variant="outline" onClick={handleBackToRegister}>
      <ArrowLeft /> Quay lại đăng ký
    </Button>
  </form>
) : (
  // Register form
)}
```

### 8. OTP Input Features

- **Auto-filter**: Chỉ nhận số (0-9)
- **Max length**: 6 ký tự
- **Large display**: Text lớn (text-2xl), center-aligned, tracking-widest
- **Validation**: Button disabled nếu chưa đủ 6 số
- **Back button**: Quay lại form đăng ký nếu cần

### 9. Files Đã Thay Đổi

✅ **client/service/types/auth.types.ts**

- Updated RegisterRequest (phone, confirmPassword, role)
- Added VerifyOtpRequest

✅ **client/service/config/apiConfig.ts**

- Added VERIFY_OTP endpoint

✅ **client/service/auth/authService.ts**

- Updated register() - returns message
- Added verifyOtp() - returns tokens

✅ **client/hooks/useAuth.ts**

- Updated register interface
- Added verifyOtp method

✅ **client/pages/Login/Login.tsx**

- Updated register form (removed username, added phone)
- Added OTP verification form
- Added showOtpForm state management
- Added handleOtpSubmit logic
- Updated handleRegisterSubmit with new API format

✅ **client/App.tsx**

- Removed Register import
- Removed /register route

✅ **client/pages/Login/index.ts**

- Removed Register export

✅ **client/components/site/Header.tsx**

- Changed "Đăng ký" button to link to /login?mode=register

❌ **DELETED**: client/pages/Login/Register.tsx

### 10. Testing Scenarios

#### Scenario 1: Successful Registration

```
1. Navigate to /login?mode=register
2. Fill form:
   - Họ và tên: "Nguyễn Văn A"
   - Email: "test@example.com"
   - Số điện thoại: "0912345678"
   - Mật khẩu: "Strong123@"
   - Xác nhận MK: "Strong123@"
   - Captcha: "6d7mp"
3. Click "ĐĂNG KÝ TÀI KHOẢN"
4. ✅ See OTP form with email displayed
5. Enter OTP: "123456"
6. Click "XÁC THỰC OTP"
7. ✅ Success message + redirect to Login tab
8. Login with email/password
```

#### Scenario 2: Password Mismatch

```
1. Fill form
2. Password: "Strong123@"
3. Confirm: "Different123@"
4. Click register
5. ✅ Error: "Mật khẩu xác nhận không khớp!"
```

#### Scenario 3: Invalid Captcha

```
1. Fill form
2. Captcha: "wrong"
3. Click register
4. ✅ Error: "Captcha không đúng!"
```

#### Scenario 4: Wrong OTP

```
1. Register successfully
2. OTP form appears
3. Enter wrong OTP: "999999"
4. Click verify
5. ✅ Error from API: "Mã OTP không đúng"
6. Can re-enter correct OTP
```

#### Scenario 5: Back to Register

```
1. Register successfully
2. OTP form appears
3. Click "Quay lại đăng ký"
4. ✅ Back to register form
5. ✅ Previous data preserved
6. Can edit and re-submit
```

### 11. Error Handling

**Client-side errors**:

- Empty required fields
- Password mismatch
- Invalid captcha
- OTP not 6 digits

**Server-side errors** (displayed in UI):

- Email already exists
- Invalid email format
- Weak password
- Wrong OTP code
- Expired OTP
- Server connection errors

### 12. UX Improvements

1. **Clear Flow**: Register → OTP → Login
2. **Email Display**: Shows registered email in OTP form
3. **Input Validation**: Real-time filtering (numbers only for OTP)
4. **Button States**: Disabled when invalid input
5. **Loading States**: Shows "Đang xử lý..." during API calls
6. **Success Feedback**: Toast messages for each step
7. **Error Recovery**: Can go back and fix registration data
8. **Auto-format**: OTP input styled for easy reading

### 13. Security Features

1. **OTP Required**: Can't login without verification
2. **Tokens Only After OTP**: No auth tokens until verified
3. **Captcha Protection**: Prevents automated registration
4. **Password Confirmation**: Reduces typos
5. **Role Enforcement**: Backend sets user role to "RENTER"

### 14. Mobile Responsive

- ✅ OTP input large and touch-friendly
- ✅ Forms scroll properly on small screens
- ✅ Buttons full-width on mobile
- ✅ Text sizes readable on all devices

### 15. Integration Points

**Login Tab**:

- Unchanged, works as before
- Email/password login
- Google OAuth login

**Register Tab**:

- Shows register form by default
- Switches to OTP form after registration
- Returns to login tab after OTP verification

**Header**:

- "Đăng ký" button → `/login?mode=register`
- Opens Login page with Register tab active

### 16. API Contract

Backend must implement:

**POST /api/auth/register**

- Accept: RegisterRequest
- Return: `{ message: string }`
- Side effect: Send OTP email

**POST /api/auth/verify-otp**

- Accept: VerifyOtpRequest
- Return: AuthResponse with tokens
- Validate: OTP code, email match

### 17. Next Steps (Optional)

1. **Resend OTP**: Add button to resend OTP email
2. **OTP Timer**: Show countdown (e.g., "Valid for 5 minutes")
3. **SMS OTP**: Alternative OTP via SMS
4. **Auto-focus**: Focus OTP input when form appears
5. **Paste Support**: Allow paste 6-digit OTP from clipboard
6. **Auto-submit**: Submit when 6 digits entered

### 18. Migration Notes

**For users**:

- Old `/register` route removed
- Use Login page Register tab instead
- OTP verification now required

**For developers**:

- RegisterRequest interface changed
- Added VerifyOtpRequest
- Register.tsx deleted
- All registration now in Login.tsx

## Summary

✅ Unified login page với 2 tabs  
✅ Register với đầy đủ fields (fullName, email, phone, password)  
✅ OTP verification flow hoàn chỉnh  
✅ Xóa Register.tsx và route /register  
✅ API integration với format mới  
✅ Error handling toàn diện  
✅ UX/UI tối ưu cho mobile và desktop
