/**
 * BookingDetailModal Component
 * Modal hiển thị chi tiết đầy đủ thông tin đơn thuê
 * - Thông tin khách hàng (renter + CCCD)
 * - Thông tin xe (license_plate, name, brand, type, rating)
 * - Thời gian thuê (start_time, expected_end_time, actual_end_time)
 * - Giá thuê + phụ phí (base_price, extra_fee, deposit_paid, total_amount)
 * - Lịch sử thanh toán (payment_status)
 * - Ghi chú nhận xe, trả xe (pickup_notes, return_notes)
 * - Tình trạng xe (body_condition) và ảnh (photos[])
 */

import { Booking } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Car,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Star,
  Phone,
  Mail,
  IdCard,
  Zap,
  Fuel,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

export default function BookingDetailModal({
  open,
  onOpenChange,
  booking,
}: BookingDetailModalProps) {
  if (!booking) return null;

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
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      pending: { label: "⏳ Chờ xác nhận", variant: "secondary" as const },
      confirmed: { label: "✅ Đã xác nhận", variant: "default" as const },
      picked_up: { label: "🚗 Đang thuê", variant: "default" as const },
      completed: { label: "🏁 Hoàn thành", variant: "outline" as const },
      cancelled: { label: "❌ Đã hủy", variant: "destructive" as const },
    };
    return statusConfig[status];
  };

  const getPaymentBadge = (status: Booking["payment_status"]) => {
    const paymentConfig = {
      pending: { label: "⏳ Chờ thanh toán", variant: "secondary" as const },
      deposit_paid: { label: "💳 Đã đặt cọc", variant: "default" as const },
      paid: { label: "✅ Đã thanh toán", variant: "default" as const },
      failed: { label: "❌ Thất bại", variant: "destructive" as const },
    };
    return paymentConfig[status];
  };

  const getBodyConditionBadge = (condition: Booking["body_condition"]) => {
    const conditionConfig = {
      normal: {
        label: "✅ Bình thường",
        variant: "default" as const,
        icon: CheckCircle,
      },
      minor_damage: {
        label: "⚠️ Hư hại nhẹ",
        variant: "secondary" as const,
        icon: AlertTriangle,
      },
      major_damage: {
        label: "🔴 Hư hại nặng",
        variant: "destructive" as const,
        icon: AlertTriangle,
      },
    };
    return conditionConfig[condition];
  };

  const statusConfig = getStatusBadge(booking.status);
  const paymentConfig = getPaymentBadge(booking.payment_status);
  const conditionConfig = getBodyConditionBadge(booking.body_condition);
  const ConditionIcon = conditionConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Chi tiết đơn thuê #{booking.booking_code}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            <Badge variant={paymentConfig.variant}>{paymentConfig.label}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* SECTION 1: KHÁCH HÀNG */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Họ tên:</span>
                  <span className="font-medium">
                    {booking.renter?.full_name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Điện thoại:</span>
                  <span className="font-medium">
                    {booking.renter?.phone || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">
                    {booking.renter?.email || "—"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">CCCD/CMND:</span>
                  <span className="font-medium">
                    {booking.renter?.identity_number || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Số GPLX:</span>
                  <span className="font-medium">
                    {booking.renter?.license_number || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Xác thực:</span>
                  {booking.renter?.is_verified ? (
                    <Badge variant="default" className="text-xs">
                      ✅ Đã xác thực
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      ⏳ Chưa xác thực
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 2: XE */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Thông tin xe
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tên xe:</span>
                  <span className="font-medium">
                    {booking.vehicle?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Biển số:</span>
                  <span className="font-medium font-mono">
                    {booking.vehicle?.license_plate || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Hãng:</span>
                  <span className="font-medium">
                    {booking.vehicle?.brand || "—"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {booking.vehicle?.type === "electricity" ? (
                    <Zap className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Fuel className="h-4 w-4 text-orange-500" />
                  )}
                  <span className="text-muted-foreground">Loại:</span>
                  <span className="font-medium">
                    {booking.vehicle?.type === "electricity"
                      ? "⚡ Điện"
                      : "⛽ Xăng"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Số chỗ:</span>
                  <span className="font-medium">
                    {booking.vehicle?.capacity || "—"} chỗ
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-muted-foreground">Đánh giá:</span>
                  <span className="font-medium">
                    {booking.vehicle?.rating || "—"}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 3: THỜI GIAN THUÊ */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Thời gian thuê xe
            </h3>
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bắt đầu thuê</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(booking.start_time)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Dự kiến trả xe</p>
                <p className="font-semibold text-orange-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(booking.expected_end_time)}
                </p>
              </div>
              {booking.actual_end_time && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Thực tế trả xe
                  </p>
                  <p className="font-semibold text-blue-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {formatDateTime(booking.actual_end_time)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* SECTION 4: CHI PHÍ */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Chi phí thuê xe
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Giá thuê cơ bản:</span>
                <span className="font-semibold">
                  {formatCurrency(booking.base_price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phí phát sinh:</span>
                <span className="font-semibold text-orange-600">
                  {booking.extra_fee > 0
                    ? `+${formatCurrency(booking.extra_fee)}`
                    : formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tiền đặt cọc:</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(booking.deposit_paid)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Tổng cộng:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(booking.total_amount)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Trạng thái thanh toán:
                </span>
                <Badge variant={paymentConfig.variant}>
                  {paymentConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 5: STAFF PHỤ TRÁCH */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Nhân viên phụ trách
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Staff giao xe (checked_out_by)
                </p>
                <p className="font-medium">
                  {booking.checked_out_staff?.full_name || "Chưa phân công"}
                </p>
                {booking.checked_out_staff?.phone && (
                  <p className="text-xs text-muted-foreground">
                    {booking.checked_out_staff.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Staff nhận xe (checked_in_by)
                </p>
                <p className="font-medium">
                  {booking.checked_in_staff?.full_name || "Chưa phân công"}
                </p>
                {booking.checked_in_staff?.phone && (
                  <p className="text-xs text-muted-foreground">
                    {booking.checked_in_staff.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 6: GHI CHÚ */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Ghi chú
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Ghi chú khi nhận xe (pickup_notes)
                </p>
                <p className="text-sm">
                  {booking.pickup_notes || "Không có ghi chú"}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Ghi chú khi trả xe (return_notes)
                </p>
                <p className="text-sm">
                  {booking.return_notes || "Chưa trả xe"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 7: TÌNH TRẠNG XE VÀ ẢNH */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ConditionIcon className="h-5 w-5 text-primary" />
              Tình trạng xe
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted-foreground">
                  Tình trạng thân xe:
                </span>
                <Badge variant={conditionConfig.variant}>
                  {conditionConfig.label}
                </Badge>
              </div>

              {/* Photos */}
              {booking.photos && booking.photos.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>Ảnh chụp xe ({booking.photos.length} ảnh)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {booking.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            Ảnh {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có ảnh xe</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 8: TIMESTAMPS */}
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span>Tạo lúc: </span>
              <span className="font-mono">
                {formatDateTime(booking.created_at)}
              </span>
            </div>
            <div>
              <span>Cập nhật lúc: </span>
              <span className="font-mono">
                {formatDateTime(booking.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
