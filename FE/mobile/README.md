# 🚗 EV Rental Mobile App

Ứng dụng di động cho hệ thống thuê xe điện (Electric Vehicle Rental System) được xây dựng bằng React Native và Expo. Hỗ trợ chạy trên iOS, Android và Web.

## 📱 Tổng Quan Dự Án

Đây là ứng dụng cho phép người dùng:

- Tìm kiếm và xem các trạm sạc xe điện gần đây
- Thuê xe điện tại các trạm
- Quản lý lịch sử chuyến đi
- Nhận thông báo và hỗ trợ khách hàng
- Quản lý thông tin cá nhân và phương thức thanh toán

## 🛠️ Tech Stack

- **Framework:** Expo SDK 54 (Managed Workflow)
- **Language:** TypeScript 5.9
- **Routing:** Expo Router 6 (File-based routing)
- **Styling:** NativeWind 4.0 (Tailwind CSS for React Native)
- **Icons:** Lucide React Native
- **State Management:** React Context API
- **Storage:** expo-secure-store (native) / localStorage (web)
- **UI Components:** Custom components với NativeWind
- **Notifications:** react-native-toast-message

## 📁 Cấu Trúc Dự Án

```text
├── app/
│   ├── _layout.tsx          # Root layout (Import global.css, AuthProvider)
│   ├── index.tsx            # Entry point (Redirect to tabs)
│   ├── +not-found.tsx       # 404 Page
│   │
│   ├── (auth)/              # Nhóm màn hình xác thực
│   │   ├── _layout.tsx
│   │   ├── login.tsx        # Đăng nhập
│   │   └── register.tsx     # Đăng ký
│   │
│   ├── (tabs)/              # Thanh điều hướng chính (5 tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # [1. KHÁM PHÁ] Bản đồ, trạm sạc
│   │   ├── messages.tsx     # [2. TIN NHẮN] Thông báo hệ thống
│   │   ├── trips.tsx        # [3. CHUYẾN ĐI] Lịch sử thuê xe
│   │   ├── support.tsx      # [4. HỖ TRỢ] Câu hỏi thường gặp
│   │   └── profile.tsx      # [5. HỒ SƠ] Thông tin người dùng
│   │
│   └── (profile)/           # Các màn hình con của Profile
│       ├── personal-info.tsx
│       ├── payment-methods.tsx
│       ├── trip-history.tsx
│       ├── security.tsx
│       └── ...
│
├── components/
│   └── common/              # UI components tái sử dụng
│       ├── Button.tsx       # Nút bấm
│       ├── Input.tsx        # Ô nhập liệu
│       ├── Card.tsx         # Card container
│       ├── Avatar.tsx       # Ảnh đại diện
│       └── ...
│
├── hooks/
│   └── useAuth.tsx          # Hook quản lý xác thực
│
├── services/
│   ├── api.ts               # Axios instance
│   └── mockData.ts          # Dữ liệu giả lập
│
├── types/
│   └── index.ts             # TypeScript interfaces
│
├── utils/
│   └── storage.ts           # Lưu trữ đa nền tảng
│
├── global.css               # Tailwind CSS styles
├── tailwind.config.js       # Cấu hình Tailwind
├── babel.config.js          # Babel config (NativeWind plugin)
└── metro.config.js          # Metro config (NativeWind integration)
```

## ✨ Tính Năng Chính

### 1. Xác Thực (Authentication)

- Đăng nhập / Đăng ký tài khoản
- Lưu token bảo mật (SecureStore trên native, localStorage trên web)
- Hỗ trợ chế độ khách (Guest mode)
- Tự động redirect dựa trên trạng thái đăng nhập

### 2. Thanh Điều Hướng (5 Tabs)

1. **Khám Phá** - Xem bản đồ và các trạm sạc xe gần đây
2. **Tin Nhắn** - Thông báo hệ thống và hỗ trợ chat
3. **Chuyến Đi** - Lịch sử thuê xe và chuyến đi đang hoạt động
4. **Hỗ Trợ** - Trung tâm trợ giúp, FAQ, liên hệ
5. **Hồ Sơ** - Thông tin cá nhân (hoặc màn hình đăng nhập nếu chưa auth)

### 3. Quản Lý Hồ Sơ

- Thông tin cá nhân
- Phương thức thanh toán
- Lịch sử chuyến đi chi tiết
- Cài đặt bảo mật
- Thông báo và ưu đãi

## 🚀 Hướng Dẫn Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Node.js** 18+ (khuyến nghị 20+)
- **npm** hoặc **yarn**
- **Expo CLI** (tự động cài khi chạy npm start)
- **iOS Simulator** (chỉ trên macOS) hoặc **Android Emulator**
- Trình duyệt web hiện đại (Chrome, Safari, Edge) cho web version

### Bước 1: Cài Đặt Dependencies

```bash
# Clone repository (nếu chưa có)
cd /path/to/EV-Station-based-Rental-System/FE/mobile

# Cài đặt các package
npm install
```

### Bước 2: Chạy Ứng Dụng

#### 🌐 Chạy trên WEB (Khuyến nghị cho development)

```bash
npm run web
# hoặc clear cache nếu gặp lỗi
npx expo start --web --clear
```

Ứng dụng sẽ tự động mở tại `http://localhost:8081` trên trình duyệt.

**Lưu ý quan trọng:**

- Lần đầu chạy có thể mất 10-20 giây để bundle
- Web version sử dụng React Native Web
- Một số tính năng native có thể không khả dụng (Camera, GPS chính xác)
- Phù hợp để test UI/UX và logic nghiệp vụ
- Nếu gặp lỗi cache, luôn dùng `--clear` flag

#### 📱 Chạy trên iOS (chỉ macOS)

```bash
npm run ios
```

Yêu cầu: Xcode và iOS Simulator đã cài đặt.

#### 🤖 Chạy trên Android

```bash
npm run android
```

Yêu cầu: Android Studio và Android Emulator đã cài đặt.

#### 🔄 Chạy Expo Development Server

```bash
npm start
```

Sau đó chọn:

- Nhấn `w` - Mở trong trình duyệt web
- Nhấn `i` - Mở iOS Simulator
- Nhấn `a` - Mở Android Emulator
- Quét QR code bằng app **Expo Go** trên điện thoại thật

#### 🧹 Clear Cache (khi gặp lỗi)

```bash
npm run reset
```

Lệnh này xóa cache Metro bundler và khởi động lại server.

## 🎨 Hướng Dẫn Styling

Dự án sử dụng **NativeWind** (Tailwind CSS cho React Native).

### Quy Tắc Quan Trọng

❌ **KHÔNG sử dụng HTML tags:**

```tsx
// SAI
<div className="flex">
  <p>Text</p>
  <button>Click</button>
</div>
```

✅ **Chỉ sử dụng React Native components:**

```tsx
// ĐÚNG
<View className="flex-1 p-4 bg-white">
  <Text className="text-lg font-bold">Text</Text>
  <Pressable className="bg-primary p-4 rounded-lg active:opacity-80">
    <Text className="text-white">Click</Text>
  </Pressable>
</View>
```

### Mapping HTML → React Native

| HTML                    | React Native           | Ghi chú               |
| ----------------------- | ---------------------- | --------------------- |
| `<div>`                 | `<View>`               | Container             |
| `<p>`, `<span>`, `<h1>` | `<Text>`               | Text content          |
| `<button>`              | `<Pressable>`          | Button với feedback   |
| `<img>`                 | `<Image>`              | Ảnh (từ `expo-image`) |
| `<input>`               | `<TextInput>`          | Input field           |
| `<a>`                   | `<Link>` (Expo Router) | Navigation link       |

### Tailwind Classes

```tsx
<View className="flex-1 bg-white">
  {/* Layout */}
  <View className="flex-row items-center justify-between p-4">
    {/* Spacing */}
    <View className="gap-2 mb-4">
      {/* Colors (custom trong tailwind.config.js) */}
      <Text className="text-primary font-bold">Primary Text</Text>
      <Text className="text-dark">Dark Text</Text>
    </View>

    {/* Responsive & Interactive */}
    <Pressable className="bg-secondary px-6 py-3 rounded-full active:opacity-70">
      <Text className="text-white text-center">Button</Text>
    </Pressable>
  </View>
</View>
```

### Custom Colors (tailwind.config.js)

```javascript
colors: {
  primary: "#10b981",    // Green
  secondary: "#3b82f6",  // Blue
  danger: "#ef4444",     // Red
  warning: "#f59e0b",    // Orange
  dark: "#1f2937",       // Dark Gray
}
```

## 🔌 Tích Hợp API

Hiện tại dự án sử dụng **mock data**. Để kết nối với backend:

### 1. Cấu Hình API Base URL

Sửa file `config/env.ts`:

```typescript
export const API_BASE_URL = "http://your-backend-url.com/api";
```

### 2. Implement API Services

Tạo service trong `services/`:

```typescript
// services/station.service.ts
import api from "./api";

export const stationService = {
  getAll: () => api.get("/stations"),
  getById: (id: string) => api.get(`/stations/${id}`),
};
```

### 3. Sử dụng trong Components

```tsx
import { stationService } from "@/services/station.service";

const [stations, setStations] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  stationService
    .getAll()
    .then((res) => setStations(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);
```

## 🎯 Navigation Flow

```text
app/index.tsx (Entry)
    ↓
app/(tabs)/_layout.tsx (Main Navigation)
    ↓
├── app/(tabs)/index.tsx       [Tab 1: Khám Phá]
├── app/(tabs)/messages.tsx    [Tab 2: Tin Nhắn]
├── app/(tabs)/trips.tsx       [Tab 3: Chuyến Đi]
├── app/(tabs)/support.tsx     [Tab 4: Hỗ Trợ]
└── app/(tabs)/profile.tsx     [Tab 5: Hồ Sơ]
         ↓ (nếu chưa đăng nhập)
    app/(auth)/login.tsx
    app/(auth)/register.tsx
         ↓ (nếu đã đăng nhập)
    app/(profile)/personal-info.tsx
    app/(profile)/payment-methods.tsx
    app/(profile)/trip-history.tsx
    ...
```

## 📖 Tài Liệu Tham Khảo UI

Các file thiết kế UI nằm trong thư mục `design/`:

- `loginpage.jpeg` - Màn hình đăng nhập
- `khámpha.jpeg` - Màn hình khám phá (Explore)
- `messagepagewithoutauth.jpeg` - Màn hình tin nhắn
- `tripwithoutauth.jpeg` - Màn hình chuyến đi
- `supportpage.jpeg` - Màn hình hỗ trợ

## 🔧 Troubleshooting

### Lỗi: "Found config at metro.config.js that could not be loaded"

**Nguyên nhân:** NativeWind chưa được cài đặt đúng version.

**Giải pháp:**

```bash
# Cài đặt đúng version NativeWind v4
npm install nativewind@^4.0.1 tailwindcss@3.3.2

# Clear cache và restart
npx expo start --clear
```

### Lỗi: "className is not working"

**Nguyên nhân:** Thiếu cấu hình NativeWind.

**Giải pháp:**

1. Kiểm tra `metro.config.js` có `withNativeWind(config, { input: "./global.css" })`
2. Kiểm tra `tailwind.config.js` có `presets: [require("nativewind/preset")]`
3. Kiểm tra `app/_layout.tsx` có import `"../global.css"`
4. Chạy `npx expo start --clear` để clear cache

### Lỗi: "Module not found"

```bash
# Clear cache và reinstall
rm -rf node_modules
npm install
npm run reset
```

### Lỗi: "Failed to load global.css"

Đảm bảo file `global.css` tồn tại ở root và chứa:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📝 Coding Standards

### TypeScript

- **KHÔNG dùng `any`**: Luôn định nghĩa interface trong `types/`
- **Định nghĩa Props**: Mỗi component phải có `interface Props`

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  title,
  onPress,
  variant = "primary",
}: ButtonProps) {
  // ...
}
```

### Imports

Sử dụng **absolute imports** với alias `@/`:

```tsx
// ✅ ĐÚNG
import { Button } from "@/components/common";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";

// ❌ SAI
import { Button } from "../../components/common";
```

### Component Structure

```tsx
// 1. React / React Native
import { View, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

// 2. Third-party
import { MapPin } from "lucide-react-native";

// 3. Internal
import { Button } from "@/components/common";
import { useAuth } from "@/hooks/useAuth";

// 4. Types
import { Station } from "@/types";

interface Props {
  station: Station;
}

export default function StationCard({ station }: Props) {
  return (
    <View className="p-4 bg-white rounded-lg">
      <Text className="text-lg font-bold">{station.name}</Text>
    </View>
  );
}
```

## 🤝 Đóng Góp

Khi code, tuân thủ các quy tắc sau:

1. **Mobile-First**: Luôn dùng React Native components, KHÔNG dùng HTML tags
2. **Type Safety**: Định nghĩa đầy đủ TypeScript interfaces
3. **Reusable Components**: Tái sử dụng components trong `components/common/`
4. **Error Handling**: Xử lý loading states và error states
5. **User Feedback**: Dùng Toast thay vì Alert.alert()

## 📄 License

Private - EV Station-based Rental System Project

---

**Phát triển bởi:** Team EV Rental  
**Cập nhật lần cuối:** November 2025  
**Framework:** Expo SDK 54 + React Native 0.81
