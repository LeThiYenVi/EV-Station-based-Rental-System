# Staff API Documentation

This document lists all API endpoints under `/api/staff` that require role STAFF (or STAFF/ADMIN) and describes request parameters, request body, and response shapes in detail so the frontend can implement UI easily.

Note: All endpoints below require a valid JWT in the `Authorization: Bearer <token>` header and the user to have role `STAFF` (or `ADMIN` where noted).

---

## Common response wrapper: `ApiResponse<T>`

Most controllers return an `ApiResponse` object. Its structure is:

- statusCode: number (HTTP-like status code)
- message: string (optional human-readable message)
- data: generic payload (T) - present when successful

Example:

{
  "statusCode": 200,
  "message": "Booking confirmed successfully",
  "data": { ... }
}

---

## 1) GET /api/staff/by-station

- Purpose: List staff users who belong to a station. Accessible to roles ADMIN and MANAGER (not STAFF by itself).
- Method: GET
- Query parameters:
  - stationId (UUID, required) - station id to filter staff by
- Authorization: Bearer token; roles: `ADMIN`, `MANAGER`
- Response: `ApiResponse<List<UserResponse>>`

UserResponse fields (returned for each staff):
- id: UUID
- email: string
- fullName: string
- phone: string | null
- address: string | null
- cognitoSub: string | null
- avatarUrl: string | null
- role: string (enum name, e.g., "STAFF")
- licenseNumber: string | null
- identityNumber: string | null
- licenseCardFrontImageUrl: string | null
- licenseCardBackImageUrl: string | null
- isLicenseVerified: boolean
- verifiedAt: datetime | null
- stationId: UUID | null

Booking statistics included in response (numbers):
- totalBookings: number
- completedBookings: number
- activeBookings: number
- cancelledBookings: number

Metadata:
- createdAt: datetime
- updatedAt: datetime

Example success response:

{
  "statusCode": 200,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "email": "staff1@example.com",
      "fullName": "John Staff",
      "phone": "0123456789",
      "role": "STAFF",
      "isLicenseVerified": true,
      "stationId": "22222222-2222-2222-2222-222222222222",
      "totalBookings": 123,
      "completedBookings": 100,
      "activeBookings": 2,
      "cancelledBookings": 21,
      "createdAt": "2024-01-01T12:00:00",
      "updatedAt": "2024-02-01T12:00:00"
    }
  ]
}

Errors:
- 400 if stationId missing/invalid
- 401 if unauthorized
- 403 if role not allowed
- 404 if station not found (depending on implementation)

---

## 2) POST /api/staff/bookings/{bookingId}/confirm

- Purpose: Staff confirms a pending booking (mark status CONFIRMED and set checkedOutBy)
- Method: POST
- Path parameter:
  - bookingId (UUID, required) - booking to confirm
- Query parameters:
  - staffId (UUID, required) - the staff user performing the confirmation (should match authenticated user)
- Authorization: Bearer token; roles: `STAFF`, `ADMIN`
- Request body: none (fields passed via path/query)

- Response: `ApiResponse<Booking>` (the booking entity)

Booking entity fields (the response returns full Booking entity):
- id: UUID
- bookingCode: string
- renter: User object (nested) - see `User` fields below
- vehicle: Vehicle object (nested) - minimal expected fields: id, name, licensePlate (frontend should check actual API contract)
- station: Station object (nested) - minimal expected fields: id, name
- bookingType: string (enum: e.g., HOURLY, DAILY)
- startTime: datetime
- expectedEndTime: datetime
- actualEndTime: datetime | null
- status: string (enum: PENDING, CONFIRMED, ...)
- checkedOutBy: User object (staff who checked out) - nested User
- checkedInBy: User object | null
- basePrice: number (decimal)
- depositPaid: number (decimal)
- extraFee: number (decimal)
- totalAmount: number (decimal)
- pickupNote: string | null
- returnNote: string | null
- paymentStatus: string (enum)
- feedback: Feedback object | null (if present) - contains feedback fields
- createdAt: datetime
- updatedAt: datetime

Note: The controller currently returns the JPA `Booking` entity. The serialized JSON will include nested objects (renter, vehicle, station, checkedOutBy, checkedInBy). Confirm with backend team if a DTO (BookingResponse) should be used instead for consistent shapes.

Example success response:

{
  "statusCode": 200,
  "message": "Booking confirmed successfully",
  "data": {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "bookingCode": "BK202512345",
    "renter": { "id": "r1...", "fullName": "Alice", "email": "alice@example.com" },
    "vehicle": { "id": "v1...", "name": "Scooter X", "licensePlate": "ABC-123" },
    "station": { "id": "s1...", "name": "Station A" },
    "bookingType": "HOURLY",
    "startTime": "2025-12-03T09:00:00",
    "expectedEndTime": "2025-12-03T11:00:00",
    "actualEndTime": null,
    "status": "CONFIRMED",
    "checkedOutBy": { "id": "staff-uuid", "fullName": "John Staff" },
    "basePrice": 10.0,
    "depositPaid": 2.0,
    "extraFee": 0.0,
    "totalAmount": 12.0,
    "paymentStatus": "PAID",
    "createdAt": "2025-12-03T08:50:00"
  }
}

Errors:
- 400/422 if bookingId/staffId missing or invalid
- 401 if unauthorized
- 403 if role not allowed
- 404 if booking or staff not found
- 409 or 400 if booking status not PENDING (the service throws RuntimeException; backend should map to HTTP 400/409 with error message)

---

## 3) POST /api/staff/users/{userId}/verify-license

- Purpose: Staff verifies or rejects a user's driving license images/info.
- Method: POST
- Path parameter:
  - userId (UUID, required) - the user whose license is being verified
- Query parameters:
  - staffId (UUID, required) - the staff performing the verification (should match authenticated user)
  - approved (boolean, required) - true to approve, false to reject
- Authorization: Bearer token; roles: `STAFF`, `ADMIN`
- Request body: none

- Response: `ApiResponse<User>` (the updated User entity)

User entity fields (response):
- id: UUID
- email: string
- fullName: string
- phone: string | null
- address: string | null
- cognitoSub: string | null
- avatarUrl: string | null
- role: string
- licenseNumber: string | null
- identityNumber: string | null
- licenseCardFrontImageUrl: string | null
- licenseCardBackImageUrl: string | null
- isLicenseVerified: boolean
- verifiedAt: datetime | null
- stationId: UUID | null
- createdAt: datetime
- updatedAt: datetime

Example success response for approve=true:

{
  "statusCode": 200,
  "message": "User license verified successfully",
  "data": {
    "id": "u-uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "isLicenseVerified": true,
    "verifiedAt": "2025-12-03T10:00:00"
  }
}

Example success response for approve=false:

{
  "statusCode": 200,
  "message": "User license verification rejected",
  "data": {
    "id": "u-uuid",
    "isLicenseVerified": false,
    "verifiedAt": null
  }
}

Errors:
- 400/422 if missing params
- 401 if unauthorized
- 403 if role not allowed
- 404 if user or staff not found

---

## Notes for Frontend Implementation

- Authorization: All endpoints require `Authorization: Bearer <JWT>` header.
- Prefer to send `staffId` from authenticated user's profile; the backend checks staffId exists but does not enforce it equals authenticated user in current code. Consider coordinating with backend to remove redundant `staffId` or to validate it.
- Date/time format: Backend uses `LocalDateTime` and Jackson default serialization — typically ISO-8601 without timezone (e.g., "2025-12-03T09:00:00"). Confirm with backend if timezone or formatting differs.
- Numeric amounts: `BigDecimal` in Java will be serialized as JSON numbers (e.g., 12.5). Use numbers in frontend requests/responses.
- Error handling: Backend throws RuntimeException for missing entities or invalid states; ensure the frontend displays error message from the response body.

---

## Backend run & common environment issue (quick guide)

How to run the backend locally (from project root):

1. Build and run with Maven:

```bash
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```

2. Or run the jar produced in `target/`:

```bash
./mvnw package -DskipTests
java -jar target/*.jar
```

Common environment issue you reported: Error resolving placeholder `AWS_REGION` when Spring starts. This comes from a property value like:

```
https://cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}
```

Spring couldn't find `AWS_REGION` in application properties or environment variables.

Fixes:
- Ensure `.env` is loaded into environment before running the app. The JVM/Spring won't automatically read `.env`. Use one of:
  - Export variables in shell: `export AWS_REGION=us-east-1 && export AWS_COGNITO_USER_POOL_ID=...` then run the app in same shell.
  - Use a tool that loads `.env` (e.g., `direnv`, `dotenv` wrapper) or add variables to `application.yaml` for local dev.
  - Pass via JVM: `java -DAWS_REGION=us-east-1 -DAWS_COGNITO_USER_POOL_ID=... -jar target/*.jar`

If `.env` isn't recognized by your IDE (IntelliJ) make sure to add it to Run Configuration -> Environment variables (Import from file or paste variables).

---

# Complete list: Staff-relevant APIs (scanned from repository)

Below is a consolidated, controller-by-controller inventory of all endpoints a user with the STAFF role can call (either explicitly guarded for STAFF or allowed because the annotation includes STAFF). For each endpoint: HTTP method, path, required role(s), request params/body, response DTO/entity and short note.

BOT NOTE: I (the bot) scanned controller source files and listed every endpoint that staff can use; I also flagged where the backend returns JPA entities instead of DTOs and added recommended extra endpoints that would make staff UX better.

---

## Bookings (controller: `BookingController`)

- GET /api/bookings/{bookingId}
  - Roles: RENTER, STAFF, ADMIN
  - Path: bookingId (UUID)
  - Response: ApiResponse<BookingDetailResponse>
  - Note: Use for detailed booking view; BookingDetailResponse includes nested UserResponse, VehicleDetailResponse, StationResponse.

- GET /api/bookings/code/{bookingCode}
  - Roles: RENTER, STAFF, ADMIN
  - Path: bookingCode (String)
  - Response: ApiResponse<BookingDetailResponse>

- GET /api/bookings
  - Roles: STAFF, ADMIN
  - Query: page, size, sortBy, sortDirection
  - Response: ApiResponse<Page<BookingResponse>>
  - Note: Paginated list used in staff dashboards.

- GET /api/bookings/status/{status}
  - Roles: STAFF, ADMIN
  - Path: status (BookingStatus enum)
  - Response: ApiResponse<List<BookingResponse>>

- GET /api/bookings/vehicle/{vehicleId}
  - Roles: STAFF, ADMIN
  - Path: vehicleId (UUID)
  - Response: ApiResponse<List<BookingResponse>>

- GET /api/bookings/station/{stationId}
  - Roles: STAFF, ADMIN
  - Path: stationId (UUID)
  - Response: ApiResponse<List<BookingResponse>>

- PUT /api/bookings/{bookingId}
  - Roles: STAFF, ADMIN
  - Path: bookingId
  - Body: UpdateBookingRequest
  - Response: ApiResponse<BookingResponse>

- PATCH /api/bookings/{bookingId}/confirm
  - Roles: STAFF, ADMIN
  - Path: bookingId
  - Response: ApiResponse<BookingResponse>
  - BOT NOTE: Staff uses this to confirm pending bookings.

- PATCH /api/bookings/{bookingId}/start
  - Roles: STAFF, ADMIN
  - Response: ApiResponse<BookingResponse>
  - BOT NOTE: Mark booking as started (set actual start/checkedOutBy).

- PATCH /api/bookings/{bookingId}/complete
  - Roles: STAFF, ADMIN
  - Response: ApiResponse<BookingResponse>
  - BOT NOTE: Compute final fees and set actualEndTime.

- PATCH /api/bookings/{bookingId}/cancel
  - Roles: RENTER, STAFF, ADMIN
  - Response: ApiResponse<BookingResponse>
  - BOT NOTE: Staff can cancel bookings when necessary.

- DELETE /api/bookings/{bookingId}
  - Roles: ADMIN
  - Note: Not staff-accessible.


## Vehicles (controller: `VehicleController`)

- POST /api/vehicles
  - Roles: ADMIN, STAFF
  - Body: CreateVehicleRequest
  - Response: ApiResponse<VehicleResponse>
  - BOT NOTE: Staff can create vehicles for their station.

- PUT /api/vehicles/{vehicleId}
  - Roles: ADMIN, STAFF
  - Body: UpdateVehicleRequest
  - Response: ApiResponse<VehicleResponse>

- GET /api/vehicles/{vehicleId}
  - Roles: public
  - Response: ApiResponse<VehicleDetailResponse>

- GET /api/vehicles
  - Roles: public
  - Response: ApiResponse<Page<VehicleResponse>>

- GET /api/vehicles/station/{stationId}
  - Roles: public
  - Response: ApiResponse<List<VehicleResponse>>

- GET /api/vehicles/available
  - Roles: public
  - Query: stationId (UUID req), fuelType (opt), brand (opt)
  - Response: ApiResponse<List<VehicleResponse>>

- GET /api/vehicles/available/booking
  - Roles: public
  - Query: stationId, fuelType (opt), startTime (ISO), endTime (ISO)
  - Response: ApiResponse<List<VehicleResponse>>

- PATCH /api/vehicles/{vehicleId}/status
  - Roles: ADMIN, STAFF
  - Query: status (VehicleStatus)
  - Response: ApiResponse<VehicleResponse>
  - BOT NOTE: Staff can change availability/status (maintenance, active, etc.).

- PATCH /api/vehicles/{vehicleId}/rent-count
  - Roles: ADMIN, STAFF
  - Response: ApiResponse<VehicleResponse>
  - BOT NOTE: Increment rentCount after completed booking.

- POST /api/vehicles/{vehicleId}/photos
  - Roles: ADMIN, STAFF
  - Multipart: files[]
  - Response: ApiResponse<VehicleResponse>
  - BOT NOTE: Allow staff to upload photos from mobile/web.


## Stations (controller: `StationController`)

- GET /api/stations/{stationId}
  - Roles: public
  - Response: ApiResponse<StationDetailResponse>

- GET /api/stations
  - Roles: public
  - Response: ApiResponse<Page<StationResponse>>

- GET /api/stations/active
  - Roles: public
  - Response: ApiResponse<List<StationResponse>>

- GET /api/stations/status/{status}
  - Roles: public
  - Response: ApiResponse<List<StationResponse>>

- GET /api/stations/{stationId}/vehicles/available/count
  - Roles: public
  - Response: ApiResponse<Map<String,Integer>> {"availableVehicles": <int>}
  - BOT NOTE: Useful for staff dashboard showing available vehicles count.

- POST /api/stations/{stationId}/photo
  - Roles: ADMIN, STAFF
  - Multipart: file
  - Response: ApiResponse<StationResponse>
  - BOT NOTE: Staff can update station photo.

- Admin-only endpoints (create/update/delete/status change) are NOT staff-accessible.


## Users (controller: `UserController`)

- GET /api/users/me
  - Roles: RENTER, STAFF, ADMIN
  - Header: Authorization: Bearer <token>
  - Response: ApiResponse<UserResponse>
  - BOT NOTE: Uses CognitoService to fetch current user info.

- GET /api/users/me/stats
  - Roles: RENTER, STAFF, ADMIN
  - Response: ApiResponse<UserResponse> (with booking statistics)

- GET /api/users/{userId}
  - Roles: ADMIN, STAFF
  - Response: ApiResponse<UserResponse>
  - BOT NOTE: Staff can view renter profiles and license images.

- GET /api/users/{userId}/stats
  - Roles: ADMIN, STAFF
  - Response: ApiResponse<UserResponse> (with stats)

- PUT /api/users/{userId}
  - Roles: ADMIN, STAFF
  - Body: UpdateUserRequest
  - Response: ApiResponse<UserResponse>

- PATCH /api/users/{userId}/verify-license
  - Roles: ADMIN, STAFF
  - Response: ApiResponse<UserResponse>
  - BOT NOTE: Controller method `verifyUserLicense` uses `userService.verifyLicenceUserAccount`.

- POST /api/users/{userId}/avatar
  - Roles: ADMIN, STAFF, RENTER
  - Multipart: file
  - Response: ApiResponse<UserResponse>

- POST /api/users/{userId}/license-card/front
  - Roles: ADMIN, STAFF, RENTER
  - Multipart: file
  - Response: ApiResponse<UserResponse>

- POST /api/users/{userId}/license-card/back
  - Roles: ADMIN, STAFF, RENTER
  - Multipart: file
  - Response: ApiResponse<UserResponse>


## Payments (controller: `PaymentController`)

- POST /api/payments/momo/callback
  - Roles: public
  - Body: MoMoCallbackRequest
  - Response: ApiResponse<Void>

- GET /api/payments/{paymentId}
  - Roles: RENTER, ADMIN, STAFF
  - Response: ApiResponse<PaymentResponse>

- GET /api/payments/booking/{bookingId}
  - Roles: RENTER, ADMIN, STAFF
  - Response: ApiResponse<List<PaymentResponse>>

- GET /api/payments/transaction/{transactionId}
  - Roles: RENTER, ADMIN, STAFF
  - Response: ApiResponse<PaymentResponse>

- GET /api/payments/result
  - Roles: public
  - Response: 200 OK string


## Blogs (controller: `BlogController`)

- POST /api/blogs
  - Roles: ADMIN, STAFF
  - Body: CreateBlogRequest
  - Response: ApiResponse<BlogResponse>

- PUT /api/blogs/{blogId}
  - Roles: ADMIN, STAFF
  - Body: UpdateBlogRequest
  - Response: ApiResponse<BlogResponse>

- GET /api/blogs/my
  - Roles: ADMIN, STAFF
  - Response: ApiResponse<List<BlogResponse>>
  - BOT NOTE: Staff sees their own drafts/published posts here.

- POST /api/blogs/{blogId}/thumbnail
  - Roles: ADMIN, STAFF
  - Multipart: file
  - Response: ApiResponse<BlogResponse>


## StaffController (controller: `StaffController`)

- GET /api/staff/by-station
  - Roles: ADMIN, MANAGER
  - Query: stationId
  - Response: ApiResponse<List<UserResponse>>

- POST /api/staff/bookings/{bookingId}/confirm
  - Roles: STAFF, ADMIN
  - Path: bookingId
  - Query: staffId (UUID)
  - Response: ApiResponse<com.project.evrental.domain.entity.Booking>
  - BOT WARNING: This endpoint returns the JPA Booking entity (see `src/.../Booking.java`). Prefer `BookingDetailResponse` for FE contracts.

- POST /api/staff/users/{userId}/verify-license
  - Roles: STAFF, ADMIN
  - Path: userId
  - Query: staffId (UUID), approved (boolean)
  - Response: ApiResponse<com.project.evrental.domain.entity.User>
  - BOT WARNING: This returns JPA User entity; prefer `UserResponse` DTO for stability.


---

## BOT SUGGESTIONS (endpoints the bot thinks staff commonly need)

These are helpful endpoints that are missing or would make staff UX easier. Consider adding them in future:

- GET /api/staff/{staffId}/bookings (or /api/bookings/assigned)
  - Purpose: list bookings assigned to this staff (checkedOutBy or checkedInBy) with status filters.
  - BOT NOTE: Simplifies staff "my tasks" dashboard.

- POST /api/staff/bookings/{bookingId}/assign
  - Purpose: assign a booking to a staff (explicitly set checkedOutBy) separate from confirm.
  - BOT NOTE: Useful when dispatcher or manager assigns bookings.

- GET /api/staff/dashboard/station/{stationId}/metrics
  - Purpose: single endpoint returning aggregated metrics (pending bookings, available vehicles, revenue today, active rentals).
  - BOT NOTE: Consolidates multiple calls into one for staff dashboard.

- POST /api/payments/{paymentId}/refund
  - Purpose: trigger refunds (if business allows staff refunds).
  - BOT NOTE: Staff may need to refund deposits or payments.

- GET /api/feedbacks/station/{stationId}
  - Purpose: list feedback for station/vehicles so staff can triage issues.

- Real-time updates: WebSocket or SSE endpoint for new bookings/cancellations
  - BOT NOTE: Live updates let staff react quickly without polling.


---

## BOT FINAL NOTES (consistency & FE guidance)

- Prefer DTOs in all controller responses. Two staff endpoints return JPA entities — backend should map them to DTOs (`BookingDetailResponse` / `UserResponse`) to ensure consistent fields and to avoid lazy-loading surprises.
- Use consistent time format: ISO-8601 LocalDateTime (documented in the file). Frontend should parse accordingly.
- When integrating, FE should rely on the DTO classes in `src/main/java/com/project/evrental/domain/dto/response/*` as the contract.

If you want, I can:
- Update `StaffApi.md` to include full JSON example bodies for every endpoint (happy + error examples).
- Open a small PR to change the two staff endpoints to return DTOs instead of JPA entities (I can implement `BookingResponse`/`BookingDetailResponse` mapping). 

Tell me which of the above you'd like next and I'll proceed.
