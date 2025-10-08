# 🎨 Xem Demo với Mock Data

## Cách xem giao diện với nhiều đơn hàng

### Tự động load mock data

Khi bạn truy cập trang **Lịch sử giao dịch** (`/history`), hệ thống sẽ tự động:

1. ✅ Load 8 đơn hàng mẫu với các trạng thái khác nhau
2. ✅ Kết hợp với các đơn hàng thật từ localStorage (nếu có)
3. ✅ Loại bỏ các đơn trùng lặp
4. ✅ Lưu mock data vào localStorage để dùng cho OrderDetail

### Mock Data bao gồm:

#### 1. **MAZDA 2 2024** - ✅ Hoàn thành
- Mã: BK1733740800001
- Thời gian: 10/10/2025 - 15/10/2025 (5 ngày)
- Địa điểm: Phường Linh Đông, TP Thủ Đức
- Tổng tiền: 3,010,000đ
- Thanh toán: QR Code

#### 2. **TOYOTA VIOS 2023** - 🔵 Đã xác nhận
- Mã: BK1733740700002
- Thời gian: 12/10/2025 - 14/10/2025 (2 ngày)
- Địa điểm: Quận 1, TP Hồ Chí Minh
- Tổng tiền: 1,800,000đ
- Thanh toán: Chuyển khoản

#### 3. **HONDA CITY 2024** - 🟡 Chờ xác nhận
- Mã: BK1733740600003
- Thời gian: 08/10/2025 - 08/10/2025 (15 giờ)
- Địa điểm: Quận 7, TP Hồ Chí Minh
- Tổng tiền: 650,000đ
- Thanh toán: QR Code

#### 4. **MERCEDES E-CLASS 2023** - ✅ Hoàn thành (Có tài xế)
- Mã: BK1733740500004
- Thời gian: 01/10/2025 - 05/10/2025 (4 ngày)
- Địa điểm: Quận 3, TP Hồ Chí Minh
- Tổng tiền: 8,000,000đ
- Thanh toán: Chuyển khoản
- Dịch vụ: Thuê xe có tài xế (2,000,000đ)

#### 5. **HYUNDAI ACCENT 2023** - 🔴 Đã hủy
- Mã: BK1733740400005
- Thời gian: 20/09/2025 - 22/09/2025 (2 ngày)
- Địa điểm: Quận Bình Thạnh, TP Hồ Chí Minh
- Tổng tiền: 1,200,000đ
- Thanh toán: QR Code

#### 6. **KIA MORNING 2024** - ✅ Hoàn thành
- Mã: BK1733740300006
- Thời gian: 15/09/2025 - 20/09/2025 (5 ngày)
- Địa điểm: Quận Gò Vấp, TP Hồ Chí Minh
- Tổng tiền: 2,500,000đ
- Thanh toán: Chuyển khoản

#### 7. **FORD RANGER 2023** - ✅ Hoàn thành (Có tài xế)
- Mã: BK1733740200007
- Thời gian: 05/09/2025 - 10/09/2025 (5 ngày)
- Địa điểm: Quận Tân Bình, TP Hồ Chí Minh
- Tổng tiền: 4,500,000đ
- Thanh toán: QR Code
- Dịch vụ: Thuê xe có tài xế (1,000,000đ)

#### 8. **VINFAST LUX A2.0** - ✅ Hoàn thành
- Mã: BK1733740100008
- Thời gian: 25/08/2025 - 30/08/2025 (5 ngày)
- Địa điểm: Quận 2, TP Hồ Chí Minh
- Tổng tiền: 5,500,000đ
- Thanh toán: Chuyển khoản

---

## Cách test từng tính năng

### 1. Xem tất cả đơn hàng
```
Truy cập: http://localhost:8080/history
Kết quả: Hiển thị 8+ đơn hàng với đầy đủ thông tin
```

### 2. Tìm kiếm
```
- Nhập "MAZDA" → Tìm thấy đơn MAZDA 2 2024
- Nhập "BK17337" → Tìm thấy tất cả đơn có mã bắt đầu bằng BK17337
- Nhập "Quận 1" → Tìm thấy đơn ở Quận 1
```

### 3. Lọc theo trạng thái
```
- Click "Chờ xác nhận" → Hiển thị 1 đơn (HONDA CITY)
- Click "Đã xác nhận" → Hiển thị 1 đơn (TOYOTA VIOS)
- Click "Hoàn thành" → Hiển thị 5 đơn
- Click "Tất cả" → Hiển thị tất cả
```

### 4. Xem chi tiết đơn hàng
```
- Click "Xem chi tiết" trên bất kỳ đơn nào
- Hoặc truy cập trực tiếp: http://localhost:8080/order/BK1733740800001
- Kết quả: Hiển thị đầy đủ thông tin chi tiết
```

### 5. Test các trạng thái khác nhau
```
Completed: /order/BK1733740800001 (MAZDA 2)
Confirmed: /order/BK1733740700002 (TOYOTA VIOS)
Pending: /order/BK1733740600003 (HONDA CITY)
Cancelled: /order/BK1733740400005 (HYUNDAI ACCENT)
```

### 6. Test đơn hàng có tài xế
```
/order/BK1733740500004 (MERCEDES - có tài xế)
/order/BK1733740200007 (FORD RANGER - có tài xế)
```

---

## Kết hợp với đơn hàng thật

Khi bạn đặt xe từ trang CarIn4.tsx:

1. ✅ Đơn mới được thêm vào đầu danh sách
2. ✅ Mock data vẫn được giữ lại
3. ✅ Không có đơn trùng lặp (kiểm tra theo bookingId)
4. ✅ Tất cả đều hiển thị trong `/history`
5. ✅ Tất cả đều có thể xem chi tiết trong `/order/:id`

---

## Clear Mock Data (nếu cần)

Nếu bạn muốn xóa tất cả mock data và bắt đầu lại:

```javascript
// Mở Console (F12) và chạy:
localStorage.removeItem('bookingOrders');
// Sau đó reload trang
location.reload();
```

Mock data sẽ được tự động load lại khi bạn truy cập `/history`

---

## Responsive Design Test

### Desktop (>1024px)
- Grid 3 cột cho card list
- Sidebar chi tiết bên phải
- Full layout với tất cả thông tin

### Tablet (768px - 1024px)
- Grid 2 cột cho card list
- Sidebar vẫn hiển thị bên phải
- Một số phần chuyển sang stack vertical

### Mobile (<768px)
- Grid 1 cột cho card list
- Layout stack vertical
- Card thu gọn, click để xem chi tiết

---

## Screenshots mong muốn

### HistoryService (/history)
```
┌─────────────────────────────────────────┐
│ Lịch sử giao dịch                       │
│ Quản lý và theo dõi tất cả các chuyến đi│
├─────────────────────────────────────────┤
│ 🔍 [Tìm kiếm...] [Tất cả] [Chờ] [Xác nhận] │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐   │
│ │ 🚗 MAZDA 2 2024  ✅ Hoàn thành    │   │
│ │ Mã: BK1733740800001               │   │
│ │ 📅 10/10 - 15/10  📍 TP Thủ Đức  │   │
│ │ 💰 3,010,000đ    [Xem chi tiết]   │   │
│ └───────────────────────────────────┘   │
│ ┌───────────────────────────────────┐   │
│ │ 🚗 TOYOTA VIOS   🔵 Đã xác nhận   │   │
│ │ ...                               │   │
│ └───────────────────────────────────┘   │
│ ... 8 cards tổng cộng                   │
└─────────────────────────────────────────┘
```

### OrderDetail (/order/:id)
```
┌─────────────────────────────────────────────────────┐
│ ← Quay lại              Chi tiết đơn hàng    [In] [⬇] │
│ Mã đơn: BK1733740800001                              │
├─────────────────────────────────────────────────────┤
│ ✅ Hoàn thành                                        │
│ Chuyến đi đã hoàn thành thành công                   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────┬─────────────────────────┐   │
│ │ 🚗 Thông tin xe     │ 💰 Chi tiết thanh toán  │   │
│ │ [Ảnh MAZDA]         │ Đơn giá: 3,010,000đ     │   │
│ │ MAZDA 2 2024        │ Bảo hiểm: 150,000đ      │   │
│ │ 5 chỗ • Xăng        │ Phí DV: 50,000đ         │   │
│ ├─────────────────────┤ ─────────────────────   │   │
│ │ 📅 Thông tin chuyến │ Tổng: 3,010,000đ        │   │
│ │ Nhận: 10/10 09:00   │                         │   │
│ │ Trả: 15/10 18:00    │ 📊 Timeline             │   │
│ │ TP Thủ Đức          │ ✅ Đặt xe thành công    │   │
│ ├─────────────────────┤ ✅ Đã xác nhận          │   │
│ │ 👤 Người thuê       │ ✅ Hoàn thành           │   │
│ │ Nguyễn Văn A        │                         │   │
│ │ 0901234567          │ 💬 Liên hệ hỗ trợ       │   │
│ └─────────────────────┴─────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Mock data không hiển thị?
1. Clear localStorage: `localStorage.removeItem('bookingOrders')`
2. Reload trang `/history`
3. Check Console (F12) để xem lỗi

### Đơn hàng bị trùng?
- Hệ thống tự động loại bỏ đơn trùng dựa trên `bookingId`
- Mỗi đơn có mã unique

### Chi tiết đơn hàng không hiển thị?
- Đảm bảo bookingId trong URL đúng
- Check localStorage có đơn hàng đó không
- Thử truy cập: `/order/BK1733740800001`

---

## Next Steps

Sau khi xem và test xong mock data, bạn có thể:

1. ✅ Customize mock data theo nhu cầu
2. ✅ Thêm nhiều đơn hàng hơn
3. ✅ Thay đổi trạng thái để test các flow khác nhau
4. ✅ Kết nối với API backend thật
5. ✅ Thêm tính năng mới (đánh giá, chat, notification...)

---

**Enjoy testing! 🚀**
