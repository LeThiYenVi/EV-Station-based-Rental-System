import React, { useEffect, useState } from "react";
import { useStation } from "../../hooks/useStation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { StationStatus } from "../../service/types/report-staff-station.types";
import type {
  StationResponse,
  CreateStationRequest,
} from "../../service/types/report-staff-station.types";

/**
 * Station Management Example
 * Shows station list with search, filtering, and CRUD operations
 */
export const StationManagementExample: React.FC = () => {
  const {
    loading,
    error,
    getAllStations,
    getActiveStations,
    createStation,
    changeStationStatus,
    getAvailableVehiclesCount,
    getStatusText,
    getStatusColor,
    isStationOpen,
    formatAddress,
    calculateUtilization,
    getUtilizationColor,
    searchStations,
    sortByAvailability,
  } = useStation();

  const [stations, setStations] = useState<StationResponse[]>([]);
  const [filteredStations, setFilteredStations] = useState<StationResponse[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateStationRequest>({
    name: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = searchStations(stations, searchQuery);
      setFilteredStations(sortByAvailability(results));
    } else {
      setFilteredStations(sortByAvailability(stations));
    }
  }, [searchQuery, stations]);

  const loadStations = async () => {
    const result = await getAllStations({ page: 0, size: 100 });
    if (result.success && result.data) {
      setStations(result.data.content);
    }
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createStation(formData);
    if (result.success) {
      setShowCreateForm(false);
      setFormData({ name: "", address: "", city: "" });
      loadStations();
    }
  };

  const handleStatusChange = async (
    stationId: string,
    status: StationStatus,
  ) => {
    const result = await changeStationStatus(stationId, status);
    if (result.success) {
      loadStations();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản Lý Trạm</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showCreateForm ? "Hủy" : "+ Tạo Trạm Mới"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Create Station Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo Trạm Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên Trạm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  placeholder="VinFast Station Quận 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa Chỉ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  placeholder="123 Nguyễn Huệ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thành Phố *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Hồ Chí Minh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    value={formData.district || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Quận 1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="station@vinfast.vn"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Đang tạo..." : "Tạo Trạm"}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm trạm theo tên, địa chỉ, thành phố..."
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Station Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stations.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Tổng Trạm</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {
                  stations.filter((s) => s.status === StationStatus.ACTIVE)
                    .length
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Đang Hoạt Động</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stations.reduce((sum, s) => sum + s.totalVehicles, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Tổng Xe</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stations.reduce((sum, s) => sum + s.availableVehicles, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Xe Khả Dụng</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station) => (
            <Card
              key={station.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <Badge className={getStatusColor(station.status)}>
                    {getStatusText(station.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Địa chỉ:</div>
                  <div className="text-sm">{formatAddress(station)}</div>
                </div>

                {station.phoneNumber && (
                  <div>
                    <div className="text-sm text-gray-600">Điện thoại:</div>
                    <div className="text-sm">{station.phoneNumber}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {station.totalVehicles}
                    </div>
                    <div className="text-xs text-gray-600">Tổng xe</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-xl font-bold text-green-600">
                      {station.availableVehicles}
                    </div>
                    <div className="text-xs text-gray-600">Khả dụng</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tỷ lệ sử dụng:</span>
                    <span
                      className={getUtilizationColor(
                        calculateUtilization(station),
                      )}
                    >
                      {calculateUtilization(station).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateUtilization(station)}%` }}
                    ></div>
                  </div>
                </div>

                {station.openingTime && station.closingTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Giờ hoạt động:
                    </span>
                    <span className="text-sm">
                      {station.openingTime} - {station.closingTime}
                    </span>
                    {isStationOpen(station) ? (
                      <Badge className="bg-green-100 text-green-800">
                        Đang mở
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        Đã đóng
                      </Badge>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  {station.status === StationStatus.ACTIVE ? (
                    <button
                      onClick={() =>
                        handleStatusChange(station.id, StationStatus.INACTIVE)
                      }
                      className="flex-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Tạm Ngừng
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleStatusChange(station.id, StationStatus.ACTIVE)
                      }
                      className="flex-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      Kích Hoạt
                    </button>
                  )}
                  <button className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                    Chi Tiết
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredStations.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? "Không tìm thấy trạm nào phù hợp" : "Chưa có trạm nào"}
        </div>
      )}
    </div>
  );
};
