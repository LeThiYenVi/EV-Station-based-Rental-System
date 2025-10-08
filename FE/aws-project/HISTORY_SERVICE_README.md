# Lịch Sử Giao Dịch - Hướng Dẫn Sử Dụng

## Tổng quan
Hệ thống lịch sử giao dịch cho phép người dùng xem và quản lý các đơn đặt xe của mình.

## Các trang đã tạo

### 1. **HistoryService** (`/history`)
- **Đường dẫn**: `/history`
- **Mô tả**: Hiển thị danh sách tất cả các giao dịch đặt xe
- **Tính năng**:
  - Tìm kiếm theo mã đơn, tên xe, địa điểm
  - Lọc theo trạng thái: Tất cả, Chờ xác nhận, Đã xác nhận, Hoàn thành
  - Hiển thị thông tin chi tiết mỗi đơn hàng:
    - Ảnh xe và tên xe
    - Mã đơn hàng
    - Trạng thái đơn hàng (badge màu)
    - Thời gian nhận/trả xe
    - Địa điểm
    - Phương thức thanh toán
    - Tổng tiền
  - Các hành động:
    - Xem chi tiết
    - Đặt lại (cho đơn hoàn thành)
    - Hủy đơn (cho đơn chờ xác nhận)

### 2. **OrderDetail** (`/order/:id`)
- **Đường dẫn**: `/order/:id` (ví dụ: `/order/BK1234567890`)
- **Mô tả**: Hiển thị chi tiết đầy đủ của một đơn hàng
- **Tính năng**:
  - Banner trạng thái với icon và mô tả
  - **Thông tin xe**:
    - Ảnh và tên xe
    - Thông số kỹ thuật (số chỗ, nhiên liệu, truyền động)
    - Loại thuê
  - **Thông tin chuyến đi**:
    - Thời gian nhận/trả xe chi tiết
    - Địa điểm
    - Thời gian thuê
    - Dịch vụ tài xế (nếu có)
  - **Thông tin người thuê**:
    - Họ tên
    - Số điện thoại
    - Email
    - Phương thức thanh toán
  - **Chi tiết thanh toán**:
    - Đơn giá thuê xe
    - Phí tài xế
    - Bảo hiểm
    - Phí dịch vụ
    - Giảm giá
    - Tổng cộng
    - Tiền cọc
  - **Timeline trạng thái đơn hàng**:
    - Đặt xe thành công
    - Chờ xác nhận / Đã xác nhận
    - Hoàn thành / Đã hủy
  - **Các hành động**:
    - In đơn hàng
    - Tải xuống
    - Liên hệ hỗ trợ
    - Quay lại lịch sử giao dịch

## Luồng hoạt động

### Khi đặt xe thành công (CarIn4.tsx):
1. User điền thông tin và thanh toán
2. Khi thanh toán thành công, thông tin đơn hàng được lưu vào `localStorage` với key `bookingOrders`
3. Dữ liệu được lưu bao gồm:
   ```typescript
   {
     bookingId: string          // Mã đơn duy nhất
     carName: string           // Tên xe
     carImage: string          // Ảnh xe
     renterName: string        // Tên người thuê
     phone: string             // SĐT
     email: string             // Email
     pickupDate: string        // Ngày nhận xe
     pickupTime: string        // Giờ nhận xe
     returnDate: string        // Ngày trả xe
     returnTime: string        // Giờ trả xe
     pickupLocation: string    // Địa điểm
     duration: string          // Thời gian thuê
     rentalType: string        // Loại thuê
     driverService: boolean    // Có tài xế không
     carPrice: number          // Giá xe
     driverFee: number         // Phí tài xế
     insurance: number         // Bảo hiểm
     additionalInsurance: number  // Bảo hiểm bổ sung
     serviceFee: number        // Phí dịch vụ
     deposit: number           // Cọc
     discount: number          // Giảm giá
     total: number             // Tổng
     totalDeposit: number      // Tổng cọc
     status: "pending"         // Trạng thái ban đầu
     createdAt: string         // Thời gian tạo
     paymentMethod: string     // Phương thức thanh toán
     transmission: string      // Số tự động/số sàn
     seats: number             // Số chỗ
     fuel: string              // Nhiên liệu
   }
   ```
4. Modal thành công hiển thị với 2 nút:
   - **Xem đơn hàng**: Chuyển đến `/order/{bookingId}` để xem chi tiết
   - **Đặt xe khác**: Quay về trang chủ

### Xem lịch sử giao dịch:
1. User click vào "Lịch sử giao dịch" trên Header
2. Hệ thống đọc dữ liệu từ `localStorage.getItem("bookingOrders")`
3. Hiển thị danh sách tất cả đơn hàng
4. User có thể:
   - Tìm kiếm
   - Lọc theo trạng thái
   - Click "Xem chi tiết" để xem đầy đủ thông tin

### Xem chi tiết đơn hàng:
1. Từ trang lịch sử, click "Xem chi tiết"
2. Hoặc từ modal thành công, click "Xem đơn hàng"
3. System tìm đơn hàng theo `bookingId` trong localStorage
4. Hiển thị đầy đủ thông tin chi tiết
5. User có thể in hoặc tải xuống đơn hàng

## Các trạng thái đơn hàng

- **pending** (Chờ xác nhận): 
  - Màu vàng
  - Icon: AlertCircle
  - Đơn mới được tạo, chờ chủ xe xác nhận

- **confirmed** (Đã xác nhận):
  - Màu xanh dương
  - Icon: CheckCircle2
  - Chủ xe đã xác nhận đơn hàng

- **completed** (Hoàn thành):
  - Màu xanh lá
  - Icon: CheckCircle2
  - Chuyến đi đã hoàn thành

- **cancelled** (Đã hủy):
  - Màu đỏ
  - Icon: XCircle
  - Đơn hàng đã bị hủy

## Routing đã được cập nhật

Trong `App.tsx`:
```tsx
// Lịch sử giao dịch
<Route
  path="/history"
  element={
    <Layout>
      <HistoryService />
    </Layout>
  }
/>

// Chi tiết đơn hàng
<Route
  path="/order/:id"
  element={
    <Layout>
      <OrderDetail />
    </Layout>
  }
/>
```

## Header Navigation

Link "Lịch sử giao dịch" đã được thêm vào Header:
```tsx
const links = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/news", label: "Tin tức" },
  { href: "/history", label: "Lịch sử giao dịch" },
];
```

## Test Flow

### Test đặt xe và xem lịch sử:
1. Đăng nhập với tài khoản: `admin/admin123`, `staff/staff123`, hoặc `user/user123`
2. Vào trang chi tiết xe bất kỳ (ví dụ: `/car/1`)
3. Click "Chọn thuê"
4. Nếu chưa xác thực GPLX (user), upload ảnh GPLX
5. Điền thông tin và chọn phương thức thanh toán
6. Click "Xác nhận thanh toán"
7. Sau khi thanh toán thành công:
   - Click "Xem đơn hàng" → Xem chi tiết đơn vừa tạo
   - Hoặc click "Đặt xe khác" → Quay về trang chủ
8. Vào Header, click "Lịch sử giao dịch"
9. Test các tính năng:
   - Tìm kiếm theo mã đơn
   - Lọc theo trạng thái
   - Click "Xem chi tiết" trên bất kỳ đơn nào
10. Trong trang chi tiết:
    - Test nút "In"
    - Test nút "Quay lại lịch sử giao dịch"
    - Xem timeline trạng thái

### Test với nhiều đơn hàng:
1. Đặt nhiều xe khác nhau
2. Mỗi đơn sẽ có mã `bookingId` unique (dựa trên timestamp)
3. Tất cả đơn sẽ hiển thị trong lịch sử theo thứ tự mới nhất trước

## LocalStorage Structure

```javascript
// Key: "bookingOrders"
// Value: JSON array of orders
[
  {
    bookingId: "BK1733740800000",
    carName: "MAZDA 2 2024",
    // ... other fields
  },
  {
    bookingId: "BK1733740700000",
    carName: "TOYOTA VIOS 2024",
    // ... other fields
  }
]
```

## Responsive Design

Tất cả các trang đều được thiết kế responsive:
- **Mobile**: Hiển thị dạng card xếp chồng, layout 1 cột
- **Tablet**: Layout 2 cột cho một số section
- **Desktop**: Full layout với sidebar, 3 cột grid

## Icons Used

- `Car`: Thông tin xe
- `Calendar`: Ngày tháng
- `Clock`: Giờ
- `MapPin`: Địa điểm
- `CreditCard`: Thanh toán
- `User`: Thông tin người dùng
- `Phone`: Số điện thoại
- `Mail`: Email
- `FileText`: Hóa đơn
- `CheckCircle2`: Thành công
- `AlertCircle`: Cảnh báo
- `XCircle`: Hủy/Lỗi
- `Eye`: Xem
- `Search`: Tìm kiếm
- `Printer`: In
- `Download`: Tải xuống
- `MessageSquare`: Hỗ trợ

## Future Enhancements

- [ ] Kết nối API backend thật
- [ ] Thêm phân trang cho danh sách lịch sử
- [ ] Thêm chức năng đánh giá sau khi hoàn thành
- [ ] Thêm chat với chủ xe
- [ ] Thêm thông báo realtime khi trạng thái thay đổi
- [ ] Export PDF cho đơn hàng
- [ ] Thêm bộ lọc nâng cao (theo ngày, theo giá, theo xe)
- [ ] Thống kê chi tiêu
