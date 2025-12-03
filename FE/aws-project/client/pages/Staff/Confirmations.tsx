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
  Form,
  Input,
  Radio,
  message,
  Image,
  Descriptions,
  Badge,
  Popconfirm,
  Tooltip,
  Avatar,
  Timeline,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PhoneOutlined,
  MessageOutlined,
  CarOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BookingResponse } from "@/service/types/booking.types";
import { BookingStatus } from "@/service/types/enums";
import bookingService from "@/service/booking/bookingService";
import staffService from "@/service/staff/staffService";

const { TextArea } = Input;

// Mock data - TODO: Replace with API
interface PendingBooking extends BookingResponse {
  renter: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    identityNumber: string;
    licenseNumber: string;
    identityCardFront?: string;
    identityCardBack?: string;
    isVerified: boolean;
  };
  vehicle: {
    id: string;
    name: string;
    brand: string;
    plateNumber: string;
    type: string;
    status: "available" | "rented" | "maintenance";
    imageUrl?: string;
    pricePerDay: number;
    depositAmount: number;
  };
  pickupStation: {
    id: string;
    name: string;
    address: string;
  };
  returnStation: {
    id: string;
    name: string;
    address: string;
  };
}

const mockPendingBookings: PendingBooking[] = [
  {
    id: "1",
    bookingCode: "BK2025120001",
    vehicleId: "v1",
    renterId: "r1",
    pickupStationId: "s1",
    returnStationId: "s1",
    pickupTime: "2025-12-05T08:00:00Z",
    returnTime: "2025-12-08T18:00:00Z",
    status: BookingStatus.PENDING,
    totalPrice: 3600000,
    notes: "Cần xe gấp để đi công tác",
    createdAt: "2025-12-02T10:30:00Z",
    updatedAt: "2025-12-02T10:30:00Z",
    renter: {
      id: "r1",
      fullName: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      phoneNumber: "0901234567",
      identityNumber: "001201012345",
      licenseNumber: "B2-123456789",
      identityCardFront:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      identityCardBack:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      isVerified: false,
    },
    vehicle: {
      id: "v1",
      name: "Tesla Model 3 Long Range",
      brand: "Tesla",
      plateNumber: "30A-12345",
      type: "Điện",
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
      pricePerDay: 1200000,
      depositAmount: 10000000,
    },
    pickupStation: {
      id: "s1",
      name: "Trạm Quận 1 - Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    returnStation: {
      id: "s1",
      name: "Trạm Quận 1 - Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
  },
  {
    id: "2",
    bookingCode: "BK2025120002",
    vehicleId: "v2",
    renterId: "r2",
    pickupStationId: "s2",
    returnStationId: "s2",
    pickupTime: "2025-12-06T09:00:00Z",
    returnTime: "2025-12-10T17:00:00Z",
    status: BookingStatus.PENDING,
    totalPrice: 4800000,
    notes: "",
    createdAt: "2025-12-02T11:15:00Z",
    updatedAt: "2025-12-02T11:15:00Z",
    renter: {
      id: "r2",
      fullName: "Trần Thị Bình",
      email: "tranthib@gmail.com",
      phoneNumber: "0912345678",
      identityNumber: "002202023456",
      licenseNumber: "B2-987654321",
      identityCardFront:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      identityCardBack:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      isVerified: true,
    },
    vehicle: {
      id: "v2",
      name: "VinFast VF8 Plus",
      brand: "VinFast",
      plateNumber: "30B-67890",
      type: "Điện",
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
      pricePerDay: 950000,
      depositAmount: 8000000,
    },
    pickupStation: {
      id: "s2",
      name: "Trạm Quận 7 - Phú Mỹ Hưng",
      address: "456 Nguyễn Lương Bằng, Quận 7, TP.HCM",
    },
    returnStation: {
      id: "s2",
      name: "Trạm Quận 7 - Phú Mỹ Hưng",
      address: "456 Nguyễn Lương Bằng, Quận 7, TP.HCM",
    },
  },
  {
    id: "3",
    bookingCode: "BK2025120003",
    vehicleId: "v3",
    renterId: "r3",
    pickupStationId: "s1",
    returnStationId: "s1",
    pickupTime: "2025-12-04T10:00:00Z",
    returnTime: "2025-12-06T18:00:00Z",
    status: BookingStatus.PENDING,
    totalPrice: 1600000,
    notes: "Lần đầu thuê xe điện",
    createdAt: "2025-12-02T09:00:00Z",
    updatedAt: "2025-12-02T09:00:00Z",
    renter: {
      id: "r3",
      fullName: "Lê Văn Cường",
      email: "levanc@gmail.com",
      phoneNumber: "0923456789",
      identityNumber: "003303034567",
      licenseNumber: "B2-111222333",
      identityCardFront:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      identityCardBack:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
      isVerified: false,
    },
    vehicle: {
      id: "v3",
      name: "Toyota Camry 2024",
      brand: "Toyota",
      plateNumber: "51F-11111",
      type: "Xăng",
      status: "maintenance",
      imageUrl:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
      pricePerDay: 800000,
      depositAmount: 5000000,
    },
    pickupStation: {
      id: "s1",
      name: "Trạm Quận 1 - Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    returnStation: {
      id: "s1",
      name: "Trạm Quận 1 - Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
  },
];

export default function Confirmations() {
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const staffId = "staff-uuid-placeholder"; // TODO: replace with authenticated staff id

  useEffect(() => {
    const loadPending = async () => {
      try {
        const list = await bookingService.getBookingsByStatus(
          BookingStatus.PENDING,
        );
        // Map minimal BookingResponse to PendingBooking-like shape (fallback to mock fields if missing)
        const mapped: PendingBooking[] = list.map((b: any) => ({
          id: b.id,
          bookingCode: b.bookingCode,
          vehicleId: b.vehicleId,
          renterId: b.renterId,
          pickupStationId: b.pickupStationId,
          returnStationId: b.returnStationId,
          pickupTime: b.pickupTime,
          returnTime: b.returnTime,
          status: b.status,
          totalPrice: b.totalPrice,
          notes: b.notes,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          renter: {
            id: b.renter?.id || b.renterId,
            fullName: b.renter?.fullName || "Khách hàng",
            email: b.renter?.email || "",
            phoneNumber: b.renter?.phoneNumber || "",
            identityNumber: b.renter?.identityNumber || "",
            licenseNumber: b.renter?.licenseNumber || "",
            identityCardFront: b.renter?.licenseCardFrontImageUrl,
            identityCardBack: b.renter?.licenseCardBackImageUrl,
            isVerified: !!b.renter?.isLicenseVerified,
          },
          vehicle: {
            id: b.vehicle?.id || b.vehicleId,
            name: b.vehicle?.name || "Xe",
            brand: b.vehicle?.brand || "",
            plateNumber: b.vehicle?.licensePlate || "",
            type: b.vehicle?.fuelType || "",
            status: (b.vehicle?.status || "available").toString().toLowerCase(),
            imageUrl: b.vehicle?.imageUrl,
            pricePerDay: b.vehicle?.pricePerDay || 0,
            depositAmount: b.depositAmount || 0,
          },
          pickupStation: {
            id: b.station?.id || b.pickupStationId,
            name: b.station?.name || "Trạm",
            address: b.station?.address || "",
          },
          returnStation: {
            id: b.returnStation?.id || b.returnStationId,
            name: b.returnStation?.name || "Trạm",
            address: b.returnStation?.address || "",
          },
        }));
        setBookings(mapped);
      } catch (e) {
        message.error("Không tải được danh sách đơn chờ xác nhận");
        setBookings(mockPendingBookings);
      }
    };
    loadPending();
  }, []);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(
    null,
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [action, setAction] = useState<"confirm" | "reject">("confirm");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Statistics
  const stats = {
    total: bookings.length,
    needVerification: bookings.filter((b) => !b.renter.isVerified).length,
    vehicleUnavailable: bookings.filter((b) => b.vehicle.status !== "available")
      .length,
    urgent: bookings.filter((b) => {
      const pickupTime = new Date(b.pickupTime);
      const now = new Date();
      const hoursUntilPickup =
        (pickupTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilPickup < 24;
    }).length,
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
  const handleViewDetail = (booking: PendingBooking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  // Open confirm/reject modal
  const handleOpenConfirmModal = (
    booking: PendingBooking,
    actionType: "confirm" | "reject",
  ) => {
    setSelectedBooking(booking);
    setAction(actionType);
    setConfirmModalOpen(true);
    form.resetFields();
  };

  // Handle confirmation
  const handleConfirmBooking = async (values: any) => {
    if (!selectedBooking) return;

    setLoading(true);
    try {
      if (action === "confirm") {
        await staffService.confirmBookingAsStaff(selectedBooking.id, staffId);
        // Update booking status to CONFIRMED
        setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
        message.success({
          content: `Đã xác nhận đơn ${selectedBooking.bookingCode}. Email xác nhận đã được gửi cho khách hàng.`,
          duration: 5,
        });
      } else {
        await bookingService.cancelBooking(selectedBooking.id);
        setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
        message.warning({
          content: `Đã từ chối đơn ${selectedBooking.bookingCode}. Email thông báo đã được gửi cho khách hàng.`,
          duration: 5,
        });
      }

      setConfirmModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Call customer
  const handleCallCustomer = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
    message.info(`Đang gọi ${phoneNumber}...`);
  };

  // Send SMS
  const handleSendSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`);
    message.info(`Đang soạn tin nhắn đến ${phoneNumber}...`);
  };

  // Send email
  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`);
    message.info(`Đang soạn email đến ${email}...`);
  };

  // Table columns
  const columns: ColumnsType<PendingBooking> = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      fixed: "left",
      width: 150,
      render: (code: string, record: PendingBooking) => (
        <div>
          <div className="font-mono font-semibold">{code}</div>
          {isUrgent(record.pickupTime) && (
            <Tag color="red" icon={<ClockCircleOutlined />} className="mt-1">
              Gấp
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Khách hàng",
      key: "renter",
      width: 220,
      render: (_: any, record: PendingBooking) => (
        <div>
          <div className="flex items-center gap-2">
            <Avatar icon={<UserOutlined />} size="small" />
            <div>
              <div className="font-medium">{record.renter.fullName}</div>
              <div className="text-xs text-gray-500">
                {record.renter.phoneNumber}
              </div>
            </div>
          </div>
          <div className="mt-1">
            {record.renter.isVerified ? (
              <Tag color="green" icon={<SafetyCertificateOutlined />}>
                Đã xác thực
              </Tag>
            ) : (
              <Tag color="orange" icon={<WarningOutlined />}>
                Chưa xác thực
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Xe thuê",
      key: "vehicle",
      width: 250,
      render: (_: any, record: PendingBooking) => (
        <div className="flex gap-3">
          {record.vehicle.imageUrl && (
            <Image
              src={record.vehicle.imageUrl}
              width={60}
              height={45}
              className="rounded object-cover"
              preview={false}
            />
          )}
          <div>
            <div className="font-medium">{record.vehicle.name}</div>
            <div className="text-xs text-gray-500">
              {record.vehicle.plateNumber} • {record.vehicle.type}
            </div>
            <div className="mt-1">
              {record.vehicle.status === "available" ? (
                <Tag color="green">Sẵn sàng</Tag>
              ) : record.vehicle.status === "rented" ? (
                <Tag color="orange">Đang thuê</Tag>
              ) : (
                <Tag color="red">Bảo trì</Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian thuê",
      key: "time",
      width: 200,
      render: (_: any, record: PendingBooking) => {
        const days = calculateDays(record.pickupTime, record.returnTime);
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CalendarOutlined />
              <span>{formatDateTime(record.pickupTime)}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 mt-1">
              <CalendarOutlined />
              <span>{formatDateTime(record.returnTime)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{days} ngày</div>
          </div>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      render: (price: number, record: PendingBooking) => (
        <div>
          <div className="font-semibold text-green-600">
            {formatCurrency(price)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cọc: {formatCurrency(record.vehicle.depositAmount)}
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: PendingBooking) => (
        <Space direction="vertical" size="small" className="w-full">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="w-full text-left px-0"
          >
            Xem chi tiết
          </Button>
          <Space size="small" className="w-full">
            <Tooltip title="Gọi điện">
              <Button
                size="small"
                icon={<PhoneOutlined />}
                onClick={() => handleCallCustomer(record.renter.phoneNumber)}
              />
            </Tooltip>
            <Tooltip title="Gửi SMS">
              <Button
                size="small"
                icon={<MessageOutlined />}
                onClick={() => handleSendSMS(record.renter.phoneNumber)}
              />
            </Tooltip>
            <Tooltip title="Gửi Email">
              <Button
                size="small"
                icon={<MailOutlined />}
                onClick={() => handleSendEmail(record.renter.email)}
              />
            </Tooltip>
          </Space>
          <Space size="small" className="w-full">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleOpenConfirmModal(record, "confirm")}
              disabled={record.vehicle.status !== "available"}
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
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Xác nhận đơn thuê</h1>
        <p className="text-gray-600 mt-2">
          Kiểm tra và xác nhận các đơn đặt xe từ khách hàng
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn chờ"
              value={stats.total}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cần xác thực"
              value={stats.needVerification}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Xe không khả dụng"
              value={stats.vehicleUnavailable}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn gấp (<24h)"
              value={stats.urgent}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert for important notes */}
      <Alert
        message="Lưu ý quan trọng"
        description={
          <ul className="list-disc pl-5 space-y-1">
            <li>Kiểm tra kỹ CCCD và GPLX của khách hàng trước khi xác nhận</li>
            <li>Gọi điện xác nhận thông tin với khách hàng</li>
            <li>Đảm bảo xe có sẵn trước khi xác nhận đơn</li>
            <li>Ưu tiên xử lý các đơn gấp (thời gian nhận xe {"<"} 24h)</li>
          </ul>
        }
        type="info"
        showIcon
        closable
      />

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} đơn`,
            showSizeChanger: true,
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
        width={1000}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="call"
            icon={<PhoneOutlined />}
            onClick={() =>
              selectedBooking &&
              handleCallCustomer(selectedBooking.renter.phoneNumber)
            }
          >
            Gọi khách hàng
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
            disabled={selectedBooking?.vehicle.status !== "available"}
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
            {/* Vehicle Status Warning */}
            {selectedBooking.vehicle.status !== "available" && (
              <Alert
                message="Cảnh báo: Xe không khả dụng"
                description={`Xe ${selectedBooking.vehicle.plateNumber} đang ở trạng thái "${selectedBooking.vehicle.status === "rented" ? "Đang thuê" : "Bảo trì"}". Bạn cần từ chối đơn này hoặc liên hệ khách hàng để chọn xe khác.`}
                type="error"
                showIcon
              />
            )}

            {/* Not Verified Warning */}
            {!selectedBooking.renter.isVerified && (
              <Alert
                message="Chưa xác thực"
                description="Khách hàng chưa được xác thực. Vui lòng kiểm tra kỹ CCCD và GPLX trước khi xác nhận."
                type="warning"
                showIcon
              />
            )}

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
                  {selectedBooking.renter.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={1}>
                  {selectedBooking.renter.isVerified ? (
                    <Tag color="green" icon={<SafetyCertificateOutlined />}>
                      Đã xác thực
                    </Tag>
                  ) : (
                    <Tag color="orange" icon={<WarningOutlined />}>
                      Chưa xác thực
                    </Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={1}>
                  <Space>
                    {selectedBooking.renter.phoneNumber}
                    <Button
                      size="small"
                      type="link"
                      icon={<PhoneOutlined />}
                      onClick={() =>
                        handleCallCustomer(selectedBooking.renter.phoneNumber)
                      }
                    >
                      Gọi
                    </Button>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={1}>
                  <Space>
                    {selectedBooking.renter.email}
                    <Button
                      size="small"
                      type="link"
                      icon={<MailOutlined />}
                      onClick={() =>
                        handleSendEmail(selectedBooking.renter.email)
                      }
                    >
                      Email
                    </Button>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="CCCD/CMND" span={1}>
                  {selectedBooking.renter.identityNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Số GPLX" span={1}>
                  {selectedBooking.renter.licenseNumber}
                </Descriptions.Item>
              </Descriptions>

              {/* Identity Card Images */}
              <div className="mt-4">
                <div className="font-semibold mb-2">
                  <IdcardOutlined /> Ảnh CCCD/CMND:
                </div>
                <Space size="large">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mặt trước</div>
                    <Image
                      src={selectedBooking.renter.identityCardFront}
                      width={200}
                      height={130}
                      className="rounded border"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mặt sau</div>
                    <Image
                      src={selectedBooking.renter.identityCardBack}
                      width={200}
                      height={130}
                      className="rounded border"
                    />
                  </div>
                </Space>
              </div>
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
              <div className="flex gap-4">
                {selectedBooking.vehicle.imageUrl && (
                  <Image
                    src={selectedBooking.vehicle.imageUrl}
                    width={200}
                    height={150}
                    className="rounded border object-cover"
                  />
                )}
                <div className="flex-1">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="Tên xe" span={2}>
                      {selectedBooking.vehicle.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Biển số" span={1}>
                      <span className="font-mono font-semibold">
                        {selectedBooking.vehicle.plateNumber}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại xe" span={1}>
                      {selectedBooking.vehicle.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hãng" span={1}>
                      {selectedBooking.vehicle.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={1}>
                      {selectedBooking.vehicle.status === "available" ? (
                        <Tag color="green">Sẵn sàng</Tag>
                      ) : selectedBooking.vehicle.status === "rented" ? (
                        <Tag color="orange">Đang thuê</Tag>
                      ) : (
                        <Tag color="red">Bảo trì</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá thuê/ngày" span={1}>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(selectedBooking.vehicle.pricePerDay)}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiền đặt cọc" span={1}>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(selectedBooking.vehicle.depositAmount)}
                      </span>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
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
                <Descriptions.Item label="Thời gian nhận xe" span={2}>
                  <span className="text-green-600 font-medium">
                    {formatDateTime(selectedBooking.pickupTime)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian trả xe" span={2}>
                  <span className="text-orange-600 font-medium">
                    {formatDateTime(selectedBooking.returnTime)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Số ngày thuê" span={1}>
                  {calculateDays(
                    selectedBooking.pickupTime,
                    selectedBooking.returnTime,
                  )}{" "}
                  ngày
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền" span={1}>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedBooking.totalPrice)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Trạm nhận xe" span={2}>
                  <div>
                    <div className="font-medium">
                      {selectedBooking.pickupStation.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedBooking.pickupStation.address}
                    </div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Trạm trả xe" span={2}>
                  <div>
                    <div className="font-medium">
                      {selectedBooking.returnStation.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedBooking.returnStation.address}
                    </div>
                  </div>
                </Descriptions.Item>
                {selectedBooking.notes && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {selectedBooking.notes}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Thời gian đặt" span={2}>
                  {formatDateTime(selectedBooking.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Workflow Timeline */}
            <Card
              title={
                <>
                  <FileTextOutlined /> Quy trình xác nhận
                </>
              }
              size="small"
            >
              <Timeline
                items={[
                  {
                    color: "green",
                    children: (
                      <div>
                        <div className="font-medium">✅ Khách hàng đặt xe</div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(selectedBooking.createdAt)}
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "blue",
                    children: (
                      <div>
                        <div className="font-medium">
                          👀 Staff kiểm tra CCCD & GPLX
                        </div>
                        <div className="text-xs text-gray-500">
                          Đang thực hiện...
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "gray",
                    children: (
                      <div>
                        <div className="font-medium">
                          📞 Staff gọi khách xác nhận
                        </div>
                        <div className="text-xs text-gray-500">
                          Chưa thực hiện
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "gray",
                    children: (
                      <div>
                        <div className="font-medium">✅ Staff xác nhận đơn</div>
                        <div className="text-xs text-gray-500">
                          Chờ xác nhận
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "gray",
                    children: (
                      <div>
                        <div className="font-medium">
                          📧 Gửi email xác nhận cho khách
                        </div>
                        <div className="text-xs text-gray-500">
                          Tự động sau khi xác nhận
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* Confirm/Reject Modal */}
      <Modal
        title={
          action === "confirm" ? (
            <span className="text-green-600">
              <CheckCircleOutlined /> Xác nhận đơn thuê
            </span>
          ) : (
            <span className="text-red-600">
              <CloseCircleOutlined /> Từ chối đơn thuê
            </span>
          )
        }
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleConfirmBooking}>
          <Alert
            message={
              action === "confirm"
                ? "Xác nhận đơn thuê này?"
                : "Từ chối đơn thuê này?"
            }
            description={
              action === "confirm" ? (
                <div className="space-y-2">
                  <p>Đơn thuê #{selectedBooking?.bookingCode}</p>
                  <p>• Khách hàng: {selectedBooking?.renter.fullName}</p>
                  <p>
                    • Xe: {selectedBooking?.vehicle.name} (
                    {selectedBooking?.vehicle.plateNumber})
                  </p>
                  <p>
                    • Thời gian:{" "}
                    {selectedBooking &&
                      formatDateTime(selectedBooking.pickupTime)}
                  </p>
                  <p className="text-orange-600 font-medium mt-2">
                    ⚠️ Sau khi xác nhận, email sẽ được tự động gửi cho khách
                    hàng.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>Đơn thuê #{selectedBooking?.bookingCode}</p>
                  <p>• Khách hàng: {selectedBooking?.renter.fullName}</p>
                  <p className="text-red-600 font-medium mt-2">
                    ⚠️ Vui lòng ghi rõ lý do từ chối để thông báo cho khách
                    hàng.
                  </p>
                </div>
              )
            }
            type={action === "confirm" ? "info" : "warning"}
            showIcon
            className="mb-4"
          />

          {action === "confirm" && (
            <Form.Item
              name="verificationStatus"
              label="Kết quả xác minh"
              rules={[
                { required: true, message: "Vui lòng chọn kết quả xác minh" },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="verified">
                    ✅ CCCD & GPLX hợp lệ, đã xác minh
                  </Radio>
                  <Radio value="called">
                    📞 Đã gọi điện xác nhận với khách hàng
                  </Radio>
                  <Radio value="vehicle_ready">
                    🚗 Xe sẵn sàng, tình trạng tốt
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item
            name="notes"
            label={action === "confirm" ? "Ghi chú xác nhận" : "Lý do từ chối"}
            rules={[
              {
                required: action === "reject",
                message: "Vui lòng nhập lý do từ chối",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={
                action === "confirm"
                  ? "Ghi chú thêm về đơn thuê này (không bắt buộc)..."
                  : "Nhập lý do từ chối (bắt buộc). VD: Xe không khả dụng, khách hàng không xác thực được, CCCD không hợp lệ..."
              }
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setConfirmModalOpen(false)}>Hủy</Button>
              <Button
                type={action === "confirm" ? "primary" : "default"}
                danger={action === "reject"}
                htmlType="submit"
                loading={loading}
                icon={
                  action === "confirm" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
              >
                {action === "confirm" ? "Xác nhận đơn" : "Từ chối đơn"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
