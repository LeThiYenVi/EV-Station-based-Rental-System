# Mobile App Development TODO List

**Project:** EV Station-based Rental System - Mobile App  
**Target Roles:** RENTER (Customer) & STAFF (Station Staff)  
**Last Updated:** November 7, 2025  
**Status:** 20% Complete (11/54 tasks - Phase 1 & 2 complete, Phase 3 in progress)

> **Note:** This mobile app is designed for RENTER and STAFF roles only. Admin features are handled via web dashboard.

---

## 📱 UI Library Guidelines & Standards

### **Primary UI Libraries**

- **React Native Paper** - Material Design components
- **React Native Elements** - Cross-platform UI toolkit
- **UI Kitten** - Eva Design System components
- **NativeWind** - Tailwind CSS for React Native

### **🎨 UI Component Usage Rules**

#### **1. Component Selection Priority**

```
1st Choice: React Native Paper (for Material Design consistency)
2nd Choice: React Native Elements (for flexibility)
3rd Choice: UI Kitten (for complex layouts)
4th Choice: NativeWind (for custom styling)
```

#### **2. When to Use Each Library**

**React Native Paper** - Use for:

- ✅ Buttons, FAB (Floating Action Button)
- ✅ Cards, Lists, Dividers
- ✅ Text inputs, Searchbars
- ✅ Dialogs, Modals, Snackbars
- ✅ App bars, Bottom navigation
- ✅ Chips, Badges, Avatars
- ✅ Progress indicators (Circular, Linear)
- ✅ Data tables

**React Native Elements** - Use for:

- ✅ Custom headers
- ✅ Rating components
- ✅ Social icons, badges
- ✅ Pricing cards
- ✅ Tiles, Overlays
- ✅ Sliders, Checkboxes
- ✅ Bottom sheets

**UI Kitten** - Use for:

- ✅ Calendar/DatePicker
- ✅ Auto-complete inputs
- ✅ Toggle switches
- ✅ Dropdown/Select menus
- ✅ Tab navigation
- ✅ Tooltips, Popovers
- ✅ Drawer navigation

**NativeWind** - Use for:

- ✅ Custom layouts (flex, grid)
- ✅ Spacing (margin, padding)
- ✅ Colors, backgrounds
- ✅ Typography customization
- ✅ Responsive design
- ✅ Custom animations

#### **3. Styling Standards**

```typescript
// ✅ CORRECT: Combine libraries properly
import { Button, Card } from 'react-native-paper';
import { View, Text } from 'react-native';

<Card className="m-4 shadow-lg"> {/* NativeWind for layout */}
  <Card.Title title="Station Name" /> {/* Paper for content */}
  <Card.Content>
    <Text className="text-gray-600 text-sm"> {/* NativeWind for text */}
      Available Vehicles: 12
    </Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="contained">Book Now</Button> {/* Paper button */}
  </Card.Actions>
</Card>

// ❌ WRONG: Mixing too many libraries for same component
<UIKittenButton> {/* Don't mix button libraries */}
  <PaperText>Submit</PaperText>
</UIKittenButton>
```

#### **4. Theme Configuration**

```typescript
// theme.ts - Centralized theme
import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#00B894", // EV Green
    secondary: "#0984E3",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    error: "#FF6B6B",
    text: "#2D3436",
    disabled: "#B2BEC3",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
```

#### **5. Component Naming Convention**

```typescript
// File: components/VehicleCard.tsx
// ✅ CORRECT
export const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => { ... }

// ❌ WRONG
export default function vehicleCard() { ... }
```

#### **6. Required Props Pattern**

```typescript
// ✅ CORRECT: Define clear interfaces
interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  showActions?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  showActions = true
}) => { ... }
```

#### **7. Loading & Error States**

```typescript
// ✅ CORRECT: Always handle loading and error states
import { ActivityIndicator, Text } from "react-native-paper";

if (isLoading) {
  return <ActivityIndicator size="large" className="flex-1" />;
}

if (error) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text variant="bodyLarge" className="text-red-500">
        {error.message}
      </Text>
      <Button mode="outlined" onPress={retry}>
        Retry
      </Button>
    </View>
  );
}
```

#### **8. Responsive Design Rules**

```typescript
// ✅ CORRECT: Use responsive utilities
<View className="w-full md:w-1/2 lg:w-1/3 p-4">
  <Card className="h-full">{/* Content */}</Card>
</View>;

// Use hooks for complex responsive logic
import { useWindowDimensions } from "react-native";

const { width } = useWindowDimensions();
const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;
```

#### **9. Accessibility Requirements**

```typescript
// ✅ CORRECT: Add accessibility props
<Button
  mode="contained"
  onPress={handleSubmit}
  accessibilityLabel="Submit booking request"
  accessibilityHint="Submits your vehicle booking"
  accessibilityRole="button"
>
  Submit
</Button>

<Image
  source={vehicle.photo}
  accessibilityLabel={`${vehicle.name} vehicle photo`}
/>
```

#### **10. Form Input Standards**

```typescript
// ✅ CORRECT: Use Paper TextInput with validation
import { TextInput, HelperText } from 'react-native-paper';

<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
  keyboardType="email-address"
  autoCapitalize="none"
  error={emailError !== ''}
  left={<TextInput.Icon icon="email" />}
/>
<HelperText type="error" visible={emailError !== ''}>
  {emailError}
</HelperText>
```

---

## 🔴 **Phase 1: Foundation & Setup** (Priority: CRITICAL)

### ✅ Task 1: Setup API Client & Configuration

**Status:** ✅ COMPLETED  
**Files:** `api/apiClient.ts`

**Requirements:**

- Replace mock URL `https://68e63fad21dd31f22cc4c447.mockapi.io` with real backend
- Add environment variables for API URLs (dev, staging, prod)
- Implement Axios interceptors for:
  - Adding Bearer token to headers
  - Handling token refresh (401 errors)
  - Global error handling
  - Request/response logging (dev mode)
- Add timeout configuration (10s default)
- Add retry logic for failed requests

**Code Pattern:**

```typescript
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    return Promise.reject(error);
  }
);
```

**UI Components:** None (Backend integration)

---

### ✅ Task 2: Create TypeScript Type Definitions

**Status:** ✅ COMPLETED  
**Files:** `types/` folder

**Requirements:**
Create type files matching API responses:

1. **types/User.ts**

```typescript
export enum UserRole {
  RENTER = "RENTER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  cognitoSub?: string;
  avatarUrl?: string;
  role: UserRole;
  licenseNumber?: string;
  identityNumber?: string;
  licenseCardImageUrl?: string;
  isLicenseVerified: boolean;
  verifiedAt?: string;
  stationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  licenseNumber?: string;
  identityNumber?: string;
  stationId?: string;
}
```

2. **types/Booking.ts**
3. **types/Vehicle.ts**
4. **types/Station.ts**
5. **types/Payment.ts**
6. **types/Enums.ts**

**UI Components:** None (Type definitions)

---

### ✅ Task 3: Implement Authentication API

**Status:** ✅ COMPLETED  
**Files:** `api/AuthApi.ts`

**Requirements:**

- All auth endpoints from API docs
- Store tokens in `expo-secure-store`
- Implement token refresh mechanism
- Handle OAuth flow

**Code Pattern:**

```typescript
import apiClient from "./apiClient";
import * as SecureStore from "expo-secure-store";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const AuthApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/api/auth/login", data);
    const authData = response.data.data;

    // Store tokens securely
    await SecureStore.setItemAsync("accessToken", authData.accessToken);
    await SecureStore.setItemAsync("refreshToken", authData.refreshToken);

    return authData;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/api/auth/register", data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      await apiClient.post("/api/auth/logout", { token });
    }
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const response = await apiClient.post("/api/auth/refresh", null, {
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    return response.data.data;
  },

  // Add all other auth methods...
};
```

**UI Components:** None (API layer)

---

### ✅ Task 4: Update Auth Context

**Status:** ✅ COMPLETED  
**Files:** `context/authContext.tsx`

**Requirements:**

- Replace mock login with real API
- Implement auto token refresh
- Persist user state
- Handle session expiry

**UI Libraries:**

- **React Native Paper**: `Snackbar` for auth notifications
- **NativeWind**: Layout styling

**Code Pattern:**

```typescript
import React, { createContext, useState, useEffect } from "react";
import { AuthApi } from "@/api/AuthApi";
import { UserResponse } from "@/types/User";
import { Snackbar } from "react-native-paper";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  const login = async (email: string, password: string) => {
    try {
      const authData = await AuthApi.login({ email, password });
      setUser(authData.user);
      setToken(authData.accessToken);
      setSnackbar({ visible: true, message: "Login successful!" });
    } catch (error) {
      setSnackbar({ visible: true, message: "Login failed!" });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: "" })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </AuthContext.Provider>
  );
};
```

---

## 🟡 **Phase 2: Core API Services** (Priority: HIGH)

### ✅ Task 5: Create Station API Service

**Status:** ✅ COMPLETED  
**Files:** `api/StationApi.ts`

**Requirements:**

- Replace `PlaceApi.ts` completely
- **RENTER APIs:**
  - GET /api/stations - Get all stations (public)
  - GET /api/stations/{stationId} - Get station detail (public)
  - GET /api/stations/active - Get active stations (public)
  - GET /api/stations/status/{status} - Get stations by status (public)
  - GET /api/stations/{stationId}/vehicles/available/count - Get vehicle count (public)
  - GET /api/locations/stations/nearby - Find nearby stations (public)
- **Exclude ADMIN APIs:** Create, Update, Delete, Change status, Upload photo
- Add caching for station list
- Handle pagination

**UI Components:** None (API layer)

---

### ✅ Task 6: Create Vehicle API Service

**Status:** ✅ COMPLETED  
**Files:** `api/VehicleApi.ts`

**Requirements:**

- **RENTER APIs:**
  - GET /api/vehicles - Get all vehicles (public)
  - GET /api/vehicles/{vehicleId} - Get vehicle detail (public)
  - GET /api/vehicles/station/{stationId} - Get vehicles by station (public)
  - GET /api/vehicles/available - Get available vehicles with filters (public)
  - GET /api/vehicles/available/booking - Get available vehicles for time range (public)
  - GET /api/vehicles/status/{status} - Get vehicles by status (public)
  - GET /api/vehicles/brand/{brand} - Get vehicles by brand (public)
- **Exclude STAFF/ADMIN APIs:** Create, Update, Delete, Change status, Upload photos, Increment rent count
- Filter and search capabilities
- Handle photo arrays
- Availability checking with time range

**UI Components:** None (API layer)

---

### ✅ Task 7: Create Booking API Service

**Status:** ✅ COMPLETED  
**Files:** `api/BookingApi.ts`

**Requirements:**

- **RENTER APIs:**
  - POST /api/bookings - Create booking (RENTER)
  - GET /api/bookings/{bookingId} - Get booking detail (RENTER, STAFF)
  - GET /api/bookings/code/{bookingCode} - Get booking by code (RENTER, STAFF)
  - GET /api/bookings/my-bookings - Get my bookings (RENTER)
  - PATCH /api/bookings/{bookingId}/cancel - Cancel booking (RENTER, STAFF)
- **STAFF APIs (for Staff mobile app):**
  - GET /api/bookings - Get all bookings (STAFF)
  - GET /api/bookings/status/{status} - Get by status (STAFF)
  - GET /api/bookings/vehicle/{vehicleId} - Get by vehicle (STAFF)
  - GET /api/bookings/station/{stationId} - Get by station (STAFF)
  - PUT /api/bookings/{bookingId} - Update booking (STAFF)
  - PATCH /api/bookings/{bookingId}/confirm - Confirm booking (STAFF)
  - PATCH /api/bookings/{bookingId}/start - Start booking (STAFF)
  - PATCH /api/bookings/{bookingId}/complete - Complete booking (STAFF)
- **Exclude ADMIN APIs:** DELETE booking
- Booking history and status tracking
- Real-time updates for booking status changes

**UI Components:** None (API layer)

---

### ✅ Task 8: Create Payment API Service

**Status:** ✅ COMPLETED  
**Files:** `api/PaymentApi.ts`

**Requirements:**

- **RENTER/STAFF APIs:**
  - GET /api/payments/{paymentId} - Get payment by ID (RENTER, STAFF)
  - GET /api/payments/booking/{bookingId} - Get payments by booking (RENTER, STAFF)
  - GET /api/payments/transaction/{transactionId} - Get payment by transaction (RENTER, STAFF)
- **Payment Flow:**
  - MoMo payment integration (initiated from booking creation)
  - Payment callback handling (handled by backend, app receives deep link)
  - Payment status tracking
  - Transaction history viewing
- **Note:** Payment creation is handled through booking creation endpoint

**UI Components:** None (API layer)

---

### ✅ Task 9: Create User API Service

**Status:** ✅ COMPLETED  
**Files:** `api/UserApi.ts`

**Requirements:**

- User profile management (GET /me, PUT /{userId})
- Avatar upload (multipart/form-data) - POST /{userId}/avatar
- License card upload - POST /{userId}/license-card
- View own profile and update own information
- **Note:** Exclude admin-only endpoints (GET all users, delete user, update role)

**Code Pattern:**

```typescript
export const UserApi = {
  async uploadAvatar(userId: string, imageUri: string): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    const response = await apiClient.post(
      `/api/users/${userId}/avatar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  },
};
```

**UI Components:** None (API layer)

---

## 🟢 **Phase 3: Screen Development** (Priority: MEDIUM)

### ✅ Task 10: Update Dashboard - Station Search

**Status:** ✅ COMPLETED  
**Files:** `app/(tab)/dashboard/index.tsx`, `hooks/useStations.ts`

**UI Libraries:**

- **React Native Paper**: `Searchbar`, `Card`, `Chip`, `FAB`
- **React Native Elements**: `Rating`, `Badge`
- **NativeWind**: Layout, spacing, responsive grid

**Components to Use:**

```typescript
import { Searchbar, Card, Chip, FAB, Button } from "react-native-paper";
import { Rating, Badge } from "@rneui/themed";
import { View, ScrollView, FlatList } from "react-native";

<View className="flex-1 bg-gray-50">
  <Searchbar
    placeholder="Search stations..."
    onChangeText={setSearchQuery}
    value={searchQuery}
    className="m-4"
  />

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="px-4"
  >
    <Chip selected={filter === "all"} onPress={() => setFilter("all")}>
      All
    </Chip>
    <Chip selected={filter === "nearby"} onPress={() => setFilter("nearby")}>
      Nearby
    </Chip>
  </ScrollView>

  <FlatList
    data={stations}
    renderItem={({ item }) => (
      <Card className="mx-4 mb-4" onPress={() => goToDetail(item.id)}>
        <Card.Cover source={{ uri: item.photo }} />
        <Card.Title
          title={item.name}
          subtitle={`${item.distanceKm} km away`}
          right={() => <Rating readonly startingValue={item.rating} />}
        />
        <Card.Content>
          <Badge value={`${item.availableVehiclesCount} available`} />
        </Card.Content>
      </Card>
    )}
  />

  <FAB
    icon="filter"
    className="absolute bottom-4 right-4"
    onPress={showFilters}
  />
</View>;
```

**Requirements:**

- Location-based search
- Filters: fuel type, brand, rating, distance
- Sort options
- Pull-to-refresh
- Skeleton loading

---

### ✅ Task 11: Create Station Detail Screen

**Status:** ✅ COMPLETED  
**Files:** `app/dashboard/station-detail.tsx`

**UI Libraries:**

- **React Native Paper**: `Appbar`, `List`, `Divider`, `IconButton`
- **React Native Elements**: `Rating`, `Icon`, `ListItem`
- **UI Kitten**: `Calendar` (for booking date selection)
- **NativeWind**: Layout and styling

**Components Pattern:**

```typescript
import { Appbar, List, Divider, IconButton, Chip } from "react-native-paper";
import { Rating, Icon } from "@rneui/themed";
import { View, ScrollView, Image } from "react-native";

<View className="flex-1">
  <Appbar.Header>
    <Appbar.BackAction onPress={goBack} />
    <Appbar.Content title={station.name} />
    <Appbar.Action icon="share" onPress={share} />
  </Appbar.Header>

  <ScrollView>
    <Image source={{ uri: station.photo }} className="w-full h-64" />

    <View className="p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Rating readonly startingValue={station.rating} />
        <Chip icon="map-marker">{station.distanceKm} km</Chip>
      </View>

      <List.Item
        title="Address"
        description={station.address}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
      <Divider />

      <List.Item
        title="Operating Hours"
        description={`${station.startTime} - ${station.endTime}`}
        left={(props) => <List.Icon {...props} icon="clock" />}
      />
      <Divider />

      <List.Item
        title="Hotline"
        description={station.hotline}
        left={(props) => <List.Icon {...props} icon="phone" />}
        right={(props) => <IconButton icon="phone" onPress={callHotline} />}
      />
    </View>

    {/* Available Vehicles Section */}
    <View className="p-4">
      <Text className="text-lg font-bold mb-4">
        Available Vehicles ({station.availableVehicles.length})
      </Text>
      {/* Vehicle list */}
    </View>
  </ScrollView>

  <View className="p-4 border-t border-gray-200">
    <Button mode="contained" onPress={startBooking}>
      Book Vehicle
    </Button>
  </View>
</View>;
```

---

### ✅ Task 12: Create Vehicle Detail Screen

**Status:** Not Started  
**Files:** `app/dashboard/vehicle-detail.tsx`

**UI Libraries:**

- **React Native Paper**: `Appbar`, `Card`, `Chip`, `Button`, `Badge`
- **React Native Elements**: `Rating`, `Icon`, `Slider`
- **NativeWind**: Grid layout, spacing

**Components Pattern:**

```typescript
import { Appbar, Card, Chip, Button, Badge } from "react-native-paper";
import { Rating, Icon, Slider } from "@rneui/themed";
import { View, ScrollView, Image, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

<View className="flex-1">
  <Appbar.Header>
    <Appbar.BackAction onPress={goBack} />
    <Appbar.Content title={vehicle.name} />
    <Appbar.Action icon="heart-outline" onPress={addToFavorites} />
  </Appbar.Header>

  <ScrollView>
    {/* Photo Carousel */}
    <Carousel
      data={vehicle.photos}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} className="w-full h-64 rounded-lg" />
      )}
      sliderWidth={width}
      itemWidth={width}
    />

    <View className="p-4">
      {/* Status Badge */}
      <Badge className="self-start mb-2">
        {vehicle.status === "AVAILABLE" ? "Available" : "Not Available"}
      </Badge>

      {/* Rating and Rent Count */}
      <View className="flex-row items-center justify-between mb-4">
        <Rating readonly startingValue={vehicle.rating} imageSize={20} />
        <Text className="text-gray-600">Rented {vehicle.rentCount} times</Text>
      </View>

      {/* Specs */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        <Chip icon="gas-station" mode="outlined">
          {vehicle.fuelType}
        </Chip>
        <Chip icon="palette" mode="outlined">
          {vehicle.color}
        </Chip>
        <Chip icon="account-group" mode="outlined">
          {vehicle.capacity} seats
        </Chip>
      </View>

      {/* Pricing */}
      <Card className="mb-4">
        <Card.Content>
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Hourly Rate</Text>
            <Text className="text-lg text-green-600 font-bold">
              ${vehicle.hourlyRate}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Daily Rate</Text>
            <Text className="text-lg text-green-600 font-bold">
              ${vehicle.dailyRate}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Deposit</Text>
            <Text className="text-lg font-bold">${vehicle.depositAmount}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Station Info */}
      <Card>
        <Card.Title title="Pickup Location" subtitle={vehicle.stationName} />
      </Card>
    </View>
  </ScrollView>

  {/* Book Button */}
  <View className="p-4 border-t border-gray-200">
    <Button
      mode="contained"
      onPress={bookVehicle}
      disabled={vehicle.status !== "AVAILABLE"}
    >
      Book Now
    </Button>
  </View>
</View>;
```

---

### ✅ Task 13-17: Create Booking Flow (4 Steps + Confirmation)

**Status:** Not Started  
**Files:** `app/booking/*.tsx`

**UI Libraries for Booking Flow:**

- **UI Kitten**: `Calendar`, `Datepicker` (Step 1)
- **React Native Paper**: `TextInput`, `Button`, `Card`, `RadioButton`
- **React Native Elements**: `CheckBox`, `Pricing`
- **NativeWind**: Stepper layout, form styling

**Step 1: Date/Time Selection** (`app/booking/select-time.tsx`)

```typescript
import { Calendar } from "@ui-kitten/components";
import { Button, Card, HelperText } from "react-native-paper";

<View className="flex-1 p-4">
  <Card className="mb-4">
    <Card.Title title="Select Rental Period" />
    <Card.Content>
      <Text className="mb-2">Start Date & Time</Text>
      <Calendar date={startDate} onSelect={setStartDate} min={new Date()} />

      <Text className="mt-4 mb-2">End Date & Time</Text>
      <Calendar date={endDate} onSelect={setEndDate} min={startDate} />

      <HelperText type="info">
        Duration: {calculateDuration(startDate, endDate)} hours
      </HelperText>

      <View className="mt-4 p-4 bg-blue-50 rounded-lg">
        <Text className="text-lg font-bold">Estimated Cost</Text>
        <Text className="text-2xl text-blue-600 font-bold">
          ${estimatedPrice}
        </Text>
      </View>
    </Card.Content>
  </Card>

  <Button mode="contained" onPress={goToVehicleSelection}>
    Continue
  </Button>
</View>;
```

**Step 2: Vehicle Selection** (`app/booking/select-vehicle.tsx`)

```typescript
import { Searchbar, Card, Chip, RadioButton } from "react-native-paper";
import { Rating } from "@rneui/themed";

<View className="flex-1">
  <Searchbar
    placeholder="Search vehicles..."
    value={searchQuery}
    onChangeText={setSearchQuery}
    className="m-4"
  />

  <ScrollView horizontal className="px-4 mb-4">
    <Chip selected={fuelFilter === "all"} onPress={() => setFuelFilter("all")}>
      All
    </Chip>
    <Chip
      selected={fuelFilter === "ELECTRIC"}
      onPress={() => setFuelFilter("ELECTRIC")}
    >
      Electric
    </Chip>
    <Chip
      selected={fuelFilter === "HYBRID"}
      onPress={() => setFuelFilter("HYBRID")}
    >
      Hybrid
    </Chip>
  </ScrollView>

  <FlatList
    data={availableVehicles}
    renderItem={({ item }) => (
      <Card className="mx-4 mb-4" onPress={() => selectVehicle(item)}>
        <Card.Cover source={{ uri: item.photos[0] }} />
        <Card.Content>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold">{item.name}</Text>
            <RadioButton
              value={item.id}
              status={selectedVehicle?.id === item.id ? "checked" : "unchecked"}
            />
          </View>
          <Rating readonly startingValue={item.rating} imageSize={16} />
          <Text className="text-green-600 font-bold text-lg mt-2">
            ${item.hourlyRate}/hr • ${item.dailyRate}/day
          </Text>
        </Card.Content>
      </Card>
    )}
  />

  <View className="p-4 border-t border-gray-200">
    <Button mode="contained" onPress={goToReview} disabled={!selectedVehicle}>
      Continue to Review
    </Button>
  </View>
</View>;
```

---

### ✅ Task 18: Update Trip Tab - My Bookings List

**Status:** Not Started  
**Files:** `app/(tab)/trip/index.tsx`

**UI Libraries:**

- **UI Kitten**: `Tab`, `TabBar` (for status filters)
- **React Native Paper**: `Card`, `Badge`, `FAB`
- **React Native Elements**: `ListItem`, `Badge`
- **NativeWind**: List layout

**Components Pattern:**

```typescript
import { Tab, TabBar } from "@ui-kitten/components";
import { Card, Badge as PaperBadge, FAB } from "react-native-paper";
import { Badge } from "@rneui/themed";

const [selectedIndex, setSelectedIndex] = useState(0);

const statusFilters = [
  "All",
  "Pending",
  "Confirmed",
  "Started",
  "Completed",
  "Cancelled",
];

<View className="flex-1">
  <TabBar selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
    {statusFilters.map((status) => (
      <Tab key={status} title={status} />
    ))}
  </TabBar>

  <FlatList
    data={filteredBookings}
    refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
    }
    renderItem={({ item }) => (
      <Card className="m-4" onPress={() => goToBookingDetail(item.id)}>
        <Card.Content>
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold">{item.vehicleName}</Text>
            <Badge value={item.status} status={getStatusColor(item.status)} />
          </View>

          <Text className="text-gray-600">{item.bookingCode}</Text>
          <Text className="text-gray-600">
            {formatDate(item.startTime)} - {formatDate(item.expectedEndTime)}
          </Text>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold">${item.totalAmount}</Text>
            <PaperBadge>{item.paymentStatus}</PaperBadge>
          </View>
        </Card.Content>
      </Card>
    )}
    ListEmptyComponent={() => (
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-gray-500 text-center">No bookings found</Text>
      </View>
    )}
  />

  <FAB
    icon="plus"
    className="absolute bottom-4 right-4"
    onPress={createNewBooking}
  />
</View>;
```

---

### ✅ Task 19: Create Booking Detail Screen

**Status:** Not Started  
**Files:** `app/trip/booking-detail.tsx`

**UI Libraries:**

- **React Native Paper**: `Appbar`, `Card`, `Button`, `Dialog`, `Portal`
- **React Native Elements**: `Avatar`, `Icon`
- **NativeWind**: Layout and spacing

---

### ✅ Task 20: Create Booking Timeline Component

**Status:** Not Started  
**Files:** `components/BookingTimeline.tsx`

**UI Libraries:**

- **React Native Elements**: `Icon`
- **NativeWind**: Custom timeline layout

**Components Pattern:**

```typescript
import { Icon } from '@rneui/themed';
import { View, Text } from 'react-native';

interface TimelineStep {
  status: string;
  label: string;
  timestamp?: string;
  staffName?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export const BookingTimeline: React.FC<{ booking: Booking }> = ({ booking }) => {
  const steps: TimelineStep[] = [
    { status: 'PENDING', label: 'Booking Created', ... },
    { status: 'CONFIRMED', label: 'Confirmed', ... },
    { status: 'STARTED', label: 'Picked Up', ... },
    { status: 'COMPLETED', label: 'Returned', ... },
  ];

  return (
    <View className="p-4">
      {steps.map((step, index) => (
        <View key={step.status} className="flex-row">
          {/* Timeline Line */}
          <View className="items-center">
            <Icon
              name={step.isCompleted ? 'check-circle' : 'radio-button-unchecked'}
              type="material"
              color={step.isCompleted ? '#00B894' : '#B2BEC3'}
              size={32}
            />
            {index < steps.length - 1 && (
              <View className={`w-1 h-12 ${step.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </View>

          {/* Step Content */}
          <View className="flex-1 ml-4 mb-4">
            <Text className={`text-lg font-bold ${step.isCompleted ? 'text-black' : 'text-gray-400'}`}>
              {step.label}
            </Text>
            {step.timestamp && (
              <Text className="text-gray-600">{formatDate(step.timestamp)}</Text>
            )}
            {step.staffName && (
              <Text className="text-gray-500">by {step.staffName}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};
```

---

### ✅ Task 21-23: Update Profile Screens

**Status:** Not Started  
**Files:** `app/(tab)/profile/index.tsx`, `app/profile/*.tsx`

**UI Libraries:**

- **React Native Paper**: `Avatar`, `List`, `Switch`, `TextInput`
- **React Native Elements**: `ListItem`, `Icon`
- **NativeWind**: Profile layout

---

### ✅ Task 24-27: Create Auth Screens

**Status:** Not Started  
**Files:** `app/auth/*.tsx`, `app/profile/change-password.tsx`

**UI Libraries:**

- **React Native Paper**: `TextInput`, `Button`, `HelperText`, `ProgressBar`
- **React Native Elements**: `Input`, `Icon`
- **NativeWind**: Form layout

**Register Screen Pattern:**

```typescript
import { TextInput, Button, HelperText, ProgressBar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  fullName: yup.string().min(3).required(),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/)
    .required(),
  password: yup.string().min(8).max(20).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await AuthApi.register(data);
      router.push("/auth/verify");
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>

      {isLoading && <ProgressBar indeterminate />}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              left={<TextInput.Icon icon="email" />}
              disabled={isLoading}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email?.message}
            </HelperText>
          </>
        )}
      />

      {/* Other fields... */}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        className="mt-4"
      >
        Register
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/login")}
        disabled={isLoading}
      >
        Already have an account? Login
      </Button>
    </ScrollView>
  );
}
```

---

## 🔵 **Phase 4: Enhanced Features** (Priority: MEDIUM-LOW)

### ✅ Task 28: Implement Location Services

**Status:** Not Started

**Packages to Install:**

```bash
npx expo install expo-location
```

**UI Libraries:**

- **React Native Paper**: `Dialog` (for permission request)
- **NativeWind**: Permission screen layout

---

### ✅ Task 29: Create Map Integration

**Status:** Not Started

**Packages to Install:**

```bash
npm install react-native-maps
npx expo install expo-location
```

**UI Libraries:**

- **react-native-maps**: MapView, Marker
- **React Native Paper**: `FAB`, `Card` (for map info)

---

### ✅ Task 30: Implement Push Notifications

**Status:** Not Started

**Packages to Install:**

```bash
npx expo install expo-notifications expo-device
```

---

### ✅ Task 31-34: Create Reusable Components

**Status:** Not Started

**Files:** `components/*.tsx`

**UI Library Standards:**

- Use **React Native Paper** as primary UI library
- Add **NativeWind** for custom layouts
- Ensure all components are typed with TypeScript
- Add loading and error states
- Make components reusable with clear props interface

---

### ✅ Task 35: Implement Image Upload & Preview

**Status:** Not Started

**Packages to Install:**

```bash
npx expo install expo-image-picker expo-image-manipulator
```

**UI Libraries:**

- **React Native Paper**: `Button`, `ActivityIndicator`, `ProgressBar`
- **NativeWind**: Image preview layout

**Code Pattern:**

```typescript
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Button, ActivityIndicator, ProgressBar } from "react-native-paper";

export const ImageUploadComponent = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Compress image
      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      await uploadImage(compressed.uri);
    }
  };

  return (
    <View className="p-4">
      <Button
        mode="outlined"
        icon="camera"
        onPress={pickImage}
        disabled={uploading}
      >
        Choose Photo
      </Button>

      {uploading && (
        <>
          <ActivityIndicator className="mt-4" />
          <ProgressBar progress={uploadProgress} className="mt-2" />
        </>
      )}
    </View>
  );
};
```

---

### ✅ Task 36: Add Form Validation

**Status:** Not Started

**Packages to Install:**

```bash
npm install react-hook-form @hookform/resolvers yup
npm install -D @types/yup
```

**Validation Schemas to Create:**

- `validators/authSchema.ts` - Login, Register, Password
- `validators/bookingSchema.ts` - Booking creation
- `validators/profileSchema.ts` - Profile updates
- `validators/vehicleSchema.ts` - Vehicle search/filters

---

### ✅ Task 37-38: Error Handling & Loading States

**Status:** Not Started

**Files:** `components/ErrorBoundary.tsx`, `components/LoadingStates.tsx`

**UI Libraries:**

- **React Native Paper**: `ActivityIndicator`, `Snackbar`, `Banner`
- **NativeWind**: Error screen layouts

---

### ✅ Task 39-40: Pull-to-Refresh & Pagination

**Status:** Not Started

**Native Components:**

- `RefreshControl` from React Native
- `FlatList` with `onEndReached`

**UI Libraries:**

- **React Native Paper**: `ActivityIndicator` (for loading)
- **NativeWind**: Layout

---

## ⚪ **Phase 5: Additional Features** (Priority: LOW)

### ✅ Task 41: Create Favorites Feature

**Status:** Not Started  
**Files:** `app/profile/favorites.tsx`

**Requirements:**

- Store favorite vehicles and stations locally (AsyncStorage)
- Add/remove favorites with heart icon
- Show favorites list in profile section
- Quick access to favorite stations/vehicles
- **Note:** Backend API doesn't support favorites, implement client-side only

**UI Libraries:**

- **React Native Paper**: `Card`, `IconButton`, `List`
- **React Native Elements**: `Icon` (heart)
- **NativeWind**: Grid layout

---

### ✅ Task 42: Implement QR Code Scanner (STAFF only)

**Status:** Not Started  
**Files:** `app/staff/qr-scanner.tsx`

**Requirements:**

- Scan booking QR codes at vehicle pickup/return
- Quick lookup of booking by code
- Confirm/Start/Complete booking actions after scanning
- **Target:** STAFF role only for check-in/check-out process

**Packages:**

```bash
npx expo install expo-barcode-scanner
```

**UI Libraries:**

- **React Native Paper**: `Button`, `Card`, `Dialog`
- **NativeWind**: Scanner overlay layout

---

### ✅ Task 43: Add Deep Linking

**Status:** Not Started

**Requirements:**

- Payment callback deep link (from MoMo app back to app)
- Booking details deep link (from notifications)
- Vehicle details deep link (from sharing)
- Station details deep link (from maps)
- **Config:** Update app.json with URL schemes

---

### ✅ Task 44: Implement Analytics

**Status:** Not Started

**Requirements:**

- Track screen views (dashboard, booking flow, profile)
- Track booking conversions (started → completed)
- Track search queries and filters used
- Track errors and crashes
- User behavior analytics (most viewed vehicles, popular stations)

**Packages:**

```bash
npm install @react-native-firebase/analytics
```

---

### ✅ Task 45: Add Accessibility Features

**Status:** Not Started

**Requirements:**

- Accessibility labels for all interactive elements
- Screen reader support (iOS VoiceOver, Android TalkBack)
- Proper color contrast (WCAG AA standard)
- Scalable fonts (respect system font size)
- Keyboard navigation support
- Test with Accessibility Inspector

**UI Libraries:**

- React Native Paper (built-in accessibility)
- Add accessibilityLabel, accessibilityHint, accessibilityRole to all components

---

### ✅ Task 46: Create Support/Help Section

**Status:** Not Started  
**Files:** `app/(tab)/support/index.tsx`

**Requirements:**

- FAQ section (collapsible list)
- Contact support form (email submission)
- Show support hotline (call button)
- Report issue form (with screenshot)
- How-to guides for:
  - Creating a booking
  - Uploading license
  - Payment process
  - Cancellation policy

**UI Libraries:**

- **React Native Paper**: `List.Accordion`, `TextInput`, `Button`
- **React Native Elements**: `ListItem`
- **NativeWind**: Layout

---

### ✅ Task 47: Implement App Settings

**Status:** Not Started  
**Files:** `app/settings/index.tsx`

**Requirements:**

- Notification preferences (booking updates, promotions)
- Language selection (EN/VI)
- Theme toggle (light/dark mode)
- Clear cache
- App version info
- About section
- Privacy policy link
- Terms of service link
- Logout option

**UI Libraries:**

- **React Native Paper**: `List`, `Switch`, `RadioButton`
- **UI Kitten**: `Toggle`
- **NativeWind**: Settings layout

---

### ✅ Task 48: Add Offline Support

**Status:** Not Started

**Requirements:**

- Cache recent station searches
- Cache user's bookings (view offline)
- Cache favorite vehicles/stations
- Queue booking actions when offline (sync when online)
- Show offline indicator banner
- Handle network errors gracefully

**Packages:**

```bash
npx expo install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
```

**UI Libraries:**

- **React Native Paper**: `Banner` (offline indicator)
- **NativeWind**: Banner styling

---

## 🧪 **Phase 6: Testing & Optimization** (Priority: BEFORE LAUNCH)

### ✅ Task 49: Testing - Unit Tests

**Status:** Not Started

**Packages:**

```bash
npm install -D jest @testing-library/react-native
```

---

### ✅ Task 50-51: Integration & E2E Tests

**Status:** Not Started

**Packages:**

```bash
npm install -D detox
```

---

### ✅ Task 52: Performance Optimization

**Status:** Not Started

**Checklist:**

- [ ] Use `React.memo` for expensive components
- [ ] Implement `useMemo` and `useCallback` where needed
- [ ] Lazy load images with caching
- [ ] Optimize FlatList with `windowSize`, `removeClippedSubviews`
- [ ] Reduce bundle size (analyze with `npx react-native-bundle-visualizer`)
- [ ] Profile with React DevTools Profiler

---

### ✅ Task 53-54: Documentation & Production Setup

**Status:** Not Started

**Files to Create/Update:**

- `README.md` - Setup instructions
- `CONTRIBUTING.md` - Development guide
- `.env.example` - Environment variables template
- `app.json` - Production config

---

## 📦 **Required Packages Summary**

### **Core Dependencies**

```json
{
  "dependencies": {
    "react-native-paper": "^5.x",
    "@rneui/themed": "^4.x",
    "@ui-kitten/components": "^5.x",
    "nativewind": "^4.x",
    "axios": "^1.x",
    "expo-secure-store": "~13.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "yup": "^1.x",
    "expo-location": "~17.x",
    "react-native-maps": "^1.x",
    "expo-notifications": "~0.28.x",
    "expo-image-picker": "~15.x",
    "expo-image-manipulator": "~12.x",
    "expo-barcode-scanner": "~13.x",
    "@react-native-async-storage/async-storage": "^1.x"
  },
  "devDependencies": {
    "@types/react": "~18.x",
    "@types/yup": "^0.32.x",
    "typescript": "^5.x",
    "jest": "^29.x",
    "@testing-library/react-native": "^12.x",
    "detox": "^20.x"
  }
}
```

---

## 🎯 **Development Workflow**

1. **Always start with API integration** before UI
2. **Create types first** for all data structures
3. **Build reusable components** in `/components`
4. **Use centralized theme** from `utils/` folder
5. **Handle loading/error states** for all API calls
6. **Add TypeScript types** for all props and states
7. **Test on both iOS and Android**
8. **Follow accessibility guidelines**
9. **Optimize performance** before each release
10. **Document as you code**

---

## � **API Endpoints Coverage by Role**

### **RENTER (Customer App) - Core Features**

| Endpoint                                        | Purpose                  | Status         |
| ----------------------------------------------- | ------------------------ | -------------- |
| **Authentication (10 endpoints)**               |
| POST /api/auth/register                         | Register new account     | ⬜ Not Started |
| POST /api/auth/login                            | Login                    | ⬜ Not Started |
| POST /api/auth/logout                           | Logout                   | ⬜ Not Started |
| POST /api/auth/refresh                          | Refresh token            | ⬜ Not Started |
| POST /api/auth/confirm                          | Verify email             | ⬜ Not Started |
| POST /api/auth/forgot-password                  | Request password reset   | ⬜ Not Started |
| POST /api/auth/reset-password                   | Reset password           | ⬜ Not Started |
| POST /api/auth/change-password                  | Change password          | ⬜ Not Started |
| GET /api/auth/callback                          | OAuth callback           | ⬜ Not Started |
| POST /api/auth/url                              | Get OAuth URL            | ⬜ Not Started |
| **Stations (6 endpoints - Public)**             |
| GET /api/stations                               | List all stations        | ⬜ Not Started |
| GET /api/stations/{id}                          | Station details          | ⬜ Not Started |
| GET /api/stations/active                        | Active stations          | ⬜ Not Started |
| GET /api/stations/status/{status}               | Filter by status         | ⬜ Not Started |
| GET /api/stations/{id}/vehicles/available/count | Available vehicle count  | ⬜ Not Started |
| GET /api/locations/stations/nearby              | Nearby stations          | ⬜ Not Started |
| **Vehicles (7 endpoints - Public)**             |
| GET /api/vehicles                               | List all vehicles        | ⬜ Not Started |
| GET /api/vehicles/{id}                          | Vehicle details          | ⬜ Not Started |
| GET /api/vehicles/station/{stationId}           | Vehicles by station      | ⬜ Not Started |
| GET /api/vehicles/available                     | Available vehicles       | ⬜ Not Started |
| GET /api/vehicles/available/booking             | Available for time range | ⬜ Not Started |
| GET /api/vehicles/status/{status}               | Filter by status         | ⬜ Not Started |
| GET /api/vehicles/brand/{brand}                 | Filter by brand          | ⬜ Not Started |
| **Bookings (5 endpoints - RENTER)**             |
| POST /api/bookings                              | Create booking           | ⬜ Not Started |
| GET /api/bookings/my-bookings                   | My bookings              | ⬜ Not Started |
| GET /api/bookings/{id}                          | Booking details          | ⬜ Not Started |
| GET /api/bookings/code/{code}                   | Get by booking code      | ⬜ Not Started |
| PATCH /api/bookings/{id}/cancel                 | Cancel booking           | ⬜ Not Started |
| **Payments (3 endpoints - RENTER)**             |
| GET /api/payments/{id}                          | Payment details          | ⬜ Not Started |
| GET /api/payments/booking/{bookingId}           | Payments by booking      | ⬜ Not Started |
| GET /api/payments/transaction/{transactionId}   | Payment by transaction   | ⬜ Not Started |
| **User Profile (4 endpoints - RENTER)**         |
| GET /api/users/me                               | My profile               | ⬜ Not Started |
| PUT /api/users/{id}                             | Update profile           | ⬜ Not Started |
| POST /api/users/{id}/avatar                     | Upload avatar            | ⬜ Not Started |
| POST /api/users/{id}/license-card               | Upload license           | ⬜ Not Started |

**RENTER Total: 35 endpoints**

---

### **STAFF (Station Staff App) - Additional Features**

| Endpoint                                         | Purpose             | Status         |
| ------------------------------------------------ | ------------------- | -------------- |
| **Bookings Management (8 additional endpoints)** |
| GET /api/bookings                                | List all bookings   | ⬜ Not Started |
| GET /api/bookings/status/{status}                | Filter by status    | ⬜ Not Started |
| GET /api/bookings/vehicle/{vehicleId}            | Bookings by vehicle | ⬜ Not Started |
| GET /api/bookings/station/{stationId}            | Bookings by station | ⬜ Not Started |
| PUT /api/bookings/{id}                           | Update booking      | ⬜ Not Started |
| PATCH /api/bookings/{id}/confirm                 | Confirm booking     | ⬜ Not Started |
| PATCH /api/bookings/{id}/start                   | Start rental        | ⬜ Not Started |
| PATCH /api/bookings/{id}/complete                | Complete rental     | ⬜ Not Started |

**STAFF Additional: 8 endpoints**  
**STAFF Total: 35 (RENTER) + 8 = 43 endpoints**

---

### **ADMIN Only - Excluded from Mobile App**

❌ Station Management: Create, Update, Delete, Upload Photo (4 endpoints)  
❌ Vehicle Management: Create, Update, Delete, Upload Photos, Change Status (5 endpoints)  
❌ User Management: Get All Users, Get by Role, Update Role, Verify License, Delete (5 endpoints)  
❌ Booking Management: Delete Booking (1 endpoint)

**Admin Total: 15 endpoints (handled via web dashboard)**

---

### **Summary**

- **Total API Endpoints:** 66
- **RENTER App:** 35 endpoints (53%)
- **STAFF App:** 43 endpoints (65%)
- **ADMIN Only:** 15 endpoints (23%) - Web only
- **Currently Implemented:** ~3 endpoints (5%)

---

## 📝 **Notes**

### **Role-Based Feature Access**

- **RENTER (Customer):** Full booking flow, view stations/vehicles, manage profile, payment
- **STAFF (Station Staff):** Additional booking management (confirm, start, complete), view all bookings at their station
- **ADMIN:** All management features via web dashboard only (not in mobile app)

### **Development Guidelines**

- Replace all mock data with real API calls
- Use environment variables for API URLs
- Implement proper error handling for all API calls
- Add loading states to improve UX
- Follow Material Design guidelines for consistency
- Test offline scenarios
- Optimize image loading and caching
- Add analytics to track user behavior
- Implement role-based UI (show/hide features based on user role)

### **STAFF-Specific Features to Implement**

1. **QR Code Scanner** - Scan booking codes at check-in/check-out
2. **Booking Management Dashboard** - View and manage bookings at assigned station
3. **Quick Actions** - Confirm/Start/Complete bookings with one tap
4. **Station Overview** - See all active rentals and pending returns
5. **Notifications** - Alert for new bookings, overdue returns

### **Security Notes**

- Never expose admin endpoints in mobile app
- Validate user role before showing STAFF-only features
- Implement proper token management and refresh
- Secure sensitive data in SecureStore (tokens, user data)
- Validate all inputs before API calls

---

**Last Updated:** November 7, 2025  
**Maintained by:** Development Team
