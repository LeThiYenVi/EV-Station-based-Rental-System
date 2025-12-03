/**
 * BookingStatusFlow Component
 * Quản lý workflow chuyển trạng thái đơn thuê
 * Workflow: pending → confirmed → picked_up → completed
 * Hoặc: cancelled ở bất kỳ giai đoạn nào
 */

import { useState } from "react";
import { Booking, BookingStatus } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface BookingStatusFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onUpdateStatus: (
    bookingId: string,
    newStatus: BookingStatus,
    notes?: string,
  ) => Promise<void>;
}

export default function BookingStatusFlow({
  open,
  onOpenChange,
  booking,
  onUpdateStatus,
}: BookingStatusFlowProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus | "">("");
  const [notes, setNotes] = useState("");

  if (!booking) return null;

  // Xác định các trạng thái có thể chuyển đổi từ trạng thái hiện tại
  const getAvailableStatuses = (
    currentStatus: BookingStatus,
  ): BookingStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["picked_up", "cancelled"];
      case "picked_up":
        return ["completed", "cancelled"];
      case "completed":
        return []; // Không thể chuyển từ completed
      case "cancelled":
        return []; // Không thể chuyển từ cancelled
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(booking.status);

  const statusLabels: Record<BookingStatus, string> = {
    pending: "⏳ Chờ xác nhận",
    confirmed: "✅ Đã xác nhận",
    picked_up: "🚗 Đang thuê",
    completed: "🏁 Hoàn thành",
    cancelled: "❌ Đã hủy",
  };

  const handleSubmit = async () => {
    if (!newStatus) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn trạng thái mới",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onUpdateStatus(booking.id, newStatus, notes || undefined);
      toast({
        title: "Cập nhật thành công",
        description: `Đơn thuê #${booking.booking_code} đã chuyển sang ${statusLabels[newStatus]}`,
      });
      onOpenChange(false);
      setNewStatus("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ArrowRightOutlined
              style={{ fontSize: 20 }}
              className="text-primary"
            />
            Cập nhật trạng thái đơn thuê
          </DialogTitle>
          <DialogDescription>
            Đơn thuê #{booking.booking_code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <ClockCircleOutlined
              style={{ fontSize: 20 }}
              className="text-muted-foreground"
            />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Trạng thái hiện tại
              </p>
              <div className="mt-1">
                <Badge variant="default" className="text-base">
                  {statusLabels[booking.status]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Workflow Visual */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-3">
              Quy trình đơn thuê:
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${booking.status === "pending" ? "bg-yellow-500" : "bg-gray-300"}`}
                >
                  <ClockCircleOutlined
                    style={{ fontSize: 20 }}
                    className="text-white"
                  />
                </div>
                <p>Chờ xác nhận</p>
              </div>
              <ArrowRightOutlined className="text-muted-foreground" />
              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${booking.status === "confirmed" ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 20 }}
                    className="text-white"
                  />
                </div>
                <p>Đã xác nhận</p>
              </div>
              <ArrowRightOutlined className="text-muted-foreground" />
              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${booking.status === "picked_up" ? "bg-blue-500" : "bg-gray-300"}`}
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 20 }}
                    className="text-white"
                  />
                </div>
                <p>Đang thuê</p>
              </div>
              <ArrowRightOutlined className="text-muted-foreground" />
              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${booking.status === "completed" ? "bg-purple-500" : "bg-gray-300"}`}
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 20 }}
                    className="text-white"
                  />
                </div>
                <p>Hoàn thành</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 text-xs">
                <CloseCircleOutlined className="text-red-500" />
                <span className="text-red-500">
                  Hoặc: Hủy đơn (cancelled) ở bất kỳ giai đoạn nào
                </span>
              </div>
            </div>
          </div>

          {/* Select New Status */}
          {availableStatuses.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="new-status">
                Chuyển sang trạng thái mới{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái..." />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
              <ExclamationCircleOutlined
                style={{ fontSize: 20, color: "#ca8a04" }}
              />
              <div>
                <p className="font-medium text-yellow-900">
                  Không thể chuyển trạng thái
                </p>
                <p className="text-sm text-yellow-700">
                  Đơn thuê ở trạng thái "{statusLabels[booking.status]}" không
                  thể chuyển sang trạng thái khác.
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú về việc cập nhật trạng thái..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Warnings */}
          {newStatus === "cancelled" && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <ExclamationCircleOutlined
                style={{ fontSize: 20 }}
                className="text-red-600 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-medium text-red-900">
                  Cảnh báo: Hủy đơn thuê
                </p>
                <p className="text-red-700 mt-1">
                  Hành động này sẽ hủy đơn thuê. Đảm bảo đã xử lý hoàn tiền (nếu
                  cần) và thông báo cho khách hàng.
                </p>
              </div>
            </div>
          )}

          {newStatus === "completed" && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
              <CheckCircleOutlined
                style={{ fontSize: 20 }}
                className="text-blue-600 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Xác nhận hoàn thành</p>
                <p className="text-blue-700 mt-1">
                  Đảm bảo xe đã được trả lại, kiểm tra tình trạng xe, và thu đầy
                  đủ tiền thuê + phí phát sinh (nếu có).
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !newStatus || availableStatuses.length === 0}
            className="bg-primary"
          >
            {loading && <LoadingOutlined className="mr-2" spin />}
            Cập nhật trạng thái
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
