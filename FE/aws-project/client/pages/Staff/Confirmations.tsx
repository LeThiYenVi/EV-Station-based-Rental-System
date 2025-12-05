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

  // Use booking hook
  const {
    getAllBookings,
    confirmBooking,
    cancelBooking,
    startBooking,
    completeBooking,
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
          await completeBooking(selectedBooking.id);
          message.success(`Đã hoàn thành đơn ${selectedBooking.bookingCode}`);
          break;
      }

      setConfirmModalOpen(false);
      // Reload bookings để cập nhật trạng thái mới
      loadBookings(pagination.current - 1, pagination.pageSize);
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
      width: 150,
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
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setDetailModalOpen(false);
              selectedBooking &&
                handleOpenConfirmModal(selectedBooking, "reject");
            }}
          >
            Từ chối
          </Button>,
          <Button
            key="confirm"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setDetailModalOpen(false);
              selectedBooking &&
                handleOpenConfirmModal(selectedBooking, "confirm");
            }}
          >
            Xác nhận đơn
          </Button>,
        ]}
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
                <Descriptions.Item label="Người checkout" span={1}>
                  {selectedBooking.checkedOutByName || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Người checkin" span={1}>
                  {selectedBooking.checkedInByName || "Chưa có"}
                </Descriptions.Item>
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
                  <Tag color="orange">Chờ xác nhận</Tag>
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
    </div>
  );
}
