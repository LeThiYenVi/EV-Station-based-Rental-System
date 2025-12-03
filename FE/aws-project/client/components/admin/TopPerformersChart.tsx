/**
 * TopPerformersChart Component
 * Reusable Bar chart hiển thị top performers (vehicles/customers)
 * Dùng cho: Top xe được thuê nhiều nhất, Top khách hàng VIP, etc.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrophyOutlined, RiseOutlined } from "@ant-design/icons";

interface PerformerData {
  id: string;
  name: string;
  value: number;
  subtitle?: string; // e.g., "30A-12345" for vehicle, "0901234567" for customer
  rank: number;
}

interface TopPerformersChartProps {
  title: string;
  subtitle?: string;
  data: PerformerData[];
  valueLabel: string; // e.g., "Lượt thuê", "Doanh thu"
  loading?: boolean;
  showRankBadge?: boolean;
}

// Color gradient for bars (gold, silver, bronze, blue...)
const BAR_COLORS = [
  "#fbbf24", // Gold
  "#94a3b8", // Silver
  "#d97706", // Bronze
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#10b981", // Green
];

export default function TopPerformersChart({
  title,
  subtitle,
  data,
  valueLabel,
  loading = false,
  showRankBadge = true,
}: TopPerformersChartProps) {
  const formatValue = (value: number) => {
    if (valueLabel.includes("Doanh thu")) {
      // Format as currency
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(0)}M`;
      }
      return `${(value / 1000).toFixed(0)}K`;
    }
    // Format as number
    return value.toString();
  };

  const formatFullValue = (value: number) => {
    if (valueLabel.includes("Doanh thu")) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        notation: "compact",
      }).format(value);
    }
    return `${value} ${valueLabel.toLowerCase()}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            {showRankBadge && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  backgroundColor: BAR_COLORS[data.rank - 1] || "#3b82f6",
                }}
              >
                {data.rank}
              </div>
            )}
            <p className="text-sm font-medium">{data.name}</p>
          </div>
          {data.subtitle && (
            <p className="text-xs text-muted-foreground mb-1">
              {data.subtitle}
            </p>
          )}
          <p className="text-sm text-green-600 font-bold">
            {valueLabel}: {formatFullValue(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <TrophyOutlined
              style={{ fontSize: 48 }}
              className="mx-auto mb-2 opacity-50"
            />
            <p>Chưa có dữ liệu</p>
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
            <CardTitle className="text-xl flex items-center gap-2">
              <TrophyOutlined
                className="text-yellow-500"
                style={{ fontSize: 20 }}
              />
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <RiseOutlined />
            <span>Top {data.length}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#888"
              style={{ fontSize: "12px" }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888"
              style={{ fontSize: "12px" }}
              tickFormatter={formatValue}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id ?? entry.name ?? index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Top 3 Highlight */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {data.slice(0, 3).map((item, index) => (
            <div
              key={`${item.id ?? item.name}-${index}`}
              className={`p-4 rounded-lg border-2 ${
                index === 0
                  ? "border-yellow-400 bg-yellow-50"
                  : index === 1
                    ? "border-gray-400 bg-gray-50"
                    : "border-orange-400 bg-orange-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                        ? "bg-gray-400"
                        : "bg-orange-500"
                  }`}
                >
                  {index + 1}
                </div>
                <TrophyOutlined
                  className={
                    index === 0
                      ? "text-yellow-600"
                      : index === 1
                        ? "text-gray-600"
                        : "text-orange-600"
                  }
                  style={{ fontSize: 20 }}
                />
              </div>
              <p className="font-semibold text-sm truncate">{item.name}</p>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              )}
              <p
                className={`text-lg font-bold mt-1 ${
                  index === 0
                    ? "text-yellow-700"
                    : index === 1
                      ? "text-gray-700"
                      : "text-orange-700"
                }`}
              >
                {formatFullValue(item.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Full Ranking List */}
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            📋 Bảng xếp hạng đầy đủ:
          </p>
          {data.map((item) => (
            <div
              key={`${item.id ?? item.name}-${item.rank}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {showRankBadge && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor:
                        BAR_COLORS[(item.rank - 1) % BAR_COLORS.length],
                    }}
                  >
                    {item.rank}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  {formatFullValue(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
