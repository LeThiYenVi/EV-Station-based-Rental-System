/**
 * UserTable Component
 * Hiển thị bảng danh sách người dùng với các actions
 */

import { useState } from "react";
import { User, UserRole, UserStatus } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, status: UserStatus) => void;
  onVerify: (userId: string) => void;
  onViewDetail: (user: User) => void;
}

export default function UserTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleStatus,
  onVerify,
  onViewDetail,
}: UserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Check if all users are selected
  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  // Role badge colors
  const getRoleBadge = (role: UserRole | string) => {
    const key = String(role).toUpperCase();
    const configs: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      ADMIN: { label: "Quản trị", variant: "destructive" },
      STAFF: { label: "Nhân viên", variant: "default" },
      RENTER: { label: "Khách hàng", variant: "secondary" },
    };
    const config = configs[key] ?? {
      label: key || "Không xác định",
      variant: "outline",
    };
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  // Status badge colors
  const getStatusBadge = (status: UserStatus | string) => {
    const key = String(status).toLowerCase();
    const configs: Record<string, { label: string; className: string }> = {
      active: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      blocked: {
        label: "Bị khóa",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      pending: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
    };
    const config = configs[key] ?? {
      label: key || "Không xác định",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return (
      <Badge className={config.className} variant="outline">
        {config.label}
      </Badge>
    );
  };

  // Handle delete confirmation
  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Chọn tất cả"
                />
              </TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Xác thực</TableHead>
              <TableHead>Trạm</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={`hover:bg-gray-50 ${
                    selectedUsers.includes(user.id) ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => onSelectUser(user.id)}
                      aria-label={`Select ${user.full_name}`}
                    />
                  </TableCell>

                  {/* User Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                          {user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.phone}</div>
                      {user.license_number && (
                        <div className="text-gray-500">
                          GPLX: {user.license_number}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>{getRoleBadge(user.role)}</TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(user.status)}</TableCell>

                  {/* Verified */}
                  <TableCell>
                    {user.is_verified ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircleOutlined />
                        <span className="text-sm font-medium">Đã xác thực</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <SafetyCertificateOutlined />
                        <span className="text-sm font-medium">
                          Chưa xác thực
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Station */}
                  <TableCell>
                    {user.stationid ? (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <EnvironmentOutlined style={{ fontSize: 12 }} />
                        Trạm {user.stationid.slice(0, 8)}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreOutlined />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => onViewDetail(user)}>
                          <EyeOutlined className="mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <EditOutlined className="mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>

                        {!user.is_verified && (
                          <DropdownMenuItem onClick={() => onVerify(user.id)}>
                            <SafetyCertificateOutlined className="mr-2" />
                            Xác thực người dùng
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() =>
                            onToggleStatus(
                              user.id,
                              user.status === "active" ? "blocked" : "active",
                            )
                          }
                        >
                          {user.status === "active" ? (
                            <>
                              <StopOutlined className="mr-2" />
                              Khóa tài khoản
                            </>
                          ) : (
                            <>
                              <CheckCircleOutlined className="mr-2" />
                              Kích hoạt tài khoản
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <DeleteOutlined className="mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài khoản người dùng sẽ bị xóa
              vĩnh viễn và loại bỏ khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
