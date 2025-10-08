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
} from "lucide-react";

interface BookingOrder {
  bookingId: string;
  carName: string;
  carImage: string;
  renterName: string;
  phone: string;
  email: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  duration: string;
  rentalType: string;
  driverService: boolean;
  carPrice: number;
  driverFee: number;
  insurance: number;
  additionalInsurance: number;
  serviceFee: number;
  deposit: number;
  discount: number;
  total: number;
  totalDeposit: number;
  status: "completed" | "pending" | "cancelled" | "confirmed";
  createdAt: string;
  paymentMethod: string;
  transmission?: string;
  seats?: number;
  fuel?: string;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<BookingOrder | null>(null);

  useEffect(() => {
    // Load order from localStorage
    const savedOrders = localStorage.getItem("bookingOrders");
    console.log("🔍 Tìm đơn hàng với ID:", id);
    console.log("📦 localStorage:", savedOrders ? "có dữ liệu" : "trống");

    if (savedOrders && id) {
      const parsedOrders = JSON.parse(savedOrders);
      console.log(
        "📋 Tất cả đơn hàng:",
        parsedOrders.map((o: BookingOrder) => o.bookingId),
      );

      const foundOrder = parsedOrders.find(
        (order: BookingOrder) => order.bookingId === id,
      );

      if (foundOrder) {
        console.log("✅ Tìm thấy đơn hàng:", foundOrder.bookingId);
      } else {
        console.log("❌ KHÔNG tìm thấy đơn hàng với ID:", id);
      }

      setOrder(foundOrder || null);
    }
  }, [id]);

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
    const configs = {
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle2,
        description: "Chuyến đi đã hoàn thành thành công",
      },
      pending: {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
        icon: AlertCircle,
        description: "Đơn hàng đang chờ chủ xe xác nhận",
      },
      confirmed: {
        label: "Đã xác nhận",
        className: "bg-blue-100 text-blue-700",
        icon: CheckCircle2,
        description: "Chủ xe đã xác nhận đơn hàng",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
        description: "Đơn hàng đã bị hủy",
      },
    };
    return configs[status as keyof typeof configs];
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
                Mã đơn: <span className="font-semibold">{order.bookingId}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint} className="text-gray-600">
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
                    src={order.carImage}
                    alt={order.carName}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-bold text-gray-900">
                      {order.carName}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {order.transmission && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Truyền động:</span>
                          <span className="font-medium">
                            {order.transmission}
                          </span>
                        </div>
                      )}
                      {order.seats && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Số chỗ:</span>
                          <span className="font-medium">{order.seats} chỗ</span>
                        </div>
                      )}
                      {order.fuel && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Nhiên liệu:</span>
                          <span className="font-medium">{order.fuel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Loại thuê:</span>
                        <span className="font-medium">{order.rentalType}</span>
                      </div>
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
                            {order.pickupDate}
                          </span>
                          <Clock className="w-4 h-4 text-green-600 ml-2" />
                          <span className="font-medium">
                            {order.pickupTime}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Thời gian trả xe
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-medium">
                            {order.returnDate}
                          </span>
                          <Clock className="w-4 h-4 text-green-600 ml-2" />
                          <span className="font-medium">
                            {order.returnTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="font-medium">
                            {order.pickupLocation}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Thời gian thuê
                        </p>
                        <span className="font-medium">{order.duration}</span>
                      </div>
                    </div>
                  </div>

                  {order.driverService && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        ✓ Dịch vụ thuê xe có tài xế
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
                        {order.renterName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{order.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{order.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Phương thức thanh toán
                      </p>
                      <p className="font-medium text-gray-900">
                        {order.paymentMethod === "qr"
                          ? "Quét mã QR"
                          : "Chuyển khoản ngân hàng"}
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đơn giá thuê xe</span>
                      <span className="font-medium">
                        {formatCurrency(order.carPrice)}
                      </span>
                    </div>

                    {order.driverFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí tài xế</span>
                        <span className="font-medium">
                          {formatCurrency(order.driverFee)}
                        </span>
                      </div>
                    )}

                    {order.insurance > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bảo hiểm thuê xe</span>
                        <span className="font-medium">
                          {formatCurrency(order.insurance)}
                        </span>
                      </div>
                    )}

                    {order.additionalInsurance > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bảo hiểm bổ sung</span>
                        <span className="font-medium">
                          {formatCurrency(order.additionalInsurance)}
                        </span>
                      </div>
                    )}

                    {order.serviceFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí dịch vụ</span>
                        <span className="font-medium">
                          {formatCurrency(order.serviceFee)}
                        </span>
                      </div>
                    )}

                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-medium">
                          -{formatCurrency(order.discount)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-base font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {order.totalDeposit > 0 && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiền cọc</span>
                          <span className="font-medium text-orange-600">
                            {formatCurrency(order.totalDeposit)}
                          </span>
                        </div>
                      </>
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
                          {order.createdAt}
                        </p>
                      </div>
                    </div>

                    {order.status !== "cancelled" && (
                      <>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${order.status === "pending" ? "bg-yellow-100" : "bg-green-100"} flex items-center justify-center`}
                            >
                              {order.status === "pending" ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            {order.status !== "pending" && (
                              <div className="w-0.5 h-12 bg-gray-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-gray-900">
                              {order.status === "pending"
                                ? "Chờ xác nhận"
                                : "Đã xác nhận"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.status === "pending"
                                ? "Chủ xe đang xem xét"
                                : "Chủ xe đã xác nhận"}
                            </p>
                          </div>
                        </div>

                        {order.status === "completed" && (
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

                    {order.status === "cancelled" && (
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
