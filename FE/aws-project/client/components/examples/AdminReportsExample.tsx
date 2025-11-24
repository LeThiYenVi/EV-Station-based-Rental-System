import React, { useEffect, useState } from "react";
import { useReport } from "../../hooks/useReport";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { ReportFilters } from "../../service/types/report-staff-station.types";

/**
 * Admin Reports Dashboard Example
 * Shows revenue, utilization, peak hours, and staff performance
 */
export const AdminReportsExample: React.FC = () => {
  const {
    loading,
    error,
    getRevenueByStation,
    getUtilization,
    getPeakHours,
    getStaffPerformance,
    getCustomerRisk,
    formatCurrency,
    formatUtilizationRate,
    getUtilizationColor,
    getRiskLevelText,
    getRiskLevelColor,
    formatPeakHour,
    getDateRangePresets,
  } = useReport();

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [utilizationData, setUtilizationData] = useState<any[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<
    "last7Days" | "last30Days" | "thisMonth"
  >("last7Days");

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    const presets = getDateRangePresets();
    const filters: ReportFilters = presets[dateRange];

    // Load all reports in parallel
    const [
      revenueResult,
      utilizationResult,
      peakResult,
      staffResult,
      riskResult,
    ] = await Promise.all([
      getRevenueByStation(filters),
      getUtilization(filters),
      getPeakHours(filters),
      getStaffPerformance(filters),
      getCustomerRisk(3),
    ]);

    if (revenueResult.success && revenueResult.data) {
      setRevenueData(revenueResult.data);
    }
    if (utilizationResult.success && utilizationResult.data) {
      setUtilizationData(utilizationResult.data);
    }
    if (peakResult.success && peakResult.data) {
      setPeakHoursData(peakResult.data);
    }
    if (staffResult.success && staffResult.data) {
      setStaffData(staffResult.data);
    }
    if (riskResult.success && riskResult.data) {
      setRiskData(riskResult.data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Báo Cáo Quản Lý</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange("last7Days")}
            className={`px-4 py-2 rounded ${dateRange === "last7Days" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setDateRange("last30Days")}
            className={`px-4 py-2 rounded ${dateRange === "last30Days" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            30 ngày qua
          </button>
          <button
            onClick={() => setDateRange("thisMonth")}
            className={`px-4 py-2 rounded ${dateRange === "thisMonth" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Revenue by Station */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu Theo Trạm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Trạm</th>
                  <th className="text-right py-2">Tổng Doanh Thu</th>
                  <th className="text-right py-2">Số Booking</th>
                  <th className="text-right py-2">Giá Trị TB</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((item) => (
                  <tr key={item.stationId} className="border-b">
                    <td className="py-2">{item.stationName}</td>
                    <td className="text-right font-semibold">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="text-right">{item.totalBookings}</td>
                    <td className="text-right">
                      {formatCurrency(item.averageBookingValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Tỷ Lệ Sử Dụng Xe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {utilizationData.map((item) => (
              <div key={item.stationId} className="border rounded p-4">
                <h3 className="font-semibold mb-2">{item.stationName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng xe:</span>
                    <span>{item.totalVehicles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tỷ lệ sử dụng:</span>
                    <span className={getUtilizationColor(item.utilizationRate)}>
                      {formatUtilizationRate(item.utilizationRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giờ thuê:</span>
                    <span>{item.totalRentalHours.toFixed(1)}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Giờ Cao Điểm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {peakHoursData.slice(0, 12).map((item, index) => (
              <div key={index} className="text-center p-3 border rounded">
                <div className="text-sm text-gray-600">
                  {formatPeakHour(item.hour)}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {item.bookingCount}
                </div>
                <div className="text-xs text-gray-500">booking</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu Suất Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nhân Viên</th>
                  <th className="text-left py-2">Trạm</th>
                  <th className="text-right py-2">Booking Hoàn Thành</th>
                  <th className="text-right py-2">Doanh Thu</th>
                  <th className="text-right py-2">Đánh Giá</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((item) => (
                  <tr key={item.staffId} className="border-b">
                    <td className="py-2">
                      <div>
                        <div className="font-medium">{item.staffName}</div>
                        <div className="text-sm text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">{item.stationName || "-"}</td>
                    <td className="text-right">{item.completedBookings}</td>
                    <td className="text-right font-semibold">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="text-right">
                      {item.customerRating ? (
                        <span className="text-yellow-600">
                          ⭐ {item.customerRating.toFixed(1)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Khách Hàng Có Rủi Ro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Khách Hàng</th>
                  <th className="text-right py-2">Tổng Booking</th>
                  <th className="text-right py-2">Đã Hủy</th>
                  <th className="text-right py-2">Tỷ Lệ Hủy</th>
                  <th className="text-right py-2">Trễ Hạn</th>
                  <th className="text-right py-2">Mức Rủi Ro</th>
                </tr>
              </thead>
              <tbody>
                {riskData.map((item) => (
                  <tr key={item.customerId} className="border-b">
                    <td className="py-2">
                      <div>
                        <div className="font-medium">{item.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    </td>
                    <td className="text-right">{item.totalBookings}</td>
                    <td className="text-right">{item.cancelledBookings}</td>
                    <td className="text-right">
                      {item.cancellationRate.toFixed(1)}%
                    </td>
                    <td className="text-right">{item.lateReturns}</td>
                    <td className="text-right">
                      <Badge className={getRiskLevelColor(item.riskLevel)}>
                        {getRiskLevelText(item.riskLevel)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
