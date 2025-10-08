# 🐛 Debug Guide - Vấn Đề "Không tìm thấy đơn hàng"

## 🎯 Vấn đề đã được sửa

### Nguyên nhân:
**BookingId bị tạo mới mỗi lần render!**

Trước đây:
```typescript
const bookingDetails = {
  bookingId: "BK" + Date.now(),  // ❌ Tạo mới mỗi lần render!
  // ...
}
```

Khi component render lại (vì state thay đổi), `Date.now()` tạo ra timestamp mới → BookingId khác nhau!

**Ví dụ:**
1. Lần render 1: `bookingId = "BK1733740800000"` → Lưu vào localStorage
2. Component re-render (vì state thay đổi)
3. Lần render 2: `bookingId = "BK1733740800125"` → Khác với cái đã lưu!
4. Click "Xem đơn hàng" → Navigate đến `/order/BK1733740800125`
5. OrderDetail tìm `BK1733740800125` → ❌ Không tìm thấy!

### Giải pháp:
✅ **Tạo bookingId 1 lần duy nhất khi bắt đầu đặt xe**

```typescript
// 1. Thêm state để lưu bookingId
const [currentBookingId, setCurrentBookingId] = useState<string>("");

// 2. Tạo bookingId khi click "Chọn thuê"
const handleBookingClick = () => {
  if (!currentBookingId) {
    const newBookingId = "BK" + Date.now();
    setCurrentBookingId(newBookingId);
  }
  // ...
};

// 3. Sử dụng currentBookingId trong bookingDetails
const bookingDetails = {
  bookingId: currentBookingId || "BK" + Date.now(),
  // ...
};
```

Bây giờ bookingId chỉ được tạo 1 lần và giữ nguyên qua tất cả các render!

---

## 🧪 Cách Test

### Test Case 1: Đặt xe thành công
1. **Vào trang chi tiết xe:** `http://localhost:8080/car/1`
2. **Mở Console (F12)** để xem logs
3. **Click "Chọn thuê"**
   - Console: `🆕 Tạo mã đơn hàng mới: BK1234567890`
4. **Hoàn tất Step 1** → Click "Tiếp tục"
5. **Chọn thanh toán QR** → Click "Xác nhận thanh toán"
6. **Xem Console:**
   ```
   ✅ Đã lưu đơn hàng: BK1234567890
   📦 Tất cả đơn hàng: ["BK1234567890", "BK1733740800001", ...]
   ```
7. **Click "Xem đơn hàng"**
8. **Xem Console OrderDetail:**
   ```
   🔍 Tìm đơn hàng với ID: BK1234567890
   📦 localStorage: có dữ liệu
   📋 Tất cả đơn hàng: ["BK1234567890", "BK1733740800001", ...]
   ✅ Tìm thấy đơn hàng: BK1234567890
   ```
9. **Kết quả:** Trang OrderDetail hiển thị đầy đủ thông tin đơn hàng ✅

### Test Case 2: Đơn hàng không tồn tại
1. **Truy cập trực tiếp:** `http://localhost:8080/order/BK9999999999`
2. **Xem Console:**
   ```
   🔍 Tìm đơn hàng với ID: BK9999999999
   📦 localStorage: có dữ liệu
   📋 Tất cả đơn hàng: ["BK1234567890", "BK1733740800001", ...]
   ❌ KHÔNG tìm thấy đơn hàng với ID: BK9999999999
   ```
3. **Kết quả:** Hiển thị "Không tìm thấy đơn hàng" ✅

---

## 📝 Debug Checklist

### Khi gặp lỗi "Không tìm thấy đơn hàng":

#### Bước 1: Kiểm tra localStorage
Mở Console (F12) và chạy:
```javascript
// Xem tất cả đơn hàng
JSON.parse(localStorage.getItem("bookingOrders"))

// Xem booking ID của đơn đầu tiên
JSON.parse(localStorage.getItem("bookingOrders"))[0].bookingId
```

#### Bước 2: Kiểm tra URL
- URL hiện tại: `http://localhost:8080/order/BKxxxxxxxxxx`
- BookingId trong URL: `BKxxxxxxxxxx`
- So sánh với localStorage

#### Bước 3: Xem Console Logs

**Khi đặt xe (CarIn4):**
```
🆕 Tạo mã đơn hàng mới: BK1234567890
✅ Đã lưu đơn hàng: BK1234567890
📦 Tất cả đơn hàng: ["BK1234567890", ...]
```

**Khi xem chi tiết (OrderDetail):**
```
🔍 Tìm đơn hàng với ID: BK1234567890
📦 localStorage: có dữ liệu
📋 Tất cả đơn hàng: ["BK1234567890", ...]
✅ Tìm thấy đơn hàng: BK1234567890
```

#### Bước 4: Kiểm tra Mock Data
Mock data trong HistoryService có thể ghi đè localStorage. Để xóa:
```javascript
// Clear localStorage
localStorage.removeItem("bookingOrders");

// Reload trang
location.reload();
```

---

## 🔧 Troubleshooting

### Issue 1: BookingId thay đổi liên tục
**Nguyên nhân:** Component re-render nhiều lần  
**Giải pháp:** ✅ Đã fix bằng state `currentBookingId`

### Issue 2: localStorage trống
**Nguyên nhân:** Chưa đặt xe hoặc đã clear localStorage  
**Giải pháp:** Đặt xe mới để tạo đơn hàng

### Issue 3: bookingId không khớp
**Nguyên nhân:** Timing issue khi lưu và navigate  
**Giải pháp:** ✅ Đã fix bằng cách sử dụng cùng 1 bookingId

### Issue 4: Mock data ghi đè
**Nguyên nhân:** HistoryService tự động lưu mock data  
**Giải pháp:** Comment dòng lưu mock data:
```typescript
// localStorage.setItem("bookingOrders", JSON.stringify(mockOrders));
```

---

## 🎬 Flow Hoàn Chỉnh

```
1. User click "Chọn thuê"
   ↓
2. Tạo currentBookingId: BK1234567890 (1 lần duy nhất)
   ↓
3. Mở login/verify/payment dialog
   ↓
4. User hoàn tất thông tin
   ↓
5. Click "Xác nhận thanh toán"
   ↓
6. Tạo newOrder với bookingId: BK1234567890
   ↓
7. Lưu vào localStorage
   ↓
8. Hiển thị Success modal
   ↓
9. User click "Xem đơn hàng"
   ↓
10. Navigate đến: /order/BK1234567890
    ↓
11. OrderDetail đọc localStorage
    ↓
12. Tìm đơn với bookingId: BK1234567890
    ↓
13. ✅ Tìm thấy → Hiển thị chi tiết
```

---

## 🧹 Clear Data để Test Lại

Nếu muốn test lại từ đầu:

```javascript
// 1. Clear localStorage
localStorage.clear();

// 2. Reload trang
location.reload();

// 3. Đặt xe mới
```

Hoặc chỉ xóa đơn hàng:

```javascript
// Xóa tất cả đơn hàng
localStorage.removeItem("bookingOrders");

// Reload
location.reload();
```

---

## ✅ Kiểm Tra Thành Công

Sau khi sửa, bạn sẽ thấy:

1. ✅ Console log: "🆕 Tạo mã đơn hàng mới: BKxxxxxxxxxx"
2. ✅ Console log: "✅ Đã lưu đơn hàng: BKxxxxxxxxxx"
3. ✅ Console log: "✅ Tìm thấy đơn hàng: BKxxxxxxxxxx"
4. ✅ Trang OrderDetail hiển thị đầy đủ thông tin
5. ✅ Giá hiển thị chính xác
6. ✅ Tất cả thông tin khớp với lúc đặt

---

## 📊 So Sánh Trước và Sau

### ❌ Trước (Có lỗi):
```typescript
// BookingId thay đổi mỗi lần render
const bookingDetails = {
  bookingId: "BK" + Date.now(),  // Mỗi render = 1 ID mới!
}

// Render 1: BK1733740800000
// Render 2: BK1733740800100  ❌ Khác!
// Render 3: BK1733740800200  ❌ Khác!
```

### ✅ Sau (Đã fix):
```typescript
// BookingId tạo 1 lần và giữ nguyên
const [currentBookingId, setCurrentBookingId] = useState("");

const handleBookingClick = () => {
  if (!currentBookingId) {
    setCurrentBookingId("BK" + Date.now());  // Chỉ tạo 1 lần!
  }
};

const bookingDetails = {
  bookingId: currentBookingId,  // Luôn giống nhau!
}

// Render 1: BK1733740800000
// Render 2: BK1733740800000  ✅ Giống!
// Render 3: BK1733740800000  ✅ Giống!
```

---

**Vấn đề đã được fix! Hãy test lại bằng cách:**
1. Reload trang
2. Đặt xe mới
3. Xem Console logs
4. Click "Xem đơn hàng"
5. Kiểm tra trang OrderDetail

**Happy Debugging! 🚀**
