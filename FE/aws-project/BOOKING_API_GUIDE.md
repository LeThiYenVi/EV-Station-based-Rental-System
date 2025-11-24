# 📚 Booking API Documentation

## Overview

Service để quản lý booking/đặt xe trong hệ thống BF Car Rental.

---

## Import

```typescript
import { bookingService, useBooking } from "@/service";
import type {
  CreateBookingRequest,
  BookingResponse,
  BookingStatus,
} from "@/service";
```

---

## API Methods

### 1. Create Booking

**Tạo booking mới**

```typescript
// Using hook
const { createBooking } = useBooking();

const result = await createBooking({
  vehicleId: "uuid-vehicle-id",
  pickupStationId: "uuid-station-id",
  returnStationId: "uuid-station-id",
  pickupTime: "2025-01-15T10:00:00",
  returnTime: "2025-01-20T10:00:00",
  notes: "Optional notes",
});

if (result) {
  // Check if payment URL exists
  if (result.paymentUrl) {
    window.location.href = result.paymentUrl;
  }
}

// Using service directly
const result = await bookingService.createBooking(data);
```

**Requires:** `RENTER` role

---

### 2. Get Booking by ID

**Lấy chi tiết booking theo ID**

```typescript
const booking = await bookingService.getBookingById("booking-uuid");

console.log(booking.vehicle); // Vehicle details
console.log(booking.renter); // Renter details
console.log(booking.payment); // Payment info
```

**Requires:** `RENTER`, `STAFF`, or `ADMIN` role

---

### 3. Get Booking by Code

**Lấy booking theo mã booking**

```typescript
const booking = await bookingService.getBookingByCode("BK123456");
```

**Requires:** `RENTER`, `STAFF`, or `ADMIN` role

---

### 4. Get All Bookings (Paginated)

**Lấy tất cả bookings với pagination**

```typescript
const result = await bookingService.getAllBookings({
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDirection: "DESC",
});

console.log(result.content); // Array of bookings
console.log(result.totalElements); // Total count
console.log(result.totalPages); // Total pages
```

**Requires:** `STAFF` or `ADMIN` role

---

### 5. Get My Bookings

**Lấy bookings của user hiện tại**

```typescript
const { getMyBookings } = useBooking();

const myBookings = await getMyBookings();

myBookings.forEach((booking) => {
  console.log(booking.bookingCode, booking.status);
});
```

**Requires:** `RENTER` role

---

### 6. Get Bookings by Status

**Lấy bookings theo trạng thái**

```typescript
import { BookingStatus } from "@/service";

const pendingBookings = await bookingService.getBookingsByStatus(
  BookingStatus.PENDING,
);

// Available statuses:
// - BookingStatus.PENDING
// - BookingStatus.CONFIRMED
// - BookingStatus.IN_PROGRESS
// - BookingStatus.COMPLETED
// - BookingStatus.CANCELLED
```

**Requires:** `STAFF` or `ADMIN` role

---

### 7. Get Bookings by Vehicle

**Lấy bookings theo xe**

```typescript
const vehicleBookings =
  await bookingService.getBookingsByVehicleId("vehicle-uuid");
```

**Requires:** `STAFF` or `ADMIN` role

---

### 8. Get Bookings by Station

**Lấy bookings theo trạm**

```typescript
const stationBookings =
  await bookingService.getBookingsByStationId("station-uuid");
```

**Requires:** `STAFF` or `ADMIN` role

---

### 9. Update Booking

**Cập nhật thông tin booking**

```typescript
const updated = await bookingService.updateBooking("booking-id", {
  pickupTime: "2025-01-16T10:00:00",
  returnTime: "2025-01-21T10:00:00",
  notes: "Updated notes",
});
```

**Requires:** `STAFF` or `ADMIN` role

---

### 10. Confirm Booking

**Xác nhận booking**

```typescript
const { confirmBooking } = useBooking();

const confirmed = await confirmBooking("booking-id");

if (confirmed) {
  console.log("Booking confirmed:", confirmed.status);
}
```

**Requires:** `STAFF` or `ADMIN` role

---

### 11. Start Booking

**Bắt đầu booking (xe đã được nhận)**

```typescript
const started = await bookingService.startBooking("booking-id");
```

**Requires:** `STAFF` or `ADMIN` role

---

### 12. Complete Booking

**Hoàn thành booking (xe đã được trả)**

```typescript
const completed = await bookingService.completeBooking("booking-id");
```

**Requires:** `STAFF` or `ADMIN` role

---

### 13. Cancel Booking

**Hủy booking**

```typescript
const { cancelBooking } = useBooking();

if (confirm("Cancel this booking?")) {
  const cancelled = await cancelBooking("booking-id");
  if (cancelled) {
    // Booking cancelled successfully
  }
}
```

**Requires:** `RENTER`, `STAFF`, or `ADMIN` role

---

### 14. Delete Booking

**Xóa booking (hard delete)**

```typescript
const success = await bookingService.deleteBooking("booking-id");
```

**Requires:** `ADMIN` role only

---

## Helper Methods

### Check if Booking Can Be Cancelled

```typescript
const canCancel = bookingService.canCancelBooking(booking);

if (canCancel) {
  // Show cancel button
}
```

### Get Status Display Text

```typescript
const statusText = bookingService.getStatusText(BookingStatus.PENDING);
// Returns: "Chờ xác nhận"
```

### Get Status Color

```typescript
const color = bookingService.getStatusColor(BookingStatus.CONFIRMED);
// Returns: "blue"
```

### Calculate Rental Days

```typescript
const days = bookingService.calculateRentalDays(
  "2025-01-15T10:00:00",
  "2025-01-20T10:00:00",
);
// Returns: 5
```

### Format Booking Date

```typescript
const formatted = bookingService.formatBookingDate("2025-01-15T10:00:00");
// Returns: "15/01/2025 10:00"
```

---

## TypeScript Types

### BookingStatus Enum

```typescript
enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
```

### CreateBookingRequest

```typescript
interface CreateBookingRequest {
  vehicleId: string;
  pickupStationId: string;
  returnStationId: string;
  pickupTime: string; // ISO datetime
  returnTime: string; // ISO datetime
  totalPrice?: number;
  notes?: string;
}
```

### BookingResponse

```typescript
interface BookingResponse {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName?: string;
  renterId: string;
  renterName?: string;
  pickupStationId: string;
  pickupStationName?: string;
  returnStationId: string;
  returnStationName?: string;
  pickupTime: string;
  returnTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### BookingDetailResponse

Extends `BookingResponse` with additional details:

```typescript
interface BookingDetailResponse extends BookingResponse {
  vehicle?: {
    /* vehicle details */
  };
  renter?: {
    /* renter details */
  };
  pickupStation?: {
    /* station details */
  };
  returnStation?: {
    /* station details */
  };
  payment?: {
    /* payment details */
  };
}
```

---

## Complete Example

```typescript
import { useState, useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { BookingStatus } from '@/service';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const {
    getMyBookings,
    cancelBooking,
    loading,
    error
  } = useBooking();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const result = await getMyBookings();
    if (result) {
      setBookings(result);
    }
  };

  const handleCancel = async (id: string) => {
    const result = await cancelBooking(id);
    if (result) {
      loadBookings(); // Reload
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.bookingCode}</h3>
          <p>Status: {booking.status}</p>
          <button onClick={() => handleCancel(booking.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Booking Flow

```
1. User creates booking
   ↓
2. Status: PENDING (waiting for staff confirmation)
   ↓
3. Staff confirms → Status: CONFIRMED
   ↓
4. User picks up vehicle → Status: IN_PROGRESS
   ↓
5. User returns vehicle → Status: COMPLETED

   OR

   User/Staff cancels → Status: CANCELLED
```

---

## Error Handling

```typescript
try {
  const booking = await bookingService.createBooking(data);
} catch (error: any) {
  if (error.response?.status === 403) {
    // Unauthorized - wrong role
  } else if (error.response?.status === 404) {
    // Vehicle or station not found
  } else {
    // Other errors
    console.error(error.response?.data?.message);
  }
}
```

---

## Best Practices

1. **Always check payment URL** after creating booking
2. **Validate dates** before creating booking
3. **Show loading states** during API calls
4. **Handle errors gracefully** with user-friendly messages
5. **Reload data** after status changes
6. **Use helper methods** for formatting and validation

---

**See also:** `useBooking.ts`, `bookingService.ts`, example components
