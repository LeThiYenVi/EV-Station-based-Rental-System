/**
 * PerformanceAnalytics Component
 * Phân tích hiệu suất hoạt động: đơn thuê, tỷ lệ hủy, xe hot, khách VIP, thời gian thuê TB
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

interface PerformanceData {
  totalBookings: number;
  bookingsGrowth: number; // Percentage
  cancelledBookings: number;
  cancellationRate: number; // Percentage
  topVehicle: {
    name: string;
    licensePlate: string;
    rentCount: number;
  };
  topCustomer: {
    name: string;
    phone: string;
    rentCount: number;
  };
  averageRentalDays: number;
  activeBookings: number;
  completionRate: number; // Percentage
}

interface PerformanceAnalyticsProps {
  data?: PerformanceData;
  loading?: boolean;
}

// Mock data
const mockData: PerformanceData = {
  totalBookings: 1248,
  bookingsGrowth: 15.3,
  cancelledBookings: 87,
  cancellationRate: 7.0,
  topVehicle: {
    name: "Tesla Model 3 Long Range",
    licensePlate: "30A-12345",
    rentCount: 127,
  },
  topCustomer: {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    rentCount: 23,
  },
  averageRentalDays: 4.2,
  activeBookings: 156,
  completionRate: 93.0,
};

export default function PerformanceAnalytics({
  data = mockData,
  loading = false,
}: PerformanceAnalyticsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phân tích hiệu suất</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <LineChartOutlined
                  style={{ fontSize: 20 }}
                  className="text-primary"
                />
                Phân tích hiệu suất hoạt động
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tổng quan về hiệu suất đơn thuê và hoạt động kinh doanh
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Real-time
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng đơn thuê</p>
                <p className="text-2xl font-bold mt-1">
                  {data.totalBookings.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {data.bookingsGrowth >= 0 ? (
                    <>
                      <RiseOutlined className="text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        +{data.bookingsGrowth}%
                      </span>
                    </>
                  ) : (
                    <>
                      <FallOutlined className="text-red-600" />
                      <span className="text-xs text-red-600 font-medium">
                        {data.bookingsGrowth}%
                      </span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">
                    vs tháng trước
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarOutlined
                  style={{ fontSize: 24 }}
                  className="text-blue-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Đơn đang hoạt động
                </p>
                <p className="text-2xl font-bold mt-1">{data.activeBookings}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {((data.activeBookings / data.totalBookings) * 100).toFixed(
                    1,
                  )}
                  % tổng đơn
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <LineChartOutlined
                  style={{ fontSize: 24 }}
                  className="text-green-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ hủy đơn</p>
                <p className="text-2xl font-bold mt-1">
                  {data.cancellationRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {data.cancelledBookings} đơn bị hủy
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <CloseCircleOutlined
                  style={{ fontSize: 24 }}
                  className="text-red-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tỷ lệ hoàn thành
                </p>
                <p className="text-2xl font-bold mt-1">
                  {data.completionRate}%
                </p>
                <p className="text-xs text-green-600 font-medium mt-2">
                  Hiệu suất tốt
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <RiseOutlined
                  style={{ fontSize: 24 }}
                  className="text-purple-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Vehicle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CarOutlined
                style={{ fontSize: 20 }}
                className="text-yellow-600"
              />
              🏆 Xe được thuê nhiều nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{data.topVehicle.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Biển số:{" "}
                    <span className="font-mono font-semibold">
                      {data.topVehicle.licensePlate}
                    </span>
                  </p>
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        Số lần thuê:
                      </span>
                      <span className="text-xl font-bold text-green-900">
                        {data.topVehicle.rentCount} lần
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 Đề xuất: Duy trì chất lượng dịch vụ và tăng giá thuê cho xe
                  hot
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TeamOutlined
                style={{ fontSize: 20 }}
                className="text-blue-600"
              />
              👑 Khách hàng VIP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  VIP
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{data.topCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SĐT:{" "}
                    <span className="font-semibold">
                      {data.topCustomer.phone}
                    </span>
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        Số lần thuê:
                      </span>
                      <span className="text-xl font-bold text-blue-900">
                        {data.topCustomer.rentCount} lần
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 Đề xuất: Áp dụng chương trình ưu đãi và chăm sóc khách hàng
                  VIP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClockCircleOutlined
              style={{ fontSize: 20 }}
              className="text-orange-600"
            />
            Thống kê thời gian thuê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <ClockCircleOutlined
                style={{ fontSize: 32 }}
                className="mx-auto text-orange-600 mb-2"
              />
              <p className="text-sm text-muted-foreground mb-1">
                Thời gian thuê trung bình
              </p>
              <p className="text-3xl font-bold text-orange-700">
                {data.averageRentalDays}
              </p>
              <p className="text-sm text-muted-foreground mt-1">ngày</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CalendarOutlined
                style={{ fontSize: 32 }}
                className="mx-auto text-blue-600 mb-2"
              />
              <p className="text-sm text-muted-foreground mb-1">
                Đơn hoàn thành
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {Math.floor((data.completionRate / 100) * data.totalBookings)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">đơn</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <RiseOutlined
                style={{ fontSize: 32 }}
                className="mx-auto text-green-600 mb-2"
              />
              <p className="text-sm text-muted-foreground mb-1">
                Tốc độ tăng trưởng
              </p>
              <p className="text-3xl font-bold text-green-700">
                +{data.bookingsGrowth}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                so với tháng trước
              </p>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <p className="font-semibold text-sm mb-3">
              📊 Đánh giá hiệu suất tổng thể:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tỷ lệ hoàn thành:</span>
                <Badge
                  variant={data.completionRate >= 90 ? "default" : "secondary"}
                >
                  {data.completionRate >= 90
                    ? "✅ Xuất sắc"
                    : "⚠️ Cần cải thiện"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tỷ lệ hủy đơn:</span>
                <Badge
                  variant={
                    data.cancellationRate <= 10 ? "default" : "destructive"
                  }
                >
                  {data.cancellationRate <= 10 ? "✅ Tốt" : "❌ Cao"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tăng trưởng:</span>
                <Badge
                  variant={data.bookingsGrowth >= 10 ? "default" : "secondary"}
                >
                  {data.bookingsGrowth >= 10 ? "🚀 Mạnh mẽ" : "📈 Ổn định"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Thời gian thuê TB:
                </span>
                <Badge variant="outline">
                  {data.averageRentalDays >= 4 ? "⭐ Dài hạn" : "⏱️ Ngắn hạn"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
