/**
 * Staff/Admin Feedback Management Page - Quản lý Phản hồi khách hàng
 *
 * Chức năng:
 * ✅ Danh sách tất cả feedback từ khách hàng
 * ✅ Xem chi tiết feedback:
 *    - Thông tin khách hàng
 *    - Đánh giá xe (vehicleRating)
 *    - Đánh giá trạm (stationRating)
 *    - Bình luận (comment)
 * ✅ Trả lời feedback:
 *    - Staff/Admin có thể reply
 *    - Lưu người trả lời và thời gian
 * ✅ Lọc và tìm kiếm:
 *    - Theo đánh giá (rating)
 *    - Theo xe, trạm
 *    - Đã/chưa trả lời
 *
 * API:
 * GET /api/feedbacks/admin/all?page=0&size=10
 * POST /api/feedbacks/:feedbackId/response
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
  Avatar,
  Alert,
  Rate,
  Form,
  Input,
  Tooltip,
} from "antd";
import {
  MessageOutlined,
  StarOutlined,
  EyeOutlined,
  CarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useFeedback } from "@/hooks/useFeedback";
import type { FeedbackResponse } from "@/service/types/feedback.types";

const { TextArea } = Input;

export default function ActiveBookings() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackResponse | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Use feedback hook
  const { getAllFeedbacks, respondToFeedback } = useFeedback();

  // Load all feedbacks with pagination
  const loadFeedbacks = async (page = 0, size = 10) => {
    setTableLoading(true);
    try {
      const response = await getAllFeedbacks({ page, size });

      if (response) {
        setFeedbacks(response.content || []);
        setPagination({
          current: page + 1,
          pageSize: size,
          total: response.page?.totalElements || 0,
        });
      }
    } catch (e) {
      message.error("Không tải được danh sách phản hồi");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks(0, 10);
  }, []);

  // Handle table pagination change
  const handleTableChange = (page: number, pageSize: number) => {
    loadFeedbacks(page - 1, pageSize);
  };

  // Statistics
  const stats = {
    total: feedbacks.length,
    responded: feedbacks.filter((f) => f.response).length,
    pending: feedbacks.filter((f) => !f.response).length,
    highRating: feedbacks.filter(
      (f) => f.vehicleRating >= 4 || f.stationRating >= 4,
    ).length,
    lowRating: feedbacks.filter(
      (f) => f.vehicleRating <= 2 || f.stationRating <= 2,
    ).length,
  };

  // Format datetime
  const formatDateTime = (dateString: string | null) => {
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

  // View details
  const handleViewDetail = (feedback: FeedbackResponse) => {
    setSelectedFeedback(feedback);
    setDetailModalOpen(true);
  };

  // Open response modal
  const handleOpenResponse = (feedback: FeedbackResponse) => {
    setSelectedFeedback(feedback);
    setResponseModalOpen(true);
    form.resetFields();
    if (feedback.response) {
      form.setFieldsValue({ response: feedback.response });
    }
  };

  // Submit response
  const handleSubmitResponse = async (values: any) => {
    if (!selectedFeedback) return;

    setSubmitLoading(true);
    try {
      await respondToFeedback(selectedFeedback.id, values.response);
      message.success("Đã trả lời phản hồi thành công!");

      setResponseModalOpen(false);

      // Reload về trang đầu
      await loadFeedbacks(0, pagination.pageSize);
      setPagination((prev) => ({ ...prev, current: 1 }));
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get average rating
  const getAverageRating = (vehicleRating: number, stationRating: number) => {
    return ((vehicleRating + stationRating) / 2).toFixed(1);
  };

  // Get rating tag
  const getRatingTag = (rating: number) => {
    if (rating >= 4)
      return (
        <Tag color="green" icon={<StarOutlined />}>
          Tốt
        </Tag>
      );
    if (rating >= 3)
      return (
        <Tag color="blue" icon={<StarOutlined />}>
          Khá
        </Tag>
      );
    if (rating >= 2)
      return (
        <Tag color="orange" icon={<StarOutlined />}>
          Trung bình
        </Tag>
      );
    return (
      <Tag color="red" icon={<StarOutlined />}>
        Kém
      </Tag>
    );
  };

  // Table columns
  const columns: ColumnsType<FeedbackResponse> = [
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
      title: "Khách hàng",
      key: "renter",
      width: 220,
      render: (_: any, record: FeedbackResponse) => (
        <div>
          <div className="flex items-center gap-2">
            <Avatar icon={<UserOutlined />} size="small" />
            <div>
              <div className="font-medium">{record.renterName}</div>
              <div className="text-xs text-gray-500">{record.renterEmail}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Xe",
      key: "vehicle",
      width: 200,
      render: (_: any, record: FeedbackResponse) => (
        <div>
          <div className="flex items-center gap-2">
            <CarOutlined className="text-blue-500" />
            <div>
              <div className="font-medium">{record.vehicleName}</div>
              <div className="text-xs text-gray-500">
                {record.vehicleLicensePlate}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạm",
      key: "station",
      width: 150,
      render: (_: any, record: FeedbackResponse) => (
        <div className="flex items-center gap-2">
          <HomeOutlined className="text-green-500" />
          <span className="text-sm">{record.stationName}</span>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 180,
      render: (_: any, record: FeedbackResponse) => {
        const avg = parseFloat(
          getAverageRating(record.vehicleRating, record.stationRating),
        );
        return (
          <div>
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={avg} allowHalf />
              <span className="font-semibold">{avg}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Xe: {record.vehicleRating}⭐ | Trạm: {record.stationRating}⭐
            </div>
            <div className="mt-1">{getRatingTag(avg)}</div>
          </div>
        );
      },
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      width: 250,
      render: (comment: string) => (
        <Tooltip title={comment}>
          <div className="text-sm line-clamp-2">{comment || "Không có"}</div>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      filters: [
        { text: "Đã trả lời", value: "responded" },
        { text: "Chờ trả lời", value: "pending" },
      ],
      onFilter: (value, record) => {
        if (value === "responded") return !!record.response;
        return !record.response;
      },
      render: (_: any, record: FeedbackResponse) => {
        if (record.response) {
          return (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã trả lời
            </Tag>
          );
        }
        return (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            Chờ trả lời
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string | null) => (
        <div className="text-sm">{formatDateTime(date)}</div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_: any, record: FeedbackResponse) => (
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
            icon={<MessageOutlined />}
            onClick={() => handleOpenResponse(record)}
            className="w-full"
          >
            {record.response ? "Sửa trả lời" : "Trả lời"}
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
          Quản lý phản hồi khách hàng
        </h1>
        <p className="text-gray-600 mt-2">
          Xem và trả lời các phản hồi từ khách hàng sau khi thuê xe
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng phản hồi"
              value={pagination.total}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Đã trả lời"
              value={stats.responded}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Chờ trả lời"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Đánh giá tốt (≥4⭐)"
              value={stats.highRating}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Đánh giá kém (≤2⭐)"
              value={stats.lowRating}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert for pending feedbacks */}
      {stats.pending > 0 && (
        <Alert
          message={`Bạn có ${stats.pending} phản hồi chưa trả lời`}
          description="Vui lòng trả lời các phản hồi từ khách hàng để cải thiện chất lượng dịch vụ."
          type="warning"
          showIcon
          closable
        />
      )}

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="id"
          loading={tableLoading}
          scroll={{ x: 1600 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Tổng ${total} phản hồi`,
            showSizeChanger: true,
            onChange: handleTableChange,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined />
            <span>Chi tiết phản hồi - {selectedFeedback?.bookingCode}</span>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="respond"
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => {
              setDetailModalOpen(false);
              selectedFeedback && handleOpenResponse(selectedFeedback);
            }}
          >
            {selectedFeedback?.response ? "Sửa trả lời" : "Trả lời"}
          </Button>,
        ]}
      >
        {selectedFeedback && (
          <div className="space-y-4">
            {/* Customer & Booking Info */}
            <Card size="small" title="Thông tin khách hàng & Đơn thuê">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Mã đơn" span={2}>
                  <span className="font-mono font-semibold">
                    {selectedFeedback.bookingCode}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedFeedback.renterName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedFeedback.renterEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Xe thuê">
                  {selectedFeedback.vehicleName}
                </Descriptions.Item>
                <Descriptions.Item label="Biển số">
                  {selectedFeedback.vehicleLicensePlate}
                </Descriptions.Item>
                <Descriptions.Item label="Trạm" span={2}>
                  {selectedFeedback.stationName}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Ratings */}
            <Card size="small" title="Đánh giá">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Đánh giá xe:</span>
                  <div className="flex items-center gap-2">
                    <Rate
                      disabled
                      defaultValue={selectedFeedback.vehicleRating}
                    />
                    <span className="font-semibold">
                      {selectedFeedback.vehicleRating}/5
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Đánh giá trạm:</span>
                  <div className="flex items-center gap-2">
                    <Rate
                      disabled
                      defaultValue={selectedFeedback.stationRating}
                    />
                    <span className="font-semibold">
                      {selectedFeedback.stationRating}/5
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="font-semibold">Trung bình:</span>
                  <div className="flex items-center gap-2">
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={parseFloat(
                        getAverageRating(
                          selectedFeedback.vehicleRating,
                          selectedFeedback.stationRating,
                        ),
                      )}
                    />
                    <span className="text-lg font-bold text-blue-600">
                      {getAverageRating(
                        selectedFeedback.vehicleRating,
                        selectedFeedback.stationRating,
                      )}
                      /5
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comment */}
            <Card size="small" title="Bình luận của khách hàng">
              <div className="p-3 bg-gray-50 rounded border">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedFeedback.comment || "Không có bình luận"}
                </p>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Đăng lúc: {formatDateTime(selectedFeedback.createdAt)}
                {selectedFeedback.isEdit && " (Đã chỉnh sửa)"}
              </div>
            </Card>

            {/* Response */}
            {selectedFeedback.response && (
              <Card
                size="small"
                title="Phản hồi của VoltGo"
                className="bg-blue-50"
              >
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedFeedback.response}
                  </p>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Trả lời bởi: {selectedFeedback.respondedByName || "Staff"} •{" "}
                  {formatDateTime(selectedFeedback.respondedAt)}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SendOutlined className="text-blue-500" />
            <span>
              {selectedFeedback?.response
                ? "Chỉnh sửa trả lời"
                : "Trả lời phản hồi"}
            </span>
          </div>
        }
        open={responseModalOpen}
        onCancel={() => setResponseModalOpen(false)}
        width={600}
        footer={null}
      >
        {selectedFeedback && (
          <div>
            <Alert
              message="Thông tin phản hồi"
              description={
                <div className="space-y-1">
                  <p>
                    <strong>Mã đơn:</strong> {selectedFeedback.bookingCode}
                  </p>
                  <p>
                    <strong>Khách hàng:</strong> {selectedFeedback.renterName}
                  </p>
                  <p>
                    <strong>Đánh giá TB:</strong>{" "}
                    {getAverageRating(
                      selectedFeedback.vehicleRating,
                      selectedFeedback.stationRating,
                    )}
                    ⭐
                  </p>
                  <p>
                    <strong>Bình luận:</strong> "{selectedFeedback.comment}"
                  </p>
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />

            <Form form={form} layout="vertical" onFinish={handleSubmitResponse}>
              <Form.Item
                name="response"
                label="Nội dung trả lời"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung trả lời",
                  },
                  {
                    min: 10,
                    message: "Nội dung phải có ít nhất 10 ký tự",
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Nhập nội dung trả lời cho khách hàng..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Space className="w-full justify-end">
                  <Button onClick={() => setResponseModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitLoading}
                    icon={<SendOutlined />}
                  >
                    Gửi trả lời
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
