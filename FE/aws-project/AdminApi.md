# Admin API Specification

This document describes all backend API endpoints that can be accessed by **ADMIN** role (sometimes along with STAFF/MANAGER). All responses are wrapped by a common `ApiResponse<T>` structure.

## Common

### Authentication and Authorization

All ADMIN endpoints require:

- A valid JWT access token in the `Authorization` header: `Bearer <token>`
- The token must contain at least the role(s) specified per endpoint, typically `ADMIN`.

### Response Wrapper: `ApiResponse<T>`

Every endpoint returns JSON in the following format:

```json
{
  "statusCode": 200,
  "message": "optional message, can be null",
  "data": { /* endpoint specific payload */ },
  "responseAt": "2024-09-01T12:34:56.789"  
}
```

Fields:
- `statusCode` (integer): Business status code, usually matches HTTP status semantics (200, 201, 204, ...).
- `message` (string, nullable): Human-readable message, may be `null` for read-only endpoints.
- `data` (generic): The actual response payload; type depends on endpoint.
- `responseAt` (string, ISO-8601 datetime): Time when the response object was created.

---

## 1. Admin Dashboard & Analytics (`AdminController`)
Base path: `/api/admin`
All endpoints in this controller require **role: ADMIN**.

### 1.1 Get Dashboard Summary

- **Endpoint**: `GET /api/admin/dashboard/summary`
- **Required roles**: `ADMIN`
- **Description**: Returns high-level summary metrics for users, vehicles, bookings, and revenue.

**Request**
- No path, query, or body parameters.

**Response**
- `data` type: `AdminDashboardSummaryResponse`

`AdminDashboardSummaryResponse`:
- `userReport` (`UserReportAdminDashboardSummary`): User-related metrics.
- `vehicleReport` (`VehicleReportAdminDashboardSummary`): Vehicle-related metrics.
- `bookingReport` (`BookingReportAdminDashboardSummary`): Booking-related metrics.
- `revenueReport` (`RevenueReportAdminDashboardSummary`): Revenue-related metrics (e.g. today vs last period).

> You can inspect fields in each nested `*ReportAdminDashboardSummary` class under `domain/dto/response/admin` for exact field names. FE should map each field 1-1 from backend.

---

### 1.2 Get Revenue & Booking Chart Data

- **Endpoint**: `GET /api/admin/dashboard/revenue-chart`
- **Required roles**: `ADMIN`
- **Description**: Returns time-series data for revenue and number of bookings (for charts).

**Request**
- No parameters.

**Response**
- `data` type: `List<RevenueAndBookingInChartResponse>`

`RevenueAndBookingInChartResponse` (per time point):
- `timeLabel` (string): Label for x-axis (e.g. `"2024-09"` for a month or a date label, depending on implementation).
- `totalRevenue` (number, decimal): Total revenue in this time bucket.
- `totalBookings` (integer): Total number of bookings in this time bucket.

---

### 1.3 Get Vehicle Status Distribution

- **Endpoint**: `GET /api/admin/dashboard/vehicle-status`
- **Required roles**: `ADMIN`
- **Description**: Returns distribution of vehicles per status for a donut/pie chart.

**Request**
- No parameters.

**Response**
- `data` type: `VehicleStatusDistributionResponse`

`VehicleStatusDistributionResponse`:
- `availableCount` (integer): Number of vehicles with status `AVAILABLE`.
- `onGoingCount` (integer): Number of vehicles currently rented/ongoing.
- `maintenanceCount` (integer): Number of vehicles under maintenance.

---

### 1.4 Get Booking By Type Distribution

- **Endpoint**: `GET /api/admin/dashboard/booking-by-type`
- **Required roles**: `ADMIN`
- **Description**: Returns booking count grouped by booking type (e.g., hourly, daily).

**Request**
- No parameters.

**Response**
- `data` type: `List<BookingByTypeResponse>`

`BookingByTypeResponse` (per type):
- `type` (string): Booking type identifier (e.g. `"HOURLY"`, `"DAILY"`).
- `count` (integer): Number of bookings of this type.

---

### 1.5 Get New Bookings

- **Endpoint**: `GET /api/admin/dashboard/new-bookings`
- **Required roles**: `ADMIN`
- **Description**: Returns a list of recently created bookings for dashboard display.

**Request**
- No parameters.

**Response**
- `data` type: `List<NewBookingResponse>`

`NewBookingResponse` (per booking): fields include things like:
- `bookingId` (UUID): Booking identifier.
- `bookingCode` (string): Human readable booking code.
- `renterName` (string)
- `vehicleName` (string)
- `createdAt` (datetime)
- `status` (string)

---

### 1.6 Get Booking Performance Metrics

- **Endpoint**: `GET /api/admin/dashboard/booking-performance`
- **Required roles**: `ADMIN`
- **Description**: Returns aggregated statistics about booking completion / cancellation performance.

**Request**
- No parameters.

**Response**
- `data` type: `BookingPerformanceResponse`

`BookingPerformanceResponse` (key fields):
- `completionRate` (number, percentage as decimal or 0-100).
- `cancellationRate` (number).
- `averageRentalDurationHours` (number).

---

### 1.7 Get Maintenance Overview

- **Endpoint**: `GET /api/admin/dashboard/maintenance-overview`
- **Required roles**: `ADMIN`
- **Description**: Returns overview statistics related to vehicle maintenance.

**Request**
- No parameters.

**Response**
- `data` type: `MaintenanceOverviewResponse`

`MaintenanceOverviewResponse` (examples):
- `vehiclesInMaintenance` (integer)
- `upcomingMaintenanceCount` (integer)
- `overdueMaintenanceCount` (integer)

---

## 2. User Management for Admin (`AdminController` & `StaffController`)

### 2.1 Get User Management Metrics

- **Endpoint**: `GET /api/admin/users/metrics`
- **Required roles**: `ADMIN`
- **Description**: Returns high-level metrics about users.

**Request**
- No parameters.

**Response**
- `data` type: `MetricUserManagementResponse`

`MetricUserManagementResponse`:
- `totalUser` (integer): Total number of users.
- `totalVerifiedUser` (integer): Users with verified driving license.
- `totalBlockedUser` (integer): Users that are blocked or disabled.

---

### 2.2 Filter Users

- **Endpoint**: `GET /api/admin/users/filter`
- **Required roles**: `ADMIN`
- **Description**: Returns a list of users filtered by configurable criteria.

**Request Query Parameters**
- `name` (string, optional): Filter by part of the full name.
- `email` (string, optional): Filter by email address.
- `phone` (string, optional): Filter by phone number.
- `role` (string, optional): Filter by role, e.g. `"RENTER"`, `"STAFF"`, `"ADMIN"`.
- `verification` (boolean, optional):
  - `true` → only verified users.
  - `false` → only non-verified users.
  - omitted → do not filter by verification.

**Response**
- `data` type: `List<UserResponse>`

`UserResponse` fields:
- `id` (UUID)
- `email` (string)
- `fullName` (string)
- `phone` (string)
- `address` (string)
- `cognitoSub` (string): User id in Cognito.
- `avatarUrl` (string): URL of avatar image.
- `role` (string): e.g. `"RENTER"`, `"STAFF"`, `"ADMIN"`.
- `licenseNumber` (string, nullable): Driving license number.
- `identityNumber` (string, nullable): Government ID number.
- `licenseCardFrontImageUrl` (string, nullable)
- `licenseCardBackImageUrl` (string, nullable)
- `isLicenseVerified` (boolean, nullable): Whether license is verified.
- `verifiedAt` (datetime, nullable): Time of license verification.
- `stationId` (UUID, nullable): Station where this staff works (if staff).
- Booking statistics (for some endpoints may be null if not loaded):
  - `totalBookings` (long)
  - `completedBookings` (long)
  - `activeBookings` (long)
  - `cancelledBookings` (long)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### 2.3 Get Users Table (Unfiltered List)

- **Endpoint**: `GET /api/admin/users`
- **Required roles**: `ADMIN`
- **Description**: Returns a basic table/list of all users (similar to filter endpoint, but without filters).

**Request**
- No parameters.

**Response**
- `data` type: `List<UserResponse>` (same structure as above).

---

### 2.4 Get Staff By Station (Admin View)

- **Endpoint**: `GET /api/staff/by-station`
- **Required roles**: `ADMIN` or `MANAGER`
- **Description**: Returns list of staff users assigned to a given station. Admin can also use this.

**Request Query Parameters**
- `stationId` (UUID, required): ID of the station.
  - Example: `"550e8400-e29b-41d4-a716-446655440000"`

**Response**
- `data` type: `List<UserResponse>` (see structure above).

---

### 2.5 Attach Staff To Station

- **Endpoint**: `POST /api/admin/staff/attach-to-station`
- **Required roles**: `ADMIN`
- **Description**: Attach/assign an existing staff user to a station.

**Request Query Parameters**
- `staffId` (UUID, required): ID of staff user.
- `stationId` (UUID, required): ID of station.

Example request:

`POST /api/admin/staff/attach-to-station?staffId=...&stationId=...`

**Response**
- `data` type: `string`
- Example:
  ```json
  {
    "statusCode": 200,
    "message": "Staff attached to station successfully",
    "data": "Staff has been assigned to the station",
    "responseAt": "2024-09-01T12:34:56.789"
  }
  ```

---

## 3. Vehicle Management (`AdminController` + `VehicleController`)

### 3.1 Get Vehicle Management Metrics

- **Endpoint**: `GET /api/admin/vehicles/metrics`
- **Required roles**: `ADMIN`
- **Description**: Aggregated metrics about vehicles.

**Request**
- No parameters.

**Response**
- `data` type: `MetricVehicleManagementResponse`

`MetricVehicleManagementResponse`:
- `totalVehicles` (integer): Total vehicles in the system.
- `totalAvailable` (integer): Number of vehicles currently `AVAILABLE`.
- `totalOnGoing` (integer): Vehicles currently rented.
- `totalMaintenance` (integer): Vehicles in maintenance.

---

### 3.2 Search Vehicles (Admin Search)

- **Endpoint**: `GET /api/admin/vehicles/search`
- **Required roles**: `ADMIN`
- **Description**: Full-text search for vehicles for admin.

**Request Query Parameters**
- `keyword` (string, optional): Search keyword applied to name, license plate, etc.

**Response**
- `data` type: `List<VehicleResponse>`

`VehicleResponse` fields:
- `id` (UUID)
- `stationId` (UUID): Station where the vehicle is located.
- `licensePlate` (string)
- `name` (string): Vehicle model/name.
- `brand` (string)
- `color` (string)
- `fuelType` (string): e.g. `"ELECTRIC"`, `"GASOLINE"`.
- `rating` (number, decimal): Average user rating.
- `capacity` (integer): Number of seats.
- `rentCount` (integer): Total number of completed rentals.
- `photos` (string[]): List of image URLs.
- `status` (string): One of `"AVAILABLE"`, `"ON_GOING"`, `"MAINTENANCE"`, etc.
- `hourlyRate` (number, decimal)
- `dailyRate` (number, decimal)
- `depositAmount` (number, decimal)
- `polices` (string[]): Policy texts for renting this vehicle.
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### 3.3 Filter Vehicles

- **Endpoint**: `GET /api/admin/vehicles/filter`
- **Required roles**: `ADMIN`
- **Description**: Filter vehicles for admin by several fields.

**Request Query Parameters**
- `name` (string, optional): Filter by vehicle name.
- `status` (string, optional): Filter by vehicle status.
- `type` (string, optional): Filter by type (implementation-defined, e.g. model or category).
- `capacity` (integer, optional): Filter by seating capacity.

**Response**
- `data` type: `List<VehicleResponse>` (see above).

---

### 3.4 Create Vehicle

- **Endpoint**: `POST /api/vehicles`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Create a new vehicle at a station.

**Request Body** (`CreateVehicleRequest`, JSON)

Key fields (inferred from domain):
- `stationId` (UUID, required): Station where the vehicle is located.
- `licensePlate` (string, required)
- `name` (string, required)
- `brand` (string, required)
- `color` (string, optional)
- `fuelType` (string, required): E.g. `"ELECTRIC"`.
- `capacity` (integer, required)
- `hourlyRate` (number, required)
- `dailyRate` (number, required)
- `depositAmount` (number, required)
- `polices` (string[], optional): List of rental policies.

**Response**
- HTTP status: `201 Created`
- `data` type: `VehicleResponse` (see structure above).

---

### 3.5 Update Vehicle

- **Endpoint**: `PUT /api/vehicles/{vehicleId}`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Update information of an existing vehicle.

**Path Parameters**
- `vehicleId` (UUID, required): ID of the vehicle to update.

**Request Body** (`UpdateVehicleRequest`, JSON)

Typical fields (subset of `CreateVehicleRequest`, all or some optional):
- `licensePlate` (string)
- `name` (string)
- `brand` (string)
- `color` (string)
- `fuelType` (string)
- `capacity` (integer)
- `hourlyRate` (number)
- `dailyRate` (number)
- `depositAmount` (number)
- `polices` (string[])

**Response**
- `data` type: `VehicleResponse`.

---

### 3.6 Delete Vehicle

- **Endpoint**: `DELETE /api/vehicles/{vehicleId}`
- **Required roles**: `ADMIN`
- **Description**: Soft-delete or remove a vehicle.

**Path Parameters**
- `vehicleId` (UUID, required)

**Response**
- `data` is `null` (no payload).
- `statusCode` usually `204` in body, HTTP status `200`.

---

### 3.7 Change Vehicle Status

- **Endpoint**: `PATCH /api/vehicles/{vehicleId}/status`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Update status of a vehicle.

**Path Parameters**
- `vehicleId` (UUID, required)

**Query Parameters**
- `status` (enum `VehicleStatus`, required): Example values: `"AVAILABLE"`, `"MAINTENANCE"`, `"ON_GOING"`.

**Response**
- `data` type: `VehicleResponse` with updated `status`.

---

### 3.8 Increment Vehicle Rent Count

- **Endpoint**: `PATCH /api/vehicles/{vehicleId}/rent-count`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Manually increment `rentCount` for a vehicle (used after a successful booking).

**Path Parameters**
- `vehicleId` (UUID, required)

**Response**
- `data` type: `VehicleResponse` with updated `rentCount`.

---

### 3.9 Upload Vehicle Photos

- **Endpoint**: `POST /api/vehicles/{vehicleId}/photos`
- **Required roles**: `ADMIN` or `STAFF`
- **Consumes**: `multipart/form-data`
- **Description**: Upload one or multiple photos for a vehicle.

**Path Parameters**
- `vehicleId` (UUID, required)

**Multipart Form Data**
- Field: `files` (array of binary files, required)
  - Each item is a file: e.g. `image/jpeg`, `image/png`.

**Response**
- `data` type: `VehicleResponse` with updated `photos` array.

---

## 4. Station Management (`StationController`)

Base path: `/api/stations`

### 4.1 Create Station

- **Endpoint**: `POST /api/stations`
- **Required roles**: `ADMIN`
- **Description**: Create a new EV station.

**Request Body** (`CreateStationRequest`, JSON)

Typical fields (deduced from domain):
- `name` (string, required)
- `address` (string, required)
- `latitude` (number, required)
- `longitude` (number, required)
- `openingHours` (string, optional)
- `phone` (string, optional)

**Response**
- HTTP status: `201 Created`
- `data` type: `StationResponse`

`StationResponse` key fields:
- `id` (UUID)
- `name` (string)
- `address` (string)
- `latitude` (number)
- `longitude` (number)
- `status` (string): e.g. `"ACTIVE"`, `"INACTIVE"`.
- `photoUrl` (string, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### 4.2 Update Station

- **Endpoint**: `PUT /api/stations/{stationId}`
- **Required roles**: `ADMIN`
- **Description**: Update station details.

**Path Parameters**
- `stationId` (UUID, required)

**Request Body** (`UpdateStationRequest`, JSON)

Similar fields as `CreateStationRequest`, optional:
- `name` (string)
- `address` (string)
- `latitude` (number)
- `longitude` (number)
- `openingHours` (string)
- `phone` (string)

**Response**
- `data` type: `StationResponse`.

---

### 4.3 Delete Station

- **Endpoint**: `DELETE /api/stations/{stationId}`
- **Required roles**: `ADMIN`
- **Description**: Delete or deactivate a station.

**Path Parameters**
- `stationId` (UUID, required)

**Response**
- `data` is `null`.
- `statusCode` typically `204` in body, HTTP status `200`.

---

### 4.4 Change Station Status

- **Endpoint**: `PATCH /api/stations/{stationId}/status`
- **Required roles**: `ADMIN`
- **Description**: Change a station's operational status.

**Path Parameters**
- `stationId` (UUID, required)

**Query Parameters**
- `status` (enum `StationStatus`, required): Example `"ACTIVE"`, `"INACTIVE"`.

**Response**
- `data` type: `StationResponse` with updated `status`.

---

### 4.5 Upload Station Photo

- **Endpoint**: `POST /api/stations/{stationId}/photo`
- **Required roles**: `ADMIN` or `STAFF`
- **Consumes**: `multipart/form-data`
- **Description**: Upload/replace the main photo of a station.

**Path Parameters**
- `stationId` (UUID, required)

**Multipart Form Data**
- Field: `file` (binary file, required): Station image.

**Response**
- `data` type: `StationResponse` with updated photo URL.

> Note: Other `StationController` endpoints like listing stations, getting by id, etc. are public or user-facing and not restricted to ADMIN only, so they are not detailed here.

---

## 5. Booking Management & Metrics (`AdminController` & `StaffController`)

### 5.1 Get Booking Metrics

- **Endpoint**: `GET /api/admin/bookings/metrics`
- **Required roles**: `ADMIN`
- **Description**: Returns aggregated metrics for bookings.

**Request**
- No parameters.

**Response**
- `data` type: `MetricBookingDashboardResponse`

`MetricBookingDashboardResponse`:
- `totalBooking` (integer): Total number of bookings.
- `totalRevenueFromCompletedBooking` (number, decimal): Revenue from completed bookings.
- `totalConfirmBooking` (integer): Count of confirmed bookings.
- `totalOnGoingBooking` (integer): Count of ongoing bookings.

---

### 5.2 Get Bookings Table (Admin View)

- **Endpoint**: `GET /api/admin/bookings`
- **Required roles**: `ADMIN`
- **Description**: Returns a list of bookings for admin table view.

**Request**
- No parameters.

**Response**
- `data` type: `List<BookingResponse>`

`BookingResponse` fields:
- `id` (UUID)
- `bookingCode` (string)
- `renterId` (UUID)
- `renterName` (string)
- `renterEmail` (string)
- `vehicleId` (UUID)
- `vehicleName` (string)
- `licensePlate` (string)
- `stationId` (UUID)
- `stationName` (string)
- `startTime` (datetime)
- `expectedEndTime` (datetime)
- `actualEndTime` (datetime, nullable)
- `status` (string): e.g. `"PENDING"`, `"CONFIRMED"`, `"ON_GOING"`, `"COMPLETED"`, `"CANCELLED"`.
- `checkedOutById` (UUID, nullable): Staff who checked out the vehicle.
- `checkedOutByName` (string, nullable)
- `checkedInById` (UUID, nullable): Staff who checked in the vehicle.
- `checkedInByName` (string, nullable)
- `basePrice` (number, decimal): Base rental price.
- `depositPaid` (number, decimal)
- `extraFee` (number, decimal): Extra fees (e.g. late return).
- `totalAmount` (number, decimal)
- `pickupNote` (string, nullable)
- `returnNote` (string, nullable)
- `paymentStatus` (string): e.g. `"PENDING"`, `"PAID"`, `"REFUNDED"`.
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### 5.3 Confirm Booking (Staff/Admin)

- **Endpoint**: `POST /api/staff/bookings/{bookingId}/confirm`
- **Required roles**: `STAFF` or `ADMIN`
- **Description**: Confirm a pending booking and associate it with a staff member.

**Path Parameters**
- `bookingId` (UUID, required): ID of booking to confirm.

**Query Parameters**
- `staffId` (UUID, required): Staff user who confirms the booking.

**Response**
- `data` type: `Booking` (entity)
  - The fields are very close to `BookingResponse` but can include raw entity-specific details. For FE usage, treat it as equivalent to `BookingResponse` (same core fields for id, renter, vehicle, times, price, status).

---

## 6. Revenue Analytics (`AdminController`)

### 6.1 Get Yearly Revenue Comparison

- **Endpoint**: `GET /api/admin/revenue/yearly-comparison`
- **Required roles**: `ADMIN`
- **Description**: Returns revenue comparison between years (e.g. current vs last year).

**Request**
- No parameters.

**Response**
- `data` type: `YearlyRevenueComparisonResponse`

`YearlyRevenueComparisonResponse` likely includes:
- `currentYearRevenue` (number, decimal)
- `previousYearRevenue` (number, decimal)
- `growthPercentage` (number).

---

### 6.2 Get Revenue By Year

- **Endpoint**: `GET /api/admin/revenue/by-year`
- **Required roles**: `ADMIN`
- **Description**: Returns list of revenue stats per year.

**Query Parameters**
- `numberOfYears` (integer, optional, default `5`): How many years back to include.

**Response**
- `data` type: `List<RevenueByYearResponse>`

`RevenueByYearResponse` (per year):
- `year` (integer)
- `totalRevenue` (number, decimal)

---

### 6.3 Get Detailed Revenue Breakdown

- **Endpoint**: `GET /api/admin/revenue/detail`
- **Required roles**: `ADMIN`
- **Description**: Returns breakdown of revenue by base rental and extra fees.

**Request**
- No parameters.

**Response**
- `data` type: `DetailRevenueResponse`

`DetailRevenueResponse`:
- `revenueFromRental` (number, decimal): Revenue from base rental price.
- `revenueFromExtraFee` (number, decimal): Revenue from extra fees.

---

## 7. Top Performers (`AdminController`)

### 7.1 Get Top Vehicles

- **Endpoint**: `GET /api/admin/top-vehicles`
- **Required roles**: `ADMIN`
- **Description**: Returns best-performing vehicles based on rentals or revenue.

**Query Parameters**
- `limit` (integer, optional, default `8`): Max number of vehicles.

**Response**
- `data` type: `List<TopVehicleResponse>`

`TopVehicleResponse` (per vehicle):
- `vehicleId` (UUID)
- `vehicleName` (string)
- `licensePlate` (string)
- `totalRevenue` (number, decimal)
- `totalBookings` (integer)

---

### 7.2 Get Top Customers

- **Endpoint**: `GET /api/admin/top-customers`
- **Required roles**: `ADMIN`
- **Description**: Returns top customers by revenue or booking count.

**Query Parameters**
- `limit` (integer, optional, default `8`)

**Response**
- `data` type: `List<TopCustomerResponse>`

`TopCustomerResponse` (per user):
- `userId` (UUID)
- `fullName` (string)
- `email` (string)
- `totalRevenue` (number, decimal)
- `totalBookings` (integer)

---

## 8. Blog / Content Management (`BlogController`)

Base path: `/api/blogs`

### 8.1 Create Blog Post

- **Endpoint**: `POST /api/blogs`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Create a new blog article.

**Request Body** (`CreateBlogRequest`, JSON)

Typical fields:
- `title` (string, required)
- `content` (string, required, HTML or markdown allowed)
- `tags` (string[], optional)
- `status` (string, optional): e.g. `"DRAFT"` or `"PUBLISHED"`.

**Response**
- HTTP status: `201 Created`
- `data` type: `BlogResponse`

`BlogResponse` key fields:
- `id` (UUID)
- `title` (string)
- `content` (string)
- `authorId` (UUID)
- `authorName` (string)
- `thumbnailUrl` (string, nullable)
- `viewCount` (integer)
- `status` (string): `"DRAFT"` / `"PUBLISHED"`.
- `createdAt` (datetime)
- `publishedAt` (datetime, nullable)

---

### 8.2 Update Blog Post

- **Endpoint**: `PUT /api/blogs/{blogId}`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Update an existing blog.

**Path Parameters**
- `blogId` (UUID, required)

**Request Body** (`UpdateBlogRequest`, JSON)

Fields similar to `CreateBlogRequest`, typically optional:
- `title` (string)
- `content` (string)
- `tags` (string[])
- `status` (string)

**Response**
- `data` type: `BlogResponse`.

---

### 8.3 Get My Blogs (Admin/Staff)

- **Endpoint**: `GET /api/blogs/my`
- **Required roles**: `ADMIN` or `STAFF`
- **Description**: Returns all blogs authored by the current authenticated user (admin or staff).

**Request**
- No parameters (user is determined from JWT token).

**Response**
- `data` type: `List<BlogResponse>`

---

### 8.4 Delete Blog

- **Endpoint**: `DELETE /api/blogs/{blogId}`
- **Required roles**: `ADMIN`
- **Description**: Delete a blog article.

**Path Parameters**
- `blogId` (UUID, required)

**Response**
- `data` is `null` (`Void`).
- `statusCode` = 200 with message `"Blog deleted successfully"`.

---

### 8.5 Upload Blog Thumbnail

- **Endpoint**: `POST /api/blogs/{blogId}/thumbnail`
- **Required roles**: `ADMIN` or `STAFF`
- **Consumes**: `multipart/form-data`
- **Description**: Upload or change thumbnail image for a blog post.

**Path Parameters**
- `blogId` (UUID, required)

**Multipart Form Data**
- Field: `file` (binary, required): Thumbnail image file.

**Response**
- `data` type: `BlogResponse` with updated `thumbnailUrl`.

---

## 9. License Verification (Staff/Admin)

### 9.1 Verify User License

- **Endpoint**: `POST /api/staff/users/{userId}/verify-license`
- **Required roles**: `STAFF` or `ADMIN`
- **Description**: Staff (or admin) approves/rejects a user's driving license verification.

**Path Parameters**
- `userId` (UUID, required): ID of user to verify.

**Query Parameters**
- `staffId` (UUID, required): Staff performing the verification.
- `approved` (boolean, required):
  - `true` → approve license.
  - `false` → reject license.

**Response**
- `data` type: `User` (entity)
  - For FE, treat it similarly to `UserResponse` — it will include core user fields and updated `isLicenseVerified`.

---

This `AdminApi.md` focuses on endpoints where `ADMIN` is allowed (sometimes together with STAFF/MANAGER). For any additional request/response field details, FE can refer to the DTO classes under `domain/dto/response` and `domain/dto/request` with the same names as used above.
