import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/service/api/apiClient";
import { API_ENDPOINTS } from "@/service/config/apiConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Car,
  Navigation,
  Calendar,
  MapPinned,
  Search,
} from "lucide-react";

interface NearbyStationResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string;
  distanceKm: number;
  startTime: string;
  endTime: string;
  availableVehiclesCount: number;
}

interface NearbyStationsPageResponse {
  stations: NearbyStationResponse[];
  userLocation: {
    latitude: number;
    longitude: number;
  };
  metadata: {
    totalFound: number;
    searchRadius: number;
  };
}

interface StationDetailResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string;
  startTime: string;
  endTime: string;
  totalVehicles: number;
  availableVehicles: number;
  vehicles: any[];
  createdAt: string;
  updatedAt: string;
}

export default function NearlyStations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<NearbyStationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [selectedStation, setSelectedStation] =
    useState<StationDetailResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);

  useEffect(() => {
    // Gọi tự động khi component mount
    if (!("geolocation" in navigator)) {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      setLoading(false);
      return;
    }

    // Set timeout để tránh chờ quá lâu
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(
          "Yêu cầu vị trí đang mất quá nhiều thời gian. Vui lòng cho phép truy cập vị trí hoặc thử lại.",
        );
        setLoading(false);
        setLocationPermissionDenied(true);
      }
    }, 10000); // 10 seconds timeout

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCoords({ lat: latitude, lon: longitude });

        try {
          const response = await apiClient.get<NearbyStationsPageResponse>(
            API_ENDPOINTS.LOCATIONS.NEARBY_STATIONS,
            {
              params: {
                latitude,
                longitude,
                radiusKm: 4.0,
                limit: 20,
              },
            },
          );

          if (response.data?.stations) {
            setStations(response.data.stations);
            setError(null);
          } else {
            setStations([]);
          }
        } catch (err: any) {
          const errorMsg =
            err.response?.data?.message || "Lỗi khi lấy dữ liệu trạm.";
          setError(errorMsg);
          console.error("Error fetching nearby stations:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        clearTimeout(timeoutId);
        setLocationPermissionDenied(true);
        setError("Không thể lấy vị trí: " + err.message);
        setLoading(false);
      },
      {
        timeout: 10000, // 8 seconds timeout for geolocation
        enableHighAccuracy: false, // Faster but less accurate
        maximumAge: 60000, // Accept cached position up to 1 minute old
      },
    );

    return () => clearTimeout(timeoutId);
  }, []);

  const fetchStationDetail = async (stationId: string) => {
    try {
      setDetailLoading(true);
      const response = await apiClient.get<StationDetailResponse>(
        `/stations/${stationId}`,
      );

      if (response.data) {
        setSelectedStation(response.data);
        setShowDetailDialog(true);
      }
    } catch (err: any) {
      console.error("Error fetching station detail:", err);
      alert("Không thể tải thông tin chi tiết trạm");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFindVehicles = (stationId: string) => {
    // Đóng modal trước
    setShowDetailDialog(false);
    // Chuyển đến trang PlaceSefDrive với stationId
    navigate(`/place/${stationId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.boltscarhire.co.uk/components/phpthumbof/cache/Bolts%20Car%20Hire-12%20JRSG.6ebe825842f8534be39bfbc5442282c6.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative z-10 text-center text-white max-w-4xl px-5">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Tìm Trạm Thuê Xe Gần Bạn
          </h1>
          <p className="text-xl mb-10 opacity-95">
            Tự do khám phá mọi hành trình cùng đội xe đa dạng, chất lượng cao
          </p>
        </div>
      </section>

      {/* Trạng thái tải hoặc lỗi */}
      <section className="bg-white py-7 text-center">
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium">
                Đang xác định vị trí của bạn...
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Vui lòng cho phép truy cập vị trí khi trình duyệt yêu cầu
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium mb-2">⚠️ {error}</p>
              {locationPermissionDenied && (
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p className="font-medium">Cách khắc phục:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Nhấp vào biểu tượng khóa/thông tin bên cạnh URL</li>
                    <li>Chọn "Cho phép" quyền truy cập vị trí</li>
                    <li>Tải lại trang</li>
                  </ol>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-3 bg-green-600 hover:bg-green-700 w-full"
                  >
                    Tải lại trang
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Danh sách trạm gần */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5">
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">
            Các trạm gần vị trí của bạn
          </h3>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-200 h-48"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex gap-3 mt-4">
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Stations List */}
          {!loading && stations.length === 0 && !error && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Không tìm thấy trạm nào gần bạn
              </p>
            </div>
          )}

          <div className="grid gap-6">
            {!loading &&
              stations.map((station) => (
                <Card
                  key={station.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Ảnh đại diện */}
                    <div className="relative md:w-1/3">
                      <img
                        src={station.photo || "/placeholder.jpg"}
                        alt={station.name}
                        className="w-full h-48 md:h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                      <Badge
                        className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white/90"
                        variant="secondary"
                      >
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {station.rating?.toFixed(1) || "N/A"}
                      </Badge>
                    </div>

                    {/* Thông tin chi tiết */}
                    <CardContent className="flex-1 p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-gray-900">
                            {station.name}
                          </h3>
                          <Badge
                            variant={
                              station.status === "ACTIVE"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              station.status === "ACTIVE" ? "bg-green-500" : ""
                            }
                          >
                            {station.status === "ACTIVE"
                              ? "Hoạt động"
                              : "Đóng cửa"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <span>{station.address}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {station.hotline}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span>
                              {new Date(station.startTime).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                              {" - "}
                              {new Date(station.endTime).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-900">
                              {station.availableVehiclesCount}
                            </span>
                            <span className="text-gray-600">xe khả dụng</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Navigation className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-600">
                              {station.distanceKm?.toFixed(1)} km
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => fetchStationDetail(station.id)}
                            disabled={detailLoading}
                            variant="outline"
                            className="flex-1"
                          >
                            {detailLoading ? "Đang tải..." : "Xem chi tiết"}
                          </Button>

                          <Button
                            onClick={() => handleFindVehicles(station.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Tìm xe tại trạm
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Station Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedStation?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedStation && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Side - Station Photo */}
              <div className="md:w-2/5 flex-shrink-0">
                <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
                  <img
                    src={selectedStation.photo || "/placeholder.jpg"}
                    alt={selectedStation.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white/90"
                    variant="secondary"
                  >
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {selectedStation.rating?.toFixed(1) || "N/A"}
                  </Badge>
                </div>
              </div>

              {/* Right Side - Station Information */}
              <div className="md:w-3/5 space-y-4">
                {/* Basic Information */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <MapPinned className="w-5 h-5 text-green-600" />
                        Thông tin cơ bản
                      </h3>
                      <Badge
                        variant={
                          selectedStation.status === "ACTIVE"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          selectedStation.status === "ACTIVE"
                            ? "bg-green-500"
                            : ""
                        }
                      >
                        {selectedStation.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Đóng cửa"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {selectedStation.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Hotline</p>
                          <p className="font-medium text-blue-600 text-sm">
                            {selectedStation.hotline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Giờ hoạt động</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {new Date(
                              selectedStation.startTime,
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(
                              selectedStation.endTime,
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Navigation className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Tọa độ</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {selectedStation.latitude.toFixed(6)},{" "}
                            {selectedStation.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Statistics */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Car className="w-5 h-5 text-purple-600" />
                      Thống kê xe
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1">
                            Tổng số xe
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {selectedStation.totalVehicles}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1">
                            Xe khả dụng
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {selectedStation.availableVehicles}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      <p>
                        <strong>Tạo lúc:</strong>{" "}
                        {new Date(selectedStation.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <p>
                        <strong>Cập nhật:</strong>{" "}
                        {new Date(selectedStation.updatedAt).toLocaleString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowDetailDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={() => handleFindVehicles(selectedStation.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm xe tại trạm
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps?q=${selectedStation.latitude},${selectedStation.longitude}`,
                        "_blank",
                      );
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Xem trên bản đồ
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
