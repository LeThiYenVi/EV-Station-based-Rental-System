import { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DashboardOutlined,
  CarOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import Dashboard from "./Dashboard";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    // Handle logout logic
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-green-700"
      >
        {/* Logo */}
        <div
          className={`flex items-center justify-center h-16 border-b border-green-600 transition-all duration-300 ${collapsed ? "px-4" : "px-6"}`}
        >
          {collapsed ? (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-700 font-bold text-xl">A</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-green-700 font-bold text-xl">A</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">Admin Panel</div>
                <div className="text-xs text-green-200">Management System</div>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="!bg-green-700 !border-none"
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin/dashboard"),
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Quản lý người dùng",
              onClick: () => navigate("/admin/users"),
            },
            {
              key: "3",
              icon: <CarOutlined />,
              label: "Quản lý xe",
              onClick: () => navigate("/admin/vehicles"),
            },
            {
              key: "4",
              icon: <ShoppingOutlined />,
              label: "Đơn thuê",
              onClick: () => navigate("/admin/bookings"),
            },
            {
              key: "5",
              icon: <VideoCameraOutlined />,
              label: "Báo cáo",
              onClick: () => navigate("/admin/reports"),
            },
            {
              key: "6",
              icon: <UploadOutlined />,
              label: "Tải lên",
              onClick: () => navigate("/admin/uploads"),
            },
            {
              key: "7",
              icon: <SettingOutlined />,
              label: "Cài đặt",
              onClick: () => navigate("/admin/settings"),
            },
          ]}
        />

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="w-full"
            size="large"
          >
            {!collapsed && "Đăng xuất"}
          </Button>
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          className="!px-4 flex items-center justify-between shadow-md"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="!text-lg !w-16 !h-16 hover:!bg-green-50"
          />

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="font-semibold text-gray-700">Admin User</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </Header>

        {/* Content */}
        <Content
          className="m-6 p-6 bg-white"
          style={{
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Dashboard />
        </Content>
      </Layout>
    </Layout>
  );
}
