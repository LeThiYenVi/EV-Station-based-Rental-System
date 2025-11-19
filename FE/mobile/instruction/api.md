# API Documentation

This document lists all the APIs for the EV Station-based Rental System.

All responses are wrapped in `ApiResponse<T>`, which has:
- `statusCode`: HTTP status code
- `message`: Response message
- `data`: The actual data (of type T)
- `responseAt`: Timestamp

## Authentication

Most endpoints require authentication via Bearer token in Authorization header, or specific roles.

Roles: RENTER, STAFF, ADMIN

## Controllers

### AuthController
Base path: `/api/auth`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| POST | /register | RegisterRequest: {email, fullName, phone, password, confirmPassword, role} | ApiResponse<AuthResponse> | No | Register a new user |
| POST | /login | LoginRequest: {email, password} | ApiResponse<AuthResponse> | No | Login user, sets refresh_token cookie |
| GET | /callback | Query params: code, state | ApiResponse<AuthResponse> | No | Google OAuth callback, sets refresh_token cookie |
| POST | /forgot-password | ForgotUserPasswordRequest: {email} | ApiResponse<Void> | No | Forgot password |
| POST | /reset-password | ResetUserPasswordRequest: {email, code, newPassword} | ApiResponse<Void> | No | Reset password |
| POST | /change-password | ChangeUserPasswordRequest: {oldPassword, newPassword} | ApiResponse<Void> | Yes | Change password |
| POST | /refresh | Cookie: refresh_token | ApiResponse<AuthResponse> | No | Refresh access token, sets refresh_token cookie |
| POST | /logout | Body: token (string) | ApiResponse<Void> | No | Logout |
| POST | /url | None | ApiResponse<Map<String, String>> | No | Get Google OAuth URL |
| POST | /confirm | VerifyAccountRequest: {email, code} | ApiResponse<Void> | No | Confirm account |

### BookingController
Base path: `/api/bookings`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| POST | / | CreateBookingRequest: {vehicleId, stationId, startTime, expectedEndTime, pickupNote} | ApiResponse<BookingWithPaymentResponse> | RENTER | Create booking |
| GET | /{bookingId} | None | ApiResponse<BookingDetailResponse> | RENTER, STAFF, ADMIN | Get booking by ID |
| GET | /code/{bookingCode} | None | ApiResponse<BookingDetailResponse> | RENTER, STAFF, ADMIN | Get booking by code |
| GET | / | Query params: page, size, sortBy, sortDirection | ApiResponse<Page<BookingResponse>> | STAFF, ADMIN | Get all bookings |
| GET | /my-bookings | None | ApiResponse<List<BookingResponse>> | RENTER | Get my bookings |
| GET | /status/{status} | None | ApiResponse<List<BookingResponse>> | STAFF, ADMIN | Get bookings by status |
| GET | /vehicle/{vehicleId} | None | ApiResponse<List<BookingResponse>> | STAFF, ADMIN | Get bookings by vehicle |
| GET | /station/{stationId} | None | ApiResponse<List<BookingResponse>> | STAFF, ADMIN | Get bookings by station |
| PUT | /{bookingId} | UpdateBookingRequest | ApiResponse<BookingResponse> | STAFF, ADMIN | Update booking |
| PATCH | /{bookingId}/confirm | None | ApiResponse<BookingResponse> | STAFF, ADMIN | Confirm booking |
| PATCH | /{bookingId}/start | None | ApiResponse<BookingResponse> | STAFF, ADMIN | Start booking |
| PATCH | /{bookingId}/complete | None | ApiResponse<BookingResponse> | STAFF, ADMIN | Complete booking |
| PATCH | /{bookingId}/cancel | None | ApiResponse<BookingResponse> | RENTER, STAFF, ADMIN | Cancel booking |
| DELETE | /{bookingId} | None | ApiResponse<Void> | ADMIN | Delete booking |

### LocationSearchController
Base path: `/api/locations`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| GET | /stations/nearby | NearbyStationSearchRequest: {latitude, longitude, radiusKm} | ApiResponse<NearbyStationsPageResponse> | No | Find nearby stations |

### PaymentController
Base path: `/api/payments`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| POST | /momo/callback | MoMoCallbackRequest | ApiResponse<Void> | No | MoMo payment callback |
| GET | /{paymentId} | None | ApiResponse<PaymentResponse> | RENTER, ADMIN, STAFF | Get payment by ID |
| GET | /booking/{bookingId} | None | ApiResponse<List<PaymentResponse>> | RENTER, ADMIN, STAFF | Get payments by booking |
| GET | /transaction/{transactionId} | None | ApiResponse<PaymentResponse> | RENTER, ADMIN, STAFF | Get payment by transaction ID |

### StationController
Base path: `/api/stations`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| POST | / | CreateStationRequest | ApiResponse<StationResponse> | ADMIN | Create station |
| PUT | /{stationId} | UpdateStationRequest | ApiResponse<StationResponse> | ADMIN | Update station |
| GET | /{stationId} | None | ApiResponse<StationDetailResponse> | No | Get station by ID |
| GET | / | Query params: page, size, sortBy, sortDirection | ApiResponse<Page<StationResponse>> | No | Get all stations |
| GET | /active | None | ApiResponse<List<StationResponse>> | No | Get active stations |
| GET | /status/{status} | None | ApiResponse<List<StationResponse>> | No | Get stations by status |
| DELETE | /{stationId} | None | ApiResponse<Void> | ADMIN | Delete station |
| PATCH | /{stationId}/status | Query param: status | ApiResponse<StationResponse> | ADMIN | Change station status |
| GET | /{stationId}/vehicles/available/count | None | ApiResponse<Map<String, Integer>> | No | Get available vehicles count |
| POST | /{stationId}/photo | MultipartFile file | ApiResponse<StationResponse> | ADMIN, STAFF | Upload station photo |

### UserController
Base path: `/api/users`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| GET | /me | Header: Authorization | ApiResponse<UserResponse> | RENTER, STAFF, ADMIN | Get my info |
| GET | / | Query params: page, size, sortBy, sortDirection | ApiResponse<Page<UserResponse>> | ADMIN | Get all users |
| GET | /{userId} | None | ApiResponse<UserResponse> | ADMIN, STAFF | Get user by ID |
| GET | /role/{role} | None | ApiResponse<List<UserResponse>> | ADMIN | Get users by role |
| PUT | /{userId} | UpdateUserRequest | ApiResponse<UserResponse> | ADMIN, STAFF | Update user |
| PATCH | /{userId}/role | UpdateUserRoleRequest: {role} | ApiResponse<UserResponse> | ADMIN | Update user role |
| PATCH | /{userId}/verify-license | None | ApiResponse<UserResponse> | ADMIN, STAFF | Verify user license |
| POST | /{userId}/avatar | MultipartFile file | ApiResponse<UserResponse> | ADMIN, STAFF, RENTER | Upload avatar |
| POST | /{userId}/license-card | MultipartFile file | ApiResponse<UserResponse> | ADMIN, STAFF, RENTER | Upload license card |
| DELETE | /{userId} | None | ApiResponse<Void> | ADMIN | Delete user |

### VehicleController
Base path: `/api/vehicles`

| Method | Path | Request Body | Response | Auth Required | Description |
|--------|------|--------------|----------|---------------|-------------|
| POST | / | CreateVehicleRequest | ApiResponse<VehicleResponse> | ADMIN, STAFF | Create vehicle |
| PUT | /{vehicleId} | UpdateVehicleRequest | ApiResponse<VehicleResponse> | ADMIN, STAFF | Update vehicle |
| GET | /{vehicleId} | None | ApiResponse<VehicleDetailResponse> | No | Get vehicle by ID |
| GET | / | Query params: page, size, sortBy, sortDirection | ApiResponse<Page<VehicleResponse>> | No | Get all vehicles |
| GET | /station/{stationId} | None | ApiResponse<List<VehicleResponse>> | No | Get vehicles by station |
| GET | /available | Query params: stationId, fuelType?, brand? | ApiResponse<List<VehicleResponse>> | No | Get available vehicles |
| GET | /available/booking | Query params: stationId, fuelType?, startTime, endTime | ApiResponse<List<VehicleResponse>> | No | Get truly available vehicles for booking |
| GET | /status/{status} | None | ApiResponse<List<VehicleResponse>> | No | Get vehicles by status |
| GET | /brand/{brand} | None | ApiResponse<List<VehicleResponse>> | No | Get vehicles by brand |
| DELETE | /{vehicleId} | None | ApiResponse<Void> | ADMIN | Delete vehicle |
| PATCH | /{vehicleId}/status | Query param: status | ApiResponse<VehicleResponse> | ADMIN, STAFF | Change vehicle status |
| PATCH | /{vehicleId}/rent-count | None | ApiResponse<VehicleResponse> | ADMIN, STAFF | Increment rent count |
| POST | /{vehicleId}/photos | MultipartFile[] files | ApiResponse<VehicleResponse> | ADMIN, STAFF | Upload vehicle photos |

## Detailed Request/Response DTOs

### AuthController DTOs

#### RegisterRequest
- `email`: string (required, valid email)
- `fullName`: string (required)
- `phone`: string (required)
- `password`: string (8-20 characters)
- `confirmPassword`: string (8-20 characters)
- `role`: string (default "RENTER")

#### LoginRequest
- `email`: string (required, valid email)
- `password`: string (required)

#### AuthResponse
- `accessToken`: string
- `refreshToken`: string
- `idToken`: string
- `tokenType`: string
- `expiresIn`: integer
- `user`: UserResponse

#### ForgotUserPasswordRequest
- `email`: string (required)

#### ResetUserPasswordRequest
- `email`: string (required)
- `code`: string (required)
- `newPassword`: string (required)

#### ChangeUserPasswordRequest
- `oldPassword`: string (required)
- `newPassword`: string (required)

#### VerifyAccountRequest
- `email`: string (required)
- `code`: string (required)

### BookingController DTOs

#### CreateBookingRequest
- `vehicleId`: UUID (required)
- `stationId`: UUID (required)
- `startTime`: LocalDateTime (required, future)
- `expectedEndTime`: LocalDateTime (required, future)
- `pickupNote`: string (optional)

#### BookingWithPaymentResponse
- `id`: UUID
- `bookingCode`: string
- `renterId`: UUID
- `renterName`: string
- `renterEmail`: string
- `vehicleId`: UUID
- `vehicleName`: string
- `licensePlate`: string
- `stationId`: UUID
- `stationName`: string
- `startTime`: LocalDateTime
- `expectedEndTime`: LocalDateTime
- `status`: string
- `basePrice`: BigDecimal
- `depositPaid`: BigDecimal
- `totalAmount`: BigDecimal
- `pickupNote`: string
- `paymentStatus`: string
- `momoPayment`: MoMoPaymentResponse
- `createdAt`: LocalDateTime

#### BookingDetailResponse
- `id`: UUID
- `bookingCode`: string
- `renter`: UserResponse
- `vehicle`: VehicleDetailResponse
- `station`: StationResponse
- `startTime`: LocalDateTime
- `expectedEndTime`: LocalDateTime
- `actualEndTime`: LocalDateTime
- `status`: string
- `checkedOutBy`: UserResponse
- `checkedInBy`: UserResponse
- `basePrice`: BigDecimal
- `depositPaid`: BigDecimal
- `extraFee`: BigDecimal
- `totalAmount`: BigDecimal
- `pickupNote`: string
- `returnNote`: string
- `paymentStatus`: string
- `durationHours`: Long
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### BookingResponse
- `id`: UUID
- `bookingCode`: string
- `renterId`: UUID
- `renterName`: string
- `renterEmail`: string
- `vehicleId`: UUID
- `vehicleName`: string
- `licensePlate`: string
- `stationId`: UUID
- `stationName`: string
- `startTime`: LocalDateTime
- `expectedEndTime`: LocalDateTime
- `actualEndTime`: LocalDateTime
- `status`: string
- `checkedOutById`: UUID
- `checkedOutByName`: string
- `checkedInById`: UUID
- `checkedInByName`: string
- `basePrice`: BigDecimal
- `depositPaid`: BigDecimal
- `extraFee`: BigDecimal
- `totalAmount`: BigDecimal
- `pickupNote`: string
- `returnNote`: string
- `paymentStatus`: string
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### UpdateBookingRequest
- Fields similar to CreateBookingRequest, all optional

### LocationSearchController DTOs

#### NearbyStationSearchRequest
- `latitude`: BigDecimal (required, -90 to 90)
- `longitude`: BigDecimal (required, -180 to 180)
- `radiusKm`: integer (1-100, default 10)
- `limit`: integer (1-50, default 10)
- `minRating`: double (optional)
- `fuelType`: string (optional)
- `brand`: string (optional)
- `startTime`: LocalDateTime (optional)
- `endTime`: LocalDateTime (optional)

#### NearbyStationsPageResponse
- `stations`: List<NearbyStationResponse>
- `userLocation`: UserLocation
- `metadata`: SearchMetadata

#### NearbyStationResponse
- `id`: UUID
- `name`: string
- `address`: string
- `rating`: double
- `latitude`: BigDecimal
- `longitude`: BigDecimal
- `hotline`: string
- `status`: string
- `photo`: string
- `distanceKm`: double
- `startTime`: LocalDateTime
- `endTime`: LocalDateTime
- `availableVehiclesCount`: integer
- `availableVehicles`: List<AvailableVehicleSummary>

#### AvailableVehicleSummary
- `id`: UUID
- `name`: string
- `brand`: string
- `licensePlate`: string
- `fuelType`: string
- `rating`: double
- `capacity`: integer
- `hourlyRate`: BigDecimal
- `rentCount`: integer
- `dailyRate`: BigDecimal
- `photos`: string[]
- `depositAmount`: BigDecimal

#### UserLocation
- `latitude`: BigDecimal
- `longitude`: BigDecimal

#### SearchMetadata
- `totalResults`: integer
- `radiusKm`: integer
- `returnedCount`: integer
- `searchTime`: LocalDateTime

### PaymentController DTOs

#### MoMoCallbackRequest
- `partnerCode`: string
- `orderId`: string
- `requestId`: string
- `amount`: long
- `orderInfo`: string
- `orderType`: string
- `transId`: long
- `resultCode`: string
- `message`: string
- `payType`: string
- `responseTime`: long
- `extraData`: string
- `signature`: string

#### PaymentResponse
- `id`: UUID
- `bookingId`: UUID
- `amount`: BigDecimal
- `paymentMethod`: string
- `status`: string
- `transactionId`: string
- `paidAt`: LocalDateTime
- `createdAt`: LocalDateTime

#### MoMoPaymentResponse
- `partnerCode`: string
- `orderId`: string
- `requestId`: string
- `amount`: long
- `responseTime`: long
- `message`: string
- `resultCode`: string
- `payUrl`: string
- `deeplink`: string
- `qrCodeUrl`: string

### StationController DTOs

#### CreateStationRequest
- `name`: string (required, 3-200 chars)
- `address`: string (required, max 500 chars)
- `latitude`: BigDecimal (required, -90 to 90)
- `longitude`: BigDecimal (required, -180 to 180)
- `hotline`: string (optional, phone format)
- `photo`: string (optional)
- `startTime`: LocalDateTime (required)
- `endTime`: LocalDateTime (required)

#### UpdateStationRequest
- `name`: string (3-200 chars)
- `address`: string (max 500 chars)
- `latitude`: BigDecimal (-90 to 90)
- `longitude`: BigDecimal (-180 to 180)
- `hotline`: string (phone format)
- `photo`: string
- `status`: StationStatus
- `startTime`: LocalDateTime
- `endTime`: LocalDateTime
- `rating`: double (0-5)

#### StationResponse
- `id`: UUID
- `name`: string
- `address`: string
- `rating`: double
- `latitude`: BigDecimal
- `longitude`: BigDecimal
- `hotline`: string
- `status`: StationStatus
- `photo`: string
- `startTime`: LocalDateTime
- `endTime`: LocalDateTime
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### StationDetailResponse
- `id`: UUID
- `name`: string
- `address`: string
- `rating`: double
- `latitude`: BigDecimal
- `longitude`: BigDecimal
- `hotline`: string
- `status`: StationStatus
- `photo`: string
- `startTime`: LocalDateTime
- `endTime`: LocalDateTime
- `totalVehicles`: integer
- `availableVehicles`: integer
- `vehicles`: List<VehicleResponse>
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

### UserController DTOs

#### UserResponse
- `id`: UUID
- `email`: string
- `fullName`: string
- `phone`: string
- `cognitoSub`: string
- `avatarUrl`: string
- `role`: string
- `licenseNumber`: string
- `identityNumber`: string
- `licenseCardImageUrl`: string
- `isLicenseVerified`: boolean
- `verifiedAt`: LocalDateTime
- `stationId`: UUID
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### UpdateUserRequest
- `fullName`: string (3-255 chars)
- `phone`: string (10-15 digits)
- `licenseNumber`: string (5-50 chars)
- `identityNumber`: string (9-20 chars)
- `stationId`: UUID

#### UpdateUserRoleRequest
- `role`: string (required)

### VehicleController DTOs

#### CreateVehicleRequest
- `stationId`: UUID (required)
- `licensePlate`: string (required, 5-20 chars)
- `name`: string (required, 3-255 chars)
- `brand`: string (required, max 100 chars)
- `color`: string
- `fuelType`: FuelType (required)
- `capacity`: integer (required, min 1)
- `photos`: string[] (optional)
- `hourlyRate`: BigDecimal (required, >=0)
- `dailyRate`: BigDecimal (required, >=0)
- `depositAmount`: BigDecimal (required, >=0)

#### UpdateVehicleRequest
- `stationId`: UUID (optional)
- `licensePlate`: string (5-20 chars)
- `name`: string (3-255 chars)
- `brand`: string (max 100 chars)
- `color`: string
- `fuelType`: FuelType
- `capacity`: integer (min 1)
- `photos`: string[]
- `status`: VehicleStatus
- `hourlyRate`: BigDecimal (>=0)
- `dailyRate`: BigDecimal (>=0)
- `depositAmount`: BigDecimal (>=0)
- `rating`: double (0-5)

#### VehicleResponse
- `id`: UUID
- `stationId`: UUID
- `licensePlate`: string
- `name`: string
- `brand`: string
- `color`: string
- `fuelType`: string
- `rating`: BigDecimal
- `capacity`: integer
- `rentCount`: integer
- `photos`: string[]
- `status`: string
- `hourlyRate`: BigDecimal
- `dailyRate`: BigDecimal
- `depositAmount`: BigDecimal
- `polices`: string[]
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### VehicleDetailResponse
- `id`: UUID
- `stationId`: UUID
- `stationName`: string
- `licensePlate`: string
- `name`: string
- `brand`: string
- `color`: string
- `fuelType`: string
- `rating`: BigDecimal
- `capacity`: integer
- `rentCount`: integer
- `photos`: string[]
- `status`: string
- `hourlyRate`: BigDecimal
- `dailyRate`: BigDecimal
- `depositAmount`: BigDecimal
- `isAvailable`: boolean
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

## Request/Response DTOs

For detailed field descriptions, refer to the Java classes in `domain/dto/request/` and `domain/dto/response/`.

Key enums:
- UserRole: RENTER, STAFF, ADMIN
- BookingStatus: PENDING, CONFIRMED, STARTED, COMPLETED, CANCELLED
- PaymentStatus: PENDING, COMPLETED, FAILED, REFUNDED
- StationStatus: ACTIVE, INACTIVE, MAINTENANCE
- VehicleStatus: AVAILABLE, RENTED, MAINTENANCE, OUT_OF_SERVICE
- FuelType: ELECTRIC, GASOLINE, DIESEL, HYBRID
- PaymentMethod: CASH, CARD, MOMO
