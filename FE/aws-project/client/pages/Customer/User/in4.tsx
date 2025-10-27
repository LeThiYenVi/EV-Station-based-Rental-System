import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMessage } from "@/components/ui/message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  Shield,
  Edit,
  Camera,
  Check,
  X,
  ChevronLeft,
  FileText,
  CreditCard,
  Lock,
  Eye,
  Car,
  Clock,
} from "lucide-react";

interface BookingOrder {
  bookingId: string;
  carName: string;
  carImage: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  total: number;
  status: "completed" | "pending" | "cancelled" | "confirmed";
  createdAt: string;
  paymentMethod: string;
  duration?: string;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const { contextHolder, showSuccess, showError, showWarning } = useMessage();

  // Booking Orders State
  const [bookingOrders, setBookingOrders] = useState<BookingOrder[]>([]);

  // User Data State
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    city: "",
    district: "",
    ward: "",
    avatar: "",

    // Driver's License Info
    licenseNumber: "",
    licenseClass: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    licenseIssuePlace: "",
    licenseFrontImage: "",
    licenseBackImage: "",
    licenseVerified: false,

    // ID Card Info
    idNumber: "",
    idIssueDate: "",
    idIssuePlace: "",

    // Statistics
    totalTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    memberSince: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const username = localStorage.getItem("username") || "";
    const storedUserData = localStorage.getItem(`userData_${username}`);

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      // Default data if not found
      setUserData({
        ...userData,
        username: username,
        fullName: username,
        memberSince: new Date().toLocaleDateString("vi-VN"),
      });
    }

    // Load booking orders from localStorage
    const savedOrders = localStorage.getItem("bookingOrders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setBookingOrders(parsedOrders);

      // Update user statistics based on orders
      const completed = parsedOrders.filter(
        (order: BookingOrder) => order.status === "completed",
      ).length;
      const total = parsedOrders.length;

      setUserData((prev) => ({
        ...prev,
        totalTrips: total,
        completedTrips: completed,
        cancelledTrips: parsedOrders.filter(
          (order: BookingOrder) => order.status === "cancelled",
        ).length,
      }));
    }
  }, []);

  const handleSaveProfile = () => {
    try {
      localStorage.setItem(
        `userData_${userData.username}`,
        JSON.stringify(userData),
      );
      showSuccess("Cập nhật thông tin thành công!");
      setEditMode(false);
      setEditingSection(null);
    } catch (error) {
      showError("Có lỗi xảy ra khi lưu thông tin!");
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatar: reader.result as string });
        showSuccess("Cập nhật ảnh đại diện thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === "front") {
          setUserData({
            ...userData,
            licenseFrontImage: reader.result as string,
          });
        } else {
          setUserData({
            ...userData,
            licenseBackImage: reader.result as string,
          });
        }
        showSuccess(
          `Tải ảnh ${side === "front" ? "mặt trước" : "mặt sau"} giấy phép lái xe thành công!`,
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Hoàn thành",
        className: "bg-green-500 text-white hover:bg-green-600",
      },
      pending: {
        label: "Chờ xác nhận",
        className: "bg-yellow-500 text-white hover:bg-yellow-600",
      },
      confirmed: {
        label: "Đã xác nhận",
        className: "bg-blue-500 text-white hover:bg-blue-600",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-500 text-white hover:bg-red-600",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}

      {/* Header */}
      <div className="bg-white text-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-gray-900 hover:bg-gray-100 mb-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={userData.avatar} alt={userData.fullName} />
                <AvatarFallback className="bg-green-700 text-white text-2xl">
                  {getInitials(userData.fullName || userData.username)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white text-black-600 rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-lg transition"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {userData.fullName || userData.username}
                </h1>
                {userData.licenseVerified && (
                  <Badge className="bg-blue-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Đã xác minh
                  </Badge>
                )}
              </div>
              <p className="text-black-100 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thành viên từ {userData.memberSince}
              </p>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-2xl font-bold">
                    {userData.completedTrips}
                  </p>
                  <p className="text-sm text-black">Chuyến đi</p>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.totalTrips - userData.completedTrips}
                  </p>
                  <p className="text-sm text-black">Đang thuê</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Thông tin cá nhân</span>
              <span className="sm:hidden">Cá nhân</span>
            </TabsTrigger>
            <TabsTrigger value="license" className="flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              <span className="hidden sm:inline">Giấy phép lái xe</span>
              <span className="sm:hidden">GPLX</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Lịch sử thuê xe</span>
              <span className="sm:hidden">Lịch sử</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Bảo mật</span>
              <span className="sm:hidden">Bảo mật</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Quản lý thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {editingSection !== "personal" ? (
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection("personal")}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection(null)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Check className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={userData.fullName}
                      onChange={(e) =>
                        setUserData({ ...userData, fullName: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={userData.dateOfBirth}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      disabled={editingSection !== "personal"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <select
                      id="gender"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">CCCD/CMND/CC</Label>
                    <Input
                      id="idNumber"
                      value={userData.idNumber}
                      onChange={(e) =>
                        setUserData({ ...userData, idNumber: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Địa chỉ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      <Input
                        id="city"
                        value={userData.city}
                        onChange={(e) =>
                          setUserData({ ...userData, city: e.target.value })
                        }
                        disabled={editingSection !== "personal"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã</Label>
                      <Input
                        id="ward"
                        value={userData.ward}
                        onChange={(e) =>
                          setUserData({ ...userData, ward: e.target.value })
                        }
                        disabled={editingSection !== "personal"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ chi tiết</Label>
                    <Input
                      id="address"
                      value={userData.address}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      disabled={editingSection !== "personal"}
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Driver's License Tab */}
          <TabsContent value="license" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Giấy phép lái xe
                      {userData.licenseVerified ? (
                        <Badge className="bg-green-500 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Đã xác minh
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Chưa xác minh</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Cung cấp thông tin giấy phép lái xe để thuê xe tự lái
                    </CardDescription>
                  </div>
                  {editingSection !== "license" ? (
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection("license")}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection(null)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Check className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Số giấy phép lái xe</Label>
                    <Input
                      id="licenseNumber"
                      value={userData.licenseNumber}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          licenseNumber: e.target.value,
                        })
                      }
                      disabled={editingSection !== "license"}
                      placeholder="VD: 012345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseClass">Hạng giấy phép</Label>
                    <select
                      id="licenseClass"
                      value={userData.licenseClass}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          licenseClass: e.target.value,
                        })
                      }
                      disabled={editingSection !== "license"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Chọn hạng</option>
                      <option value="A1">A1 - Mô tô 2 bánh {"<"} 175cc</option>
                      <option value="A2">A2 - Mô tô 2 bánh {">"} 175cc</option>
                      <option value="B1">
                        B1 - Xe ô tô {"<"} 9 chỗ, tải {"<"} 3.5 tấn
                      </option>
                      <option value="B2">
                        B2 - Xe ô tô {"<"} 9 chỗ, tải {">"} 3.5 tấn
                      </option>
                      <option value="C">C - Xe tải, xe chở hàng</option>
                      <option value="D">D - Xe khách</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseIssueDate">Ngày cấp</Label>
                    <Input
                      id="licenseIssueDate"
                      type="date"
                      value={userData.licenseIssueDate}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          licenseIssueDate: e.target.value,
                        })
                      }
                      disabled={editingSection !== "license"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">Ngày hết hạn</Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={userData.licenseExpiryDate}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          licenseExpiryDate: e.target.value,
                        })
                      }
                      disabled={editingSection !== "license"}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="licenseIssuePlace">Nơi cấp</Label>
                    <Input
                      id="licenseIssuePlace"
                      value={userData.licenseIssuePlace}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          licenseIssuePlace: e.target.value,
                        })
                      }
                      disabled={editingSection !== "license"}
                      placeholder="VD: Cục Cảnh sát giao thông"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Hình ảnh giấy phép lái xe
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vui lòng tải lên ảnh rõ nét cả hai mặt của giấy phép lái xe
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Side */}
                    <div className="space-y-2">
                      <Label>Mặt trước</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                        {userData.licenseFrontImage ? (
                          <div className="relative">
                            <img
                              src={userData.licenseFrontImage}
                              alt="License Front"
                              className="w-full h-48 object-cover rounded"
                            />
                            {editingSection === "license" && (
                              <label
                                htmlFor="license-front"
                                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer rounded opacity-0 hover:opacity-100 transition"
                              >
                                <Camera className="w-8 h-8 text-white" />
                                <input
                                  id="license-front"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleLicenseImageUpload(e, "front")
                                  }
                                  disabled={editingSection !== "license"}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="license-front"
                            className="flex flex-col items-center justify-center h-48 cursor-pointer"
                          >
                            <Camera className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Tải ảnh mặt trước
                            </p>
                            <input
                              id="license-front"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleLicenseImageUpload(e, "front")
                              }
                              disabled={editingSection !== "license"}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="space-y-2">
                      <Label>Mặt sau</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                        {userData.licenseBackImage ? (
                          <div className="relative">
                            <img
                              src={userData.licenseBackImage}
                              alt="License Back"
                              className="w-full h-48 object-cover rounded"
                            />
                            {editingSection === "license" && (
                              <label
                                htmlFor="license-back"
                                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer rounded opacity-0 hover:opacity-100 transition"
                              >
                                <Camera className="w-8 h-8 text-white" />
                                <input
                                  id="license-back"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleLicenseImageUpload(e, "back")
                                  }
                                  disabled={editingSection !== "license"}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="license-back"
                            className="flex flex-col items-center justify-center h-48 cursor-pointer"
                          >
                            <Camera className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Tải ảnh mặt sau
                            </p>
                            <input
                              id="license-back"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleLicenseImageUpload(e, "back")
                              }
                              disabled={editingSection !== "license"}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!userData.licenseVerified &&
                  userData.licenseFrontImage &&
                  userData.licenseBackImage && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 rounded-full p-2">
                          <FileText className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-yellow-900 mb-1">
                            Chờ xác minh
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Giấy phép lái xe của bạn đang được xem xét. Quá
                            trình xác minh có thể mất 1-2 ngày làm việc.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trip History Tab */}
          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lịch sử thuê xe</CardTitle>
                    <CardDescription>
                      Xem lại tất cả các chuyến đi của bạn
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Xem tất cả
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bookingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chưa có chuyến đi nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Bạn chưa có chuyến thuê xe nào. Hãy bắt đầu thuê xe ngay
                      hôm nay!
                    </p>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link to="/">Thuê xe ngay</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Mã đơn</TableHead>
                            <TableHead>Xe</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingOrders.slice(0, 5).map((order) => (
                            <TableRow
                              key={order.bookingId}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium text-xs">
                                {order.bookingId.slice(-6)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={order.carImage}
                                    alt={order.carName}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {order.carName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {order.duration || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>{order.pickupDate}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                                    <Clock className="w-3 h-3" />
                                    <span>{order.pickupTime}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                <div className="flex items-start gap-1 max-w-[150px]">
                                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-2">
                                    {order.pickupLocation}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-bold text-green-600">
                                  {formatCurrency(order.total)}
                                </p>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/order/${order.bookingId}`)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {bookingOrders.slice(0, 5).map((order) => (
                        <Card
                          key={order.bookingId}
                          className="shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3 mb-3">
                              <img
                                src={order.carImage}
                                alt={order.carName}
                                className="w-20 h-20 rounded object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-sm">
                                    {order.carName}
                                  </h4>
                                  {getStatusBadge(order.status)}
                                </div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Mã: {order.bookingId.slice(-6)}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Calendar className="w-3 h-3" />
                                  <span>{order.pickupDate}</span>
                                  <span>•</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{order.pickupTime}</span>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-3" />

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Tổng tiền
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                  {formatCurrency(order.total)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/order/${order.bookingId}`)
                                }
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Chi tiết
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {bookingOrders.length > 5 && (
                      <div className="mt-6 text-center">
                        <Button
                          variant="outline"
                          onClick={() => navigate("/history")}
                          className="w-full md:w-auto"
                        >
                          Xem tất cả {bookingOrders.length} giao dịch
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và cài đặt bảo mật
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Mật khẩu</h4>
                      <p className="text-sm text-gray-600">
                        Thay đổi mật khẩu định kỳ để bảo vệ tài khoản
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Đổi mật khẩu</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Xác thực hai yếu tố</h4>
                      <p className="text-sm text-gray-600">
                        Tăng cường bảo mật cho tài khoản của bạn
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Bật</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Email xác thực</h4>
                      <p className="text-sm text-gray-600">
                        {userData.email || "Chưa xác thực"}
                      </p>
                    </div>
                  </div>
                  {userData.email ? (
                    <Badge className="bg-green-500 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Đã xác thực
                    </Badge>
                  ) : (
                    <Button variant="outline">Xác thực</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
