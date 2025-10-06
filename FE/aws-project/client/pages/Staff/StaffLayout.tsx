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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function StaffLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    navigate("/login");
  };

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
          defaultSelectedKeys={["1"]}
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
              icon: <ShoppingOutlined />,
              label: "Quản lý đơn thuê",
              onClick: () => navigate("/staff/bookings"),
            },
            {
              key: "3",
              icon: <CheckCircleOutlined />,
              label: "Xác nhận đơn",
              onClick: () => navigate("/staff/confirmations"),
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
          className="!px-4 flex items-center justify-between shadow-md"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="!text-lg !w-16 !h-16 hover:!bg-blue-50"
          />

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="font-semibold text-gray-700">Staff User</div>
              <div className="text-xs text-gray-500">staff@example.com</div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              S
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
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Staff Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Chào mừng đến với trang quản lý vận hành
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Đơn chờ xác nhận</p>
                    <h3 className="text-3xl font-bold mt-2">12</h3>
                  </div>
                  <ShoppingOutlined className="text-4xl text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Đơn đang thuê</p>
                    <h3 className="text-3xl font-bold mt-2">34</h3>
                  </div>
                  <CheckCircleOutlined className="text-4xl text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Xe cần kiểm tra</p>
                    <h3 className="text-3xl font-bold mt-2">8</h3>
                  </div>
                  <CarOutlined className="text-4xl text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Khách hàng mới</p>
                    <h3 className="text-3xl font-bold mt-2">56</h3>
                  </div>
                  <UserOutlined className="text-4xl text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
