# 🌍 Environment Setup - Mock vs Real API

## 📋 Cách Sử Dụng

### 1️⃣ **Code UI với Mock Data** (Không cần Backend)

Mở file: `config/env.ts`

```typescript
export const ENV_CONFIG = {
  USE_MOCK_DATA: true,  // 👈 SET = true
  ...
};
```

✅ App sẽ dùng data giả từ `services/mockData.ts`
✅ Không cần backend chạy
✅ Response nhanh, thuận tiện để code UI

---

### 2️⃣ **Kéo API Thật từ Backend**

Mở file: `config/env.ts`

```typescript
export const ENV_CONFIG = {
  USE_MOCK_DATA: false,  // 👈 SET = false
  API_BASE_URL: 'http://localhost:3000/api',  // URL backend của bạn
  ...
};
```

✅ App sẽ call API thật
✅ Đảm bảo backend đang chạy trước
✅ Response từ database thật

---

## 📁 Cấu Trúc Files

```
config/
  └── env.ts                  # ⚙️ CONFIG CHÍNH - SWITCH Ở ĐÂY

services/
  ├── index.ts                # Service layer (auto switch mock/api)
  ├── api.ts                  # Real API calls
  └── mockData.ts             # Mock data cho development

.env.development              # Environment variables (dev)
.env.production               # Environment variables (prod)
```

---

## 🔧 Cách Dùng Trong Code

### Import Service (Tự động switch)

```typescript
import {
  stationService,
  tripService,
  messageService,
  authService,
} from "@/services";

// Lấy stations - tự động dùng mock hoặc api tùy config
const stations = await stationService.getAll();

// Login - tự động dùng mock hoặc api
const result = await authService.login(email, password);
```

---

## 🎯 Ưu Điểm

✅ **1 dòng code** để switch giữa mock và real API
✅ Không cần comment/uncomment code
✅ Mock data có delay giả lập network
✅ Console log rõ ràng đang dùng mode gì
✅ Type-safe với TypeScript

---

## 📝 Update Mock Data

Sửa file: `services/mockData.ts`

```typescript
export const MOCK_STATIONS: Station[] = [
  // Thêm/sửa mock data ở đây
];
```

---

## 🚀 Khi Deploy Production

App tự động detect `__DEV__` và switch sang production URL:

- Development: `http://localhost:3000/api`
- Production: `https://api.evrental.vn/api`

---

## ⚡ Quick Commands

```bash
# Code UI (mock data)
# Chỉ cần set USE_MOCK_DATA: true trong config/env.ts

# Test với API thật
# 1. Chạy backend trước
# 2. Set USE_MOCK_DATA: false trong config/env.ts
# 3. Reload app
```
