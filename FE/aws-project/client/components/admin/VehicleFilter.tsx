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
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import {
  VehicleStatus,
  VehicleStatusLabel,
  FuelType,
  FuelTypeLabel,
} from "@/service/types/enums";

interface VehicleFilterParams {
  search?: string;
  status?: VehicleStatus;
  fuelType?: FuelType;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface VehicleFilterProps {
  filters: VehicleFilterParams;
  onFilterChange: (filters: VehicleFilterParams) => void;
  onReset: () => void;
}

export default function VehicleFilter({
  filters,
  onFilterChange,
  onReset,
}: VehicleFilterProps) {
  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== undefined && val !== "all" && val !== "",
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterOutlined style={{ fontSize: 20 }} />
          <h3 className="text-lg font-semibold">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <CloseOutlined className="mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <Label>Tìm kiếm</Label>
          <Input
            placeholder="Tên xe, biển số, hãng xe..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Trạng thái</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filters,
                status: v === "all" ? undefined : (v as VehicleStatus),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value={VehicleStatus.AVAILABLE}>
                {VehicleStatusLabel[VehicleStatus.AVAILABLE]}
              </SelectItem>
              <SelectItem value={VehicleStatus.RENTED}>
                {VehicleStatusLabel[VehicleStatus.RENTED]}
              </SelectItem>
              <SelectItem value={VehicleStatus.MAINTENANCE}>
                {VehicleStatusLabel[VehicleStatus.MAINTENANCE]}
              </SelectItem>
              <SelectItem value={VehicleStatus.CHARGING}>
                {VehicleStatusLabel[VehicleStatus.CHARGING]}
              </SelectItem>
              <SelectItem value={VehicleStatus.UNAVAILABLE}>
                {VehicleStatusLabel[VehicleStatus.UNAVAILABLE]}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Loại nhiên liệu</Label>
          <Select
            value={filters.fuelType || "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filters,
                fuelType: v === "all" ? undefined : (v as FuelType),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value={FuelType.ELECTRICITY}>
                {FuelTypeLabel[FuelType.ELECTRICITY]}
              </SelectItem>
              <SelectItem value={FuelType.GASOLINE}>
                {FuelTypeLabel[FuelType.GASOLINE]}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Số ghế</Label>
          <Select
            value={filters.capacity?.toString() || "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filters,
                capacity: v === "all" ? undefined : parseInt(v),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="2">2 chỗ</SelectItem>
              <SelectItem value="4">4 chỗ</SelectItem>
              <SelectItem value="5">5 chỗ</SelectItem>
              <SelectItem value="7">7 chỗ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
