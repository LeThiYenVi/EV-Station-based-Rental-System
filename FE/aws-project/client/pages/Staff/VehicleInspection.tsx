/**
 * Staff Vehicle Inspection Page - Kiểm tra & Bảo trì Xe
 *
 * Chức năng:
 * ✅ Danh sách xe cần kiểm tra
 * ✅ Checklist kiểm tra định kỳ:
 *    - Động cơ
 *    - Phanh
 *    - Lốp
 *    - Đèn
 *    - Pin EV (nếu là xe điện)
 *    - Nội thất
 *    - Vệ sinh
 * ✅ Báo cáo tình trạng:
 *    - Tốt → Available
 *    - Cần bảo trì nhỏ → Schedule maintenance
 *    - Hỏng nặng → Out of service
 * ✅ Lịch sử bảo trì:
 *    - Xem lịch sử sửa chữa
 *    - Chi phí bảo trì
 *    - Đơn vị sửa chữa
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
  Select,
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
  Radio,
  Divider,
  Avatar,
  Rate,
  DatePicker,
} from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  FileTextOutlined,
  CameraOutlined,
  HistoryOutlined,
  DollarOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  DashboardOutlined,
  HomeOutlined,
  //CleaningOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

// Vehicle status enum
type VehicleStatus = "available" | "rented" | "maintenance" | "out_of_service";

// Inspection status enum
type InspectionStatus = "good" | "minor_issue" | "major_issue";

// Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  plateNumber: string;
  type: "Điện" | "Xăng" | "Hybrid";
  status: VehicleStatus;
  imageUrl?: string;
  currentKm: number;
  lastInspection: string;
  nextInspection: string;
  daysSinceInspection: number;
  batteryHealth?: number; // For electric vehicles
  fuelLevel?: number;
  stationName: string;
}

// Inspection checklist item
interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  status: InspectionStatus;
  note?: string;
}

// Maintenance history item
interface MaintenanceHistory {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  serviceProvider: string;
  staffName: string;
  nextScheduled?: string;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Tesla Model 3 Long Range",
    brand: "Tesla",
    plateNumber: "30A-12345",
    type: "Điện",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
    currentKm: 15000,
    lastInspection: "2025-11-15T10:00:00Z",
    nextInspection: "2025-12-15T10:00:00Z",
    daysSinceInspection: 17,
    batteryHealth: 95,
    fuelLevel: 85,
    stationName: "Trạm Quận 1 - Nguyễn Huệ",
  },
  {
    id: "v2",
    name: "VinFast VF8 Plus",
    brand: "VinFast",
    plateNumber: "30B-67890",
    type: "Điện",
    status: "rented",
    imageUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
    currentKm: 8500,
    lastInspection: "2025-11-20T14:00:00Z",
    nextInspection: "2025-12-20T14:00:00Z",
    daysSinceInspection: 12,
    batteryHealth: 98,
    fuelLevel: 70,
    stationName: "Trạm Quận 7 - Phú Mỹ Hưng",
  },
  {
    id: "v3",
    name: "Toyota Camry 2024",
    brand: "Toyota",
    plateNumber: "51F-11111",
    type: "Xăng",
    status: "maintenance",
    imageUrl:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
    currentKm: 25000,
    lastInspection: "2025-10-01T09:00:00Z",
    nextInspection: "2025-11-01T09:00:00Z",
    daysSinceInspection: 62,
    fuelLevel: 40,
    stationName: "Trạm Quận 1 - Nguyễn Huệ",
  },
  {
    id: "v4",
    name: "Mazda CX-5 2024",
    brand: "Mazda",
    plateNumber: "29H-22222",
    type: "Xăng",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500",
    currentKm: 18000,
    lastInspection: "2025-11-25T11:00:00Z",
    nextInspection: "2025-12-25T11:00:00Z",
    daysSinceInspection: 7,
    fuelLevel: 90,
    stationName: "Trạm Quận 7 - Phú Mỹ Hưng",
  },
  {
    id: "v5",
    name: "Hyundai Ioniq 5",
    brand: "Hyundai",
    plateNumber: "51G-33333",
    type: "Điện",
    status: "out_of_service",
    imageUrl:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500",
    currentKm: 12000,
    lastInspection: "2025-11-28T15:00:00Z",
    nextInspection: "2025-12-28T15:00:00Z",
    daysSinceInspection: 4,
    batteryHealth: 75,
    fuelLevel: 30,
    stationName: "Trạm Quận 1 - Nguyễn Huệ",
  },
];

const mockMaintenanceHistory: Record<string, MaintenanceHistory[]> = {
  v1: [
    {
      id: "m1",
      date: "2025-11-15T10:00:00Z",
      type: "Bảo trì định kỳ",
      description: "Kiểm tra hệ thống điện, thay lốp trước phải",
      cost: 2500000,
      serviceProvider: "Tesla Service Center",
      staffName: "Nguyễn Văn A",
      nextScheduled: "2025-12-15T10:00:00Z",
    },
    {
      id: "m2",
      date: "2025-10-10T14:00:00Z",
      type: "Sửa chữa",
      description: "Thay pin 12V, cập nhật phần mềm",
      cost: 1800000,
      serviceProvider: "Tesla Service Center",
      staffName: "Trần Thị B",
    },
  ],
  v3: [
    {
      id: "m3",
      date: "2025-10-01T09:00:00Z",
      type: "Bảo trì định kỳ",
      description: "Thay dầu động cơ, kiểm tra phanh",
      cost: 1500000,
      serviceProvider: "Toyota Authorized Service",
      staffName: "Lê Văn C",
      nextScheduled: "2025-11-01T09:00:00Z",
    },
    {
      id: "m4",
      date: "2025-11-30T10:00:00Z",
      type: "Sửa chữa khẩn cấp",
      description: "Sửa hộp số, thay má phanh",
      cost: 8500000,
      serviceProvider: "Toyota Authorized Service",
      staffName: "Nguyễn Văn A",
      nextScheduled: "2025-12-30T10:00:00Z",
    },
  ],
  v5: [
    {
      id: "m5",
      date: "2025-11-28T15:00:00Z",
      type: "Sửa chữa lớn",
      description: "Thay pin động cơ điện",
      cost: 15000000,
      serviceProvider: "Hyundai Service Center",
      staffName: "Phạm Thị D",
      nextScheduled: "2026-01-28T15:00:00Z",
    },
  ],
};

export default function VehicleInspection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Inspection checklist
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      category: "engine",
      label: "Động cơ/Motor điện",
      status: "good",
    },
    { id: "2", category: "brake", label: "Hệ thống phanh", status: "good" },
    { id: "3", category: "tire", label: "Lốp xe và áp suất", status: "good" },
    { id: "4", category: "light", label: "Hệ thống đèn", status: "good" },
    { id: "5", category: "battery", label: "Pin/Ắc quy", status: "good" },
    { id: "6", category: "interior", label: "Nội thất", status: "good" },
    {
      id: "7",
      category: "cleaning",
      label: "Vệ sinh tổng thể",
      status: "good",
    },
  ]);

  // Statistics
  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    needInspection: vehicles.filter((v) => v.daysSinceInspection > 30).length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    outOfService: vehicles.filter((v) => v.status === "out_of_service").length,
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

  // Get status badge
  const getStatusBadge = (status: VehicleStatus) => {
    const statusConfig = {
      available: {
        label: "Sẵn sàng",
        color: "green",
        icon: <CheckCircleOutlined />,
      },
      rented: { label: "Đang thuê", color: "blue", icon: <CarOutlined /> },
      maintenance: {
        label: "Bảo trì",
        color: "orange",
        icon: <ToolOutlined />,
      },
      out_of_service: {
        label: "Ngừng hoạt động",
        color: "red",
        icon: <CloseCircleOutlined />,
      },
    };
    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.label}
      </Tag>
    );
  };

  // Get inspection status badge
  const getInspectionStatusBadge = (status: InspectionStatus) => {
    const statusConfig = {
      good: { label: "Tốt", color: "green" },
      minor_issue: { label: "Vấn đề nhỏ", color: "orange" },
      major_issue: { label: "Vấn đề nghiêm trọng", color: "red" },
    };
    return (
      <Tag color={statusConfig[status].color}>{statusConfig[status].label}</Tag>
    );
  };

  // Open inspection modal
  const handleOpenInspection = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setInspectionModalOpen(true);
    setFileList([]);
    form.resetFields();
    setChecklist((prev) =>
      prev.map((item) => ({ ...item, status: "good", note: "" })),
    );
  };

  // Open history modal
  const handleOpenHistory = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setHistoryModalOpen(true);
  };

  // Open detail modal
  const handleViewDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailModalOpen(true);
  };

  // Handle checklist change
  const handleChecklistChange = (id: string, status: InspectionStatus) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  // Submit inspection
  const handleSubmitInspection = async (values: any) => {
    if (!selectedVehicle) return;

    const hasIssues = checklist.some((item) => item.status !== "good");
    const hasMajorIssues = checklist.some(
      (item) => item.status === "major_issue",
    );

    setLoading(true);
    try {
      // TODO: Call API to submit inspection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update vehicle status based on inspection result
      let newStatus: VehicleStatus = "available";
      if (hasMajorIssues) {
        newStatus = "out_of_service";
      } else if (hasIssues) {
        newStatus = "maintenance";
      }

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === selectedVehicle.id
            ? {
                ...v,
                status: newStatus,
                lastInspection: new Date().toISOString(),
                nextInspection: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                daysSinceInspection: 0,
              }
            : v,
        ),
      );

      message.success({
        content: (
          <div>
            <div>Đã hoàn tất kiểm tra xe {selectedVehicle.plateNumber}</div>
            <div className="mt-1">
              Trạng thái mới:{" "}
              {newStatus === "available"
                ? "✅ Sẵn sàng"
                : newStatus === "maintenance"
                  ? "⚠️ Cần bảo trì"
                  : "❌ Ngừng hoạt động"}
            </div>
          </div>
        ),
        duration: 5,
      });

      setInspectionModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Upload props
  const uploadProps = {
    listType: "picture-card" as const,
    fileList: fileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
    beforeUpload: () => false,
    maxCount: 10,
  };

  // Table columns
  const columns: ColumnsType<Vehicle> = [
    {
      title: "Xe",
      key: "vehicle",
      fixed: "left",
      width: 280,
      render: (_: any, record: Vehicle) => (
        <div className="flex gap-3">
          {record.imageUrl && (
            <Image
              src={record.imageUrl}
              width={80}
              height={60}
              className="rounded object-cover"
              preview={false}
            />
          )}
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-mono font-semibold">
                {record.plateNumber}
              </span>
              <span className="mx-2">•</span>
              <span>{record.type}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <ShopOutlined /> {record.stationName}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: VehicleStatus) => getStatusBadge(status),
    },
    {
      title: "Thông số",
      key: "stats",
      width: 200,
      render: (_: any, record: Vehicle) => (
        <div className="text-sm space-y-1">
          <div>
            <DashboardOutlined /> {record.currentKm.toLocaleString()} km
          </div>
          {record.type === "Điện" && record.batteryHealth && (
            <div>
              <ThunderboltOutlined /> Pin: {record.batteryHealth}%
              <Progress
                percent={record.batteryHealth}
                size="small"
                status={record.batteryHealth > 80 ? "success" : "exception"}
                showInfo={false}
                className="ml-2 w-20"
              />
            </div>
          )}
          {record.fuelLevel && (
            <div>
              {record.type === "Điện" ? "⚡" : "⛽"} {record.fuelLevel}%
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Kiểm tra lần cuối",
      key: "inspection",
      width: 200,
      render: (_: any, record: Vehicle) => (
        <div className="text-sm">
          <div>{formatDateTime(record.lastInspection)}</div>
          <div className="mt-1">
            {record.daysSinceInspection > 30 ? (
              <Tag color="red" icon={<WarningOutlined />}>
                {record.daysSinceInspection} ngày trước
              </Tag>
            ) : record.daysSinceInspection > 20 ? (
              <Tag color="orange">{record.daysSinceInspection} ngày trước</Tag>
            ) : (
              <Tag color="green">{record.daysSinceInspection} ngày trước</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Kiểm tra tiếp theo",
      dataIndex: "nextInspection",
      key: "nextInspection",
      width: 180,
      render: (date: string) => (
        <div className="text-sm">
          <CalendarOutlined /> {formatDateTime(date)}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_: any, record: Vehicle) => (
        <Space direction="vertical" size="small" className="w-full">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="w-full text-left px-0"
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckSquareOutlined />}
            onClick={() => handleOpenInspection(record)}
            className="w-full"
            disabled={record.status === "rented"}
          >
            Kiểm tra xe
          </Button>
          <Button
            type="default"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => handleOpenHistory(record)}
            className="w-full"
          >
            Lịch sử bảo trì
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Kiểm tra & Bảo trì Xe
        </h1>
        <p className="text-gray-600 mt-2">
          Quản lý việc kiểm tra định kỳ và bảo trì các phương tiện
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số xe"
              value={stats.total}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sẵn sàng"
              value={stats.available}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cần kiểm tra"
              value={stats.needInspection}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang bảo trì"
              value={stats.maintenance + stats.outOfService}
              prefix={<ToolOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert */}
      {stats.needInspection > 0 && (
        <Alert
          message="Cảnh báo: Có xe cần kiểm tra định kỳ"
          description={`Có ${stats.needInspection} xe đã quá 30 ngày kể từ lần kiểm tra cuối. Vui lòng kiểm tra ngay.`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          closable
        />
      )}

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={vehicles}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} xe`,
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* Inspection Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckSquareOutlined className="text-blue-500" />
            <span>Kiểm tra xe định kỳ</span>
          </div>
        }
        open={inspectionModalOpen}
        onCancel={() => setInspectionModalOpen(false)}
        width={900}
        footer={null}
      >
        {selectedVehicle && (
          <Form form={form} layout="vertical" onFinish={handleSubmitInspection}>
            <Alert
              message="Quy trình kiểm tra xe"
              description={
                <div className="space-y-1">
                  <div>1. Kiểm tra từng hạng mục theo checklist</div>
                  <div>2. Chụp ảnh các vấn đề phát hiện (nếu có)</div>
                  <div>3. Nhập ghi chú chi tiết</div>
                  <div>4. Đánh giá tổng thể và xác định trạng thái xe</div>
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin xe" key="1">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Xe" span={2}>
                    {selectedVehicle.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Biển số" span={1}>
                    <span className="font-mono font-semibold">
                      {selectedVehicle.plateNumber}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại xe" span={1}>
                    {selectedVehicle.type}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số km" span={1}>
                    {selectedVehicle.currentKm.toLocaleString()} km
                  </Descriptions.Item>
                  <Descriptions.Item label="Kiểm tra lần cuối" span={1}>
                    {formatDateTime(selectedVehicle.lastInspection)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái hiện tại" span={2}>
                    {getStatusBadge(selectedVehicle.status)}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CheckSquareOutlined />
                    Checklist kiểm tra
                  </span>
                }
                key="2"
              >
                <div className="space-y-4">
                  {checklist.map((item) => (
                    <Card key={item.id} size="small">
                      <Row gutter={16} align="middle">
                        <Col span={8}>
                          <div className="font-medium flex items-center gap-2">
                            {item.category === "engine" && (
                              <DashboardOutlined />
                            )}
                            {item.category === "brake" && (
                              <SafetyCertificateOutlined />
                            )}
                            {item.category === "tire" && <CarOutlined />}
                            {item.category === "light" && <BulbOutlined />}
                            {item.category === "battery" && (
                              <ThunderboltOutlined />
                            )}
                            {item.category === "interior" && <HomeOutlined />}
                            {item.category === "cleaning" && (
                              <CleaningOutlined />
                            )}
                            {item.label}
                          </div>
                        </Col>
                        <Col span={8}>
                          <Radio.Group
                            value={item.status}
                            onChange={(e) =>
                              handleChecklistChange(item.id, e.target.value)
                            }
                          >
                            <Radio value="good">
                              <CheckCircleOutlined className="text-green-600" />{" "}
                              Tốt
                            </Radio>
                            <Radio value="minor_issue">
                              <WarningOutlined className="text-orange-500" />{" "}
                              Vấn đề nhỏ
                            </Radio>
                            <Radio value="major_issue">
                              <CloseCircleOutlined className="text-red-600" />{" "}
                              Nghiêm trọng
                            </Radio>
                          </Radio.Group>
                        </Col>
                        <Col span={8}>
                          {item.status !== "good" && (
                            <Input
                              placeholder="Ghi chú chi tiết..."
                              size="small"
                              onChange={(e) => {
                                setChecklist((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id
                                      ? { ...i, note: e.target.value }
                                      : i,
                                  ),
                                );
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CameraOutlined />
                    Ảnh kiểm tra ({fileList.length}/10)
                  </span>
                }
                key="3"
              >
                <Alert
                  message="Chụp ảnh các vấn đề phát hiện được (nếu có)"
                  type="info"
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
                    Báo cáo
                  </span>
                }
                key="4"
              >
                <Form.Item
                  name="nextInspectionKm"
                  label="Số km kiểm tra tiếp theo"
                  rules={[{ required: true, message: "Vui lòng nhập số km" }]}
                  initialValue={selectedVehicle.currentKm + 5000}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={selectedVehicle.currentKm}
                    formatter={(value) =>
                      `${value} km`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value
                        ?.replace(/\$\s?|(,*)/g, "")
                        .replace(" km", "") as any
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="overallStatus"
                  label="Đánh giá tổng thể"
                  rules={[
                    { required: true, message: "Vui lòng chọn đánh giá" },
                  ]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="available">
                        <CheckCircleOutlined className="text-green-600" /> ✅
                        Tốt - Xe sẵn sàng hoạt động (Available)
                      </Radio>
                      <Radio value="maintenance">
                        <WarningOutlined className="text-orange-500" /> ⚠️ Cần
                        bảo trì nhỏ - Lên lịch bảo trì (Schedule Maintenance)
                      </Radio>
                      <Radio value="out_of_service">
                        <CloseCircleOutlined className="text-red-600" /> ❌ Hỏng
                        nặng - Ngừng hoạt động (Out of Service)
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="inspectionNotes"
                  label="Ghi chú kiểm tra"
                  rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Ghi chú chi tiết về tình trạng xe, các vấn đề phát hiện, khuyến nghị xử lý..."
                  />
                </Form.Item>

                <Form.Item
                  name="inspectorName"
                  label="Người kiểm tra"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  initialValue="Staff User"
                >
                  <Input placeholder="Họ tên người kiểm tra" />
                </Form.Item>
              </TabPane>
            </Tabs>

            <Divider />

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setInspectionModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                >
                  Hoàn tất kiểm tra
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Maintenance History Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-blue-500" />
            <span>Lịch sử bảo trì - {selectedVehicle?.plateNumber}</span>
          </div>
        }
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setHistoryModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedVehicle && (
          <div className="space-y-4">
            {/* Summary */}
            <Card size="small" className="bg-blue-50">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Tổng chi phí bảo trì"
                    value={
                      mockMaintenanceHistory[selectedVehicle.id]?.reduce(
                        (sum, item) => sum + item.cost,
                        0,
                      ) || 0
                    }
                    formatter={(value) => formatCurrency(value as number)}
                    valueStyle={{ color: "#ff4d4f", fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Số lần bảo trì"
                    value={
                      mockMaintenanceHistory[selectedVehicle.id]?.length || 0
                    }
                    valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Bảo trì tiếp theo"
                    value={
                      mockMaintenanceHistory[selectedVehicle.id]?.[0]
                        ?.nextScheduled
                        ? new Date(
                            mockMaintenanceHistory[
                              selectedVehicle.id
                            ][0].nextScheduled,
                          ).toLocaleDateString("vi-VN")
                        : "Chưa xác định"
                    }
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Timeline */}
            {mockMaintenanceHistory[selectedVehicle.id] &&
            mockMaintenanceHistory[selectedVehicle.id].length > 0 ? (
              <Timeline
                mode="left"
                items={mockMaintenanceHistory[selectedVehicle.id].map(
                  (history) => ({
                    label: formatDateTime(history.date),
                    children: (
                      <Card size="small" className="shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-base">
                                {history.type === "Bảo trì định kỳ" && (
                                  <CheckCircleOutlined className="text-green-600" />
                                )}
                                {history.type === "Sửa chữa" && (
                                  <ToolOutlined className="text-orange-500" />
                                )}
                                {history.type === "Sửa chữa khẩn cấp" && (
                                  <ExclamationCircleOutlined className="text-red-600" />
                                )}
                                {history.type === "Sửa chữa lớn" && (
                                  <WarningOutlined className="text-red-600" />
                                )}{" "}
                                {history.type}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {history.description}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">
                                {formatCurrency(history.cost)}
                              </div>
                            </div>
                          </div>

                          <Divider className="my-2" />

                          <Row gutter={16}>
                            <Col span={12}>
                              <div className="text-xs text-gray-500">
                                <ShopOutlined /> Đơn vị:{" "}
                                {history.serviceProvider}
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="text-xs text-gray-500">
                                <UserOutlined /> Người phụ trách:{" "}
                                {history.staffName}
                              </div>
                            </Col>
                          </Row>

                          {history.nextScheduled && (
                            <Alert
                              message={`Bảo trì tiếp theo: ${formatDateTime(history.nextScheduled)}`}
                              type="info"
                              showIcon
                              icon={<CalendarOutlined />}
                              className="mt-2"
                            />
                          )}
                        </div>
                      </Card>
                    ),
                    color:
                      history.type.includes("khẩn cấp") ||
                      history.type.includes("lớn")
                        ? "red"
                        : history.type.includes("Sửa chữa")
                          ? "orange"
                          : "green",
                  }),
                )}
              />
            ) : (
              <div className="text-center py-12">
                <HistoryOutlined className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có lịch sử bảo trì</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CarOutlined />
            <span>Chi tiết xe - {selectedVehicle?.plateNumber}</span>
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
        {selectedVehicle && (
          <div className="space-y-4">
            {selectedVehicle.imageUrl && (
              <Image
                src={selectedVehicle.imageUrl}
                width="100%"
                height={250}
                className="rounded object-cover"
              />
            )}

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên xe" span={2}>
                {selectedVehicle.name}
              </Descriptions.Item>
              <Descriptions.Item label="Hãng" span={1}>
                {selectedVehicle.brand}
              </Descriptions.Item>
              <Descriptions.Item label="Biển số" span={1}>
                <span className="font-mono font-semibold">
                  {selectedVehicle.plateNumber}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Loại xe" span={1}>
                {selectedVehicle.type}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                {getStatusBadge(selectedVehicle.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Số km" span={1}>
                {selectedVehicle.currentKm.toLocaleString()} km
              </Descriptions.Item>
              <Descriptions.Item label="Mức nhiên liệu/Pin" span={1}>
                {selectedVehicle.fuelLevel}%
                <Progress
                  percent={selectedVehicle.fuelLevel}
                  size="small"
                  className="ml-2 w-24"
                />
              </Descriptions.Item>
              {selectedVehicle.type === "Điện" &&
                selectedVehicle.batteryHealth && (
                  <>
                    <Descriptions.Item label="Sức khỏe pin" span={2}>
                      {selectedVehicle.batteryHealth}%
                      <Progress
                        percent={selectedVehicle.batteryHealth}
                        size="small"
                        status={
                          selectedVehicle.batteryHealth > 80
                            ? "success"
                            : "exception"
                        }
                        className="ml-2 w-48"
                      />
                    </Descriptions.Item>
                  </>
                )}
              <Descriptions.Item label="Trạm" span={2}>
                {selectedVehicle.stationName}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểm tra lần cuối" span={1}>
                {formatDateTime(selectedVehicle.lastInspection)}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểm tra tiếp theo" span={1}>
                {formatDateTime(selectedVehicle.nextInspection)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Số ngày kể từ lần kiểm tra cuối"
                span={2}
              >
                <Tag
                  color={
                    selectedVehicle.daysSinceInspection > 30 ? "red" : "green"
                  }
                >
                  {selectedVehicle.daysSinceInspection} ngày
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
