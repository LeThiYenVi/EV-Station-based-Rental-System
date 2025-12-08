import { useState } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Select,
  Button,
  Divider,
  Space,
  Typography,
  message,
} from "antd";

const { Title, Text } = Typography;

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // Placeholder: persist to localStorage to mimic saving
      localStorage.setItem("admin_settings", JSON.stringify(values));
      message.success("Đã lưu cài đặt");
    } catch (e) {
      message.error("Lưu cài đặt thất bại");
    } finally {
      setLoading(false);
    }
  };

  const initial = (() => {
    try {
      const raw = localStorage.getItem("admin_settings");
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  })();

  return (
    <div className="space-y-6">
      <Title level={3}>Cài đặt</Title>
      <Text type="secondary">
        Quản lý các cấu hình hệ thống cho trang quản trị.
      </Text>

      <Card>
        <Tabs
          defaultActiveKey="general"
          items={[
            {
              key: "general",
              label: "Chung",
              children: (
                <Form
                  layout="vertical"
                  initialValues={
                    initial || {
                      siteName: "VoltGo Admin",
                      defaultLanguage: "vi",
                      enableNotifications: true,
                    }
                  }
                  onFinish={handleSave}
                >
                  <Form.Item label="Tên hệ thống" name="siteName">
                    <Input placeholder="Nhập tên hệ thống" />
                  </Form.Item>
                  <Form.Item label="Ngôn ngữ mặc định" name="defaultLanguage">
                    <Select
                      options={[
                        { label: "Tiếng Việt", value: "vi" },
                        { label: "English", value: "en" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Bật thông báo"
                    name="enableNotifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Divider />
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu cài đặt
                    </Button>
                  </Space>
                </Form>
              ),
            },
            {
              key: "security",
              label: "Bảo mật",
              children: (
                <Form
                  layout="vertical"
                  initialValues={
                    initial || {
                      enforce2FA: false,
                      sessionTimeout: 60,
                    }
                  }
                  onFinish={handleSave}
                >
                  <Form.Item
                    label="Bắt buộc 2FA cho Admin"
                    name="enforce2FA"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian hết hạn phiên (phút)"
                    name="sessionTimeout"
                  >
                    <Input type="number" min={5} step={5} />
                  </Form.Item>
                  <Divider />
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu cài đặt
                    </Button>
                  </Space>
                </Form>
              ),
            },
            {
              key: "appearance",
              label: "Giao diện",
              children: (
                <Form
                  layout="vertical"
                  initialValues={
                    initial || {
                      theme: "light",
                      compactSider: false,
                    }
                  }
                  onFinish={handleSave}
                >
                  <Form.Item label="Giao diện" name="theme">
                    <Select
                      options={[
                        { label: "Sáng", value: "light" },
                        { label: "Tối", value: "dark" },
                        { label: "Hệ thống", value: "system" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Thu gọn sidebar"
                    name="compactSider"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Divider />
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu cài đặt
                    </Button>
                  </Space>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
