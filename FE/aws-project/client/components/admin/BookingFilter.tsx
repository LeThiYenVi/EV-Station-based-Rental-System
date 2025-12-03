/**
 * BookingFilter Component
 * Filter đơn thuê theo status, payment_status, date range, renter, vehicle, staff
 */

import { useState } from "react";
import {
  BookingFilterParams,
  BookingStatus,
  PaymentStatus,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

interface BookingFilterProps {
  onFilterChange: (filters: BookingFilterParams) => void;
  totalBookings: number;
  filteredBookings: number;
}

export default function BookingFilter({
  onFilterChange,
  totalBookings,
  filteredBookings,
}: BookingFilterProps) {
  const [filters, setFilters] = useState<BookingFilterParams>({
    search: "",
    status: "all",
    payment_status: "all",
    date_range: "all",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof BookingFilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: BookingFilterParams = {
      search: "",
      status: "all",
      payment_status: "all",
      date_range: "all",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.search ||
    (filters.status && filters.status !== "all") ||
    (filters.payment_status && filters.payment_status !== "all") ||
    (filters.date_range && filters.date_range !== "all") ||
    filters.renter_id ||
    filters.vehicle_id ||
    filters.checked_out_by ||
    filters.checked_in_by ||
    filters.start_date ||
    filters.end_date;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilterOutlined
                style={{ fontSize: 20 }}
                className="text-primary"
              />
              <h3 className="text-lg font-semibold">Lọc đơn thuê</h3>
              <span className="text-sm text-muted-foreground">
                ({filteredBookings}/{totalBookings} đơn)
              </span>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <CloseOutlined className="mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Mã đơn thuê..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Booking Status */}
            <div className="space-y-2">
              <Label>Trạng thái đơn</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value as BookingStatus | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 Tất cả</SelectItem>
                  <SelectItem value="pending">⏳ Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">✅ Đã xác nhận</SelectItem>
                  <SelectItem value="picked_up">🚗 Đang thuê</SelectItem>
                  <SelectItem value="completed">🏁 Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">❌ Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Thanh toán</Label>
              <Select
                value={filters.payment_status || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "payment_status",
                    value as PaymentStatus | "all",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 Tất cả</SelectItem>
                  <SelectItem value="pending">⏳ Chờ thanh toán</SelectItem>
                  <SelectItem value="deposit_paid">💳 Đã đặt cọc</SelectItem>
                  <SelectItem value="paid">✅ Đã thanh toán</SelectItem>
                  <SelectItem value="failed">❌ Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Khoảng thời gian</Label>
              <Select
                value={filters.date_range || "all"}
                onValueChange={(value) =>
                  handleFilterChange("date_range", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 Tất cả</SelectItem>
                  <SelectItem value="past">📅 Quá khứ</SelectItem>
                  <SelectItem value="current">🔥 Đang diễn ra</SelectItem>
                  <SelectItem value="upcoming">📆 Sắp tới</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-center"
          >
            {showAdvanced ? "Ẩn bộ lọc nâng cao" : "Hiện bộ lọc nâng cao"}
          </Button>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="renter_id">ID Khách hàng</Label>
                <Input
                  id="renter_id"
                  placeholder="uuid của khách thuê..."
                  value={filters.renter_id || ""}
                  onChange={(e) =>
                    handleFilterChange("renter_id", e.target.value || undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_id">ID Xe</Label>
                <Input
                  id="vehicle_id"
                  placeholder="uuid của xe..."
                  value={filters.vehicle_id || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "vehicle_id",
                      e.target.value || undefined,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checked_out_by">Staff giao xe</Label>
                <Input
                  id="checked_out_by"
                  placeholder="uuid của staff..."
                  value={filters.checked_out_by || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "checked_out_by",
                      e.target.value || undefined,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checked_in_by">Staff nhận xe</Label>
                <Input
                  id="checked_in_by"
                  placeholder="uuid của staff..."
                  value={filters.checked_in_by || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "checked_in_by",
                      e.target.value || undefined,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Từ ngày</Label>
                <div className="relative">
                  <CalendarOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="start_date"
                    type="date"
                    value={filters.start_date || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "start_date",
                        e.target.value || undefined,
                      )
                    }
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Đến ngày</Label>
                <div className="relative">
                  <CalendarOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="end_date"
                    type="date"
                    value={filters.end_date || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "end_date",
                        e.target.value || undefined,
                      )
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
