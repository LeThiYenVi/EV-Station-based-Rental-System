import {
  ArrowRight,
  BarChart,
  Cpu,
  Leaf,
  Network,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  Car,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("xe-tu-lai");

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-white overflow-visible pb-32 md:pb-40">
        <div className="container py-8">
          {/* Hero Image Container */}
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="w-full h-[500px] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/mocks/tour1.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Overlay on Image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Main Title */}
              <div className="text-center text-white mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  BF Car Rental - Cùng Bạn
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Trên Mọi Hành Trình
                </h2>
                <div className="w-20 h-0.5 bg-white mx-auto mb-4"></div>
                <p className="text-lg md:text-xl">
                  Trải nghiệm sự khác biệt từ{" "}
                  <span className="text-green-400 font-semibold">
                    hơn 10.000
                  </span>{" "}
                  xe gia đình đời mới khắp Việt Nam
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form positioned outside and overlapping */}
          <div className="relative -mt-24 mx-auto w-full max-w-5xl px-4 z-40">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tab Navigation */}
              <div className="flex justify-center mb-0">
                <TabsList className="inline-flex w-auto bg-white rounded-lg h-14 p-1 shadow-lg">
                  <TabsTrigger
                    value="xe-tu-lai"
                    className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-600 text-sm rounded-md px-6 py-3"
                  >
                    <Car className="w-5 h-5" />
                    Xe tự lái
                  </TabsTrigger>
                  <TabsTrigger
                    value="xe-co-tai-xe"
                    className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-600 text-sm rounded-md relative px-6 py-3"
                  >
                    <User className="w-5 h-5" />
                    Xe có tài xế
                    <Badge
                      variant="destructive"
                      className="ml-1 text-xs absolute -top-1 -right-1"
                    >
                      Mới
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="thue-xe-dai-han"
                    className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-600 text-sm rounded-md px-6 py-3"
                  >
                    <Clock className="w-5 h-5" />
                    Thuê xe dài hạn
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="xe-tu-lai" className="mt-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div className="space-y-3">
                        <Label
                          htmlFor="location"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <MapPin className="w-5 h-5" />
                          Địa điểm
                        </Label>
                        <Select>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="TP. Hồ Chí Minh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="danang">Đà Nẵng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="datetime"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Calendar className="w-5 h-5" />
                          Thời gian thuê
                        </Label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="21:00, 02/10/2025 - 20:00, 03/10/2025"
                            className="w-full h-12 text-base"
                          />
                          <Button className="bg-green-500 hover:bg-green-600 text-white h-12 px-8 text-base font-semibold whitespace-nowrap">
                            Tìm Xe
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="xe-co-tai-xe" className="mt-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Lộ trình Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Lộ trình</h3>
                        <div className="flex gap-6 mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="route"
                              value="noi-thanh"
                              defaultChecked
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm">Nội thành</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="route"
                              value="lien-tinh"
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm">Liên tỉnh</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="route"
                              value="lien-tinh-1-chieu"
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm">Liên tỉnh (1 chiều)</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-600 mb-6">
                          Di chuyển nội thành hoặc lân cận, lộ trình tự do.
                        </p>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="pickup"
                            className="flex items-center gap-2 text-sm font-medium"
                          >
                            <MapPin className="w-4 h-4" />
                          </Label>
                          <Input
                            placeholder="Tôi muốn đón tại..."
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-sm font-medium">
                            Thời gian
                          </Label>
                          <div className="flex gap-4 items-end">
                            <Input
                              type="text"
                              placeholder="08:00, 03/10/2025 - 10:00, 03/10/2025"
                              className="flex-1 h-10"
                            />
                            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 px-6">
                              Tìm Xe
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="thue-xe-dai-han" className="mt-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="location-longterm"
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <MapPin className="w-4 h-4" />
                          Địa điểm áp dụng hiện tại
                        </Label>
                        <div className="flex gap-4 items-end">
                          <Input
                            value="TP. Hồ Chí Minh"
                            readOnly
                            className="bg-gray-50 flex-1 h-10"
                          />
                          <Button className="bg-green-500 hover:bg-green-600 text-white h-10 px-6">
                            Tìm Xe
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Xe Dành Cho Bạn */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            Xe Dành Cho Bạn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                name: "VinFast VF 3",
                image:
                  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
                badge: "Miễn phí sóc",
                transmission: "Minicar",
                seats: "4 chỗ",
                fuel: "210km (NEDC)",
                rating: "460km (NEDC)",
                originalPrice: "Dung tích cốp 285L",
                price: "590.000",
              },
              {
                name: "VinFast VF 6 Plus",
                image:
                  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
                badge: "Miễn phí sóc",
                transmission: "B-SUV",
                seats: "5 chỗ",
                fuel: "460km (NEDC)",
                rating: "460km (NEDC)",
                originalPrice: "Dung tích cốp 423L",
                price: "1.250.000",
              },
              {
                name: "VinFast VF 6S",
                image:
                  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
                badge: "Hết xe",
                transmission: "B-SUV",
                seats: "5 chỗ",
                fuel: "480km (NEDC)",
                rating: "480km (NEDC)",
                originalPrice: "Dung tích cốp 423L",
                price: "1.100.000",
              },
              {
                name: "VinFast VF 5 Plus",
                image:
                  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
                badge: "Miễn phí sóc",
                transmission: "A-SUV",
                seats: "5 chỗ",
                fuel: "380km (NEDC)",
                rating: "380km (NEDC)",
                originalPrice: "Dung tích cốp 310L",
                price: "890.000",
              },
              {
                name: "VinFast VF 7 Plus",
                image:
                  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
                badge: "Miễn phí sóc",
                transmission: "C-SUV",
                seats: "5 chỗ",
                fuel: "450km (NEDC)",
                rating: "450km (NEDC)",
                originalPrice: "Dung tích cốp 520L",
                price: "1.450.000",
              },
              {
                name: "VinFast VF 8 Plus",
                image:
                  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
                badge: "Miễn phí sóc",
                transmission: "C-SUV",
                seats: "5 chỗ",
                fuel: "471km (NEDC)",
                rating: "471km (NEDC)",
                originalPrice: "Dung tích cốp 534L",
                price: "1.650.000",
              },
            ].map((car, index) => (
              <Link key={index} to={`/car/${index + 1}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-2xl">
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-56 object-cover"
                    />
                    {/* Badge ở góc trên trái */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`${
                          car.badge === "Hết xe"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white border-0 px-3 py-1 text-xs font-medium rounded-md`}
                      >
                        {car.badge}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-5">
                    {/* Price Section - Chỉ từ */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-600">Chỉ từ</span>
                        <span className="text-2xl font-bold text-green-600">
                          {car.price}
                        </span>
                        <span className="text-sm text-gray-600">VNĐ/Ngày</span>
                      </div>
                    </div>

                    {/* Car Name */}
                    <h3 className="font-bold text-xl mb-2 text-gray-900">
                      {car.name}
                    </h3>

                    {/* Car Type/Category */}
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {car.transmission}
                      </span>
                    </div>

                    {/* Specifications */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-gray-500" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{car.seats}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>{car.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span>{car.originalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Địa Điểm Nổi Bật */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            Địa Điểm Nổi Bật
          </h2>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {[
                {
                  name: "Quy Nhơn",
                  cars: "150+ xe",
                  image: "/mocks/city/binhdinh.jpg",
                },
                {
                  name: "Phú Quốc",
                  cars: "150+ xe",
                  image: "/mocks/city/phuquoc.jpg",
                },
                {
                  name: "Long An",
                  cars: "100+ xe",
                  image: "/mocks/city/longan.jpg",
                },
                {
                  name: "Phú Yên",
                  cars: "100+ xe",
                  image: "/mocks/city/phuyen.jpg",
                },
                {
                  name: "Đà Lạt",
                  cars: "200+ xe",
                  image: "/mocks/city/dalat.webp",
                },
                {
                  name: "Vũng Tàu",
                  cars: "180+ xe",
                  image: "/mocks/city/vungtau.jpg",
                },
                {
                  name: "Nha Trang",
                  cars: "250+ xe",
                  image: "/mocks/city/nhatrang.jpg",
                },
                {
                  name: "Đà Nẵng",
                  cars: "300+ xe",
                  image: "/mocks/city/danang.jpg",
                },
              ].map((location, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/4"
                >
                  <div className="relative group cursor-pointer overflow-hidden rounded-3xl h-[400px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${location.image}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">
                        {location.name}
                      </h3>
                      <p className="text-sm opacity-90">{location.cars}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black text-white hover:bg-black/80 border-black" />
            <CarouselNext className="right-4 bg-black text-white hover:bg-black/80 border-black" />
          </Carousel>
        </div>
      </section>

      {/* Giao xe tại sân bay */}
      <section className="py-16 bg-white">
        <div className="container">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <div className="flex items-start gap-8">
              {/* Left Side - Title and Navigation */}
              <div className="flex-shrink-0">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 whitespace-nowrap">
                  Giao xe tại
                  <br />
                  sân bay
                </h2>
                <div className="flex gap-2">
                  <CarouselPrevious className="static translate-y-0 w-10 h-10 rounded-full border border-gray-300 text-black" />
                  <CarouselNext className="static translate-y-0 w-10 h-10 rounded-full border border-gray-300 text-black" />
                </div>
              </div>

              {/* Right Side - Airport Cards */}
              <div className="flex-1 overflow-hidden">
                <CarouselContent className="-ml-4">
                  {[
                    {
                      name: "Tân Sơn Nhất",
                      cars: "2000+ xe",
                      image: "/mocks/sanbay/tansonnhat.png",
                    },
                    {
                      name: "Ga T3 (TSN)",
                      cars: "2000+ xe",
                      image: "/mocks/sanbay/tansonnhatT3.jpg",
                    },
                    {
                      name: "Nội Bài",
                      cars: "200+ xe",
                      image: "/mocks/sanbay/noibai.jpg",
                    },
                    {
                      name: "Đà Nẵng",
                      cars: "100+ xe",
                      image: "/mocks/sanbay/danang.jpg",
                    },
                    {
                      name: "Cam Ranh",
                      cars: "150+ xe",
                      image: "/mocks/sanbay/camranh.jpg",
                    },
                    {
                      name: "Liên Khương",
                      cars: "120+ xe",
                      image: "/mocks/sanbay/lienkhuong.jpg",
                    },
                    {
                      name: "Phú Quốc",
                      cars: "180+ xe",
                      image: "/mocks/sanbay/phu quoc.jpg",
                    },
                  ].map((airport, index) => (
                    <CarouselItem key={index} className="pl-4 basis-auto">
                      <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition cursor-pointer min-w-[200px]">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url('${airport.image}')`,
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-bold mb-1 text-black">
                              {airport.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {airport.cars}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* Ưu Điểm Của BF Car Rental */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ưu Điểm Của BF Car Rental
            </h2>
            <p className="text-gray-600 text-base">
              Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên BF Car
              Rental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Lái xe an toàn cùng Mioto",
                description:
                  "Chuyến đi trên Mioto được bảo vệ với Gói bảo hiểm thuê xe tự lái MIC & ĐBV (VNI). Khách thuê xe còn bồi thường tối đa 2.000.000VND trong trường hợp có sự cố ngoài ý muốn.",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132842.png",
              },
              {
                title: "An tâm đặt xe",
                description:
                  "Không tính phí huỷ chuyến trong vòng 1h sau khi thanh toán giữ chỗ. Hoàn tiền giữ chỗ và bồi thường 100% nếu chủ xe huỷ chuyến trong vòng 7 ngày trước chuyến đi.",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132836.png",
              },
              {
                title: "Thủ tục đơn giản",
                description:
                  "Chỉ cần có CCCD gắn chip (Hoặc Passport) & Giấy phép lái xe là bạn đã đủ điều kiện thuê xe trên Mioto.",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132830.png",
              },
              {
                title: "Thanh toán dễ dàng",
                description:
                  "Đa dạng hình thức thanh toán: ATM, thẻ Visa & Ví điện tử (Momo, VnPay, ZaloPay).",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132848.png",
              },
              {
                title: "Giao xe tận nơi",
                description:
                  "Bạn có thể lựa chọn giao xe tận nhà/sân bay... Phí tiết kiệm chỉ từ 15k/km.",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132855.png",
              },
              {
                title: "Dòng xe đa dạng",
                description:
                  "Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Mini, Sedan, CUV, SUV, MPV, Bán tải.",
                image: "/mocks/uudiem/Screenshot 2025-10-02 132859.png",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 w-full flex justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hướng Dẫn Thuê Xe */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Hướng Dẫn Thuê Xe
            </h2>
            <p className="text-gray-600 text-base">
              Chỉ với 4 bước đơn giản để trải nghiệm thuê xe Mioto một cách
              nhanh chóng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                step: "01",
                title: "Đặt xe trên app/web Mioto",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132938.png",
                color: "text-green-500",
              },
              {
                step: "02",
                title: "Nhận xe",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132946.png",
                color: "text-green-500",
              },
              {
                step: "03",
                title: "Bắt đầu hành trình",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132953.png",
                color: "text-green-500",
              },
              {
                step: "04",
                title: "Trả xe & kết thúc chuyến đi",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132958.png",
                color: "text-green-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 w-full flex justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center bg-white rounded-3xl p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <span className={`text-2xl font-bold ${item.color} mr-2`}>
                    {item.step}
                  </span>
                  <span className="text-xl font-bold text-black">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section 1 - Bạn muốn biết thêm về Mioto */}
      {/* CTA Section 1 - Bạn muốn biết thêm về Mioto */}
      <section className="py-16 bg-white">
        <div className="bg-gradient-to-br from-green-50 to-green-100 max-w-[80%] mx-auto rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Image */}
            <div className="order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/mocks/thue_xe_co_tai_xe_tphcm_gia_re.84f8483d.png"
                  alt="Về Mioto"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Bạn muốn biết thêm
                <br />
                về Mioto?
              </h2>
              <p className="text-gray-700 text-base mb-8 leading-relaxed max-w-md">
                Mioto kết nối khách hàng có nhu cầu thuê xe với hàng ngàn chủ xe
                ô tô ở TPHCM, Hà Nội & các tỉnh thành khác. Mioto hướng đến việc
                xây dựng cộng đồng người dùng ô tô văn minh & uy tín tại Việt
                Nam.
              </p>
              <Button className="h-12 px-8 text-base bg-green-500 hover:bg-green-600 text-white font-semibold">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section 2 - Bạn muốn cho thuê xe */}
      <section className="py-16 bg-white">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 max-w-[80%] mx-auto rounded-3xl">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Side - Content */}
              <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                  Bạn muốn cho
                  <br />
                  thuê xe?
                </h2>
                <p className="text-gray-700 text-base mb-8 leading-relaxed max-w-md">
                  Hơn 10.000 chủ xe đang cho thuê hiệu quả trên Mioto
                  <br />
                  Đăng ký trở thành đối tác của chúng tôi ngay hôm nay để gia
                  <br />
                  tăng thu nhập hàng tháng.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="h-12 px-8 text-base bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-800 font-semibold"
                  >
                    Tìm hiểu ngay
                  </Button>
                  <Button className="h-12 px-8 text-base bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                    Đăng ký xe
                  </Button>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="order-1 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/mocks/thue_xe_oto_tu_lai_di_du_lich_gia_re.fde3ac82.png"
                    alt="Cho thuê xe"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section-new">
        <div className="container">
          <div className="cta-header">
            <h2>Dịch Vụ Của BF Car Rental</h2>
          </div>

          <div className="cta-cards-grid">
            {/* Card 1: Xe tự lái */}
            <div className="cta-card-item">
              <div className="cta-card-image-overlay">
                <img
                  src="/mocks/gia_thue_xe_tu_lai_4cho_tai_hanoi.e6ebc385.png"
                  alt="Xe đã sẵn sàng - Bắt đầu hành trình ngay"
                  className="cta-image"
                />
                <div className="cta-overlay-content">
                  <h3>Xe đã sẵn sàng.</h3>
                  <h3>Bắt đầu hành trình ngay!</h3>
                  <p>
                    Tự tay cầm lái chiếc xe bạn yêu thích cho hành trình thêm
                    hứng khởi.
                  </p>
                  <button className="cta-btn primary">Thuê xe tự lái</button>
                </div>
              </div>
            </div>

            {/* Card 2: Xe có tài xế */}
            <div className="cta-card-item">
              <div
                style={{ marginTop: "65px" }}
                className="cta-card-image-overlay"
              >
                <img
                  src="/mocks/thue_xe_oto_tu_lai_va_co_tai.9df79c9f.png"
                  alt="Tài xế của bạn đã đến"
                  className="cta-image"
                />
                <div className="cta-overlay-content">
                  <h3 style={{ marginLeft: "198px" }}>
                    Tài xế của bạn đã đến!
                  </h3>
                  <p style={{ marginLeft: "230px" }}>
                    Chuyến đi thêm thú vị cùng các tài xế.
                  </p>
                  <button
                    style={{ marginLeft: "320px" }}
                    className="cta-btn secondary"
                  >
                    Thuê xe có tài xế
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
