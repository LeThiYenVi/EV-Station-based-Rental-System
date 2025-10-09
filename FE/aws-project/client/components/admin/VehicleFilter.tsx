/**
 * VehicleFilter Component
 * Bộ lọc xe theo nhiều tiêu chí
 */

import {
  VehicleFilterParams,
  VehicleStatus,
  FuelType,
  TransmissionType,
} from "@shared/types";
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

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === "all" ? undefined : (value as VehicleStatus),
    });
  };

  const handleFuelTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      fuel_type: value === "all" ? undefined : (value as FuelType),
    });
  };

  const handleTransmissionChange = (value: string) => {
    onFilterChange({
      ...filters,
      transmission: value === "all" ? undefined : (value as TransmissionType),
    });
  };

  const handleSeatsChange = (value: string) => {
    onFilterChange({
      ...filters,
      seats: value === "all" ? undefined : parseInt(value),
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name, brand, license plate..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <Label htmlFor="fuel-type">Fuel Type</Label>
          <Select
            value={filters.fuel_type || "all"}
            onValueChange={handleFuelTypeChange}
          >
            <SelectTrigger id="fuel-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transmission Filter */}
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={filters.transmission || "all"}
            onValueChange={handleTransmissionChange}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seats Filter */}
        <div>
          <Label htmlFor="seats">Seats</Label>
          <Select
            value={filters.seats?.toString() || "all"}
            onValueChange={handleSeatsChange}
          >
            <SelectTrigger id="seats">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2">2 seats</SelectItem>
              <SelectItem value="4">4 seats</SelectItem>
              <SelectItem value="5">5 seats</SelectItem>
              <SelectItem value="7">7 seats</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearchChange("")}
              />
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm capitalize">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange("all")}
              />
            </span>
          )}
          {filters.fuel_type && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm capitalize">
              Fuel: {filters.fuel_type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFuelTypeChange("all")}
              />
            </span>
          )}
          {filters.transmission && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm capitalize">
              Trans: {filters.transmission}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTransmissionChange("all")}
              />
            </span>
          )}
          {filters.seats && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded text-sm">
              {filters.seats} seats
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSeatsChange("all")}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
