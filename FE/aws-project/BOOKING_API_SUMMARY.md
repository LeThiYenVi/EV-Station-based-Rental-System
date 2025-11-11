# ✅ Booking API Integration - Complete

## 📦 Files Created

### Booking Service Layer

- ✅ `client/service/booking/bookingService.ts` - 14 API methods
- ✅ `client/service/types/booking.types.ts` - TypeScript interfaces
- ✅ `client/hooks/useBooking.ts` - React hook

### Example Components

- ✅ `client/components/examples/CreateBookingExample.tsx`
- ✅ `client/components/examples/MyBookingsExample.tsx`

### Documentation

- ✅ `BOOKING_API_GUIDE.md` - Complete API documentation

### Configuration Updates

- ✅ `client/service/config/apiConfig.ts` - Added booking endpoints
- ✅ `client/service/index.ts` - Export booking service & types

---

## 🔌 Backend API Coverage (100%)

Tất cả 14 endpoints từ `BookingController` đã được implement:

| Endpoint                           | Method              | Service Method             | Role Required      |
| ---------------------------------- | ------------------- | -------------------------- | ------------------ |
| `POST /api/bookings`               | Create              | `createBooking()`          | RENTER             |
| `GET /api/bookings/:id`            | Get by ID           | `getBookingById()`         | RENTER/STAFF/ADMIN |
| `GET /api/bookings/code/:code`     | Get by code         | `getBookingByCode()`       | RENTER/STAFF/ADMIN |
| `GET /api/bookings`                | Get all (paginated) | `getAllBookings()`         | STAFF/ADMIN        |
| `GET /api/bookings/my-bookings`    | Get my bookings     | `getMyBookings()`          | RENTER             |
| `GET /api/bookings/status/:status` | Get by status       | `getBookingsByStatus()`    | STAFF/ADMIN        |
| `GET /api/bookings/vehicle/:id`    | Get by vehicle      | `getBookingsByVehicleId()` | STAFF/ADMIN        |
| `GET /api/bookings/station/:id`    | Get by station      | `getBookingsByStationId()` | STAFF/ADMIN        |
| `PUT /api/bookings/:id`            | Update              | `updateBooking()`          | STAFF/ADMIN        |
| `PATCH /api/bookings/:id/confirm`  | Confirm             | `confirmBooking()`         | STAFF/ADMIN        |
| `PATCH /api/bookings/:id/start`    | Start               | `startBooking()`           | STAFF/ADMIN        |
| `PATCH /api/bookings/:id/complete` | Complete            | `completeBooking()`        | STAFF/ADMIN        |
| `PATCH /api/bookings/:id/cancel`   | Cancel              | `cancelBooking()`          | RENTER/STAFF/ADMIN |
| `DELETE /api/bookings/:id`         | Delete              | `deleteBooking()`          | ADMIN              |

---

## 🎯 Quick Usage

### Option 1: Using Hook (Recommended)

```typescript
import { useBooking } from "@/hooks/useBooking";

function MyComponent() {
  const { createBooking, getMyBookings, loading, error } = useBooking();

  const handleCreate = async (data) => {
    const result = await createBooking(data);
    if (result?.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  };
}
```

### Option 2: Using Service Directly

```typescript
import { bookingService } from "@/service";

const bookings = await bookingService.getMyBookings();
const booking = await bookingService.getBookingById("uuid");
```

---

## 📊 TypeScript Types

### Enums

```typescript
enum BookingStatus {
  PENDING,
  CONFIRMED,
  IN_PROGRESS,
  COMPLETED,
  CANCELLED,
}
```

### Request Types

- `CreateBookingRequest` - Tạo booking mới
- `UpdateBookingRequest` - Cập nhật booking
- `BookingQueryParams` - Query parameters for pagination

### Response Types

- `BookingResponse` - Basic booking info
- `BookingDetailResponse` - Full details with relations
- `BookingWithPaymentResponse` - Includes payment URL
- `PageResponse<BookingResponse>` - Paginated results

---

## 🛠️ Helper Methods

```typescript
// Check if can cancel
bookingService.canCancelBooking(booking);

// Get status text (Vietnamese)
bookingService.getStatusText(BookingStatus.PENDING); // "Chờ xác nhận"

// Get status color for UI
bookingService.getStatusColor(BookingStatus.CONFIRMED); // "blue"

// Calculate rental days
bookingService.calculateRentalDays(pickupTime, returnTime);

// Format date for display
bookingService.formatBookingDate(dateString); // "15/01/2025 10:00"
```

---

## 📝 Booking Flow

```
CREATE BOOKING (RENTER)
    ↓ status: PENDING
CONFIRM BOOKING (STAFF)
    ↓ status: CONFIRMED
START BOOKING (STAFF)
    ↓ status: IN_PROGRESS
COMPLETE BOOKING (STAFF)
    ↓ status: COMPLETED

* Can CANCEL at PENDING or CONFIRMED status
```

---

## 🎨 Example Components

### Create Booking Form

```typescript
import CreateBookingExample from "@/components/examples/CreateBookingExample";

// Full form with validation
// Handles payment redirect
// Error handling
```

### My Bookings List

```typescript
import MyBookingsExample from "@/components/examples/MyBookingsExample";

// Shows all user bookings
// Status badges with colors
// Cancel functionality
// Formatted dates
```

---

## 🔐 Role-Based Access

| Feature           | RENTER | STAFF | ADMIN |
| ----------------- | ------ | ----- | ----- |
| Create booking    | ✅     | ❌    | ❌    |
| View my bookings  | ✅     | ❌    | ❌    |
| View all bookings | ❌     | ✅    | ✅    |
| Confirm booking   | ❌     | ✅    | ✅    |
| Start/Complete    | ❌     | ✅    | ✅    |
| Cancel booking    | ✅     | ✅    | ✅    |
| Update booking    | ❌     | ✅    | ✅    |
| Delete booking    | ❌     | ❌    | ✅    |

---

## 📚 Documentation

Read `BOOKING_API_GUIDE.md` for:

- Detailed API method documentation
- Complete examples
- Error handling
- Best practices
- TypeScript types reference

---

## ✨ Features

✅ **14 API methods** fully implemented  
✅ **TypeScript types** for all DTOs  
✅ **React hooks** for easy integration  
✅ **Helper methods** for common tasks  
✅ **Example components** ready to use  
✅ **Complete documentation**  
✅ **Role-based access control**  
✅ **Pagination support**  
✅ **Status management**  
✅ **Payment integration**

---

## 🧪 Testing

```typescript
// Test create booking
const booking = await bookingService.createBooking({
  vehicleId: "uuid",
  pickupStationId: "uuid",
  returnStationId: "uuid",
  pickupTime: "2025-01-15T10:00:00",
  returnTime: "2025-01-20T10:00:00",
});

// Test get my bookings
const myBookings = await bookingService.getMyBookings();

// Test cancel
await bookingService.cancelBooking(booking.id);
```

---

## 📂 File Structure

```
client/
├── service/
│   ├── booking/
│   │   └── bookingService.ts      ← 14 API methods
│   ├── types/
│   │   └── booking.types.ts       ← TypeScript interfaces
│   └── index.ts                   ← Exports
├── hooks/
│   └── useBooking.ts              ← React hook
└── components/
    └── examples/
        ├── CreateBookingExample.tsx
        └── MyBookingsExample.tsx
```

---

## 🎯 Integration Points

### Trong Customer Pages:

```typescript
// Car detail page - Book this car
const { createBooking } = useBooking();

// My bookings page
const { getMyBookings } = useBooking();
```

### Trong Admin/Staff Pages:

```typescript
// Booking management
const { getAllBookings, confirmBooking, startBooking } = useBooking();

// Vehicle bookings
const { getBookingsByVehicleId } = useBooking();
```

---

## ⚡ Performance Tips

1. **Use pagination** for large booking lists
2. **Cache booking details** to avoid repeated calls
3. **Debounce search** when filtering bookings
4. **Show loading states** for better UX
5. **Invalidate cache** after status changes

---

## 🔄 Next Steps

1. ✅ Booking APIs ready
2. ⏳ Integrate into existing pages
3. ⏳ Add Vehicle APIs
4. ⏳ Add Station APIs
5. ⏳ Add Payment APIs
6. ⏳ Add Review/Rating APIs

---

**Status: 100% COMPLETE** ✅

Booking service đã sẵn sàng để tích hợp vào ứng dụng!

**See:** `BOOKING_API_GUIDE.md` for detailed documentation
