/**
 * HistoryService - Lịch sử đơn thuê xe
 *
 * Integrated with API:
 * - GET /api/bookings/my-bookings - Get user's bookings list
 * - GET /api/bookings/code/:code - Get booking detail by code
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CreditCard,
  Eye,
  Search,
  Filter,
  ChevronRight,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useToast } from "@/hooks/use-toast";

interface BookingOrder {
  bookingId: string;
  bookingCode: string;
  carName: string;
  carImage: string;
  licensePlate: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  stationName: string;
  basePrice: number;
  depositPaid: number;
  totalAmount: number;
  status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING" | "CONFIRMED";
  paymentStatus: string;
  createdAt: string;
  renterName?: string;
  phone?: string;
  email?: string;
}

export default function HistoryService() {
  const navigate = useNavigate();
  const { getMyBookings, cancelBooking, loading } = useBooking();
  const { toast } = useToast();

  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<BookingOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cancel booking states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [cancellingOrderCode, setCancellingOrderCode] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Default image when API returns null
  const defaultCarImage =
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

  // Load bookings from API
  const loadBookings = async () => {
    try {
      const result = await getMyBookings();

      console.log("📦 API Response (my-bookings):", result);

      if (result && Array.isArray(result)) {
        // Map API response to UI format
        // Note: API may return pickupTime/returnTime OR startTime/endTime
        const mappedOrders: BookingOrder[] = result.map((booking: any) => {
          console.log("📋 Booking item:", booking);

          // Handle both field name variations
          const pickupDateTime = booking.pickupTime || booking.startTime;
          const returnDateTime =
            booking.returnTime || booking.endTime || booking.expectedEndTime;
          const stationName =
            booking.pickupStationName || booking.stationName || "N/A";
          const price =
            booking.totalPrice || booking.totalAmount || booking.basePrice || 0;

          return {
            bookingId: booking.id,
            bookingCode: booking.bookingCode,
            carName: booking.vehicleName || "N/A",
            carImage: defaultCarImage,
            licensePlate: booking.licensePlate || "",
            pickupDate: pickupDateTime
              ? new Date(pickupDateTime).toLocaleDateString("vi-VN")
              : "",
            pickupTime: pickupDateTime
              ? new Date(pickupDateTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            returnDate: returnDateTime
              ? new Date(returnDateTime).toLocaleDateString("vi-VN")
              : "",
            returnTime: returnDateTime
              ? new Date(returnDateTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            pickupLocation: stationName,
            stationName: stationName,
            basePrice: price,
            depositPaid: booking.depositPaid || 0,
            totalAmount: price,
            status: booking.status,
            paymentStatus: booking.paymentStatus || "PENDING",
            createdAt: booking.createdAt
              ? new Date(booking.createdAt).toLocaleString("vi-VN")
              : "",
            renterName: booking.renterName,
            email: booking.renterEmail,
          };
        });

        console.log("✅ Mapped orders:", mappedOrders);
        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  };

  // Open cancel confirmation dialog
  const openCancelDialog = (bookingId: string, bookingCode: string) => {
    setCancellingOrderId(bookingId);
    setCancellingOrderCode(bookingCode);
    setShowCancelDialog(true);
  };

  // Close cancel dialog
  const closeCancelDialog = () => {
    setShowCancelDialog(false);
    setCancellingOrderId(null);
    setCancellingOrderCode("");
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!cancellingOrderId) return;

    try {
      setIsCancelling(true);
      const result = await cancelBooking(cancellingOrderId);

      if (result) {
        toast({
          title: "Hủy đơn thành công",
          description: `Đơn hàng ${cancellingOrderCode} đã được hủy.`,
          variant: "default",
        });

        // Update local state to reflect cancelled status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.bookingId === cancellingOrderId
              ? { ...order, status: "CANCELLED" as const }
              : order,
          ),
        );

        closeCancelDialog();
      } else {
        toast({
          title: "Hủy đơn thất bại",
          description: "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Hủy đơn thất bại",
        description: "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.bookingCode
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.pickupLocation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      ONGOING: {
        label: "Đang thuê",
        className: "bg-blue-100 text-blue-700",
      },
      COMPLETED: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
      },
      PENDING: {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        className: "bg-indigo-100 text-indigo-700",
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700",
      },
      // Lowercase versions for backward compatibility
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
      },
      pending: {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
      },
      confirmed: {
        label: "Đã xác nhận",
        className: "bg-blue-100 text-blue-700",
      },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-[50px]">
      <div className="mx-auto px-6 sm:px-12 md:px-24 lg:px-[150px] py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả các chuyến đi của bạn
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn, tên xe, địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Làm mới
                </Button>
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={
                    statusFilter === "all"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Tất cả
                </Button>
                <Button
                  variant={statusFilter === "PENDING" ? "default" : "outline"}
                  onClick={() => setStatusFilter("PENDING")}
                  className={
                    statusFilter === "PENDING"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Chờ xác nhận
                </Button>
                <Button
                  variant={statusFilter === "ONGOING" ? "default" : "outline"}
                  onClick={() => setStatusFilter("ONGOING")}
                  className={
                    statusFilter === "ONGOING"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Đang thuê
                </Button>
                <Button
                  variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={
                    statusFilter === "COMPLETED"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Hoàn thành
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải lịch sử giao dịch...</p>
            </CardContent>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có giao dịch nào
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Không tìm thấy giao dịch phù hợp với tìm kiếm của bạn"
                  : "Hãy bắt đầu đặt xe để xem lịch sử giao dịch tại đây"}
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-green-600 hover:bg-green-700"
              >
                Khám phá xe ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.bookingId}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Car Image */}
                    <div className="lg:w-48 flex-shrink-0">
                      <img
                        src={order.carImage}
                        alt={order.carName}
                        className="w-full h-32 lg:h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {order.carName}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Mã đơn:{" "}
                            <span className="font-medium text-gray-700">
                              {order.bookingCode || order.bookingId.slice(-8)}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">
                            Tổng tiền
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Trip Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Nhận xe</p>
                              <p className="font-medium text-gray-900">
                                {order.pickupDate} • {order.pickupTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Trả xe</p>
                              <p className="font-medium text-gray-900">
                                {order.returnDate} • {order.returnTime}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Địa điểm</p>
                              <p className="font-medium text-gray-900">
                                {order.pickupLocation}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Thanh toán
                              </p>
                              <p className="font-medium text-gray-900">
                                {order.paymentStatus === "PAID"
                                  ? "Đã thanh toán"
                                  : order.paymentStatus === "PENDING"
                                    ? "Chờ thanh toán"
                                    : order.paymentStatus}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() =>
                            navigate(
                              `/order/${order.bookingCode || order.bookingId}`,
                            )
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        {order.status === "COMPLETED" && (
                          <Button variant="outline">Đặt lại</Button>
                        )}
                        {(order.status === "PENDING" ||
                          order.status === "CONFIRMED") && (
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              openCancelDialog(
                                order.bookingId,
                                order.bookingCode || order.bookingId.slice(-8),
                              )
                            }
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} giao dịch
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                Xác nhận hủy đơn
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn hủy đơn hàng{" "}
                <span className="font-semibold text-gray-900">
                  {cancellingOrderCode}
                </span>{" "}
                không?
                <br />
                <span className="text-red-500 text-sm mt-2 block">
                  Lưu ý: Hành động này không thể hoàn tác.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={closeCancelDialog}
                disabled={isCancelling}
              >
                Đóng
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  "Xác nhận hủy"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
