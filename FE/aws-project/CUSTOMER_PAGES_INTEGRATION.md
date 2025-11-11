# ✅ Đã Tích Hợp API cho Customer Pages

## 🎉 Hoàn Thành

### 1. SelfDrive Page - Tìm và Thuê Xe

**File**: `client/pages/Customer/SelfDrive/SelfDrive.tsx`
**Status**: ✅ Đã tích hợp API hoàn chỉnh

#### Những gì đã làm:

```typescript
// ✅ Import hooks
import { useVehicle } from "@/hooks/useVehicle";
import { useStation } from "@/hooks/useStation";
import { VehicleStatus } from "@/service";

// ✅ Sử dụng API methods
const {
  getAvailableVehicles,
  searchVehicles,
  filterByPriceRange,
  formatPricePerDay,
  getVehicleName,
  loading,
} = useVehicle();

const { getAllStations } = useStation();

// ✅ Load stations từ API
useEffect(() => {
  loadStations();
}, []);

const loadStations = async () => {
  const result = await getAllStations();
  if (result.success && result.data) {
    setStations(result.data.content || []);
  }
};

// ✅ Load vehicles từ API với filters
const loadVehicles = async () => {
  const filters: any = {
    status: VehicleStatus.AVAILABLE,
  };

  if (selectedLocation !== "all") {
    filters.stationId = selectedLocation;
  }

  const result = await getAvailableVehicles(filters);
  if (result.success && result.data) {
    setVehicles(result.data);
  }
};

// ✅ Search và Filter với helper methods
const filterVehicles = () => {
  let result = [...vehicles];

  if (searchTerm) {
    result = searchVehicles(result, searchTerm);
  }

  if (selectedCarType !== "all") {
    result = result.filter((v) => v.fuelType === selectedCarType);
  }

  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    result = filterByPriceRange(result, min, max);
  }

  setFilteredVehicles(result);
};
```

#### UI Features:

- ✅ Load trạm (stations) từ API → Dropdown filter
- ✅ Load xe khả dụng (available vehicles) từ API
- ✅ Search theo tên xe
- ✅ Filter theo loại nhiên liệu
- ✅ Filter theo khoảng giá
- ✅ Hiển thị loading state
- ✅ Hiển thị empty state khi không có xe
- ✅ Format giá tiền tự động
- ✅ Navigate tới trang chi tiết xe

---

### 2. HistoryService Page - Lịch Sử Đơn Thuê

**File**: `client/pages/Customer/HistoryService/HistoryService.tsx`
**Status**: ✅ Đã tích hợp API (cần xóa mock data)

#### Code Integration:

```typescript
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";

const { getUserBookings, getStatusText, getStatusColor, formatPrice, loading } =
  useBooking();

// Load booking history
const loadBookingHistory = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const result = await getUserBookings(userId);
  if (result.success && result.data) {
    setBookings(result.data);
  }
};
```

**TODO**: Cần xóa mock data (lines 91-500+) và update UI để render từ `filteredBookings`

---

### 3. CarIn4 Page - Chi Tiết Xe

**File**: `client/pages/Customer/CarIn4/CarIn4.tsx`
**Status**: 🔄 Cần tích hợp

#### Migration Plan:

```typescript
import { useVehicle } from "@/hooks/useVehicle";
import { useParams } from "react-router-dom";

const { id } = useParams();
const { getVehicleById, loading } = useVehicle();
const [vehicle, setVehicle] = useState(null);

useEffect(() => {
  loadVehicleDetail();
}, [id]);

const loadVehicleDetail = async () => {
  const result = await getVehicleById(id);
  if (result.success && result.data) {
    setVehicle(result.data);
    // result.data includes:
    // - Basic info: name, brand, model, year, etc.
    // - station: Station information
    // - specifications: Engine, battery, etc.
    // - currentBooking: If rented
    // - maintenanceHistory: Maintenance records
  }
};
```

---

### 4. User/in4 Page - Thông Tin Cá Nhân

**File**: `client/pages/Customer/User/in4.tsx`
**Status**: 🔄 Cần tích hợp

#### Migration Plan:

```typescript
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

const { getMyInfo, updateUser, uploadAvatar, uploadLicenseCard, loading } =
  useUser();

const [user, setUser] = useState(null);

useEffect(() => {
  loadUserInfo();
}, []);

const loadUserInfo = async () => {
  const result = await getMyInfo();
  if (result.success && result.data) {
    setUser(result.data);
  }
};

const handleUpdateProfile = async (formData) => {
  const userId = user.id;
  const result = await updateUser(userId, {
    fullName: formData.fullName,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
    dateOfBirth: formData.dateOfBirth,
  });

  if (result.success) {
    setUser(result.data);
    toast.success("Cập nhật thành công");
  }
};

const handleAvatarUpload = async (file) => {
  const result = await uploadAvatar(user.id, file);
  if (result.success) {
    setUser((prev) => ({ ...prev, avatarUrl: result.data.avatarUrl }));
  }
};

const handleLicenseUpload = async (file) => {
  const result = await uploadLicenseCard(user.id, file);
  if (result.success) {
    toast.success("Upload GPLX thành công, chờ admin xác minh");
  }
};
```

---

### 5. OrderDetail Page - Chi Tiết Đơn Hàng

**File**: `client/pages/Customer/OrderDetail/OrderDetail.tsx`
**Status**: 🔄 Cần tích hợp

#### Migration Plan:

```typescript
import { useBooking } from "@/hooks/useBooking";
import { useParams } from "react-router-dom";

const { id } = useParams();
const {
  getBookingById,
  getBookingInvoice,
  cancelBooking,
  extendBooking,
  loading,
} = useBooking();

const [booking, setBooking] = useState(null);
const [invoice, setInvoice] = useState(null);

useEffect(() => {
  loadBookingDetail();
  loadInvoice();
}, [id]);

const loadBookingDetail = async () => {
  const result = await getBookingById(id);
  if (result.success && result.data) {
    setBooking(result.data);
  }
};

const loadInvoice = async () => {
  const result = await getBookingInvoice(id);
  if (result.success && result.data) {
    setInvoice(result.data);
  }
};

const handleCancel = async () => {
  const result = await cancelBooking(id);
  if (result.success) {
    await loadBookingDetail();
    toast.success("Đã hủy đơn");
  }
};

const handleExtend = async (newEndTime) => {
  const result = await extendBooking(id, {
    newEndTime,
    additionalHours: calculateHours(newEndTime),
  });

  if (result.success) {
    toast.success(
      `Gia hạn thành công. Phí thêm: ${formatCurrency(result.data.additionalCost)}`,
    );
    await loadBookingDetail();
  }
};
```

---

## 📊 Tổng Kết

### ✅ Hoàn Thành (2/5)

1. **SelfDrive** - Browse và search vehicles ✅
2. **HistoryService** - View booking history ✅ (cần dọn mock data)

### 🔄 Cần Làm (3/5)

3. **CarIn4** - Vehicle detail page
4. **User/in4** - User profile management
5. **OrderDetail** - Booking detail & actions

### 🎯 Next Steps

#### Immediate:

1. **Dọn dẹp HistoryService.tsx**:
   - Xóa mock data (lines 91-500)
   - Update UI render từ `filteredBookings` state

2. **Test SelfDrive**:

   ```bash
   # Start backend
   cd backend && ./mvnw spring-boot:run

   # Start frontend
   cd FE/aws-project && pnpm dev

   # Navigate to /self-drive
   # Kiểm tra: stations load, vehicles load, search/filter hoạt động
   ```

#### Short-term:

3. **Tích hợp CarIn4** (chi tiết xe)
4. **Tích hợp User/in4** (profile user)
5. **Tích hợp OrderDetail** (chi tiết booking)

---

## 🧪 Testing Guide

### Test SelfDrive:

```bash
# 1. Backend chạy ở http://localhost:8080
# 2. Frontend chạy ở http://localhost:5173
# 3. Truy cập: http://localhost:5173/self-drive

# Expected:
✅ Danh sách stations hiển thị trong dropdown
✅ Danh sách vehicles hiển thị (available only)
✅ Search hoạt động
✅ Filter theo location, car type, price range hoạt động
✅ Click vào xe navigate tới /car/:id
```

### Test HistoryService:

```bash
# 1. Login trước
# 2. Truy cập: http://localhost:5173/history

# Expected:
✅ Load bookings của user hiện tại
✅ Hiển thị status với màu sắc đúng
✅ Search theo booking ID hoạt động
✅ Filter theo status hoạt động
```

---

## 🔑 Key API Methods Used

### From `useVehicle`:

- `getAllVehicles()` - Get all vehicles (paginated)
- `getAvailableVehicles(filters)` - Get available vehicles
- `getVehicleById(id)` - Get vehicle detail
- `searchVehicles(vehicles, query)` - Client-side search
- `filterByPriceRange(vehicles, min, max)` - Client-side filter
- `formatPricePerDay(price)` - Format currency
- `getVehicleName(vehicle)` - Format vehicle name

### From `useStation`:

- `getAllStations()` - Get all stations
- `getNearbyStations(coords, radius)` - Get nearby stations

### From `useBooking`:

- `getUserBookings(userId)` - Get user's booking history
- `getBookingById(id)` - Get booking detail
- `getBookingInvoice(id)` - Get invoice
- `cancelBooking(id)` - Cancel booking
- `extendBooking(id, data)` - Extend rental period
- `getStatusText(status)` - Format status text
- `getStatusColor(status)` - Get status badge color
- `formatPrice(amount)` - Format currency

### From `useUser`:

- `getMyInfo()` - Get current user info
- `updateUser(id, data)` - Update profile
- `uploadAvatar(id, file)` - Upload avatar
- `uploadLicenseCard(id, file)` - Upload license card

### From `useAuth`:

- `getCurrentUser()` - Get logged-in user
- `isAuthenticated()` - Check if user logged in

---

## 🚨 Important Notes

1. **User ID**: Lấy từ `localStorage.getItem('userId')` sau khi login
2. **Loading States**: Luôn hiển thị loading spinner khi gọi API
3. **Empty States**: Hiển thị thông báo khi không có data
4. **Error Handling**: Toast notifications cho errors
5. **Image Fallbacks**: Dùng placeholder khi không có ảnh

---

**Last Updated**: November 10, 2025  
**Status**: SelfDrive ✅ | HistoryService ✅ | Others 🔄
