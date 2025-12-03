/**
 * UserFilter Component
 * Bộ lọc để tìm kiếm và filter users theo nhiều tiêu chí
 */

import { useState } from "react";
import { UserRole, UserStatus, UserFilterParams } from "@shared/types";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SearchOutlined,
  CloseOutlined,
  CalendarOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserFilterProps {
  filters: UserFilterParams;
  onFilterChange: (filters: UserFilterParams) => void;
  onReset: () => void;
}

export default function UserFilter({
  filters,
  onFilterChange,
  onReset,
}: UserFilterProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Handle search input change
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    onFilterChange({
      ...filters,
      role: value === "all" ? undefined : (value as UserRole),
    });
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === "all" ? undefined : (value as UserStatus),
    });
  };

  // Handle verified filter change
  const handleVerifiedChange = (value: string) => {
    let verified: boolean | "all" = "all";
    if (value === "verified") verified = true;
    else if (value === "unverified") verified = false;

    onFilterChange({
      ...filters,
      is_verified: verified === "all" ? undefined : verified,
    });
  };

  // Handle date from change
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFilterChange({
      ...filters,
      date_from: date ? format(date, "yyyy-MM-dd") : undefined,
    });
  };

  // Handle date to change
  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFilterChange({
      ...filters,
      date_to: date ? format(date, "yyyy-MM-dd") : undefined,
    });
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.search ||
    filters.role ||
    filters.status ||
    filters.is_verified !== undefined ||
    filters.date_from ||
    filters.date_to;

  // Reset all filters
  const handleResetAll = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterOutlined style={{ fontSize: 20 }} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-gray-600 hover:text-gray-900"
          >
            <CloseOutlined className="mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Tìm kiếm
          </Label>
          <div className="relative mt-1">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            Vai trò
          </Label>
          <Select
            value={filters.role || "all"}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger id="role" className="mt-1">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="admin">Quản trị</SelectItem>
              <SelectItem value="staff">Nhân viên</SelectItem>
              <SelectItem value="renter">Khách hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Trạng thái
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="blocked">Bị khóa</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified Filter */}
        <div>
          <Label
            htmlFor="verified"
            className="text-sm font-medium text-gray-700"
          >
            Xác thực
          </Label>
          <Select
            value={
              filters.is_verified === true
                ? "verified"
                : filters.is_verified === false
                  ? "unverified"
                  : "all"
            }
            onValueChange={handleVerifiedChange}
          >
            <SelectTrigger id="verified" className="mt-1">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="unverified">Chưa xác thực</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-2">
          {/* Date From */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Từ ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarOutlined className="mr-2" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={handleDateFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Đến ngày
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarOutlined className="mr-2" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={handleDateToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Tìm kiếm: {filters.search}
            </span>
          )}
          {filters.role && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Vai trò:{" "}
              {filters.role === "admin"
                ? "Quản trị"
                : filters.role === "staff"
                  ? "Nhân viên"
                  : "Khách hàng"}
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
              Trạng thái:{" "}
              {filters.status === "active"
                ? "Hoạt động"
                : filters.status === "blocked"
                  ? "Bị khóa"
                  : "Chờ duyệt"}
            </span>
          )}
          {filters.is_verified !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              {filters.is_verified ? "Đã xác thực" : "Chưa xác thực"}
            </span>
          )}
          {(filters.date_from || filters.date_to) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
              Ngày: {filters.date_from || "Bắt đầu"} →{" "}
              {filters.date_to || "Kết thúc"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
