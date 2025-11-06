/**
 * VehicleStatusChart Component
 * Pie chart hiển thị phân bố xe theo trạng thái
 * (available, rented, maintenance, charging, unavailable)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { VehicleStatus } from "@shared/types";

interface VehicleStatusData {
  status: VehicleStatus;
  count: number;
  percentage: number;
}

interface VehicleStatusChartProps {
  data?: VehicleStatusData[];
  loading?: boolean;
}

// Status configuration
const STATUS_CONFIG = {
  available: { label: "Sẵn sàng", color: "#10b981", emoji: "🟢" },
  rented: { label: "Đang thuê", color: "#3b82f6", emoji: "🚗" },
  maintenance: { label: "Bảo trì", color: "#f59e0b", emoji: "🔧" },
  charging: { label: "Đang sạc", color: "#8b5cf6", emoji: "⚡" },
  unavailable: { label: "Không khả dụng", color: "#ef4444", emoji: "🔴" },
};

// Mock data
const mockData: VehicleStatusData[] = [
  { status: "available", count: 45, percentage: 45 },
  { status: "rented", count: 28, percentage: 28 },
  { status: "maintenance", count: 12, percentage: 12 },
  { status: "charging", count: 10, percentage: 10 },
  { status: "unavailable", count: 5, percentage: 5 },
];

export default function VehicleStatusChart({
  data = mockData,
  loading = false,
}: VehicleStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map((item) => ({
    name: STATUS_CONFIG[item.status].label,
    value: item.count,
    status: item.status,
    percentage: item.percentage,
    emoji: STATUS_CONFIG[item.status].emoji,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-1">
            {data.emoji} {data.name}
          </p>
          <p className="text-sm text-green-600">
            Số lượng: <span className="font-bold">{data.value}</span> xe
          </p>
          <p className="text-sm text-muted-foreground">
            Tỷ lệ: <span className="font-bold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phân bố xe theo trạng thái</CardTitle>
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
        <CardTitle className="text-xl">Phân bố xe theo trạng thái</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tổng số: <span className="font-bold text-primary">{total}</span> xe
        </p>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_CONFIG[entry.status as VehicleStatus].color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ fontSize: "14px" }}>
                  {entry.payload.emoji} {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Status Details */}
        <div className="mt-6 space-y-2">
          {data.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: STATUS_CONFIG[item.status].color }}
                ></div>
                <span className="text-sm font-medium">
                  {STATUS_CONFIG[item.status].emoji}{" "}
                  {STATUS_CONFIG[item.status].label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {item.count} xe
                </span>
                <span className="text-sm font-bold text-primary min-w-[45px] text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            📊 Thống kê nhanh:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Xe khả dụng:</span>
              <span className="font-bold text-blue-900">
                {data.find((d) => d.status === "available")?.count || 0} xe
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Đang hoạt động:</span>
              <span className="font-bold text-blue-900">
                {data.find((d) => d.status === "rented")?.count || 0} xe
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Cần bảo trì:</span>
              <span className="font-bold text-orange-600">
                {data.find((d) => d.status === "maintenance")?.count || 0} xe
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Tỷ lệ hoạt động:</span>
              <span className="font-bold text-green-600">
                {(
                  ((data.find((d) => d.status === "rented")?.count || 0) /
                    total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
