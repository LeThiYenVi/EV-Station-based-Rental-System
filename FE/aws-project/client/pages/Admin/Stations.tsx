import { useEffect, useMemo, useState } from "react";
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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EnvironmentOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { stationService } from "@/service";
import type {
  StationResponse,
  StationStatus,
  CreateStationRequest,
  UpdateStationRequest,
  StationFilters,
} from "@/service/types/report-staff-station.types";

export default function Stations() {
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [filters, setFilters] = useState<Partial<StationFilters>>({});

  const [form] = Form.useForm<CreateStationRequest | UpdateStationRequest>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StationResponse | null>(null);

  const statusOptions = [
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Bảo trì", value: "MAINTENANCE" },
    { label: "Đóng cửa", value: "CLOSED" },
  ];

  const load = async (page = pagination.page, size = pagination.size) => {
    try {
      setLoading(true);
      const res = await stationService.getAllStations({
        page: page - 1,
        size,
        sortBy: "name",
        sortDirection: "ASC",
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
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      city: record.city,
      district: record.district,
      ward: record.ward,
      phoneNumber: record.phoneNumber,
      email: record.email,
      openingTime: record.openingTime,
      closingTime: record.closingTime,
      amenities: undefined,
    } as any);
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      if (editing) {
        await stationService.updateStation(
          editing.id,
          values as UpdateStationRequest,
        );
        message.success("Đã cập nhật trạm");
      } else {
        await stationService.createStation(values as CreateStationRequest);
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
    { title: "Tên trạm", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    { title: "Thành phố", dataIndex: "city", key: "city" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      title: "Xe khả dụng",
      key: "available",
      render: (_, r) => `${r.availableVehicles}/${r.totalVehicles}`,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 260,
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
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (p, s) => load(p, s),
        }}
      />

      <Modal
        title={editing ? "Cập nhật trạm" : "Tạo trạm mới"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText={editing ? "Lưu" : "Tạo"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trạm"
            rules={[{ required: true, message: "Nhập tên trạm" }]}
          >
            <Input placeholder="VD: Trạm Quận 1" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input placeholder="Số nhà, đường..." />
          </Form.Item>
          <Form.Item
            name="city"
            label="Thành phố"
            rules={[{ required: true, message: "Nhập thành phố" }]}
          >
            <Input placeholder="VD: Hồ Chí Minh" />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện">
            <Input />
          </Form.Item>
          <Form.Item name="ward" label="Phường/Xã">
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Space>
            <Form.Item name="openingTime" label="Giờ mở" className="mb-0">
              <Input placeholder="08:00" />
            </Form.Item>
            <Form.Item name="closingTime" label="Giờ đóng" className="mb-0">
              <Input placeholder="20:00" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
