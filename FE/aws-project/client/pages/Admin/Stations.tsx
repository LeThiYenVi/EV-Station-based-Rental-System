import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Popconfirm,
  TimePicker,
  InputNumber,
  Row,
  Col,
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EnvironmentOutlined,
  PlusOutlined,
  ReloadOutlined,
  PhoneOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { stationService } from "@/service";
import type {
  StationResponse,
  StationStatus,
  CreateStationRequest,
  UpdateStationRequest,
} from "@/service/types/report-staff-station.types";
import dayjs from "dayjs";
import StationMap from "@/components/station_map";

// Interface cho form với địa chỉ tách
interface StationFormValues {
  name: string;
  ward: string; // Xã/Phường/Địa chỉ cụ thể
  city: string; // Tỉnh/Thành phố
  latitude?: number;
  longitude?: number;
  hotline?: string;
  photo?: string;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
}

export default function Stations() {
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });

  const [form] = Form.useForm<StationFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StationResponse | null>(null);

  const statusOptions = [
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Bảo trì", value: "MAINTENANCE" },
  ];

  // Hàm tách địa chỉ: "Xã/Phường, Tỉnh/Thành phố" -> { ward, city }
  const splitAddress = (address: string): { ward: string; city: string } => {
    if (!address) return { ward: "", city: "" };
    const parts = address.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      return {
        ward: parts.slice(0, -1).join(", "), // Tất cả trước phần tử cuối
        city: parts[parts.length - 1], // Phần tử cuối là tỉnh/thành phố
      };
    }
    return { ward: address, city: "" };
  };

  // Hàm ghép địa chỉ: { ward, city } -> "Xã/Phường, Tỉnh/Thành phố"
  const combineAddress = (ward: string, city: string): string => {
    if (!ward && !city) return "";
    if (!city) return ward;
    if (!ward) return city;
    return `${ward}, ${city}`;
  };

  // Hàm parse time string "HH:mm" hoặc "HH:mm:ss" hoặc ISO string thành dayjs
  const parseTime = (timeStr?: string): dayjs.Dayjs | undefined => {
    if (!timeStr) return undefined;
    // Nếu là ISO string, lấy phần giờ
    if (timeStr.includes("T")) {
      return dayjs(timeStr);
    }
    // Nếu là "HH:mm:ss"
    if (timeStr.length === 8) {
      return dayjs(timeStr, "HH:mm:ss");
    }
    // Nếu là "HH:mm"
    return dayjs(timeStr, "HH:mm");
  };

  // Hàm format dayjs thành "HH:mm:ss" (Java LocalTime format)
  const formatTime = (time?: dayjs.Dayjs): string | undefined => {
    if (!time || !time.isValid()) return undefined;
    return time.format("HH:mm:ss");
  };

  const load = async (page = pagination.page, size = pagination.size) => {
    try {
      setLoading(true);
      const res = await stationService.getAllStations({
        page: page - 1,
        size,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });
      setStations(res.content);
      setPagination({ page, size, total: res.totalElements });
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Không thể tải danh sách trạm",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: StationResponse) => {
    setEditing(record);
    const { ward, city } = splitAddress(record.address);
    form.setFieldsValue({
      name: record.name,
      ward,
      city,
      latitude: record.latitude,
      longitude: record.longitude,
      hotline: record.hotline,
      photo: record.photo,
      startTime: parseTime(record.startTime),
      endTime: parseTime(record.endTime),
    });
    setModalOpen(true);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
    });
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);

      // Chuyển đổi form values sang API request
      // Không gửi startTime/endTime nếu không có giá trị (để backend xử lý default)
      const requestData: CreateStationRequest = {
        name: values.name,
        address: combineAddress(values.ward, values.city),
        latitude: values.latitude || 0,
        longitude: values.longitude || 0,
        hotline: values.hotline || undefined,
        photo: values.photo || undefined,
      };

      // Chỉ thêm time nếu có giá trị hợp lệ
      // Backend yêu cầu ISO datetime format với timezone: "2025-12-03T08:00:00.000Z"
      if (values.startTime && values.startTime.isValid()) {
        requestData.startTime = values.startTime.toISOString();
      }
      if (values.endTime && values.endTime.isValid()) {
        requestData.endTime = values.endTime.toISOString();
      }

      console.log("Request data:", requestData);

      if (editing) {
        await stationService.updateStation(
          editing.id,
          requestData as UpdateStationRequest,
        );
        message.success("Đã cập nhật trạm");
      } else {
        await stationService.createStation(requestData);
        message.success("Đã tạo trạm mới");
      }
      setModalOpen(false);
      await load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Lưu trạm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await stationService.deleteStation(id);
      message.success("Đã xóa trạm");
      await load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Xóa trạm thất bại");
    }
  };

  const handleChangeStatus = async (id: string, status: StationStatus) => {
    try {
      await stationService.changeStationStatus(id, status);
      message.success("Đã đổi trạng thái");
      await load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Đổi trạng thái thất bại");
    }
  };

  const columns: ColumnsType<StationResponse> = [
    { title: "Tên trạm", dataIndex: "name", key: "name", width: 180 },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    {
      title: "Hotline",
      dataIndex: "hotline",
      key: "hotline",
      width: 120,
      render: (hotline: string) =>
        hotline ? (
          <Space>
            <PhoneOutlined />
            {hotline}
          </Space>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Giờ hoạt động",
      key: "operatingHours",
      width: 130,
      render: (_, record) => {
        // Backend trả về ISO datetime, lấy phần giờ
        const formatDisplayTime = (timeStr?: string) => {
          if (!timeStr) return "--:--";
          // Nếu là ISO datetime (có chữ T)
          if (timeStr.includes("T")) {
            return dayjs(timeStr).format("HH:mm");
          }
          // Nếu là HH:mm:ss
          return dayjs(timeStr, "HH:mm:ss").format("HH:mm");
        };
        return `${formatDisplayTime(record.startTime)} - ${formatDisplayTime(record.endTime)}`;
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 90,
      render: (rating: number) =>
        rating ? (
          <Tag color="gold">⭐ {rating.toFixed(1)}</Tag>
        ) : (
          <span className="text-gray-400">Chưa có</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: StationStatus) => {
        const colorMap: Record<StationStatus, string> = {
          ACTIVE: "green",
          INACTIVE: "default",
          MAINTENANCE: "gold",
          CLOSED: "red",
        } as const;
        const label =
          statusOptions.find((s) => s.value === status)?.label || status;
        return <Tag color={colorMap[status]}>{label}</Tag>;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "photo",
      key: "photo",
      width: 80,
      render: (photo: string) =>
        photo ? (
          <a href={photo} target="_blank" rel="noopener noreferrer">
            <PictureOutlined style={{ fontSize: 18, color: "#1890ff" }} />
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Select
            size="middle"
            style={{ width: 140 }}
            value={record.status}
            onChange={(val) =>
              handleChangeStatus(record.id, val as StationStatus)
            }
            options={statusOptions}
          />
          <Popconfirm
            title="Xóa trạm?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EnvironmentOutlined />
          <h1 className="text-xl font-semibold">Quản lý trạm</h1>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => load()}
            loading={loading}
          >
            Tải lại
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm trạm
          </Button>
        </Space>
      </div>

      <Table
        rowKey={(r) => r.id}
        loading={loading}
        columns={columns}
        dataSource={stations}
        scroll={{ x: 1200 }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} trạm`,
          onChange: (p, s) => load(p, s),
        }}
      />

      <Modal
        title={editing ? "Cập nhật trạm" : "Tạo trạm mới"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText={editing ? "Lưu" : "Tạo"}
        cancelText="Hủy"
        confirmLoading={loading}
        width={800}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Thông tin cơ bản",
              children: (
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="name"
                    label="Tên trạm"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên trạm" },
                    ]}
                  >
                    <Input placeholder="VD: Trạm Quận 1" />
                  </Form.Item>

                  {/* Địa chỉ tách thành 2 ô */}
                  <Row gutter={16}>
                    <Col span={14}>
                      <Form.Item
                        name="ward"
                        label="Địa chỉ chi tiết (Số nhà, đường, phường/xã)"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ chi tiết",
                          },
                        ]}
                      >
                        <Input placeholder="VD: 123 Nguyễn Huệ, Phường Bến Nghé" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        name="city"
                        label="Tỉnh/Thành phố"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tỉnh/thành phố",
                          },
                        ]}
                      >
                        <Input placeholder="VD: TP. Hồ Chí Minh" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Hotline */}
                  <Form.Item name="hotline" label="Hotline">
                    <Input
                      placeholder="VD: 0901234567"
                      prefix={<PhoneOutlined />}
                    />
                  </Form.Item>

                  {/* Ảnh đại diện */}
                  <Form.Item name="photo" label="Ảnh đại diện (URL)">
                    <Input
                      placeholder="VD: https://example.com/station.jpg"
                      prefix={<PictureOutlined />}
                    />
                  </Form.Item>

                  {/* Giờ hoạt động */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="startTime" label="Giờ mở cửa">
                        <TimePicker
                          style={{ width: "100%" }}
                          format="HH:mm"
                          placeholder="Chọn giờ mở cửa"
                          minuteStep={15}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="endTime" label="Giờ đóng cửa">
                        <TimePicker
                          style={{ width: "100%" }}
                          format="HH:mm"
                          placeholder="Chọn giờ đóng cửa"
                          minuteStep={15}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <EnvironmentOutlined /> Chọn vị trí trên bản đồ
                </span>
              ),
              children: (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Click vào bản đồ để chọn vị trí trạm. Tọa độ sẽ được điền
                    tự động.
                  </div>
                  <StationMap onLocationSelect={handleLocationSelect} />
                  <Form form={form} layout="vertical">
                    {/* Tọa độ */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="latitude"
                          label="Vĩ độ (Latitude)"
                          rules={[
                            { required: true, message: "Vui lòng nhập vĩ độ" },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder="VD: 10.7769"
                            step={0.0001}
                            precision={6}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="longitude"
                          label="Kinh độ (Longitude)"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập kinh độ",
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder="VD: 106.7009"
                            step={0.0001}
                            precision={6}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
}
