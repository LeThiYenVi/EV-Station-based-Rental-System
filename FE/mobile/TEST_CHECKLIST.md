# 📋 Test Checklist - EV Rental Mobile App

**Test Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**Backend URL:** ******\_\_\_******  
**App Version:** 1.0.0

---

## 🔧 Setup & Prerequisites

- [ ] Backend đang chạy tại `http://localhost:8080`
- [ ] Database đã seed dữ liệu test
- [ ] Mobile app đã start: `npx expo start`
- [ ] TypeScript compilation OK: `npx tsc --noEmit`

---

## Phase 1: Core Infrastructure

### 1.1 TypeScript Compilation

- [ ] ✅ PASS | ❌ FAIL | Chạy `npx tsc --noEmit` → Exit code 0
- **Notes:** ******\_\_\_******

### 1.2 Environment Configuration

- [ ] ✅ PASS | ❌ FAIL | `API_BASE_URL` đúng trong `config/env.ts`
- [ ] ✅ PASS | ❌ FAIL | `USE_MOCK_DATA = false`
- **Notes:** ******\_\_\_******

---

## Phase 2: Authentication Module

### 2.1 Register Flow

- [ ] ✅ PASS | ❌ FAIL | Mở app → Navigate to Register screen
- [ ] ✅ PASS | ❌ FAIL | Nhập: fullName, email, phone, password (8-20 ký tự)
- [ ] ✅ PASS | ❌ FAIL | Tap "Đăng Ký" → Loading state hiển thị
- [ ] ✅ PASS | ❌ FAIL | Success Toast xuất hiện
- [ ] ✅ PASS | ❌ FAIL | Auto-redirect to /(tabs)
- [ ] ✅ PASS | ❌ FAIL | User name hiển thị ở header
- **Notes:** ******\_\_\_******

### 2.2 Login Flow

- [ ] ✅ PASS | ❌ FAIL | Navigate to Login screen
- [ ] ✅ PASS | ❌ FAIL | Nhập email & password
- [ ] ✅ PASS | ❌ FAIL | Tap "Đăng Nhập" → Loading state
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Redirect to /(tabs)
- [ ] ✅ PASS | ❌ FAIL | Token được lưu (check localStorage/SecureStore)
- **Notes:** ******\_\_\_******

### 2.3 Google OAuth (Optional - cần backend config)

- [ ] ✅ PASS | ❌ FAIL | Tap "Đăng nhập với Google"
- [ ] ✅ PASS | ❌ FAIL | Loading state hiển thị
- [ ] ✅ PASS | ❌ FAIL | Google OAuth URL mở trong browser
- [ ] ✅ PASS | ❌ FAIL | (Nếu có callback) User auto-login sau OAuth
- **Notes:** ******\_\_\_******

### 2.4 Logout

- [ ] ✅ PASS | ❌ FAIL | Profile tab → Tap "Đăng Xuất"
- [ ] ✅ PASS | ❌ FAIL | Tokens bị xóa
- [ ] ✅ PASS | ❌ FAIL | Redirect to login screen
- **Notes:** ******\_\_\_******

---

## Phase 3: User Profile Module

### 3.1 View Profile

- [ ] ✅ PASS | ❌ FAIL | Navigate to Profile tab
- [ ] ✅ PASS | ❌ FAIL | User info hiển thị (name, email, phone, avatar)
- [ ] ✅ PASS | ❌ FAIL | Menu items hiển thị đầy đủ
- **Notes:** ******\_\_\_******

### 3.2 Edit Profile

- [ ] ✅ PASS | ❌ FAIL | Profile → Personal Info
- [ ] ✅ PASS | ❌ FAIL | Tap "Chỉnh Sửa Thông Tin"
- [ ] ✅ PASS | ❌ FAIL | Thay đổi fullName, phone, address
- [ ] ✅ PASS | ❌ FAIL | Tap "Lưu Thay Đổi" → Loading state
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Thông tin cập nhật hiển thị
- **Notes:** ******\_\_\_******

### 3.3 Upload Avatar

- [ ] ✅ PASS | ❌ FAIL | Personal Info → Tap camera icon
- [ ] ✅ PASS | ❌ FAIL | Image picker mở
- [ ] ✅ PASS | ❌ FAIL | Chọn ảnh từ library
- [ ] ✅ PASS | ❌ FAIL | Upload loading state
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Avatar mới hiển thị
- **Notes:** ******\_\_\_******

---

## Phase 4: Station & Location Module

### 4.1 View Stations List

- [ ] ✅ PASS | ❌ FAIL | Navigate to Explore tab
- [ ] ✅ PASS | ❌ FAIL | Loading spinner hiển thị
- [ ] ✅ PASS | ❌ FAIL | Danh sách trạm load từ API
- [ ] ✅ PASS | ❌ FAIL | Mỗi trạm hiển thị: name, address, status
- [ ] ✅ PASS | ❌ FAIL | Empty state nếu không có trạm
- **Notes:** ******\_\_\_******

### 4.2 Search Stations

- [ ] ✅ PASS | ❌ FAIL | Nhập tên trạm vào search bar
- [ ] ✅ PASS | ❌ FAIL | Kết quả filter đúng
- [ ] ✅ PASS | ❌ FAIL | Clear search → hiển thị lại tất cả
- **Notes:** ******\_\_\_******

### 4.3 Nearby Stations (cần Location permission)

- [ ] ✅ PASS | ❌ FAIL | Tap "Dùng Vị Trí Hiện Tại"
- [ ] ✅ PASS | ❌ FAIL | Grant location permission
- [ ] ✅ PASS | ❌ FAIL | Loading state
- [ ] ✅ PASS | ❌ FAIL | Nearby stations load
- [ ] ✅ PASS | ❌ FAIL | Distance hiển thị cho mỗi trạm
- **Notes:** ******\_\_\_******

### 4.4 Station Detail Screen

- [ ] ✅ PASS | ❌ FAIL | Tap vào StationCard
- [ ] ✅ PASS | ❌ FAIL | Navigate to station/[id]
- [ ] ✅ PASS | ❌ FAIL | Station photo/placeholder hiển thị
- [ ] ✅ PASS | ❌ FAIL | Info: name, address, hours, hotline, rating
- [ ] ✅ PASS | ❌ FAIL | Status badge (Hoạt Động/Đóng Cửa)
- [ ] ✅ PASS | ❌ FAIL | Stats: Tổng xe / Xe khả dụng
- [ ] ✅ PASS | ❌ FAIL | Danh sách xe available hiển thị
- [ ] ✅ PASS | ❌ FAIL | Tap "Chỉ Đường" → Google Maps mở
- [ ] ✅ PASS | ❌ FAIL | Tap hotline → Phone dialer mở
- **Notes:** ******\_\_\_******

---

## Phase 5: Vehicle Module

### 5.1 View Vehicles at Station

- [ ] ✅ PASS | ❌ FAIL | Ở Station Detail, xem danh sách xe
- [ ] ✅ PASS | ❌ FAIL | VehicleCard hiển thị: photo, name, brand, price, status
- [ ] ✅ PASS | ❌ FAIL | Badge màu sắc đúng (AVAILABLE=green, IN_USE=yellow, etc.)
- **Notes:** ******\_\_\_******

### 5.2 Vehicle Detail Modal

- [ ] ✅ PASS | ❌ FAIL | Tap vào VehicleCard
- [ ] ✅ PASS | ❌ FAIL | Modal slide up
- [ ] ✅ PASS | ❌ FAIL | Photos carousel (swipe horizontal)
- [ ] ✅ PASS | ❌ FAIL | Name, brand, status hiển thị
- [ ] ✅ PASS | ❌ FAIL | Rating & rent count
- [ ] ✅ PASS | ❌ FAIL | Specs grid: fuel type, capacity, license plate, station
- [ ] ✅ PASS | ❌ FAIL | Pricing: hourly rate, daily rate, deposit
- [ ] ✅ PASS | ❌ FAIL | Policies list (nếu có)
- [ ] ✅ PASS | ❌ FAIL | "Đặt Xe Ngay" button (nếu available)
- [ ] ✅ PASS | ❌ FAIL | Tap X → Modal close
- **Notes:** ******\_\_\_******

---

## Phase 6: Booking/Rental Module ⚠️ CRITICAL

### 6.1 QR Code Scanner

- [ ] ✅ PASS | ❌ FAIL | Explore → Tap QR button
- [ ] ✅ PASS | ❌ FAIL | Camera permission request
- [ ] ✅ PASS | ❌ FAIL | Grant permission
- [ ] ✅ PASS | ❌ FAIL | Camera mở (modal presentation)
- [ ] ✅ PASS | ❌ FAIL | Corner frame overlay hiển thị
- [ ] ✅ PASS | ❌ FAIL | Flashlight toggle hoạt động
- [ ] ✅ PASS | ❌ FAIL | Scan QR code (format: EV-{vehicleId} hoặc UUID)
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Navigate to unlock/[vehicleId]
- **Notes:** ******\_\_\_******

### 6.2 Vehicle Unlock Screen

- [ ] ✅ PASS | ❌ FAIL | Vehicle details load từ API
- [ ] ✅ PASS | ❌ FAIL | Photo, specs, pricing hiển thị
- [ ] ✅ PASS | ❌ FAIL | Status badge đúng
- [ ] ✅ PASS | ❌ FAIL | Check availability (AVAILABLE status)
- [ ] ✅ PASS | ❌ FAIL | Tap "Quick Rent" (1 hour)
- [ ] ✅ PASS | ❌ FAIL | Loading state
- [ ] ✅ PASS | ❌ FAIL | Booking created
- [ ] ✅ PASS | ❌ FAIL | Navigate to payment/active trip
- **Notes:** ******\_\_\_******

### 6.3 Booking Form (Book in Advance)

- [ ] ✅ PASS | ❌ FAIL | From unlock screen → Tap "Book in Advance"
- [ ] ✅ PASS | ❌ FAIL | Vehicle summary hiển thị
- [ ] ✅ PASS | ❌ FAIL | Tap start time → DateTimePicker mở
- [ ] ✅ PASS | ❌ FAIL | Select date & time
- [ ] ✅ PASS | ❌ FAIL | Tap end time → DateTimePicker mở
- [ ] ✅ PASS | ❌ FAIL | Select date & time
- [ ] ✅ PASS | ❌ FAIL | Duration tự động tính (hiển thị số giờ)
- [ ] ✅ PASS | ❌ FAIL | Price = duration × hourlyRate
- [ ] ✅ PASS | ❌ FAIL | Price breakdown hiển thị (deposit + rental fee)
- [ ] ✅ PASS | ❌ FAIL | Nhập note (optional)
- [ ] ✅ PASS | ❌ FAIL | Tap "Tạo Booking" → Loading
- [ ] ✅ PASS | ❌ FAIL | API call thành công
- [ ] ✅ PASS | ❌ FAIL | Navigate to payment-result với bookingId & payUrl
- **Notes:** ******\_\_\_******

### 6.4 MoMo Payment Flow

- [ ] ✅ PASS | ❌ FAIL | Payment result screen hiển thị
- [ ] ✅ PASS | ❌ FAIL | "Đang chuyển sang MoMo..." loading
- [ ] ✅ PASS | ❌ FAIL | MoMo payment URL mở (browser/app)
- [ ] ✅ PASS | ❌ FAIL | (In MoMo) Chọn payment method
- [ ] ✅ PASS | ❌ FAIL | (In MoMo) Confirm payment
- [ ] ✅ PASS | ❌ FAIL | Redirect back to app
- [ ] ✅ PASS | ❌ FAIL | Payment details fetch từ API
- [ ] ✅ PASS | ❌ FAIL | Success: Green CheckCircle icon
- [ ] ✅ PASS | ❌ FAIL | Payment info: amount, method, status, transaction ID, time
- [ ] ✅ PASS | ❌ FAIL | Booking ID hiển thị
- [ ] ✅ PASS | ❌ FAIL | Instruction box hiển thị
- **Notes:** ******\_\_\_******

### 6.5 Payment Failure Handling

- [ ] ✅ PASS | ❌ FAIL | (Nếu payment fail) Red XCircle icon
- [ ] ✅ PASS | ❌ FAIL | "Thanh Toán Thất Bại" title
- [ ] ✅ PASS | ❌ FAIL | Error instruction box
- [ ] ✅ PASS | ❌ FAIL | "Liên Hệ Hỗ Trợ" button → navigate to support
- [ ] ✅ PASS | ❌ FAIL | "Thử Lại" button → go back
- **Notes:** ******\_\_\_******

### 6.6 View Active Trip

- [ ] ✅ PASS | ❌ FAIL | Navigate to Trips tab
- [ ] ✅ PASS | ❌ FAIL | Active trip section hiển thị
- [ ] ✅ PASS | ❌ FAIL | OR tap "Xem Chuyến Đi" từ payment result
- [ ] ✅ PASS | ❌ FAIL | Navigate to (rental)/active
- [ ] ✅ PASS | ❌ FAIL | Pulse indicator animation
- [ ] ✅ PASS | ❌ FAIL | Real-time timer (HH:MM:SS) updates mỗi giây
- [ ] ✅ PASS | ❌ FAIL | Current cost estimation hiển thị
- [ ] ✅ PASS | ❌ FAIL | Trip details: vehicle, station, booking code
- [ ] ✅ PASS | ❌ FAIL | Instruction box
- **Notes:** ******\_\_\_******

### 6.7 Complete Trip

- [ ] ✅ PASS | ❌ FAIL | Tap "Hoàn Thành Chuyến Đi"
- [ ] ✅ PASS | ❌ FAIL | Alert confirmation dialog
- [ ] ✅ PASS | ❌ FAIL | Confirm → Loading state
- [ ] ✅ PASS | ❌ FAIL | API call to complete booking
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Navigate to trips list
- [ ] ✅ PASS | ❌ FAIL | Booking status = COMPLETED
- [ ] ✅ PASS | ❌ FAIL | Trip moved to history section
- **Notes:** ******\_\_\_******

### 6.8 View Trip History

- [ ] ✅ PASS | ❌ FAIL | Trips tab → Lịch Sử section
- [ ] ✅ PASS | ❌ FAIL | Completed/Cancelled bookings hiển thị
- [ ] ✅ PASS | ❌ FAIL | Each trip: vehicle, date, time, status, amount
- [ ] ✅ PASS | ❌ FAIL | Formatted dates (dd/MM/yyyy)
- [ ] ✅ PASS | ❌ FAIL | Formatted times (HH:mm)
- [ ] ✅ PASS | ❌ FAIL | Empty state nếu không có history
- **Notes:** ******\_\_\_******

### 6.9 Trip History Screen (Profile)

- [ ] ✅ PASS | ❌ FAIL | Profile → Trip History
- [ ] ✅ PASS | ❌ FAIL | Loading state
- [ ] ✅ PASS | ❌ FAIL | All trips load
- [ ] ✅ PASS | ❌ FAIL | Filter tabs: Tất Cả, Hoàn Thành, Đã Hủy
- [ ] ✅ PASS | ❌ FAIL | Tap filter → kết quả filter đúng
- [ ] ✅ PASS | ❌ FAIL | Each trip: booking code, vehicle, station, amount, duration
- **Notes:** ******\_\_\_******

### 6.10 Cancel Booking

- [ ] ✅ PASS | ❌ FAIL | Trips → Active → Select CONFIRMED booking
- [ ] ✅ PASS | ❌ FAIL | Tap "Hủy Đặt Xe" button
- [ ] ✅ PASS | ❌ FAIL | Confirmation dialog
- [ ] ✅ PASS | ❌ FAIL | Confirm → API call
- [ ] ✅ PASS | ❌ FAIL | Success Toast
- [ ] ✅ PASS | ❌ FAIL | Booking status = CANCELLED
- [ ] ✅ PASS | ❌ FAIL | Removed from active trips
- [ ] ✅ PASS | ❌ FAIL | Moved to history (cancelled)
- **Notes:** ******\_\_\_******

---

## Phase 7: Payment Module

### 7.1 Payment Details in Result Screen

- [ ] ✅ PASS | ❌ FAIL | After booking → Payment result screen
- [ ] ✅ PASS | ❌ FAIL | Booking ID hiển thị
- [ ] ✅ PASS | ❌ FAIL | Amount formatted (vi-VN locale)
- [ ] ✅ PASS | ❌ FAIL | Payment method (MoMo)
- [ ] ✅ PASS | ❌ FAIL | Status badge (Đã Thanh Toán/Đang Xử Lý)
- [ ] ✅ PASS | ❌ FAIL | Transaction ID (nếu có)
- [ ] ✅ PASS | ❌ FAIL | Timestamp (paidAt) formatted
- **Notes:** ******\_\_\_******

### 7.2 Payment History Screen

- [ ] ✅ PASS | ❌ FAIL | Profile → Payment Methods
- [ ] ✅ PASS | ❌ FAIL | Tap "Xem Lịch Sử Thanh Toán"
- [ ] ✅ PASS | ❌ FAIL | Navigate to payment-history
- [ ] ✅ PASS | ❌ FAIL | Loading state
- [ ] ✅ PASS | ❌ FAIL | All transactions load
- [ ] ✅ PASS | ❌ FAIL | Each payment: vehicle, booking code, date, status, amount
- [ ] ✅ PASS | ❌ FAIL | Status badge màu đúng
- [ ] ✅ PASS | ❌ FAIL | Empty state nếu chưa có payment
- **Notes:** ******\_\_\_******

---

## Phase 9: Support Module

### 9.1 Support Screen

- [ ] ✅ PASS | ❌ FAIL | Navigate to Support tab
- [ ] ✅ PASS | ❌ FAIL | FAQ section hiển thị (6 items)
- [ ] ✅ PASS | ❌ FAIL | Tap FAQ → expand/collapse
- [ ] ✅ PASS | ❌ FAIL | Contact section: Phone, Email, Chat
- [ ] ✅ PASS | ❌ FAIL | Tap Phone → phone dialer mở
- [ ] ✅ PASS | ❌ FAIL | Tap Email → email client mở
- [ ] ✅ PASS | ❌ FAIL | Safety Tips section hiển thị
- **Notes:** ******\_\_\_******

---

## 🐛 Bug Tracking

### Critical Bugs (P0)

| #   | Description | Screen | Reproduce Steps | Status                          |
| --- | ----------- | ------ | --------------- | ------------------------------- |
| 1   |             |        |                 | ⏳ Open / ✅ Fixed / ❌ Wontfix |
| 2   |             |        |                 |                                 |

### Major Bugs (P1)

| #   | Description | Screen | Reproduce Steps | Status                          |
| --- | ----------- | ------ | --------------- | ------------------------------- |
| 1   |             |        |                 | ⏳ Open / ✅ Fixed / ❌ Wontfix |
| 2   |             |        |                 |                                 |

### Minor Bugs (P2)

| #   | Description | Screen | Reproduce Steps | Status                          |
| --- | ----------- | ------ | --------------- | ------------------------------- |
| 1   |             |        |                 | ⏳ Open / ✅ Fixed / ❌ Wontfix |
| 2   |             |        |                 |                                 |

---

## 📊 Test Summary

**Total Test Cases:** **\_** / **\_**  
**Passed:** **\_** (\_**\_%)  
**Failed:** \_\_\_** (\_**\_%)  
**Blocked:** \_\_\_** (\_\_\_\_%)

### Pass/Fail by Phase

- **Phase 1 (Infrastructure):** **\_** / **\_**
- **Phase 2 (Authentication):** **\_** / **\_**
- **Phase 3 (User Profile):** **\_** / **\_**
- **Phase 4 (Station & Location):** **\_** / **\_**
- **Phase 5 (Vehicle):** **\_** / **\_**
- **Phase 6 (Booking/Rental):** **\_** / **\_**
- **Phase 7 (Payment):** **\_** / **\_**
- **Phase 9 (Support):** **\_** / **\_**

### Critical Issues Found

1. ***
2. ***
3. ***

### Recommendations

1. ***
2. ***
3. ***

---

## 📝 Notes

### Environment Info

- **OS:** ******\_\_\_******
- **Browser/Simulator:** ******\_\_\_******
- **Network:** ******\_\_\_******

### Backend Status

- **Version:** ******\_\_\_******
- **Database:** ******\_\_\_******
- **Test Data:** ******\_\_\_******

### Known Limitations

1. Phase 8 (Messages) - Backend API không có
2. Google OAuth - Cần backend config với Google Cloud
3. MoMo Payment - Cần test credentials từ MoMo

---

**Sign-off:**

Tester: ******\_\_\_******  
Date: ******\_\_\_******  
Status: ⏳ In Progress / ✅ Completed / ❌ Failed
