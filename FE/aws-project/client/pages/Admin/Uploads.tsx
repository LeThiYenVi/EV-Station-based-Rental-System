import { useState } from "react";
import { Card, Input, Button, message, Upload, Space, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  adminVehicleService,
  adminStationService,
  adminBlogService,
} from "@/services/admin.service";

const { Title, Text } = Typography;

export default function Uploads() {
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleFiles, setVehicleFiles] = useState<File[]>([]);

  const [stationId, setStationId] = useState("");
  const [stationFile, setStationFile] = useState<File | null>(null);

  const [blogId, setBlogId] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const onVehicleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVehicleFiles(files);
  };

  const onStationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files && e.target.files[0]) || null;
    setStationFile(file);
  };

  const onThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files && e.target.files[0]) || null;
    setThumbnailFile(file);
  };

  const handleUploadVehiclePhotos = async () => {
    if (!vehicleId) return message.warning("Nhập Vehicle ID trước");
    if (!vehicleFiles.length) return message.warning("Chọn ít nhất 1 ảnh");
    try {
      const res = await adminVehicleService.uploadVehiclePhotos(
        vehicleId,
        vehicleFiles,
      );
      if (res.statusCode === 200) {
        message.success("Tải ảnh xe thành công");
        setVehicleFiles([]);
      } else {
        message.error(res.message || "Tải ảnh xe thất bại");
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi tải ảnh xe");
    }
  };

  const handleUploadStationPhoto = async () => {
    if (!stationId) return message.warning("Nhập Station ID trước");
    if (!stationFile) return message.warning("Chọn 1 ảnh");
    try {
      const res = await adminStationService.uploadStationPhoto(
        stationId,
        stationFile,
      );
      if (res.statusCode === 200) {
        message.success("Tải ảnh station thành công");
        setStationFile(null);
      } else {
        message.error(res.message || "Tải ảnh station thất bại");
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi tải ảnh station");
    }
  };

  const handleUploadThumbnail = async () => {
    if (!blogId) return message.warning("Nhập Blog ID trước");
    if (!thumbnailFile) return message.warning("Chọn 1 ảnh");
    try {
      const res = await adminBlogService.uploadThumbnail(blogId, thumbnailFile);
      if (res.statusCode === 200) {
        message.success("Tải thumbnail blog thành công");
        setThumbnailFile(null);
      } else {
        message.error(res.message || "Tải thumbnail thất bại");
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi tải thumbnail");
    }
  };

  return (
    <div className="space-y-6">
      <Title level={3}>Uploads</Title>
      <Text type="secondary">
        Trang tải lên cho ảnh xe, ảnh station, và thumbnail blog.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Vehicle Photos */}
        <Card title="Upload ảnh xe" bordered>
          <Space direction="vertical" className="w-full" size="middle">
            <Input
              placeholder="Vehicle ID"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onVehicleFilesChange}
            />
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUploadVehiclePhotos}
            >
              Tải lên ảnh xe
            </Button>
            {vehicleFiles.length > 0 && (
              <Text type="secondary">Đã chọn {vehicleFiles.length} ảnh</Text>
            )}
          </Space>
        </Card>

        {/* Station Photo */}
        <Card title="Upload ảnh station" bordered>
          <Space direction="vertical" className="w-full" size="middle">
            <Input
              placeholder="Station ID"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={onStationFileChange}
            />
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUploadStationPhoto}
            >
              Tải lên ảnh station
            </Button>
            {stationFile && (
              <Text type="secondary">Đã chọn: {stationFile.name}</Text>
            )}
          </Space>
        </Card>

        {/* Blog Thumbnail */}
        <Card title="Upload thumbnail blog" bordered>
          <Space direction="vertical" className="w-full" size="middle">
            <Input
              placeholder="Blog ID"
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={onThumbnailChange} />
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUploadThumbnail}
            >
              Tải lên thumbnail
            </Button>
            {thumbnailFile && (
              <Text type="secondary">Đã chọn: {thumbnailFile.name}</Text>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
}
