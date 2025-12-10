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
import { Link, useNavigate } from "react-router-dom";
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
import { useMessage } from "@/components/ui/message";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { useStation } from "@/hooks/useStation";
import { useVehicle } from "@/hooks/useVehicle";
import Snowfall from "react-snowfall";

export default function Index() {
  const navigate = useNavigate();
  const { contextHolder, showWarning } = useMessage();
  const { getAllStations, loading: stationsLoading } = useStation();
  const { getAllVehicles, loading: vehiclesLoading } = useVehicle();
  const [activeTab, setActiveTab] = useState("xe-tu-lai");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [longTermLocation, setLongTermLocation] = useState("quy-nhon");
  const [selfDriveLocation, setSelfDriveLocation] = useState("hcm");
  const [selfDriveDateTime, setSelfDriveDateTime] = useState("");
  const [featuredStations, setFeaturedStations] = useState<any[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);

  // Refs for split text animation
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  // Load featured stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        const result = await getAllStations({
          page: 0,
          size: 10,
          sortBy: "createdAt",
          sortDirection: "DESC",
        });

        console.log("Stations API result:", result);

        if (result.success && result.data) {
          console.log("Setting featured stations:", result.data.content);
          setFeaturedStations(result.data.content);
        }
      } catch (error) {
        console.error("Error loading stations:", error);
      }
    };

    loadStations();
  }, [getAllStations]);

  // Load featured vehicles from API
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const result = await getAllVehicles({
          page: 0,
          size: 10,
          sortBy: "createdAt",
          sortDirection: "DESC",
        });

        console.log("Vehicles API result:", result);

        if (result.success && result.data) {
          console.log("Setting featured vehicles:", result.data.content);
          setFeaturedVehicles(result.data.content);
        }
      } catch (error) {
        console.error("Error loading vehicles:", error);
      }
    };

    loadVehicles();
  }, [getAllVehicles]);

  // Split text animation effect
  useEffect(() => {
    const splitText = (element: HTMLElement) => {
      const text = element.textContent || "";
      element.innerHTML = text
        .split("")
        .map(
          (char) =>
            `<span class="char" style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("");
    };

    if (title1Ref.current && title2Ref.current && subtitleRef.current) {
      // Split the text into characters
      splitText(title1Ref.current);
      splitText(title2Ref.current);
      splitText(subtitleRef.current);

      // Animate the characters
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(title1Ref.current.querySelectorAll(".char"), {
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
      })
        .from(
          title2Ref.current.querySelectorAll(".char"),
          {
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.02,
            duration: 0.8,
          },
          "-=0.6",
        )
        .from(
          subtitleRef.current.querySelectorAll(".char"),
          {
            opacity: 0,
            y: 20,
            stagger: 0.01,
            duration: 0.5,
          },
          "-=0.4",
        );
    }
  }, []);

  const handleProtectedAction = (callback: () => void) => {
    if (!isLoggedIn) {
      showWarning("Vui lòng đăng nhập để sử dụng tính năng này");
    } else {
      callback();
    }
  };

  const handleCarClick = (e: React.MouseEvent, carId: number) => {
    e.preventDefault();
    handleProtectedAction(() => {
      navigate(`/car/${carId}`);
    });
  };

  // Helper function to convert station name to URL slug
  const getStationSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-");
  };

  // Helper function to get car count text (placeholder since API doesn't provide vehicle count)
  const getCarCountText = (stationName: string): string => {
    // Fallback text - in production, you might want to fetch actual vehicle count from API
    const carCounts: { [key: string]: string } = {
      "Quy Nhơn": "150+ xe",
      "Phú Quốc": "150+ xe",
      "Long An": "100+ xe",
      "Phú Yên": "100+ xe",
      "Đà Lạt": "200+ xe",
      "Vũng Tàu": "180+ xe",
      "Nha Trang": "250+ xe",
      "Đà Nẵng": "300+ xe",
    };
    return carCounts[stationName] || "100+ xe";
  };

  return (
    <div className="relative">
      {/* Snowfall Effect */}
      <Snowfall
        color="#fff"
        snowflakeCount={200}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {contextHolder}
      {/* Hero with Video Background */}
      <section className="relative bg-black overflow-visible pb-32 md:pb-10 -mt-16 pt-16">
        {/* Video Background - Full width */}
        <div className="absolute inset-0 w-full h-[875px] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/image/tour1.png"
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container py-8 relative z-10">
          {/* Hero Content Container */}
          <div className="relative h-[500px] flex flex-col items-center justify-center">
            {/* Content Overlay */}
            <div className="text-center text-white mb-8 pt-[50px]">
              <h1
                ref={title1Ref}
                className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
              >
                VoltGo - Cùng Bạn
              </h1>
              <h2
                ref={title2Ref}
                className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
              >
                Trên Mọi Hành Trình
              </h2>
              <div className="w-20 h-0.5 bg-white mx-auto mb-4"></div>
              <p
                ref={subtitleRef}
                className="text-lg md:text-xl drop-shadow-md mb-8"
              >
                Trải nghiệm sự khác biệt từ{" "}
                <span className="text-green-400 font-semibold">hơn 10.000</span>{" "}
                xe gia đình đời mới khắp Việt Nam
              </p>
              <Button
                onClick={() => navigate("/find-stations")}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white h-16 px-12 text-lg font-bold shadow-2xl transition-all duration-500 hover:scale-110 border-2 border-white/30 hover:border-white/50 rounded-full group"
              >
                <MapPin className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Tìm Trạm Gần Bạn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form positioned outside and overlapping */}
      {/* <div>
          <div className="relative -mt-24 mx-auto w-full max-w-5xl px-4 z-40">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tab Navigation */}
      {/* <div className="flex justify-center mb-0">
                <TabsList className="inline-flex w-auto bg-white rounded-lg h-12 p-1 shadow-lg">
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
              </div> */}

      {/* Tab Content */}
      {/* <TabsContent value="xe-tu-lai" className="mt-1">
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
                        <Select
                          value={selfDriveLocation}
                          onValueChange={setSelfDriveLocation}
                        >
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Chọn địa điểm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="danang">Đà Nẵng</SelectItem>
                            <SelectItem value="dalat">Đà Lạt</SelectItem>
                            <SelectItem value="vungtau">Vũng Tàu</SelectItem>
                            <SelectItem value="nhatrang">Nha Trang</SelectItem>
                            <SelectItem value="phuquoc">Phú Quốc</SelectItem>
                            <SelectItem value="quy-nhon">Quy Nhơn</SelectItem>
                            <SelectItem value="long-an">Long An</SelectItem>
                            <SelectItem value="phu-yen">Phú Yên</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

      {/* <div className="space-y-3">
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
                            value={selfDriveDateTime}
                            onChange={(e) =>
                              setSelfDriveDateTime(e.target.value)
                            }
                            placeholder="21:00, 02/10/2025 - 20:00, 03/10/2025"
                            className="w-full h-12 text-base"
                          />
                          <Button
                            onClick={() =>
                              handleProtectedAction(() => {
                                // Logic tìm xe với selfDriveLocation và selfDriveDateTime
                                navigate("/services/self-drive", {
                                  state: {
                                    location: selfDriveLocation,
                                    dateTime: selfDriveDateTime,
                                  },
                                });
                              })
                            }
                            className="bg-green-500 hover:bg-green-600 text-white h-12 px-8 text-base font-semibold whitespace-nowrap"
                          >
                            Tìm Xe
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

      {/* <TabsContent value="xe-co-tai-xe" className="mt-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0">
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-yellow-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        Tính năng sắp ra mắt
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Dịch vụ thuê xe có tài xế đang được hoàn thiện và sẽ sớm
                        có mặt để phục vụ bạn.
                      </p>
                      <Badge className="bg-yellow-500 text-white px-6 py-2 text-base">
                        Coming Soon
                      </Badge>
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
                          Chọn địa điểm
                        </Label>
                        <div className="flex gap-4 items-end">
                          <Select
                            value={longTermLocation}
                            onValueChange={setLongTermLocation}
                          >
                            <SelectTrigger className="flex-1 h-12">
                              <SelectValue placeholder="Chọn địa điểm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quy-nhon">Quy Nhơn</SelectItem>
                              <SelectItem value="phu-quoc">Phú Quốc</SelectItem>
                              <SelectItem value="long-an">Long An</SelectItem>
                              <SelectItem value="phu-yen">Phú Yên</SelectItem>
                              <SelectItem value="da-lat">Đà Lạt</SelectItem>
                              <SelectItem value="vung-tau">Vũng Tàu</SelectItem>
                              <SelectItem value="nha-trang">
                                Nha Trang
                              </SelectItem>
                              <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() =>
                              handleProtectedAction(() => {
                                // Logic tìm xe với longTermLocation
                                navigate(`/place/${longTermLocation}`);
                              })
                            }
                            className="bg-green-500 hover:bg-green-600 text-white h-12 px-6"
                          >
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

          </div> */}

      {/* Xe Dành Cho Bạn */}
      <section className="py-16 bg-gray-50 mt-[210px]">
        <div className="container max-w-[75%] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Xe Dành Cho Bạn
            </h2>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 font-semibold"
              onClick={() => navigate("/services/self-drive")}
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {vehiclesLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {featuredVehicles.slice(0, 6).map((vehicle, index) => (
                <div
                  key={vehicle.id || index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleProtectedAction(() => {
                      navigate(`/car/${vehicle.id}`);
                    });
                  }}
                  className="block cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-2xl">
                    {/* Image Section */}
                    <div className="relative">
                      <img
                        src={
                          vehicle.photos?.[0] ||
                          vehicle.photoUrls?.[0] ||
                          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
                        }
                        alt={vehicle.name || vehicle.model}
                        className="w-full h-56 object-cover"
                      />
                      {/* Badge ở góc trên trái */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${
                            vehicle.status === "AVAILABLE"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white border-0 px-3 py-1 text-xs font-medium rounded-md`}
                        >
                          {vehicle.status === "AVAILABLE"
                            ? "Sẵn sàng"
                            : "Không khả dụng"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-5">
                      {/* Price Section */}
                      <div className="mb-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-600">Chỉ từ</span>
                          <span className="text-2xl font-bold text-green-600">
                            {(
                              vehicle.dailyRate || vehicle.pricePerDay
                            )?.toLocaleString("vi-VN") || "Liên hệ"}
                          </span>
                          <span className="text-sm text-gray-600">
                            VNĐ/Ngày
                          </span>
                        </div>
                      </div>

                      {/* Car Name */}
                      <h3 className="font-bold text-xl mb-2 text-gray-900">
                        {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
                      </h3>

                      {/* Car Type/Category */}
                      <div className="flex items-center gap-2 mb-4">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {vehicle.fuelType || "Điện"}
                        </span>
                      </div>

                      {/* Specifications */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-gray-500" />
                          <span>
                            {vehicle.mileage?.toLocaleString() || "N/A"} km
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>
                            {vehicle.capacity || vehicle.seats || 5} chỗ
                          </span>
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
                          <span>{vehicle.transmission || "Tự động"}</span>
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
                          <span>{vehicle.year || "Mới"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Địa Điểm Nổi Bật */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            Địa Điểm Nổi Bật
          </h2>

          {stationsLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : featuredStations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Không có địa điểm nào</p>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredStations.map((station, index) => (
                  <CarouselItem
                    key={station.id || index}
                    className="pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                    <div
                      className="relative group cursor-pointer overflow-hidden rounded-3xl h-[400px]"
                      onClick={() => navigate(`/place/${station.id}`)}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url('${station.photo || "/image/city/hanoi.webp"}')`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold mb-1">
                          {station.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {getCarCountText(station.name)}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black text-white hover:bg-black/80 border-black" />
              <CarouselNext className="right-4 bg-black text-white hover:bg-black/80 border-black" />
            </Carousel>
          )}
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
                      image: "/image/sanbay/tansonnhat.png",
                    },
                    {
                      name: "Ga T3 (TSN)",
                      cars: "2000+ xe",
                      image: "/image/sanbay/tansonnhatT3.jpg",
                    },
                    {
                      name: "Nội Bài",
                      cars: "200+ xe",
                      image: "/image/sanbay/noibai.jpg",
                    },
                    {
                      name: "Đà Nẵng",
                      cars: "100+ xe",
                      image: "/image/sanbay/danang.jpg",
                    },
                    {
                      name: "Cam Ranh",
                      cars: "150+ xe",
                      image: "/image/sanbay/camranh.jpg",
                    },
                    {
                      name: "Liên Khương",
                      cars: "120+ xe",
                      image: "/image/sanbay/lienkhuong.jpg",
                    },
                    {
                      name: "Phú Quốc",
                      cars: "180+ xe",
                      image: "/image/sanbay/phu quoc.jpg",
                    },
                  ].map((airport, index) => (
                    <CarouselItem key={index} className="pl-4 basis-auto">
                      <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition cursor-not-allowed relative min-w-[200px] opacity-60">
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-yellow-500 text-white">
                            Coming Soon
                          </Badge>
                        </div>
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

      {/* Ưu Điểm Của VoltGo */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ưu Điểm Của VoltGo
            </h2>
            <p className="text-gray-600 text-base">
              Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên BF Car
              Rental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Lái xe an toàn cùng VoltGo",
                description:
                  "Chuyến đi trên VoltGo được bảo vệ với Gói bảo hiểm thuê xe tự lái MIC & ĐBV (VNI). Khách thuê xe còn bồi thường tối đa 2.000.000VND trong trường hợp có sự cố ngoài ý muốn.",
                image: "/image/uudiem/Screenshot 2025-10-02 132842.png",
              },
              {
                title: "An tâm đặt xe",
                description:
                  "Không tính phí huỷ chuyến trong vòng 1h sau khi thanh toán giữ chỗ. Hoàn tiền giữ chỗ và bồi thường 100% nếu chủ xe huỷ chuyến trong vòng 7 ngày trước chuyến đi.",
                image: "/image/uudiem/Screenshot 2025-10-02 132836.png",
              },
              {
                title: "Thủ tục đơn giản",
                description:
                  "Chỉ cần có CCCD gắn chip (Hoặc Passport) & Giấy phép lái xe là bạn đã đủ điều kiện thuê xe trên VoltGo.",
                image: "/image/uudiem/Screenshot 2025-10-02 132830.png",
              },
              {
                title: "Thanh toán dễ dàng",
                description:
                  "Đa dạng hình thức thanh toán: ATM, thẻ Visa & Ví điện tử (Momo, VnPay, ZaloPay).",
                image: "/image/uudiem/Screenshot 2025-10-02 132848.png",
              },
              {
                title: "Giao xe tận nơi",
                description:
                  "Bạn có thể lựa chọn giao xe tận nhà/sân bay... Phí tiết kiệm chỉ từ 15k/km.",
                image: "/image/uudiem/Screenshot 2025-10-02 132855.png",
              },
              {
                title: "Dòng xe đa dạng",
                description:
                  "Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Mini, Sedan, CUV, SUV, MPV, Bán tải.",
                image: "/image/uudiem/Screenshot 2025-10-02 132859.png",
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
        <div className="container max-w-[70%] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Hướng Dẫn Thuê Xe
            </h2>
            <p className="text-gray-600 text-base">
              Chỉ với 4 bước đơn giản để trải nghiệm thuê xe VoltGo một cách
              nhanh chóng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                step: "01",
                title: "Đặt xe trên app/web VoltGo",
                image: "/image/huongdan/Screenshot 2025-10-02 132938.png",
                color: "text-green-500",
              },
              {
                step: "02",
                title: "Nhận xe",
                image: "/image/huongdan/Screenshot 2025-10-02 132946.png",
                color: "text-green-500",
              },
              {
                step: "03",
                title: "Bắt đầu hành trình",
                image: "/image/huongdan/Screenshot 2025-10-02 132953.png",
                color: "text-green-500",
              },
              {
                step: "04",
                title: "Trả xe & kết thúc chuyến đi",
                image: "/image/huongdan/Screenshot 2025-10-02 132958.png",
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

      {/* CTA Section 1 - Bạn muốn biết thêm về VoltGo */}
      {/* CTA Section 1 - Bạn muốn biết thêm về VoltGo */}
      <section className="py-16 bg-white">
        <div className="bg-gradient-to-br from-green-50 to-green-100 max-w-[80%] mx-auto rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Image */}
            <div className="order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/image/thue_xe_co_tai_xe_tphcm_gia_re.84f8483d.png"
                  alt="Về VoltGo"
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
                về VoltGo?
              </h2>
              <p className="text-gray-700 text-base mb-8 leading-relaxed max-w-md">
                VoltGo kết nối khách hàng có nhu cầu thuê xe với hàng ngàn chủ
                xe ô tô ở TPHCM, Hà Nội & các tỉnh thành khác. BF Car Rental
                hướng đến việc xây dựng cộng đồng người dùng ô tô văn minh & uy
                tín tại Việt Nam.
              </p>
              <Button
                className="h-12 px-8 text-base bg-green-500 hover:bg-green-600 text-white font-semibold"
                asChild
              >
                <Link to="/about">Tìm hiểu thêm</Link>
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
                  Hơn 10.000 chủ xe đang cho thuê hiệu quả trên VoltGo
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
                    src="/image/thue_xe_oto_tu_lai_di_du_lich_gia_re.fde3ac82.png"
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
        <div className="container max-w-[90%] mx-auto">
          <div className="cta-header">
            <h2>Dịch Vụ Của VoltGo</h2>
          </div>

          <div className="cta-cards-grid">
            {/* Card 1: Xe tự lái */}
            <div className="cta-card-item">
              <div className="cta-card-image-overlay">
                <img
                  src="/image/gia_thue_xe_tu_lai_4cho_tai_hanoi.e6ebc385.png"
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
                  <button
                    className="cta-btn primary"
                    onClick={() =>
                      handleProtectedAction(() => {
                        navigate("/services/self-drive");
                      })
                    }
                  >
                    Thuê xe tự lái
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Xe có tài xế */}
            <div className="cta-card-item">
              <div
                style={{ marginTop: "65px" }}
                className="cta-card-image-overlay relative"
              >
                <img
                  src="/image/thue_xe_oto_tu_lai_va_co_tai.9df79c9f.png"
                  alt="Tài xế của bạn đã đến"
                  className="cta-image opacity-60"
                />
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                    Coming Soon
                  </Badge>
                </div>
                <div className="cta-overlay-content">
                  <h3 style={{ marginLeft: "198px" }}>
                    Tài xế của bạn đã đến!
                  </h3>
                  <p style={{ marginLeft: "230px" }}>
                    Chuyến đi thêm thú vị cùng các tài xế.
                  </p>
                  <button
                    style={{ marginLeft: "320px" }}
                    className="cta-btn secondary opacity-60 cursor-not-allowed"
                    disabled
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
