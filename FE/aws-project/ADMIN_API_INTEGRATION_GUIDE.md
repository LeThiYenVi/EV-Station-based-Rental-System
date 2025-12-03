# Admin API Integration Guide

## ✅ Đã hoàn thành

### 1. Admin Service Layer (`client/services/admin.service.ts`)

Đã tạo hoàn chỉnh service layer với tất cả endpoints từ `AdminApi.md`:

#### Dashboard APIs

```typescript
import adminService from "@/services/admin.service";

// GET /api/admin/dashboard/summary
const summary = await adminService.dashboard.getDashboardSummary();

// GET /api/admin/dashboard/revenue-chart
const revenueChart = await adminService.dashboard.getRevenueChart();

// GET /api/admin/dashboard/vehicle-status
const vehicleStatus =
  await adminService.dashboard.getVehicleStatusDistribution();

// GET /api/admin/dashboard/booking-by-type
const bookingByType = await adminService.dashboard.getBookingByType();

// GET /api/admin/dashboard/new-bookings
const newBookings = await adminService.dashboard.getNewBookings();

// GET /api/admin/dashboard/booking-performance
const performance = await adminService.dashboard.getBookingPerformance();

// GET /api/admin/dashboard/maintenance-overview
const maintenance = await adminService.dashboard.getMaintenanceOverview();
```

#### User Management APIs

```typescript
// GET /api/admin/users/metrics
const metrics = await adminService.users.getUserMetrics();

// GET /api/admin/users/filter
const users = await adminService.users.filterUsers({
  name: "Nguyen",
  role: "renter",
  verification: true,
});

// GET /api/admin/users
const allUsers = await adminService.users.getAllUsers();

// POST /api/admin/staff/attach-to-station
await adminService.users.attachStaffToStation(staffId, stationId);
```

#### Vehicle Management APIs

```typescript
// GET /api/admin/vehicles/metrics
const metrics = await adminService.vehicles.getVehicleMetrics();

// GET /api/admin/vehicles/search
const vehicles = await adminService.vehicles.searchVehicles("Tesla");

// GET /api/admin/vehicles/filter
const filtered = await adminService.vehicles.filterVehicles({
  status: "available",
  capacity: 5,
});

// POST /api/vehicles
const newVehicle = await adminService.vehicles.createVehicle({
  stationId: "...",
  licensePlate: "30A-12345",
  name: "Tesla Model 3",
  brand: "Tesla",
  fuelType: "ELECTRIC",
  capacity: 5,
  hourlyRate: 150000,
  dailyRate: 1200000,
  depositAmount: 10000000,
});

// PUT /api/vehicles/{vehicleId}
await adminService.vehicles.updateVehicle(vehicleId, { name: "..." });

// DELETE /api/vehicles/{vehicleId}
await adminService.vehicles.deleteVehicle(vehicleId);

// PATCH /api/vehicles/{vehicleId}/status
await adminService.vehicles.changeVehicleStatus(vehicleId, "maintenance");

// POST /api/vehicles/{vehicleId}/photos
await adminService.vehicles.uploadVehiclePhotos(vehicleId, [file1, file2]);
```

#### Booking Management APIs

```typescript
// GET /api/admin/bookings/metrics
const metrics = await adminService.bookings.getBookingMetrics();

// GET /api/admin/bookings
const bookings = await adminService.bookings.getAllBookings();

// POST /api/staff/bookings/{bookingId}/confirm
await adminService.bookings.confirmBooking(bookingId, staffId);
```

#### Revenue Analytics APIs

```typescript
// GET /api/admin/revenue/yearly-comparison
const comparison = await adminService.revenue.getYearlyComparison();

// GET /api/admin/revenue/by-year
const byYear = await adminService.revenue.getRevenueByYear(5);

// GET /api/admin/revenue/detail
const detail = await adminService.revenue.getDetailRevenue();
```

#### Top Performers APIs

```typescript
// GET /api/admin/top-vehicles
const topVehicles = await adminService.topPerformers.getTopVehicles(10);

// GET /api/admin/top-customers
const topCustomers = await adminService.topPerformers.getTopCustomers(10);
```

#### Station Management APIs

```typescript
// POST /api/stations
const station = await adminService.stations.createStation({
  name: "Trạm Quận 1",
  address: "123 Đường ABC",
  latitude: 10.762622,
  longitude: 106.660172,
});

// PUT /api/stations/{stationId}
await adminService.stations.updateStation(stationId, { name: "..." });

// DELETE /api/stations/{stationId}
await adminService.stations.deleteStation(stationId);

// PATCH /api/stations/{stationId}/status
await adminService.stations.changeStationStatus(stationId, "ACTIVE");

// POST /api/stations/{stationId}/photo
await adminService.stations.uploadStationPhoto(stationId, file);

// GET /api/staff/by-station
const staff = await adminService.stations.getStaffByStation(stationId);
```

---

## 🚧 Cần tích hợp vào UI Components

### Dashboard.tsx

**Thay thế mock data bằng API calls:**

```typescript
import { useState, useEffect } from "react";
import adminService from "@/services/admin.service";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [vehicleStatusData, setVehicleStatusData] = useState<any[]>([]);
  const [bookingByTypeData, setBookingByTypeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          summaryRes,
          revenueChartRes,
          vehicleStatusRes,
          bookingByTypeRes,
        ] = await Promise.all([
          adminService.dashboard.getDashboardSummary(),
          adminService.dashboard.getRevenueChart(),
          adminService.dashboard.getVehicleStatusDistribution(),
          adminService.dashboard.getBookingByType(),
        ]);

        setDashboardData(summaryRes.data);
        setRevenueChartData(revenueChartRes.data);

        // Map API data to chart format
        const statusDist = vehicleStatusRes.data;
        setVehicleStatusData([
          {
            name: "Available",
            value: statusDist.availableCount,
            color: "#10b981",
          },
          {
            name: "On Going",
            value: statusDist.onGoingCount,
            color: "#f59e0b",
          },
          {
            name: "Maintenance",
            value: statusDist.maintenanceCount,
            color: "#ef4444",
          },
        ]);

        setBookingByTypeData(bookingByTypeRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use dashboardData.userReport, vehicleReport, bookingReport, revenueReport
  const stats = dashboardData
    ? {
        users: {
          total: dashboardData.userReport.totalUser,
          verified: dashboardData.userReport.totalVerifiedUser,
          blocked: dashboardData.userReport.totalBlockedUser,
        },
        vehicles: {
          total: dashboardData.vehicleReport.totalVehicles,
          available: dashboardData.vehicleReport.totalAvailable,
          rented: dashboardData.vehicleReport.totalOnGoing,
          maintenance: dashboardData.vehicleReport.totalMaintenance,
        },
        bookings: {
          total: dashboardData.bookingReport.totalBooking,
          confirmed: dashboardData.bookingReport.totalConfirmBooking,
          active: dashboardData.bookingReport.totalOnGoingBooking,
        },
        revenue: {
          today: dashboardData.revenueReport.todayRevenue,
          total: dashboardData.bookingReport.totalRevenueFromCompletedBooking,
          growth: dashboardData.revenueReport.growthPercentage,
        },
      }
    : null;

  // ... rest of component
}
```

---

### Users.tsx

**Thay thế mock data:**

```typescript
import adminService from "@/services/admin.service";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchMetrics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.users.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await adminService.users.getUserMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const handleFilterUsers = async (filters: any) => {
    try {
      const response = await adminService.users.filterUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to filter users:", error);
    }
  };

  // Display metrics.totalUser, metrics.totalVerifiedUser, metrics.totalBlockedUser
}
```

---

### Vehicles.tsx

**Thay thế mock data:**

```typescript
import adminService from "@/services/admin.service";
import { useEffect, useState } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchVehicles();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await adminService.vehicles.getVehicleMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      // Có thể dùng filterVehicles() hoặc searchVehicles()
      const response = await adminService.vehicles.filterVehicles({});
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (data: any) => {
    try {
      await adminService.vehicles.createVehicle(data);
      fetchVehicles(); // Refresh list
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    }
  };

  const handleUpdateVehicle = async (vehicleId: string, data: any) => {
    try {
      await adminService.vehicles.updateVehicle(vehicleId, data);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to update vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await adminService.vehicles.deleteVehicle(vehicleId);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleChangeStatus = async (vehicleId: string, status: string) => {
    try {
      await adminService.vehicles.changeVehicleStatus(vehicleId, status);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };
}
```

---

### Bookings.tsx

**Thay thế mock data:**

```typescript
import adminService from "@/services/admin.service";
import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchBookings();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await adminService.bookings.getBookingMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await adminService.bookings.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string, staffId: string) => {
    try {
      await adminService.bookings.confirmBooking(bookingId, staffId);
      fetchBookings(); // Refresh
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
  };

  // Display metrics.totalBooking, metrics.totalRevenueFromCompletedBooking, etc.
}
```

---

### Reports.tsx

**Tích hợp Revenue Analytics:**

```typescript
import adminService from "@/services/admin.service";
import { useEffect, useState } from "react";

export default function Reports() {
  const [yearlyComparison, setYearlyComparison] = useState<any>(null);
  const [revenueByYear, setRevenueByYear] = useState<any[]>([]);
  const [detailRevenue, setDetailRevenue] = useState<any>(null);
  const [topVehicles, setTopVehicles] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchRevenueData();
    fetchTopPerformers();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const [comparison, byYear, detail] = await Promise.all([
        adminService.revenue.getYearlyComparison(),
        adminService.revenue.getRevenueByYear(5),
        adminService.revenue.getDetailRevenue(),
      ]);

      setYearlyComparison(comparison.data);
      setRevenueByYear(byYear.data);
      setDetailRevenue(detail.data);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      const [vehicles, customers] = await Promise.all([
        adminService.topPerformers.getTopVehicles(8),
        adminService.topPerformers.getTopCustomers(8),
      ]);

      setTopVehicles(vehicles.data);
      setTopCustomers(customers.data);
    } catch (error) {
      console.error("Failed to fetch top performers:", error);
    }
  };

  // Display yearlyComparison, revenueByYear charts
  // Display detailRevenue.revenueFromRental, detailRevenue.revenueFromExtraFee
  // Display topVehicles, topCustomers lists
}
```

---

## 📋 Type Mapping: API Response → Frontend Types

### Dashboard Summary

```typescript
// API Response
{
  userReport: {
    totalUser: number,
    totalVerifiedUser: number,
    totalBlockedUser: number
  },
  vehicleReport: {
    totalVehicles: number,
    totalAvailable: number,
    totalOnGoing: number,
    totalMaintenance: number
  },
  bookingReport: {
    totalBooking: number,
    totalConfirmBooking: number,
    totalOnGoingBooking: number,
    totalRevenueFromCompletedBooking: number
  },
  revenueReport: {
    todayRevenue: number,
    lastPeriodRevenue: number,
    growthPercentage: number
  }
}
```

### User Response

```typescript
{
  id: string,
  email: string,
  fullName: string,          // ⚠️ camelCase (API trả về)
  phone: string,
  role: string,
  licenseNumber?: string,    // ⚠️ camelCase
  identityNumber?: string,
  isLicenseVerified?: boolean,
  verifiedAt?: string,
  stationId?: string,
  totalBookings?: number,
  createdAt: string,
  updatedAt: string
}
```

### Vehicle Response

```typescript
{
  id: string,
  stationId: string,
  licensePlate: string,
  name: string,
  brand: string,
  fuelType: string,          // ⚠️ API dùng "fuelType", ERD dùng "type"
  capacity: number,
  photos: string[],          // ⚠️ API dùng "photos", ERD có thể dùng "images"
  status: string,
  hourlyRate: number,
  dailyRate: number,
  depositAmount: number,
  polices: string[],         // ⚠️ typo "polices" thay vì "policies"
  createdAt: string,
  updatedAt: string
}
```

### Booking Response

```typescript
{
  id: string,
  bookingCode: string,
  renterId: string,
  renterName: string,
  vehicleId: string,
  vehicleName: string,
  licensePlate: string,
  stationId: string,
  stationName: string,
  startTime: string,
  expectedEndTime: string,
  actualEndTime?: string,
  status: string,
  checkedOutById?: string,
  checkedInById?: string,
  basePrice: number,
  depositPaid: number,
  extraFee: number,
  totalAmount: number,
  pickupNote?: string,
  returnNote?: string,
  paymentStatus: string,
  createdAt: string,
  updatedAt: string
}
```

---

## ⚠️ Lưu ý quan trọng

### 1. Field Name Mismatch

- **API trả camelCase**: `fullName`, `licenseNumber`, `identityNumber`
- **Frontend mock dùng snake_case**: `full_name`, `license_number`, `identity_number`
- **Giải pháp**: Cần map từ API response sang frontend types hoặc chuẩn hóa 1 format

### 2. Vehicle Type Field

- **API**: `fuelType` (string): "ELECTRIC", "GASOLINE"
- **ERD**: `type` (string)
- **Giải pháp**: Đổi tên field trong frontend hoặc map khi nhận data

### 3. Authentication

- Tất cả admin endpoints yêu cầu **JWT token** trong header `Authorization: Bearer <token>`
- Đảm bảo axios interceptor đã thêm token vào mọi request

### 4. Error Handling

- API trả về `ApiResponse<T>` wrapper
- Cần check `response.data.statusCode` và `response.data.message`
- Hiển thị toast/notification khi có lỗi

### 5. Loading States

- Luôn có `loading` state khi gọi API
- Hiển thị skeleton/spinner khi `loading === true`
- Disable buttons khi đang submit

---

## 🔄 Next Steps

1. ✅ **Service layer đã xong** - Tất cả API endpoints đã được implement
2. 🚧 **Update Dashboard.tsx** - Thay mock data bằng real API
3. 🚧 **Update Users.tsx** - Tích hợp user management APIs
4. 🚧 **Update Vehicles.tsx** - Tích hợp vehicle management APIs
5. 🚧 **Update Bookings.tsx** - Tích hợp booking management APIs
6. 🚧 **Update Reports.tsx** - Tích hợp revenue analytics APIs
7. ⏳ **Field mapping** - Chuẩn hóa camelCase vs snake_case
8. ⏳ **Error handling** - Add error boundaries và toast notifications
9. ⏳ **Type safety** - Replace `any` types với proper interfaces

---

## 📚 Tài liệu tham khảo

- **AdminApi.md**: Spec đầy đủ của backend API
- **admin.service.ts**: Service layer implementation
- **types/api.ts**: API response type definitions
