import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  Menu,
  Modal,
  Rate,
  Select,
  Space,
  Table,
  Tag,
  Tabs,
  message,
} from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  StopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import userService from "@/service/user/userService";
import type { UserResponse } from "@/service/types/auth.types";
import {
  SafetyCertificateOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import staffService from "@/service/staff/staffService";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "BLACKLIST";

export default function Customers() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [minRentals, setMinRentals] = useState<number | undefined>();
  const [selected, setSelected] = useState<UserResponse | null>(null);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [verifying, setVerifying] = useState(false);
  const staffId = "staff-uuid-placeholder"; // TODO: replace with authenticated staff id

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const page = await userService.getAllUsers(0, 50, "createdAt", "DESC");
        const renters = page.content?.filter((u) => u.role === "RENTER") ?? [];
        setUsers(renters);
      } catch (e) {
        message.error("Không tải được danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const verifyLicense = async (u: UserResponse, approved: boolean) => {
    try {
      setVerifying(true);
      await staffService.verifyUserLicense(u.id!, staffId, approved);
      message.success(approved ? "Đã duyệt GPLX" : "Đã từ chối GPLX");
      setUsers((prev) =>
        prev.map((p) =>
          p.id === u.id ? ({ ...p, licenseVerified: approved } as any) : p,
        ),
      );
    } catch (e: any) {
      message.error(e?.message || "Xử lý GPLX thất bại");
    } finally {
      setVerifying(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...users];
    if (query) list = userService.searchUsers(list, query);
    if (status !== "ALL") {
      list = list.filter((u) => {
        if (status === "BLACKLIST") return u.blacklisted === true;
        if (status === "ACTIVE") return u.active === true && !u.blacklisted;
        if (status === "INACTIVE") return u.active === false && !u.blacklisted;
        return true;
      });
    }
    if (minRentals !== undefined) {
      list = list.filter((u) => (u.bookingCount ?? 0) >= minRentals);
    }
    return userService.sortByName(list, true);
  }, [users, query, status, minRentals]);

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (_: any, record: UserResponse) => (
        <Space direction="vertical" size={0}>
          <span className="font-semibold">{record.fullName}</span>
          <span className="text-gray-500 text-xs">{record.email}</span>
          <span className="text-gray-500 text-xs">
            {record.phoneNumber || "-"}
          </span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: UserResponse) => (
        <Space>
          {record.blacklisted ? (
            <Tag color="red">Blacklist</Tag>
          ) : record.active ? (
            <Tag color="green">Đang hoạt động</Tag>
          ) : (
            <Tag color="default">Tạm ngưng</Tag>
          )}
          {userService.hasVerifiedLicense(record) ? (
            <Tag color="blue">Đã xác minh GPLX</Tag>
          ) : (
            <Tag>Chưa xác minh GPLX</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Số đơn thuê",
      dataIndex: "bookingCount",
      key: "bookingCount",
      render: (val: number) => <span>{val ?? 0}</span>,
    },
    {
      title: "Đánh giá",
      key: "rating",
      render: (_: any, record: UserResponse) => (
        <Space>
          <Rate disabled value={record.rating ?? 0} />
          <span className="text-gray-500">({record.reviewCount ?? 0})</span>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: UserResponse) => (
        <Space wrap>
          <Button
            icon={<MessageOutlined />}
            onClick={() => message.info("Mở chat với khách")}
          >
            Chat
          </Button>
          <Button
            icon={<PhoneOutlined />}
            onClick={() => message.info(`Gọi ${record.phoneNumber || "-"}`)}
          >
            Gọi
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setSelected(record)}
          >
            Lịch sử
          </Button>
          <Button
            icon={<StarOutlined />}
            onClick={() => {
              setSelected(record);
              setRating(record.rating ?? 0);
            }}
          >
            Đánh giá
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={() => confirmBlacklist(record)}
          >
            Blacklist
          </Button>
          <Button
            type="primary"
            icon={<SafetyCertificateOutlined />}
            loading={verifying}
            onClick={() => verifyLicense(record, true)}
            disabled={(record as any).licenseVerified}
          >
            Duyệt GPLX
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            loading={verifying}
            onClick={() => verifyLicense(record, false)}
          >
            Từ chối GPLX
          </Button>
        </Space>
      ),
    },
  ];

  const confirmBlacklist = (u: UserResponse) => {
    Modal.confirm({
      title: "Thêm khách hàng vào blacklist?",
      icon: <ExclamationCircleOutlined />,
      content: `${u.fullName} sẽ bị hạn chế thuê xe nếu vi phạm nghiêm trọng`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        message.success("Đã thêm vào blacklist (mock)");
        setUsers((prev) =>
          prev.map((p) => (p.id === u.id ? { ...p, blacklisted: true } : p)),
        );
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">
          Quản lý Khách hàng
        </h1>
        <Space>
          <Button
            type="primary"
            onClick={() => message.success("Đã đồng bộ dữ liệu (mock)")}
          >
            Đồng bộ
          </Button>
          <Button onClick={() => setQuery("")}>Xóa bộ lọc</Button>
        </Space>
      </div>

      <Card className="border-green-100">
        <Space wrap className="w-full">
          <Input.Search
            allowClear
            placeholder="Tìm theo tên, email, SĐT"
            onSearch={setQuery}
            style={{ maxWidth: 320 }}
          />
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang hoạt động" },
              { value: "INACTIVE", label: "Tạm ngưng" },
              { value: "BLACKLIST", label: "Blacklist" },
            ]}
            style={{ width: 200 }}
          />
          <Input
            type="number"
            placeholder="Tối thiểu số đơn"
            onChange={(e) =>
              setMinRentals(e.target.value ? Number(e.target.value) : undefined)
            }
            style={{ width: 200 }}
          />
        </Space>
      </Card>

      <Table
        rowKey={(r) => r.id || r.email || r.fullName}
        loading={loading}
        columns={columns as any}
        dataSource={filtered}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} khách hàng` }}
      />

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        title={selected ? `Khách hàng: ${selected.fullName}` : ""}
      >
        {selected && (
          <Tabs
            items={[
              {
                key: "history",
                label: "Lịch sử thuê",
                children: (
                  <div className="space-y-3">
                    {(selected.bookings || []).length ? (
                      selected.bookings!.map((b, idx) => (
                        <div
                          key={`${b?.id || idx}`}
                          className="p-3 border rounded hover:border-green-300"
                        >
                          <div className="font-semibold">
                            Đơn #{b?.id || idx}
                          </div>
                          <div className="text-sm text-gray-600">
                            Xe: {b?.vehicleName || b?.licensePlate || "-"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Trạng thái: {b?.status || "-"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">
                        Chưa có lịch sử đơn thuê
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "reviews",
                label: "Đánh giá",
                children: (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span>Điểm đánh giá:</span>
                      <Rate value={rating} onChange={setRating} />
                      <Button
                        type="primary"
                        onClick={() =>
                          message.success("Đã lưu đánh giá (mock)")
                        }
                      >
                        Lưu đánh giá
                      </Button>
                    </div>
                    <div>
                      <Input.TextArea
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú (VIP, khó tính, ... )"
                      />
                      <Button
                        className="mt-2"
                        onClick={() => message.success("Đã lưu ghi chú (mock)")}
                      >
                        Lưu ghi chú
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                key: "support",
                label: "Hỗ trợ",
                children: (
                  <Space>
                    <Button
                      type="primary"
                      icon={<MessageOutlined />}
                      onClick={() => message.info("Mở chat hỗ trợ")}
                    >
                      Chat
                    </Button>
                    <Button
                      style={{ borderColor: "#16a34a", color: "#16a34a" }}
                      icon={<PhoneOutlined />}
                      onClick={() =>
                        message.info(`Gọi ${selected.phoneNumber || "-"}`)
                      }
                    >
                      Gọi
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
