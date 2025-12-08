import { useEffect, useState } from "react";
import apiClient from "@/service/api/apiClient";
import { API_ENDPOINTS } from "@/service/config/apiConfig";

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

export default function NearlyStations() {
  const [stations, setStations] = useState<NearbyStationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  useEffect(() => {
    // Gọi tự động khi component mount
    if (!("geolocation" in navigator)) {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
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
                radiusKm: 10,
                limit: 20,
              },
            }
          );

          if (response.data?.stations) {
            setStations(response.data.stations);
            setError(null);
          } else {
            setStations([]);
          }
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || "Lỗi khi lấy dữ liệu trạm.";
          setError(errorMsg);
          console.error("Error fetching nearby stations:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Không thể lấy vị trí: " + err.message);
        setLoading(false);
      },
    );
  }, []);

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
      <section className="bg-gray-50 py-12 border-b text-center">
        {loading && (
          <p className="text-gray-700 font-medium">
            Đang xác định vị trí của bạn...
          </p>
        )}

        {error && (
          <div className="text-red-600 font-medium">
            ⚠️ {error}
            {error.includes("denied") && (
              <p className="text-gray-500 text-sm mt-2">
                Hãy kiểm tra lại quyền định vị của trình duyệt và chọn{" "}
                <strong>“Cho phép truy cập vị trí”</strong>.
              </p>
            )}
          </div>
        )}

        {coords && !loading && !error && (
          <p className="text-gray-600 text-sm mt-4">
            📍 Vị trí hiện tại: ({coords.lat.toFixed(6)}, {coords.lon.toFixed(6)})
          </p>
        )}
      </section>

      {/* Danh sách trạm gần */}
      {
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-5">
            <h3 className="text-2xl font-bold mb-8 text-center text-black">
              Các trạm gần vị trí của bạn
            </h3>

            <div className="flex flex-col space-y-5">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  {/* Ảnh đại diện */}
                  <div className="relative md:w-1/3">
                    <img
                      src={station.photo || "/placeholder.jpg"}
                      alt={station.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-md font-semibold text-gray-800 shadow-sm">
                      ⭐ {station.rating?.toFixed(1) || "N/A"}
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                          {station.name}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            station.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {station.status === "ACTIVE"
                            ? "Hoạt động"
                            : "Đóng cửa"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        📍 <span className="ml-1">{station.address}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        ☎️{" "}
                        <span className="font-medium">{station.hotline}</span>
                      </p>

                      <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-gray-600">
                          🚘 <strong>{station.availableVehiclesCount}</strong>{" "}
                          xe khả dụng
                        </span>
                        <span className="text-blue-600 font-semibold">
                          📏 {station.distanceKm?.toFixed(1)} km
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span>
                        🕐{" "}
                        <strong>
                          {new Date(station.startTime).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </strong>{" "}
                        -{" "}
                        <strong>
                          {new Date(station.endTime).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </strong>
                      </span>
                      <button className="text-blue-600 font-medium hover:underline">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }
    </div>
  );
}
