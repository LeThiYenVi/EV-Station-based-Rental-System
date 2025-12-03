/**
 * Bookings Page - Admin
 * Quản lý toàn bộ đơn thuê xe (quá khứ + hiện tại + sắp tới)
 *
 * Features:
 * ✅ Hiển thị danh sách đơn thuê với filter
 * ✅ Chi tiết đơn thuê (modal)
 * ✅ Cập nhật trạng thái (workflow: pending → confirmed → picked_up → completed / cancelled)
 * ✅ Phân công Staff (checked_out_by, checked_in_by)
 * ✅ Export CSV/Excel
 * ✅ Mock data theo ERD chuẩn
 *
 * TODO: Thay thế mock data bằng API calls khi backend sẵn sàng
 */

import { useState, useMemo, useEffect } from "react";
import adminService from "@/services/admin.service";
// Local minimal types to avoid unresolved '@shared/types'
type BookingStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "completed"
  | "cancelled";

interface BookingFilterParams {
  search?: string;
  status?: BookingStatus | "all";
  payment_status?: string | "all";
  renter_id?: string;
  vehicle_id?: string;
  checked_out_by?: string;
  checked_in_by?: string;
  date_range?: "all" | "past" | "current" | "upcoming";
  start_date?: string;
  end_date?: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
}

interface Vehicle {
  id: string;
  name: string;
  license_plate: string;
}

interface Booking {
  id: string;
  booking_code: string;
  renter_id?: string;
  vehicle_id?: string;
  start_time: string;
  expected_end_time: string;
  actual_end_time?: string;
  status: BookingStatus;
  checked_out_by?: string;
  checked_in_by?: string;
  base_price: number;
  deposit_paid: number;
  extra_fee: number;
  total_amount: number;
  payment_status: string;
  pickup_notes?: string;
  return_notes?: string;
  body_condition?: string;
  photos?: string[];
  created_at: string;
  updated_at?: string;
  renter?: { id: string; full_name: string; email?: string };
  vehicle?: { id: string; name: string; license_plate: string };
  checked_out_staff?: { id: string; full_name: string };
  checked_in_staff?: { id: string; full_name: string };
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  FileSpreadsheet,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import BookingFilter from "@/components/admin/BookingFilter";
import BookingTable from "@/components/admin/BookingTable";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import BookingStatusFlow from "@/components/admin/BookingStatusFlow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Bookings() {
  const { toast } = useToast();

  // ==================== STATE ====================
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [staffList, setStaffList] = useState<User[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchMetrics();
    fetchBookings();
    fetchStaffList();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await adminService.bookings.getBookingMetrics();
      setMetricsData(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await adminService.users.filterUsers({ role: "STAFF" });
      const mapped = (response.data || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.fullName,
        phone: u.phone,
        role: "staff",
      }));
      setStaffList(mapped);
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminService.bookings.getAllBookings();
      // Map API response (camelCase) to frontend format (snake_case)
      const mappedBookings = (response.data || []).map((b: any) => ({
        id: b.id,
        booking_code: b.bookingCode,
        renter_id: b.renterId,
        vehicle_id: b.vehicleId,
        start_time: b.startTime,
        expected_end_time: b.expectedEndTime,
        actual_end_time: b.actualEndTime,
        status: b.status?.toLowerCase() || "pending",
        checked_out_by: b.checkedOutById,
        checked_in_by: b.checkedInById,
        base_price: b.basePrice || 0,
        deposit_paid: b.depositPaid || 0,
        extra_fee: b.extraFee || 0,
        total_amount: b.totalAmount || 0,
        payment_status: b.paymentStatus?.toLowerCase() || "pending",
        pickup_notes: b.pickupNote,
        return_notes: b.returnNote,
        body_condition: "normal",
        photos: [],
        created_at: b.createdAt,
        updated_at: b.updatedAt,
        renter: b.renterName
          ? {
              id: b.renterId,
              full_name: b.renterName,
              email: b.renterEmail,
            }
          : undefined,
        vehicle: b.vehicleName
          ? {
              id: b.vehicleId,
              name: b.vehicleName,
              license_plate: b.licensePlate,
            }
          : undefined,
        checked_out_staff: b.checkedOutByName
          ? {
              id: b.checkedOutById,
              full_name: b.checkedOutByName,
            }
          : undefined,
        checked_in_staff: b.checkedInByName
          ? {
              id: b.checkedInById,
              full_name: b.checkedInByName,
            }
          : undefined,
      }));
      setBookings(mappedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn thuê",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState<BookingFilterParams>({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedStaffType, setSelectedStaffType] = useState<
    "checked_out_by" | "checked_in_by"
  >("checked_out_by");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffNotes, setStaffNotes] = useState("");

  // ==================== FILTER LOGIC ====================
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search by booking_code
      if (
        filters.search &&
        !booking.booking_code
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (
        filters.status &&
        filters.status !== "all" &&
        booking.status !== filters.status
      ) {
        return false;
      }

      // Payment status filter
      if (
        filters.payment_status &&
        filters.payment_status !== "all" &&
        booking.payment_status !== filters.payment_status
      ) {
        return false;
      }

      // Renter ID filter
      if (filters.renter_id && booking.renter_id !== filters.renter_id) {
        return false;
      }

      // Vehicle ID filter
      if (filters.vehicle_id && booking.vehicle_id !== filters.vehicle_id) {
        return false;
      }

      // Staff filters
      if (
        filters.checked_out_by &&
        booking.checked_out_by !== filters.checked_out_by
      ) {
        return false;
      }
      if (
        filters.checked_in_by &&
        booking.checked_in_by !== filters.checked_in_by
      ) {
        return false;
      }

      // Date range filter
      if (filters.date_range && filters.date_range !== "all") {
        const now = new Date();
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.expected_end_time);

        if (filters.date_range === "past") {
          if (endTime >= now) return false;
        } else if (filters.date_range === "current") {
          if (startTime > now || endTime < now) return false;
        } else if (filters.date_range === "upcoming") {
          if (startTime <= now) return false;
        }
      }

      // Start date filter
      if (filters.start_date) {
        const startDate = new Date(filters.start_date);
        const bookingStart = new Date(booking.start_time);
        if (bookingStart < startDate) return false;
      }

      // End date filter
      if (filters.end_date) {
        const endDate = new Date(filters.end_date);
        const bookingEnd = new Date(booking.expected_end_time);
        if (bookingEnd > endDate) return false;
      }

      return true;
    });
  }, [bookings, filters]);

  // ==================== STATISTICS ====================
  const statistics = useMemo(() => {
    if (metricsData) {
      return {
        totalBookings: metricsData.totalBooking,
        totalRevenue: metricsData.totalRevenueFromCompletedBooking,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        activeBookings: metricsData.totalOnGoingBooking,
      };
    }

    // Fallback calculation
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.total_amount, 0);
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending",
    ).length;
    const activeBookings = bookings.filter(
      (b) => b.status === "picked_up",
    ).length;

    return { totalBookings, totalRevenue, pendingBookings, activeBookings };
  }, [bookings, metricsData]);

  // ==================== HANDLERS ====================

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
    notes?: string,
  ) => {
    try {
      // TODO: Implement status update API when available
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: newStatus,
                updated_at: new Date().toISOString(),
                return_notes: notes || b.return_notes,
                actual_end_time:
                  newStatus === "completed"
                    ? new Date().toISOString()
                    : b.actual_end_time,
              }
            : b,
        ),
      );

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleAssignStaff = (booking: Booking) => {
    setSelectedBooking(booking);
    setStaffModalOpen(true);
    setSelectedStaffType("checked_out_by");
    setSelectedStaffId("");
    setStaffNotes("");
  };

  const handleStaffAssignment = async () => {
    if (!selectedBooking || !selectedStaffId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhân viên",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedStaffType === "checked_out_by") {
        await adminService.bookings.confirmBooking(
          selectedBooking.id,
          selectedStaffId,
        );
      }

      await fetchBookings();
      setStaffModalOpen(false);
      toast({
        title: "Phân công thành công",
        description: `Đã phân công nhân viên cho đơn #${selectedBooking.booking_code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign staff",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    // TODO: Replace with API call - DELETE /api/bookings/:id
    if (confirm("Bạn có chắc muốn xóa đơn thuê này?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: "Xóa thành công",
        description: "Đơn thuê đã được xóa khỏi hệ thống",
      });
    }
  };

  // ==================== EXPORT ====================
  const handleExportCSV = () => {
    const headers = [
      "Mã đơn",
      "Khách hàng",
      "Xe",
      "Bắt đầu",
      "Kết thúc",
      "Trạng thái",
      "Thanh toán",
      "Tổng tiền",
    ];

    const rows = filteredBookings.map((b) => [
      b.booking_code,
      b.renter?.full_name || "N/A",
      b.vehicle?.license_plate || "N/A",
      new Date(b.start_time).toLocaleDateString("vi-VN"),
      new Date(b.expected_end_time).toLocaleDateString("vi-VN"),
      b.status,
      b.payment_status,
      b.total_amount.toString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bookings_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();

    toast({
      title: "Xuất file thành công",
      description: `Đã xuất ${filteredBookings.length} đơn thuê ra file CSV`,
    });
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export with better formatting
    toast({
      title: "Chức năng đang phát triển",
      description: "Xuất file Excel sẽ được cập nhật trong phiên bản tiếp theo",
    });
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn thuê</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý toàn bộ đơn thuê xe (quá khứ, hiện tại, sắp tới)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Tổng đơn thuê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tất cả đơn trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
              }).format(statistics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ các đơn đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              Chờ xác nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.pendingBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đơn cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Đang thuê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.activeBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Xe đang được thuê
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BookingFilter
        onFilterChange={setFilters}
        totalBookings={bookings.length}
        filteredBookings={filteredBookings.length}
      />

      {/* Table */}
      <BookingTable
        bookings={filteredBookings}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
        onAssignStaff={handleAssignStaff}
        onDelete={handleDelete}
      />

      {/* Detail Modal */}
      <BookingDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        booking={selectedBooking}
      />

      {/* Status Update Modal */}
      <BookingStatusFlow
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        booking={selectedBooking}
        onUpdateStatus={handleStatusUpdate}
      />

      {/* Staff Assignment Modal */}
      <Dialog open={staffModalOpen} onOpenChange={setStaffModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân công nhân viên</DialogTitle>
            <DialogDescription>
              Đơn thuê #{selectedBooking?.booking_code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Loại phân công</Label>
              <Select
                value={selectedStaffType}
                onValueChange={(value: "checked_out_by" | "checked_in_by") =>
                  setSelectedStaffType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checked_out_by">
                    🚗 Staff giao xe (checked_out_by)
                  </SelectItem>
                  <SelectItem value="checked_in_by">
                    🏁 Staff nhận xe (checked_in_by)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chọn nhân viên</Label>
              <Select
                value={selectedStaffId}
                onValueChange={setSelectedStaffId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn staff..." />
                </SelectTrigger>
                <SelectContent>
                  {staffList
                    .filter((u) => u.role === "staff")
                    .map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name} - {staff.phone}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Thêm ghi chú về việc phân công..."
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStaffModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleStaffAssignment}>Phân công</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
