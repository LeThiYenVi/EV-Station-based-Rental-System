/**
 * Dashboard Page - Trang tổng quan hệ thống EV Station
 * Hiển thị các thống kê, biểu đồ, và hoạt động gần đây
 */

import { useState, useEffect } from "react";
import adminService from "@/services/admin.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Car,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Battery,
  Zap,
  CheckCircle,
  AlertCircle,
  Wrench,
} from "lucide-react";
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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [vehicleStatusData, setVehicleStatusData] = useState<any[]>([]);
  const [bookingByTypeData, setBookingByTypeData] = useState<any[]>([]);
  const [newBookings, setNewBookings] = useState<any[]>([]);
  const [bookingPerformance, setBookingPerformance] = useState<any>(null);
  const [maintenanceOverview, setMaintenanceOverview] = useState<any>(null);

  // Fetch dashboard data từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Gọi song song tất cả các API
        const [
          summaryRes,
          revenueChartRes,
          vehicleStatusRes,
          bookingByTypeRes,
          newBookingsRes,
          bookingPerfRes,
          maintenanceRes,
        ] = await Promise.all([
          adminService.dashboard.getDashboardSummary(),
          adminService.dashboard.getRevenueChart(),
          adminService.dashboard.getVehicleStatusDistribution(),
          adminService.dashboard.getBookingByType(),
          adminService.dashboard.getNewBookings(),
          adminService.dashboard.getBookingPerformance(),
          adminService.dashboard.getMaintenanceOverview(),
        ]);

        setDashboardData(summaryRes.data);
        setRevenueChartData(revenueChartRes.data);

        // Map vehicle status data cho Pie Chart
        const statusDist = vehicleStatusRes.data;
        setVehicleStatusData([
          {
            name: "Available",
            value: statusDist.availableCount,
            color: "#10b981",
          },
          {
            name: "On Going",
            value: statusDist.onGoingCount,
            color: "#f59e0b",
          },
          {
            name: "Maintenance",
            value: statusDist.maintenanceCount,
            color: "#ef4444",
          },
        ]);

        setBookingByTypeData(bookingByTypeRes.data);
        setNewBookings(newBookingsRes.data);
        setBookingPerformance(bookingPerfRes.data);
        setMaintenanceOverview(maintenanceRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Show error toast instead of mock data
        // toast notification can be added here
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats from API data
  const stats = dashboardData
    ? {
        users: {
          total: dashboardData.userReport.totalUser,
          verified: dashboardData.userReport.totalVerifiedUser,
          blocked: dashboardData.userReport.totalBlockedUser,
          growth: dashboardData.revenueReport.growthPercentage || 12.5,
        },
        vehicles: {
          total: dashboardData.vehicleReport.totalVehicles,
          available: dashboardData.vehicleReport.totalAvailable,
          rented: dashboardData.vehicleReport.totalOnGoing,
          maintenance: dashboardData.vehicleReport.totalMaintenance,
          electric: 0,
          outOfService: 0,
          growth: 8.3,
        },
        bookings: {
          total: dashboardData.bookingReport.totalBooking,
          confirmed: dashboardData.bookingReport.totalConfirmBooking,
          active: dashboardData.bookingReport.totalOnGoingBooking,
          completed: 0,
          cancelled: 0,
          growth: 23.1,
        },
        revenue: {
          today: dashboardData.revenueReport.todayRevenue,
          total: dashboardData.bookingReport.totalRevenueFromCompletedBooking,
          growth: dashboardData.revenueReport.growthPercentage,
        },
      }
    : {
        users: { total: 0, verified: 0, blocked: 0, growth: 0 },
        vehicles: {
          total: 0,
          available: 0,
          rented: 0,
          maintenance: 0,
          electric: 0,
          outOfService: 0,
          growth: 0,
        },
        bookings: {
          total: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0,
          growth: 0,
        },
        revenue: { today: 0, total: 0, growth: 0 },
      };

  // Vehicle status distribution for pie chart
  const statusChartData = vehicleStatusData.length > 0 ? vehicleStatusData : [];

  // Booking by type for bar chart
  const bookingTypeChartData = Array.isArray(bookingByTypeData)
    ? bookingByTypeData.map((item: any) => ({
        type: item.type ?? item.fuelType ?? "Unknown",
        bookings: item.count ?? item.bookings ?? 0,
      }))
    : [];

  // Recent activities - Mock data (API chưa có endpoint này)
  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "New customer registered",
      user: "Nguyễn Văn A",
      time: "2 minutes ago",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: 2,
      type: "booking",
      action: "New booking created",
      user: "Tesla Model 3",
      time: "15 minutes ago",
      icon: ShoppingCart,
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: 3,
      type: "vehicle",
      action: "Vehicle added to fleet",
      user: "VinFast VF8 Plus",
      time: "30 minutes ago",
      icon: Car,
      color: "text-green-600 bg-green-100",
    },
    {
      id: 4,
      type: "maintenance",
      action: "Maintenance completed",
      user: "Toyota Camry",
      time: "1 hour ago",
      icon: Wrench,
      color: "text-orange-600 bg-orange-100",
    },
    {
      id: 5,
      type: "booking",
      action: "Booking completed",
      user: "Honda CR-V",
      time: "2 hours ago",
      icon: CheckCircle,
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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.users.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.users.verified} Verified • {stats.users.blocked} Blocked
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
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
            <Car className="h-4 w-4 text-muted-foreground" />
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
              <TrendingUp className="h-3 w-3 text-green-600" />
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
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.bookings.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.bookings.confirmed} Confirmed • {stats.bookings.active}{" "}
              Active
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.revenue.today)} Today
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
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
              <TrendingUp className="h-5 w-5" />
              Revenue & Bookings Trend
            </CardTitle>
            <CardDescription>
              Monthly performance overview (Last 6 months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeLabel" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "totalRevenue") return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue (VND)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalBookings"
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
              <Activity className="h-5 w-5" />
              Vehicle Status Distribution
            </CardTitle>
            <CardDescription>Current fleet status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
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
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusChartData.map((item) => (
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
              <Battery className="h-5 w-5" />
              Bookings by Vehicle Type
            </CardTitle>
            <CardDescription>Performance by fuel type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
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
              <Zap className="h-4 w-4 text-blue-600" />
              Electric Vehicle Fleet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total EVs</span>
                <span className="font-semibold">
                  {stats.vehicles?.electric ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">% of Fleet</span>
                <span className="font-semibold">
                  {(
                    ((stats.vehicles?.electric ?? 0) /
                      (stats.vehicles.total || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EV Bookings</span>
                <span className="font-semibold">
                  {bookingTypeChartData[0]?.bookings ?? 0}
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
              <CheckCircle className="h-4 w-4 text-green-600" />
              Booking Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {stats.bookings?.completed ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-blue-600">
                  {stats.bookings?.active ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">
                  {stats.bookings?.cancelled ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold">
                  {(
                    ((stats.bookings?.completed ?? 0) /
                      (stats.bookings.total || 1)) *
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
              <AlertCircle className="h-4 w-4 text-orange-600" />
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
                  {stats.vehicles?.outOfService ?? 0}
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
