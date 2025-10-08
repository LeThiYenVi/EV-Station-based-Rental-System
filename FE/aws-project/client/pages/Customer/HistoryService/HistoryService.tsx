import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

interface BookingOrder {
  bookingId: string;
  carName: string;
  carImage: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  total: number;
  status: "completed" | "pending" | "cancelled" | "confirmed";
  createdAt: string;
  paymentMethod: string;
  renterName?: string;
  phone?: string;
  email?: string;
  duration?: string;
  rentalType?: string;
  driverService?: boolean;
  carPrice?: number;
  driverFee?: number;
  insurance?: number;
  additionalInsurance?: number;
  serviceFee?: number;
  deposit?: number;
  discount?: number;
  totalDeposit?: number;
  transmission?: string;
  seats?: number;
  fuel?: string;
}

export default function HistoryService() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<BookingOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data for demonstration - tạo nhiều đơn hàng mẫu
    const mockOrders: BookingOrder[] = [
      {
        bookingId: "BK1733740800001",
        carName: "MAZDA 2 2024",
        carImage:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        pickupDate: "10/10/2025",
        pickupTime: "09:00",
        returnDate: "15/10/2025",
        returnTime: "18:00",
        pickupLocation: "Phường Linh Đông, TP Thủ Đức",
        total: 3010000,
        status: "completed",
        createdAt: "08/10/2025 14:30",
        paymentMethod: "qr",
        renterName: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@gmail.com",
        duration: "5 ngày",
        rentalType: "Theo ngày",
        driverService: false,
        carPrice: 3010000,
        driverFee: 0,
        insurance: 150000,
        additionalInsurance: 0,
        serviceFee: 50000,
        deposit: 3000000,
        discount: 200000,
        totalDeposit: 3000000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740700002",
        carName: "TOYOTA VIOS 2023",
        carImage:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        pickupDate: "12/10/2025",
        pickupTime: "08:00",
        returnDate: "14/10/2025",
        returnTime: "20:00",
        pickupLocation: "Quận 1, TP Hồ Chí Minh",
        total: 1800000,
        status: "confirmed",
        createdAt: "07/10/2025 10:15",
        paymentMethod: "bank",
        renterName: "Trần Thị B",
        phone: "0912345678",
        email: "tranthib@gmail.com",
        duration: "2 ngày",
        rentalType: "Theo ngày",
        driverService: false,
        carPrice: 1800000,
        driverFee: 0,
        insurance: 90000,
        additionalInsurance: 0,
        serviceFee: 30000,
        deposit: 2000000,
        discount: 120000,
        totalDeposit: 2000000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740600003",
        carName: "HONDA CITY 2024",
        carImage:
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
        pickupDate: "08/10/2025",
        pickupTime: "07:00",
        returnDate: "08/10/2025",
        returnTime: "22:00",
        pickupLocation: "Quận 7, TP Hồ Chí Minh",
        total: 650000,
        status: "pending",
        createdAt: "06/10/2025 16:45",
        paymentMethod: "qr",
        renterName: "Lê Văn C",
        phone: "0923456789",
        email: "levanc@gmail.com",
        duration: "15 giờ",
        rentalType: "Theo giờ",
        driverService: false,
        carPrice: 650000,
        driverFee: 0,
        insurance: 50000,
        additionalInsurance: 0,
        serviceFee: 20000,
        deposit: 1500000,
        discount: 70000,
        totalDeposit: 1500000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740500004",
        carName: "MERCEDES E-CLASS 2023",
        carImage:
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
        pickupDate: "01/10/2025",
        pickupTime: "10:00",
        returnDate: "05/10/2025",
        returnTime: "10:00",
        pickupLocation: "Quận 3, TP Hồ Chí Minh",
        total: 8000000,
        status: "completed",
        createdAt: "28/09/2025 09:20",
        paymentMethod: "bank",
        renterName: "Phạm Thị D",
        phone: "0934567890",
        email: "phamthid@gmail.com",
        duration: "4 ngày",
        rentalType: "Theo ngày",
        driverService: true,
        carPrice: 6000000,
        driverFee: 2000000,
        insurance: 300000,
        additionalInsurance: 200000,
        serviceFee: 100000,
        deposit: 10000000,
        discount: 600000,
        totalDeposit: 10000000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740400005",
        carName: "HYUNDAI ACCENT 2023",
        carImage:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        pickupDate: "20/09/2025",
        pickupTime: "14:00",
        returnDate: "22/09/2025",
        returnTime: "14:00",
        pickupLocation: "Quận Bình Thạnh, TP Hồ Chí Minh",
        total: 1200000,
        status: "cancelled",
        createdAt: "18/09/2025 11:30",
        paymentMethod: "qr",
        renterName: "Võ Văn E",
        phone: "0945678901",
        email: "vovane@gmail.com",
        duration: "2 ngày",
        rentalType: "Theo ngày",
        driverService: false,
        carPrice: 1200000,
        driverFee: 0,
        insurance: 60000,
        additionalInsurance: 0,
        serviceFee: 25000,
        deposit: 1800000,
        discount: 85000,
        totalDeposit: 1800000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740300006",
        carName: "KIA MORNING 2024",
        carImage:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        pickupDate: "15/09/2025",
        pickupTime: "08:00",
        returnDate: "20/09/2025",
        returnTime: "08:00",
        pickupLocation: "Quận Gò Vấp, TP Hồ Chí Minh",
        total: 2500000,
        status: "completed",
        createdAt: "13/09/2025 15:00",
        paymentMethod: "bank",
        renterName: "Nguyễn Thị F",
        phone: "0956789012",
        email: "nguyenthif@gmail.com",
        duration: "5 ngày",
        rentalType: "Theo ngày",
        driverService: false,
        carPrice: 2500000,
        driverFee: 0,
        insurance: 125000,
        additionalInsurance: 0,
        serviceFee: 40000,
        deposit: 2000000,
        discount: 165000,
        totalDeposit: 2000000,
        transmission: "Số tự động",
        seats: 4,
        fuel: "Xăng",
      },
      {
        bookingId: "BK1733740200007",
        carName: "FORD RANGER 2023",
        carImage:
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
        pickupDate: "05/09/2025",
        pickupTime: "06:00",
        returnDate: "10/09/2025",
        returnTime: "18:00",
        pickupLocation: "Quận Tân Bình, TP Hồ Chí Minh",
        total: 4500000,
        status: "completed",
        createdAt: "03/09/2025 08:45",
        paymentMethod: "qr",
        renterName: "Hoàng Văn G",
        phone: "0967890123",
        email: "hoangvang@gmail.com",
        duration: "5 ngày",
        rentalType: "Theo ngày",
        driverService: true,
        carPrice: 3500000,
        driverFee: 1000000,
        insurance: 175000,
        additionalInsurance: 100000,
        serviceFee: 60000,
        deposit: 5000000,
        discount: 335000,
        totalDeposit: 5000000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Dầu diesel",
      },
      {
        bookingId: "BK1733740100008",
        carName: "VINFAST LUX A2.0",
        carImage:
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
        pickupDate: "25/08/2025",
        pickupTime: "12:00",
        returnDate: "30/08/2025",
        returnTime: "12:00",
        pickupLocation: "Quận 2, TP Hồ Chí Minh",
        total: 5500000,
        status: "completed",
        createdAt: "23/08/2025 13:20",
        paymentMethod: "bank",
        renterName: "Đỗ Thị H",
        phone: "0978901234",
        email: "dothih@gmail.com",
        duration: "5 ngày",
        rentalType: "Theo ngày",
        driverService: false,
        carPrice: 5500000,
        driverFee: 0,
        insurance: 275000,
        additionalInsurance: 150000,
        serviceFee: 80000,
        deposit: 8000000,
        discount: 505000,
        totalDeposit: 8000000,
        transmission: "Số tự động",
        seats: 5,
        fuel: "Xăng",
      },
    ];

    // Load orders from localStorage
    const savedOrders = localStorage.getItem("bookingOrders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Combine mock orders with saved orders
      const allOrders = [...parsedOrders, ...mockOrders];
      // Remove duplicates based on bookingId
      const uniqueOrders = allOrders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.bookingId === order.bookingId),
      );
      setOrders(uniqueOrders);
      setFilteredOrders(uniqueOrders);
    } else {
      // If no saved orders, just use mock data
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      // Optionally save mock data to localStorage
      localStorage.setItem("bookingOrders", JSON.stringify(mockOrders));
    }
  }, []);

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
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
    const statusConfig = {
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
    <div className="min-h-screen bg-gray-50">
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
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  className={
                    statusFilter === "pending"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Chờ xác nhận
                </Button>
                <Button
                  variant={statusFilter === "confirmed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("confirmed")}
                  className={
                    statusFilter === "confirmed"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Đã xác nhận
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("completed")}
                  className={
                    statusFilter === "completed"
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
        {filteredOrders.length === 0 ? (
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
                              {order.bookingId}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">
                            Tổng tiền
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(order.total)}
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
                                {order.paymentMethod === "qr"
                                  ? "Quét mã QR"
                                  : "Chuyển khoản"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => navigate(`/order/${order.bookingId}`)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        {order.status === "completed" && (
                          <Button variant="outline">Đặt lại</Button>
                        )}
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
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
      </div>
    </div>
  );
}
