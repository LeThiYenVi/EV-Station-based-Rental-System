import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  MapPin,
  Car,
  Calendar,
  Search,
  Filter,
  Star,
  Users,
  Fuel,
  ArrowLeft,
  Clock,
  Award,
  TrendingUp,
  Zap,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStation } from "@/hooks/useStation";
import { useVehicle } from "@/hooks/useVehicle";

export default function PlaceSefDrive() {
  const { location } = useParams<{ location: string }>(); // location is now station ID
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [carType, setCarType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // API hooks
  const { getStationById, loading: stationLoading } = useStation();
  const { getVehiclesByStation, loading: vehiclesLoading } = useVehicle();

  // State for API data
  const [stationInfo, setStationInfo] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

  // Get stationId from either params or query string
  const stationId = location || searchParams.get("station");

  // Load station info từ API
  useEffect(() => {
    const loadStationInfo = async () => {
      if (!stationId) return;

      const result = await getStationById(stationId);
      if (result.success && result.data) {
        setStationInfo(result.data);
      }
    };

    loadStationInfo();
  }, [stationId]);

  // Load vehicles theo station ID từ API
  useEffect(() => {
    const loadVehicles = async () => {
      if (!stationId) return;

      const result = await getVehiclesByStation(stationId);
      if (result.success && result.data) {
        setVehicles(result.data);
        setFilteredVehicles(result.data);
      }
    };

    loadVehicles();
  }, [stationId]);

  // Filter vehicles
  useEffect(() => {
    let result = [...vehicles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name?.toLowerCase().includes(query) ||
          v.brand?.toLowerCase().includes(query),
      );
    }

    // Fuel type filter
    if (carType !== "all") {
      result = result.filter(
        (v) => v.fuelType?.toLowerCase() === carType.toLowerCase(),
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      if (priceRange === "under-1m") {
        result = result.filter((v) => (v.dailyRate || 0) < 1000000);
      } else if (priceRange === "1m-1.5m") {
        result = result.filter(
          (v) => (v.dailyRate || 0) >= 1000000 && (v.dailyRate || 0) <= 1500000,
        );
      } else if (priceRange === "above-1.5m") {
        result = result.filter((v) => (v.dailyRate || 0) > 1500000);
      }
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.dailyRate || 0) - (b.dailyRate || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.dailyRate || 0) - (a.dailyRate || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // popular - sort by rentCount
      result.sort((a, b) => (b.rentCount || 0) - (a.rentCount || 0));
    }

    setFilteredVehicles(result);
  }, [vehicles, searchQuery, carType, priceRange, sortBy]);

  // Loading state
  if (stationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin địa điểm...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!stationInfo && !stationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy địa điểm</h2>
            <p className="text-gray-600 mb-6">
              Địa điểm bạn tìm kiếm không tồn tại hoặc chưa được hỗ trợ.
            </p>
            <Button onClick={() => navigate("/")}>Về trang chủ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Location Info */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url('${stationInfo?.photo || "/image/city/hanoi.webp"}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container h-full flex flex-col justify-center text-white">
          <Button
            variant="ghost"
            className="w-fit mb-6 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <h1 className="text-5xl font-bold mb-4">{stationInfo?.name}</h1>
          <p className="text-xl mb-2 max-w-2xl">{stationInfo?.address}</p>
          <p className="text-lg mb-6 opacity-90">
            Hotline: {stationInfo?.hotline} | Giờ mở cửa:{" "}
            {formatTime(stationInfo?.startTime)} -{" "}
            {formatTime(stationInfo?.endTime)}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Car className="w-5 h-5" />
              <span className="font-semibold">{vehicles.length} xe</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {stationInfo?.rating || 0}/5
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Badge
                className={`${stationInfo?.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
              >
                {stationInfo?.status === "ACTIVE"
                  ? "Đang hoạt động"
                  : "Tạm đóng"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Station Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Thông tin trạm {stationInfo?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{stationInfo?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giờ hoạt động</p>
                  <p className="font-medium">
                    {formatTime(stationInfo?.startTime)} -{" "}
                    {formatTime(stationInfo?.endTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hotline</p>
                  <p className="font-medium">{stationInfo?.hotline}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Car Type Filter */}
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại nhiên liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại xe</SelectItem>
                  <SelectItem value="electricity">Xe điện</SelectItem>
                  <SelectItem value="gasoline">Xăng</SelectItem>
                  <SelectItem value="diesel">Dầu</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Mức giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức giá</SelectItem>
                  <SelectItem value="under-1m">Dưới 1 triệu</SelectItem>
                  <SelectItem value="1m-1.5m">1 - 1.5 triệu</SelectItem>
                  <SelectItem value="above-1.5m">Trên 1.5 triệu</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến</SelectItem>
                  <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                  <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                  <SelectItem value="rating">Đánh giá cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {filteredVehicles.length} xe khả dụng
          </h2>
        </div>

        {/* Loading vehicles */}
        {vehiclesLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách xe...</p>
          </div>
        )}

        {/* Empty state */}
        {!vehiclesLoading && filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Không có xe nào tại trạm này</p>
          </div>
        )}

        {/* Car Listings - Using API data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/car/${vehicle.id}`)}
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img
                  src={
                    vehicle.photos?.[0] ||
                    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
                  }
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-green-500">
                  <Zap className="w-3 h-3 mr-1" />
                  {vehicle.fuelType}
                </Badge>
                <Badge
                  className={`absolute top-3 right-3 ${
                    vehicle.status === "AVAILABLE"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {vehicle.status === "AVAILABLE"
                    ? "Sẵn sàng"
                    : "Không khả dụng"}
                </Badge>
              </div>

              {/* Content Section */}
              <CardContent className="p-5">
                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">Chỉ từ</span>
                    <span className="text-2xl font-bold text-green-600">
                      {vehicle.dailyRate?.toLocaleString("vi-VN") || "Liên hệ"}
                    </span>
                    <span className="text-sm text-gray-600">VNĐ/ngày</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {vehicle.hourlyRate?.toLocaleString("vi-VN")} VNĐ/giờ
                  </p>
                </div>

                {/* Car Name */}
                <h3 className="text-lg font-bold mb-1">{vehicle.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {vehicle.brand} • {vehicle.color}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{vehicle.capacity || 5} chỗ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{vehicle.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{vehicle.rentCount || 0} chuyến</span>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Deposit Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Đặt cọc</p>
                    <p className="text-sm font-medium text-orange-600">
                      {vehicle.depositAmount?.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Đặt xe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
