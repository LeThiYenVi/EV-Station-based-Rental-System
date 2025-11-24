# 🎉 User & Vehicle APIs - Complete Integration Guide

## 📋 Tổng Quan

Đây là 2 controllers cuối cùng được tích hợp:

- **UserController**: Quản lý người dùng và hồ sơ
- **VehicleController**: Quản lý phương tiện và tìm kiếm xe

**Tổng số APIs**: 24 phương thức

---

## 🔐 Phân Quyền

### User APIs

- Get My Info: Authenticated users (RENTER, STAFF, ADMIN)
- Get All/By ID: ADMIN hoặc STAFF
- CRUD Operations: ADMIN hoặc STAFF
- Upload Avatar/License: Authenticated users
- Delete: ADMIN only

### Vehicle APIs

- Create/Update/Delete: ADMIN hoặc STAFF
- Get/Browse: Public
- Status Management: ADMIN hoặc STAFF

---

## 👤 User Service (10 APIs)

### 1. Get My Info

```typescript
import { useUser } from "@/hooks/useUser";

const { getMyInfo } = useUser();

// Lấy thông tin người dùng hiện tại
const result = await getMyInfo();

if (result.success) {
  console.log(result.data.fullName);
  console.log(result.data.email);
  console.log(result.data.role); // RENTER, STAFF, ADMIN, MANAGER
  console.log(result.data.licenseVerified);
}
```

### 2. Get All Users (Paginated)

```typescript
const result = await getAllUsers(
  0, // page
  10, // size
  "createdAt", // sortBy
  "DESC", // sortDirection
);

if (result.success) {
  console.log(result.data.content); // Users array
  console.log(result.data.totalElements); // Total count
  console.log(result.data.totalPages); // Number of pages
}
```

### 3. Get User by ID

```typescript
const result = await getUserById("user-uuid");
```

### 4. Get Users by Role

```typescript
import { UserRole } from "@/service";

const result = await getUsersByRole(UserRole.RENTER);
// Roles: RENTER, STAFF, ADMIN, MANAGER
```

### 5. Update User

```typescript
const result = await updateUser("user-uuid", {
  fullName: "Nguyễn Văn A",
  phoneNumber: "0901234567",
  address: "123 Nguyễn Huệ, Q1, HCM",
  dateOfBirth: "1990-01-01",
  licenseNumber: "B1234567",
  licenseIssueDate: "2020-01-01",
  licenseExpiryDate: "2030-01-01",
});
```

### 6. Update User Role

```typescript
const result = await updateUserRole("user-uuid", {
  role: UserRole.STAFF,
  stationId: "station-uuid", // Optional, for STAFF role
});
```

### 7. Verify User License

```typescript
// Staff/Admin xác minh giấy phép lái xe của khách hàng
const result = await verifyUserLicense("user-uuid");

if (result.success) {
  console.log("License verified!");
}
```

### 8. Upload Avatar

```typescript
const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const result = await uploadAvatar(userId, file);
  if (result.success) {
    console.log('Avatar URL:', result.data.avatarUrl);
  }
};

// In component
<input type="file" accept="image/*" onChange={handleAvatarUpload} />
```

### 9. Upload License Card

```typescript
const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const result = await uploadLicenseCard(userId, file);
  if (result.success) {
    console.log("License card URL:", result.data.licenseCardUrl);
  }
};
```

### 10. Delete User

```typescript
const result = await deleteUser("user-uuid");
```

---

## 🚗 Vehicle Service (14 APIs)

### 1. Create Vehicle

```typescript
import { useVehicle } from "@/hooks/useVehicle";
import { FuelType } from "@/service";

const { createVehicle } = useVehicle();

const result = await createVehicle({
  stationId: "station-uuid",
  name: "VF e34",
  brand: "VinFast",
  model: "e34",
  year: 2024,
  licensePlate: "29A12345",
  color: "Trắng",
  seats: 5,
  fuelType: FuelType.ELECTRIC,
  transmission: "AUTOMATIC",
  pricePerHour: 50000,
  pricePerDay: 800000,
  mileage: 0,
  features: ["Bluetooth", "Camera lùi", "Cảm biến lốp"],
  description: "Xe điện VinFast thế hệ mới",
});
```

### 2. Update Vehicle

```typescript
const result = await updateVehicle("vehicle-uuid", {
  pricePerDay: 900000,
  mileage: 5000,
  status: VehicleStatus.MAINTENANCE,
});
```

### 3. Get Vehicle by ID

```typescript
const result = await getVehicleById("vehicle-uuid");

if (result.success) {
  console.log(result.data.name);
  console.log(result.data.station); // Station info
  console.log(result.data.specifications); // Engine, battery, etc
  console.log(result.data.currentBooking); // If rented
  console.log(result.data.maintenanceHistory);
}
```

### 4. Get All Vehicles (Paginated)

```typescript
const result = await getAllVehicles({
  page: 0,
  size: 12,
  sortBy: "createdAt",
  sortDirection: "DESC",
});
```

### 5. Get Vehicles by Station

```typescript
const result = await getVehiclesByStation("station-uuid");

if (result.success) {
  result.data.forEach((vehicle) => {
    console.log(vehicle.name, vehicle.status);
  });
}
```

### 6. Get Available Vehicles

```typescript
const result = await getAvailableVehicles({
  stationId: "station-uuid",
  fuelType: "ELECTRIC", // Optional
  brand: "VinFast", // Optional
});
```

### 7. Get Available for Booking (with Time Check)

```typescript
// Kiểm tra xe khả dụng trong khoảng thời gian cụ thể
const result = await getAvailableForBooking({
  stationId: "station-uuid",
  fuelType: "ELECTRIC",
  startTime: new Date("2024-01-20T10:00:00"),
  endTime: new Date("2024-01-22T18:00:00"),
});

if (result.success) {
  console.log(`${result.data.length} vehicles available`);
}
```

### 8. Get Vehicles by Status

```typescript
import { VehicleStatus } from "@/service";

const result = await getVehiclesByStatus(VehicleStatus.AVAILABLE);
// Status: AVAILABLE, RENTED, MAINTENANCE, OUT_OF_SERVICE
```

### 9. Get Vehicles by Brand

```typescript
const result = await getVehiclesByBrand("VinFast");
```

### 10. Delete Vehicle

```typescript
const result = await deleteVehicle("vehicle-uuid");
```

### 11. Change Vehicle Status

```typescript
const result = await changeVehicleStatus(
  "vehicle-uuid",
  VehicleStatus.MAINTENANCE,
);
```

### 12. Increment Rent Count

```typescript
// Tự động tăng số lần cho thuê
const result = await incrementRentCount("vehicle-uuid");
```

### 13. Upload Vehicle Photos

```typescript
const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  const result = await uploadVehiclePhotos(vehicleId, files);
  if (result.success) {
    console.log('Photos:', result.data.photoUrls);
  }
};

// In component
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handlePhotosUpload}
/>
```

---

## 🛠️ Helper Methods

### User Helpers

```typescript
const {
  getRoleText,
  getRoleBadgeColor,
  hasVerifiedLicense,
  hasLicenseCard,
  canRentVehicles,
  searchUsers,
  sortByName,
  filterByRole,
  getPendingVerification,
  getUserStats,
  validateUserData,
  formatUserInfo,
  isLicenseExpired,
  getDaysUntilExpiry,
  formatDate,
} = useUser();

// Examples
getRoleText("RENTER"); // "Khách hàng"
getRoleBadgeColor("ADMIN"); // "bg-purple-100 text-purple-800"
hasVerifiedLicense(user); // true/false
canRentVehicles(user); // Checks role + verified license
searchUsers(users, "nguyen"); // Search by name/email/phone
sortByName(users, true); // Sort ascending
filterByRole(users, UserRole.STAFF); // Filter by role
getPendingVerification(users); // Users waiting for license verification

const stats = getUserStats(users);
// Returns: { total, byRole, verified, withLicense, pendingVerification }

const errors = validateUserData(formData);
// Returns array of validation errors

formatUserInfo(user); // "Nguyễn Văn A (email@test.com) - 0901234567"
isLicenseExpired(user); // true/false
getDaysUntilExpiry(user); // 365 (days remaining)
formatDate("2024-01-01"); // "1 tháng 1, 2024"
```

### Vehicle Helpers

```typescript
const {
  getStatusText,
  getStatusColor,
  getFuelTypeText,
  getFuelTypeIcon,
  formatPricePerHour,
  formatPricePerDay,
  calculateRentalCost,
  isAvailable,
  isElectric,
  getVehicleName,
  filterByPriceRange,
  filterBySeats,
  sortByPrice,
  sortByPopularity,
  sortByNewest,
  searchVehicles,
  getUniqueBrands,
  getUniqueFuelTypes,
  getVehicleStats,
  validateVehicleData,
  getRecommendedVehicles,
  formatMileage,
  getTransmissionText,
} = useVehicle();

// Examples
getStatusText(VehicleStatus.AVAILABLE); // "Khả dụng"
getStatusColor(VehicleStatus.RENTED); // "bg-blue-100 text-blue-800"
getFuelTypeText(FuelType.ELECTRIC); // "Điện"
getFuelTypeIcon(FuelType.ELECTRIC); // "⚡"
formatPricePerHour(50000); // "50.000 ₫/giờ"
formatPricePerDay(800000); // "800.000 ₫/ngày"

// Calculate rental cost
const cost = calculateRentalCost(vehicle, 30); // 30 hours
console.log(cost.hourlyTotal); // 1.500.000
console.log(cost.dailyTotal); // 1.600.000
console.log(cost.recommended); // 'hourly' or 'daily'
console.log(cost.recommendedTotal); // 1.500.000 (cheaper option)

isAvailable(vehicle); // true/false
isElectric(vehicle); // true for ELECTRIC/HYBRID
getVehicleName(vehicle); // "VinFast e34 2024"

filterByPriceRange(vehicles, 500000, 1000000); // Filter by price
filterBySeats(vehicles, 5); // At least 5 seats
sortByPrice(vehicles, true); // Sort by price ascending
sortByPopularity(vehicles); // Sort by rent count
sortByNewest(vehicles); // Sort by year
searchVehicles(vehicles, "vinfast"); // Search by name/brand/model

getUniqueBrands(vehicles); // ['VinFast', 'Toyota', ...]
getUniqueFuelTypes(vehicles); // [FuelType.ELECTRIC, ...]

const stats = getVehicleStats(vehicles);
// Returns: { total, byStatus, byFuelType, averagePrice, totalRentCount }

getRecommendedVehicles(vehicles, 6); // Top 6 recommended
formatMileage(15000); // "15.000 km"
getTransmissionText("AUTOMATIC"); // "Tự động"
```

---

## 📦 Type Definitions

### User Types

```typescript
enum UserRole {
  RENTER = "RENTER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  address?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  licenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseCardUrl?: string;
  licenseVerified?: boolean;
  stationId?: string;
  stationName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
}

interface UpdateUserRoleRequest {
  role: UserRole;
  stationId?: string;
}
```

### Vehicle Types

```typescript
enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

enum FuelType {
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL'
}

interface VehicleResponse {
  id: string;
  stationId: string;
  stationName?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  seats: number;
  fuelType: FuelType;
  transmission?: string;
  pricePerHour: number;
  pricePerDay: number;
  status: VehicleStatus;
  mileage?: number;
  rentCount: number;
  photoUrls?: string[];
  features?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleDetailResponse extends VehicleResponse {
  station?: { ... };
  specifications?: { ... };
  currentBooking?: { ... };
  maintenanceHistory?: Array<{ ... }>;
}
```

---

## 🎯 Integration Examples

### User Profile Page

```typescript
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const {
    getMyInfo,
    updateUser,
    uploadAvatar,
    hasVerifiedLicense,
    getDaysUntilExpiry,
    loading
  } = useUser();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const result = await getMyInfo();
    if (result.success) setUser(result.data);
  };

  const handleUpdate = async (formData) => {
    const result = await updateUser(user.id, formData);
    if (result.success) {
      setUser(result.data);
      // Show success message
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {getRoleText(user.role)}</p>

      {hasVerifiedLicense(user) ? (
        <div className="text-green-600">
          ✓ License Verified
          {getDaysUntilExpiry(user) < 30 && (
            <div className="text-yellow-600">
              Expires in {getDaysUntilExpiry(user)} days
            </div>
          )}
        </div>
      ) : (
        <div className="text-yellow-600">
          ⚠️ License Not Verified
        </div>
      )}

      {/* Update form, avatar upload, etc. */}
    </div>
  );
};
```

### Vehicle Browse Page

```typescript
import { useVehicle } from '@/hooks/useVehicle';
import { useState, useEffect } from 'react';

const VehicleBrowse = () => {
  const {
    getAvailableVehicles,
    sortByPrice,
    filterByPriceRange,
    filterBySeats,
    getUniqueBrands,
    getStatusColor,
    formatPricePerDay,
    calculateRentalCost,
  } = useVehicle();

  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    stationId: '',
    brand: '',
    minPrice: 0,
    maxPrice: 2000000,
    minSeats: 4,
  });

  useEffect(() => {
    loadVehicles();
  }, [filters.stationId]);

  const loadVehicles = async () => {
    const result = await getAvailableVehicles({
      stationId: filters.stationId,
      brand: filters.brand,
    });

    if (result.success) {
      let filtered = result.data;
      filtered = filterByPriceRange(filtered, filters.minPrice, filters.maxPrice);
      filtered = filterBySeats(filtered, filters.minSeats);
      filtered = sortByPrice(filtered, true);
      setVehicles(filtered);
    }
  };

  return (
    <div>
      <h1>Browse Vehicles</h1>

      {/* Filters */}
      <div className="filters">
        {/* Station selector, brand filter, price range, etc. */}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="card">
            <img src={vehicle.photoUrls?.[0]} alt={vehicle.name} />
            <h3>{getVehicleName(vehicle)}</h3>
            <div>{formatPricePerDay(vehicle.pricePerDay)}</div>
            <div className={getStatusColor(vehicle.status)}>
              {getStatusText(vehicle.status)}
            </div>

            {/* Rental cost calculator */}
            <div>
              {(() => {
                const cost = calculateRentalCost(vehicle, 24);
                return (
                  <div>
                    <span>1 day: {formatCurrency(cost.recommendedTotal)}</span>
                    <span className="text-sm">({cost.recommended} rate)</span>
                  </div>
                );
              })()}
            </div>

            <button>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## ✅ Complete API List

### User APIs (10)

1. ✅ `GET /api/users/me` - Get my info
2. ✅ `GET /api/users` - Get all users (paginated)
3. ✅ `GET /api/users/:userId` - Get user by ID
4. ✅ `GET /api/users/role/:role` - Get users by role
5. ✅ `PUT /api/users/:userId` - Update user
6. ✅ `PATCH /api/users/:userId/role` - Update user role
7. ✅ `PATCH /api/users/:userId/verify-license` - Verify license
8. ✅ `POST /api/users/:userId/avatar` - Upload avatar
9. ✅ `POST /api/users/:userId/license-card` - Upload license card
10. ✅ `DELETE /api/users/:userId` - Delete user

### Vehicle APIs (14)

11. ✅ `POST /api/vehicles` - Create vehicle
12. ✅ `PUT /api/vehicles/:id` - Update vehicle
13. ✅ `GET /api/vehicles/:id` - Get vehicle detail
14. ✅ `GET /api/vehicles` - Get all vehicles (paginated)
15. ✅ `GET /api/vehicles/station/:stationId` - Get by station
16. ✅ `GET /api/vehicles/available` - Get available vehicles
17. ✅ `GET /api/vehicles/available/booking` - Get available for booking (time-based)
18. ✅ `GET /api/vehicles/status/:status` - Get by status
19. ✅ `GET /api/vehicles/brand/:brand` - Get by brand
20. ✅ `DELETE /api/vehicles/:id` - Delete vehicle
21. ✅ `PATCH /api/vehicles/:id/status` - Change status
22. ✅ `PATCH /api/vehicles/:id/rent-count` - Increment rent count
23. ✅ `POST /api/vehicles/:id/photos` - Upload photos

**Total: 24 API methods** 🎉

---

## 📝 Notes

- User avatar/license uploads use multipart/form-data
- Vehicle photos support multiple file upload
- License verification is manual process by ADMIN/STAFF
- Vehicle availability check considers existing bookings
- Rent count automatically tracked for analytics
- All file uploads return updated entity with URLs
- Role changes require ADMIN permission
- Users can only update their own profile unless ADMIN/STAFF
