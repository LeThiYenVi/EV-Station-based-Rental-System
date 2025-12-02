/**
 * Reports Page - Báo cáo & Phân tích
 * Trang tổng hợp tất cả báo cáo với tabs: Overview, Revenue, Performance, Customer
 */

import { useState, useEffect } from "react";
import adminService from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  Download,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
} from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import PerformanceAnalytics from "@/components/admin/PerformanceAnalytics";
import VehicleStatusChart from "@/components/admin/VehicleStatusChart";
import TopPerformersChart from "@/components/admin/TopPerformersChart";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type TopPerformerItem = {
  id: string;
  name: string;
  value: number;
  subtitle: string;
  rank: number;
};

export default function Reports() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2025, 9, 1), // October 1, 2025
    to: new Date(2025, 9, 11), // October 11, 2025
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // API Data State
  const [topVehicles, setTopVehicles] = useState<TopPerformerItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopPerformerItem[]>([]);
  const [yearlyComparison, setYearlyComparison] = useState<any>(null);
  const [revenueDetail, setRevenueDetail] = useState<any>(null);
  const [revenueByYear, setRevenueByYear] = useState<any[]>([]);

  // ==================== DATA FETCHING ====================

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, customersRes, yearlyRes, detailRes, byYearRes] =
        await Promise.all([
          adminService.topPerformers.getTopVehicles(8),
          adminService.topPerformers.getTopCustomers(8),
          adminService.revenue.getYearlyComparison(),
          adminService.revenue.getDetailRevenue(),
          adminService.revenue.getRevenueByYear(5),
        ]);

      if (vehiclesRes.data) {
        const mapped = vehiclesRes.data.map((v: any, idx: number) => ({
          id: v.vehicleId,
          name: v.vehicleName,
          value: v.totalBookings,
          subtitle: v.licensePlate,
          rank: idx + 1,
        }));
        setTopVehicles(mapped);
      }

      if (customersRes.data) {
        const mapped = customersRes.data.map((c: any, idx: number) => ({
          id: c.userId,
          name: c.fullName,
          value: c.totalRevenue,
          subtitle: `${c.email || ""} • ${c.totalBookings} lần thuê`,
          rank: idx + 1,
        }));
        setTopCustomers(mapped);
      }

      if (yearlyRes.data) {
        setYearlyComparison(yearlyRes.data);
      }

      if (detailRes.data) {
        setRevenueDetail(detailRes.data);
      }

      if (byYearRes.data) {
        setRevenueByYear(byYearRes.data);
      }
    } catch (error) {
      console.error("Error fetching reports data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu báo cáo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReportsData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Xuất báo cáo CSV/Excel - Tính năng đang phát triển");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Báo cáo & Phân tích
          </h1>
          <p className="text-gray-600 mt-1">
            Phân tích doanh thu, hiệu suất và khách hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Chọn khoảng thời gian</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={{
                  from: dateRange?.from,
                  to: dateRange?.to,
                }}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={2}
                locale={vi}
              />
            </PopoverContent>
          </Popover>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>

          {/* Export Button */}
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Hiệu suất
          </TabsTrigger>
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Khách hàng
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="col-span-2">
              <RevenueChart />
            </div>

            {/* Vehicle Status */}
            <VehicleStatusChart />

            {/* Performance Analytics */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📈 Hiệu suất nhanh</CardTitle>
                  <CardDescription>Các chỉ số quan trọng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Tổng đơn thuê
                      </p>
                      <p className="text-2xl font-bold text-blue-700">1,248</p>
                      <p className="text-xs text-green-600 mt-1">+15.3% ↑</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Đang hoạt động
                      </p>
                      <p className="text-2xl font-bold text-green-700">156</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        12.5%
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tỷ lệ hủy</p>
                      <p className="text-2xl font-bold text-red-700">7.0%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        87 đơn
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Hoàn thành
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        93.0%
                      </p>
                      <p className="text-xs text-green-600 mt-1">Xuất sắc ✓</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-2 gap-6">
            <TopPerformersChart
              title="🏆 Top xe được thuê nhiều nhất"
              data={topVehicles}
              valueLabel="Lượt thuê"
              showRankBadge
            />
            <TopPerformersChart
              title="👑 Top khách hàng VIP"
              data={topCustomers}
              valueLabel="Doanh thu"
              showRankBadge
            />
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <RevenueChart />

          <Card>
            <CardHeader>
              <CardTitle>💰 Chi tiết doanh thu</CardTitle>
              <CardDescription>Phân tích doanh thu theo nguồn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Doanh thu thuê xe
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {revenueDetail
                      ? `${(revenueDetail.revenueFromRental / 1000000000).toFixed(2)}B VNĐ`
                      : "5.85B VNĐ"}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {revenueDetail &&
                    revenueDetail.revenueFromRental +
                      revenueDetail.revenueFromExtraFee >
                      0
                      ? `${((revenueDetail.revenueFromRental / (revenueDetail.revenueFromRental + revenueDetail.revenueFromExtraFee)) * 100).toFixed(1)}% tổng doanh thu`
                      : "89.7% tổng doanh thu"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Phụ phí & Extra
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {revenueDetail
                      ? `${(revenueDetail.revenueFromExtraFee / 1000000).toFixed(0)}M VNĐ`
                      : "520M VNĐ"}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {revenueDetail &&
                    revenueDetail.revenueFromRental +
                      revenueDetail.revenueFromExtraFee >
                      0
                      ? `${((revenueDetail.revenueFromExtraFee / (revenueDetail.revenueFromRental + revenueDetail.revenueFromExtraFee)) * 100).toFixed(1)}% tổng doanh thu`
                      : "8.0% tổng doanh thu"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Tổng doanh thu
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {revenueDetail
                      ? `${((revenueDetail.revenueFromRental + revenueDetail.revenueFromExtraFee) / 1000000000).toFixed(2)}B VNĐ`
                      : "6.52B VNĐ"}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    2.3% tổng doanh thu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceAnalytics />
        </TabsContent>

        {/* Customer Tab */}
        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>👥 Phân tích khách hàng</CardTitle>
              <CardDescription>Đang phát triển - Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Tính năng phân tích khách hàng đang được phát triển</p>
                <p className="text-sm mt-2">
                  Sẽ bao gồm: User mới, Retention rate, CLV, Phân khúc khách
                  hàng
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <TopPerformersChart
            title="👑 Top khách hàng VIP (Theo doanh thu)"
            data={topCustomers}
            valueLabel="Doanh thu"
            showRankBadge
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
