# 🎯 Hướng Dẫn Test Tính Năng Đặt Xe và Lịch Sử

## ✅ Đã Sửa Đổi

### 1. **Tính toán giá động** 
- ✅ Giá xe được tính dựa trên số ngày thuê
- ✅ Giá = `602.000đ × số ngày`
- ✅ Bảo hiểm = 10% giá thuê xe
- ✅ Phí dịch vụ = 5% giá thuê xe
- ✅ Giảm giá = 19% giá thuê xe
- ✅ Tổng = Giá xe + Bảo hiểm + Phí DV - Giảm giá

### 2. **Form đặt xe**
- ✅ Date picker nhận xe (binding với state)
- ✅ Time picker nhận xe (binding với state)
- ✅ Date picker trả xe (binding với state)
- ✅ Time picker trả xe (binding với state)
- ✅ Radio button: Tự đến lấy xe / Giao xe tận nơi
- ✅ Input địa chỉ giao xe (hiện khi chọn giao tận nơi)

### 3. **Hiển thị giá trên card**
- ✅ Đơn giá thuê (theo số ngày)
- ✅ Bảo hiểm thuê xe
- ✅ Phí dịch vụ
- ✅ Giảm giá (nếu có)
- ✅ **TỔNG CỘNG** (to, xanh lá)

### 4. **Modal thanh toán Step 1**
- ✅ Hiển thị đúng thông tin booking
- ✅ Địa điểm nhận xe
- ✅ Thời gian nhận/trả xe
- ✅ Thời gian thuê
- ✅ Bảng kê chi tiết:
  - Đơn giá thuê (X ngày)
  - Bảo hiểm
  - Phí dịch vụ
  - Giảm giá
  - Tiền cọc
- ✅ Tổng thanh toán (to, xanh lá)

### 5. **Lưu đơn hàng khi thanh toán thành công**
- ✅ Lưu đúng giá vừa tính toán
- ✅ Lưu tất cả thông tin xe
- ✅ Lưu thông tin người thuê
- ✅ Lưu vào localStorage với key `bookingOrders`

### 6. **Xem chi tiết đơn hàng**
- ✅ Button "Xem đơn hàng" sau khi thanh toán thành công
- ✅ Chuyển đến `/order/{bookingId}`
- ✅ Hiển thị đầy đủ thông tin đơn vừa đặt

### 7. **Lịch sử giao dịch**
- ✅ Hiển thị đơn mới nhất ở đầu
- ✅ Kết hợp với mock data
- ✅ Hiển thị đúng giá từng đơn

---

## 🧪 Các Trường Hợp Test

### Test Case 1: Thuê xe 1 ngày
**Input:**
- Nhận xe: 08/10/2025 09:00
- Trả xe: 09/10/2025 08:00

**Expected:**
```
Đơn giá thuê (1 ngày): 602.000đ
Bảo hiểm thuê xe: 60.200đ
Phí dịch vụ: 30.100đ
Giảm giá (19%): -114.380đ
────────────────────────
TỔNG CỘNG: 577.920đ
```

**Steps:**
1. Vào `/car/1`
2. Kiểm tra card bên phải hiển thị đúng giá
3. Click "Chọn thuê"
4. Kiểm tra modal Step 1 hiển thị đúng giá
5. Click "Tiếp tục"
6. Chọn phương thức thanh toán
7. Click "Xác nhận thanh toán"
8. Sau 2 giây, click "Xem đơn hàng"
9. Kiểm tra trang OrderDetail hiển thị đúng giá
10. Vào `/history`
11. Kiểm tra đơn mới hiển thị ở đầu với đúng giá

---

### Test Case 2: Thuê xe 3 ngày
**Input:**
- Nhận xe: 10/10/2025 08:00
- Trả xe: 13/10/2025 08:00

**Expected:**
```
Đơn giá thuê (3 ngày): 1.806.000đ
Bảo hiểm thuê xe: 180.600đ
Phí dịch vụ: 90.300đ
Giảm giá (19%): -343.140đ
────────────────────────
TỔNG CỘNG: 1.733.760đ
```

**Steps:** (Giống Test Case 1)

---

### Test Case 3: Thuê xe 1 tuần
**Input:**
- Nhận xe: 08/10/2025 06:00
- Trả xe: 15/10/2025 18:00

**Expected:**
```
Đơn giá thuê (8 ngày): 4.816.000đ
Bảo hiểm thuê xe: 481.600đ
Phí dịch vụ: 240.800đ
Giảm giá (19%): -915.040đ
────────────────────────
TỔNG CỘNG: 4.623.360đ
```

---

### Test Case 4: Thuê xe có giao tận nơi
**Input:**
- Nhận xe: 08/10/2025 09:00
- Trả xe: 09/10/2025 09:00
- Chọn: "Tôi muốn được giao xe tận nơi"
- Địa chỉ: "123 Nguyễn Văn Linh, Quận 7"

**Expected:**
- Card hiển thị đúng giá (1 ngày)
- Modal Step 1: "Nơi nhận xe" = "123 Nguyễn Văn Linh, Quận 7"
- OrderDetail: pickupLocation = "123 Nguyễn Văn Linh, Quận 7"

---

### Test Case 5: Thay đổi ngày nhiều lần
**Steps:**
1. Chọn nhận xe: 08/10/2025
2. Chọn trả xe: 09/10/2025
3. Kiểm tra giá: 577.920đ (1 ngày)
4. Đổi trả xe thành: 11/10/2025
5. Kiểm tra giá tự động cập nhật: 1.733.760đ (3 ngày)
6. Đổi trả xe thành: 15/10/2025
7. Kiểm tra giá: 4.623.360đ (8 ngày)

**Expected:**
- Giá cập nhật NGAY LẬP TỨC khi đổi ngày
- Không cần reload page

---

## 📝 Checklist Kiểm Tra

### Trước khi đặt xe:
- [ ] Giá trên card hiển thị đúng
- [ ] Tính toán theo số ngày chính xác
- [ ] Bảo hiểm = 10% giá xe
- [ ] Phí dịch vụ = 5% giá xe
- [ ] Giảm giá = 19% giá xe
- [ ] Tổng cộng = Giá + BH + Phí - Giảm
- [ ] Format số có dấu phẩy (1.234.567đ)

### Modal Step 1:
- [ ] Tên người thuê = username hiện tại
- [ ] Địa điểm đúng (tự đến lấy hoặc giao tận nơi)
- [ ] Thời gian nhận/trả xe đúng
- [ ] Thời gian thuê đúng (X ngày)
- [ ] Bảng kê chi tiết đầy đủ
- [ ] Tổng thanh toán đúng và to rõ

### Modal Step 2 (Thanh toán):
- [ ] Hiển thị QR code
- [ ] Hiển thị thông tin chuyển khoản
- [ ] Có thẻ Credit 3D animation
- [ ] Button "Xác nhận thanh toán"

### Sau thanh toán thành công:
- [ ] Modal success với icon ✓ xanh
- [ ] Hiển thị mã đơn hàng (BKxxxxxxxxx)
- [ ] Button "Xem đơn hàng"
- [ ] Button "Đặt xe khác"

### OrderDetail:
- [ ] URL: `/order/BKxxxxxxxxx`
- [ ] Banner trạng thái "Pending" màu vàng
- [ ] Ảnh xe và tên xe
- [ ] Thông tin xe đầy đủ
- [ ] Thông tin chuyến đi chi tiết
- [ ] Thông tin người thuê
- [ ] Chi tiết thanh toán CHÍNH XÁC với giá đã thanh toán
- [ ] Timeline trạng thái

### HistoryService:
- [ ] Đơn mới nhất ở đầu
- [ ] Hiển thị đúng giá
- [ ] Hiển thị đúng trạng thái (Pending - màu vàng)
- [ ] Button "Xem chi tiết" hoạt động
- [ ] Tìm kiếm hoạt động
- [ ] Lọc theo trạng thái hoạt động

---

## 🐛 Common Issues

### Issue 1: Giá hiển thị "0đ" hoặc "NaNđ"
**Nguyên nhân:** bookingDetails chưa tính toán
**Giải pháp:** ✅ Đã fix bằng hàm calculateRentalDetails()

### Issue 2: Giá trong OrderDetail khác với giá đã thanh toán
**Nguyên nhân:** Không lưu đúng giá vào localStorage
**Giải pháp:** ✅ Đã fix trong handlePayment()

### Issue 3: Khi đổi ngày, giá không cập nhật
**Nguyên nhân:** State không trigger re-render
**Giải pháp:** ✅ Đã fix bằng state binding và calculateRentalDetails()

### Issue 4: Đơn hàng mới không xuất hiện trong lịch sử
**Nguyên nhân:** Không save vào localStorage
**Giải pháp:** ✅ Đã fix, lưu vào đầu mảng với unshift()

---

## 💡 Công Thức Tính Giá

```javascript
// 1. Tính số ngày thuê
const diffMs = returnDate.getTime() - pickupDate.getTime();
const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

// 2. Đơn giá thuê
const carPrice = 602000 * diffDays;

// 3. Bảo hiểm (10%)
const insurance = Math.round(carPrice * 0.1);

// 4. Phí dịch vụ (5%)
const serviceFee = Math.round(carPrice * 0.05);

// 5. Giảm giá (19%)
const discount = Math.round(carPrice * 0.19);

// 6. Tổng cộng
const total = carPrice + insurance + serviceFee - discount;
```

---

## 📊 Ví Dụ Tính Toán

### 1 ngày:
```
602.000 × 1 = 602.000đ      (Giá xe)
602.000 × 10% = 60.200đ     (Bảo hiểm)
602.000 × 5% = 30.100đ      (Phí DV)
602.000 × 19% = 114.380đ    (Giảm giá)
─────────────────────────
602.000 + 60.200 + 30.100 - 114.380 = 577.920đ
```

### 3 ngày:
```
602.000 × 3 = 1.806.000đ
1.806.000 × 10% = 180.600đ
1.806.000 × 5% = 90.300đ
1.806.000 × 19% = 343.140đ
─────────────────────────
1.806.000 + 180.600 + 90.300 - 343.140 = 1.733.760đ
```

### 7 ngày (1 tuần):
```
602.000 × 7 = 4.214.000đ
4.214.000 × 10% = 421.400đ
4.214.000 × 5% = 210.700đ
4.214.000 × 19% = 800.660đ
─────────────────────────
4.214.000 + 421.400 + 210.700 - 800.660 = 4.045.440đ
```

---

## 🎬 Demo Flow

1. **Vào trang chi tiết xe:** `http://localhost:8080/car/1`
2. **Chọn ngày thuê:** 08/10/2025 - 09/10/2025
3. **Kiểm tra giá:** Phải hiển thị ~577.920đ
4. **Click "Chọn thuê"**
5. **Xác nhận thông tin** (Step 1)
6. **Click "Tiếp tục"**
7. **Chọn thanh toán QR** (Step 2)
8. **Click "Xác nhận thanh toán"**
9. **Đợi 2 giây** → Success modal
10. **Click "Xem đơn hàng"** → Chuyển đến `/order/BKxxxxxxxxx`
11. **Kiểm tra giá:** Phải là 577.920đ
12. **Vào lịch sử:** `http://localhost:8080/history`
13. **Tìm đơn mới:** Đầu tiên, màu vàng, giá 577.920đ
14. **Click "Xem chi tiết"** → Quay lại OrderDetail

---

**Happy Testing! 🚀**
