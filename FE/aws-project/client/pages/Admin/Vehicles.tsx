/**
 * Vehicles Page - Quản lý Xe
 * Main page cho Vehicle Management Module
 */

import { useState, useMemo, useEffect } from "react";
import adminService from "@/services/admin.service";
import type { VehicleResponse, PageInfo } from "@/services/admin.service";
import {
  VehicleStatus,
  VehicleStatusLabel,
  FuelType,
  FuelTypeLabel,
} from "@/service/types/enums";

// Use VehicleResponse from API directly
type Vehicle = VehicleResponse & { status: VehicleStatus };

interface VehicleFilterParams {
  search?: string;
  status?: VehicleStatus;
  fuelType?: FuelType;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
}

// API request interface
interface CreateVehicleRequest {
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  fuelType: FuelType;
  capacity: number;
  photos: string[];
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  PlusOutlined,
  DownloadOutlined,
  MoreOutlined,
  CarOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import VehicleTable from "../../components/admin/VehicleTable";
import VehicleFilter from "../../components/admin/VehicleFilter";
import VehicleForm from "../../components/admin/VehicleForm";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";

export default function Vehicles() {
  const { toast } = useToast();

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, pageSize]);

  const fetchMetrics = async () => {
    try {
      const response = await adminService.vehicles.getVehicleMetrics();
      setMetricsData(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminService.vehicles.getVehicles({
        page: currentPage,
        size: pageSize,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });
      setVehicles(response.data.content as Vehicle[]);
      setPageInfo(response.data.page);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState<VehicleFilterParams>({});
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filtered vehicles - Client-side filtering for search
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !vehicle.name.toLowerCase().includes(search) &&
          !vehicle.brand.toLowerCase().includes(search) &&
          !vehicle.licensePlate.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      if (filters.status && vehicle.status !== filters.status) return false;
      if (filters.fuelType && vehicle.fuelType !== filters.fuelType)
        return false;
      if (filters.capacity && vehicle.capacity !== filters.capacity)
        return false;
      if (filters.minPrice && vehicle.dailyRate < filters.minPrice)
        return false;
      if (filters.maxPrice && vehicle.dailyRate > filters.maxPrice)
        return false;
      return true;
    });
  }, [vehicles, filters]);

  // Statistics - Use API metrics if available
  const stats = useMemo(() => {
    if (metricsData) {
      return {
        total: metricsData.totalVehicles,
        available: metricsData.totalAvailable,
        inService: metricsData.totalAvailable + metricsData.totalOnGoing,
        maintenance: metricsData.totalMaintenance,
      };
    }

    // Fallback calculation (based on current vehicles list)
    const available = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const rented = vehicles.filter((v) => v.status === "RENTED").length;
    const maintenance = vehicles.filter(
      (v) => v.status === "MAINTENANCE",
    ).length;
    const inService = available + rented;

    return {
      total: vehicles.length,
      available,
      inService,
      maintenance,
    };
  }, [vehicles, metricsData]);

  // Handlers với API integration
  const handleCreate = async (data: CreateVehicleRequest) => {
    try {
      await adminService.vehicles.createVehicle({
        stationId: data.stationId,
        licensePlate: data.licensePlate,
        name: data.name,
        brand: data.brand,
        color: data.color,
        fuelType: data.fuelType,
        capacity: data.capacity,
        photos: data.photos,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        depositAmount: data.depositAmount,
      });

      await fetchVehicles(); // Refresh list
      setShowForm(false);
      toast({
        title: "Tạo xe thành công",
        description: `Xe ${data.name} đã được thêm vào hệ thống.`,
      });
    } catch (error: any) {
      console.error("Failed to create vehicle:", error);
      const errorMessage =
        error?.response?.data?.message || "Không thể tạo xe. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: CreateVehicleRequest) => {
    if (!editingVehicle) return;

    try {
      await adminService.vehicles.updateVehicle(editingVehicle.id, {
        licensePlate: data.licensePlate,
        name: data.name,
        brand: data.brand,
        color: data.color,
        fuelType: data.fuelType,
        capacity: data.capacity,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        depositAmount: data.depositAmount,
      });

      await fetchVehicles();
      setShowForm(false);
      toast({
        title: "Cập nhật thành công",
        description: `Xe ${data.name} đã được cập nhật.`,
      });
    } catch (error: any) {
      console.error("Failed to update vehicle:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Không thể cập nhật xe. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedVehicles.map((id) => adminService.vehicles.deleteVehicle(id)),
      );

      await fetchVehicles();
      setSelectedVehicles([]);
      setShowDeleteDialog(false);
      toast({
        title: "Đã xóa xe",
        description: `${selectedVehicles.length} xe đã được xóa khỏi hệ thống.`,
      });
    } catch (error: any) {
      console.error("Failed to delete vehicles:", error);
      const errorMessage =
        error?.response?.data?.message || "Không thể xóa xe. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (status: VehicleStatus) => {
    try {
      await Promise.all(
        selectedVehicles.map((id) =>
          adminService.vehicles.changeVehicleStatus(id, status),
        ),
      );

      await fetchVehicles();
      setSelectedVehicles([]);
      toast({
        title: "Đã cập nhật trạng thái",
        description: `Đã cập nhật trạng thái cho ${selectedVehicles.length} xe.`,
      });
    } catch (error: any) {
      console.error("Failed to update status:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Không thể cập nhật trạng thái. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredVehicles.map((v) => ({
      "Tên xe": v.name,
      "Hãng xe": v.brand,
      "Biển số": v.licensePlate,
      "Loại nhiên liệu": FuelTypeLabel[v.fuelType as FuelType] || v.fuelType,
      "Số ghế": v.capacity,
      "Trạng thái": VehicleStatusLabel[v.status as VehicleStatus] || v.status,
      "Đánh giá": v.rating,
      "Số lần thuê": v.rentCount,
      "Giá/giờ": v.hourlyRate,
      "Giá/ngày": v.dailyRate,
      "Tiền cọc": v.depositAmount,
    }));
    exportToCSV(csvData as any, "vehicles");
    toast({
      title: "CSV Exported",
      description: "Vehicle data exported successfully",
    });
  };

  const handleExportExcel = () => {
    const excelData = filteredVehicles.map((v) => ({
      Name: v.name,
      Brand: v.brand,
      "License Plate": v.licensePlate,
      Type: v.fuelType,
      Capacity: v.capacity,
      Status: v.status,
      Rating: v.rating,
      "Rent Count": v.rentCount,
      "Hourly Rate": v.hourlyRate,
      "Daily Rate": v.dailyRate,
      "Deposit Amount": v.depositAmount,
    }));
    exportToExcel(excelData as any, "vehicles");
    toast({
      title: "Excel Exported",
      description: "Vehicle data exported successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý xe</h1>
          <p className="text-gray-600">Quản lý đội xe cho thuê</p>
        </div>
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <PlusOutlined className="mr-2" />
          Thêm xe mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số xe</CardTitle>
            <CarOutlined className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả xe trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sẵn sàng</CardTitle>
            <ThunderboltOutlined className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <p className="text-xs text-muted-foreground">Có thể cho thuê</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <ThunderboltOutlined className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inService}
            </div>
            <p className="text-xs text-muted-foreground">Xe đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bảo trì</CardTitle>
            <ToolOutlined className="text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.maintenance}
            </div>
            <p className="text-xs text-muted-foreground">Đang bảo trì</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Danh sách xe</CardTitle>
              <CardDescription>
                {pageInfo
                  ? `Hiển thị ${filteredVehicles.length} trong ${pageInfo.totalElements} xe - Trang ${pageInfo.number + 1} / ${pageInfo.totalPages}`
                  : `Tìm thấy ${filteredVehicles.length} xe`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedVehicles.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreOutlined className="mr-2" />
                      Thao tác hàng loạt ({selectedVehicles.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Đổi trạng thái</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(VehicleStatus.AVAILABLE)
                      }
                    >
                      🟢 {VehicleStatusLabel[VehicleStatus.AVAILABLE]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(VehicleStatus.MAINTENANCE)
                      }
                    >
                      🔴 {VehicleStatusLabel[VehicleStatus.MAINTENANCE]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(VehicleStatus.CHARGING)}
                    >
                      ⚡ {VehicleStatusLabel[VehicleStatus.CHARGING]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(VehicleStatus.UNAVAILABLE)
                      }
                    >
                      ⚫ {VehicleStatusLabel[VehicleStatus.UNAVAILABLE]}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600"
                    >
                      Xóa đã chọn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <DownloadOutlined className="mr-2" />
                    Xuất file
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Xuất CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>
                    Xuất Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <VehicleFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
          <VehicleTable
            vehicles={filteredVehicles}
            selectedVehicles={selectedVehicles}
            onSelectVehicle={(id) => {
              setSelectedVehicles((prev) =>
                prev.includes(id)
                  ? prev.filter((v) => v !== id)
                  : [...prev, id],
              );
            }}
            onSelectAll={(checked) => {
              setSelectedVehicles(
                checked ? filteredVehicles.map((v) => v.id) : [],
              );
            }}
            onEdit={(vehicle) => {
              setEditingVehicle(vehicle as any);
              setShowForm(true);
            }}
            onDelete={(vehicleId) => {
              setSelectedVehicles([vehicleId]);
              setShowDeleteDialog(true);
            }}
            onChangeStatus={(vehicleId, status) => {
              setVehicles(
                vehicles.map((v) =>
                  v.id === vehicleId ? ({ ...v, status } as Vehicle) : v,
                ),
              );
            }}
            onViewDetail={(vehicle) => {
              toast({
                title: "Vehicle Details",
                description: `Viewing details for ${vehicle.name}`,
              });
            }}
          />

          {/* Pagination */}
          {pageInfo && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị {currentPage * pageSize + 1} đến{" "}
                {Math.min((currentPage + 1) * pageSize, pageInfo.totalElements)}{" "}
                trong tổng số {pageInfo.totalElements} xe
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                >
                  <LeftOutlined className="mr-1" />
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pageInfo.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pageInfo.totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 3) {
                        pageNum = i;
                      } else if (currentPage > pageInfo.totalPages - 4) {
                        pageNum = pageInfo.totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum + 1}
                        </Button>
                      );
                    },
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pageInfo.totalPages - 1, prev + 1),
                    )
                  }
                  disabled={currentPage >= pageInfo.totalPages - 1}
                >
                  Tiếp
                  <RightOutlined className="ml-1" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Số xe/trang:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <VehicleForm
        open={showForm}
        onOpenChange={setShowForm}
        vehicle={editingVehicle}
        onSubmit={editingVehicle ? handleUpdate : handleCreate}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationCircleOutlined
                className="text-red-600"
                style={{ fontSize: 20 }}
              />
              Xóa {selectedVehicles.length} xe?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn các xe
              đã chọn và tất cả dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
