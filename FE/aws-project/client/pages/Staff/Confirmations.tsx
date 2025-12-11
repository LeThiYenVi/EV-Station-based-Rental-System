/**
 * Staff Confirmations Page - Xác nhận Đơn thuê
 *
 * Chức năng:
 * ✅ Danh sách đơn chờ xác nhận (status = PENDING)
 * ✅ Xem thông tin chi tiết:
 *    - Thông tin khách hàng
 *    - CCCD (front + back)
 *    - Thông tin xe yêu cầu
 *    - Thời gian thuê
 *    - Giá tiền
 * ✅ Xác nhận đơn:
 *    - Check xe còn available không
 *    - Xác minh CCCD hợp lệ
 *    - Liên hệ khách hàng (call/SMS)
 *    - Confirm hoặc Reject
 *    - Ghi chú lý do reject
 *
 * Workflow:
 * Customer đặt → Staff review CCCD →
 * Staff gọi khách xác nhận → Staff confirm →
 * Gửi email xác nhận cho khách
 */

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Descriptions,
  Tooltip,
  Avatar,
  Alert,
  Divider,
  Input,
  InputNumber,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CarOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  QrcodeOutlined,
  LinkOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useBooking } from "@/hooks/useBooking";

// Interface khớp với API response thực tế
interface BookingData {
  id: string;
  bookingCode: string;
  renterId: string;
  renterName?: string;
  renterEmail?: string;
  vehicleId: string;
  vehicleName?: string;
  licensePlate?: string;
  stationId?: string;
  stationName?: string;
  // Support both old and new field names
  startTime?: string;
  expectedEndTime?: string;
  pickupTime?: string;
  returnTime?: string;
  actualEndTime?: string | null;
  status: string;
  checkedOutById?: string | null;
  checkedOutByName?: string | null;
  checkedInById?: string | null;
  checkedInByName?: string | null;
  basePrice?: number;
  depositPaid?: number;
  extraFee?: number | null;
  totalAmount?: number;
  totalPrice?: number;
  pickupNote?: string | null;
  returnNote?: string | null;
  notes?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
  // Station names
  pickupStationId?: string;
  pickupStationName?: string;
  returnStationId?: string;
  returnStationName?: string;
  // Momo Payment
  momoPayment?: {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: string;
    payUrl: string;
    deeplink: string;
    qrCodeUrl: string;
  };
}

export default function Confirmations() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null,
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [action, setAction] = useState<
    "confirm" | "reject" | "start" | "complete"
  >("confirm");
  const [loading, setLoading] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(
    null,
  );
  const [completedBookingHistory, setCompletedBookingHistory] = useState<
    BookingData[]
  >([]);
  const [extraFeeModalOpen, setExtraFeeModalOpen] = useState(false);
  const [extraFeeAmount, setExtraFeeAmount] = useState<number | null>(null);
  const [extraFeeForm] = Form.useForm();
  const [payingRemainder, setPayingRemainder] = useState(false);

  // Use booking hook
  const {
    getAllBookings,
    confirmBooking,
    cancelBooking,
    startBooking,
    completeBooking,
    getBookingById,
    payRemainder,
  } = useBooking();

  // Load bookings with pagination
  const loadBookings = async (page = 0, size = 10) => {
    setTableLoading(true);
    try {
      const response = await getAllBookings({
        page,
        size,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });

      if (response) {
        // Hiển thị tất cả các đơn (không filter)
        const allBookings = (response.content || []) as BookingData[];

        setBookings(allBookings);
        setPagination({
          current: page + 1,
          pageSize: size,
          total: response.totalElements || allBookings.length,
        });
      }
    } catch (e) {
      message.error("Không tải được danh sách đơn chờ xác nhận");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(0, 10);
  }, []);

  // Handle table pagination change
  const handleTableChange = (page: number, pageSize: number) => {
    loadBookings(page - 1, pageSize);
  };

  // Helper to get pickup time (support both field names)
  const getPickupTime = (b: BookingData) => b.startTime || b.pickupTime || "";
  const getReturnTime = (b: BookingData) =>
    b.expectedEndTime || b.returnTime || "";
  const getTotalPrice = (b: BookingData) => b.totalAmount || b.totalPrice || 0;
  const getStationName = (b: BookingData) =>
    b.stationName || b.pickupStationName || "N/A";
  const getRenterEmail = (b: BookingData) => b.renterEmail || "";

  // Statistics - đếm theo trạng thái
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    ongoing: bookings.filter((b) => b.status === "ONGOING").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  // Get status tag
  const getStatusTag = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            Chờ xác nhận
          </Tag>
        );
      case "CONFIRMED":
        return (
          <Tag color="blue" icon={<CheckCircleOutlined />}>
            Đã xác nhận
          </Tag>
        );
      case "ONGOING":
        return (
          <Tag color="cyan" icon={<CarOutlined />}>
            Đang thuê
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Hoàn thành
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Đã hủy
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format datetime
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate days
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  // Check if urgent
  const isUrgent = (pickupTime: string) => {
    const pickup = new Date(pickupTime);
    const now = new Date();
    const hoursUntilPickup =
      (pickup.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilPickup < 24 && hoursUntilPickup > 0;
  };

  // View details
  const handleViewDetail = (booking: BookingData) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  // Open action modal
  const handleOpenConfirmModal = (
    booking: BookingData,
    actionType: "confirm" | "reject" | "start" | "complete",
  ) => {
    setSelectedBooking(booking);
    setAction(actionType);
    setConfirmModalOpen(true);
  };

  // Handle action - chỉ cần truyền bookingId
  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    try {
      let result;
      switch (action) {
        case "confirm":
          await confirmBooking(selectedBooking.id);
          message.success(`Đã xác nhận đơn ${selectedBooking.bookingCode}`);
          break;
        case "reject":
          await cancelBooking(selectedBooking.id);
          message.warning(`Đã từ chối đơn ${selectedBooking.bookingCode}`);
          break;
        case "start":
          await startBooking(selectedBooking.id);
          message.success(`Đã bắt đầu đơn thuê ${selectedBooking.bookingCode}`);
          break;
        case "complete":
          // Validate booking status before completing
          if (selectedBooking.status !== "ONGOING") {
            message.error(
              `Chỉ có thể hoàn thành đơn đang thuê. Trạng thái hiện tại: ${selectedBooking.status}`,
            );
            setLoading(false);
            setConfirmModalOpen(false);
            return;
          }

          result = await completeBooking(selectedBooking.id);
          if (result) {
            message.success(`Đã hoàn thành đơn ${selectedBooking.bookingCode}`);

            console.log("=== COMPLETE BOOKING RESULT ===");
            console.log("Complete API response:", result);
            console.log("MoMo Payment from complete API:", result.momoPayment);

            // API complete trả về BookingWithPaymentResponse including momoPayment
            const completedData: BookingData = {
              id: result.id,
              bookingCode: result.bookingCode,
              renterId: result.renterId,
              renterName: result.renterName,
              renterEmail: result.renterEmail,
              vehicleId: result.vehicleId,
              vehicleName: result.vehicleName,
              licensePlate: result.licensePlate,
              stationId: result.stationId,
              stationName: result.stationName,
              startTime: result.startTime,
              expectedEndTime: result.expectedEndTime,
              status: result.status,
              basePrice: result.basePrice,
              depositPaid: result.depositPaid,
              totalAmount: result.totalAmount,
              pickupNote: result.pickupNote,
              paymentStatus: result.paymentStatus,
              createdAt: result.createdAt || new Date().toISOString(),
              momoPayment: result.momoPayment, // MoMo payment data from complete API
            };

            console.log("Completed booking data with MoMo:", completedData);

            // Set completed booking data and show extra fee modal
            setSelectedBooking(completedData);
            setCompletedBooking(completedData);
            setExtraFeeAmount(null);
            extraFeeForm.resetFields();
            setExtraFeeModalOpen(true);

            // Add to history if not already exists
            setCompletedBookingHistory((prev) => {
              const exists = prev.find((b) => b.id === completedData.id);
              if (!exists) {
                return [completedData, ...prev];
              }
              return prev;
            });
          }
          break;
      }

      if (action !== "complete") {
        setConfirmModalOpen(false);
        setDetailModalOpen(false);

        // Reload về trang đầu tiên để thấy thay đổi ngay lập tức
        await loadBookings(0, pagination.pageSize);

        // Reset về page 1
        setPagination((prev) => ({ ...prev, current: 1 }));
      }
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Send email
  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`);
    message.info(`Đang soạn email đến ${email}...`);
  };

  // Handle extra fee - gọi API payRemainder
  const handlePayRemainder = async () => {
    if (!completedBooking || extraFeeAmount === null) {
      message.error("Vui lòng nhập chi phí phát sinh");
      return;
    }

    setPayingRemainder(true);
    try {
      // Gọi API payRemainder để thanh toán phần còn lại
      const paymentResult = await payRemainder(completedBooking.id);
      
      if (paymentResult) {
        message.success("Tạo yêu cầu thanh toán thành công!");
        
        // Cập nhật completed booking với payment info
        const updatedBooking: BookingData = {
          ...completedBooking,
          extraFee: extraFeeAmount,
          momoPayment: paymentResult,
        };
        
        setCompletedBooking(updatedBooking);
        setExtraFeeModalOpen(false);
        
        // Hiển thị invoice modal với thông tin thanh toán mới
        setInvoiceModalOpen(true);
        
        // Reload dữ liệu
        await loadBookings(0, pagination.pageSize);
        setPagination((prev) => ({ ...prev, current: 1 }));
      }
    } catch (error: any) {
      message.error(
        error?.message || "Có lỗi xảy ra khi tạo yêu cầu thanh toán!"
      );
    } finally {
      setPayingRemainder(false);
    }
  };

  // View invoice for completed booking
  const handleViewInvoice = async (booking: BookingData) => {
    console.log("=== VIEW INVOICE DEBUG ===");
    console.log("Original booking data:", booking);
    console.log("MoMo Payment:", booking.momoPayment);

    // Use booking data directly - it already contains all info from table
    // If momoPayment is missing, it means the booking was completed without payment link
    setCompletedBooking(booking);
    setInvoiceModalOpen(true);
  };

  // Table columns - Updated for new API structure
  const columns: ColumnsType<BookingData> = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      fixed: "left",
      width: 180,
      render: (code: string) => (
        <div className="font-mono font-semibold text-blue-600">{code}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      filters: [
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đã xác nhận", value: "CONFIRMED" },
        { text: "Đang thuê", value: "ONGOING" },
        { text: "Hoàn thành", value: "COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Khách hàng",
      key: "renter",
      width: 220,
      render: (_: any, record: BookingData) => (
        <div>
          <div className="flex items-center gap-2">
            <Avatar icon={<UserOutlined />} size="small" />
            <div>
              <div className="font-medium">
                {record.renterName || "Khách hàng"}
              </div>
              <div className="text-xs text-gray-500">
                {getRenterEmail(record)}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Xe thuê",
      key: "vehicle",
      width: 200,
      render: (_: any, record: BookingData) => (
        <div>
          <div className="font-medium">{record.vehicleName || "Xe"}</div>
          <div className="text-xs text-gray-500">
            <CarOutlined className="mr-1" />
            {record.licensePlate || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Trạm",
      key: "station",
      width: 150,
      render: (_: any, record: BookingData) => (
        <div>
          <div className="text-sm">{getStationName(record)}</div>
        </div>
      ),
    },
    {
      title: "Thời gian thuê",
      key: "time",
      width: 200,
      render: (_: any, record: BookingData) => {
        const startTime = getPickupTime(record);
        const endTime = getReturnTime(record);
        const days = calculateDays(startTime, endTime);
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CalendarOutlined />
              <span>{formatDateTime(startTime)}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 mt-1">
              <CalendarOutlined />
              <span>{formatDateTime(endTime)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {days > 0 ? `${days} ngày` : "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 180,
      render: (_: any, record: BookingData) => (
        <div>
          <div className="font-semibold text-green-600">
            {formatCurrency(getTotalPrice(record))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cọc: {formatCurrency(record.depositPaid || 0)}
          </div>
          <Tag
            color={record.paymentStatus === "PENDING" ? "orange" : "green"}
            className="mt-1"
          >
            {record.paymentStatus === "PENDING"
              ? "Chờ thanh toán"
              : "Đã thanh toán"}
          </Tag>
          {record.momoPayment && (
            <div className="mt-1">
              <Tooltip title="Có link thanh toán MoMo">
                <Tag
                  color="purple"
                  icon={<QrcodeOutlined />}
                  className="text-xs"
                >
                  MoMo
                </Tag>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: BookingData) => (
        <Space direction="vertical" size="small" className="w-full">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="w-full text-left px-0"
          >
            Xem chi tiết
          </Button>
          {/* Nút Xác nhận/Từ chối cho đơn PENDING */}
          {record.status === "PENDING" && (
            <Space size="small" className="w-full">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleOpenConfirmModal(record, "confirm")}
              >
                Xác nhận
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleOpenConfirmModal(record, "reject")}
              >
                Từ chối
              </Button>
            </Space>
          )}
          {/* Nút Bắt đầu cho đơn CONFIRMED */}
          {record.status === "CONFIRMED" && (
            <Button
              type="primary"
              size="small"
              icon={<CarOutlined />}
              onClick={() => handleOpenConfirmModal(record, "start")}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Bắt đầu thuê
            </Button>
          )}
          {/* Nút Hoàn thành cho đơn ONGOING */}
          {record.status === "ONGOING" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleOpenConfirmModal(record, "complete")}
              className="bg-green-500 hover:bg-green-600"
            >
              Hoàn thành
            </Button>
          )}
          {/* Nút Xem hóa đơn cho đơn COMPLETED */}
          {record.status === "COMPLETED" && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewInvoice(record)}
              className="text-green-600 border-green-300"
            >
              Xem hóa đơn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn thuê</h1>
        <p className="text-gray-600 mt-2">
          Xem và quản lý tất cả các đơn đặt xe
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng đơn"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={stats.confirmed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang thuê"
              value={stats.ongoing}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={tableLoading}
          scroll={{ x: 1400 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Tổng ${total} đơn`,
            showSizeChanger: true,
            onChange: handleTableChange,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Chi tiết đơn thuê #{selectedBooking?.bookingCode}</span>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={800}
        footer={
          selectedBooking ? (
            <Space className="w-full justify-end">
              <Button onClick={() => setDetailModalOpen(false)}>Đóng</Button>

              {/* PENDING: Xác nhận/Từ chối */}
              {selectedBooking.status === "PENDING" && (
                <>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenConfirmModal(selectedBooking, "reject");
                    }}
                  >
                    Từ chối
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenConfirmModal(selectedBooking, "confirm");
                    }}
                  >
                    Xác nhận đơn
                  </Button>
                </>
              )}

              {/* CONFIRMED: Bắt đầu thuê */}
              {selectedBooking.status === "CONFIRMED" && (
                <Button
                  type="primary"
                  icon={<CarOutlined />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    handleOpenConfirmModal(selectedBooking, "start");
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Bắt đầu thuê
                </Button>
              )}

              {/* ONGOING: Hoàn thành */}
              {selectedBooking.status === "ONGOING" && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    handleOpenConfirmModal(selectedBooking, "complete");
                  }}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Hoàn thành
                </Button>
              )}

              {/* COMPLETED: Xem hóa đơn */}
              {selectedBooking.status === "COMPLETED" && (
                <Button
                  type="default"
                  icon={<FileTextOutlined />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    handleViewInvoice(selectedBooking);
                  }}
                  className="text-green-600 border-green-300"
                >
                  Xem hóa đơn
                </Button>
              )}
            </Space>
          ) : null
        }
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card
              title={
                <>
                  <UserOutlined /> Thông tin khách hàng
                </>
              }
              size="small"
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Họ tên" span={1}>
                  {selectedBooking.renterName || "Khách hàng"}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={1}>
                  <Space>
                    {getRenterEmail(selectedBooking) || "N/A"}
                    {getRenterEmail(selectedBooking) && (
                      <Button
                        size="small"
                        type="link"
                        icon={<MailOutlined />}
                        onClick={() =>
                          handleSendEmail(getRenterEmail(selectedBooking))
                        }
                      >
                        Email
                      </Button>
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Người checkout (Giao xe)" span={1}>
                  <span className="font-semibold text-blue-600">
                    {selectedBooking.checkedOutByName || "Chưa có"}
                  </span>
                </Descriptions.Item>
                {/* <Descriptions.Item label="Người checkin (Nhận xe trả)" span={1}>
                  <span className="font-semibold text-green-600">
                    {selectedBooking.checkedInByName || "Chưa có"}
                  </span>
                </Descriptions.Item> */}
              </Descriptions>
            </Card>

            {/* Vehicle Information */}
            <Card
              title={
                <>
                  <CarOutlined /> Thông tin xe
                </>
              }
              size="small"
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tên xe" span={1}>
                  {selectedBooking.vehicleName || "Xe"}
                </Descriptions.Item>
                <Descriptions.Item label="Biển số" span={1}>
                  <span className="font-mono font-semibold">
                    {selectedBooking.licensePlate || "N/A"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Trạm" span={2}>
                  {getStationName(selectedBooking)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Booking Details */}
            <Card
              title={
                <>
                  <CalendarOutlined /> Chi tiết đặt xe
                </>
              }
              size="small"
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Mã đơn" span={1}>
                  <span className="font-mono font-semibold">
                    {selectedBooking.bookingCode}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={1}>
                  {getStatusTag(selectedBooking.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian bắt đầu" span={1}>
                  <span className="text-green-600 font-medium">
                    {formatDateTime(getPickupTime(selectedBooking))}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc dự kiến" span={1}>
                  <span className="text-orange-600 font-medium">
                    {formatDateTime(getReturnTime(selectedBooking))}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Số ngày thuê" span={1}>
                  {calculateDays(
                    getPickupTime(selectedBooking),
                    getReturnTime(selectedBooking),
                  )}{" "}
                  ngày
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán" span={1}>
                  <Tag
                    color={
                      selectedBooking.paymentStatus === "PENDING"
                        ? "orange"
                        : "green"
                    }
                  >
                    {selectedBooking.paymentStatus === "PENDING"
                      ? "Chờ thanh toán"
                      : "Đã thanh toán"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Giá cơ bản" span={1}>
                  {formatCurrency(selectedBooking.basePrice || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền đặt cọc" span={1}>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(selectedBooking.depositPaid || 0)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Phí phát sinh" span={1}>
                  {selectedBooking.extraFee
                    ? formatCurrency(selectedBooking.extraFee)
                    : "0 ₫"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền" span={1}>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(getTotalPrice(selectedBooking))}
                  </span>
                </Descriptions.Item>
                {(selectedBooking.pickupNote || selectedBooking.notes) && (
                  <Descriptions.Item label="Ghi chú nhận xe" span={2}>
                    {selectedBooking.pickupNote || selectedBooking.notes}
                  </Descriptions.Item>
                )}
                {selectedBooking.returnNote && (
                  <Descriptions.Item label="Ghi chú trả xe" span={2}>
                    {selectedBooking.returnNote}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Thời gian đặt" span={2}>
                  {formatDateTime(selectedBooking.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Momo Payment Information */}
            {selectedBooking.momoPayment && (
              <Card
                title={
                  <>
                    <DollarOutlined /> Thông tin thanh toán MoMo
                  </>
                }
                size="small"
              >
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Mã giao dịch" span={1}>
                    <span className="font-mono text-sm">
                      {selectedBooking.momoPayment.orderId}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Request ID" span={1}>
                    <span className="font-mono text-sm">
                      {selectedBooking.momoPayment.requestId}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền" span={1}>
                    <span className="font-semibold text-lg text-green-600">
                      {formatCurrency(selectedBooking.momoPayment.amount)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái" span={1}>
                    <Tag
                      color={
                        selectedBooking.momoPayment.resultCode === "0"
                          ? "green"
                          : "orange"
                      }
                    >
                      {selectedBooking.momoPayment.message}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Link thanh toán" span={2}>
                    <Space direction="vertical" className="w-full">
                      <Button
                        type="link"
                        icon={<LinkOutlined />}
                        href={selectedBooking.momoPayment.payUrl}
                        target="_blank"
                        className="p-0"
                      >
                        Mở link thanh toán web
                      </Button>
                      <Button
                        type="link"
                        icon={<MobileOutlined />}
                        href={selectedBooking.momoPayment.deeplink}
                        target="_blank"
                        className="p-0"
                      >
                        Mở ứng dụng MoMo
                      </Button>
                      <Button
                        type="link"
                        icon={<QrcodeOutlined />}
                        href={selectedBooking.momoPayment.qrCodeUrl}
                        target="_blank"
                        className="p-0"
                      >
                        Xem mã QR
                      </Button>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal - Cho tất cả các thao tác */}
      <Modal
        title={
          action === "confirm" ? (
            <span className="text-blue-600">
              <CheckCircleOutlined /> Xác nhận đơn thuê
            </span>
          ) : action === "reject" ? (
            <span className="text-red-600">
              <CloseCircleOutlined /> Từ chối đơn thuê
            </span>
          ) : action === "start" ? (
            <span className="text-cyan-600">
              <CarOutlined /> Bắt đầu thuê xe
            </span>
          ) : (
            <span className="text-green-600">
              <CheckCircleOutlined /> Hoàn thành đơn thuê
            </span>
          )
        }
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setConfirmModalOpen(false)}>Hủy</Button>
            <Button
              type="primary"
              danger={action === "reject"}
              onClick={handleConfirmBooking}
              loading={loading}
              icon={
                action === "confirm" ? (
                  <CheckCircleOutlined />
                ) : action === "reject" ? (
                  <CloseCircleOutlined />
                ) : action === "start" ? (
                  <CarOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              className={
                action === "start"
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : action === "complete"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
              }
            >
              {action === "confirm"
                ? "Xác nhận"
                : action === "reject"
                  ? "Từ chối"
                  : action === "start"
                    ? "Bắt đầu"
                    : "Hoàn thành"}
            </Button>
          </Space>
        }
      >
        <Alert
          message={
            action === "confirm"
              ? "Xác nhận đơn thuê này?"
              : action === "reject"
                ? "Từ chối đơn thuê này?"
                : action === "start"
                  ? "Bắt đầu cho thuê xe?"
                  : "Hoàn thành đơn thuê này?"
          }
          description={
            <div className="space-y-2">
              <p>
                <strong>Mã đơn:</strong> {selectedBooking?.bookingCode}
              </p>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedBooking?.renterName || "Khách hàng"}
              </p>
              <p>
                <strong>Xe:</strong> {selectedBooking?.vehicleName || "Xe"} (
                {selectedBooking?.licensePlate || "N/A"})
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {selectedBooking &&
                  formatDateTime(getPickupTime(selectedBooking))}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {selectedBooking &&
                  formatCurrency(getTotalPrice(selectedBooking))}
              </p>
            </div>
          }
          type={
            action === "confirm"
              ? "info"
              : action === "reject"
                ? "warning"
                : action === "start"
                  ? "info"
                  : "success"
          }
          showIcon
        />
      </Modal>

      {/* Invoice Modal - Hiển thị hóa đơn sau khi hoàn thành */}
      <Modal
        title={
          <div className="text-center">
            <CheckCircleOutlined className="text-green-500 text-4xl mb-2" />
          </div>
        }
        open={invoiceModalOpen}
        onCancel={() => {
          setInvoiceModalOpen(false);
          setCompletedBooking(null);
        }}
        width={1400}
        footer={[
          <Button
            key="print"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => window.print()}
          >
            In hóa đơn
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setInvoiceModalOpen(false);
              setCompletedBooking(null);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        {completedBooking && (
          <div className="space-y-4 p-4">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold">HÓA ĐƠN THUÊ XE</h2>
              <p className="text-gray-600 mt-1">
                Mã đơn:{" "}
                <span className="font-mono font-semibold">
                  {completedBooking.bookingCode}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Ngày hoàn thành: {formatDateTime(new Date().toISOString())}
              </p>
            </div>

            {/* Main Content - Conditional Layout based on momoPayment */}
            <Row gutter={24}>
              {/* Left Column - Booking Information */}
              <Col span={completedBooking.momoPayment ? 8 : 24}>
                {/* Customer & Vehicle Info */}
                <Row gutter={16}>
                  <Col span={completedBooking.momoPayment ? 24 : 12}>
                    <Card
                      size="small"
                      title="Thông tin khách hàng"
                      className="mb-4"
                    >
                      <div className="space-y-2">
                        <p>
                          <strong>Họ tên:</strong>{" "}
                          {completedBooking.renterName || "Khách hàng"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {getRenterEmail(completedBooking)}
                        </p>
                        <p>
                          <strong>ID khách hàng:</strong>{" "}
                          <span className="font-mono text-xs">
                            {completedBooking.renterId || "N/A"}
                          </span>
                        </p>
                      </div>
                    </Card>
                  </Col>
                  <Col span={completedBooking.momoPayment ? 24 : 12}>
                    <Card size="small" title="Thông tin xe" className="mb-4">
                      <div className="space-y-2">
                        <p>
                          <strong>Xe:</strong>{" "}
                          {completedBooking.vehicleName || "Xe"}
                        </p>
                        <p>
                          <strong>Biển số:</strong>{" "}
                          <span className="font-mono">
                            {completedBooking.licensePlate || "N/A"}
                          </span>
                        </p>
                        <p>
                          <strong>ID xe:</strong>{" "}
                          <span className="font-mono text-xs">
                            {completedBooking.vehicleId || "N/A"}
                          </span>
                        </p>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Staff Info & Station Info */}
                <Row gutter={16}>
                  <Col span={completedBooking.momoPayment ? 24 : 12}>
                    <Card
                      size="small"
                      title="Thông tin nhân viên xử lý"
                      className="mb-4"
                    >
                      <div className="space-y-3">
                        <div>
                          <strong>Người checkout (Giao xe):</strong>{" "}
                          <span className="text-blue-600 font-semibold">
                            {completedBooking.checkedOutByName || "Chưa có"}
                          </span>
                          {completedBooking.checkedOutById && (
                            <p className="text-xs text-gray-500 font-mono">
                              ID: {completedBooking.checkedOutById}
                            </p>
                          )}
                        </div>
                        <div>
                          <strong>Người checkin (Nhận xe trả):</strong>{" "}
                          <span className="text-green-600 font-semibold">
                            {completedBooking.checkedInByName || "Chưa có"}
                          </span>
                          {completedBooking.checkedInById && (
                            <p className="text-xs text-gray-500 font-mono">
                              ID: {completedBooking.checkedInById}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col span={completedBooking.momoPayment ? 24 : 12}>
                    <Card size="small" title="Thông tin trạm" className="mb-4">
                      <div className="space-y-2">
                        <div>
                          <strong>Tên trạm:</strong>{" "}
                          {completedBooking.stationName ||
                            getStationName(completedBooking)}
                          {completedBooking.stationId && (
                            <p className="text-xs text-gray-500 font-mono">
                              ID: {completedBooking.stationId}
                            </p>
                          )}
                        </div>
                        {completedBooking.pickupStationName && (
                          <div>
                            <strong>Trạm nhận/trả:</strong>{" "}
                            {completedBooking.pickupStationName}
                            {completedBooking.pickupStationId && (
                              <p className="text-xs text-gray-500 font-mono">
                                ID: {completedBooking.pickupStationId}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Rental Period */}
                <Card size="small" title="Thời gian thuê" className="mb-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-600">
                        <CalendarOutlined className="mr-2" />
                        <strong>Bắt đầu (startTime):</strong>
                      </p>
                      <p className="ml-6">
                        {formatDateTime(getPickupTime(completedBooking))}
                      </p>
                      {completedBooking.startTime && (
                        <p className="text-xs text-gray-500 ml-6">
                          Raw: {completedBooking.startTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-orange-600">
                        <CalendarOutlined className="mr-2" />
                        <strong>Kết thúc dự kiến (expectedEndTime):</strong>
                      </p>
                      <p className="ml-6">
                        {formatDateTime(getReturnTime(completedBooking))}
                      </p>
                      {completedBooking.expectedEndTime && (
                        <p className="text-xs text-gray-500 ml-6">
                          Raw: {completedBooking.expectedEndTime}
                        </p>
                      )}
                    </div>
                    {completedBooking.actualEndTime && (
                      <div className="pt-3 border-t">
                        <p className="text-blue-600">
                          <CalendarOutlined className="mr-2" />
                          <strong>Kết thúc thực tế (actualEndTime):</strong>
                        </p>
                        <p className="ml-6">
                          {formatDateTime(completedBooking.actualEndTime)}
                        </p>
                        <p className="text-xs text-gray-500 ml-6">
                          Raw: {completedBooking.actualEndTime}
                        </p>
                      </div>
                    )}
                    <div className="pt-3 border-t">
                      <p className="text-gray-600">
                        <strong>Tổng thời gian:</strong>{" "}
                        {calculateDays(
                          getPickupTime(completedBooking),
                          completedBooking.actualEndTime ||
                            getReturnTime(completedBooking),
                        )}{" "}
                        ngày
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Ngày tạo (createdAt):</strong>{" "}
                        {formatDateTime(completedBooking.createdAt)}
                      </p>
                      {completedBooking.updatedAt && (
                        <p className="text-xs text-gray-500">
                          <strong>Ngày cập nhật (updatedAt):</strong>{" "}
                          {formatDateTime(completedBooking.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Notes */}
                {(completedBooking.returnNote ||
                  completedBooking.pickupNote) && (
                  <Card size="small" title="Ghi chú">
                    {completedBooking.pickupNote && (
                      <p className="text-sm">
                        <strong>Nhận xe:</strong> {completedBooking.pickupNote}
                      </p>
                    )}
                    {completedBooking.returnNote && (
                      <p className="text-sm mt-1">
                        <strong>Trả xe:</strong> {completedBooking.returnNote}
                      </p>
                    )}
                  </Card>
                )}
              </Col>

              {/* Right Column - MoMo Payment (only show when momoPayment exists) */}
              {completedBooking.momoPayment && (
                <Col span={16}>
                  <Card size="small" title="Thanh toán MoMo">
                    <Space direction="vertical" className="w-full" size="small">
                      {/* <div>
                        <strong>Số tiền (amount):</strong>{" "}
                        <span className="font-semibold text-green-600 text-lg">
                          {formatCurrency(completedBooking.momoPayment.amount)}
                        </span>
                      </div> */}
                      {/* <div>
                        <strong>Mã giao dịch (orderId):</strong>{" "}
                        <span className="font-mono text-sm">
                          {completedBooking.momoPayment.orderId}
                        </span>
                      </div> */}
                      {/* <div>
                        <strong>Request ID (requestId):</strong>{" "}
                        <span className="font-mono text-xs text-gray-600">
                          {completedBooking.momoPayment.requestId}
                        </span>
                      </div>
                      <div>
                        <strong>Partner Code (partnerCode):</strong>{" "}
                        <span className="font-mono text-sm">
                          {completedBooking.momoPayment.partnerCode || "N/A"}
                        </span>
                      </div>
                      <div>
                        <strong>Trạng thái (resultCode):</strong>{" "}
                        <Tag
                          color={
                            completedBooking.momoPayment.resultCode === "0"
                              ? "green"
                              : "orange"
                          }
                        >
                          {completedBooking.momoPayment.message}
                        </Tag>
                        <span className="ml-2 text-xs text-gray-500">
                          Code: {completedBooking.momoPayment.resultCode}
                        </span>
                      </div>
                      <div>
                        <strong>Thông điệp (message):</strong>{" "}
                        <span className="text-sm">
                          {completedBooking.momoPayment.message}
                        </span>
                      </div>
                      <div>
                        <strong>Response Time (responseTime):</strong>{" "}
                        <span className="text-sm font-mono">
                          {completedBooking.momoPayment.responseTime || "N/A"}
                        </span>
                      </div> */}
                      <Divider className="my-2" />
                      {/* <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          <strong>Pay URL (payUrl):</strong>
                          <p className="break-all ml-2">
                            {completedBooking.momoPayment.payUrl}
                          </p>
                        </div>
                        <div>
                          <strong>Deep Link (deeplink):</strong>
                          <p className="break-all ml-2">
                            {completedBooking.momoPayment.deeplink}
                          </p>
                        </div>
                        <div>
                          <strong>QR Code URL (qrCodeUrl):</strong>
                          <p className="break-all ml-2">
                            {completedBooking.momoPayment.qrCodeUrl || "N/A"}
                          </p>
                        </div>
                      </div> */}
                      <Divider className="my-2" />
                      {/* <Space direction="vertical" className="w-full">
                        <Button
                          type="primary"
                          icon={<LinkOutlined />}
                          href={completedBooking.momoPayment.payUrl}
                          target="_blank"
                          block
                          size="small"
                        >
                          Mở link thanh toán web
                        </Button>
                        <Button
                          icon={<MobileOutlined />}
                          href={completedBooking.momoPayment.deeplink}
                          target="_blank"
                          block
                          size="small"
                        >
                          Mở ứng dụng MoMo
                        </Button>
                      </Space> */}
                    </Space>

                    {/* Payment Page from payUrl */}
                    <div className="mt-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-3">
                        <div className="text-base font-semibold text-purple-700 flex items-center justify-center gap-2">
                          <LinkOutlined className="text-xl" />
                          <span>Trang thanh toán MoMo</span>
                        </div>
                      </div>
                      <div className="border-2 border-purple-200 rounded-lg bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <iframe
                          src={completedBooking.momoPayment.payUrl}
                          className="w-full h-[600px]"
                          title="MoMo Payment Page"
                          sandbox="allow-same-origin allow-scripts allow-forms"
                          onError={(e) => {
                            const target = e.target as HTMLIFrameElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <Button
                          type="link"
                          icon={<LinkOutlined />}
                          href={completedBooking.momoPayment.payUrl}
                          target="_blank"
                          className="text-purple-600"
                        >
                          Mở trang thanh toán trong tab mới
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              )}
            </Row>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
              <p>
                Nhân viên xử lý:{" "}
                {completedBooking.checkedInByName || "Hệ thống"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Extra Fee Modal - Nhập chi phí phát sinh */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <DollarOutlined className="text-orange-500" />
            <span>Chi phí phát sinh</span>
          </div>
        }
        open={extraFeeModalOpen}
        onCancel={() => {
          setExtraFeeModalOpen(false);
          setCompletedBooking(null);
          setExtraFeeAmount(null);
          extraFeeForm.resetFields();
        }}
        footer={
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setExtraFeeModalOpen(false);
                setCompletedBooking(null);
                setExtraFeeAmount(null);
                extraFeeForm.resetFields();
              }}
            >
              Bỏ qua
            </Button>
            <Button
              type="primary"
              loading={payingRemainder}
              onClick={handlePayRemainder}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Xác nhận và thanh toán
            </Button>
          </Space>
        }
      >
        {completedBooking && (
          <Form
            form={extraFeeForm}
            layout="vertical"
            onValuesChange={(changedValues) => {
              if (changedValues.extraFee !== undefined) {
                setExtraFeeAmount(changedValues.extraFee);
              }
            }}
          >
            <Card className="mb-4">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Mã đơn">
                  <span className="font-mono font-semibold">
                    {completedBooking.bookingCode}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {completedBooking.renterName || "Khách hàng"}
                </Descriptions.Item>
                <Descriptions.Item label="Xe">
                  {completedBooking.vehicleName} ({completedBooking.licensePlate})
                </Descriptions.Item>
                <Descriptions.Item label="Giá cơ bản">
                  <span className="font-semibold">
                    {formatCurrency(completedBooking.basePrice || 0)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Tiền đặt cọc">
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(completedBooking.depositPaid || 0)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng cần thanh toán">
                  <span className="font-bold text-lg text-green-600">
                    {formatCurrency(
                      (completedBooking.totalAmount || 0) - (completedBooking.depositPaid || 0)
                    )}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              message="Nhập chi phí phát sinh (nếu có)"
              description="Chi phí này sẽ được thêm vào tổng số tiền thanh toán. Nếu không có chi phí phát sinh, để trống hoặc nhập 0"
              type="info"
              showIcon
              className="mb-4"
            />

            <Form.Item
              name="extraFee"
              label={
                <span className="font-semibold text-orange-600">
                  Chi phí phát sinh (VND)
                </span>
              }
              rules={[
                {
                  pattern: /^\d+$/,
                  message: "Vui lòng nhập số tiền hợp lệ",
                },
              ]}
              initialValue={0}
            >
              <InputNumber
                min={0}
                step={10000}
                placeholder="Nhập chi phí phát sinh..."
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => parseInt(value?.replace(/,/g, "") || "0") as any}
              />
            </Form.Item>

            {extraFeeAmount && extraFeeAmount > 0 && (
              <Card className="bg-orange-50 border-orange-200">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Chi phí phát sinh:</strong>{" "}
                    <span className="text-orange-600 font-semibold">
                      {formatCurrency(extraFeeAmount)}
                    </span>
                  </p>
                  <p className="text-sm border-t pt-2">
                    <strong>Tổng thanh toán:</strong>{" "}
                    <span className="text-green-600 font-bold text-lg">
                      {formatCurrency(
                        (completedBooking.totalAmount || 0) -
                          (completedBooking.depositPaid || 0) +
                          extraFeeAmount
                      )}
                    </span>
                  </p>
                </div>
              </Card>
            )}
          </Form>
        )}
      </Modal>
    </div>
  );
}
