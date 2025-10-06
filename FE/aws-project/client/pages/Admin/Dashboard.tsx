import {
  UserOutlined,
  CarOutlined,
  ShoppingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Chào mừng đến với trang quản trị hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng người dùng</p>
              <h3 className="text-3xl font-bold mt-2">1,234</h3>
              <p className="text-blue-200 text-xs mt-2">
                ↑ 12% so với tháng trước
              </p>
            </div>
            <UserOutlined className="text-5xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tổng xe</p>
              <h3 className="text-3xl font-bold mt-2">567</h3>
              <p className="text-green-200 text-xs mt-2">
                ↑ 8% so với tháng trước
              </p>
            </div>
            <CarOutlined className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Đơn thuê</p>
              <h3 className="text-3xl font-bold mt-2">890</h3>
              <p className="text-purple-200 text-xs mt-2">
                ↑ 23% so với tháng trước
              </p>
            </div>
            <ShoppingOutlined className="text-5xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Doanh thu</p>
              <h3 className="text-3xl font-bold mt-2">₫234M</h3>
              <p className="text-orange-200 text-xs mt-2">
                ↑ 15% so với tháng trước
              </p>
            </div>
            <DashboardOutlined className="text-5xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Hoạt động gần đây
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: <UserOutlined />,
                text: "Người dùng mới đăng ký",
                time: "2 phút trước",
                color: "green",
              },
              {
                icon: <CarOutlined />,
                text: "Xe mới được thêm",
                time: "15 phút trước",
                color: "blue",
              },
              {
                icon: <ShoppingOutlined />,
                text: "Đơn thuê mới",
                time: "30 phút trước",
                color: "purple",
              },
              {
                icon: <UserOutlined />,
                text: "Cập nhật thông tin",
                time: "1 giờ trước",
                color: "orange",
              },
              {
                icon: <CarOutlined />,
                text: "Xe được cập nhật",
                time: "2 giờ trước",
                color: "green",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center text-${item.color}-600`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all border border-blue-200">
              <UserOutlined className="text-3xl text-blue-600 mb-2" />
              <p className="font-semibold text-gray-700">Thêm người dùng</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all border border-green-200">
              <CarOutlined className="text-3xl text-green-600 mb-2" />
              <p className="font-semibold text-gray-700">Thêm xe</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all border border-purple-200">
              <ShoppingOutlined className="text-3xl text-purple-600 mb-2" />
              <p className="font-semibold text-gray-700">Xem đơn thuê</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all border border-orange-200">
              <DashboardOutlined className="text-3xl text-orange-600 mb-2" />
              <p className="font-semibold text-gray-700">Báo cáo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
