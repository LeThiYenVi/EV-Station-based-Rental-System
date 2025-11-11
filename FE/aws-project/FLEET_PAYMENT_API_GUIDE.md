# 📚 Fleet & Payment API Documentation

## 🚗 Fleet Management APIs

### Overview

Fleet APIs cho phép quản lý đội xe tại các trạm (chỉ dành cho ADMIN & STAFF).

---

### Import

```typescript
import { fleetService, useFleet } from "@/service";
import type {
  VehicleResponse,
  VehicleStatusSummary,
  VehicleHistoryItemResponse,
} from "@/service";
```

---

### 1. Get Vehicles at Station

**Lấy danh sách xe tại một trạm**

```typescript
// Using hook
const { getVehiclesAtStation } = useFleet();
const vehicles = await getVehiclesAtStation("station-uuid");

// Using service
const vehicles = await fleetService.getVehiclesAtStation("station-uuid");
```

**Requires:** `ADMIN` or `STAFF` role

**Response:**

```typescript
[
  {
    id: string,
    stationId: string,
    licensePlate: string,
    name: string,
    brand: string,
    color: string,
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE",
    dailyRate: number,
    // ... other fields
  },
];
```

---

### 2. Get Status Summary

**Lấy tổng quan trạng thái xe tại trạm**

```typescript
const { getStatusSummary } = useFleet();
const summary = await getStatusSummary("station-uuid");

console.log(summary.totalVehicles); // Tổng số xe
console.log(summary.availableVehicles); // Xe sẵn sàng
console.log(summary.rentedVehicles); // Xe đang cho thuê
console.log(summary.maintenanceVehicles); // Xe bảo trì
```

**Requires:** `ADMIN` or `STAFF` role

**Response:**

```typescript
{
  totalVehicles: number,
  availableVehicles: number,
  rentedVehicles: number,
  maintenanceVehicles: number,
  outOfServiceVehicles: number
}
```

---

### 3. Get Vehicle History

**Lấy lịch sử cho thuê của một xe**

```typescript
const { getVehicleHistory } = useFleet();
const history = await getVehicleHistory("vehicle-uuid");

history.forEach((item) => {
  console.log(item.bookingCode, item.status);
  console.log(item.startTime, item.expectedEndTime);
});
```

**Requires:** `ADMIN` or `STAFF` role

**Response:**

```typescript
[
  {
    bookingId: string,
    bookingCode: string,
    startTime: string,
    expectedEndTime: string,
    actualEndTime?: string,
    status: string,
    renterId: string,
    checkedOutBy: string,
    checkedInBy?: string
  }
]
```

---

### 4. Get Dispatchable Vehicles

**Lấy xe có thể điều phối (rảnh trong khoảng thời gian)**

```typescript
const { getDispatchableVehicles } = useFleet();

const vehicles = await getDispatchableVehicles({
  stationId: "station-uuid",
  start: "2025-01-15T10:00:00",
  end: "2025-01-20T10:00:00",
});

console.log(`Found ${vehicles.length} available vehicles`);
```

**Requires:** `ADMIN` or `STAFF` role

**Use Case:** Tìm xe để đặt cho khách trong khoảng thời gian cụ thể

---

### Fleet Helper Methods

```typescript
// Calculate utilization rate
const rate = fleetService.calculateUtilizationRate(summary);
// Returns: percentage (0-100)

// Get status color
const color = fleetService.getStatusColor("AVAILABLE");
// Returns: 'green' | 'blue' | 'yellow' | 'red' | 'gray'

// Get status text (Vietnamese)
const text = fleetService.getStatusText("RENTED");
// Returns: "Đang cho thuê"

// Format vehicle name
const name = fleetService.formatVehicleName(vehicle);
// Returns: "VinFast VF8 - 30A-12345"

// Check if available
const isAvailable = fleetService.isVehicleAvailable(vehicle);
// Returns: boolean

// Format price
const price = fleetService.formatPrice(1500000);
// Returns: "1.500.000 VNĐ"
```

---

## 💳 Payment APIs

### Overview

Payment APIs để xem thông tin thanh toán và xử lý callback từ payment gateway.

---

### Import

```typescript
import { paymentService, usePayment } from "@/service";
import type { PaymentResponse, PaymentStatus } from "@/service";
```

---

### 1. Get Payment by ID

**Lấy thông tin thanh toán theo ID**

```typescript
const { getPaymentById } = usePayment();
const payment = await getPaymentById("payment-uuid");

console.log(payment.status, payment.amount);
```

**Requires:** `RENTER`, `ADMIN`, or `STAFF` role

---

### 2. Get Payments by Booking ID

**Lấy tất cả thanh toán của một booking**

```typescript
const { getPaymentsByBookingId } = usePayment();
const payments = await getPaymentsByBookingId("booking-uuid");

payments.forEach((p) => {
  console.log(p.method, p.status, p.amount);
});
```

**Requires:** `RENTER`, `ADMIN`, or `STAFF` role

**Use Case:** Hiển thị lịch sử thanh toán trong booking detail

---

### 3. Get Payment by Transaction ID

**Lấy thanh toán theo mã giao dịch**

```typescript
const payment = await paymentService.getPaymentByTransactionId("TXN123456");
```

**Requires:** `RENTER`, `ADMIN`, or `STAFF` role

---

### 4. Process MoMo Callback

**Xử lý callback từ MoMo** (Thường được gọi bởi MoMo server, không phải frontend)

```typescript
// This is typically handled by backend webhook
await paymentService.processMoMoCallback(callbackData);
```

---

### Payment Helper Methods

```typescript
// Check if payment completed
const isCompleted = paymentService.isPaymentCompleted(payment);
// Returns: boolean

// Check if payment pending
const isPending = paymentService.isPaymentPending(payment);
// Returns: boolean

// Get status text (Vietnamese)
const statusText = paymentService.getStatusText("COMPLETED");
// Returns: "Đã thanh toán"

// Get status color
const color = paymentService.getStatusColor("PENDING");
// Returns: 'yellow' | 'blue' | 'green' | 'red' | 'orange' | 'gray'

// Get method text
const methodText = paymentService.getMethodText("MOMO");
// Returns: "MoMo"

// Format amount
const amount = paymentService.formatAmount(1500000);
// Returns: "1.500.000 VNĐ"

// Format payment date
const date = paymentService.formatPaymentDate("2025-01-15T10:30:00");
// Returns: "15/01/2025 10:30"

// Get payment method icon
const icon = paymentService.getMethodIcon("MOMO");
// Returns: "/icons/momo.png"
```

---

## TypeScript Types

### Fleet Types

```typescript
enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  MAINTENANCE = "MAINTENANCE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

interface VehicleResponse {
  id: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  status?: VehicleStatus;
  dailyRate: number;
  hourlyRate: number;
  // ... other fields
}

interface VehicleStatusSummary {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  maintenanceVehicles: number;
  outOfServiceVehicles: number;
}
```

### Payment Types

```typescript
enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

enum PaymentMethod {
  MOMO = "MOMO",
  VNPAY = "VNPAY",
  ZALOPAY = "ZALOPAY",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}

interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  payUrl?: string;
  createdAt: string;
  paidAt?: string;
}
```

---

## Complete Examples

### Fleet Management Dashboard

```typescript
import { useFleet } from '@/hooks/useFleet';
import { useState, useEffect } from 'react';

function FleetDashboard() {
  const [summary, setSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const { getStatusSummary, getVehiclesAtStation } = useFleet();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stationId = 'station-uuid';

    // Load summary
    const summaryData = await getStatusSummary(stationId);
    setSummary(summaryData);

    // Load vehicles
    const vehicleData = await getVehiclesAtStation(stationId);
    setVehicles(vehicleData);
  };

  return (
    <div>
      {/* Display summary cards */}
      {/* Display vehicle list */}
    </div>
  );
}
```

### Payment Details Component

```typescript
import { usePayment } from '@/hooks/usePayment';

function PaymentDetails({ bookingId }) {
  const [payments, setPayments] = useState([]);
  const { getPaymentsByBookingId } = usePayment();

  useEffect(() => {
    loadPayments();
  }, [bookingId]);

  const loadPayments = async () => {
    const data = await getPaymentsByBookingId(bookingId);
    setPayments(data);
  };

  return (
    <div>
      {payments.map(payment => (
        <div key={payment.id}>
          <p>Status: {paymentService.getStatusText(payment.status)}</p>
          <p>Amount: {paymentService.formatAmount(payment.amount)}</p>

          {paymentService.isPaymentPending(payment) && payment.payUrl && (
            <a href={payment.payUrl}>Complete Payment</a>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Integration Tips

### Fleet Management

1. **Load summary first** để hiển thị overview
2. **Refresh data** sau khi status changes
3. **Use dispatchable vehicles** khi booking new vehicle
4. **Show history** để tracking vehicle usage

### Payment

1. **Check payment status** before allowing booking actions
2. **Redirect to payUrl** if payment pending
3. **Show payment history** in booking details
4. **Handle payment methods** với icons riêng

---

**See also:** Example components in `client/components/examples/`
