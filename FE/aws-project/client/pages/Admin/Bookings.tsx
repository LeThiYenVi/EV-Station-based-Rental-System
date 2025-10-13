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

import { useState, useMemo } from "react";
import {
  Booking,
  BookingFilterParams,
  BookingStatus,
  User,
  Vehicle,
} from "@shared/types";
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

  // ==================== MOCK DATA ====================
  // TODO: Replace with API call - GET /api/bookings

  const mockUsers: User[] = [
    {
      id: "user-001",
      email: "nguyenvana@gmail.com",
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      avatar_url: null,
      role: "renter",
      license_number: "B2-123456",
      identity_number: "001234567890",
      license_card_image_url: null,
      is_verified: true,
      verified_at: "2025-01-15T10:00:00Z",
      status: "active",
      stationid: null,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T10:00:00Z",
    },
    {
      id: "user-002",
      email: "tranthib@gmail.com",
      full_name: "Trần Thị B",
      phone: "0912345678",
      avatar_url: null,
      role: "renter",
      license_number: "B2-654321",
      identity_number: "009876543210",
      license_card_image_url: null,
      is_verified: true,
      verified_at: "2025-02-01T10:00:00Z",
      status: "active",
      stationid: null,
      created_at: "2025-01-20T00:00:00Z",
      updated_at: "2025-02-01T10:00:00Z",
    },
    {
      id: "staff-001",
      email: "staff1@evstation.com",
      full_name: "Lê Văn Staff 1",
      phone: "0923456789",
      avatar_url: null,
      role: "staff",
      license_number: null,
      identity_number: null,
      license_card_image_url: null,
      is_verified: true,
      verified_at: "2024-12-01T00:00:00Z",
      status: "active",
      stationid: "station-001",
      created_at: "2024-12-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
    {
      id: "staff-002",
      email: "staff2@evstation.com",
      full_name: "Phạm Thị Staff 2",
      phone: "0934567890",
      avatar_url: null,
      role: "staff",
      license_number: null,
      identity_number: null,
      license_card_image_url: null,
      is_verified: true,
      verified_at: "2024-12-01T00:00:00Z",
      status: "active",
      stationid: "station-001",
      created_at: "2024-12-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
  ];

  const mockVehicles: Vehicle[] = [
    {
      id: "vehicle-001",
      station_id: "station-001",
      license_plate: "30A-12345",
      name: "Tesla Model 3 Long Range",
      brand: "Tesla",
      type: "electricity",
      rating: 4.8,
      capacity: 5,
      rent_count: 127,
      photos: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=500",
      ],
      status: "rented",
      hourly_rate: 150000,
      daily_rate: 1200000,
      deposit_amount: 10000000,
      polices: [
        "Yêu cầu GPLX hạng B2 còn hiệu lực",
        "Đặt cọc 10.000.000 VNĐ",
        "Không hút thuốc trong xe",
      ],
      created_at: "2024-10-01T00:00:00Z",
      updated_at: "2025-10-10T00:00:00Z",
    },
    {
      id: "vehicle-002",
      station_id: "station-001",
      license_plate: "30B-67890",
      name: "VinFast VF8",
      brand: "VinFast",
      type: "electricity",
      rating: 4.5,
      capacity: 5,
      rent_count: 89,
      photos: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
      ],
      status: "available",
      hourly_rate: 120000,
      daily_rate: 950000,
      deposit_amount: 8000000,
      polices: ["Yêu cầu GPLX hạng B2", "Đặt cọc 8.000.000 VNĐ"],
      created_at: "2024-11-01T00:00:00Z",
      updated_at: "2025-10-10T00:00:00Z",
    },
    {
      id: "vehicle-003",
      station_id: "station-001",
      license_plate: "51F-11111",
      name: "Toyota Camry 2024",
      brand: "Toyota",
      type: "gasoline",
      rating: 4.2,
      capacity: 5,
      rent_count: 156,
      photos: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
      ],
      status: "maintenance",
      hourly_rate: 100000,
      daily_rate: 800000,
      deposit_amount: 5000000,
      polices: ["GPLX hạng B2", "Đặt cọc 5.000.000 VNĐ", "Trả đầy bình xăng"],
      created_at: "2024-09-01T00:00:00Z",
      updated_at: "2025-10-08T00:00:00Z",
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: "booking-001",
      booking_code: "BK2025100001",
      renter_id: "user-001",
      vehicle_id: "vehicle-001",
      start_time: "2025-10-08T08:00:00Z",
      expected_end_time: "2025-10-12T18:00:00Z",
      actual_end_time: null,
      status: "picked_up",
      checked_out_by: "staff-001",
      checked_in_by: null,
      base_price: 4800000, // 4 ngày * 1.200.000
      deposit_paid: 10000000,
      extra_fee: 0,
      total_amount: 4800000,
      payment_status: "deposit_paid",
      pickup_notes:
        "Xe đã kiểm tra kỹ, tình trạng tốt. Khách hàng đã ký biên bản.",
      return_notes: null,
      body_condition: "normal",
      photos: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300",
        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=300",
      ],
      created_at: "2025-10-05T10:00:00Z",
      updated_at: "2025-10-08T08:15:00Z",
      renter: mockUsers[0],
      vehicle: mockVehicles[0],
      checked_out_staff: mockUsers[2],
      checked_in_staff: undefined,
    },
    {
      id: "booking-002",
      booking_code: "BK2025100002",
      renter_id: "user-002",
      vehicle_id: "vehicle-002",
      start_time: "2025-10-15T10:00:00Z",
      expected_end_time: "2025-10-18T10:00:00Z",
      actual_end_time: null,
      status: "confirmed",
      checked_out_by: null,
      checked_in_by: null,
      base_price: 2850000, // 3 ngày * 950.000
      deposit_paid: 8000000,
      extra_fee: 0,
      total_amount: 2850000,
      payment_status: "deposit_paid",
      pickup_notes: null,
      return_notes: null,
      body_condition: "normal",
      photos: [],
      created_at: "2025-10-10T14:00:00Z",
      updated_at: "2025-10-10T14:30:00Z",
      renter: mockUsers[1],
      vehicle: mockVehicles[1],
      checked_out_staff: undefined,
      checked_in_staff: undefined,
    },
    {
      id: "booking-003",
      booking_code: "BK2025090050",
      renter_id: "user-001",
      vehicle_id: "vehicle-003",
      start_time: "2025-09-20T08:00:00Z",
      expected_end_time: "2025-09-25T18:00:00Z",
      actual_end_time: "2025-09-25T17:30:00Z",
      status: "completed",
      checked_out_by: "staff-001",
      checked_in_by: "staff-002",
      base_price: 4000000, // 5 ngày * 800.000
      deposit_paid: 5000000,
      extra_fee: 200000, // Phí trả xe muộn 30 phút
      total_amount: 4200000,
      payment_status: "paid",
      pickup_notes: "Xe giao lúc 8:00 sáng, khách hàng hài lòng.",
      return_notes: "Xe trả muộn 30 phút, tính phí 200k. Tình trạng xe tốt.",
      body_condition: "normal",
      photos: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300",
      ],
      created_at: "2025-09-15T10:00:00Z",
      updated_at: "2025-09-25T17:45:00Z",
      renter: mockUsers[0],
      vehicle: mockVehicles[2],
      checked_out_staff: mockUsers[2],
      checked_in_staff: mockUsers[3],
    },
    {
      id: "booking-004",
      booking_code: "BK2025100003",
      renter_id: "user-002",
      vehicle_id: "vehicle-001",
      start_time: "2025-10-20T09:00:00Z",
      expected_end_time: "2025-10-22T18:00:00Z",
      actual_end_time: null,
      status: "pending",
      checked_out_by: null,
      checked_in_by: null,
      base_price: 2400000, // 2 ngày * 1.200.000
      deposit_paid: 0,
      extra_fee: 0,
      total_amount: 2400000,
      payment_status: "pending",
      pickup_notes: null,
      return_notes: null,
      body_condition: "normal",
      photos: [],
      created_at: "2025-10-11T09:00:00Z",
      updated_at: "2025-10-11T09:00:00Z",
      renter: mockUsers[1],
      vehicle: mockVehicles[0],
      checked_out_staff: undefined,
      checked_in_staff: undefined,
    },
    {
      id: "booking-005",
      booking_code: "BK2025090045",
      renter_id: "user-001",
      vehicle_id: "vehicle-002",
      start_time: "2025-09-10T08:00:00Z",
      expected_end_time: "2025-09-15T18:00:00Z",
      actual_end_time: null,
      status: "cancelled",
      checked_out_by: null,
      checked_in_by: null,
      base_price: 4750000, // 5 ngày * 950.000
      deposit_paid: 8000000,
      extra_fee: 0,
      total_amount: 4750000,
      payment_status: "failed",
      pickup_notes: null,
      return_notes: "Khách hủy đơn do lý do cá nhân. Đã hoàn cọc 100%.",
      body_condition: "normal",
      photos: [],
      created_at: "2025-09-05T10:00:00Z",
      updated_at: "2025-09-08T14:00:00Z",
      renter: mockUsers[0],
      vehicle: mockVehicles[1],
      checked_out_staff: undefined,
      checked_in_staff: undefined,
    },
  ];

  // ==================== STATE ====================
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
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
  }, [bookings]);

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
    // TODO: Replace with API call - PATCH /api/bookings/:id/status
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

    // TODO: Replace with API call - PATCH /api/bookings/:id/assign-staff
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              [selectedStaffType]: selectedStaffId,
              updated_at: new Date().toISOString(),
              pickup_notes:
                selectedStaffType === "checked_out_by"
                  ? staffNotes || b.pickup_notes
                  : b.pickup_notes,
              return_notes:
                selectedStaffType === "checked_in_by"
                  ? staffNotes || b.return_notes
                  : b.return_notes,
            }
          : b,
      ),
    );

    toast({
      title: "Phân công thành công",
      description: `Đã phân công nhân viên cho đơn #${selectedBooking.booking_code}`,
    });

    setStaffModalOpen(false);
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
                  {mockUsers
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
