/**
 * BookingTable Component
 * Hiển thị danh sách đơn thuê với các thông tin chính
 * Columns: booking_code, renter, vehicle, dates, status, payment, total, actions
 */

import { Booking } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Car,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface BookingTableProps {
  bookings: Booking[];
  onViewDetail: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking) => void;
  onAssignStaff: (booking: Booking) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function BookingTable({
  bookings,
  onViewDetail,
  onUpdateStatus,
  onAssignStaff,
  onDelete,
  loading = false,
}: BookingTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      pending: { label: "⏳ Chờ xác nhận", variant: "secondary" as const },
      confirmed: { label: "✅ Đã xác nhận", variant: "default" as const },
      picked_up: { label: "🚗 Đang thuê", variant: "default" as const },
      completed: { label: "🏁 Hoàn thành", variant: "outline" as const },
      cancelled: { label: "❌ Đã hủy", variant: "destructive" as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (status: Booking["payment_status"]) => {
    const paymentConfig = {
      pending: { label: "⏳ Chờ thanh toán", variant: "secondary" as const },
      deposit_paid: { label: "💳 Đã đặt cọc", variant: "default" as const },
      paid: { label: "✅ Đã thanh toán", variant: "default" as const },
      failed: { label: "❌ Thất bại", variant: "destructive" as const },
    };
    const config = paymentConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-1">Không có đơn thuê</h3>
          <p className="text-sm text-muted-foreground">
            Chưa có đơn thuê nào phù hợp với bộ lọc
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Xe</TableHead>
            <TableHead className="w-[180px]">Thời gian thuê</TableHead>
            <TableHead className="w-[140px]">Trạng thái</TableHead>
            <TableHead className="w-[140px]">Thanh toán</TableHead>
            <TableHead className="text-right w-[120px]">Tổng tiền</TableHead>
            <TableHead className="text-right w-[80px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              {/* Booking Code */}
              <TableCell className="font-mono text-xs">
                {booking.booking_code}
              </TableCell>

              {/* Renter */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {booking.renter?.full_name || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.renter?.phone || "—"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Vehicle */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {booking.vehicle?.name || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.vehicle?.license_plate || "—"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Dates */}
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">
                      {formatDateTime(booking.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3 text-orange-600" />
                    <span className="text-orange-600">
                      {formatDateTime(booking.expected_end_time)}
                    </span>
                  </div>
                  {booking.actual_end_time && (
                    <div className="flex items-center gap-1 text-xs">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-600">
                        {formatDateTime(booking.actual_end_time)}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>{getStatusBadge(booking.status)}</TableCell>

              {/* Payment Status */}
              <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>

              {/* Total Amount */}
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(booking.total_amount)}
                  </p>
                  {booking.deposit_paid > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Cọc: {formatCurrency(booking.deposit_paid)}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onViewDetail(booking)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onUpdateStatus(booking)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Cập nhật trạng thái
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onAssignStaff(booking)}>
                      <User className="h-4 w-4 mr-2" />
                      Phân công Staff
                    </DropdownMenuItem>

                    {booking.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(booking.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa đơn
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
