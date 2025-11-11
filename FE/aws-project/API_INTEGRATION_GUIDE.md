# 🚀 Hướng Dẫn Tích Hợp API vào Pages

## ✅ Đã Tích Hợp

### 1. Login Page (`client/pages/Login/Login.tsx`)

**Status**: ✅ Hoàn thành

```typescript
// Đã thay thế mock login bằng useAuth hook
import { useAuth } from "@/hooks/useAuth";

const { login, register, loading } = useAuth();

// Login với API thực tế
const result = await login({
  email: loginData.username,
  password: loginData.password,
});

if (result && result.user) {
  // Login thành công
  localStorage.setItem("userId", result.user.id);
  navigate("/admin");
}

// Register với API thực tế
const result = await register({
  email: registerData.email,
  password: registerData.password,
  fullName: registerData.fullName,
});
```

**Test Steps**:

1. Start backend: `./mvnw spring-boot:run`
2. Test login: `POST /api/auth/login`
3. Test register: `POST /api/auth/register`

---

## 📋 Cần Tích Hợp (TODO)

### 2. Admin Users Page (`client/pages/Admin/Users.tsx`)

**Current**: Sử dụng MOCK_USERS (line 48-154)

**Migration Plan**:

```typescript
// 1. Import useUser hook
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/service";

// 2. Replace mock data
const {
  getAllUsers,
  updateUser,
  updateUserRole,
  verifyUserLicense,
  deleteUser,
  searchUsers,
  filterByRole,
  getUserStats,
  loading,
} = useUser();

// 3. Load users từ API
useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {
  const result = await getAllUsers(
    0, // page
    100, // size
    "createdAt",
    "DESC",
  );

  if (result) {
    setUsers(result.content || []);
  }
};

// 4. CRUD operations
const handleCreateUser = async (data) => {
  // Backend không có create user endpoint (dùng register)
  // Hoặc tạo bằng admin interface riêng
  toast.error("Tạo user qua trang Register");
};

const handleUpdateUser = async (userId, data) => {
  const result = await updateUser(userId, {
    fullName: data.full_name,
    phoneNumber: data.phone,
    address: data.address,
  });

  if (result.success) {
    await loadUsers(); // Reload
    toast.success("Cập nhật thành công");
  }
};

const handleVerifyLicense = async (userId) => {
  const result = await verifyUserLicense(userId);
  if (result.success) {
    await loadUsers();
    toast.success("Đã xác minh GPLX");
  }
};

const handleDeleteUser = async (userId) => {
  const result = await deleteUser(userId);
  if (result.success) {
    await loadUsers();
    toast.success("Đã xóa người dùng");
  }
};

const handleChangeRole = async (userId, newRole) => {
  const result = await updateUserRole(userId, {
    role: newRole,
    stationId: newRole === UserRole.STAFF ? selectedStationId : undefined,
  });

  if (result.success) {
    await loadUsers();
    toast.success("Đã đổi vai trò");
  }
};

// 5. Search và Filter (client-side với helper methods)
const filteredUsers = useMemo(() => {
  let result = users;

  if (filters.search) {
    result = searchUsers(result, filters.search);
  }

  if (filters.role) {
    result = filterByRole(result, filters.role);
  }

  return result;
}, [users, filters]);

// 6. Statistics
const stats = getUserStats(users);
// Returns: { total, byRole, verified, withLicense, pendingVerification }
```

---

### 3. Admin Vehicles Page (`client/pages/Admin/Vehicles.tsx`)

**Current**: Sử dụng MOCK_VEHICLES

**Migration Plan**:

```typescript
import { useVehicle } from "@/hooks/useVehicle";
import { VehicleStatus, FuelType } from "@/service";

const {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeVehicleStatus,
  uploadVehiclePhotos,
  getVehicleStats,
  filterByPriceRange,
  searchVehicles,
  loading,
} = useVehicle();

// Load vehicles
const loadVehicles = async () => {
  const result = await getAllVehicles({
    page: 0,
    size: 100,
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  if (result.success && result.data) {
    setVehicles(result.data.content);
  }
};

// Create vehicle
const handleCreate = async (data) => {
  const result = await createVehicle({
    stationId: data.stationId,
    name: data.name,
    brand: data.brand,
    model: data.model,
    year: data.year,
    licensePlate: data.licensePlate,
    color: data.color,
    seats: data.seats,
    fuelType: data.fuelType,
    transmission: data.transmission,
    pricePerHour: data.pricePerHour,
    pricePerDay: data.pricePerDay,
    features: data.features,
  });

  if (result.success) {
    // Upload photos
    if (data.photos && data.photos.length > 0) {
      await uploadVehiclePhotos(result.data.id, data.photos);
    }

    await loadVehicles();
    toast.success("Tạo xe thành công");
  }
};

// Update vehicle
const handleUpdate = async (vehicleId, data) => {
  const result = await updateVehicle(vehicleId, data);
  if (result.success) {
    await loadVehicles();
    toast.success("Cập nhật thành công");
  }
};

// Change status
const handleChangeStatus = async (vehicleId, newStatus) => {
  const result = await changeVehicleStatus(vehicleId, newStatus);
  if (result.success) {
    await loadVehicles();
    toast.success(`Đã đổi trạng thái sang ${newStatus}`);
  }
};

// Delete
const handleDelete = async (vehicleId) => {
  const result = await deleteVehicle(vehicleId);
  if (result.success) {
    await loadVehicles();
    toast.success("Đã xóa xe");
  }
};

// Filter
const filteredVehicles = useMemo(() => {
  let result = vehicles;

  if (filters.search) {
    result = searchVehicles(result, filters.search);
  }

  if (filters.minPrice && filters.maxPrice) {
    result = filterByPriceRange(result, filters.minPrice, filters.maxPrice);
  }

  return result;
}, [vehicles, filters]);

// Stats
const stats = getVehicleStats(vehicles);
// Returns: { total, byStatus, byFuelType, averagePrice, totalRentCount }
```

---

### 4. Admin Bookings Page (`client/pages/Admin/Bookings.tsx`)

**Current**: Sử dụng MOCK_BOOKINGS

**Migration Plan**:

```typescript
import { useBooking } from "@/hooks/useBooking";
import { BookingStatus } from "@/service";

const {
  getAllBookings,
  updateBookingStatus,
  confirmBooking,
  startRental,
  completeRental,
  cancelBooking,
  extendBooking,
  getBookingsByStatus,
  loading,
} = useBooking();

// Load bookings
const loadBookings = async () => {
  const result = await getAllBookings();
  if (result) {
    setBookings(result.content);
  }
};

// Confirm booking
const handleConfirm = async (bookingId) => {
  const result = await confirmBooking(bookingId);
  if (result.success) {
    await loadBookings();
    toast.success("Đã xác nhận đơn thuê");
  }
};

// Start rental
const handleStart = async (bookingId) => {
  const result = await startRental(bookingId);
  if (result.success) {
    await loadBookings();
    toast.success("Đã bắt đầu chuyến đi");
  }
};

// Complete rental
const handleComplete = async (bookingId) => {
  const result = await completeRental(bookingId);
  if (result.success) {
    await loadBookings();
    toast.success("Đã hoàn thành chuyến đi");
  }
};

// Cancel
const handleCancel = async (bookingId) => {
  const result = await cancelBooking(bookingId);
  if (result.success) {
    await loadBookings();
    toast.success("Đã hủy đơn");
  }
};

// Extend
const handleExtend = async (bookingId, newEndTime) => {
  const result = await extendBooking(bookingId, {
    newEndTime,
    additionalHours: calculateAdditionalHours(newEndTime),
  });

  if (result.success) {
    await loadBookings();
    toast.success(
      `Đã gia hạn. Phí thêm: ${formatCurrency(result.data.additionalCost)}`,
    );
  }
};

// Filter by status
const loadByStatus = async (status) => {
  const result = await getBookingsByStatus(status);
  if (result.success) {
    setBookings(result.data);
  }
};
```

---

### 5. Admin Reports Page (`client/pages/Admin/Reports.tsx`)

**Current**: Sử dụng mock data

**Migration Plan**:

```typescript
import { useReport } from "@/hooks/useReport";

const {
  getRevenueByStation,
  getUtilization,
  getPeakHours,
  getStaffPerformance,
  getCustomerRisk,
  loading,
} = useReport();

// Revenue report
const loadRevenue = async () => {
  const result = await getRevenueByStation({
    start: startDate,
    end: endDate,
  });

  if (result.success) {
    setRevenueData(result.data);
  }
};

// Utilization
const loadUtilization = async () => {
  const result = await getUtilization({
    start: startDate,
    end: endDate,
  });

  if (result.success) {
    setUtilizationData(result.data);
  }
};

// Peak hours
const loadPeakHours = async () => {
  const result = await getPeakHours({
    start: startDate,
    end: endDate,
  });

  if (result.success) {
    setPeakHoursData(result.data);
  }
};

// Staff performance
const loadStaffPerformance = async () => {
  const result = await getStaffPerformance({
    start: startDate,
    end: endDate,
  });

  if (result.success) {
    setStaffData(result.data);
  }
};

// Customer risk
const loadCustomerRisk = async () => {
  const result = await getCustomerRisk(3); // min 3 bookings
  if (result.success) {
    setRiskData(result.data);
  }
};
```

---

### 6. Customer Pages

#### SelfDrive (`client/pages/Customer/SelfDrive/SelfDrive.tsx`)

```typescript
import { useVehicle } from "@/hooks/useVehicle";
import { useStation } from "@/hooks/useStation";

const { getAvailableForBooking, searchVehicles } = useVehicle();
const { getNearbyStations } = useStation();

// Load available vehicles
const loadVehicles = async () => {
  const result = await getAvailableForBooking({
    stationId: selectedStation,
    startTime: pickupDate,
    endTime: returnDate,
  });

  if (result.success) {
    setVehicles(result.data);
  }
};

// Find nearby stations
const findNearby = async () => {
  const result = await getNearbyStations({
    latitude: currentLat,
    longitude: currentLng,
    radius: 10,
  });

  if (result.success) {
    setNearbyStations(result.data);
  }
};
```

#### CarIn4 (Vehicle Detail)

```typescript
import { useVehicle } from "@/hooks/useVehicle";

const { getVehicleById } = useVehicle();

const loadVehicleDetail = async (id) => {
  const result = await getVehicleById(id);
  if (result.success) {
    setVehicle(result.data);
    // result.data includes: station, specifications, currentBooking
  }
};
```

#### HistoryService (Booking History)

```typescript
import { useBooking } from "@/hooks/useBooking";

const { getUserBookings } = useBooking();

const loadMyBookings = async () => {
  const userId = localStorage.getItem("userId");
  const result = await getUserBookings(userId);

  if (result.success) {
    setBookings(result.data);
  }
};
```

---

## 🧪 Testing Checklist

### Login

- [ ] POST /api/auth/login - Đăng nhập thành công
- [ ] POST /api/auth/register - Đăng ký thành công
- [ ] Redirect theo role (admin → /admin, customer → /)

### Users

- [ ] GET /api/users - Lấy danh sách users
- [ ] PUT /api/users/:id - Cập nhật thông tin
- [ ] PATCH /api/users/:id/role - Đổi vai trò
- [ ] PATCH /api/users/:id/verify-license - Xác minh GPLX
- [ ] DELETE /api/users/:id - Xóa user

### Vehicles

- [ ] POST /api/vehicles - Tạo xe mới
- [ ] PUT /api/vehicles/:id - Cập nhật xe
- [ ] GET /api/vehicles - Lấy danh sách xe
- [ ] GET /api/vehicles/available/booking - Lấy xe khả dụng theo thời gian
- [ ] PATCH /api/vehicles/:id/status - Đổi trạng thái
- [ ] POST /api/vehicles/:id/photos - Upload ảnh
- [ ] DELETE /api/vehicles/:id - Xóa xe

### Bookings

- [ ] POST /api/bookings - Tạo đơn thuê
- [ ] GET /api/bookings - Lấy danh sách đơn
- [ ] PATCH /api/bookings/:id/confirm - Xác nhận
- [ ] PATCH /api/bookings/:id/start - Bắt đầu
- [ ] PATCH /api/bookings/:id/complete - Hoàn thành
- [ ] PATCH /api/bookings/:id/cancel - Hủy
- [ ] POST /api/bookings/:id/extend - Gia hạn

### Reports

- [ ] GET /api/reports/revenue - Doanh thu theo trạm
- [ ] GET /api/reports/utilization - Tỷ lệ sử dụng
- [ ] GET /api/reports/peak-hours - Giờ cao điểm
- [ ] GET /api/reports/staff-performance - Hiệu suất nhân viên
- [ ] GET /api/reports/customer-risk - Khách hàng rủi ro

---

## 🔧 Environment Setup

### 1. Configure API Base URL

```typescript
// client/service/config/apiClient.ts
const BASE_URL = process.env.VITE_API_URL || "http://localhost:8080";
```

### 2. Create `.env` file

```bash
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### 3. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend should run on: `http://localhost:8080`

### 4. Start Frontend

```bash
cd FE/aws-project
pnpm dev
```

Frontend should run on: `http://localhost:5173`

---

## 📝 Migration Priority

1. **HIGH Priority** (Core features):
   - ✅ Login/Register (Done)
   - 🔄 Admin Bookings (Most important for business)
   - 🔄 Admin Vehicles (CRUD operations)
   - 🔄 Customer SelfDrive (Booking flow)

2. **MEDIUM Priority**:
   - Admin Users
   - Customer HistoryService
   - Admin Reports

3. **LOW Priority**:
   - Dashboard analytics (cần aggregate data)
   - Advanced filters

---

## ⚡ Quick Start Commands

```bash
# Test login API
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test get vehicles
curl -X GET http://localhost:8080/api/vehicles

# Test get available vehicles
curl -X GET "http://localhost:8080/api/vehicles/available/booking?stationId=xxx&startTime=2024-01-20T10:00:00&endTime=2024-01-22T10:00:00"

# Test create booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vehicleId": "xxx",
    "startTime": "2024-01-20T10:00:00",
    "endTime": "2024-01-22T10:00:00",
    "pickupStationId": "xxx",
    "returnStationId": "xxx"
  }'
```

---

## 🎯 Next Steps

1. **Bắt đầu từ Login** ✅ (Done)
2. **Tích hợp Admin Bookings** (Priority 1)
3. **Tích hợp Admin Vehicles** (Priority 2)
4. **Tích hợp Customer Booking Flow** (Priority 3)
5. **Test toàn bộ flow**: Register → Login → Browse → Book → Confirm → Complete

---

**Last Updated**: November 10, 2025  
**Status**: Login ✅ | Other Pages 🔄 In Progress
