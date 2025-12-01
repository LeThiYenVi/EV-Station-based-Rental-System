# EV Rental System API Documentation

This document provides a comprehensive list of all API endpoints for the EV Rental System backend. All responses are wrapped in an `ApiResponse<T>` object with the following structure:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { /* Response data */ },
  "responseAt": "2025-11-26T12:00:00"
}
```

## Authentication Endpoints

### 1. Register User
- **Method**: POST
- **URL**: `/api/auth/register`
- **Authorization**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email)",
    "fullName": "string (required)",
    "phone": "string (required)",
    "address": "string (optional)",
    "password": "string (8-20 characters)",
    "confirmPassword": "string (8-20 characters)",
    "role": "string (default: RENTER)"
  }
  ```
- **Response**: `ApiResponse<AuthResponse>`
  - `AuthResponse`: Contains accessToken, refreshToken, idToken, tokenType, expiresIn, user (UserResponse)

### 2. Login User
- **Method**: POST
- **URL**: `/api/auth/login`
- **Authorization**: None
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: `ApiResponse<AuthResponse>` (sets refresh_token cookie)
- **Cookies**: Sets `refresh_token` cookie

### 3. Google OAuth Callback
- **Method**: GET
- **URL**: `/api/auth/callback`
- **Authorization**: None
- **Query Parameters**:
  - `code`: string
  - `state`: string
- **Response**: `ApiResponse<AuthResponse>` (sets refresh_token cookie)

### 4. Forgot Password
- **Method**: POST
- **URL**: `/api/auth/forgot-password`
- **Authorization**: None
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**: `ApiResponse<Void>`

### 5. Reset Password
- **Method**: POST
- **URL**: `/api/auth/reset-password`
- **Authorization**: None
- **Request Body**:
  ```json
  {
    "email": "string",
    "confirmationCode": "string",
    "newPassword": "string"
  }
  ```
- **Response**: `ApiResponse<Void>`

### 6. Change Password
- **Method**: POST
- **URL**: `/api/auth/change-password`
- **Authorization**: Bearer token
- **Request Body**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**: `ApiResponse<Void>`

### 7. Refresh Token
- **Method**: POST
- **URL**: `/api/auth/refresh`
- **Authorization**: None
- **Cookies**: `refresh_token`
- **Response**: `ApiResponse<AuthResponse>` (updates refresh_token cookie)

### 8. Logout
- **Method**: POST
- **URL**: `/api/auth/logout`
- **Authorization**: Bearer token
- **Request Body**: `"string"` (token)
- **Response**: `ApiResponse<Void>`

### 9. Get Authorization URL
- **Method**: POST
- **URL**: `/api/auth/url`
- **Authorization**: None
- **Response**: `ApiResponse<Map<String, String>>`
  - Data: `{"authorizationUrl": "string", "state": "string"}`

### 10. Confirm Account
- **Method**: POST
- **URL**: `/api/auth/confirm`
- **Authorization**: None
- **Request Body**:
  ```json
  {
    "email": "string",
    "confirmationCode": "string"
  }
  ```
- **Response**: `ApiResponse<Void>`

## Booking Endpoints

### 1. Create Booking
- **Method**: POST
- **URL**: `/api/bookings`
- **Authorization**: RENTER role
- **Request Body**: `CreateBookingRequest`
  - Fields: vehicleId, startTime, endTime, bookingType, etc.
- **Response**: `ApiResponse<BookingWithPaymentResponse>`

### 2. Get Booking by ID
- **Method**: GET
- **URL**: `/api/bookings/{bookingId}`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<BookingDetailResponse>`

### 3. Get Booking by Code
- **Method**: GET
- **URL**: `/api/bookings/code/{bookingCode}`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `bookingCode` (string)
- **Response**: `ApiResponse<BookingDetailResponse>`

### 4. Get All Bookings (Paginated)
- **Method**: GET
- **URL**: `/api/bookings`
- **Authorization**: STAFF or ADMIN
- **Query Parameters**:
  - `page`: int (default 0)
  - `size`: int (default 10)
  - `sortBy`: string (default "createdAt")
  - `sortDirection`: string (default "DESC")
- **Response**: `ApiResponse<Page<BookingResponse>>`

### 5. Get My Bookings
- **Method**: GET
- **URL**: `/api/bookings/my-bookings`
- **Authorization**: RENTER
- **Response**: `ApiResponse<List<BookingResponse>>`

### 6. Get Bookings by Status
- **Method**: GET
- **URL**: `/api/bookings/status/{status}`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `status` (BookingStatus enum)
- **Response**: `ApiResponse<List<BookingResponse>>`

### 7. Get Bookings by Vehicle ID
- **Method**: GET
- **URL**: `/api/bookings/vehicle/{vehicleId}`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `vehicleId` (UUID)
- **Response**: `ApiResponse<List<BookingResponse>>`

### 8. Get Bookings by Station ID
- **Method**: GET
- **URL**: `/api/bookings/station/{stationId}`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<List<BookingResponse>>`

### 9. Update Booking
- **Method**: PUT
- **URL**: `/api/bookings/{bookingId}`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Request Body**: `UpdateBookingRequest`
- **Response**: `ApiResponse<BookingResponse>`

### 10. Confirm Booking
- **Method**: PATCH
- **URL**: `/api/bookings/{bookingId}/confirm`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<BookingResponse>`

### 11. Start Booking
- **Method**: PATCH
- **URL**: `/api/bookings/{bookingId}/start`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<BookingResponse>`

### 12. Complete Booking
- **Method**: PATCH
- **URL**: `/api/bookings/{bookingId}/complete`
- **Authorization**: STAFF or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<BookingResponse>`

### 13. Cancel Booking
- **Method**: PATCH
- **URL**: `/api/bookings/{bookingId}/cancel`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<BookingResponse>`

### 14. Delete Booking
- **Method**: DELETE
- **URL**: `/api/bookings/{bookingId}`
- **Authorization**: ADMIN
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<Void>`

## Fleet Management Endpoints

### 1. Get Vehicles at Station
- **Method**: GET
- **URL**: `/api/admin/fleet/stations/{stationId}/vehicles`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 2. Get Vehicle Status Summary
- **Method**: GET
- **URL**: `/api/admin/fleet/stations/{stationId}/summary`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<VehicleStatusSummary>`

### 3. Get Vehicle History
- **Method**: GET
- **URL**: `/api/admin/fleet/vehicles/{vehicleId}/history`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `vehicleId` (UUID)
- **Response**: `ApiResponse<List<VehicleHistoryItemResponse>>`

### 4. Get Dispatchable Vehicles
- **Method**: GET
- **URL**: `/api/admin/fleet/stations/{stationId}/dispatchable`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `stationId` (UUID)
- **Query Parameters**:
  - `start`: LocalDateTime
  - `end`: LocalDateTime
- **Response**: `ApiResponse<List<VehicleResponse>>`

## Location Search Endpoints

### 1. Find Nearby Stations
- **Method**: GET
- **URL**: `/api/locations/stations/nearby`
- **Authorization**: None
- **Request Body**: `NearbyStationSearchRequest`
  - Fields: latitude, longitude, radius, etc.
- **Response**: `ApiResponse<NearbyStationsPageResponse>`

## Payment Endpoints

### 1. Handle MoMo Callback
- **Method**: POST
- **URL**: `/api/payments/momo/callback`
- **Authorization**: None
- **Request Body**: `MoMoCallbackRequest`
- **Response**: `ApiResponse<Void>`

### 2. Get Payment by ID
- **Method**: GET
- **URL**: `/api/payments/{paymentId}`
- **Authorization**: RENTER, ADMIN, or STAFF
- **Path Parameters**: `paymentId` (UUID)
- **Response**: `ApiResponse<PaymentResponse>`

### 3. Get Payments by Booking ID
- **Method**: GET
- **URL**: `/api/payments/booking/{bookingId}`
- **Authorization**: RENTER, ADMIN, or STAFF
- **Path Parameters**: `bookingId` (UUID)
- **Response**: `ApiResponse<List<PaymentResponse>>`

### 4. Get Payment by Transaction ID
- **Method**: GET
- **URL**: `/api/payments/transaction/{transactionId}`
- **Authorization**: RENTER, ADMIN, or STAFF
- **Path Parameters**: `transactionId` (string)
- **Response**: `ApiResponse<PaymentResponse>`

### 5. Payment Result
- **Method**: GET
- **URL**: `/api/payments/result`
- **Authorization**: None
- **Response**: String ("Payment successful!")

## Report Endpoints

### 1. Revenue by Station
- **Method**: GET
- **URL**: `/api/admin/reports/revenue-by-station`
- **Authorization**: ADMIN
- **Query Parameters**:
  - `start`: LocalDateTime
  - `end`: LocalDateTime
  - `stationId`: UUID (optional)
- **Response**: `ApiResponse<List<RevenueByStationResponse>>`

### 2. Utilization Report
- **Method**: GET
- **URL**: `/api/admin/reports/utilization`
- **Authorization**: ADMIN
- **Query Parameters**:
  - `start`: LocalDateTime
  - `end`: LocalDateTime
  - `stationId`: UUID (optional)
- **Response**: `ApiResponse<List<UtilizationResponse>>`

### 3. Peak Hours Report
- **Method**: GET
- **URL**: `/api/admin/reports/peak-hours`
- **Authorization**: ADMIN
- **Query Parameters**:
  - `start`: LocalDateTime
  - `end`: LocalDateTime
  - `stationId`: UUID (optional)
- **Response**: `ApiResponse<List<PeakHourResponse>>`

### 4. Staff Performance Report
- **Method**: GET
- **URL**: `/api/admin/reports/staff-performance`
- **Authorization**: ADMIN
- **Query Parameters**:
  - `start`: LocalDateTime
  - `end`: LocalDateTime
  - `stationId`: UUID (optional)
- **Response**: `ApiResponse<List<StaffPerformanceResponse>>`

### 5. Customer Risk Report
- **Method**: GET
- **URL**: `/api/admin/reports/customer-risk`
- **Authorization**: ADMIN or STAFF
- **Query Parameters**:
  - `minBookings`: int (default 3)
- **Response**: `ApiResponse<List<CustomerRiskResponse>>`

## Staff Management Endpoints

### 1. Get Staff by Station
- **Method**: GET
- **URL**: `/api/admin/staff`
- **Authorization**: ADMIN or MANAGER
- **Query Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<List<UserResponse>>`

## Station Endpoints

### 1. Create Station
- **Method**: POST
- **URL**: `/api/stations`
- **Authorization**: ADMIN
- **Request Body**: `CreateStationRequest`
- **Response**: `ApiResponse<StationResponse>`

### 2. Update Station
- **Method**: PUT
- **URL**: `/api/stations/{stationId}`
- **Authorization**: ADMIN
- **Path Parameters**: `stationId` (UUID)
- **Request Body**: `UpdateStationRequest`
- **Response**: `ApiResponse<StationResponse>`

### 3. Get Station by ID
- **Method**: GET
- **URL**: `/api/stations/{stationId}`
- **Authorization**: None
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<StationDetailResponse>`

### 4. Get All Stations (Paginated)
- **Method**: GET
- **URL**: `/api/stations`
- **Authorization**: None
- **Query Parameters**:
  - `page`: int (default 0)
  - `size`: int (default 10)
  - `sortBy`: string (default "createdAt")
  - `sortDirection`: string (default "DESC")
- **Response**: `ApiResponse<Page<StationResponse>>`

### 5. Get Active Stations
- **Method**: GET
- **URL**: `/api/stations/active`
- **Authorization**: None
- **Response**: `ApiResponse<List<StationResponse>>`

### 6. Get Stations by Status
- **Method**: GET
- **URL**: `/api/stations/status/{status}`
- **Authorization**: None
- **Path Parameters**: `status` (StationStatus enum)
- **Response**: `ApiResponse<List<StationResponse>>`

### 7. Delete Station
- **Method**: DELETE
- **URL**: `/api/stations/{stationId}`
- **Authorization**: ADMIN
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<Void>`

### 8. Change Station Status
- **Method**: PATCH
- **URL**: `/api/stations/{stationId}/status`
- **Authorization**: ADMIN
- **Path Parameters**: `stationId` (UUID)
- **Query Parameters**: `status` (StationStatus)
- **Response**: `ApiResponse<StationResponse>`

### 9. Get Available Vehicles Count
- **Method**: GET
- **URL**: `/api/stations/{stationId}/vehicles/available/count`
- **Authorization**: None
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<Map<String, Integer>>` (e.g., {"availableVehicles": 5})

### 10. Upload Station Photo
- **Method**: POST
- **URL**: `/api/stations/{stationId}/photo`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `stationId` (UUID)
- **Content-Type**: multipart/form-data
- **Form Data**: `file` (MultipartFile)
- **Response**: `ApiResponse<StationResponse>`

## User Endpoints

### 1. Get My Info
- **Method**: GET
- **URL**: `/api/users/me`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `ApiResponse<UserResponse>`

### 2. Get All Users (Paginated)
- **Method**: GET
- **URL**: `/api/users`
- **Authorization**: ADMIN
- **Query Parameters**:
  - `page`: int (default 0)
  - `size`: int (default 10)
  - `sortBy`: string (default "createdAt")
  - `sortDirection`: string (default "DESC")
- **Response**: `ApiResponse<Page<UserResponse>>`

### 3. Get User by ID
- **Method**: GET
- **URL**: `/api/users/{userId}`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `userId` (UUID)
- **Response**: `ApiResponse<UserResponse>`

### 4. Get Users by Role
- **Method**: GET
- **URL**: `/api/users/role/{role}`
- **Authorization**: ADMIN
- **Path Parameters**: `role` (UserRole enum)
- **Response**: `ApiResponse<List<UserResponse>>`

### 5. Update User
- **Method**: PUT
- **URL**: `/api/users/{userId}`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `userId` (UUID)
- **Request Body**: `UpdateUserRequest`
- **Response**: `ApiResponse<UserResponse>`

### 6. Update User Role
- **Method**: PATCH
- **URL**: `/api/users/{userId}/role`
- **Authorization**: ADMIN
- **Path Parameters**: `userId` (UUID)
- **Request Body**: `UpdateUserRoleRequest` (e.g., {"role": "STAFF"})
- **Response**: `ApiResponse<UserResponse>`

### 7. Verify User License
- **Method**: PATCH
- **URL**: `/api/users/{userId}/verify-license`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `userId` (UUID)
- **Response**: `ApiResponse<UserResponse>`

### 8. Upload Avatar
- **Method**: POST
- **URL**: `/api/users/{userId}/avatar`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `userId` (UUID)
- **Content-Type**: multipart/form-data
- **Form Data**: `file` (MultipartFile)
- **Response**: `ApiResponse<UserResponse>`

### 9. Upload License Card Front
- **Method**: POST
- **URL**: `/api/users/{userId}/license-card/front`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `userId` (UUID)
- **Content-Type**: multipart/form-data
- **Form Data**: `file` (MultipartFile)
- **Response**: `ApiResponse<UserResponse>`

### 10. Upload License Card Back
- **Method**: POST
- **URL**: `/api/users/{userId}/license-card/back`
- **Authorization**: RENTER, STAFF, or ADMIN
- **Path Parameters**: `userId` (UUID)
- **Content-Type**: multipart/form-data
- **Form Data**: `file` (MultipartFile)
- **Response**: `ApiResponse<UserResponse>`

### 11. Delete User
- **Method**: DELETE
- **URL**: `/api/users/{userId}`
- **Authorization**: ADMIN
- **Path Parameters**: `userId` (UUID)
- **Response**: `ApiResponse<Void>`

## Vehicle Endpoints

### 1. Create Vehicle
- **Method**: POST
- **URL**: `/api/vehicles`
- **Authorization**: ADMIN or STAFF
- **Request Body**: `CreateVehicleRequest`
- **Response**: `ApiResponse<VehicleResponse>`

### 2. Update Vehicle
- **Method**: PUT
- **URL**: `/api/vehicles/{vehicleId}`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `vehicleId` (UUID)
- **Request Body**: `UpdateVehicleRequest`
- **Response**: `ApiResponse<VehicleResponse>`

### 3. Get Vehicle by ID
- **Method**: GET
- **URL**: `/api/vehicles/{vehicleId}`
- **Authorization**: None
- **Path Parameters**: `vehicleId` (UUID)
- **Response**: `ApiResponse<VehicleDetailResponse>`

### 4. Get All Vehicles (Paginated)
- **Method**: GET
- **URL**: `/api/vehicles`
- **Authorization**: None
- **Query Parameters**:
  - `page`: int (default 0)
  - `size`: int (default 10)
  - `sortBy`: string (default "createdAt")
  - `sortDirection`: string (default "DESC")
- **Response**: `ApiResponse<Page<VehicleResponse>>`

### 5. Get Vehicles by Station ID
- **Method**: GET
- **URL**: `/api/vehicles/station/{stationId}`
- **Authorization**: None
- **Path Parameters**: `stationId` (UUID)
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 6. Get Available Vehicles
- **Method**: GET
- **URL**: `/api/vehicles/available`
- **Authorization**: None
- **Query Parameters**:
  - `stationId`: UUID
  - `fuelType`: string (optional)
  - `brand`: string (optional)
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 7. Get Truly Available Vehicles for Booking
- **Method**: GET
- **URL**: `/api/vehicles/available/booking`
- **Authorization**: None
- **Query Parameters**:
  - `stationId`: UUID
  - `fuelType`: string (optional)
  - `startTime`: LocalDateTime
  - `endTime`: LocalDateTime
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 8. Get Vehicles by Status
- **Method**: GET
- **URL**: `/api/vehicles/status/{status}`
- **Authorization**: None
- **Path Parameters**: `status` (VehicleStatus enum)
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 9. Get Vehicles by Brand
- **Method**: GET
- **URL**: `/api/vehicles/brand/{brand}`
- **Authorization**: None
- **Path Parameters**: `brand` (string)
- **Response**: `ApiResponse<List<VehicleResponse>>`

### 10. Delete Vehicle
- **Method**: DELETE
- **URL**: `/api/vehicles/{vehicleId}`
- **Authorization**: ADMIN
- **Path Parameters**: `vehicleId` (UUID)
- **Response**: `ApiResponse<Void>`

### 11. Change Vehicle Status
- **Method**: PATCH
- **URL**: `/api/vehicles/{vehicleId}/status`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `vehicleId` (UUID)
- **Query Parameters**: `status` (VehicleStatus)
- **Response**: `ApiResponse<VehicleResponse>`

### 12. Increment Rent Count
- **Method**: PATCH
- **URL**: `/api/vehicles/{vehicleId}/rent-count`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `vehicleId` (UUID)
- **Response**: `ApiResponse<VehicleResponse>`

### 13. Upload Vehicle Photos
- **Method**: POST
- **URL**: `/api/vehicles/{vehicleId}/photos`
- **Authorization**: ADMIN or STAFF
- **Path Parameters**: `vehicleId` (UUID)
- **Content-Type**: multipart/form-data
- **Form Data**: `files` (MultipartFile[])
- **Response**: `ApiResponse<VehicleResponse>`

## Response DTO Details

### ApiResponse<T>
All API responses are wrapped in this generic structure:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { /* T data */ },
  "responseAt": "2025-11-26T12:00:00"
}
```

### AuthResponse
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "idToken": "string",
  "tokenType": "string",
  "expiresIn": 3600,
  "user": { /* UserResponse */ }
}
```

### UserResponse
```json
{
  "id": "UUID",
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "address": "string",
  "cognitoSub": "string",
  "avatarUrl": "string",
  "role": "string",
  "licenseNumber": "string",
  "identityNumber": "string",
  "licenseCardFrontImageUrl": "string",
  "licenseCardBackImageUrl": "string",
  "isLicenseVerified": "boolean",
  "verifiedAt": "LocalDateTime",
  "stationId": "UUID",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### BookingResponse
```json
{
  "id": "UUID",
  "bookingCode": "string",
  "renterId": "UUID",
  "renterName": "string",
  "renterEmail": "string",
  "vehicleId": "UUID",
  "vehicleName": "string",
  "licensePlate": "string",
  "stationId": "UUID",
  "stationName": "string",
  "startTime": "LocalDateTime",
  "expectedEndTime": "LocalDateTime",
  "actualEndTime": "LocalDateTime",
  "status": "string",
  "checkedOutById": "UUID",
  "checkedOutByName": "string",
  "checkedInById": "UUID",
  "checkedInByName": "string",
  "basePrice": "BigDecimal",
  "depositPaid": "BigDecimal",
  "extraFee": "BigDecimal",
  "totalAmount": "BigDecimal",
  "pickupNote": "string",
  "returnNote": "string",
  "paymentStatus": "string",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### BookingDetailResponse
```json
{
  "id": "UUID",
  "bookingCode": "string",
  "renter": { /* UserResponse */ },
  "vehicle": { /* VehicleDetailResponse */ },
  "station": { /* StationResponse */ },
  "startTime": "LocalDateTime",
  "expectedEndTime": "LocalDateTime",
  "actualEndTime": "LocalDateTime",
  "status": "string",
  "checkedOutBy": { /* UserResponse */ },
  "checkedInBy": { /* UserResponse */ },
  "basePrice": "BigDecimal",
  "depositPaid": "BigDecimal",
  "extraFee": "BigDecimal",
  "totalAmount": "BigDecimal",
  "pickupNote": "string",
  "returnNote": "string",
  "paymentStatus": "string",
  "durationHours": "Long",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### BookingWithPaymentResponse
```json
{
  "id": "UUID",
  "bookingCode": "string",
  "renterId": "UUID",
  "renterName": "string",
  "renterEmail": "string",
  "vehicleId": "UUID",
  "vehicleName": "string",
  "licensePlate": "string",
  "stationId": "UUID",
  "stationName": "string",
  "startTime": "LocalDateTime",
  "expectedEndTime": "LocalDateTime",
  "status": "string",
  "basePrice": "BigDecimal",
  "depositPaid": "BigDecimal",
  "totalAmount": "BigDecimal",
  "pickupNote": "string",
  "paymentStatus": "string",
  "momoPayment": { /* MoMoPaymentResponse */ },
  "createdAt": "LocalDateTime"
}
```

### MoMoPaymentResponse
```json
{
  "partnerCode": "string",
  "orderId": "string",
  "requestId": "string",
  "amount": "Long",
  "responseTime": "Long",
  "message": "string",
  "resultCode": "string",
  "payUrl": "string",
  "deeplink": "string",
  "qrCodeUrl": "string"
}
```

### VehicleResponse
```json
{
  "id": "UUID",
  "stationId": "UUID",
  "licensePlate": "string",
  "name": "string",
  "brand": "string",
  "color": "string",
  "fuelType": "string",
  "rating": "BigDecimal",
  "capacity": "Integer",
  "rentCount": "Integer",
  "photos": ["string"],
  "status": "string",
  "hourlyRate": "BigDecimal",
  "dailyRate": "BigDecimal",
  "depositAmount": "BigDecimal",
  "polices": ["string"],
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### VehicleDetailResponse
```json
{
  "id": "UUID",
  "stationId": "UUID",
  "stationName": "string",
  "licensePlate": "string",
  "name": "string",
  "brand": "string",
  "color": "string",
  "fuelType": "string",
  "rating": "BigDecimal",
  "capacity": "Integer",
  "rentCount": "Integer",
  "photos": ["string"],
  "status": "string",
  "hourlyRate": "BigDecimal",
  "dailyRate": "BigDecimal",
  "depositAmount": "BigDecimal",
  "isAvailable": "Boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### StationResponse
```json
{
  "id": "UUID",
  "name": "string",
  "address": "string",
  "rating": "Double",
  "latitude": "BigDecimal",
  "longitude": "BigDecimal",
  "hotline": "string",
  "status": "StationStatus",
  "photo": "string",
  "startTime": "LocalDateTime",
  "endTime": "LocalDateTime",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### StationDetailResponse
```json
{
  "id": "UUID",
  "name": "string",
  "address": "string",
  "rating": "Double",
  "latitude": "BigDecimal",
  "longitude": "BigDecimal",
  "hotline": "string",
  "status": "StationStatus",
  "photo": "string",
  "startTime": "LocalDateTime",
  "endTime": "LocalDateTime",
  "totalVehicles": "Integer",
  "availableVehicles": "Integer",
  "vehicles": [ /* List<VehicleResponse> */ ],
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### PaymentResponse
```json
{
  "id": "UUID",
  "bookingId": "UUID",
  "amount": "BigDecimal",
  "paymentMethod": "string",
  "status": "string",
  "transactionId": "string",
  "paidAt": "LocalDateTime",
  "createdAt": "LocalDateTime"
}
```

### VehicleHistoryItemResponse
```json
{
  "bookingId": "UUID",
  "bookingCode": "string",
  "startTime": "LocalDateTime",
  "expectedEndTime": "LocalDateTime",
  "actualEndTime": "LocalDateTime",
  "status": "string",
  "renterId": "UUID",
  "checkedOutBy": "UUID",
  "checkedInBy": "UUID"
}
```

### NearbyStationsPageResponse
```json
{
  "stations": [ /* List<NearbyStationResponse> */ ],
  "metadata": { /* PageMetadata */ }
}
```

### FleetService.VehicleStatusSummary
```json
{
  "available": "Integer",
  "rented": "Integer",
  "maintenance": "Integer",
  "total": "Integer"
}
```

### Report Responses (e.g., RevenueByStationResponse, UtilizationResponse, etc.)
- These include fields like stationId, stationName, revenue, utilizationRate, etc., depending on the report type. Refer to the specific response classes for exact fields.

## Notes
- All endpoints return responses wrapped in `ApiResponse<T>`.
- Authorization is handled via JWT Bearer tokens in the Authorization header.
- Some endpoints require specific roles as indicated.
- Pagination uses Spring Data Page format.
- DateTime fields use ISO format.
- File uploads use multipart/form-data.
