import { VehicleFilterParams, VehicleStatus, FuelType } from "@shared/types";
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
import { Search, X, Filter } from "lucide-react";

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
          <Filter className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <Label>Search</Label>
          <Input
            placeholder="Search..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Status</Label>
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="charging">Charging</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filters,
                type: v === "all" ? undefined : (v as FuelType),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="electricity">Electric</SelectItem>
              <SelectItem value="gasoline">Gasoline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Capacity</Label>
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="7">7</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
