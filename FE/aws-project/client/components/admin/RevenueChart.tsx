/**
 * RevenueChart Component
 * Line chart hiển thị doanh thu theo thời gian (ngày/tuần/tháng/năm)
 * Có khả năng so sánh với kỳ trước
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

type TimePeriod = "day" | "week" | "month" | "year";

interface RevenueDataPoint {
  period: string;
  current: number;
  previous: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  loading?: boolean;
}

// Mock data generator
const generateMockData = (period: TimePeriod): RevenueDataPoint[] => {
  switch (period) {
    case "day":
      return Array.from({ length: 30 }, (_, i) => ({
        period: `${i + 1}/10`,
        current: Math.floor(Math.random() * 50000000) + 20000000,
        previous: Math.floor(Math.random() * 45000000) + 18000000,
      }));
    case "week":
      return Array.from({ length: 12 }, (_, i) => ({
        period: `W${i + 1}`,
        current: Math.floor(Math.random() * 200000000) + 100000000,
        previous: Math.floor(Math.random() * 180000000) + 90000000,
      }));
    case "month":
      return [
        { period: "Jan", current: 450000000, previous: 420000000 },
        { period: "Feb", current: 480000000, previous: 440000000 },
        { period: "Mar", current: 520000000, previous: 490000000 },
        { period: "Apr", current: 580000000, previous: 510000000 },
        { period: "May", current: 620000000, previous: 570000000 },
        { period: "Jun", current: 590000000, previous: 550000000 },
        { period: "Jul", current: 680000000, previous: 620000000 },
        { period: "Aug", current: 710000000, previous: 650000000 },
        { period: "Sep", current: 730000000, previous: 680000000 },
        { period: "Oct", current: 780000000, previous: 720000000 },
      ];
    case "year":
      return Array.from({ length: 5 }, (_, i) => ({
        period: `${2020 + i}`,
        current: Math.floor(Math.random() * 5000000000) + 3000000000,
        previous: Math.floor(Math.random() * 4500000000) + 2500000000,
      }));
    default:
      return [];
  }
};

export default function RevenueChart({
  data,
  loading = false,
}: RevenueChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [showComparison, setShowComparison] = useState(true);

  const chartData = data || generateMockData(timePeriod);

  // Calculate statistics
  const currentTotal = chartData.reduce((sum, item) => sum + item.current, 0);
  const previousTotal = chartData.reduce((sum, item) => sum + item.previous, 0);
  const growth =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;
  const isPositiveGrowth = growth >= 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-1">
            {payload[0].payload.period}
          </p>
          <p className="text-sm text-green-600">
            Kỳ hiện tại: {formatFullCurrency(payload[0].value)}
          </p>
          {showComparison && payload[1] && (
            <p className="text-sm text-orange-600">
              Kỳ trước: {formatFullCurrency(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo thời gian</CardTitle>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Doanh thu theo thời gian</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              So sánh doanh thu giữa các kỳ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showComparison ? "default" : "outline"}
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              <Calendar className="h-4 w-4 mr-1" />
              So sánh
            </Button>
            <Select
              value={timePeriod}
              onValueChange={(value: TimePeriod) => setTimePeriod(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="year">Theo năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Kỳ hiện tại</p>
            <p className="text-lg font-bold text-green-700">
              {formatFullCurrency(currentTotal)}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Kỳ trước</p>
            <p className="text-lg font-bold text-orange-700">
              {formatFullCurrency(previousTotal)}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${isPositiveGrowth ? "bg-blue-50" : "bg-red-50"}`}
          >
            <p className="text-xs text-muted-foreground">Tăng trưởng</p>
            <div className="flex items-center gap-1">
              {isPositiveGrowth ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p
                className={`text-lg font-bold ${isPositiveGrowth ? "text-blue-700" : "text-red-700"}`}
              >
                {isPositiveGrowth ? "+" : ""}
                {growth.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="period"
              stroke="#888"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#888"
              style={{ fontSize: "12px" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "14px" }}
              formatter={(value) =>
                value === "current" ? "Kỳ hiện tại" : "Kỳ trước"
              }
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Kỳ hiện tại"
            />
            {showComparison && (
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Kỳ trước"
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Period Labels */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span>Doanh thu kỳ hiện tại</span>
          </div>
          {showComparison && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-orange-500 border-dashed border-t-2 border-orange-500"></div>
              <span>Doanh thu kỳ trước</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
