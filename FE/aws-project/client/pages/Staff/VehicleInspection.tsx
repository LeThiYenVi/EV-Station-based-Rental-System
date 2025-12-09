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

import { useEffect, useState } from "react";
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
  FormatPainterOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import vehicleService from "@/service/vehicle/vehicleService";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

// Vehicle status enum (5 status hợp lệ theo backend)
type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "charging"
  | "unavailable";

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

export default function VehicleInspection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [stationId, setStationId] = useState<string>("");
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string | undefined>("createdAt");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >("desc");

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
    unavailable: vehicles.filter((v) => v.status === "unavailable").length,
  };

  useEffect(() => {
    const loadVehicles = async () => {
      setListLoading(true);
      try {
        const res = await vehicleService.getAllVehicles({
          page: pageNumber,
          size: pageSize,
          sortBy,
          sortDirection,
        });
        console.log("📦 API Response:", res);
        console.log("📋 Content array:", res.content);

        const mapped: Vehicle[] = res.content.map((v: any) => ({
          id: v.id,
          name: v.name || `${v.brand}`,
          brand: v.brand,
          plateNumber: v.licensePlate,
          type:
            v.fuelType === "ELECTRICITY"
              ? "Điện"
              : v.fuelType === "HYBRID"
                ? "Hybrid"
                : "Xăng",
          status:
            v.status === "AVAILABLE"
              ? "available"
              : v.status === "RENTED"
                ? "rented"
                : v.status === "MAINTENANCE"
                  ? "maintenance"
                  : v.status === "CHARGING"
                    ? "charging"
                    : "unavailable",
          imageUrl: v.photos?.[0] || v.imageUrl,
          currentKm: 0, // API không trả về currentKm
          lastInspection: new Date().toISOString(),
          nextInspection: new Date(Date.now() + 30 * 86400000).toISOString(),
          daysSinceInspection: 0,
          batteryHealth: v.fuelType === "ELECTRICITY" ? 100 : undefined,
          fuelLevel: v.fuelType === "ELECTRICITY" ? 100 : 80,
          stationName:
            `Trạm ${v.stationId?.substring(0, 8)}...` || "Chưa xác định",
        }));

        console.log("✅ Mapped vehicles:", mapped);
        console.log("📊 Total elements:", res.totalElements);
        setVehicles(mapped);
        setTotalElements(res.totalElements);
      } catch (e) {
        console.error("❌ Error loading vehicles:", e);
        message.error("Không thể tải danh sách xe");
      } finally {
        setListLoading(false);
      }
    };
    loadVehicles();
  }, [pageNumber, pageSize, sortBy, sortDirection]);

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
      charging: {
        label: "Đang sạc",
        color: "cyan",
        icon: <ThunderboltOutlined />,
      },
      unavailable: {
        label: "Không khả dụng",
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

    setLoading(true);
    try {
      const newStatus: VehicleStatus = values.overallStatus;

      // Map to service enum (UPPERCASE)
      const statusMap: Record<VehicleStatus, string> = {
        available: "AVAILABLE",
        rented: "RENTED",
        maintenance: "MAINTENANCE",
        charging: "CHARGING",
        unavailable: "UNAVAILABLE",
      };

      // Chỉ cập nhật trạng thái xe qua API
      await vehicleService.changeVehicleStatus(
        selectedVehicle.id,
        statusMap[newStatus] as any,
      );

      // Cập nhật lại UI
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
        content: `Đã cập nhật trạng thái xe ${selectedVehicle.plateNumber} thành: ${getStatusLabel(newStatus)}`,
        duration: 3,
      });

      setInspectionModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting inspection:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Get status label
  const getStatusLabel = (status: VehicleStatus) => {
    const labels = {
      available: "Sẵn sàng",
      rented: "Đang thuê",
      maintenance: "Bảo trì",
      charging: "Đang sạc",
      unavailable: "Không khả dụng",
    };
    return labels[status];
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
      width: 200,
      render: (_: any, record: Vehicle) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenInspection(record)}
            disabled={record.status === "rented"}
          >
            Cập nhật trạng thái
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
              title="Đang bảo trì / Không khả dụng"
              value={stats.maintenance + stats.unavailable}
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
          loading={listLoading}
          pagination={{
            current: pageNumber + 1,
            pageSize: pageSize,
            total: totalElements,
            showTotal: (total) => `Tổng ${total} xe`,
            showSizeChanger: true,
          }}
          onChange={(pagination) => {
            if (pagination.current) setPageNumber(pagination.current - 1);
            if (pagination.pageSize) setPageSize(pagination.pageSize);
          }}
        />
      </Card>

      {/* Update Status Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-blue-500" />
            <span>Cập nhật trạng thái xe</span>
          </div>
        }
        open={inspectionModalOpen}
        onCancel={() => setInspectionModalOpen(false)}
        width={600}
        footer={null}
      >
        {selectedVehicle && (
          <Form form={form} layout="vertical" onFinish={handleSubmitInspection}>
            <Descriptions column={2} bordered size="small" className="mb-6">
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
              <Descriptions.Item label="Trạng thái hiện tại" span={2}>
                {getStatusBadge(selectedVehicle.status)}
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="overallStatus"
              label="Trạng thái mới"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Radio.Group className="w-full">
                <Space direction="vertical" className="w-full">
                  <Radio value="available">
                    <CheckCircleOutlined className="text-green-600" /> Sẵn sàng
                    (Available)
                  </Radio>
                  <Radio value="maintenance">
                    <WarningOutlined className="text-orange-500" /> Bảo trì
                    (Maintenance)
                  </Radio>
                  <Radio value="charging">
                    <ThunderboltOutlined className="text-cyan-500" /> Đang sạc
                    (Charging)
                  </Radio>
                  <Radio value="unavailable">
                    <CloseCircleOutlined className="text-red-600" /> Không khả
                    dụng (Unavailable)
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="inspectionNotes" label="Ghi chú (tùy chọn)">
              <TextArea
                rows={4}
                placeholder="Ghi chú về lý do thay đổi trạng thái..."
              />
            </Form.Item>

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
                  Cập nhật
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
                    value={0}
                    formatter={(value) => formatCurrency(value as number)}
                    valueStyle={{ color: "#ff4d4f", fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Số lần bảo trì"
                    value={0}
                    valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Bảo trì tiếp theo"
                    value="Chưa xác định"
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Timeline */}
            <div className="text-center py-12">
              <HistoryOutlined className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có lịch sử bảo trì</p>
            </div>
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
