/**
 * VehicleForm Component - Theo ERD 100%
 * Form thêm/sửa xe với các fields khớp hoàn toàn database schema
 */

import { useEffect, useState } from "react";
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  FuelType,
} from "@shared/types";
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
import { Loader2, Upload, X, Plus, Star, Zap, Fuel } from "lucide-react";

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSubmit: (data: CreateVehicleDto | UpdateVehicleDto) => Promise<void>;
}

export default function VehicleForm({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
}: VehicleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    station_id: "",
    license_plate: "",
    name: "",
    brand: "",
    type: "gasoline" as FuelType,
    capacity: 5,
    hourly_rate: 0,
    daily_rate: 0,
    deposit_amount: 0,
    polices: [""] as string[],
  });

  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (vehicle && open) {
      setFormData({
        station_id: vehicle.station_id,
        license_plate: vehicle.license_plate,
        name: vehicle.name,
        brand: vehicle.brand,
        type: vehicle.type,
        capacity: vehicle.capacity,
        hourly_rate: vehicle.hourly_rate,
        daily_rate: vehicle.daily_rate,
        deposit_amount: vehicle.deposit_amount,
        polices: vehicle.polices.length > 0 ? vehicle.polices : [""],
      });
      setPhotos(vehicle.photos || []);
    } else if (!open) {
      setFormData({
        station_id: "",
        license_plate: "",
        name: "",
        brand: "",
        type: "gasoline",
        capacity: 5,
        hourly_rate: 0,
        daily_rate: 0,
        deposit_amount: 0,
        polices: [""],
      });
      setPhotos([]);
    }
  }, [vehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedPolices = formData.polices.filter((p) => p.trim() !== "");

      const submitData = {
        ...formData,
        polices: cleanedPolices,
        photos: photos,
      };

      await onSubmit(submitData);

      toast({
        title: vehicle ? "Cập nhật thành công" : "Tạo xe thành công",
        description: `${formData.name} đã được ${vehicle ? "cập nhật" : "thêm"} vào hệ thống.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin xe. Vui lòng thử lại.",
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

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addPolicy = () => {
    setFormData((prev) => ({
      ...prev,
      polices: [...prev.polices, ""],
    }));
  };

  const removePolicy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      polices: prev.polices.filter((_, i) => i !== index),
    }));
  };

  const updatePolicy = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      polices: prev.polices.map((p, i) => (i === index ? value : p)),
    }));
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
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vehicle.rating}</span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Số lần thuê
                  </Label>
                  <div className="font-semibold mt-1">
                    {vehicle.rent_count} lần
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Trạng thái
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        vehicle.status === "available"
                          ? "default"
                          : vehicle.status === "rented"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {vehicle.status === "available" && "🟢 Sẵn sàng"}
                      {vehicle.status === "rented" && "🟡 Đang thuê"}
                      {vehicle.status === "maintenance" && "�� Bảo trì"}
                      {vehicle.status === "charging" && "⚡ Đang sạc"}
                      {vehicle.status === "unavailable" && "⚫ Không khả dụng"}
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
                <Label htmlFor="station_id">
                  Station ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="station_id"
                  value={formData.station_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      station_id: e.target.value,
                    }))
                  }
                  placeholder="e.g., station-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_plate">
                  Biển số xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="license_plate"
                  value={formData.license_plate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      license_plate: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="30A-12345"
                  required
                />
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
                  placeholder="Tesla Model 3 Long Range"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">
                  Hãng xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  placeholder="Tesla, VinFast, Toyota..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Loại nhiên liệu <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: FuelType) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span>Điện (Electric)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gasoline">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-orange-500" />
                        <span>Xăng (Gasoline)</span>
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
                <Label htmlFor="hourly_rate">
                  Giá theo giờ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourly_rate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  step={10000}
                  required
                />
                <p className="text-xs text-green-600">
                  {formatCurrency(formData.hourly_rate)}/giờ
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily_rate">
                  Giá theo ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="daily_rate"
                  type="number"
                  value={formData.daily_rate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      daily_rate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  step={10000}
                  required
                />
                <p className="text-xs text-green-600">
                  {formatCurrency(formData.daily_rate)}/ngày
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit_amount">
                  Tiền đặt cọc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  value={formData.deposit_amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deposit_amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  step={100000}
                  required
                />
                <p className="text-xs text-green-600">
                  {formatCurrency(formData.deposit_amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              📸 Hình ảnh xe
            </h3>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {photos.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">📜 Điều khoản thuê xe</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addPolicy}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            <div className="space-y-3">
              {formData.polices.map((policy, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={policy}
                    onChange={(e) => updatePolicy(index, e.target.value)}
                    placeholder={`Điều khoản ${index + 1}`}
                    rows={2}
                  />
                  {formData.polices.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removePolicy(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {vehicle ? "Cập nhật xe" : "Thêm xe mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
