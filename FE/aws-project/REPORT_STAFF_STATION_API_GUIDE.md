# Report, Staff & Station APIs - Integration Guide

## 📋 Tổng Quan

Module này bao gồm 3 controllers chính:

- **ReportController**: Báo cáo và phân tích cho admin
- **StaffController**: Quản lý nhân viên theo trạm
- **StationController**: Quản lý trạm/điểm cho thuê

**Tổng số APIs**: 18 phương thức

---

## 🔐 Phân Quyền

### Report APIs

- Tất cả endpoint: `ADMIN` only (trừ customer-risk cho phép `STAFF`)

### Staff APIs

- Get staff by station: `ADMIN` hoặc `MANAGER`

### Station APIs

- Create, Update, Delete: `ADMIN` only
- Upload Photo: `ADMIN` hoặc `STAFF`
- Get operations: Public (không yêu cầu auth)

---

## 📊 Report Service (5 APIs)

### 1. Revenue by Station

```typescript
import { useReport } from "@/hooks/useReport";

const { getRevenueByStation } = useReport();

// Lấy báo cáo doanh thu theo trạm
const result = await getRevenueByStation({
  start: new Date("2024-01-01"),
  end: new Date("2024-01-31"),
  stationId: "123e4567-e89b-12d3-a456-426614174000", // Optional
});

if (result.success) {
  result.data.forEach((station) => {
    console.log(station.stationName);
    console.log(station.totalRevenue); // Tổng doanh thu
    console.log(station.totalBookings); // Số booking
    console.log(station.averageBookingValue); // Giá trị trung bình
  });
}
```

### 2. Utilization Report

```typescript
// Báo cáo tỷ lệ sử dụng xe
const result = await getUtilization({
  start: new Date("2024-01-01"),
  end: new Date("2024-01-31"),
});

if (result.success) {
  result.data.forEach((station) => {
    console.log(station.utilizationRate); // 0-100
    console.log(station.totalRentalHours); // Tổng giờ thuê
    console.log(station.availableHours); // Giờ khả dụng
  });
}
```

### 3. Peak Hours Report

```typescript
// Báo cáo giờ cao điểm
const result = await getPeakHours({
  start: new Date("2024-01-01"),
  end: new Date("2024-01-31"),
});

if (result.success) {
  result.data.forEach((hour) => {
    console.log(hour.hour); // 0-23
    console.log(hour.bookingCount); // Số booking trong giờ đó
  });
}
```

### 4. Staff Performance

```typescript
// Báo cáo hiệu suất nhân viên
const result = await getStaffPerformance({
  start: new Date("2024-01-01"),
  end: new Date("2024-01-31"),
  stationId: "uuid-optional",
});

if (result.success) {
  result.data.forEach((staff) => {
    console.log(staff.staffName);
    console.log(staff.completedBookings);
    console.log(staff.totalRevenue);
    console.log(staff.customerRating); // 0-5
  });
}
```

### 5. Customer Risk Assessment

```typescript
// Đánh giá rủi ro khách hàng
const result = await getCustomerRisk(3); // minBookings = 3

if (result.success) {
  result.data.forEach((customer) => {
    console.log(customer.customerName);
    console.log(customer.cancellationRate); // Tỷ lệ hủy (%)
    console.log(customer.lateReturns); // Số lần trả muộn
    console.log(customer.riskLevel); // LOW, MEDIUM, HIGH, CRITICAL
    console.log(customer.riskScore); // 0-100
  });
}
```

---

## 👥 Staff Service (1 API)

### Get Staff by Station

```typescript
import { useStaff } from "@/hooks/useStaff";

const { getStaffByStation } = useStaff();

// Lấy danh sách nhân viên tại một trạm
const result = await getStaffByStation("station-uuid");

if (result.success) {
  result.data.forEach((staff) => {
    console.log(staff.fullName);
    console.log(staff.email);
    console.log(staff.role); // ADMIN, MANAGER, STAFF, RENTER
    console.log(staff.isActive);
  });
}
```

---

## 🏢 Station Service (12 APIs)

### 1. Create Station (ADMIN)

```typescript
import { useStation } from "@/hooks/useStation";

const { createStation } = useStation();

const result = await createStation({
  name: "VinFast Station Quận 1",
  address: "123 Nguyễn Huệ",
  city: "Hồ Chí Minh",
  district: "Quận 1",
  ward: "Phường Bến Nghé",
  phoneNumber: "0901234567",
  email: "station@vinfast.vn",
  latitude: 10.7769,
  longitude: 106.7009,
  openingTime: "08:00",
  closingTime: "20:00",
});

if (result.success) {
  console.log("Station created:", result.data.id);
}
```

### 2. Update Station (ADMIN)

```typescript
const result = await updateStation("station-uuid", {
  name: "VinFast Station Quận 1 (Updated)",
  phoneNumber: "0901234568",
});
```

### 3. Get Station by ID

```typescript
const result = await getStationById("station-uuid");

if (result.success) {
  console.log(result.data.name);
  console.log(result.data.address);
  console.log(result.data.totalVehicles);
  console.log(result.data.availableVehicles);
  console.log(result.data.vehicles); // Array of vehicles
  console.log(result.data.staff); // Array of staff
}
```

### 4. Get All Stations (Paginated)

```typescript
const result = await getAllStations({
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDirection: "DESC",
});

if (result.success) {
  console.log(result.data.content); // Array of stations
  console.log(result.data.totalElements); // Total count
  console.log(result.data.totalPages); // Total pages
}
```

### 5. Get Active Stations

```typescript
const result = await getActiveStations();

if (result.success) {
  // Only stations with status = ACTIVE
  result.data.forEach((station) => {
    console.log(station.name);
  });
}
```

### 6. Get Stations by Status

```typescript
import { StationStatus } from "@/service/types/report-staff-station.types";

const result = await getStationsByStatus(StationStatus.ACTIVE);
// StationStatus: ACTIVE | INACTIVE | MAINTENANCE | CLOSED
```

### 7. Delete Station (ADMIN)

```typescript
const result = await deleteStation("station-uuid");

if (result.success) {
  console.log("Station deleted");
}
```

### 8. Change Station Status (ADMIN)

```typescript
const result = await changeStationStatus(
  "station-uuid",
  StationStatus.MAINTENANCE,
);

if (result.success) {
  console.log("Status changed:", result.data.status);
}
```

### 9. Get Available Vehicles Count

```typescript
const result = await getAvailableVehiclesCount("station-uuid");

if (result.success) {
  console.log("Available:", result.data.availableVehicles);
}
```

### 10. Upload Station Photo (ADMIN/STAFF)

```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const result = await uploadStationPhoto('station-uuid', file);
  if (result.success) {
    console.log('Photo uploaded:', result.data.photoUrl);
  }
};

// In component:
<input type="file" accept="image/*" onChange={handleFileUpload} />
```

---

## 🛠️ Helper Methods

### Report Helpers

```typescript
const {
  formatCurrency,
  formatUtilizationRate,
  getUtilizationColor,
  getRiskLevelText,
  getRiskLevelColor,
  formatPeakHour,
  formatDateRange,
  getTopPerformers,
  getHighRiskCustomers,
  getDateRangePresets,
} = useReport();

// Sử dụng
formatCurrency(1500000); // "1.500.000 ₫"
formatUtilizationRate(75.5); // "75.5%"
getUtilizationColor(80); // "text-green-600"
getRiskLevelText("HIGH"); // "Cao"
getRiskLevelColor("CRITICAL"); // "text-red-600 bg-red-50"
formatPeakHour(14); // "14:00 - 15:00"
formatDateRange(start, end); // "1 tháng 1, 2024 - 31 tháng 1, 2024"
getTopPerformers(staffData, 5); // Top 5 staff by revenue
getHighRiskCustomers(customers); // Customers with risk >= 70

// Date presets
const presets = getDateRangePresets();
// Returns: { today, yesterday, last7Days, last30Days, thisMonth, lastMonth }
```

### Staff Helpers

```typescript
const {
  getRoleText,
  getRoleBadgeColor,
  filterByRole,
  filterActiveStaff,
  getStaffCountByRole,
  formatStaffName,
  sortByName,
  searchStaff,
} = useStaff();

// Sử dụng
getRoleText("ADMIN"); // "Quản trị viên"
getRoleBadgeColor("STAFF"); // "bg-green-100 text-green-800"
filterByRole(staff, "MANAGER"); // Filter by role
filterActiveStaff(staff); // Only active staff
getStaffCountByRole(staff); // { ADMIN: 2, STAFF: 10 }
sortByName(staff, true); // Sort ascending
searchStaff(staff, "nguyen"); // Search by name/email/phone
```

### Station Helpers

```typescript
const {
  getStatusText,
  getStatusColor,
  isStationOpen,
  formatAddress,
  calculateUtilization,
  getUtilizationColor,
  filterByCity,
  sortByAvailability,
  searchStations,
  calculateDistance,
  findNearestStations,
  formatOperatingHours,
  validateStationData,
  getPopularCities,
} = useStation();

// Sử dụng
getStatusText(StationStatus.ACTIVE); // "Hoạt động"
getStatusColor(StationStatus.MAINTENANCE); // "bg-yellow-100 text-yellow-800"
isStationOpen(station); // true/false based on time
formatAddress(station); // "123 Nguyễn Huệ, Phường 1, Quận 1, Hồ Chí Minh"
calculateUtilization(station); // 75.5 (%)
filterByCity(stations, "Hà Nội"); // Filter by city
sortByAvailability(stations); // Sort by available vehicles
searchStations(stations, "quận 1"); // Search by name/address
calculateDistance(10.7769, 106.7009, 10.78, 106.71); // 1.23 km

// Find nearest stations to user
findNearestStations(stations, userLat, userLon, 5);
// Returns top 5 nearest with distance property

formatOperatingHours(station); // "08:00 - 20:00" or "24/7"
validateStationData(formData); // Returns array of errors
getPopularCities(); // ['Hồ Chí Minh', 'Hà Nội', ...]
```

---

## 📦 Type Definitions

### Report Types

```typescript
interface RevenueByStationResponse {
  stationId: string;
  stationName: string;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
}

interface UtilizationResponse {
  stationId: string;
  stationName: string;
  totalVehicles: number;
  utilizationRate: number; // 0-100
  totalRentalHours: number;
  availableHours: number;
}

interface CustomerRiskResponse {
  customerId: string;
  customerName: string;
  email: string;
  totalBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
  lateReturns: number;
  riskScore: number; // 0-100
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface ReportFilters {
  start: Date;
  end: Date;
  stationId?: string;
}
```

### Station Types

```typescript
enum StationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  CLOSED = "CLOSED",
}

interface StationResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  status: StationStatus;
  photoUrl?: string;
  totalVehicles: number;
  availableVehicles: number;
  openingTime?: string;
  closingTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateStationRequest {
  name: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  amenities?: string[];
}
```

---

## 🎯 Example Components

### Admin Reports Dashboard

```typescript
import { AdminReportsExample } from "@/components/examples/AdminReportsExample";

// Full-featured reports dashboard with:
// - Revenue by station table
// - Utilization cards
// - Peak hours chart
// - Staff performance ranking
// - Customer risk assessment
// - Date range selector (7 days, 30 days, this month)
```

### Station Management

```typescript
import { StationManagementExample } from "@/components/examples/StationManagementExample";

// Complete station management with:
// - Station list with cards
// - Search and filter
// - Create station form
// - Status management (activate/deactivate)
// - Real-time stats (total stations, active, total vehicles)
// - Utilization visualization
// - Operating hours display
```

---

## 🚀 Integration Tips

### 1. Admin Dashboard Integration

```typescript
// pages/Admin/Dashboard.tsx
import { useReport } from "@/hooks/useReport";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const { getRevenueByStation, getUtilization } = useReport();
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const filters = {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      };

      const [revenueData, utilizationData] = await Promise.all([
        getRevenueByStation(filters),
        getUtilization(filters),
      ]);

      if (revenueData.success) setRevenue(revenueData.data);
    };

    loadData();
  }, []);

  // Render charts and tables...
};
```

### 2. Station Selector Component

```typescript
// components/StationSelector.tsx
const StationSelector = ({ onSelect }) => {
  const { getActiveStations, loading } = useStation();
  const [stations, setStations] = useState([]);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    const result = await getActiveStations();
    if (result.success) setStations(result.data);
  };

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Chọn trạm</option>
      {stations.map(station => (
        <option key={station.id} value={station.id}>
          {station.name} ({station.availableVehicles} xe khả dụng)
        </option>
      ))}
    </select>
  );
};
```

### 3. Risk Alert System

```typescript
const RiskAlerts = () => {
  const { getCustomerRisk, getHighRiskCustomers } = useReport();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkRisks = async () => {
      const result = await getCustomerRisk(5);
      if (result.success) {
        const highRisk = getHighRiskCustomers(result.data);
        setAlerts(highRisk);
      }
    };

    checkRisks();
    // Poll every 5 minutes
    const interval = setInterval(checkRisks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {alerts.length > 0 && (
        <div className="bg-red-50 p-4 rounded">
          ⚠️ {alerts.length} khách hàng có rủi ro cao
        </div>
      )}
    </div>
  );
};
```

---

## ✅ Complete API List

### Report APIs (5)

1. ✅ `GET /api/admin/reports/revenue-by-station` - Revenue by station
2. ✅ `GET /api/admin/reports/utilization` - Utilization report
3. ✅ `GET /api/admin/reports/peak-hours` - Peak hours analysis
4. ✅ `GET /api/admin/reports/staff-performance` - Staff performance
5. ✅ `GET /api/admin/reports/customer-risk` - Customer risk assessment

### Staff APIs (1)

6. ✅ `GET /api/admin/staff?stationId={id}` - Get staff by station

### Station APIs (12)

7. ✅ `POST /api/stations` - Create station
8. ✅ `PUT /api/stations/:id` - Update station
9. ✅ `GET /api/stations/:id` - Get station detail
10. ✅ `GET /api/stations` - Get all stations (paginated)
11. ✅ `GET /api/stations/active` - Get active stations
12. ✅ `GET /api/stations/status/:status` - Get by status
13. ✅ `DELETE /api/stations/:id` - Delete station
14. ✅ `PATCH /api/stations/:id/status` - Change status
15. ✅ `GET /api/stations/:id/vehicles/available/count` - Available count
16. ✅ `POST /api/stations/:id/photo` - Upload photo

**Total: 18 API methods** 🎉

---

## 📝 Notes

- Report APIs require date range in ISO format
- Station photos use multipart/form-data
- Distance calculation uses Haversine formula (accurate for Earth)
- Risk scores calculated based on cancellation rate, late returns, overdue fees
- Utilization rate = (vehicles in use / total vehicles) × 100
- All date/time values in ISO 8601 format
- Helper methods provide Vietnamese translations
