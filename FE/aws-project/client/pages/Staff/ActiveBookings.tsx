/**
 * Staff Active Bookings Page - Quản lý Đơn đang thuê
 *
 * Chức năng:
 * ✅ Danh sách đơn đang trong quá trình thuê (CONFIRMED, IN_PROGRESS)
 * ✅ Theo dõi thời gian còn lại
 * ✅ Bàn giao xe:
 *    - Checklist trước khi giao (nhiên liệu, vệ sinh, vết xước)
 *    - Chụp ảnh xe 360° trước khi giao
 *    - Xác nhận bàn giao (chữ ký số)
 * ✅ Nhận xe trả:
 *    - Checklist khi nhận xe
 *    - Chụp ảnh xe sau khi trả
 *    - Tính phụ phí (vượt km, trễ hạn, vệ sinh, hư hỏng)
 *    - Xác nhận hoàn thành đơn
 * ✅ Xử lý sự cố:
 *    - Khách báo xe hỏng
 *    - Hỗ trợ khẩn cấp 24/7
 *    - Thay xe khác (nếu cần)
 */

import { useState } from "react";
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
  InputNumber,
  Checkbox,
  Upload,
  message,
  Image,
  Descriptions,
  Timeline,
  Alert,
  Progress,
  Badge,
  Tabs,
  Select,
  Radio,
  Divider,
  Avatar,
} from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CameraOutlined,
  FileTextOutlined,
  DollarOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  CarTwoTone,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { BookingResponse, BookingStatus } from "@/service/types/booking.types";

const { TextArea } = Input;
const { TabPane } = Tabs;

// Extended booking interface for active bookings
interface ActiveBooking extends BookingResponse {
  renter: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    identityNumber: string;
  };
  vehicle: {
    id: string;
    name: string;
    brand: string;
    plateNumber: string;
    type: string;
    imageUrl?: string;
    currentKm: number;
    fuelLevel: number;
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
  timeRemaining: number; // in hours
  isOverdue: boolean;
}

// Checklist item interface
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

// Mock data
const mockActiveBookings: ActiveBooking[] = [
  {
    id: "1",
    bookingCode: "BK2025120010",
    vehicleId: "v1",
    renterId: "r1",
    pickupStationId: "s1",
    returnStationId: "s1",
    pickupTime: "2025-12-02T08:00:00Z",
    returnTime: "2025-12-05T18:00:00Z",
    status: BookingStatus.CONFIRMED,
    totalPrice: 3600000,
    notes: "Khách yêu cầu giao xe lúc 8h sáng",
    createdAt: "2025-11-30T10:00:00Z",
    updatedAt: "2025-12-01T15:00:00Z",
    renter: {
      id: "r1",
      fullName: "Nguyễn Văn Minh",
      email: "nguyenvanminh@gmail.com",
      phoneNumber: "0901234567",
      identityNumber: "001201012345",
    },
    vehicle: {
      id: "v1",
      name: "Tesla Model 3 Long Range",
      brand: "Tesla",
      plateNumber: "30A-12345",
      type: "Điện",
      imageUrl:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
      currentKm: 15000,
      fuelLevel: 95,
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
    timeRemaining: 2,
    isOverdue: false,
  },
  {
    id: "2",
    bookingCode: "BK2025120011",
    vehicleId: "v2",
    renterId: "r2",
    pickupStationId: "s2",
    returnStationId: "s2",
    pickupTime: "2025-11-30T10:00:00Z",
    returnTime: "2025-12-03T18:00:00Z",
    status: BookingStatus.IN_PROGRESS,
    totalPrice: 2850000,
    notes: "",
    createdAt: "2025-11-28T14:00:00Z",
    updatedAt: "2025-11-30T10:30:00Z",
    renter: {
      id: "r2",
      fullName: "Trần Thị Lan",
      email: "tranthilan@gmail.com",
      phoneNumber: "0912345678",
      identityNumber: "002202023456",
    },
    vehicle: {
      id: "v2",
      name: "VinFast VF8 Plus",
      brand: "VinFast",
      plateNumber: "30B-67890",
      type: "Điện",
      imageUrl:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
      currentKm: 8500,
      fuelLevel: 65,
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
    timeRemaining: 30,
    isOverdue: false,
  },
  {
    id: "3",
    bookingCode: "BK2025120008",
    vehicleId: "v3",
    renterId: "r3",
    pickupStationId: "s1",
    returnStationId: "s1",
    pickupTime: "2025-11-28T09:00:00Z",
    returnTime: "2025-12-01T18:00:00Z",
    status: BookingStatus.IN_PROGRESS,
    totalPrice: 2400000,
    notes: "",
    createdAt: "2025-11-26T11:00:00Z",
    updatedAt: "2025-11-28T09:15:00Z",
    renter: {
      id: "r3",
      fullName: "Lê Hoàng Nam",
      email: "lehoangnam@gmail.com",
      phoneNumber: "0923456789",
      identityNumber: "003303034567",
    },
    vehicle: {
      id: "v3",
      name: "Toyota Camry 2024",
      brand: "Toyota",
      plateNumber: "51F-11111",
      type: "Xăng",
      imageUrl:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
      currentKm: 12000,
      fuelLevel: 40,
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
    timeRemaining: -5,
    isOverdue: true,
  },
];

export default function ActiveBookings() {
  const [bookings, setBookings] = useState<ActiveBooking[]>(mockActiveBookings);
  const [selectedBooking, setSelectedBooking] = useState<ActiveBooking | null>(
    null,
  );
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"handover" | "return">("handover");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Checklist templates
  const [handoverChecklist, setHandoverChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Kiểm tra mức nhiên liệu/điện", checked: false },
    { id: "2", label: "Kiểm tra độ sạch sẽ nội thất", checked: false },
    { id: "3", label: "Kiểm tra vết xước ngoại thất", checked: false },
    { id: "4", label: "Kiểm tra lốp xe và áp suất", checked: false },
    { id: "5", label: "Kiểm tra đèn chiếu sáng", checked: false },
    { id: "6", label: "Kiểm tra gương chiếu hậu", checked: false },
    {
      id: "7",
      label: "Kiểm tra thiết bị an toàn (bình cứu hỏa, tam giác)",
      checked: false,
    },
    { id: "8", label: "Kiểm tra giấy tờ xe", checked: false },
  ]);

  const [returnChecklist, setReturnChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Kiểm tra mức nhiên liệu/điện", checked: false },
    { id: "2", label: "Kiểm tra độ sạch sẽ nội thất", checked: false },
    { id: "3", label: "Kiểm tra vết xước mới", checked: false },
    { id: "4", label: "Kiểm tra hư hỏng (nếu có)", checked: false },
    { id: "5", label: "Đếm số km đã đi", checked: false },
    { id: "6", label: "Kiểm tra đồ dùng cá nhân khách quên", checked: false },
  ]);

  // Statistics
  const stats = {
    readyToHandover: bookings.filter(
      (b) => b.status === BookingStatus.CONFIRMED,
    ).length,
    inProgress: bookings.filter((b) => b.status === BookingStatus.IN_PROGRESS)
      .length,
    overdue: bookings.filter((b) => b.isOverdue).length,
    needReturn: bookings.filter(
      (b) => b.status === BookingStatus.IN_PROGRESS && b.timeRemaining < 24,
    ).length,
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

  // Calculate time remaining
  const formatTimeRemaining = (hours: number) => {
    if (hours < 0) {
      return <Tag color="red">Quá hạn {Math.abs(hours)}h</Tag>;
    } else if (hours < 24) {
      return <Tag color="orange">Còn {hours}h</Tag>;
    } else {
      const days = Math.floor(hours / 24);
      return <Tag color="green">Còn {days} ngày</Tag>;
    }
  };

  // Handle handover
  const handleOpenHandover = (booking: ActiveBooking) => {
    setSelectedBooking(booking);
    setModalType("handover");
    setHandoverModalOpen(true);
    setFileList([]);
    form.resetFields();
    setHandoverChecklist((prev) =>
      prev.map((item) => ({ ...item, checked: false, note: "" })),
    );
  };

  // Handle return
  const handleOpenReturn = (booking: ActiveBooking) => {
    setSelectedBooking(booking);
    setModalType("return");
    setReturnModalOpen(true);
    setFileList([]);
    form.resetFields();
    setReturnChecklist((prev) =>
      prev.map((item) => ({ ...item, checked: false, note: "" })),
    );
  };

  // Handle emergency
  const handleOpenEmergency = (booking: ActiveBooking) => {
    setSelectedBooking(booking);
    setEmergencyModalOpen(true);
    form.resetFields();
  };

  // Handle view detail
  const handleViewDetail = (booking: ActiveBooking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  // Submit handover
  const handleSubmitHandover = async (values: any) => {
    if (!selectedBooking) return;

    const uncheckedItems = handoverChecklist.filter((item) => !item.checked);
    if (uncheckedItems.length > 0) {
      message.warning("Vui lòng hoàn thành tất cả các mục kiểm tra!");
      return;
    }

    if (fileList.length < 4) {
      message.warning("Vui lòng chụp ít nhất 4 góc của xe!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to submit handover
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update booking status to IN_PROGRESS
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: BookingStatus.IN_PROGRESS }
            : b,
        ),
      );

      message.success({
        content: `Đã bàn giao xe ${selectedBooking.vehicle.plateNumber} cho khách hàng ${selectedBooking.renter.fullName}`,
        duration: 5,
      });

      setHandoverModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Submit return
  const handleSubmitReturn = async (values: any) => {
    if (!selectedBooking) return;

    const uncheckedItems = returnChecklist.filter((item) => !item.checked);
    if (uncheckedItems.length > 0) {
      message.warning("Vui lòng hoàn thành tất cả các mục kiểm tra!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to submit return
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove from active bookings (status becomes COMPLETED)
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));

      const totalFee =
        (values.lateFee || 0) +
        (values.overKmFee || 0) +
        (values.cleaningFee || 0) +
        (values.damageFee || 0);

      message.success({
        content: (
          <div>
            <div>Đã hoàn tất đơn thuê {selectedBooking.bookingCode}</div>
            {totalFee > 0 && (
              <div className="text-orange-600 mt-1">
                Tổng phụ phí: {formatCurrency(totalFee)}
              </div>
            )}
          </div>
        ),
        duration: 5,
      });

      setReturnModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Submit emergency
  const handleSubmitEmergency = async (values: any) => {
    if (!selectedBooking) return;

    setLoading(true);
    try {
      // TODO: Call API to submit emergency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success({
        content: `Đã gửi yêu cầu hỗ trợ khẩn cấp cho đơn ${selectedBooking.bookingCode}`,
        duration: 5,
      });

      setEmergencyModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle checklist change
  const handleChecklistChange = (
    id: string,
    checked: boolean,
    type: "handover" | "return",
  ) => {
    if (type === "handover") {
      setHandoverChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked } : item)),
      );
    } else {
      setReturnChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked } : item)),
      );
    }
  };

  // Upload props
  const uploadProps = {
    listType: "picture-card" as const,
    fileList: fileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
    beforeUpload: () => false, // Prevent auto upload
    maxCount: 8,
  };

  // Table columns
  const columns: ColumnsType<ActiveBooking> = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      fixed: "left",
      width: 140,
      render: (code: string, record: ActiveBooking) => (
        <div>
          <div className="font-mono font-semibold">{code}</div>
          {record.isOverdue && (
            <Tag color="red" icon={<WarningOutlined />} className="mt-1">
              Quá hạn
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: BookingStatus) => {
        if (status === BookingStatus.CONFIRMED) {
          return (
            <Tag color="blue" icon={<ClockCircleOutlined />}>
              Chờ bàn giao
            </Tag>
          );
        } else {
          return (
            <Tag color="green" icon={<CarOutlined />}>
              Đang thuê
            </Tag>
          );
        }
      },
    },
    {
      title: "Khách hàng",
      key: "renter",
      width: 200,
      render: (_: any, record: ActiveBooking) => (
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
        </div>
      ),
    },
    {
      title: "Xe",
      key: "vehicle",
      width: 220,
      render: (_: any, record: ActiveBooking) => (
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
              {record.vehicle.plateNumber}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ⚡ {record.vehicle.fuelLevel}% • {record.vehicle.currentKm} km
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 200,
      render: (_: any, record: ActiveBooking) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <CalendarOutlined className="text-green-600" />
            <span>{formatDateTime(record.pickupTime)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <CalendarOutlined className="text-orange-600" />
            <span>{formatDateTime(record.returnTime)}</span>
          </div>
          <div className="mt-1">
            {formatTimeRemaining(record.timeRemaining)}
          </div>
        </div>
      ),
    },
    {
      title: "Tiến độ",
      key: "progress",
      width: 150,
      render: (_: any, record: ActiveBooking) => {
        if (record.status === BookingStatus.CONFIRMED) {
          return (
            <div>
              <Progress percent={0} status="normal" size="small" />
              <div className="text-xs text-gray-500 mt-1">Chưa bắt đầu</div>
            </div>
          );
        } else {
          const now = new Date().getTime();
          const start = new Date(record.pickupTime).getTime();
          const end = new Date(record.returnTime).getTime();
          const progress = Math.min(
            100,
            Math.round(((now - start) / (end - start)) * 100),
          );

          return (
            <div>
              <Progress
                percent={progress}
                status={record.isOverdue ? "exception" : "active"}
                size="small"
              />
              <div className="text-xs text-gray-500 mt-1">Đang thuê</div>
            </div>
          );
        }
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: ActiveBooking) => (
        <Space direction="vertical" size="small" className="w-full">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="w-full text-left px-0"
          >
            Xem chi tiết
          </Button>
          {record.status === BookingStatus.CONFIRMED && (
            <Button
              type="primary"
              size="small"
              icon={<CarOutlined />}
              onClick={() => handleOpenHandover(record)}
              className="w-full"
            >
              Bàn giao xe
            </Button>
          )}
          {record.status === BookingStatus.IN_PROGRESS && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleOpenReturn(record)}
                className="w-full"
                style={{ backgroundColor: "#52c41a" }}
              >
                Nhận xe trả
              </Button>
              <Button
                danger
                size="small"
                icon={<ToolOutlined />}
                onClick={() => handleOpenEmergency(record)}
                className="w-full"
              >
                Sự cố
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý đơn đang thuê
        </h1>
        <p className="text-gray-600 mt-2">
          Theo dõi và xử lý các đơn thuê đang trong quá trình thực hiện
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ bàn giao"
              value={stats.readyToHandover}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang thuê"
              value={stats.inProgress}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quá hạn"
              value={stats.overdue}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sắp hết hạn (<24h)"
              value={stats.needReturn}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert */}
      {stats.overdue > 0 && (
        <Alert
          message="Cảnh báo: Có đơn thuê quá hạn"
          description={`Có ${stats.overdue} đơn thuê đã quá thời gian trả xe. Vui lòng liên hệ khách hàng ngay.`}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          closable
        />
      )}

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

      {/* Handover Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CarOutlined className="text-blue-500" />
            <span>Bàn giao xe cho khách hàng</span>
          </div>
        }
        open={handoverModalOpen}
        onCancel={() => setHandoverModalOpen(false)}
        width={900}
        footer={null}
      >
        {selectedBooking && (
          <Form form={form} layout="vertical" onFinish={handleSubmitHandover}>
            <Alert
              message="Quy trình bàn giao xe"
              description={
                <Timeline
                  items={[
                    { children: "1. Kiểm tra xe theo checklist" },
                    { children: "2. Chụp ảnh xe 360° (ít nhất 4 góc)" },
                    { children: "3. Nhập số km và mức nhiên liệu hiện tại" },
                    { children: "4. Xác nhận bàn giao (chữ ký điện tử)" },
                  ]}
                />
              }
              type="info"
              showIcon
              className="mb-4"
            />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin đơn" key="1">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Mã đơn" span={1}>
                    <span className="font-mono font-semibold">
                      {selectedBooking.bookingCode}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Khách hàng" span={1}>
                    {selectedBooking.renter.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Xe" span={2}>
                    {selectedBooking.vehicle.name} (
                    {selectedBooking.vehicle.plateNumber})
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian nhận" span={2}>
                    {formatDateTime(selectedBooking.pickupTime)}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CheckSquareOutlined />
                    Checklist (
                    {handoverChecklist.filter((i) => i.checked).length}/
                    {handoverChecklist.length})
                  </span>
                }
                key="2"
              >
                <div className="space-y-3">
                  {handoverChecklist.map((item) => (
                    <Card key={item.id} size="small">
                      <Checkbox
                        checked={item.checked}
                        onChange={(e) =>
                          handleChecklistChange(
                            item.id,
                            e.target.checked,
                            "handover",
                          )
                        }
                      >
                        <span className="font-medium">{item.label}</span>
                      </Checkbox>
                    </Card>
                  ))}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CameraOutlined />
                    Ảnh xe ({fileList.length}/8)
                  </span>
                }
                key="3"
              >
                <Alert
                  message="Yêu cầu: Chụp ít nhất 4 góc xe (trước, sau, trái, phải)"
                  type="warning"
                  showIcon
                  className="mb-4"
                />
                <Upload {...uploadProps}>
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Chụp ảnh</div>
                  </div>
                </Upload>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Thông số xe
                  </span>
                }
                key="4"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="currentKm"
                      label="Số km hiện tại"
                      rules={[
                        { required: true, message: "Vui lòng nhập số km" },
                      ]}
                      initialValue={selectedBooking.vehicle.currentKm}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) => `${value} km`}
                        parser={(value) => value?.replace(" km", "") as any}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fuelLevel"
                      label={
                        selectedBooking.vehicle.type === "Điện"
                          ? "Mức pin"
                          : "Mức nhiên liệu"
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mức nhiên liệu/pin",
                        },
                      ]}
                      initialValue={selectedBooking.vehicle.fuelLevel}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value?.replace("%", "") as any}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="handoverNotes" label="Ghi chú bàn giao">
                  <TextArea
                    rows={4}
                    placeholder="Ghi chú về tình trạng xe khi bàn giao..."
                  />
                </Form.Item>

                <Form.Item
                  name="digitalSignature"
                  label="Xác nhận bàn giao"
                  rules={[{ required: true, message: "Vui lòng xác nhận" }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="confirmed">
                        ✅ Tôi xác nhận đã bàn giao xe cho khách hàng trong tình
                        trạng tốt
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </TabPane>
            </Tabs>

            <Divider />

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setHandoverModalOpen(false)}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                >
                  Xác nhận bàn giao
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Return Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" />
            <span>Nhận xe trả từ khách hàng</span>
          </div>
        }
        open={returnModalOpen}
        onCancel={() => setReturnModalOpen(false)}
        width={900}
        footer={null}
      >
        {selectedBooking && (
          <Form form={form} layout="vertical" onFinish={handleSubmitReturn}>
            <Alert
              message="Quy trình nhận xe trả"
              description={
                <Timeline
                  items={[
                    { children: "1. Kiểm tra xe theo checklist" },
                    { children: "2. Chụp ảnh xe sau khi trả (ít nhất 4 góc)" },
                    { children: "3. Đếm số km, kiểm tra mức nhiên liệu" },
                    { children: "4. Tính phụ phí (nếu có)" },
                    { children: "5. Xác nhận hoàn thành đơn" },
                  ]}
                />
              }
              type="info"
              showIcon
              className="mb-4"
            />

            {selectedBooking.isOverdue && (
              <Alert
                message="Cảnh báo: Xe trả muộn"
                description={`Khách hàng đã trả xe muộn ${Math.abs(selectedBooking.timeRemaining)} giờ. Phụ phí sẽ được tính tự động.`}
                type="error"
                showIcon
                className="mb-4"
              />
            )}

            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin đơn" key="1">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Mã đơn" span={1}>
                    <span className="font-mono font-semibold">
                      {selectedBooking.bookingCode}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Khách hàng" span={1}>
                    {selectedBooking.renter.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Xe" span={2}>
                    {selectedBooking.vehicle.name} (
                    {selectedBooking.vehicle.plateNumber})
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian trả" span={2}>
                    {formatDateTime(selectedBooking.returnTime)}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CheckSquareOutlined />
                    Checklist ({returnChecklist.filter((i) => i.checked).length}
                    /{returnChecklist.length})
                  </span>
                }
                key="2"
              >
                <div className="space-y-3">
                  {returnChecklist.map((item) => (
                    <Card key={item.id} size="small">
                      <Checkbox
                        checked={item.checked}
                        onChange={(e) =>
                          handleChecklistChange(
                            item.id,
                            e.target.checked,
                            "return",
                          )
                        }
                      >
                        <span className="font-medium">{item.label}</span>
                      </Checkbox>
                    </Card>
                  ))}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CameraOutlined />
                    Ảnh xe ({fileList.length}/8)
                  </span>
                }
                key="3"
              >
                <Alert
                  message="Yêu cầu: Chụp ít nhất 4 góc xe và các vết hư hỏng (nếu có)"
                  type="warning"
                  showIcon
                  className="mb-4"
                />
                <Upload {...uploadProps}>
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Chụp ảnh</div>
                  </div>
                </Upload>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Thông số & phụ phí
                  </span>
                }
                key="4"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="returnKm"
                      label="Số km khi trả"
                      rules={[
                        { required: true, message: "Vui lòng nhập số km" },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={selectedBooking.vehicle.currentKm}
                        formatter={(value) => `${value} km`}
                        parser={(value) => value?.replace(" km", "") as any}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="returnFuelLevel"
                      label={
                        selectedBooking.vehicle.type === "Điện"
                          ? "Mức pin"
                          : "Mức nhiên liệu"
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mức nhiên liệu/pin",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value?.replace("%", "") as any}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Phụ phí (nếu có)</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="lateFee"
                      label="Phí trả xe muộn"
                      initialValue={
                        selectedBooking.isOverdue
                          ? Math.abs(selectedBooking.timeRemaining) * 50000
                          : 0
                      }
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/\$\s?|(,*)/g, "") as any
                        }
                        addonAfter="VNĐ"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="overKmFee"
                      label="Phí vượt km"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/\$\s?|(,*)/g, "") as any
                        }
                        addonAfter="VNĐ"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="cleaningFee"
                      label="Phí vệ sinh"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/\$\s?|(,*)/g, "") as any
                        }
                        addonAfter="VNĐ"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="damageFee"
                      label="Phí hư hỏng"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/\$\s?|(,*)/g, "") as any
                        }
                        addonAfter="VNĐ"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="returnNotes" label="Ghi chú nhận xe">
                  <TextArea
                    rows={4}
                    placeholder="Ghi chú về tình trạng xe khi nhận lại, các phụ phí..."
                  />
                </Form.Item>

                <Form.Item
                  name="returnConfirm"
                  label="Xác nhận hoàn thành"
                  rules={[{ required: true, message: "Vui lòng xác nhận" }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="completed">
                        ✅ Tôi xác nhận đã nhận xe trả và hoàn thành đơn thuê
                        này
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </TabPane>
            </Tabs>

            <Divider />

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setReturnModalOpen(false)}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Hoàn thành đơn
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Emergency Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ToolOutlined className="text-red-500" />
            <span>Hỗ trợ khẩn cấp 24/7</span>
          </div>
        }
        open={emergencyModalOpen}
        onCancel={() => setEmergencyModalOpen(false)}
        width={600}
        footer={null}
      >
        {selectedBooking && (
          <Form form={form} layout="vertical" onFinish={handleSubmitEmergency}>
            <Alert
              message="Đơn thuê đang gặp sự cố"
              description={`Mã đơn: ${selectedBooking.bookingCode} - Xe: ${selectedBooking.vehicle.plateNumber}`}
              type="error"
              showIcon
              className="mb-4"
            />

            <Descriptions column={1} bordered size="small" className="mb-4">
              <Descriptions.Item label="Khách hàng">
                {selectedBooking.renter.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  {selectedBooking.renter.phoneNumber}
                  <Button
                    size="small"
                    type="link"
                    icon={<PhoneOutlined />}
                    onClick={() =>
                      window.open(`tel:${selectedBooking.renter.phoneNumber}`)
                    }
                  >
                    Gọi ngay
                  </Button>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="emergencyType"
              label="Loại sự cố"
              rules={[{ required: true, message: "Vui lòng chọn loại sự cố" }]}
            >
              <Select placeholder="Chọn loại sự cố">
                <Select.Option value="breakdown">🔧 Xe hỏng</Select.Option>
                <Select.Option value="accident">💥 Tai nạn</Select.Option>
                <Select.Option value="flat_tire">🛞 Thủng lốp</Select.Option>
                <Select.Option value="no_fuel">
                  ⛽ Hết nhiên liệu/pin
                </Select.Option>
                <Select.Option value="lost_key">🔑 Mất chìa khóa</Select.Option>
                <Select.Option value="other">❓ Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="emergencyDescription"
              label="Mô tả sự cố"
              rules={[{ required: true, message: "Vui lòng mô tả sự cố" }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết sự cố đang gặp phải..."
              />
            </Form.Item>

            <Form.Item
              name="currentLocation"
              label="Vị trí hiện tại"
              rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
            >
              <Input placeholder="Địa chỉ hoặc tọa độ GPS" />
            </Form.Item>

            <Form.Item
              name="supportAction"
              label="Hành động hỗ trợ"
              rules={[{ required: true, message: "Vui lòng chọn hành động" }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="call_mechanic">🔧 Gọi thợ sửa xe</Radio>
                  <Radio value="call_tow">🚚 Gọi xe cứu hộ</Radio>
                  <Radio value="replace_vehicle">
                    🚗 Thay xe khác cho khách
                  </Radio>
                  <Radio value="guide_customer">
                    📞 Hướng dẫn khách tự xử lý
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setEmergencyModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  loading={loading}
                  icon={<ThunderboltOutlined />}
                >
                  Gửi yêu cầu hỗ trợ
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

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
        ]}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Mã đơn" span={1}>
                <span className="font-mono font-semibold">
                  {selectedBooking.bookingCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                {selectedBooking.status === BookingStatus.CONFIRMED ? (
                  <Tag color="blue">Chờ bàn giao</Tag>
                ) : (
                  <Tag color="green">Đang thuê</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={2}>
                {selectedBooking.renter.fullName} -{" "}
                {selectedBooking.renter.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Xe" span={2}>
                {selectedBooking.vehicle.name} (
                {selectedBooking.vehicle.plateNumber})
              </Descriptions.Item>
              <Descriptions.Item label="Nhận xe" span={2}>
                {formatDateTime(selectedBooking.pickupTime)} tại{" "}
                {selectedBooking.pickupStation.name}
              </Descriptions.Item>
              <Descriptions.Item label="Trả xe" span={2}>
                {formatDateTime(selectedBooking.returnTime)} tại{" "}
                {selectedBooking.returnStation.name}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(selectedBooking.totalPrice)}
                </span>
              </Descriptions.Item>
              {selectedBooking.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedBooking.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedBooking.vehicle.imageUrl && (
              <div>
                <div className="font-semibold mb-2">Ảnh xe:</div>
                <Image
                  src={selectedBooking.vehicle.imageUrl}
                  width="100%"
                  height={200}
                  className="rounded object-cover"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
