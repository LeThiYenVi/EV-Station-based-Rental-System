# 🚀 Production Deployment & Testing Guide

## ✅ Đã cấu hình

### 1. API Configuration (Auto-detect environment)

- **Development**: Vite proxy → `http://localhost:8080`
- **Production**: Direct call → `https://ec5y1d098i.execute-api.ap-southeast-1.amazonaws.com`

### 2. CORS Configuration

- **Development**: `withCredentials: true` (có proxy, không có CORS issue)
- **Production**: `withCredentials: false` (tránh CORS error)

---

## 📋 Pre-deployment Checklist

### Backend Requirements (AWS API Gateway)

Nếu muốn bật `withCredentials: true` trong production, backend **PHẢI** config:

```yaml
# AWS API Gateway CORS Settings
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Max-Age: 86400
```

**Lưu ý**:

- ❌ KHÔNG dùng `*` cho `Access-Control-Allow-Origin` khi `credentials: true`
- ✅ PHẢI chỉ định domain cụ thể

---

## 🔨 Build & Deploy

### 1. Build Production

```bash
# Build cho production
pnpm build

# Output: dist/
```

### 2. Test Production Build Locally

```bash
# Preview production build
pnpm preview

# Hoặc
npx vite preview
```

### 3. Deploy

#### Option A: Vercel

```bash
vercel --prod
```

#### Option B: Netlify

```bash
netlify deploy --prod
```

#### Option C: AWS S3 + CloudFront

```bash
# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 🧪 Testing Production

### Test 1: API Connection

Mở browser console và kiểm tra:

```
🌐 API Client Config: {
  mode: 'Production',
  baseURL: 'https://ec5y1d098i.execute-api.ap-southeast-1.amazonaws.com/api',
  withCredentials: false,
  corsMode: 'no-credentials'
}
```

### Test 2: Public Endpoints (No Auth)

Test các endpoint không cần auth:

- ✅ GET `/api/vehicles` - Danh sách xe
- ✅ GET `/api/stations` - Danh sách trạm
- ✅ GET `/api/blogs/published` - Blog công khai

### Test 3: Authenticated Endpoints

Test các endpoint cần auth:

- ✅ POST `/api/auth/login` - Đăng nhập
- ✅ GET `/api/bookings/my-bookings` - Lịch sử đặt xe
- ✅ POST `/api/bookings` - Tạo booking mới

### Test 4: CORS Error Check

Nếu thấy lỗi CORS:

```
Access to XMLHttpRequest at 'https://ec5y1d098i...' from origin 'https://your-domain.com'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

**Giải pháp**:

1. Kiểm tra backend CORS config
2. Nếu backend chưa config đủ → Giữ `VITE_ENABLE_CREDENTIALS_PRODUCTION=false`
3. Nếu backend đã config đủ → Bật `VITE_ENABLE_CREDENTIALS_PRODUCTION=true`

---

## 🔧 Environment Variables

### Development (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_CREDENTIALS_PRODUCTION=false
```

### Production (.env.production)

```env
VITE_API_BASE_URL_PRODUCTION=https://ec5y1d098i.execute-api.ap-southeast-1.amazonaws.com
VITE_ENABLE_CREDENTIALS_PRODUCTION=false
```

### Production với CORS đủ (.env.production)

```env
VITE_API_BASE_URL_PRODUCTION=https://ec5y1d098i.execute-api.ap-southeast-1.amazonaws.com
VITE_ENABLE_CREDENTIALS_PRODUCTION=true
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Triệu chứng**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp**:

1. Set `VITE_ENABLE_CREDENTIALS_PRODUCTION=false` trong `.env`
2. Rebuild: `pnpm build`
3. Deploy lại

### Issue 2: 401 Unauthorized

**Triệu chứng**:

```
401 Unauthorized on protected endpoints
```

**Nguyên nhân**:

- Token không được gửi (vì `withCredentials: false`)

**Giải pháp**:

- Hệ thống vẫn gửi `Authorization: Bearer <token>` qua header
- Kiểm tra localStorage có `accessToken` không
- Clear localStorage và login lại

### Issue 3: Network Error

**Triệu chứng**:

```
Network Error / ERR_CONNECTION_REFUSED
```

**Kiểm tra**:

1. Backend có đang chạy không?
2. URL trong `.env.production` đúng chưa?
3. Firewall/VPN có block không?

---

## 📊 API Endpoint Status

| Endpoint                         | Method | Auth Required | CORS Safe | Status     |
| -------------------------------- | ------ | ------------- | --------- | ---------- |
| `/api/auth/login`                | POST   | ❌            | ✅        | ✅ Working |
| `/api/vehicles`                  | GET    | ❌            | ✅        | ✅ Working |
| `/api/stations`                  | GET    | ❌            | ✅        | ✅ Working |
| `/api/bookings/my-bookings`      | GET    | ✅            | ✅        | ✅ Working |
| `/api/bookings`                  | POST   | ✅            | ✅        | ✅ Working |
| `/api/bookings/:id/payRemainder` | GET    | ✅            | ✅        | ✅ Working |

---

## ✅ Success Criteria

Production deployment thành công khi:

1. ✅ Build không có error: `pnpm build`
2. ✅ Console log hiển thị Production mode
3. ✅ API calls thành công (no CORS error)
4. ✅ Login/Logout hoạt động
5. ✅ Tạo booking thành công
6. ✅ Payment redirect hoạt động
7. ✅ Admin/Staff pages load được

---

## 📝 Notes

- **Token Storage**: Sử dụng `localStorage` cho `accessToken` (không phụ thuộc cookies)
- **Refresh Token**: Nếu backend dùng cookie, cần `withCredentials: true` và backend phải config CORS đủ
- **AWS API Gateway**: Đã hỗ trợ CORS sẵn, nhưng cần check cấu hình `Access-Control-Allow-Credentials`

---

## 🆘 Support

Nếu gặp vấn đề:

1. Check browser console
2. Check Network tab (F12)
3. Check API response headers
4. Verify `.env` variables
5. Rebuild và deploy lại
