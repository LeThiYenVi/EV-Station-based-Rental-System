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
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import feedbackService from "@/service/feedback/feedbackService";
import type { BookingDetailResponse } from "@/service";
import type { FeedbackResponse } from "@/service/types/feedback.types";
import { BookingStatus } from "@/service/types/booking.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMessage } from "@/components/ui/message";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<BookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { getBookingByCode, completeBooking } = useBooking();
  const { contextHolder, showSuccess, showError } = useMessage();

  // Feedback states
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(
    null,
  );
  const [editingFeedback, setEditingFeedback] =
    useState<FeedbackResponse | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    vehicleRating: 5,
    stationRating: 5,
    comment: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Load feedbacks when vehicle changes
  useEffect(() => {
    if (order?.vehicleId) {
      loadFeedbacks();
    }
  }, [order?.vehicleId]);

  const loadFeedbacks = async () => {
    if (!order?.id) return;

    try {
      setFeedbackLoading(true);
      // Use getMyFeedbacks to get current user's feedbacks
      const response = await feedbackService.getMyFeedbacks(0, 10);
      // Filter feedbacks for current booking
      const myFeedback = response.content.find((f) => f.bookingId === order.id);
      setFeedbacks(myFeedback ? [myFeedback] : []);
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleOpenFeedbackDialog = (feedback?: FeedbackResponse) => {
    if (feedback) {
      setEditingFeedback(feedback);
      setFeedbackForm({
        vehicleRating: feedback.vehicleRating,
        stationRating: feedback.stationRating,
        comment: feedback.comment,
      });
    } else {
      setEditingFeedback(null);
      setFeedbackForm({
        vehicleRating: 5,
        stationRating: 5,
        comment: "",
      });
    }
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = async () => {
    if (!order?.id) {
      showError("Không tìm thấy thông tin đơn hàng");
      return;
    }

    if (!feedbackForm.comment.trim()) {
      showError("Vui lòng nhập nhận xét");
      return;
    }

    try {
      setIsProcessing(true);

      if (editingFeedback) {
        // Update existing feedback
        await feedbackService.updateFeedback(editingFeedback.id, {
          vehicleRating: feedbackForm.vehicleRating,
          stationRating: feedbackForm.stationRating,
          comment: feedbackForm.comment,
        });
        showSuccess("Cập nhật đánh giá thành công!");
      } else {
        // Create new feedback
        await feedbackService.createFeedback({
          bookingId: order.id,
          vehicleRating: feedbackForm.vehicleRating,
          stationRating: feedbackForm.stationRating,
          comment: feedbackForm.comment,
        });
        showSuccess("Gửi đánh giá thành công!");
      }

      setShowFeedbackDialog(false);
      setEditingFeedback(null);
      loadFeedbacks(); // Reload feedbacks
    } catch (error: any) {
      console.error("Submit feedback error:", error);
      // Extract error message from response
      const errorMessage =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Không thể gửi đánh giá";
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setDeletingFeedbackId(feedbackId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!deletingFeedbackId) return;

    try {
      setIsProcessing(true);
      await feedbackService.deleteFeedback(deletingFeedbackId);
      showSuccess("Xóa đánh giá thành công!");
      setShowDeleteDialog(false);
      setDeletingFeedbackId(null);
      loadFeedbacks(); // Reload feedbacks
    } catch (error: any) {
      console.error("Delete feedback error:", error);
      const errorMessage =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Không thể xóa đánh giá";
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!order?.id) {
      showError("Không tìm thấy thông tin đơn hàng");
      return;
    }

    try {
      setIsProcessing(true);
      const result = await completeBooking(order.id);

      if (result) {
        showSuccess("Hoàn thành chuyến đi thành công!");

        // Update order status locally
        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: BookingStatus.COMPLETED,
          };
        });

        // Reload booking detail to get updated data
        setTimeout(async () => {
          const updatedBooking = await getBookingByCode(id!);
          if (updatedBooking) {
            setOrder(updatedBooking as any);
          }
        }, 1000);
      } else {
        showError("Không thể hoàn thành chuyến đi. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Complete booking error:", error);
      const errorMessage =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Không thể hoàn thành chuyến đi";
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-8 mt-[50px]">
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
              <Button
                variant="outline"
                onClick={() => handleOpenFeedbackDialog()}
                className="text-blue-600 border-blue-300"
              >
                <Star className="w-4 h-4 mr-2 text-blue-600" />
                Viết đánh giá
              </Button>
              {order.status?.toUpperCase() === "ONGOING" && (
                <Button
                  onClick={handleCompleteBooking}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Hoàn thành chuyến đi
                    </>
                  )}
                </Button>
              )}
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

            {/* Feedbacks Section */}
            <Card className="shadow-sm mt-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Đánh giá của bạn
                </h3>
                <Separator className="mb-4" />

                {feedbackLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Đang tải đánh giá...
                  </div>
                ) : feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Xe:
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < feedback.vehicleRating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Trạm:
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < feedback.stationRating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{feedback.comment}</p>
                            {feedback.isEdit && (
                              <p className="text-xs text-gray-500 mt-1">
                                (Đã chỉnh sửa)
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenFeedbackDialog(feedback)}
                              disabled={isProcessing}
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              disabled={isProcessing}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có đánh giá. Hãy viết đánh giá của bạn!
                  </div>
                )}
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

                    {/* Chi phí cơ bản (basePrice) */}
                    {(order as any).basePrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí thuê xe</span>
                        <span className="font-medium">
                          {formatCurrency((order as any).basePrice)}
                        </span>
                      </div>
                    )}

                    {/* Tiền cọc (depositPaid) */}
                    {(order as any).depositPaid > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiền đặt cọc</span>
                        <span className="font-medium text-blue-600">
                          +{formatCurrency((order as any).depositPaid)}
                        </span>
                      </div>
                    )}

                    {/* Phí phụ thu (extraFee - bao gồm phí trả xe muộn) */}
                    {(order as any).extraFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Phí phụ thu{" "}
                          {(order as any).actualEndTime &&
                          new Date((order as any).actualEndTime) >
                            new Date(
                              (order as any).expectedEndTime ||
                                order.returnTime,
                            )
                            ? "(bao gồm phí trả xe muộn)"
                            : ""}
                        </span>
                        <span className="font-medium text-red-600">
                          +{formatCurrency((order as any).extraFee)}
                        </span>
                      </div>
                    )}

                    {/* Hiển thị chi tiết phí trả xe muộn nếu có */}
                    {(order as any).actualEndTime &&
                      new Date((order as any).actualEndTime) >
                        new Date(
                          (order as any).expectedEndTime || order.returnTime,
                        ) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-red-700 mb-1">
                            ⚠️ Trả xe muộn
                          </p>
                          <p className="text-xs text-red-600">
                            Phí: Giá theo giờ × Số giờ muộn × 1.5
                          </p>
                          {(order as any).vehicle?.hourlyRate && (
                            <p className="text-xs text-red-600 mt-1">
                              ={" "}
                              {formatCurrency(
                                (order as any).vehicle.hourlyRate,
                              )}{" "}
                              × số giờ muộn × 1.5
                            </p>
                          )}
                        </div>
                      )}

                    <Separator />

                    {/* Tổng cộng (totalAmount = basePrice + depositPaid + extraFee) */}
                    <div className="flex justify-between text-base font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">
                        {formatCurrency(
                          (order as any).totalAmount || order.totalPrice || 0,
                        )}
                      </span>
                    </div>

                    {/* Công thức tính toán */}
                    {(order as any).basePrice && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Công thức:</strong>
                        </p>
                        <p className="text-xs text-gray-700 font-mono">
                          = Phí thuê ({formatCurrency((order as any).basePrice)}
                          )
                        </p>
                        {(order as any).depositPaid > 0 && (
                          <p className="text-xs text-gray-700 font-mono">
                            + Tiền cọc (
                            {formatCurrency((order as any).depositPaid)})
                          </p>
                        )}
                        {(order as any).extraFee > 0 && (
                          <p className="text-xs text-gray-700 font-mono">
                            + Phí phụ thu (
                            {formatCurrency((order as any).extraFee)})
                          </p>
                        )}
                        <p className="text-xs font-semibold text-gray-900 mt-1 pt-1 border-t border-gray-300">
                          = {formatCurrency((order as any).totalAmount || 0)}
                        </p>
                      </div>
                    )}

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

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingFeedback ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Vehicle Rating */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Đánh giá xe ({feedbackForm.vehicleRating}/5)
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        vehicleRating: rating,
                      }))
                    }
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= feedbackForm.vehicleRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Station Rating */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Đánh giá trạm ({feedbackForm.stationRating}/5)
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        stationRating: rating,
                      }))
                    }
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= feedbackForm.stationRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nhận xét</Label>
              <textarea
                className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={feedbackForm.comment}
                onChange={(e) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing
                ? "Đang xử lý..."
                : editingFeedback
                  ? "Cập nhật"
                  : "Gửi đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Xác nhận xóa đánh giá
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không
              thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingFeedbackId(null);
              }}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDeleteFeedback}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Đang xóa..." : "Xóa đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
