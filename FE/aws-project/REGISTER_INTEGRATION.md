# Tài Liệu Tích Hợp API Đăng Ký Tài Khoản

## Tổng Quan

Trang đăng ký tài khoản (`/register`) cho phép người dùng mới tạo tài khoản để sử dụng dịch vụ thuê xe điện.

## Route

- **Path**: `/register`
- **Component**: `Register.tsx`
- **Location**: `client/pages/Login/Register.tsx`

## API Endpoint Sử Dụng

### 1. Register API

```typescript
POST /api/auth/register

Request Body:
{
  email: string;           // Email (bắt buộc)
  password: string;        // Mật khẩu (bắt buộc, min 8 chars)
  fullName: string;        // Họ và tên (bắt buộc)
  phoneNumber?: string;    // Số điện thoại (tùy chọn)
}

Response: AuthResponse
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: string;
  }
}
```

## Hook Sử Dụng

### useAuth Hook

```typescript
const { register, loading, error } = useAuth();

// Sử dụng
const response = await register({
  email: "user@example.com",
  password: "SecurePass123",
  fullName: "Nguyễn Văn A",
  phoneNumber: "0912345678",
});

if (response) {
  // Đăng ký thành công
  navigate("/login");
}
```

## Validation Rules

### 1. Email

- **Bắt buộc**: Có
- **Format**: email@domain.com
- **Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Message lỗi**: "Email không hợp lệ"

### 2. Password

- **Bắt buộc**: Có
- **Độ dài**: Tối thiểu 8 ký tự
- **Yêu cầu**:
  - Ít nhất 1 chữ hoa (A-Z)
  - Ít nhất 1 chữ thường (a-z)
  - Ít nhất 1 số (0-9)
- **Regex**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/`
- **Message lỗi**: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"

### 3. Confirm Password

- **Bắt buộc**: Có
- **Yêu cầu**: Phải khớp với password
- **Message lỗi**: "Mật khẩu không khớp"

### 4. Full Name

- **Bắt buộc**: Có
- **Độ dài**: Tối thiểu 2 ký tự
- **Message lỗi**: "Họ và tên phải có ít nhất 2 ký tự"

### 5. Phone Number

- **Bắt buộc**: Không
- **Format**: Số điện thoại Việt Nam
- **Regex**: `/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/`
- **Ví dụ**: 0912345678, +84912345678
- **Message lỗi**: "Số điện thoại không hợp lệ (VD: 0912345678)"

## Tính Năng

### 1. Form Validation

- ✅ Real-time validation khi user nhập
- ✅ Clear error khi user sửa lỗi
- ✅ Hiển thị tất cả lỗi validation cùng lúc
- ✅ Disable submit button khi đang loading

### 2. Password Security

- ✅ Show/Hide password toggle
- ✅ Show/Hide confirm password toggle
- ✅ Password strength hint
- ✅ Password match validation

### 3. User Experience

- ✅ Loading spinner khi đang xử lý
- ✅ Success animation khi đăng ký thành công
- ✅ Auto redirect đến trang login sau 2 giây
- ✅ Pass email sang trang login để auto-fill
- ✅ Error message từ API hiển thị rõ ràng

### 4. Navigation

- ✅ Link "Đăng nhập ngay" cho user đã có tài khoản
- ✅ Success message khi redirect về login
- ✅ Email được truyền qua state để auto-fill

## Flow Đăng Ký

```
1. User điền form đăng ký
   ↓
2. Client validate form (email, password, fullName, phoneNumber)
   ↓
3. Nếu validation pass → Call POST /api/auth/register
   ↓
4. Backend tạo tài khoản mới
   ↓
5. Backend trả về AuthResponse (nhưng chưa cần verify email)
   ↓
6. Frontend hiển thị success message 2 giây
   ↓
7. Auto redirect về /login với email pre-filled
   ↓
8. User đăng nhập với tài khoản mới
```

## Error Handling

### Client-side Errors

```typescript
validationErrors = {
  email: "Email không hợp lệ",
  password: "Mật khẩu phải có ít nhất 8 ký tự...",
  confirmPassword: "Mật khẩu không khớp",
  fullName: "Họ và tên là bắt buộc",
  phoneNumber: "Số điện thoại không hợp lệ",
};
```

### Server-side Errors

```typescript
// Hiển thị từ API response
error = "Email đã được sử dụng";
error = "Registration failed";
```

## UI Components

### 1. Success View

```tsx
<CheckCircle2 /> + "Đăng ký thành công!"
+ Loading spinner
+ "Đang chuyển đến trang đăng nhập..."
```

### 2. Registration Form

- Card với shadow và gradient background
- 5 input fields: fullName, email, phoneNumber, password, confirmPassword
- Password toggle icons (Eye/EyeOff)
- Submit button với loading state
- Link đến trang login

## Testing

### Test Cases

1. ✅ **Valid Registration**
   - Input: Tất cả fields hợp lệ
   - Expected: Success → Redirect to login

2. ✅ **Invalid Email**
   - Input: "notanemail"
   - Expected: Error "Email không hợp lệ"

3. ✅ **Weak Password**
   - Input: "12345678"
   - Expected: Error "Mật khẩu phải có ít nhất... chữ hoa, chữ thường và số"

4. ✅ **Password Mismatch**
   - Input: password="Pass123", confirmPassword="Pass456"
   - Expected: Error "Mật khẩu không khớp"

5. ✅ **Invalid Phone**
   - Input: "123456"
   - Expected: Error "Số điện thoại không hợp lệ"

6. ✅ **Duplicate Email**
   - Input: Email đã tồn tại
   - Expected: API error "Email đã được sử dụng"

7. ✅ **Empty Required Fields**
   - Input: Bỏ trống email, password, fullName
   - Expected: Error cho từng field

## Integration với Login Page

### Login.tsx đã được cập nhật:

```tsx
// Thêm link đăng ký
<p className="text-sm text-gray-600">
  Chưa có tài khoản?{" "}
  <Link
    to="/register"
    className="text-green-600 hover:text-green-700 font-semibold"
  >
    Đăng ký ngay
  </Link>
</p>
```

### Register Success → Login

```tsx
navigate("/login", {
  state: {
    message: "Đăng ký thành công! Vui lòng đăng nhập.",
    email: formData.email, // Pre-fill email
  },
});
```

## File Structure

```
client/pages/Login/
├── Login.tsx          # Trang đăng nhập (đã có)
├── Register.tsx       # Trang đăng ký (MỚI)
└── index.ts          # Export cả Login và Register

client/hooks/
└── useAuth.ts        # Hook chứa register method

client/service/
├── auth/
│   └── authService.ts   # Service chứa register API call
└── types/
    └── auth.types.ts    # RegisterRequest, AuthResponse interfaces
```

## API Integration Status

- ✅ POST /api/auth/register - HOÀN TẤT
- ✅ Routing /register - HOÀN TẤT
- ✅ Form validation - HOÀN TẤT
- ✅ Error handling - HOÀN TẤT
- ✅ Success flow - HOÀN TẤT
- ✅ Link từ Login page - HOÀN TẤT

## Next Steps (Tùy chọn)

1. Email verification (nếu backend yêu cầu)
2. Forgot password flow
3. Social registration (Google, Facebook)
4. CAPTCHA để chống bot
5. Terms & Conditions checkbox
