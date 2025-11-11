# Tích hợp API Stations vào Customer Index Page

## Tổng quan

Đã thay thế dữ liệu hardcoded trong section "Địa Điểm Nổi Bật" bằng dữ liệu thực từ API.

## API Endpoint

```
GET /api/stations?page=0&size=10&sortBy=createdAt&sortDirection=DESC
```

## Thay đổi thực hiện

### 1. Import useStation Hook

```tsx
import { useStation } from "@/hooks/useStation";
```

### 2. Thêm State

```tsx
const { getAllStations, loading: stationsLoading } = useStation();
const [featuredStations, setFeaturedStations] = useState<any[]>([]);
```

### 3. Load Stations từ API

```tsx
useEffect(() => {
  const loadStations = async () => {
    try {
      const result = await getAllStations({
        page: 0,
        size: 10,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });

      if (result.success && result.data) {
        setFeaturedStations(result.data.content);
      }
    } catch (error) {
      console.error("Error loading stations:", error);
    }
  };

  loadStations();
}, []);
```

### 4. Helper Function - Convert Name to Slug

```tsx
const getStationSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-");
};
```

**Ví dụ:**

- "Đà Nẵng" → "da-nang"
- "Quy Nhơn" → "quy-nhon"
- "Phú Quốc" → "phu-quoc"

### 5. Updated UI

```tsx
{
  /* Địa Điểm Nổi Bật */
}
<section className="py-16 bg-white">
  <div className="container">
    <h2>Địa Điểm Nổi Bật</h2>

    {stationsLoading ? (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    ) : (
      <Carousel>
        <CarouselContent>
          {featuredStations.map((station) => (
            <CarouselItem key={station.id}>
              <div
                onClick={() =>
                  navigate(`/place/${getStationSlug(station.name)}`)
                }
              >
                <div style={{ backgroundImage: `url('${station.photo}')` }} />
                <h3>{station.name}</h3>
                <p>{station.address}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )}
  </div>
</section>;
```

## Data Mapping

### API Response → UI Display

| API Field                      | UI Display       | Purpose                              |
| ------------------------------ | ---------------- | ------------------------------------ |
| `station.name`                 | Title            | Station name                         |
| `station.address`              | Subtitle         | Station address (replaces "150+ xe") |
| `station.photo`                | Background Image | Station photo                        |
| `getStationSlug(station.name)` | Route slug       | Navigation URL                       |

### Ví dụ Station Object

```json
{
  "id": "c378f0e4-0791-4ee5-9786-315d05b7b34e",
  "name": "Đà Nẵng",
  "address": "42 Bạch Đằng, Q. Hải Châu, TP. Đà Nẵng",
  "rating": 0,
  "latitude": 16.07,
  "longitude": 108.22,
  "hotline": "0236 388 8888",
  "status": "ACTIVE",
  "photo": "/mocks/city/danang.jpg",
  "startTime": "2025-11-10T06:00:00",
  "endTime": "2025-11-10T22:00:00",
  "createdAt": "2025-11-10T15:33:24.541063",
  "updatedAt": "2025-11-10T15:33:24.541063"
}
```

## Features

### ✅ Dynamic Data Loading

- Load 10 latest stations (sorted by createdAt DESC)
- Automatically updates when backend data changes
- No need to manually update frontend code

### ✅ Loading State

- Shows spinner while fetching data
- Prevents empty carousel during load

### ✅ Auto-navigation

- Click station → Navigate to `/place/{slug}`
- Slug automatically generated from station name
- Vietnamese characters properly converted

### ✅ Carousel Features

- Auto-play with 3s delay
- Pause on hover/interaction
- Responsive (4 items on desktop, 2 on tablet, 1 on mobile)
- Navigation arrows

## API Service Already Available

### stationService.ts

```typescript
async getAllStations(filters?: StationFilters): Promise<PageResponse<StationResponse>> {
  const params = new URLSearchParams();

  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

  const response = await apiClient.get(
    `${API_ENDPOINTS.STATIONS.GET_ALL}?${params.toString()}`
  );
  return response.data.data;
}
```

### useStation Hook

```typescript
const getAllStations = useCallback(async (filters?: StationFilters) => {
  setLoading(true);
  setError(null);
  try {
    const data = await stationService.getAllStations(filters);
    return { success: true, data };
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || "Không thể tải danh sách trạm";
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
}, []);
```

## Testing

### Test Scenarios

1. ✅ Page loads → API called automatically
2. ✅ Loading spinner shows during fetch
3. ✅ Stations display in carousel after load
4. ✅ Click station → Navigate to correct URL
5. ✅ Images load from station.photo
6. ✅ Carousel auto-plays

### Expected URL Mappings

- Đà Nẵng → `/place/da-nang`
- Nha Trang → `/place/nha-trang`
- Vũng Tàu → `/place/vung-tau`
- Đà Lạt → `/place/da-lat`
- Phú Yên → `/place/phu-yen`
- Long An → `/place/long-an`
- Phú Quốc → `/place/phu-quoc`
- Quy Nhơn → `/place/quy-nhon`

## Files Modified

1. ✅ `client/pages/Customer/Index.tsx` - Integrated API data

## Files Used (Already Existed)

1. ✅ `client/hooks/useStation.ts` - Station hook
2. ✅ `client/service/station/stationService.ts` - Station service
3. ✅ `client/service/config/apiConfig.ts` - API endpoints

## No Errors

✅ TypeScript compilation successful
✅ No runtime errors
✅ API integration complete
