# EV-Station-based-Rental-System

Nền tảng cho thuê xe điện (Electric Vehicle) - Kết nối người dùng với xe điện và trạm sạc.

## 🚀 Công nghệ sử dụng

### Frontend

- **Mobile App**: React Native + Expo (SDK 54)
- **Navigation**: Expo Router (file-based routing)
- **UI**: React Native Paper + Custom Theme System
- **State**: React Context API
- **Language**: TypeScript

### Backend

- **Spring Boot** (Java)
- **PostgreSQL** (Database)
- **Docker** (Containerization)

---

## 📱 Chạy Mobile App

### 1. Cài đặt

```bash
# Clone repository
git clone https://github.com/LeThiYenVi/EV-Station-based-Rental-System.git

# Di chuyển vào thư mục mobile
cd EV-Station-based-Rental-System/FE/mobile

# Cài đặt dependencies
npm install
```

### 2. Chạy Development Server

```bash
# Khởi động Expo dev server
npx expo start

# Hoặc clear cache trước khi start
npx expo start --clear
```

### 3. Xem app trên các thiết bị

Sau khi chạy `npx expo start`, bạn sẽ thấy QR code và menu options:

#### 📱 **Trên điện thoại thật:**

- **Android**: Quét QR code bằng app **Expo Go** (tải trên Google Play)
- **iOS**: Quét QR code bằng **Camera** app (sẽ mở Expo Go)

#### 💻 **Trên máy tính:**

```
Press w │ open web
Press a │ open Android emulator
Press i │ open iOS simulator (chỉ macOS)
Press r │ reload app
Press m │ toggle menu
Press j │ open debugger
```

#### 🌐 **Xem trên Web:**

1. Sau khi chạy `npx expo start`
2. Nhấn `w` (hoặc click "Press w │ open web" trong terminal)
3. App sẽ mở trong browser tại `http://localhost:8081`

> **Lưu ý**: Web version có thể có một số giới hạn so với native (Android/iOS)

### 4. Xem Layout & Debug

#### **Dev Menu:**

- **Trên điện thoại**: Lắc điện thoại
- **Android emulator**: Cmd/Ctrl + M
- **iOS simulator**: Cmd + D

#### **Xem Layout Inspector:**

```bash
# Sau khi dev menu mở
→ Toggle Element Inspector
→ Click vào element bất kỳ để xem style, props
```

#### **React DevTools:**

```bash
# Mở React DevTools trong Chrome
npx react-devtools
```

#### **Xem logs:**

```bash
# Trong terminal đang chạy expo, logs sẽ tự động hiển thị
# Hoặc filter logs:
npx expo start --clear
```

---

## 📂 Cấu trúc Mobile App

```
mobile/
├── app/                      # Expo Router (file-based routing)
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry point (auth check)
│   ├── login/               # Login modal
│   ├── (tab)/               # Tab navigation
│   │   ├── dashboard/       # Trang chủ
│   │   ├── trip/            # Chuyến đi
│   │   ├── support/         # Hỗ trợ
│   │   ├── messages/        # Tin nhắn
│   │   ├── profile/         # Hồ sơ
│   │   └── account/         # Account gate
│   ├── dashboard/           # Dashboard detail pages
│   │   ├── promo-detail.tsx
│   │   └── place-detail.tsx
│   └── profile/             # Profile pages
│       ├── register-car.tsx
│       ├── favorites.tsx
│       ├── addresses.tsx
│       ├── license.tsx
│       ├── payment.tsx
│       ├── reviews.tsx
│       ├── gifts.tsx
│       └── referral.tsx
├── components/              # Reusable components
│   ├── Section.tsx         # Section với auto-scroll
│   ├── SimpleHeader.tsx    # Header với back button
│   └── RequireLoginButton.tsx
├── hooks/                   # Custom hooks
├── context/                 # Context (Auth, Theme...)
├── mocks/                   # Mock data (centralized)
│   └── mockData.ts         # Tất cả mock data
├── types/                   # TypeScript types
├── utils/                   # Utilities & theme
└── assets/                  # Images, fonts

```

---

## 🎯 Tính năng Mobile App

### 🔐 Authentication

- Login modal với skip option
- Auth context (token-based)
- Protected routes

### 🏠 Dashboard

- User card (avatar, name, points)
- Car type toggle (tự lái / có tài xế)
- Location & time picker
- Search cars với auth check
- Khuyến mãi hot (có detail page)
- Địa điểm nổi bật (có detail page)
- About us & Insurance sections

### 👤 Profile

- 8 menu items với detail pages:
  - Đăng ký cho thuê xe
  - Xe yêu thích
  - Địa chỉ của tôi
  - Giấy phép lái xe
  - Thẻ thanh toán
  - Đánh giá từ chủ xe
  - Quà tặng
  - Giới thiệu bạn bè

### 💬 Messages

- Inbox UI
- Protected với RequireLoginButton
- Message list với avatars & timestamps

### 🆘 Support

- Hotline bảo hiểm (call integration)
- Hướng dẫn
- Thông tin công ty

---

## 🔧 Scripts hữu ích

```bash
# Khởi động dev server
npm start

# Clear cache và start
npm run start:clear

# Type checking
npm run typecheck

# Lint
npm run lint

# Build production
npm run build

# Cài package mới
npx expo install <package-name>
```

---

## 📖 Tài liệu thêm

- [MOBILE_DESIGN_SYSTEM.md](FE/mobile/MOBILE_DESIGN_SYSTEM.md) - Theme system
- [PROFILE_FEATURES.md](FE/mobile/PROFILE_FEATURES.md) - Profile pages
- [DASHBOARD_DETAILS.md](FE/mobile/DASHBOARD_DETAILS.md) - Dashboard details
- [SIMPLIFIED_DETAILS.md](FE/mobile/SIMPLIFIED_DETAILS.md) - SimpleHeader component

---

## 🐛 Troubleshooting

### App không load?

```bash
# Clear cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache
```

### Port đã được sử dụng?

```bash
# Kill process trên port 8081
npx kill-port 8081

# Hoặc dùng port khác
npx expo start --port 8082
```

### Lỗi TypeScript?

```bash
# Check types
npm run typecheck

# Restart TypeScript server trong VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 👥 Đóng góp

Mọi đóng góp đều được chào đón! Tạo Pull Request hoặc Issue trên GitHub.

---

**EV-Station-based-Rental-System** – Giải pháp thuê xe điện hiện đại! 🚗⚡


- init sql:   Get-Content init.sql | docker exec -i evrental-postgres psql -U postgres -d vehicle_rental