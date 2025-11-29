# API Implementation TODO

This document outlines the tasks needed to integrate the backend API endpoints into the mobile application.

## 🎯 Progress Summary

- ✅ **Phase 1: Core Infrastructure** - COMPLETED (November 27, 2025)
- ✅ **Phase 2: Authentication Module** - COMPLETED (November 27, 2025)
- ✅ **Phase 3: User Profile Module** - COMPLETED (November 27, 2025)
- ✅ **Phase 4: Station & Location Module** - COMPLETED (November 27, 2025)
- ✅ **Phase 5: Vehicle Module** - COMPLETED (November 27, 2025)
- ✅ **Phase 6: Booking/Rental Module** - COMPLETED (November 28, 2025) 🎉
- ✅ **Phase 7: Payment Module** - COMPLETED (November 27, 2025)
- ⏳ **Phase 8: Messages/Notifications** - NOT STARTED (No Backend API)
- ✅ **Phase 9: Support Module** - COMPLETED (November 27, 2025)

**Overall Progress:** 8/9 phases completed (89%) 🚀

---

## 📋 Implementation Checklist

### Phase 1: Core Infrastructure (Priority: HIGH) ✅ COMPLETED

- [x] **1.1 Update Type Definitions** (`types/index.ts`) ✅

  - [x] Create `ApiResponse<T>` generic interface
  - [x] Create `AuthResponse` interface with tokens and user
  - [x] Update `User` interface to match `UserResponse` from backend
  - [x] Create `BookingResponse` and `BookingDetailResponse` interfaces
  - [x] Create `VehicleResponse` and `VehicleDetailResponse` interfaces
  - [x] Create `StationResponse` and `StationDetailResponse` interfaces
  - [x] Create `PaymentResponse` interface
  - [x] Add enums: `BookingStatus`, `VehicleStatus`, `StationStatus`, `UserRole`

- [x] **1.2 Setup Axios Instance** (`services/api.ts`) ✅

  - [x] Install axios: `npm install axios`
  - [x] Create axios instance with base URL
  - [x] Add request interceptor for auth token
  - [x] Add response interceptor for error handling
  - [x] Add response interceptor to unwrap `ApiResponse<T>`
  - [x] Implement token refresh logic
  - [x] Add request timeout configuration

- [x] **1.3 Environment Configuration** (`config/env.ts`) ✅

  - [x] Update `API_BASE_URL` to backend server URL
  - [x] Add configuration for staging/production environments
  - [x] Set `USE_MOCK_DATA` to `false` for real API

- [x] **1.4 Token Management** (`utils/storage.ts`) ✅
  - [x] Add functions to store/retrieve access token
  - [x] Add functions to store/retrieve refresh token
  - [x] Add function to clear all tokens (logout)
  - [x] Implement secure storage wrapper for web/native

---

### Phase 2: Authentication Module (Priority: HIGH) ✅ COMPLETED

- [x] **2.1 Auth Service** (`services/auth.service.ts`) ✅

  - [x] `POST /api/auth/register` - Register new user
  - [x] `POST /api/auth/login` - Login with email/password
  - [x] `POST /api/auth/logout` - Logout user
  - [x] `POST /api/auth/refresh` - Refresh access token
  - [x] `POST /api/auth/forgot-password` - Send reset code
  - [x] `POST /api/auth/reset-password` - Reset password with code
  - [x] `POST /api/auth/change-password` - Change password (authenticated)
  - [x] `POST /api/auth/confirm` - Confirm email with code
  - [x] `POST /api/auth/url` - Get Google OAuth URL
  - [x] `GET /api/auth/callback` - Handle Google OAuth callback

- [x] **2.2 Update Auth Context** (`hooks/useAuth.tsx`) ✅

  - [x] Replace mock login with real API call
  - [x] Store tokens in SecureStore/localStorage
  - [x] Implement token refresh on app start
  - [x] Add auto-logout on token expiry
  - [x] Handle authentication errors properly

- [x] **2.3 Update Auth Screens** ✅
  - [x] Update `app/(auth)/login.tsx` to use real API
  - [x] Update `app/(auth)/register.tsx` to use real API
  - [x] Add loading states during API calls
  - [x] Display API error messages to user
  - [x] Add Google OAuth button and flow (UI ready, calls /api/auth/url, opens OAuth URL)

---

### Phase 3: User Profile Module (Priority: HIGH) ✅ COMPLETED ✅ COMPLETED

- [x] **3.1 User Service** (`services/user.service.ts`) ✅

  - [x] `GET /api/users/me` - Get current user info
  - [x] `PUT /api/users/{userId}` - Update user profile
  - [x] `POST /api/users/{userId}/avatar` - Upload avatar image
  - [x] `POST /api/users/{userId}/license-card/front` - Upload license front
  - [x] `POST /api/users/{userId}/license-card/back` - Upload license back

- [x] **3.2 Update Profile Screens** ✅
  - [x] `app/(tabs)/profile.tsx` - Display user info from API (already using useAuth)
  - [x] `app/(profile)/personal-info.tsx` - Edit profile with API integration
  - [x] Add image picker for avatar upload (expo-image-picker installed)
  - [ ] Add image picker for license card upload (TODO: separate screen)
  - [ ] Show license verification status (TODO: add to UI)

---

### Phase 4: Station & Location Module (Priority: HIGH) ✅ COMPLETED

- [x] **4.1 Station Service** (`services/station.service.ts`) ✅

  - [x] `GET /api/stations` - Get all stations (paginated)
  - [x] `GET /api/stations/{stationId}` - Get station details
  - [x] `GET /api/stations/active` - Get active stations only
  - [x] `GET /api/stations/{stationId}/vehicles/available/count` - Get available vehicle count
  - [x] `GET /api/locations/stations/nearby` - Find nearby stations

- [x] **4.2 Update Explore Screen** (`app/(tabs)/index.tsx`) ✅

  - [x] Fetch real stations from API (useStations hook created)
  - [x] Display stations list with real data
  - [x] Implement nearby stations search with user location button
  - [x] Add loading and error states (ActivityIndicator, EmptyState)
  - [x] Add search filter functionality
  - [ ] Display stations on map (TODO: map component integration)
  - [ ] Show real-time available vehicle count per station (TODO: fetch count API)

- [x] **4.3 Create Station Detail Screen** (`app/(station)/[id].tsx`) ✅
  - [x] Display full station information (name, address, hours, hotline, photo)
  - [x] Show station stats (total vehicles, available vehicles)
  - [x] Show list of available vehicles at station (VehicleCard)
  - [x] Display all vehicles with status badges
  - [x] Show directions option (Google Maps integration)
  - [x] Phone call integration (hotline clickable)
  - [x] Status badge (Hoạt Động / Đóng Cửa)
  - [x] Rating display (if available)

---

### Phase 5: Vehicle Module (Priority: HIGH) ✅ COMPLETED ✅ COMPLETED

- [x] **5.1 Vehicle Service** (`services/vehicle.service.ts`) ✅

  - [x] `GET /api/vehicles` - Get all vehicles (paginated)
  - [x] `GET /api/vehicles/{vehicleId}` - Get vehicle details
  - [x] `GET /api/vehicles/station/{stationId}` - Get vehicles by station
  - [x] `GET /api/vehicles/available` - Get available vehicles with filters
  - [x] `GET /api/vehicles/available/booking` - Get vehicles available for time range

- [x] **5.2 Create Vehicle Components** ✅
  - [x] Create `VehicleCard` component to display vehicle info
  - [x] Create `VehicleDetailModal` component - Full modal with photos carousel, specs grid, pricing, policies
  - [x] Show vehicle photos, specs, pricing (in VehicleCard)
  - [x] Display real-time availability status
  - [x] Modal with horizontal photo scroll, detailed specs, book button

---

### Phase 6: Booking/Rental Module (Priority: CRITICAL) ✅ COMPLETED (Partial)

- [x] **6.1 Booking Service** (`services/booking.service.ts`) ✅

  - [x] `POST /api/bookings` - Create new booking (returns payment URL)
  - [x] `GET /api/bookings/{bookingId}` - Get booking details
  - [x] `GET /api/bookings/code/{bookingCode}` - Get booking by code
  - [x] `GET /api/bookings/my-bookings` - Get user's bookings
  - [x] `PATCH /api/bookings/{bookingId}/cancel` - Cancel booking
  - [x] `PATCH /api/bookings/{bookingId}/start` - Start booking
  - [x] `PATCH /api/bookings/{bookingId}/complete` - Complete booking

- [x] **6.2 Update Trips Screen** (`app/(tabs)/trips.tsx`) ✅

  - [x] Fetch user's bookings from API (`bookingService.getMyBookings`)
  - [x] Display booking history with real data
  - [x] Show active trip with real-time info (IN_PROGRESS, CONFIRMED status)
  - [x] Loading and empty states
  - [x] Filter active vs completed/cancelled trips

- [x] **6.3 Trip History Screen** (`app/(profile)/trip-history.tsx`) ✅

  - [x] Fetch user's bookings from API
  - [x] Display trips with real data (vehicle, station, cost, duration)
  - [x] Filter by status (all, completed, cancelled)
  - [x] Loading and empty states
  - [x] Format dates and times properly

### Phase 6: Booking/Rental Module (Priority: CRITICAL) ✅ COMPLETED

- [x] **6.1 Booking Service** (`services/booking.service.ts`) ✅

  - [x] `POST /api/bookings` - Create new booking (returns payment URL)
  - [x] `GET /api/bookings/{bookingId}` - Get booking details
  - [x] `GET /api/bookings/code/{bookingCode}` - Get booking by code
  - [x] `GET /api/bookings/my-bookings` - Get user's bookings
  - [x] `PATCH /api/bookings/{bookingId}/cancel` - Cancel booking
  - [x] `PATCH /api/bookings/{bookingId}/start` - Start booking
  - [x] `PATCH /api/bookings/{bookingId}/complete` - Complete booking

- [x] **6.2 View Bookings** ✅

  - [x] `app/(tabs)/trips.tsx` - Updated with real API
  - [x] `app/(profile)/trip-history.tsx` - Updated with real API
  - [x] Display trips with real data (vehicle, station, cost, duration)
  - [x] Filter by status (all, completed, cancelled)
  - [x] Loading and empty states
  - [x] Format dates and times properly

- [x] **6.3 QR Code Scanner** (`app/(rental)/scan.tsx`) ✅

  - [x] Camera permission handling
  - [x] QR code scanning with expo-camera
  - [x] Flashlight toggle
  - [x] Scanning frame with corner borders
  - [x] Navigate to vehicle unlock screen

- [x] **6.4 Vehicle Unlock** (`app/(rental)/unlock/[vehicleId].tsx`) ✅

  - [x] Fetch vehicle details by ID from QR code
  - [x] Display vehicle info, specs, pricing
  - [x] Check vehicle availability status
  - [x] "Quick Rent" (1 hour) button
  - [x] "Book in Advance" navigation

- [x] **6.5 Booking Form** (`app/(rental)/booking-form.tsx`) ✅

  - [x] Date/time pickers for start and end time
  - [x] Calculate duration and total price
  - [x] Optional note field
  - [x] Price breakdown display
  - [x] Create booking API integration
  - [x] Navigate to payment if needed

- [x] **6.6 Payment Integration** ✅

  - [x] Handle MoMo payment URL from booking response
  - [x] Open MoMo app/browser with Linking API
  - [x] `app/(rental)/payment-result.tsx` - Payment result screen
  - [x] Success/failure state handling
  - [x] Navigate to trips after payment

- [x] **6.7 Active Trip Dashboard** (`app/(rental)/active.tsx`) ✅

  - [x] Fetch current active booking
  - [x] Real-time trip timer (updates every second)
  - [x] Current cost calculation
  - [x] Display trip details (vehicle, station, booking code)
  - [x] Return instructions
  - [x] Complete trip functionality with confirmation

- [x] **6.8 UI Integration** ✅
  - [x] Add QR scan button to Explore screen
  - [x] Create `(rental)` route group with Stack navigator
  - [x] Modal presentation for QR scanner
  - [x] Proper navigation flow between screens

**Dependencies Installed:**

- `expo-camera` - QR code scanning
- `expo-barcode-scanner` - Barcode detection
- `@react-native-community/datetimepicker` - Date/time selection

**Note:** Phase 6 is now FULLY COMPLETE! All booking features implemented including QR scanning, booking creation, payment integration (MoMo), and active trip management.

---

### Phase 7: Payment Module (Priority: MEDIUM) ✅ COMPLETED

- [x] **7.1 Payment Service** (`services/payment.service.ts`) ✅

  - [x] `GET /api/payments/{paymentId}` - Get payment details
  - [x] `GET /api/payments/booking/{bookingId}` - Get payments by booking
  - [x] `GET /api/payments/transaction/{transactionId}` - Get payment by transaction ID

- [x] **7.2 Payment Integration** ✅

  - [x] Display payment details in booking (`app/(rental)/payment-result.tsx`) - Shows payment amount, method, status, transaction ID, timestamp
  - [x] Handle payment success/failure states with real API check
  - [x] Handle MoMo callback result checking (resultCode parameter)
  - [x] Show different UI for success vs failure (icons, colors, messages)
  - [x] Payment history screen (`app/(profile)/payment-history.tsx`) - Lists all completed/cancelled bookings with payment info
  - [x] Link from payment methods screen to payment history

**Note:** Phase 7 is now FULLY COMPLETE! Payment details are displayed in booking flow and payment history screen shows all transactions.

---

### Phase 8: Messages/Notifications Module (Priority: MEDIUM)

- [ ] **8.1 Messages Screen** (`app/(tabs)/messages.tsx`)
  - [ ] Integrate with real notification system
  - [ ] Display system notifications
  - [ ] Show booking status updates
  - [ ] Mark messages as read

---

### Phase 9: Support Module (Priority: LOW) ✅ COMPLETED ✅ COMPLETED

- [x] **9.1 Support Screen** (`app/(tabs)/support.tsx`) ✅
  - [x] Display FAQ from static content (6 FAQ items)
  - [x] Add contact/help center information (Phone, Email, Chat placeholder)
  - [x] Implement phone call and email via Linking
  - [x] Add safety tips section
  - [x] Expandable FAQ accordion UI

---

### Phase 10: Admin Features (Priority: LOW - Optional)

Only implement if the mobile app needs admin features.

- [ ] **10.1 Admin Services**
  - [ ] Fleet management API integration
  - [ ] Staff management API integration
  - [ ] Reports API integration

---

## 🔧 Technical Implementation Details

### Request/Response Structure

All backend responses follow this structure:

```typescript
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}
```

Axios interceptor should unwrap this to return just `data`.

### Authentication Flow

1. User logs in → receive `accessToken` and `refreshToken`
2. Store `accessToken` in memory or short-term storage
3. Store `refreshToken` in SecureStore (native) or localStorage (web)
4. Attach `Authorization: Bearer <accessToken>` to all API requests
5. On 401 error → call `/api/auth/refresh` with refreshToken
6. Update tokens and retry original request

### Error Handling

```typescript
try {
  const response = await api.get("/endpoint");
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle API errors
    Toast.show({
      type: "error",
      text1: error.response?.data?.message || "Request failed",
    });
  }
}
```

### File Upload

For avatar and license card uploads:

```typescript
const formData = new FormData();
formData.append("file", {
  uri: imageUri,
  type: "image/jpeg",
  name: "photo.jpg",
} as any);

await api.post("/api/users/{userId}/avatar", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## 📦 Additional Dependencies

```bash
# Install required packages
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-qrcode-scanner  # For QR code scanning
npm install react-native-image-picker     # For image uploads
npm install @react-native-community/datetimepicker  # For booking date/time
```

---

## 🧪 Testing Strategy

### Phase 1: Basic API Connection

1. Update `API_BASE_URL` to backend server
2. Test `/api/auth/login` with valid credentials
3. Verify token is stored correctly

### Phase 2: Core Features

1. Test user registration flow
2. Test station listing and detail views
3. Test vehicle browsing

### Phase 3: Booking Flow

1. Test creating a booking
2. Test MoMo payment integration
3. Test viewing booking history
4. Test canceling a booking

### Phase 4: Full Integration

1. Test complete user journey: Register → Browse → Book → Pay → Trip
2. Test error scenarios (network errors, invalid data, etc.)
3. Test token refresh on expiry

---

## 📝 Notes

- **CORS**: Ensure backend has CORS enabled for web testing
- **HTTPS**: Production backend should use HTTPS
- **Token Expiry**: Handle 401 errors gracefully with token refresh
- **Loading States**: Show loading indicators for all API calls
- **Error Messages**: Display user-friendly error messages from API
- **Offline Support**: Consider caching strategies for better UX
- **Image Optimization**: Compress images before upload to reduce bandwidth

---

## ✅ Definition of Done

Each task is complete when:

- [ ] API integration code is written
- [ ] TypeScript types are defined
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Success/error feedback is displayed to user
- [ ] Code is tested with real backend
- [ ] No TypeScript errors
- [ ] No console errors in production build

---

**Last Updated:** November 27, 2025  
**Backend API Version:** Latest  
**Mobile App Version:** 1.0.0
