import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Tooltip,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { ColumnsType } from "antd/es/table";
import blogService from "@/service/blog/blogService";
import type { BlogResponse } from "@/service/types/blog.types";

const { TextArea } = Input;

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogResponse | null>(null);
  const [viewingBlog, setViewingBlog] = useState<BlogResponse | null>(null);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState<UploadFile | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    loadBlogs();
  }, [pageNumber, pageSize, sortBy, sortDirection]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogService.getAllBlogs({
        page: pageNumber,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      console.log("📚 Blog API Response:", response);

      setBlogs(response.content || []);
      setTotalElements(response.page?.totalElements || 0);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      message.error("Không thể tải danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    form.resetFields();
    setThumbnailFile(null);
    setThumbnailPreview("");
    setModalVisible(true);
  };

  const handleEdit = (blog: BlogResponse) => {
    setEditingBlog(blog);
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      published: blog.published,
    });
    setThumbnailPreview(blog.thumbnailUrl || "");
    setThumbnailFile(null);
    setModalVisible(true);
  };

  const handleView = (blog: BlogResponse) => {
    setViewingBlog(blog);
    setViewModalVisible(true);
  };

  const handleDelete = async (blogId: string) => {
    try {
      await blogService.deleteBlog(blogId);
      message.success("Xóa blog thành công");
      loadBlogs();
    } catch (error: any) {
      console.error("Delete blog error:", error);
      message.error(error?.response?.data?.message || "Không thể xóa blog");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prepare payload without thumbnail first
      const payload = {
        title: values.title,
        content: values.content,
        thumbnailUrl: "", // Empty initially, will be updated after upload
        published: values.published ?? false,
      };

      console.log("📝 Creating/Updating blog with payload:", payload);

      let blogResult: BlogResponse;

      if (editingBlog) {
        // Update existing blog
        blogResult = await blogService.updateBlog(editingBlog.id, payload);
        message.success("Cập nhật blog thành công");
      } else {
        // Create new blog
        blogResult = await blogService.createBlog(payload);
        message.success("Tạo blog thành công");
      }

      // Upload thumbnail if a new file was selected
      if (thumbnailFile && thumbnailFile.originFileObj) {
        try {
          console.log("📸 Uploading thumbnail for blog:", blogResult.id);
          await blogService.uploadThumbnail(
            blogResult.id,
            thumbnailFile.originFileObj,
          );
          message.success("Tải lên hình ảnh thành công");
        } catch (uploadError: any) {
          console.error("Upload thumbnail error:", uploadError);
          message.warning(
            "Blog đã tạo nhưng tải ảnh lên thất bại: " +
              (uploadError?.response?.data?.message || uploadError?.message),
          );
        }
      }

      setModalVisible(false);
      form.resetFields();
      setThumbnailFile(null);
      setThumbnailPreview("");
      loadBlogs();
    } catch (error: any) {
      console.error("Submit blog error:", error);
      const errorMsg =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Có lỗi xảy ra";
      message.error(errorMsg);
    }
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (info: any) => {
    const file = info.file;
    if (file.status !== "uploading") {
      setThumbnailFile(file);
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return false; // Prevent auto upload, we'll handle manually
  };

  const columns: ColumnsType<BlogResponse> = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 100,
      render: (url: string) => (
        <Avatar shape="square" size={64} src={url} alt="thumbnail" />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="font-semibold">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      width: 120,
      render: (published: boolean) =>
        published ? (
          <Tag color="green">Đã xuất bản</Tag>
        ) : (
          <Tag color="orange">Nháp</Tag>
        ),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      sorter: true,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa blog này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (pagination) {
      setPageNumber(pagination.current - 1);
      setPageSize(pagination.pageSize);
    }

    if (sorter?.field) {
      const fieldMap: Record<string, string> = {
        createdAt: "createdAt",
        viewCount: "viewCount",
      };
      setSortBy(fieldMap[sorter.field] || "createdAt");
      setSortDirection(sorter.order === "ascend" ? "ASC" : "DESC");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Quản lý Blog</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700"
        >
          Tạo blog mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageNumber + 1,
          pageSize,
          total: totalElements,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} blog`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingBlog ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText={editingBlog ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{ published: true }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề" },
              { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự" },
              { max: 200, message: "Tiêu đề không được quá 200 ký tự" },
            ]}
          >
            <Input
              placeholder="Nhập tiêu đề blog (10-200 ký tự)"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung" },
              { min: 50, message: "Nội dung phải có ít nhất 50 ký tự" },
            ]}
          >
            <TextArea
              rows={12}
              placeholder="Nhập nội dung blog (tối thiểu 50 ký tự, hỗ trợ Markdown)"
              showCount
            />
          </Form.Item>

          <Form.Item label="Hình ảnh thu nhỏ">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={beforeUpload}
              onChange={handleThumbnailChange}
              onRemove={() => {
                setThumbnailFile(null);
                setThumbnailPreview("");
              }}
              fileList={thumbnailFile ? [thumbnailFile] : []}
            >
              {!thumbnailFile && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                  className="rounded border"
                />
              </div>
            )}
            <div className="text-gray-500 text-sm mt-2">
              Tải lên ảnh từ thiết bị (tối đa 5MB, định dạng: JPG, PNG, GIF)
            </div>
          </Form.Item>

          <Form.Item
            name="published"
            label="Xuất bản ngay"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Chi tiết Blog"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {viewingBlog && (
          <div className="space-y-4">
            <div>
              <img
                src={viewingBlog.thumbnailUrl}
                alt={viewingBlog.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{viewingBlog.title}</h2>
              <div className="flex gap-4 mt-2 text-gray-600">
                <span>Tác giả: {viewingBlog.authorName}</span>
                <span>Lượt xem: {viewingBlog.viewCount}</span>
                <span>
                  {viewingBlog.published ? (
                    <Tag color="green">Đã xuất bản</Tag>
                  ) : (
                    <Tag color="orange">Nháp</Tag>
                  )}
                </span>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{viewingBlog.content}</div>
            </div>
            <div className="text-sm text-gray-500 border-t pt-4">
              <p>
                Ngày tạo:{" "}
                {new Date(viewingBlog.createdAt).toLocaleString("vi-VN")}
              </p>
              <p>
                Cập nhật:{" "}
                {new Date(viewingBlog.updatedAt).toLocaleString("vi-VN")}
              </p>
              {viewingBlog.publishedAt && (
                <p>
                  Xuất bản:{" "}
                  {new Date(viewingBlog.publishedAt).toLocaleString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
