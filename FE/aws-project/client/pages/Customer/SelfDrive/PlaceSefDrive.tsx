import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

// Mock data cho các địa điểm
const locationData: Record<
  string,
  {
    name: string;
    cars: string;
    image: string;
    description: string;
    popularPlaces: string[];
    totalCars: number;
    rating: number;
  }
> = {
  "quy-nhon": {
    name: "Quy Nhơn",
    cars: "150+ xe",
    image: "/mocks/city/binhdinh.jpg",
    description:
      "Thành phố biển xinh đẹp với bãi biển dài, ẩm thực đặc sắc và nhiều điểm tham quan hấp dẫn.",
    popularPlaces: [
      "Kỳ Co",
      "Eo Gió",
      "Bãi Xép",
      "Tháp Đôi",
      "Ghềnh Ráng Tiên Sa",
    ],
    totalCars: 156,
    rating: 4.8,
  },
  "phu-quoc": {
    name: "Phú Quốc",
    cars: "150+ xe",
    image: "/mocks/city/phuquoc.jpg",
    description:
      "Đảo ngọc Phú Quốc nổi tiếng với biển xanh, cát trắng, rừng nhiệt đới và ẩm thực phong phú.",
    popularPlaces: [
      "Vinpearl Safari",
      "Bãi Sao",
      "Hòn Thơm",
      "Dinh Cậu",
      "Chợ đêm",
    ],
    totalCars: 158,
    rating: 4.9,
  },
  "long-an": {
    name: "Long An",
    cars: "100+ xe",
    image: "/mocks/city/longan.jpg",
    description:
      "Tỉnh miền Tây với văn hóa sông nước, vườn trái cây và nhiều điểm du lịch sinh thái.",
    popularPlaces: [
      "Khu du lịch Đồng Tháp Mười",
      "Rừng tràm Trà Sư",
      "Chợ nổi",
      "Vườn trái cây",
      "Đền thờ Trần Quốc Tuấn",
    ],
    totalCars: 102,
    rating: 4.6,
  },
  "phu-yen": {
    name: "Phú Yên",
    cars: "100+ xe",
    image: "/mocks/city/phuyen.jpg",
    description:
      "Xứ sở hoa vàng trên cỏ xanh với bãi biển hoang sơ, thiên nhiên tươi đẹp.",
    popularPlaces: [
      "Gành Đá Đĩa",
      "Bãi Xép",
      "Vũng Rô",
      "Hải đăng Đại Lãnh",
      "Ghềnh Đá Đĩa",
    ],
    totalCars: 98,
    rating: 4.7,
  },
  "da-lat": {
    name: "Đà Lạt",
    cars: "200+ xe",
    image: "/mocks/city/dalat.webp",
    description:
      "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, phong cảnh lãng mạn và ẩm thực đặc sắc.",
    popularPlaces: [
      "Hồ Xuân Hương",
      "Thác Datanla",
      "Cầu Mây",
      "Đồi Chè Cầu Đất",
      "Quảng trường Lâm Viên",
    ],
    totalCars: 215,
    rating: 4.9,
  },
  "vung-tau": {
    name: "Vũng Tàu",
    cars: "180+ xe",
    image: "/mocks/city/vungtau.jpg",
    description:
      "Thành phố biển gần Sài Gòn với bãi biển đẹp, hải sản tươi ngon và nhiều di tích lịch sử.",
    popularPlaces: [
      "Tượng Chúa Kitô",
      "Hải đăng",
      "Bãi Trước",
      "Bãi Sau",
      "Núi Lớn",
    ],
    totalCars: 187,
    rating: 4.7,
  },
  "nha-trang": {
    name: "Nha Trang",
    cars: "250+ xe",
    image: "/mocks/city/nhatrang.jpg",
    description:
      "Thành phố biển năng động với bãi biển tuyệt đẹp, hoạt động lặn biển và cuộc sống về đêm sôi động.",
    popularPlaces: [
      "Vinpearl Land",
      "Hòn Mun",
      "Tháp Bà Ponagar",
      "Suối khoáng nóng",
      "Bãi Dài",
    ],
    totalCars: 265,
    rating: 4.8,
  },
  "da-nang": {
    name: "Đà Nẵng",
    cars: "300+ xe",
    image: "/mocks/city/danang.jpg",
    description:
      "Thành phố đáng sống với cơ sở hạ tầng hiện đại, bãi biển đẹp và ẩm thực phong phú.",
    popularPlaces: [
      "Cầu Rồng",
      "Bà Nà Hills",
      "Ngũ Hành Sơn",
      "Bãi biển Mỹ Khê",
      "Sơn Trà",
    ],
    totalCars: 312,
    rating: 4.9,
  },
};

// Mock data cho xe tại địa điểm
const mockCars = [
  {
    id: 1,
    name: "VinFast VF 5 Plus",
    type: "A-SUV",
    seats: 5,
    transmission: "Tự động",
    fuel: "Xăng",
    price: 890000,
    originalPrice: 1200000,
    rating: 4.8,
    trips: 125,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    features: ["Bluetooth", "Camera lùi", "Cảm biến lùi"],
    discount: 25,
    owner: {
      name: "Nguyễn Văn A",
      avatar: "",
      verified: true,
      rating: 4.9,
    },
  },
  {
    id: 2,
    name: "VinFast VF 6 Plus",
    type: "B-SUV",
    seats: 5,
    transmission: "Tự động",
    fuel: "Xăng",
    price: 1250000,
    rating: 4.9,
    trips: 89,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    features: ["Bluetooth", "Camera 360", "Cảm biến lùi", "Định vị GPS"],
    owner: {
      name: "Trần Thị B",
      avatar: "",
      verified: true,
      rating: 5.0,
    },
  },
  {
    id: 3,
    name: "VinFast VF 7 Plus",
    type: "C-SUV",
    seats: 5,
    transmission: "Tự động",
    fuel: "Xăng",
    price: 1450000,
    rating: 4.7,
    trips: 156,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    features: ["Bluetooth", "Camera 360", "Cruise Control", "Sunroof"],
    owner: {
      name: "Lê Văn C",
      avatar: "",
      verified: true,
      rating: 4.8,
    },
  },
  {
    id: 4,
    name: "VinFast VF 8 Plus",
    type: "C-SUV",
    seats: 5,
    transmission: "Tự động",
    fuel: "Điện",
    price: 1650000,
    rating: 4.9,
    trips: 203,
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
    features: [
      "Bluetooth",
      "Camera 360",
      "Cruise Control",
      "Sạc không dây",
      "ADAS",
    ],
    owner: {
      name: "Phạm Thị D",
      avatar: "",
      verified: true,
      rating: 4.9,
    },
  },
];

export default function PlaceSefDrive() {
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [carType, setCarType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const locationInfo = location ? locationData[location] : null;

  if (!locationInfo) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Location Info */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url('${locationInfo.image}')`,
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

          <h1 className="text-5xl font-bold mb-4">{locationInfo.name}</h1>
          <p className="text-xl mb-6 max-w-2xl">{locationInfo.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Car className="w-5 h-5" />
              <span className="font-semibold">{locationInfo.totalCars} xe</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{locationInfo.rating}/5</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Địa điểm phổ biến</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Popular Places */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Địa điểm nổi bật tại {locationInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {locationInfo.popularPlaces.map((place, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {place}
                </Badge>
              ))}
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
                  <SelectValue placeholder="Loại xe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại xe</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="mini">Mini</SelectItem>
                  <SelectItem value="mpv">MPV</SelectItem>
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
            {locationInfo.totalCars} xe khả dụng
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc nâng cao
          </Button>
        </div>

        {/* Car Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCars.map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                {/* Image Section */}
                <div className="md:col-span-2 relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover min-h-[200px]"
                  />
                  {car.discount && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                      -{car.discount}%
                    </Badge>
                  )}
                </div>

                {/* Content Section */}
                <CardContent className="md:col-span-3 p-5">
                  {/* Car Name and Type */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                    <p className="text-sm text-gray-600">{car.type}</p>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{car.seats} chỗ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{car.features.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-3" />

                  {/* Owner and Stats */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={car.owner.avatar} />
                        <AvatarFallback>
                          {car.owner.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{car.owner.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{car.owner.rating}</span>
                          <span>•</span>
                          <span>{car.trips} chuyến</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      {car.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(car.originalPrice)}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(car.price)}
                        </span>
                        <span className="text-sm text-gray-600">/ngày</span>
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Đặt xe
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center text-gray-600">
          <Button variant="outline" size="lg">
            Xem thêm xe
          </Button>
        </div>
      </div>
    </div>
  );
}
