/**
 * Users Management Page
 * Trang quản lý người dùng cho Admin
 * Route: /admin/users
 */

import { useState, useMemo, useEffect } from "react";
import adminService from "@/services/admin.service";

// Type aliases để tương thích với mock data
interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string | null;
  role: string;
  license_number?: string | null;
  identity_number?: string | null;
  license_card_image_url?: string | null;
  is_verified: boolean;
  verified_at?: string | null;
  status: "active" | "pending" | "blocked";
  stationid?: string | null;
  created_at: string;
  updated_at: string;
  total_bookings?: number;
  total_spent?: number;
}

interface UserFilterParams {
  search?: string;
  role?: string;
  status?: string;
  is_verified?: boolean;
  date_from?: string;
  date_to?: string;
}

interface CreateUserDto {
  email: string;
  full_name: string;
  phone: string;
  role: string;
  license_number?: string;
  identity_number?: string;
  stationid?: string;
}

interface UpdateUserDto {
  id: string;
  full_name?: string;
  phone?: string;
  role?: string;
  license_number?: string;
  identity_number?: string;
  status?: string;
  stationid?: string;
}

type UserStatus = "active" | "pending" | "blocked";

import UserTable from "@/components/admin/UserTable";
import UserFilter from "@/components/admin/UserFilter";
import UserForm from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  UserAddOutlined,
  DownloadOutlined,
  MailOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
  UserDeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { exportToCSV, exportToExcel, printUsers } from "@/lib/export-utils";

export default function Users() {
  const { toast } = useToast();

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilterParams>({});
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewDetailUser, setViewDetailUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  // ==================== FETCH DATA ====================
  useEffect(() => {
    fetchUsers();
    fetchMetrics();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0 && filters.search) {
      // Only use API filter if there's a search term
      handleFilterUsers();
    } else if (Object.keys(filters).length === 0) {
      // Reset to all users
      fetchUsers();
    }
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.users.getAllUsers();
      // Map camelCase to snake_case for frontend compatibility
      const mappedUsers = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        avatar_url: user.avatarUrl,
        role: user.role,
        license_number: user.licenseNumber,
        identity_number: user.identityNumber,
        license_card_image_url: user.licenseCardFrontImageUrl,
        is_verified: user.isLicenseVerified || false,
        verified_at: user.verifiedAt,
        status: "active" as UserStatus, // Default status
        stationid: user.stationId,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        total_bookings: user.totalBookings || 0,
        total_spent: 0,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await adminService.users.getUserMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const handleFilterUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.users.filterUsers({
        name: filters.search,
        email: filters.search,
        phone: filters.search,
        role: filters.role,
        verification: filters.is_verified,
      });

      const mappedUsers = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        avatar_url: user.avatarUrl,
        role: user.role,
        license_number: user.licenseNumber,
        identity_number: user.identityNumber,
        license_card_image_url: user.licenseCardFrontImageUrl,
        is_verified: user.isLicenseVerified || false,
        verified_at: user.verifiedAt,
        status: "active" as UserStatus,
        stationid: user.stationId,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        total_bookings: user.totalBookings || 0,
        total_spent: 0,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to filter users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTERING ====================
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(searchLower) ||
          (user.license_number && user.license_number.includes(searchLower)),
      );
    }

    // Role filter
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((user) => user.status === filters.status);
    }

    // Verified filter
    if (filters.is_verified !== undefined) {
      result = result.filter(
        (user) => user.is_verified === filters.is_verified,
      );
    }

    // Date range filter
    if (filters.date_from) {
      result = result.filter(
        (user) => new Date(user.created_at) >= new Date(filters.date_from!),
      );
    }
    if (filters.date_to) {
      result = result.filter(
        (user) => new Date(user.created_at) <= new Date(filters.date_to!),
      );
    }

    return result;
  }, [users, filters]);

  // ==================== STATISTICS ====================
  const stats = useMemo(() => {
    if (metrics) {
      return {
        total: metrics.totalUser,
        verified: metrics.totalVerifiedUser,
        active: metrics.totalUser - metrics.totalBlockedUser,
        blocked: metrics.totalBlockedUser,
      };
    }

    // Fallback calculation from local users
    const total = users.length;
    const verified = users.filter((u) => u.is_verified).length;
    const active = users.filter((u) => u.status === "active").length;
    const blocked = users.filter((u) => u.status === "blocked").length;

    return { total, verified, active, blocked };
  }, [users]);

  // ==================== CRUD OPERATIONS ====================

  /**
   * Create new user
   * NOTE: AdminApi.md không có endpoint tạo user từ Admin panel
   * Keeping mock implementation for UI demo
   */
  const handleCreateUser = async (data: CreateUserDto) => {
    try {
      // TODO: Implement create user API when available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: null,
        role: data.role,
        license_number: data.license_number || null,
        identity_number: data.identity_number || null,
        license_card_image_url: null,
        is_verified: false,
        verified_at: null,
        status: "pending",
        stationid: data.stationid || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      toast({
        title: "Tạo người dùng thành công",
        description: "Người dùng mới đã được thêm vào hệ thống",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo người dùng",
        variant: "destructive",
      });
    }
  };

  /**
   * Update existing user
   * NOTE: AdminApi.md không có endpoint update user từ Admin panel
   * Keeping mock implementation for UI demo
   */
  const handleUpdateUser = async (data: UpdateUserDto) => {
    try {
      // TODO: Implement update user API when available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(
        users.map((user) =>
          user.id === editingUser?.id
            ? {
                ...user,
                ...data,
                status: (data.status as UserStatus) || user.status,
                updated_at: new Date().toISOString(),
              }
            : user,
        ),
      );

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật người dùng",
        variant: "destructive",
      });
    }
  };

  /**
   * Delete user
   * TODO: Replace with actual API call
   */
  const handleDeleteUser = async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUsers(users.filter((user) => user.id !== userId));
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));

    toast({
      title: "Xóa thành công",
      description: "Người dùng đã được xóa khỏi hệ thống",
    });
  };

  /**
   * Toggle user status (active/blocked)
   * TODO: Replace with actual API call
   */
  const handleToggleStatus = async (userId: string, newStatus: UserStatus) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: newStatus, updated_at: new Date().toISOString() }
          : user,
      ),
    );

    toast({
      title: "Cập nhật trạng thái",
      description: `Người dùng đã được ${newStatus === "active" ? "kích hoạt" : "khóa"}`,
    });
  };

  /**
   * Verify user license
   * POST /api/staff/users/{userId}/verify-license
   */
  const handleVerifyUser = async (userId: string, approved: boolean = true) => {
    try {
      // Get current user's staff ID from auth context or use a default
      // In a real app, you'd get this from the authenticated user
      const staffId = "current-staff-id"; // TODO: Get from auth context

      await adminService.staff.verifyUserLicense(userId, staffId, approved);

      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_verified: approved,
                verified_at: approved ? new Date().toISOString() : null,
                status: approved ? "active" : user.status,
                updated_at: new Date().toISOString(),
              }
            : user,
        ),
      );

      toast({
        title: approved ? "Xác thực thành công" : "Từ chối xác thực",
        description: approved
          ? "GPLX của người dùng đã được xác thực thành công"
          : "GPLX của người dùng đã bị từ chối",
      });
    } catch (error) {
      console.error("Failed to verify user:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xác thực GPLX người dùng",
        variant: "destructive",
      });
    }
  };

  // ==================== SELECTION ====================

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.id) : []);
  };

  // ==================== BULK ACTIONS ====================

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng?`,
      )
    ) {
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);

    toast({
      title: "Xóa thành công",
      description: `Đã xóa ${selectedUsers.length} người dùng`,
    });
  };

  const handleBulkVerify = async () => {
    if (selectedUsers.length === 0) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(
      users.map((user) =>
        selectedUsers.includes(user.id)
          ? {
              ...user,
              is_verified: true,
              verified_at: new Date().toISOString(),
              status: "active",
            }
          : user,
      ),
    );

    setSelectedUsers([]);

    toast({
      title: "Xác thực thành công",
      description: `Đã xác thực ${selectedUsers.length} người dùng`,
    });
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Chưa chọn người dùng",
        description: "Vui lòng chọn người dùng để gửi email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Gửi email thành công",
      description: `Đã gửi email đến ${selectedUsers.length} người dùng`,
    });
  };

  // ==================== EXPORT ====================

  const handleExportCSV = () => {
    const dataToExport =
      selectedUsers.length > 0
        ? users.filter((u) => selectedUsers.includes(u.id))
        : filteredUsers;

    exportToCSV(dataToExport, "users");

    toast({
      title: "Xuất CSV thành công",
      description: `Đã xuất ${dataToExport.length} người dùng`,
    });
  };

  const handleExportExcel = () => {
    const dataToExport =
      selectedUsers.length > 0
        ? users.filter((u) => selectedUsers.includes(u.id))
        : filteredUsers;

    exportToExcel(dataToExport, "users");

    toast({
      title: "Xuất Excel thành công",
      description: `Đã xuất ${dataToExport.length} người dùng`,
    });
  };

  const handlePrint = () => {
    const dataToExport =
      selectedUsers.length > 0
        ? users.filter((u) => selectedUsers.includes(u.id))
        : filteredUsers;

    printUsers(dataToExport);
  };

  // ==================== FORM HANDLERS ====================

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUserFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setUserFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    if (editingUser) {
      await handleUpdateUser(data as UpdateUserDto);
    } else {
      await handleCreateUser(data as CreateUserDto);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả người dùng, vai trò và quyền hạn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserAddOutlined className="mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <TeamOutlined className="text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              Tất cả người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <UserOutlined className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {((stats.verified / stats.total) * 100).toFixed(0)}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <UserOutlined className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Người dùng đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị khóa</CardTitle>
            <UserDeleteOutlined className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.blocked}
            </div>
            <p className="text-xs text-gray-600 mt-1">Tài khoản bị khóa</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <UserFilter
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                Đã chọn {selectedUsers.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkVerify}
                className="text-green-600 hover:text-green-700"
              >
                <UserOutlined className="mr-1" />
                Xác thực
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendEmail}
                className="text-blue-600 hover:text-blue-700"
              >
                <MailOutlined className="mr-1" />
                Gửi Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700"
              >
                Xóa
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredUsers.length} người dùng
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <DownloadOutlined className="mr-2" />
                Xuất
                <MoreOutlined className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <DownloadOutlined className="mr-2" />
                Xuất CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                <DownloadOutlined className="mr-2" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <PrinterOutlined className="mr-2" />
                In
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onVerify={handleVerifyUser}
        onViewDetail={(user) => setViewDetailUser(user)}
      />

      {/* User Form Dialog */}
      <UserForm
        open={userFormOpen}
        onOpenChange={setUserFormOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
      />

      {/* View Detail Dialog */}
      <Dialog
        open={!!viewDetailUser}
        onOpenChange={() => setViewDetailUser(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về người dùng
            </DialogDescription>
          </DialogHeader>

          {viewDetailUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Họ và tên</p>
                  <p className="text-base">{viewDetailUser.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base">{viewDetailUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Số điện thoại
                  </p>
                  <p className="text-base">{viewDetailUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Vai trò</p>
                  <p className="text-base capitalize">{viewDetailUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Trạng thái
                  </p>
                  <p className="text-base capitalize">
                    {viewDetailUser.status === "active"
                      ? "Hoạt động"
                      : viewDetailUser.status === "blocked"
                        ? "Bị khóa"
                        : "Chờ duyệt"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Xác thực</p>{" "}
                  <p className="text-base">
                    {viewDetailUser.is_verified
                      ? "Đã xác thực"
                      : "Chưa xác thực"}
                  </p>
                </div>
                {viewDetailUser.license_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Số GPLX</p>
                    <p className="text-base">{viewDetailUser.license_number}</p>
                  </div>
                )}
                {viewDetailUser.identity_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Số CMND/CCCD
                    </p>
                    <p className="text-base">
                      {viewDetailUser.identity_number}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
