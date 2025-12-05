# Feedback API Documentation

## Overview
API endpoints cho quản lý feedback và đánh giá trong hệ thống EV Rental.

Base URL: `/api/feedbacks`

---

## RENTER ENDPOINTS

### 1. Tạo Feedback
**POST** `/api/feedbacks`
- **Authorization**: RENTER role
- **Description**: Tạo feedback cho booking đã hoàn thành
- **Request Body**:
```json
{
  "bookingId": "uuid",
  "vehicleRating": 4.5,
  "stationRating": 5.0,
  "comment": "Xe rất tốt, trạm sạch sẽ"
}
```
- **Response**: `ApiResponse<FeedbackResponse>`
- **Business Rules**:
  - Booking phải thuộc về renter
  - Booking phải ở trạng thái COMPLETED
  - Chưa tồn tại feedback cho booking này

### 2. Xem Chi Tiết Feedback
**GET** `/api/feedbacks/{feedbackId}`
- **Authorization**: RENTER, ADMIN, STAFF
- **Response**: `ApiResponse<FeedbackDetailResponse>`

### 3. Xem Feedback Theo Booking
**GET** `/api/feedbacks/booking/{bookingId}`
- **Authorization**: RENTER, ADMIN, STAFF
- **Response**: `ApiResponse<FeedbackDetailResponse>`

### 4. Cập Nhật Feedback
**PUT** `/api/feedbacks/{feedbackId}`
- **Authorization**: RENTER role
- **Description**: Chỉnh sửa feedback trong vòng 7 ngày
- **Request Body**:
```json
{
  "vehicleRating": 5.0,
  "stationRating": 4.5,
  "comment": "Cập nhật: Dịch vụ xuất sắc"
}
```
- **Response**: `ApiResponse<FeedbackResponse>`
- **Business Rules**:
  - Chỉ được sửa trong 7 ngày sau khi tạo
  - Set `isEdit = true` khi có thay đổi

### 5. Danh Sách Feedback Của Tôi
**GET** `/api/feedbacks/my-feedbacks`
- **Authorization**: RENTER role
- **Query Parameters**:
  - `page` (default: 0)
  - `size` (default: 10)
- **Response**: `ApiResponse<Page<FeedbackResponse>>`

---

## ADMIN/STAFF ENDPOINTS

### 6. Danh Sách Tất Cả Feedback (Có Filter)
**GET** `/api/feedbacks/admin/all`
- **Authorization**: ADMIN, STAFF
- **Query Parameters**:
  - `stationId` (UUID, optional)
  - `vehicleId` (UUID, optional)
  - `renterId` (UUID, optional)
  - `responded` (Boolean, optional) - true/false
  - `fromDate` (DateTime, optional)
  - `toDate` (DateTime, optional)
  - `minRating` (Double, optional)
  - `maxRating` (Double, optional)
  - `page` (default: 0)
  - `size` (default: 10)
- **Response**: `ApiResponse<Page<FeedbackResponse>>`

**Example**:
```
GET /api/feedbacks/admin/all?stationId=abc-123&responded=false&minRating=4.0&page=0&size=20
```

### 7. Trả Lời Feedback
**POST** `/api/feedbacks/{feedbackId}/respond`
- **Authorization**: ADMIN, STAFF
- **Request Body**:
```json
{
  "response": "Cảm ơn bạn đã đánh giá. Chúng tôi rất vui vì bạn hài lòng!"
}
```
- **Response**: `ApiResponse<FeedbackResponse>`
- **Notes**: Set `respondedBy`, `respondedAt` tự động

### 8. Cập Nhật Response
**PUT** `/api/feedbacks/{feedbackId}/respond`
- **Authorization**: ADMIN, STAFF
- **Request Body**:
```json
{
  "response": "Cập nhật: Chúng tôi đã cải thiện dịch vụ"
}
```
- **Response**: `ApiResponse<FeedbackResponse>`

### 9. Xóa Response
**DELETE** `/api/feedbacks/{feedbackId}/respond`
- **Authorization**: ADMIN, STAFF
- **Response**: Success message
- **Notes**: Clear response, respondedBy, respondedAt

### 10. Xóa Feedback
**DELETE** `/api/feedbacks/{feedbackId}`
- **Authorization**: ADMIN only
- **Response**: Success message

---

## PUBLIC ENDPOINTS

### 11. Tóm Tắt Feedback Xe
**GET** `/api/feedbacks/vehicle/{vehicleId}/summary`
- **Authorization**: None (Public)
- **Query Parameters**:
  - `limit` (default: 5) - Số feedback gần nhất
- **Response**: `ApiResponse<VehicleFeedbackSummaryResponse>`
```json
{
  "vehicleId": "uuid",
  "vehicleName": "VinFast VF8",
  "vehicleLicensePlate": "51A-12345",
  "averageRating": 4.5,
  "totalFeedbackCount": 120,
  "fiveStarCount": 80,
  "fourStarCount": 30,
  "threeStarCount": 8,
  "twoStarCount": 2,
  "oneStarCount": 0,
  "recentFeedbacks": [...]
}
```

### 12. Danh Sách Feedback Xe
**GET** `/api/feedbacks/vehicle/{vehicleId}`
- **Authorization**: None (Public)
- **Query Parameters**:
  - `page` (default: 0)
  - `size` (default: 10)
- **Response**: `ApiResponse<Page<FeedbackResponse>>`

### 13. Tóm Tắt Feedback Trạm
**GET** `/api/feedbacks/station/{stationId}/summary`
- **Authorization**: None (Public)
- **Query Parameters**:
  - `limit` (default: 5)
- **Response**: `ApiResponse<StationFeedbackSummaryResponse>`

### 14. Danh Sách Feedback Trạm
**GET** `/api/feedbacks/station/{stationId}`
- **Authorization**: None (Public)
- **Query Parameters**:
  - `page` (default: 0)
  - `size` (default: 10)
- **Response**: `ApiResponse<Page<FeedbackResponse>>`

---

## STATISTICS ENDPOINTS

### 15. Thống Kê Toàn Cục
**GET** `/api/feedbacks/statistics`
- **Authorization**: ADMIN, STAFF
- **Response**: `ApiResponse<FeedbackStatisticsResponse>`
```json
{
  "averageVehicleRating": 4.3,
  "averageStationRating": 4.5,
  "totalFeedbackCount": 500,
  "respondedCount": 450,
  "unrespondedCount": 50,
  "vehicleRatingDistribution": {
    "1": 10,
    "2": 20,
    "3": 50,
    "4": 150,
    "5": 270
  },
  "stationRatingDistribution": {...},
  "topRatedVehicle": {
    "id": "uuid",
    "name": "Tesla Model 3",
    "averageRating": 4.9
  },
  "topRatedStation": {
    "id": "uuid",
    "name": "Trạm Quận 1",
    "averageRating": 4.8
  },
  "feedbacksLast7Days": 45,
  "feedbacksLast30Days": 180,
  "averageResponseTimeHours": 12.5
}
```

---

## DTOs

### FeedbackResponse
```typescript
{
  id: UUID
  bookingId: UUID
  bookingCode: string
  renterId: UUID
  renterName: string
  renterEmail: string
  vehicleId: UUID
  vehicleName: string
  vehicleLicensePlate: string
  stationId: UUID
  stationName: string
  vehicleRating: number (1-5)
  stationRating: number (1-5)
  comment: string
  isEdit: boolean
  response: string | null
  respondedBy: UUID | null
  respondedByName: string | null
  respondedAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

### FeedbackDetailResponse
Bao gồm thêm:
- Booking details (startTime, endTime, totalAmount)
- Renter details (phone)
- Vehicle details (brand, photos)
- Station details (address)
- Response details (respondedByEmail)

---

## Use Cases Summary

### RENTER:
1. ✅ Tạo feedback cho booking đã hoàn thành
2. ✅ Xem feedback của mình
3. ✅ Sửa feedback (trong 7 ngày)
4. ✅ Danh sách lịch sử feedback

### ADMIN/STAFF:
1. ✅ Xem danh sách feedback (với filters)
2. ✅ Xem chi tiết feedback
3. ✅ Trả lời feedback
4. ✅ Chỉnh sửa/xóa response
5. ✅ Xóa feedback (Admin only)
6. ✅ Xem thống kê toàn cục

### PUBLIC:
1. ✅ Xem rating & feedback cho vehicle
2. ✅ Xem rating & feedback cho station
3. ✅ Tóm tắt đánh giá với phân bố sao

---

## Business Rules

1. **Tạo Feedback**:
   - Booking phải COMPLETED
   - Mỗi booking chỉ 1 feedback
   - Renter phải là người thuê

2. **Sửa Feedback**:
   - Chỉ trong 7 ngày
   - Set isEdit = true

3. **Response**:
   - Chỉ ADMIN/STAFF
   - Tự động set respondedBy & respondedAt

4. **Public Access**:
   - Vehicle/Station feedbacks: public
   - Moderation & statistics: ADMIN/STAFF only

---

## Error Codes

- `404`: Feedback/Booking not found
- `403`: Permission denied
- `400`: 
  - Booking not completed
  - Feedback already exists
  - Edit window expired (>7 days)
  - Booking doesn't belong to renter
