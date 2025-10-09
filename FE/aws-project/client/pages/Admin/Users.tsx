/**
 * Users Management Page
 * Trang quản lý người dùng cho Admin
 * Route: /admin/users
 */

import { useState, useMemo } from "react";
import {
  User,
  UserFilterParams,
  CreateUserDto,
  UpdateUserDto,
  UserStatus,
} from "@shared/types";
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
  UserPlus,
  Download,
  Mail,
  MoreVertical,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Printer,
} from "lucide-react";
import { exportToCSV, exportToExcel, printUsers } from "@/lib/export-utils";

// ==================== MOCK DATA ====================
// TODO: Replace with real API calls
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@bfcar.com",
    full_name: "Nguyễn Văn Admin",
    phone: "0901234567",
    avatar_url: null,
    role: "admin",
    license_number: "12345678",
    identity_number: "001234567890",
    license_card_image_url: null,
    is_verified: true,
    verified_at: "2024-01-15T10:00:00Z",
    status: "active",
    stationid: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    total_bookings: 0,
    total_spent: 0,
  },
  {
    id: "2",
    email: "staff1@bfcar.com",
    full_name: "Trần Thị Staff",
    phone: "0912345678",
    avatar_url: null,
    role: "staff",
    license_number: "23456789",
    identity_number: "002345678901",
    license_card_image_url: null,
    is_verified: true,
    verified_at: "2024-02-10T14:00:00Z",
    status: "active",
    stationid: "station-hn-001",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    email: "customer1@gmail.com",
    full_name: "Lê Văn Customer",
    phone: "0923456789",
    avatar_url: null,
    role: "renter",
    license_number: "34567890",
    identity_number: "003456789012",
    license_card_image_url: null,
    is_verified: true,
    verified_at: "2024-03-05T09:30:00Z",
    status: "active",
    stationid: null,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    total_bookings: 15,
    total_spent: 25000000,
  },
  {
    id: "4",
    email: "customer2@gmail.com",
    full_name: "Phạm Thị Hoa",
    phone: "0934567890",
    avatar_url: null,
    role: "renter",
    license_number: null,
    identity_number: null,
    license_card_image_url: null,
    is_verified: false,
    verified_at: null,
    status: "pending",
    stationid: null,
    created_at: "2024-10-08T00:00:00Z",
    updated_at: "2024-10-08T00:00:00Z",
    total_bookings: 0,
    total_spent: 0,
  },
  {
    id: "5",
    email: "blocked@example.com",
    full_name: "Hoàng Văn Blocked",
    phone: "0945678901",
    avatar_url: null,
    role: "renter",
    license_number: "45678901",
    identity_number: "004567890123",
    license_card_image_url: null,
    is_verified: true,
    verified_at: "2024-04-01T00:00:00Z",
    status: "blocked",
    stationid: null,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-09-15T00:00:00Z",
    total_bookings: 3,
    total_spent: 5000000,
  },
];

export default function Users() {
  const { toast } = useToast();

  // State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilterParams>({});
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewDetailUser, setViewDetailUser] = useState<User | null>(null);

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
    const total = users.length;
    const verified = users.filter((u) => u.is_verified).length;
    const active = users.filter((u) => u.status === "active").length;
    const blocked = users.filter((u) => u.status === "blocked").length;

    return { total, verified, active, blocked };
  }, [users]);

  // ==================== CRUD OPERATIONS ====================

  /**
   * Create new user
   * TODO: Replace with actual API call
   */
  const handleCreateUser = async (data: CreateUserDto) => {
    // Simulate API call
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
  };

  /**
   * Update existing user
   * TODO: Replace with actual API call
   */
  const handleUpdateUser = async (data: UpdateUserDto) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(
      users.map((user) =>
        user.id === editingUser?.id
          ? {
              ...user,
              ...data,
              updated_at: new Date().toISOString(),
            }
          : user,
      ),
    );
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
      title: "User Deleted",
      description: "User has been removed from the system",
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
      title: "Status Updated",
      description: `User has been ${newStatus === "active" ? "activated" : "blocked"}`,
    });
  };

  /**
   * Verify user
   * TODO: Replace with actual API call
   */
  const handleVerifyUser = async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              is_verified: true,
              verified_at: new Date().toISOString(),
              status: "active",
              updated_at: new Date().toISOString(),
            }
          : user,
      ),
    );

    toast({
      title: "User Verified",
      description: "User has been verified successfully",
    });
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
        `Are you sure you want to delete ${selectedUsers.length} users?`,
      )
    ) {
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);

    toast({
      title: "Users Deleted",
      description: `${selectedUsers.length} users have been deleted`,
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
      title: "Users Verified",
      description: `${selectedUsers.length} users have been verified`,
    });
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to send email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email Sent",
      description: `Email sent to ${selectedUsers.length} users`,
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
      title: "Exported to CSV",
      description: `${dataToExport.length} users exported successfully`,
    });
  };

  const handleExportExcel = () => {
    const dataToExport =
      selectedUsers.length > 0
        ? users.filter((u) => selectedUsers.includes(u.id))
        : filteredUsers;

    exportToExcel(dataToExport, "users");

    toast({
      title: "Exported to Excel",
      description: `${dataToExport.length} users exported successfully`,
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {((stats.verified / stats.total) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
            <p className="text-xs text-gray-600 mt-1">Currently active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.blocked}
            </div>
            <p className="text-xs text-gray-600 mt-1">Blocked accounts</p>
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
                {selectedUsers.length} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkVerify}
                className="text-green-600 hover:text-green-700"
              >
                <UserCheck className="mr-1 h-4 w-4" />
                Verify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendEmail}
                className="text-blue-600 hover:text-blue-700"
              >
                <Mail className="mr-1 h-4 w-4" />
                Send Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredUsers.length} users
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
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
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>

          {viewDetailUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-base">{viewDetailUser.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base">{viewDetailUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-base">{viewDetailUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-base capitalize">{viewDetailUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-base capitalize">
                    {viewDetailUser.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-base">
                    {viewDetailUser.is_verified ? "Yes" : "No"}
                  </p>
                </div>
                {viewDetailUser.license_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      License Number
                    </p>
                    <p className="text-base">{viewDetailUser.license_number}</p>
                  </div>
                )}
                {viewDetailUser.identity_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Identity Number
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
