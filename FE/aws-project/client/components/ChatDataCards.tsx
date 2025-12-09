import { Car, MapPin, Star, Users, DollarSign } from "lucide-react";
import type { VehicleData, StationData } from "@/service/chat";

interface VehicleCardProps {
  vehicle: VehicleData;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  if (!vehicle) return null;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {vehicle.photos && vehicle.photos.length > 0 && (
        <div className="h-32 bg-gray-100 relative">
          <img
            src={vehicle.photos[0]}
            alt={vehicle.name || "Vehicle"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x200?text=No+Image";
            }}
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {vehicle.status === "AVAILABLE" ? (
              <span className="text-green-600">✅ Sẵn sàng</span>
            ) : (
              <span className="text-gray-500">🚫 Không khả dụng</span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-sm mb-1">{vehicle.name || "N/A"}</h4>
        <p className="text-xs text-gray-500 mb-2">{vehicle.licensePlate || "N/A"}</p>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{vehicle.rating ? vehicle.rating.toFixed(1) : "0.0"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Users className="w-3 h-3" />
            <span>{vehicle.capacity || 0} chỗ</span>
          </div>
          <div className="text-xs text-gray-600">
            <span>{vehicle.color || "N/A"}</span>
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Giá thuê:</span>
            <span className="font-bold text-green-600">
              {(vehicle.dailyRate || 0).toLocaleString("vi-VN")} đ/ngày
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-600">Đặt cọc:</span>
            <span className="text-gray-700">
              {(vehicle.depositAmount || 0).toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StationCardProps {
  station: StationData;
}

export function StationCard({ station }: StationCardProps) {
  if (!station) return null;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {station.photo && (
        <div className="h-32 bg-gray-100 relative">
          <img
            src={station.photo}
            alt={station.name || "Station"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x200?text=Station";
            }}
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {station.status === "ACTIVE" ? (
              <span className="text-green-600">⚡ Hoạt động</span>
            ) : (
              <span className="text-gray-500">🚫 Đóng cửa</span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-sm mb-1">{station.name || "N/A"}</h4>
        
        <div className="flex items-start gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{station.address || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{station.rating ? station.rating.toFixed(1) : "0.0"}</span>
          </div>
          <div className="text-xs text-gray-600">
            📞 {station.hotline || "N/A"}
          </div>
        </div>

        {/* Only show if both times are available */}
        {station.startTime && station.endTime && 
         station.startTime !== "N/A" && station.endTime !== "N/A" && (
          <div className="border-t pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">⏰ Giờ hoạt động:</span>
              <span className="font-semibold">
                {station.startTime} - {station.endTime}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
