/**
 * VehicleForm Component - Tạo/Sửa xe
 * Form thêm/sửa xe với các fields khớp API response
 */

import { useEffect, useState } from "react";
import {
  FuelType,
  FuelTypeLabel,
  VehicleStatus,
  VehicleStatusLabel,
} from "@/service/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LoadingOutlined,
  CloseOutlined,
  PlusOutlined,
  StarOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { stationService } from "@/service";
import type { StationResponse } from "@/service/types/report-staff-station.types";

// Danh sách các hãng xe phổ biến
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

// Types matching API request/response
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

interface VehicleData {
  id?: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color?: string;
  fuelType: string;
  capacity: number;
  rating?: number;
  rentCount?: number;
  photos?: string[] | null;
  status?: VehicleStatus;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  polices?: string[] | null;
}

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: VehicleData | null;
  onSubmit: (data: any) => Promise<void>;
}

interface FormErrors {
  stationId?: string;
  licensePlate?: string;
  name?: string;
  brand?: string;
  color?: string;
  capacity?: string;
  hourlyRate?: string;
  dailyRate?: string;
  depositAmount?: string;
}

export default function VehicleForm({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
}: VehicleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");

  // Fetch stations on mount
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

  // Hàm format biển số xe tự động
  // Input: 51b145455 -> Output: 51B-14545
  // Input: 30a12345 -> Output: 30A-12345
  const formatLicensePlate = (value: string): string => {
    // Loại bỏ tất cả ký tự không phải chữ hoặc số
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (cleaned.length < 3) return cleaned;

    // Lấy 2 số đầu (tỉnh/thành phố)
    const province = cleaned.slice(0, 2);

    // Lấy 1 chữ cái (seri)
    const series = cleaned.slice(2, 3);

    // Lấy số còn lại (tối đa 5-6 số)
    const number = cleaned.slice(3, 9);

    // Kiểm tra xem province có phải là số và series có phải là chữ cái
    if (/^\d{2}$/.test(province) && /^[A-Z]$/.test(series)) {
      return `${province}${series}-${number}`;
    }

    return cleaned;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicensePlate(e.target.value);
    setFormData((prev) => ({
      ...prev,
      licensePlate: formatted,
    }));
  };

  useEffect(() => {
    if (vehicle && open) {
      setFormData({
        stationId: vehicle.stationId || "",
        licensePlate: vehicle.licensePlate || "",
        name: vehicle.name || "",
        brand: vehicle.brand || "",
        color: vehicle.color || "",
        fuelType: (vehicle.fuelType as FuelType) || FuelType.ELECTRICITY,
        capacity: vehicle.capacity || 5,
        hourlyRate: vehicle.hourlyRate || 0,
        dailyRate: vehicle.dailyRate || 0,
        depositAmount: vehicle.depositAmount || 0,
      });
      setPhotos(vehicle.photos || []);
      setErrors({});
    } else if (!open) {
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
      setPhotos([]);
      setPhotoUrl("");
      setErrors({});
    }
  }, [vehicle, open]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.stationId.trim()) {
      newErrors.stationId = "Vui lòng chọn trạm";
    }

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

    if (!formData.brand.trim()) {
      newErrors.brand = "Vui lòng chọn hãng xe";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Vui lòng nhập màu xe";
    }

    if (formData.hourlyRate <= 0) {
      newErrors.hourlyRate = "Giá theo giờ phải lớn hơn 0";
    }

    if (formData.dailyRate <= 0) {
      newErrors.dailyRate = "Giá theo ngày phải lớn hơn 0";
    }

    if (formData.depositAmount < 0) {
      newErrors.depositAmount = "Tiền đặt cọc không được âm";
    }

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
        stationId: formData.stationId,
        licensePlate: formData.licensePlate,
        name: formData.name,
        brand: formData.brand,
        color: formData.color,
        fuelType: formData.fuelType,
        capacity: formData.capacity,
        photos: photos,
        hourlyRate: formData.hourlyRate,
        dailyRate: formData.dailyRate,
        depositAmount: formData.depositAmount,
      };

      await onSubmit(submitData);

      toast({
        title: vehicle ? "Cập nhật thành công" : "Tạo xe thành công",
        description: `${formData.name} đã được ${vehicle ? "cập nhật" : "thêm"} vào hệ thống.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể lưu thông tin xe. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const urls = newFiles.map((file) => URL.createObjectURL(file));

      setPhotos((prev) => [...prev, ...urls]);

      toast({
        title: "Ảnh đã được tải lên",
        description: `${newFiles.length} ảnh mới đã được thêm vào.`,
      });
    }
  };

  const addPhotoUrl = () => {
    if (photoUrl.trim()) {
      // Simple URL validation
      try {
        new URL(photoUrl);
        setPhotos((prev) => [...prev, photoUrl.trim()]);
        setPhotoUrl("");
        toast({
          title: "Đã thêm ảnh",
          description: "URL ảnh đã được thêm vào danh sách.",
        });
      } catch {
        toast({
          title: "Lỗi",
          description: "URL không hợp lệ. Vui lòng nhập URL đúng định dạng.",
          variant: "destructive",
        });
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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
          <DialogTitle className="text-2xl">
            {vehicle ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Cập nhật thông tin xe trong hệ thống"
              : "Điền đầy đủ thông tin để thêm xe mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {vehicle && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Thông tin hiện tại</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Đánh giá
                  </Label>
                  <div className="flex items-center gap-1 mt-1">
                    <StarOutlined className="text-yellow-400" />
                    <span className="font-semibold">{vehicle.rating ?? 0}</span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Số lần thuê
                  </Label>
                  <div className="font-semibold mt-1">
                    {vehicle.rentCount ?? 0} lần
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Trạng thái
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        vehicle.status === VehicleStatus.AVAILABLE
                          ? "default"
                          : vehicle.status === VehicleStatus.RENTED
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {vehicle.status
                        ? VehicleStatusLabel[vehicle.status as VehicleStatus] ||
                          vehicle.status
                        : "Không xác định"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    setFormData((prev) => ({
                      ...prev,
                      stationId: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={errors.stationId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn trạm xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
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
                  onChange={handleLicensePlateChange}
                  placeholder="Nhập 51b12345 → Tự động: 51B-12345"
                  className={errors.licensePlate ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Tự động format biển số xe theo chuẩn VN
                </p>
                {errors.licensePlate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.licensePlate}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="VF 8 Plus, Tesla Model 3..."
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
                    <SelectValue placeholder="Chọn hãng xe" />
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">
                  Màu xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="Trắng, Đen, Xanh..."
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
                <Label htmlFor="fuelType">
                  Loại nhiên liệu <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value: FuelType) =>
                    setFormData((prev) => ({ ...prev, fuelType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FuelType.ELECTRICITY}>
                      <div className="flex items-center gap-2">
                        <ThunderboltOutlined className="text-blue-500" />
                        <span>{FuelTypeLabel[FuelType.ELECTRICITY]}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={FuelType.GASOLINE}>
                      <div className="flex items-center gap-2">
                        <FireOutlined className="text-orange-500" />
                        <span>{FuelTypeLabel[FuelType.GASOLINE]}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Số ghế <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.capacity.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 chỗ</SelectItem>
                    <SelectItem value="4">4 chỗ</SelectItem>
                    <SelectItem value="5">5 chỗ</SelectItem>
                    <SelectItem value="7">7 chỗ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              💰 Giá thuê và đặt cọc
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">
                  Giá theo giờ (VND) <span className="text-red-500">*</span>
                </Label>
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
                  step={1000}
                  className={errors.hourlyRate ? "border-red-500" : ""}
                />
                <p className="text-xs text-green-600">
                  {formatCurrency(formData.hourlyRate)}/giờ
                </p>
                {errors.hourlyRate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyRate">
                  Giá theo ngày (VND) <span className="text-red-500">*</span>
                </Label>
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
                  step={10000}
                  className={errors.dailyRate ? "border-red-500" : ""}
                />
                <p className="text-xs text-green-600">
                  {formatCurrency(formData.dailyRate)}/ngày
                </p>
                {errors.dailyRate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleOutlined />
                    {errors.dailyRate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depositAmount">
                  Tiền đặt cọc (VND) <span className="text-red-500">*</span>
                </Label>
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
                  step={100000}
                  className={errors.depositAmount ? "border-red-500" : ""}
                />
                <p className="text-xs text-green-600">
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              📸 Hình ảnh xe
            </h3>

            {/* URL input for photos */}
            <div className="flex gap-2">
              <Input
                placeholder="Nhập URL hình ảnh..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addPhotoUrl} variant="outline">
                <PlusOutlined className="mr-1" />
                Thêm URL
              </Button>
            </div>

            {/* File upload */}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="flex-1"
              />
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {photos.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150?text=Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CloseOutlined style={{ fontSize: 12 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có hình ảnh nào. Thêm URL hoặc tải lên hình ảnh.
              </p>
            )}
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
              {vehicle ? "Cập nhật xe" : "Thêm xe mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
