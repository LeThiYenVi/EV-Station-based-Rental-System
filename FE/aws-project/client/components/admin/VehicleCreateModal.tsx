/**
 * VehicleCreateModal - Modal tạo xe mới (không có upload ảnh)
 * Upload ảnh sẽ được xử lý bởi PhotoUploadModal riêng biệt
 */

import { useEffect, useState } from "react";
import { FuelType, FuelTypeLabel } from "@/service/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { stationService } from "@/service";
import type { StationResponse } from "@/service/types/report-staff-station.types";

const VEHICLE_BRANDS = [
  "VinFast",
  "Tesla",
  "Toyota",
  "Honda",
  "Mazda",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Mitsubishi",
  "Suzuki",
  "Lexus",
  "Porsche",
  "Peugeot",
  "MG",
  "BYD",
];

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

interface VehicleCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVehicleRequest) => Promise<void>;
}

export default function VehicleCreateModal({
  open,
  onOpenChange,
  onSubmit,
}: VehicleCreateModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<StationResponse[]>([]);

  const [formData, setFormData] = useState({
    stationId: "",
    licensePlate: "",
    name: "",
    brand: "",
    color: "",
    fuelType: FuelType.ELECTRICITY,
    capacity: 5,
    hourlyRate: 0,
    dailyRate: 0,
    depositAmount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await stationService.getActiveStations();
        setStations(response || []);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
      }
    };
    if (open) {
      fetchStations();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormData({
        stationId: "",
        licensePlate: "",
        name: "",
        brand: "",
        color: "",
        fuelType: FuelType.ELECTRICITY,
        capacity: 5,
        hourlyRate: 0,
        dailyRate: 0,
        depositAmount: 0,
      });
      setErrors({});
    }
  }, [open]);

  const formatLicensePlate = (value: string): string => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cleaned.length < 3) return cleaned;
    const province = cleaned.slice(0, 2);
    const series = cleaned.slice(2, 3);
    const number = cleaned.slice(3, 9);
    if (/^\d{2}$/.test(province) && /^[A-Z]$/.test(series)) {
      return `${province}${series}-${number}`;
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.stationId.trim()) newErrors.stationId = "Vui lòng chọn trạm";
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "Vui lòng nhập biển số xe";
    } else if (!/^[0-9]{2}[A-Z]-[A-Z0-9]{4,6}$/.test(formData.licensePlate)) {
      newErrors.licensePlate = "Biển số xe không hợp lệ (VD: 51B-12345)";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên xe";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên xe phải có ít nhất 2 ký tự";
    }
    if (!formData.brand.trim()) newErrors.brand = "Vui lòng chọn hãng xe";
    if (!formData.color.trim()) newErrors.color = "Vui lòng nhập màu xe";
    if (formData.capacity < 2 || formData.capacity > 50) {
      newErrors.capacity = "Sức chứa phải từ 2-50 người";
    }
    if (formData.hourlyRate < 0)
      newErrors.hourlyRate = "Giá theo giờ không hợp lệ";
    if (formData.dailyRate < 0)
      newErrors.dailyRate = "Giá theo ngày không hợp lệ";
    if (formData.depositAmount < 0)
      newErrors.depositAmount = "Tiền cọc không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin nhập vào",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const submitData: CreateVehicleRequest = {
        ...formData,
        photos: [],
      };
      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Không thể tạo xe";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">🚗 Thêm xe mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin xe. Upload ảnh sẽ được thực hiện ở bước tiếp theo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              📋 Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stationId">
                  Trạm xe <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.stationId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, stationId: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.stationId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn trạm" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} - {station.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stationId && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.stationId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">
                  Biển số xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => {
                    const formatted = formatLicensePlate(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      licensePlate: formatted,
                    }));
                  }}
                  placeholder="VD: 51B-12345"
                  className={errors.licensePlate ? "border-red-500" : ""}
                />
                {errors.licensePlate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.licensePlate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="VD: VinFast VF8"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">
                  Hãng xe <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, brand: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.brand ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn hãng" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_BRANDS.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.brand}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">
                  Màu sắc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="VD: Trắng, Đen, Xanh"
                  className={errors.color ? "border-red-500" : ""}
                />
                {errors.color && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.color}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Loại nhiên liệu</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      fuelType: value as FuelType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FuelTypeLabel).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Số chỗ ngồi</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={2}
                  max={50}
                  className={errors.capacity ? "border-red-500" : ""}
                />
                {errors.capacity && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              💰 Giá thuê & Cọc
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Giá theo giờ (₫)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourlyRate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  className={errors.hourlyRate ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(formData.hourlyRate)}
                </p>
                {errors.hourlyRate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyRate">Giá theo ngày (₫)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyRate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  className={errors.dailyRate ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(formData.dailyRate)}
                </p>
                {errors.dailyRate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.dailyRate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depositAmount">Tiền cọc (₫)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      depositAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  className={errors.depositAmount ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(formData.depositAmount)}
                </p>
                {errors.depositAmount && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.depositAmount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <LoadingOutlined className="mr-2" spin />}
              Tạo xe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
