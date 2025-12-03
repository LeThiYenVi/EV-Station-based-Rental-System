import { useEffect, useMemo, useState } from "react";
import { Badge, Calendar, Card, List, Radio, Space, Tag } from "antd";
import type { Dayjs } from "dayjs";
import bookingService from "@/service/booking/bookingService";
import vehicleService from "@/service/vehicle/vehicleService";
import { BookingStatus } from "@/service/types/enums";

type Priority = "URGENT" | "IMPORTANT" | "NORMAL";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string; // ISO date
}

const demoTasks: TaskItem[] = [];

export default function Schedule() {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>(demoTasks);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [pending, maintenance] = await Promise.all([
          bookingService.getBookingsByStatus(BookingStatus.PENDING),
          vehicleService.getVehiclesByStatus("MAINTENANCE" as any),
        ]);

        const bookingTasks: TaskItem[] = (pending || []).map((b: any) => ({
          id: `bk-${b.id}`,
          title: `Xác nhận đơn ${b.bookingCode || b.id}`,
          description: `Khách: ${b.renter?.fullName || b.renterName || ""} • Xe: ${b.vehicle?.licensePlate || b.vehiclePlate || ""}`,
          priority: "URGENT",
          date: b.createdAt || new Date().toISOString(),
        }));

        const vehicleTasks: TaskItem[] = (maintenance || []).map((v: any) => ({
          id: `vh-${v.id}`,
          title: `Kiểm tra xe ${v.licensePlate || v.plateNumber}`,
          description: `${v.brand} ${v.model || v.name || ""}`,
          priority: "IMPORTANT",
          date: v.updatedAt || new Date().toISOString(),
        }));

        setTasks([...bookingTasks, vehicleTasks]);
      } catch (e) {
        setTasks(demoTasks);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const tasksByPriority = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayTasks = tasks.filter(
      (t) => new Date(t.date).toDateString() === todayStr,
    );
    return {
      URGENT: todayTasks.filter((t) => t.priority === "URGENT"),
      IMPORTANT: todayTasks.filter((t) => t.priority === "IMPORTANT"),
      NORMAL: todayTasks.filter((t) => t.priority === "NORMAL"),
    };
  }, [value, tasks]);

  const priorityTag = (p: Priority) => {
    if (p === "URGENT") return <Tag color="red">Urgent</Tag>;
    if (p === "IMPORTANT") return <Tag color="gold">Important</Tag>;
    return <Tag color="green">Normal</Tag>;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Lịch công việc</h1>

      <Card className="border-green-100">
        <Space className="mb-4" align="center">
          <Badge color="#16a34a" text="Nhận thông báo khi có đơn mới" />
        </Space>
        <Calendar onChange={(v) => setValue(v)} fullscreen={false} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title={
            <Space>
              <Badge color="red" /> <span className="text-red-600">Urgent</span>
            </Space>
          }
        >
          <List
            dataSource={tasksByPriority.URGENT}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {priorityTag(item.priority)}
                      <span className="font-semibold">{item.title}</span>
                    </Space>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
        <Card
          title={
            <Space>
              <Badge color="gold" />{" "}
              <span className="text-yellow-600">Important</span>
            </Space>
          }
        >
          <List
            dataSource={tasksByPriority.IMPORTANT}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {priorityTag(item.priority)}
                      <span className="font-semibold">{item.title}</span>
                    </Space>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
        <Card
          title={
            <Space>
              <Badge color="green" />{" "}
              <span className="text-green-600">Normal</span>
            </Space>
          }
        >
          <List
            dataSource={tasksByPriority.NORMAL}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {priorityTag(item.priority)}
                      <span className="font-semibold">{item.title}</span>
                    </Space>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
