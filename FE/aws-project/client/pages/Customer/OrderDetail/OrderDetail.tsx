import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CreditCard,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Download,
  Printer,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import type { BookingDetailResponse } from "@/service";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<BookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { getBookingByCode } = useBooking();

  useEffect(() => {
    const loadBookingDetail = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      console.log("🔍 Loading booking detail for code:", id);
      setLoading(true);

      // Call API to get booking by code
      const booking = await getBookingByCode(id);

      console.log("📦 API Response (booking detail):", booking);

      if (booking) {
        console.log("✅ Booking loaded:", booking);

        // Cast to any to handle field name variations from API
        const bookingData = booking as any;

        // Handle field name variations from API
        const processedBooking = {
          ...booking,
          // Ensure pickupTime/returnTime are set from various possible field names
          pickupTime: bookingData.pickupTime || bookingData.startTime || "",
          returnTime:
            bookingData.returnTime ||
            bookingData.endTime ||
            bookingData.expectedEndTime ||
            "",
          // Ensure station names are set
          pickupStationName:
            bookingData.pickupStationName ||
            bookingData.pickupStation?.name ||
            bookingData.station?.name ||
            bookingData.stationName ||
            "N/A",
          returnStationName:
            bookingData.returnStationName ||
            bookingData.returnStation?.name ||
            bookingData.station?.name ||
            bookingData.stationName ||
            "N/A",
          // Ensure price is set
          totalPrice: bookingData.totalPrice || bookingData.totalAmount || 0,
        };

        console.log("✅ Processed booking:", processedBooking);
        setOrder(processedBooking as any);
      } else {
        console.log("❌ Booking not found for code:", id);
        // Fallback: try loading from localStorage for backward compatibility
        const savedOrders = localStorage.getItem("bookingOrders");
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          const foundOrder = parsedOrders.find(
            (order: any) => order.bookingId === id || order.bookingCode === id,
          );
          if (foundOrder) {
            console.log("✅ Found in localStorage:", foundOrder);
            // Convert localStorage format to BookingDetailResponse format
            setOrder({
              id: foundOrder.bookingId || foundOrder.id,
              bookingCode: foundOrder.bookingCode || foundOrder.bookingId,
              vehicleId: foundOrder.vehicleId || "",
              vehicleName: foundOrder.carName || foundOrder.vehicleName,
              renterId: "",
              renterName: foundOrder.renterName,
              pickupStationId: "",
              pickupStationName: foundOrder.pickupLocation,
              returnStationId: "",
              returnStationName: foundOrder.pickupLocation,
              pickupTime:
                foundOrder.pickupDate +
                "T" +
                (foundOrder.pickupTime || "00:00:00"),
              returnTime:
                foundOrder.returnDate +
                "T" +
                (foundOrder.returnTime || "00:00:00"),
              status: foundOrder.status?.toUpperCase() || "PENDING",
              totalPrice: foundOrder.total || 0,
              createdAt: foundOrder.createdAt,
              updatedAt: foundOrder.createdAt,
              vehicle: {
                id: foundOrder.vehicleId || "",
                name: foundOrder.carName || foundOrder.vehicleName,
                model: "",
                plateNumber: "",
                imageUrl: foundOrder.carImage,
                pricePerDay: foundOrder.carPrice || 0,
              },
              renter: {
                id: "",
                fullName: foundOrder.renterName,
                email: foundOrder.email,
                phoneNumber: foundOrder.phone,
              },
              pickupStation: {
                id: "",
                name: foundOrder.pickupLocation,
                address: foundOrder.pickupLocation,
                city: "",
              },
              payment: {
                id: "",
                amount: foundOrder.total || 0,
                status: "COMPLETED",
                method: foundOrder.paymentMethod || "qr",
              },
            } as any);
          }
        }
      }

      setLoading(false);
    };

    loadBookingDetail();
  }, [id, getBookingByCode]);

  // Helper functions
  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { date: "", time: "" };
    const dt = new Date(dateTimeStr);
    return {
      date: dt.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: dt.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} ngày` : "Dưới 1 ngày";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Đơn hàng này không tồn tại hoặc đã bị xóa
            </p>
            <Button
              onClick={() => navigate("/history")}
              className="bg-green-600 hover:bg-green-700"
            >
              Quay lại lịch sử giao dịch
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const statusUpper = status?.toUpperCase() || "PENDING";
    const configs: Record<string, any> = {
      COMPLETED: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle2,
        description: "Chuyến đi đã hoàn thành thành công",
      },
      PENDING: {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
        icon: AlertCircle,
        description: "Đơn hàng đang chờ xác nhận",
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        className: "bg-blue-100 text-blue-700",
        icon: CheckCircle2,
        description: "Đơn hàng đã được xác nhận",
      },
      IN_PROGRESS: {
        label: "Đang thực hiện",
        className: "bg-purple-100 text-purple-700",
        icon: AlertCircle,
        description: "Chuyến đi đang được thực hiện",
      },
      ONGOING: {
        label: "Đang thực hiện",
        className: "bg-purple-100 text-purple-700",
        icon: AlertCircle,
        description: "Chuyến đi đang được thực hiện",
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
        description: "Đơn hàng đã bị hủy",
      },
    };
    return configs[statusUpper] || configs.PENDING;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-6 sm:px-12 md:px-24 lg:px-[150px]">
        {/* Back Button */}
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại lịch sử giao dịch</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đơn hàng
              </h1>
              <p className="text-gray-600">
                Mã đơn:{" "}
                <span className="font-semibold">{order.bookingCode}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="text-gray-600"
              >
                <Printer className="w-4 h-4 mr-2 text-gray-600" />
                In
              </Button>
              <Button variant="outline" className="text-gray-600">
                <Download className="w-4 h-4 mr-2 text-gray-600" />
                Tải xuống
              </Button>
            </div>
          </div>

          {/* Status Banner */}
          <Card
            className={`border-2 ${statusConfig.className.includes("green") ? "border-green-200 bg-green-50" : statusConfig.className.includes("yellow") ? "border-yellow-200 bg-yellow-50" : statusConfig.className.includes("blue") ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${statusConfig.className}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {statusConfig.label}
                  </h3>
                  <p className="text-gray-600">{statusConfig.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Information */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Thông tin xe
                </h3>
                <Separator className="mb-4" />

                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={
                      (order as any).vehicle?.photos?.[0] ||
                      order.vehicle?.imageUrl ||
                      "/placeholder-car.png"
                    }
                    alt={order.vehicleName || order.vehicle?.name || "Vehicle"}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-bold text-gray-900">
                      {order.vehicleName || order.vehicle?.name || "Xe thuê"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {/* Hãng xe */}
                      {(order as any).vehicle?.brand && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Hãng:</span>
                          <span className="font-medium">
                            {(order as any).vehicle.brand}
                          </span>
                        </div>
                      )}
                      {/* Biển số */}
                      {((order as any).vehicle?.licensePlate ||
                        order.vehicle?.plateNumber) && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Biển số:</span>
                          <span className="font-medium">
                            {(order as any).vehicle?.licensePlate ||
                              order.vehicle?.plateNumber}
                          </span>
                        </div>
                      )}
                      {/* Màu sắc */}
                      {(order as any).vehicle?.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Màu:</span>
                          <span className="font-medium">
                            {(order as any).vehicle.color}
                          </span>
                        </div>
                      )}
                      {/* Nhiên liệu */}
                      {(order as any).vehicle?.fuelType && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Nhiên liệu:</span>
                          <span className="font-medium">
                            {(order as any).vehicle.fuelType === "ELECTRICITY"
                              ? "Điện"
                              : (order as any).vehicle.fuelType}
                          </span>
                        </div>
                      )}
                      {/* Số chỗ */}
                      {(order as any).vehicle?.capacity && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Số chỗ:</span>
                          <span className="font-medium">
                            {(order as any).vehicle.capacity} chỗ
                          </span>
                        </div>
                      )}
                      {/* Giá/ngày */}
                      {((order as any).vehicle?.dailyRate ||
                        order.vehicle?.pricePerDay) && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Giá/ngày:</span>
                          <span className="font-medium">
                            {formatCurrency(
                              (order as any).vehicle?.dailyRate ||
                                order.vehicle?.pricePerDay,
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thông tin chuyến đi
                </h3>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Thời gian nhận xe
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-medium">
                            {
                              formatDateTime(
                                (order as any).startTime || order.pickupTime,
                              ).date
                            }
                          </span>
                          <Clock className="w-4 h-4 text-green-600 ml-2" />
                          <span className="font-medium">
                            {
                              formatDateTime(
                                (order as any).startTime || order.pickupTime,
                              ).time
                            }
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Thời gian trả xe (dự kiến)
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-medium">
                            {
                              formatDateTime(
                                (order as any).expectedEndTime ||
                                  order.returnTime,
                              ).date
                            }
                          </span>
                          <Clock className="w-4 h-4 text-green-600 ml-2" />
                          <span className="font-medium">
                            {
                              formatDateTime(
                                (order as any).expectedEndTime ||
                                  order.returnTime,
                              ).time
                            }
                          </span>
                        </div>
                      </div>

                      {/* Thời gian trả thực tế */}
                      {(order as any).actualEndTime && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Thời gian trả xe (thực tế)
                          </p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {
                                formatDateTime((order as any).actualEndTime)
                                  .date
                              }
                            </span>
                            <Clock className="w-4 h-4 text-blue-600 ml-2" />
                            <span className="font-medium">
                              {
                                formatDateTime((order as any).actualEndTime)
                                  .time
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Địa điểm nhận/trả xe
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="font-medium">
                            {(order as any).station?.name ||
                              order.pickupStation?.name ||
                              order.pickupStationName ||
                              "N/A"}
                          </span>
                        </div>
                        {((order as any).station?.address ||
                          order.pickupStation?.address) && (
                          <p className="text-xs text-gray-500 ml-6">
                            {(order as any).station?.address ||
                              order.pickupStation?.address}
                          </p>
                        )}
                        {(order as any).station?.hotline && (
                          <p className="text-xs text-gray-500 ml-6">
                            Hotline: {(order as any).station.hotline}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Thời gian thuê
                        </p>
                        <span className="font-medium">
                          {(order as any).durationHours
                            ? `${(order as any).durationHours} giờ (${Math.ceil((order as any).durationHours / 24)} ngày)`
                            : calculateDuration(
                                (order as any).startTime || order.pickupTime,
                                (order as any).expectedEndTime ||
                                  order.returnTime,
                              )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(order.notes || (order as any).pickupNote) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Ghi chú:</strong>{" "}
                        {order.notes || (order as any).pickupNote}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Renter Information */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin người thuê
                </h3>
                <Separator className="mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-medium text-gray-900">
                        {order.renter?.fullName || order.renterName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">
                        {(order.renter as any)?.phone ||
                          order.renter?.phoneNumber ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {order.renter?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thanh toán</p>
                      <p
                        className={`font-medium ${
                          (order as any).paymentStatus === "PAID" ||
                          (order as any).paymentStatus === "COMPLETED"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {(order as any).paymentStatus === "PAID" ||
                        (order as any).paymentStatus === "COMPLETED"
                          ? "Đã thanh toán"
                          : "Chờ thanh toán"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Payment Summary */}
              <Card className="shadow-lg border-2 border-green-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Chi tiết thanh toán
                  </h3>
                  <Separator className="mb-4" />

                  <div className="space-y-3">
                    {/* Giá xe theo ngày/giờ */}
                    {(order as any).vehicle?.dailyRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá thuê xe/ngày</span>
                        <span className="font-medium">
                          {formatCurrency((order as any).vehicle.dailyRate)}
                        </span>
                      </div>
                    )}

                    {(order as any).vehicle?.hourlyRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá thuê xe/giờ</span>
                        <span className="font-medium">
                          {formatCurrency((order as any).vehicle.hourlyRate)}
                        </span>
                      </div>
                    )}

                    {/* Thời gian thuê */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thời gian thuê</span>
                      <span className="font-medium">
                        {(order as any).durationHours
                          ? `${(order as any).durationHours} giờ (${Math.ceil((order as any).durationHours / 24)} ngày)`
                          : calculateDuration(
                              order.pickupTime,
                              order.returnTime,
                            )}
                      </span>
                    </div>

                    <Separator />

                    {/* Chi phí cơ bản */}
                    {(order as any).basePrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí thuê xe</span>
                        <span className="font-medium">
                          {formatCurrency((order as any).basePrice)}
                        </span>
                      </div>
                    )}

                    {/* Tiền cọc */}
                    {(order as any).depositPaid > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiền đặt cọc</span>
                        <span className="font-medium text-orange-600">
                          {formatCurrency((order as any).depositPaid)}
                        </span>
                      </div>
                    )}

                    {/* Phí phụ thu */}
                    {(order as any).extraFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí phụ thu</span>
                        <span className="font-medium">
                          {formatCurrency((order as any).extraFee)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    {/* Tổng cộng */}
                    <div className="flex justify-between text-base font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">
                        {formatCurrency(
                          (order as any).totalAmount || order.totalPrice || 0,
                        )}
                      </span>
                    </div>

                    <Separator />

                    {/* Trạng thái thanh toán */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Trạng thái thanh toán
                      </span>
                      <span
                        className={`font-medium ${
                          (order as any).paymentStatus === "PAID" ||
                          (order as any).paymentStatus === "COMPLETED"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {(order as any).paymentStatus === "PAID" ||
                        (order as any).paymentStatus === "COMPLETED"
                          ? "Đã thanh toán"
                          : (order as any).paymentStatus === "PENDING"
                            ? "Chờ thanh toán"
                            : (order as any).paymentStatus || "Chưa xác định"}
                      </span>
                    </div>

                    {/* Ghi chú nhận xe */}
                    {(order as any).pickupNote && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-blue-800">
                          <strong>Ghi chú nhận xe:</strong>{" "}
                          {(order as any).pickupNote}
                        </p>
                      </div>
                    )}

                    {/* Ghi chú trả xe */}
                    {(order as any).returnNote && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-700">
                          <strong>Ghi chú trả xe:</strong>{" "}
                          {(order as any).returnNote}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Trạng thái đơn hàng
                  </h3>
                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-200"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-900">
                          Đặt xe thành công
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(order.createdAt).date}{" "}
                          {formatDateTime(order.createdAt).time}
                        </p>
                      </div>
                    </div>

                    {order.status?.toUpperCase() !== "CANCELLED" && (
                      <>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${order.status?.toUpperCase() === "PENDING" ? "bg-yellow-100" : "bg-green-100"} flex items-center justify-center`}
                            >
                              {order.status?.toUpperCase() === "PENDING" ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            {order.status?.toUpperCase() !== "PENDING" && (
                              <div className="w-0.5 h-12 bg-gray-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-gray-900">
                              {order.status?.toUpperCase() === "PENDING"
                                ? "Chờ xác nhận"
                                : "Đã xác nhận"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.status?.toUpperCase() === "PENDING"
                                ? "Đang chờ xác nhận"
                                : "Đơn hàng đã được xác nhận"}
                            </p>
                          </div>
                        </div>

                        {(order.status?.toUpperCase() === "IN_PROGRESS" ||
                          order.status?.toUpperCase() === "ONGOING") && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-purple-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                Đang thực hiện
                              </p>
                              <p className="text-sm text-gray-500">
                                Chuyến đi đang diễn ra
                              </p>
                            </div>
                          </div>
                        )}

                        {order.status?.toUpperCase() === "COMPLETED" && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                Hoàn thành
                              </p>
                              <p className="text-sm text-gray-500">
                                Chuyến đi thành công
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {order.status?.toUpperCase() === "CANCELLED" && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Đã hủy</p>
                          <p className="text-sm text-gray-500">
                            Đơn hàng đã bị hủy
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="shadow-sm border-2 border-blue-100 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Cần hỗ trợ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
