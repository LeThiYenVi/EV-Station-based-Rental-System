import { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CarOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Confirmations from "./Confirmations";
import ActiveBookings from "./ActiveBookings";
import VehicleInspection from "./VehicleInspection";
import Customers from "./Customers";
import Blog from "./Blog";

const { Header, Sider, Content } = Layout;

export default function StaffLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get current menu key from location
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path.includes("/confirmations")) return "2";
    if (path.includes("/bookings")) return "3";
    if (path.includes("/vehicles")) return "4";
    if (path.includes("/customers")) return "5";
    if (path.includes("/blog")) return "6";
    return "1"; // dashboard
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Read staff info from localStorage (set by auth)
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const fullName = storedUser?.fullName || storedUser?.name || "Staff User";
  const email = storedUser?.email || localStorage.getItem("userEmail") || "";
  const userRole = localStorage.getItem("userRole") || "STAFF";

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-blue-700"
      >
        {/* Logo */}
        <div
          className={`flex items-center justify-center h-16 border-b border-blue-600 transition-all duration-300 ${collapsed ? "px-4" : "px-6"}`}
        >
          {collapsed ? (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-700 font-bold text-xl">S</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-xl">S</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">Staff Panel</div>
                <div className="text-xs text-blue-200">Quản lý vận hành</div>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          className="!bg-blue-700 !border-none"
          style={{
            background: "#1d4ed8",
          }}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/staff/dashboard"),
            },
            {
              key: "2",
              icon: <CheckCircleOutlined />,
              label: "Xác nhận đơn",
              onClick: () => navigate("/staff/confirmations"),
            },
            {
              key: "3",
              icon: <ShoppingOutlined />,
              label: "Quản lý đơn thuê",
              onClick: () => navigate("/staff/bookings"),
            },
            {
              key: "4",
              icon: <CarOutlined />,
              label: "Kiểm tra xe",
              onClick: () => navigate("/staff/vehicles"),
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: "Khách hàng",
              onClick: () => navigate("/staff/customers"),
            },
            {
              key: "6",
              icon: <FileTextOutlined />,
              label: "Quản lý Blog",
              onClick: () => navigate("/staff/blog"),
            },
          ]}
        />

        {/* Logout Button */}
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
          className="!px-4 !py-0 !h-16 flex items-center justify-between shadow-md"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="!text-lg !w-16 !h-16 hover:!bg-blue-50"
          />

          <div className="flex items-center gap-3 max-w-[50%]">
            <div className="text-right mr-2 leading-tight">
              <div className="font-semibold text-gray-700 truncate max-w-[220px]">
                {fullName}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[220px]">
                {email}
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {userRole?.[0] || "S"}
            </div>
          </div>
        </Header>

        {/* Content */}
        <Content
          className="m-6 bg-white"
          style={{
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/confirmations" element={<Confirmations />} />
            <Route path="/bookings" element={<ActiveBookings />} />
            <Route path="/vehicles" element={<VehicleInspection />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
