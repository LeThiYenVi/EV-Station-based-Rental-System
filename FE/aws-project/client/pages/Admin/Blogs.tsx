import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Input,
  Modal,
  Typography,
  Image,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileTextOutlined,
  ReloadOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useBlog } from "@/hooks/useBlog";
import type { BlogResponse } from "@/service/types/blog.types";
import dayjs from "dayjs";

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;

export default function Blogs() {
  const {
    loading,
    blogs,
    pagination,
    currentBlog,
    getAllBlogs,
    getBlogById,
    clearCurrentBlog,
  } = useBlog();

  const [searchText, setSearchText] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [paginationState, setPaginationState] = useState({
    page: 1,
    size: 10,
  });

  // Thống kê
  const totalBlogs = pagination?.totalElements || 0;
  const publishedBlogs = blogs.filter((b) => b.published).length;
  const draftBlogs = blogs.filter((b) => !b.published).length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0);

  const load = async (
    page = paginationState.page,
    size = paginationState.size,
  ) => {
    await getAllBlogs({
      page: page - 1,
      size,
      sortBy: "createdAt",
      sortDirection: "DESC",
    });
    setPaginationState({ page, size });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetail = async (record: BlogResponse) => {
    const result = await getBlogById(record.id);
    if (result.success) {
      setDetailModalOpen(true);
    } else {
      message.error("Không thể tải chi tiết bài viết");
    }
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    clearCurrentBlog();
  };

  // Lọc theo tìm kiếm
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<BlogResponse> = [
    {
      title: "Ảnh bìa",
      dataIndex: "thumbnailUrl",
      key: "thumbnail",
      width: 100,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="thumbnail"
            width={80}
            height={50}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgesAF7UYPgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmCgQJHSB+5R3RAAAL6klEQVR42u3de3RV5Z3G8e/OBcIlQEK4BAgQAoRwCSGAEi4qoKBUHEYdqbbaOtbWTqedTqfTdXXVrk6nM7baqdNq7YxdbRfVttJK1SpVQAURKHIJVxFC7oSQG+SekJzMH29OODkk5Jzk7ORN8v2sxUKSk73f/e59nr3f/e53G5qbm0NERM+wB6BSA0BEQBARqNQARAQEBRGBSg0AEQFBQURAEBGoVAoiAoKCiIAgIlCpFEQEBAURgUoNABEBQUSgUimICAgiAoKIQKVSEBEQFEREVFT2h9dAgF6DQEREoFIDQKUGgEoNABEBQUSgUgNARAQEBREBQUSgUqlTgYCgICIgiAhUKgURAUFEoFIDQEQEBAURgUoNAJVKRUSgUikICAoKIgKCiEClUhARqFQKAoKCiIAgIlCpFEQEBAURgUqlICAoKIgICCIClUpBREBQEBGoVAoiAoKIQKVSEBGoVAqCSg0AlRoAIiIgKAgIIgKVSkFEQFAQERAURAQEERFVU4OAiEqlIKjUABARERE="
          />
        ) : (
          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
            <FileTextOutlined className="text-gray-400" />
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string) => <span className="font-medium">{title}</span>,
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
      width: 150,
      render: (name: string) => (
        <Space>
          {name || "Không rõ"}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      width: 130,
      render: (published: boolean) =>
        published ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Đã xuất bản
          </Tag>
        ) : (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            Bản nháp
          </Tag>
        ),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      render: (count: number) => (
        <Space>
          <EyeOutlined />
          {count?.toLocaleString() || 0}
        </Space>
      ),
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 140,
      render: (date: string) =>
        date ? (
          dayjs(date).format("DD/MM/YYYY HH:mm")
        ) : (
          <span className="text-gray-400">Chưa xuất bản</span>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          className="bg-green-600"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 bg-green-600 rounded-md text-white px-2 py-1">
          <h1 className="text-xl font-semibold ">Quản lý bài viết</h1>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => load()}
            loading={loading}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      {/* Thống kê */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng bài viết"
              value={totalBlogs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã xuất bản"
              value={publishedBlogs}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bản nháp"
              value={draftBlogs}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lượt xem"
              value={totalViews}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Thanh tìm kiếm */}
      <div className="flex gap-4">
        <Search
      
          placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ maxWidth: 400 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Table
        rowKey={(r) => r.id}
        loading={loading}
        columns={columns}
        dataSource={filteredBlogs}
        scroll={{ x: 1100 }}
        pagination={{
          current: paginationState.page,
          pageSize: paginationState.size,
          total: pagination?.totalElements || 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bài viết`,
          onChange: (p, s) => load(p, s),
        }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Chi tiết bài viết</span>
          </div>
        }
        open={detailModalOpen}
        onCancel={handleCloseDetail}
        footer={[
          <Button key="close" onClick={handleCloseDetail}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {currentBlog && (
          <div className="space-y-4">
            {/* Ảnh bìa */}
            {currentBlog.thumbnailUrl && (
              <div className="text-center">
                <Image
                  src={currentBlog.thumbnailUrl}
                  alt={currentBlog.title}
                  style={{
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}

            {/* Tiêu đề */}
            <Title level={3}>{currentBlog.title}</Title>

            {/* Thông tin meta */}
            <div className="flex flex-wrap gap-4 text-gray-500">
              <Space>
                <UserOutlined />
                <Text>{currentBlog.authorName || "Không rõ"}</Text>
              </Space>
              <Space>
                <EyeOutlined />
                <Text>
                  {currentBlog.viewCount?.toLocaleString() || 0} lượt xem
                </Text>
              </Space>
              {currentBlog.published ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Đã xuất bản
                </Tag>
              ) : (
                <Tag color="orange" icon={<ClockCircleOutlined />}>
                  Bản nháp
                </Tag>
              )}
            </div>

            {/* Ngày tháng */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>
                Ngày tạo:{" "}
                {currentBlog.createdAt
                  ? dayjs(currentBlog.createdAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </span>
              {currentBlog.publishedAt && (
                <span>
                  Ngày xuất bản:{" "}
                  {dayjs(currentBlog.publishedAt).format("DD/MM/YYYY HH:mm")}
                </span>
              )}
              <span>
                Cập nhật:{" "}
                {currentBlog.updatedAt
                  ? dayjs(currentBlog.updatedAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </span>
            </div>

            {/* Nội dung */}
            <div className="border-t pt-4">
              <Title level={5}>Nội dung</Title>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
