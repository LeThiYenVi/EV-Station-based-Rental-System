# Staff API Integration Guide

This guide lists the concrete integration tasks to wire the Staff UI to backend APIs, prioritized from easy → medium based on implementation effort and backend readiness. It is derived from `StaffApi.md`.

Notes

- Base path: `/api` via Vite proxy; all staff endpoints require `Authorization: Bearer <token)`.
- Response wrapper: most endpoints return `ApiResponse<T>`; use `.data` for payload.
- Prefer DTOs (BookingResponse, BookingDetailResponse, UserResponse). Two staff endpoints currently return JPA entities — handle carefully or request backend DTOs.

## Easy Priority

- ✅ Users: Fetch renter profile and stats
  - GET `/api/users/{userId}` → display customer details in `Customers` modal.
  - GET `/api/users/{userId}/stats` → show booking counts, ratings.
  - GET `/api/users/me` & `/api/users/me/stats` → bind staff header info and quick metrics.
- ✅ Bookings: Page and filter for staff dashboards
  - GET `/api/bookings?page=&size=&sortBy=&sortDirection=` → list of bookings in `ActiveBookings`.
  - GET `/api/bookings/status/{status}` → tabs/filters for PENDING/CONFIRMED/ACTIVE, etc.
- Stations: General lists and counts
  - GET `/api/stations` → bind stations in selectors.
  - GET `/api/stations/{stationId}/vehicles/available/count` → show available vehicles badge on station card.
- ✅ Vehicles: Basic listing per station
  - GET `/api/vehicles/station/{stationId}` → vehicle list in `VehicleInspection`.
  - GET `/api/vehicles/available?stationId=...` → available vehicles for quick actions.

## Easy → Medium Priority

- ✅ Bookings: Action transitions
  - PATCH `/api/bookings/{bookingId}/confirm` → confirm pending booking in `Confirmations`.
  - PATCH `/api/bookings/{bookingId}/start` → mark booking started (checkout) in `ActiveBookings`.
  - PATCH `/api/bookings/{bookingId}/complete` → mark booking completed (checkin) in `ActiveBookings`.
  - PATCH `/api/bookings/{bookingId}/cancel` → cancel booking when needed.
- ✅ Vehicles: Status updates
  - PATCH `/api/vehicles/{vehicleId}/status?status=` → set maintenance/active in `VehicleInspection`.
  - PATCH `/api/vehicles/{vehicleId}/rent-count` → update metrics after completion.

## Medium Priority

- ✅ Staff-specific actions (StaffController)
  - POST `/api/staff/bookings/{bookingId}/confirm?staffId=` → confirm pending booking with staff ownership.
    - Note: returns JPA Booking entity. Prefer using BookingResponse if backend updates; otherwise adapt FE parsing.
  - POST `/api/staff/users/{userId}/verify-license?staffId=&approved=` → approve/reject renter license in Customers.
    - Note: returns JPA User entity. Prefer `UserResponse` DTO if possible.
- ✅ Uploads (multimedia)
  - POST `/api/vehicles/{vehicleId}/photos` (multipart files[]) → vehicle photos.
  - POST `/api/stations/{stationId}/photo` (multipart file) → station cover.
  - POST `/api/blogs/{blogId}/thumbnail` (multipart file) → blog thumbnail.
- Blogs
  - GET `/api/blogs/my` → staff’s posts.
  - POST `/api/blogs` and PUT `/api/blogs/{blogId}` → author/edit posts from staff UI.

## Page-by-Page Tasks

- ✅ Customers (`/staff/customers`)
  - Bind list to GET `/api/users` (admin-only in docs). For staff: use renter lists via booking joins or fetch by profile when selected.
  - View profile and stats: GET `/api/users/{userId}`, `/api/users/{userId}/stats`.
  - Actions:
    - Verify license: POST `/api/staff/users/{userId}/verify-license?staffId=&approved=`.
    - Support (chat/call): UI hooks only (real-time service pending).
    - Notes/ratings/blacklist: local state until backend endpoints exist.
- ✅ Confirmations (`/staff/confirmations`)
  - List PENDING bookings: GET `/api/bookings/status/PENDING`.
  - Confirm: PATCH `/api/bookings/{bookingId}/confirm` or POST `/api/staff/bookings/{bookingId}/confirm?staffId=`.
- ✅ Active Bookings (`/staff/bookings`)
  - List ACTIVE/CONFIRMED: GET `/api/bookings/status/{status}`.
  - Start/Complete/Cancel: PATCH endpoints accordingly.
  - Payments: GET `/api/payments/booking/{bookingId}` for payment details.
- ✅ Vehicle Inspection (`/staff/vehicles`)
  - List vehicles by station: GET `/api/vehicles/station/{stationId}`.
  - Change status: PATCH `/api/vehicles/{vehicleId}/status`.
  - Upload photos: POST `/api/vehicles/{vehicleId}/photos`.
- ✅ Schedule (`/staff/schedule`)
  - Source tasks from bookings/vehicles:
    - PENDING bookings → Urgent.
    - Vehicles with maintenance status → Important.
    - Misc support tasks → Normal.
  - APIs: GET `/api/bookings/status/{status}`, GET `/api/vehicles/station/{stationId}` with status filters.
- ✅ Staff Reports (`/staff/reports`)
  - Aggregate:
    - Bookings processed (today/week/month): GET `/api/bookings` + date filters or add dashboard aggregation endpoint.
    - Vehicles inspected: count of PATCH `/api/vehicles/{vehicleId}/status` updates to maintenance/checked.
    - Customers supported: count of license verifications or support events.
  - Suggest backend addition: `GET /api/staff/dashboard/station/{stationId}/metrics`.

## Data & Types

- Use types from `@/service/types/*` where available.
- Ensure mapping to DTOs: BookingResponse, BookingDetailResponse, UserResponse, VehicleResponse, StationResponse.
- When endpoint returns JPA entities (StaffController), adapt FE parsing carefully or request DTO change.

## Implementation Checklist

- ✅ Auth header: ensure `apiClient` attaches `Authorization: Bearer <token>`.
- ✅ Error handling: display response `message` on failures.
- ✅ Loading states: show spinners in lists/action buttons.
- Pagination: use page/size for large lists.
- ✅ Date parsing: ISO-8601 (LocalDateTime) without TZ; use `dayjs`/`Date` cautiously.
- ✅ File uploads: use `FormData`; set `Content-Type: multipart/form-data`.

## Suggested Backend Improvements

- Replace JPA entity returns with DTOs on staff endpoints:
  - `/api/staff/bookings/{bookingId}/confirm` → `BookingResponse`/`BookingDetailResponse`.
  - `/api/staff/users/{userId}/verify-license` → `UserResponse`.
- Add: `GET /api/staff/dashboard/station/{stationId}/metrics` for aggregated counters.
- Add: `GET /api/staff/{staffId}/bookings` for staff-assigned tasks.
- Real-time: WebSocket/SSE for booking updates.

## Quick Start Task Order (Easy → Medium)

1. ✅ Wire Customers details and stats (GET user + stats).
2. ✅ Implement bookings list + status filters.
3. ✅ Hook booking confirm/start/complete/cancel actions.
4. ✅ Implement vehicle list + status change + uploads.
5. Add station counts and use in dashboard badges.
6. ✅ Integrate staff-specific verify license.
7. ✅ Build schedule from booking/vehicle data.
8. ✅ Aggregate staff reports; propose dashboard metrics endpoint.
