/**
 * Dashboard Page - Trang tổng quan hệ thống EV Station
 * Hiển thị các thống kê, biểu đồ, và hoạt động gần đây
 *
 * TODO: Tích hợp API khi backend cung cấp endpoint analytics tổng hợp
 * Hiện tại sử dụng mock data để demo UI
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TeamOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import hooks để sẵn sàng tích hợp API
// import { useReport } from "@/hooks/useReport";
// import { useVehicle } from "@/hooks/useVehicle";
// import { useBooking } from "@/hooks/useBooking";

export default function Dashboard() {
  // TODO: Kích hoạt khi backend cung cấp API analytics
  // const { getRevenueByStation, getUtilization } = useReport();
  // const { getAllVehicles, getVehicleStats } = useVehicle();
  // const { getAllBookings } = useBooking();

  // Mock data - Thay thế bằng API calls
  const stats = {
    users: {
      total: 1234,
      admin: 5,
      staff: 23,
      customer: 1206,
      growth: 12.5,
    },
    vehicles: {
      total: 567,
      available: 342,
      rented: 189,
      maintenance: 28,
      outOfService: 8,
      electric: 423,
      gasoline: 89,
      hybrid: 55,
      growth: 8.3,
    },
    bookings: {
      total: 890,
      today: 24,
      thisMonth: 342,
      completed: 756,
      active: 89,
      cancelled: 45,
      growth: 23.1,
    },
    revenue: {
      today: 12500000,
      thisMonth: 234000000,
      total: 5600000000,
      growth: 15.7,
      avgPerBooking: 2650000,
    },
  };

  // Monthly revenue data (6 months)
  const revenueData = [
    { month: "Apr", revenue: 180000000, bookings: 280 },
    { month: "May", revenue: 210000000, bookings: 315 },
    { month: "Jun", revenue: 195000000, bookings: 900 },
    { month: "Jul", revenue: 234000000, bookings: 342 },
    { month: "Aug", revenue: 220000000, bookings: 328 },
    { month: "Sep", revenue: 245000000, bookings: 365 },
  ];

  // Vehicle status distribution
  const vehicleStatusData = [
    { name: "Available", value: stats.vehicles.available, color: "#10b981" },
    { name: "Rented", value: stats.vehicles.rented, color: "#f59e0b" },
    {
      name: "Maintenance",
      value: stats.vehicles.maintenance,
      color: "#ef4444",
    },
    {
      name: "Out of Service",
      value: stats.vehicles.outOfService,
      color: "#6b7280",
    },
  ];

  // Booking by vehicle type
  const bookingByTypeData = [
    { type: "Electric", bookings: 612, revenue: 1650000000 },
    { type: "Gasoline", bookings: 189, revenue: 485000000 },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "New customer registered",
      user: "Nguyễn Văn A",
      time: "2 minutes ago",
      icon: TeamOutlined,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: 2,
      type: "booking",
      action: "New booking created",
      user: "Tesla Model 3",
      time: "15 minutes ago",
      icon: ShoppingCartOutlined,
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: 3,
      type: "vehicle",
      action: "Vehicle added to fleet",
      user: "VinFast VF8 Plus",
      time: "30 minutes ago",
      icon: CarOutlined,
      color: "text-green-600 bg-green-100",
    },
    {
      id: 4,
      type: "maintenance",
      action: "Maintenance completed",
      user: "Toyota Camry",
      time: "1 hour ago",
      icon: ToolOutlined,
      color: "text-orange-600 bg-orange-100",
    },
    {
      id: 5,
      type: "booking",
      action: "Booking completed",
      user: "Honda CR-V",
      time: "2 hours ago",
      icon: CheckCircleOutlined,
      color: "text-teal-600 bg-teal-100",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: amount >= 1000000000 ? "compact" : "standard",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to EV Station Management System
        </p>
      </div>

      {/* Stats Cards Row 1 - Users & Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TeamOutlined className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.users.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.users.admin} Admin • {stats.users.staff} Staff •{" "}
              {stats.users.customer} Customers
            </p>
            <div className="flex items-center gap-1 mt-2">
              <RiseOutlined className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                +{stats.users.growth}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Vehicles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <CarOutlined className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.vehicles.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.vehicles.available} Available • {stats.vehicles.rented}{" "}
              Rented
            </p>
            <div className="flex items-center gap-1 mt-2">
              <RiseOutlined className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                +{stats.vehicles.growth}%
              </span>
              <span className="text-xs text-gray-500">fleet growth</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <ShoppingCartOutlined className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.bookings.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.bookings.today} Today • {stats.bookings.thisMonth} This
              Month
            </p>
            <div className="flex items-center gap-1 mt-2">
              <RiseOutlined className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                +{stats.bookings.growth}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarOutlined className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.revenue.today)} Today •{" "}
              {formatCurrency(stats.revenue.thisMonth)} This Month
            </p>
            <div className="flex items-center gap-1 mt-2">
              <RiseOutlined className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                +{stats.revenue.growth}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Bookings Trend */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiseOutlined />
              Revenue & Bookings Trend
            </CardTitle>
            <CardDescription>
              Monthly performance overview (Last 6 months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "revenue") return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue (VND)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThunderboltOutlined />
              Vehicle Status Distribution
            </CardTitle>
            <CardDescription>Current fleet status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {vehicleStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}:{" "}
                    <span className="font-semibold">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings by Vehicle Type */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThunderboltOutlined />
              Bookings by Vehicle Type
            </CardTitle>
            <CardDescription>Performance by fuel type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "revenue") return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  fill="#3b82f6"
                  name="Bookings"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#10b981"
                  name="Revenue (VND)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockCircleOutlined />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EV Fleet Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ThunderboltOutlined className="text-blue-600" />
              Electric Vehicle Fleet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total EVs</span>
                <span className="font-semibold">{stats.vehicles.electric}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">% of Fleet</span>
                <span className="font-semibold">
                  {(
                    (stats.vehicles.electric / stats.vehicles.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EV Bookings</span>
                <span className="font-semibold">
                  {bookingByTypeData[0].bookings}
                </span>
              </div>
              <Badge className="w-full justify-center bg-blue-100 text-blue-800 hover:bg-blue-100">
                Leading in EV Rentals
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Booking Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircleOutlined className="text-green-600" />
              Booking Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {stats.bookings.completed}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-blue-600">
                  {stats.bookings.active}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">
                  {stats.bookings.cancelled}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold">
                  {(
                    (stats.bookings.completed / stats.bookings.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ExclamationCircleOutlined className="text-orange-600" />
              Maintenance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Maintenance</span>
                <span className="font-semibold text-orange-600">
                  {stats.vehicles.maintenance}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Out of Service</span>
                <span className="font-semibold text-red-600">
                  {stats.vehicles.outOfService}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Need Attention</span>
                <span className="font-semibold">
                  {stats.vehicles.maintenance + stats.vehicles.outOfService}
                </span>
              </div>
              <Badge className="w-full justify-center bg-orange-100 text-orange-800 hover:bg-orange-100">
                {stats.vehicles.maintenance} Scheduled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
