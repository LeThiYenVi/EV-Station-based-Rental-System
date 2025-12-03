import { Card, Col, Progress, Row, Space, Statistic, Tabs, Select } from "antd";
import { useEffect, useState } from "react";
import bookingService from "@/service/booking/bookingService";
import vehicleService from "@/service/vehicle/vehicleService";
import { BookingStatus } from "@/service/types/enums";
import stationService from "@/service/station/stationService";
import {
  CheckCircleOutlined,
  CustomerServiceOutlined,
  CarOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

export default function StaffReports() {
  const [stats, setStats] = useState({
    todayProcessed: 0,
    weekProcessed: 0,
    monthProcessed: 0,
    vehiclesInspected: 0,
    customersSupported: 0,
    customerRating: 0,
    selfAssessment: 0,
  });
  const [stations, setStations] = useState<any[]>([]);
  const [stationId, setStationId] = useState<string>("");

  useEffect(() => {
    const loadStations = async () => {
      try {
        const page = await stationService.getAllStations({ page: 0, size: 50 });
        setStations(page.content || []);
        if ((page.content || []).length > 0) setStationId(page.content[0].id);
      } catch (e) {
        // ignore
      }
    };
    loadStations();
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [pending, confirmed, inProgress, completed, maintenanceVehicles] =
          await Promise.all([
            bookingService.getBookingsByStatus(BookingStatus.PENDING),
            bookingService.getBookingsByStatus(BookingStatus.CONFIRMED),
            bookingService.getBookingsByStatus(BookingStatus.ONGOING),
            bookingService.getBookingsByStatus(BookingStatus.COMPLETED as any),
            stationId
              ? vehicleService.getVehiclesByStation(stationId)
              : vehicleService.getVehiclesByStatus("MAINTENANCE" as any),
          ]);

        const allProcessed = [confirmed, inProgress, completed]
          .flat()
          .filter(Boolean);
        const getDate = (b: any) => new Date(b.updatedAt || b.createdAt || now);

        const todayProcessed = allProcessed.filter(
          (b: any) => getDate(b) >= startOfDay,
        ).length;
        const weekProcessed = allProcessed.filter(
          (b: any) => getDate(b) >= startOfWeek,
        ).length;
        const monthProcessed = allProcessed.filter(
          (b: any) => getDate(b) >= startOfMonth,
        ).length;

        const vehiclesInspected = (maintenanceVehicles || []).filter(
          (v: any) => v.status === "MAINTENANCE" || v.status === "maintenance",
        ).length;

        // Customers supported: approximate by license verifications from pending bookings renter set (placeholder)
        const customersSupported = (pending || []).length;

        setStats({
          todayProcessed,
          weekProcessed,
          monthProcessed,
          vehiclesInspected,
          customersSupported,
          customerRating: 4.5,
          selfAssessment: Math.min(100, Math.round((weekProcessed / 50) * 100)),
        });
      } catch (e) {
        // Keep defaults
      }
    };
    loadMetrics();
  }, [stationId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Báo cáo của Staff</h1>

      <div className="mb-4">
        <Space>
          <span>Trạm:</span>
          <Select
            value={stationId}
            onChange={setStationId}
            style={{ width: 260 }}
            placeholder="Chọn trạm"
          >
            {(stations || []).map((s: any) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Space>
              <CheckCircleOutlined className="text-green-600" />
              <Statistic
                title="Đơn đã xử lý hôm nay"
                value={stats.todayProcessed}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Statistic
              title={<span className="text-green-700">Đơn đã xử lý tuần</span>}
              value={stats.weekProcessed}
              suffix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Statistic
              title="Đơn đã xử lý tháng"
              value={stats.monthProcessed}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Space>
              <CarOutlined className="text-purple-600" />
              <Statistic
                title="Số xe đã kiểm tra"
                value={stats.vehiclesInspected}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Space>
              <CustomerServiceOutlined className="text-green-600" />
              <Statistic
                title="Khách hàng đã hỗ trợ"
                value={stats.customersSupported}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="border-green-100">
            <Statistic
              title={
                <span className="text-green-700">
                  Đánh giá từ khách (trung bình)
                </span>
              }
              value={stats.customerRating}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={<span className="text-green-700">Tự đánh giá hiệu suất</span>}
        className="border-green-100"
      >
        <Progress percent={stats.selfAssessment} status="active" />
      </Card>

      <Card
        title={<span className="text-green-700">Chi tiết</span>}
        className="border-green-100"
      >
        <Tabs
          items={[
            {
              key: "orders",
              label: "Đơn xử lý",
              children: <div>Biểu đồ/chi tiết đơn (đang phát triển)</div>,
            },
            {
              key: "vehicles",
              label: "Xe kiểm tra",
              children: <div>Biểu đồ/chi tiết xe (đang phát triển)</div>,
            },
            {
              key: "support",
              label: "Khách hỗ trợ",
              children: <div>Biểu đồ/chi tiết hỗ trợ (đang phát triển)</div>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
