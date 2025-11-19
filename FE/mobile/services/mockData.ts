// Mock Data cho Development
import type { Station, Trip, Message } from "@/types";

export const MOCK_STATIONS: Station[] = [
  {
    id: "1",
    name: "Trạm Trung Tâm",
    address: "123 Đường Nguyễn Huệ, Q1, TP.HCM",
    latitude: 10.7769,
    longitude: 106.7009,
    availableVehicles: 5,
    totalSlots: 10,
  },
  {
    id: "2",
    name: "Trạm Công Nghệ",
    address: "456 Đường Lê Lợi, Q1, TP.HCM",
    latitude: 10.7729,
    longitude: 106.6979,
    availableVehicles: 8,
    totalSlots: 12,
  },
  {
    id: "3",
    name: "Trạm Sân Bay",
    address: "789 Đường Trường Sơn, Tân Bình, TP.HCM",
    latitude: 10.8189,
    longitude: 106.6659,
    availableVehicles: 3,
    totalSlots: 8,
  },
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: "1",
    date: "18 Th11, 2025",
    from: "Trạm Trung Tâm",
    to: "Trung Tâm Park Avenue",
    duration: "25 phút",
    cost: 12.5,
    status: "completed",
  },
  {
    id: "2",
    date: "17 Th11, 2025",
    from: "Khu Công Nghệ",
    to: "Quảng Trường Trung Tâm",
    duration: "18 phút",
    cost: 9.0,
    status: "completed",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    title: "Chào Mừng Đến EV Rental",
    content: "Cảm ơn bạn đã tham gia! Bắt đầu khám phá các trạm gần bạn.",
    timestamp: "2 giờ trước",
    read: false,
    type: "notification",
  },
  {
    id: "2",
    title: "Trạm Mới Đã Mở",
    content: "Một trạm sạc mới đã mở gần vị trí của bạn.",
    timestamp: "1 ngày trước",
    read: true,
    type: "notification",
  },
  {
    id: "3",
    title: "Chuyến Đi Hoàn Thành",
    content: "Chuyến đi gần đây của bạn đã hoàn thành. Tổng: $12.50",
    timestamp: "2 ngày trước",
    read: true,
    type: "notification",
  },
];
