/**
 * UserForm Component
 * Form để thêm mới hoặc chỉnh sửa user với validation
 */

import { useEffect, useState } from "react";
import { User, UserRole, CreateUserDto, UpdateUserDto } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null; // null = create mode, User = edit mode
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
}

export default function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    password: "",
    role: "renter" as UserRole,
    license_number: "",
    identity_number: "",
    stationid: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        // Edit mode - populate form with user data
        setFormData({
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          password: "", // Don't populate password
          role: user.role,
          license_number: user.license_number || "",
          identity_number: user.identity_number || "",
          stationid: user.stationid || "",
        });
        setAvatarPreview(user.avatar_url || "");
      } else {
        // Create mode - reset form
        setFormData({
          email: "",
          full_name: "",
          phone: "",
          password: "",
          role: "renter",
          license_number: "",
          identity_number: "",
          stationid: "",
        });
        setAvatarPreview("");
      }
      setErrors({});
    }
  }, [open, user]);

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-11 digits";
    }

    // Password validation (only for create mode)
    if (!user && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!user && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // License number validation (optional but format check if provided)
    if (formData.license_number && formData.license_number.length < 8) {
      newErrors.license_number = "License number must be at least 8 characters";
    }

    // Identity number validation (optional but format check if provided)
    if (
      formData.identity_number &&
      !/^[0-9]{9,12}$/.test(formData.identity_number)
    ) {
      newErrors.identity_number = "Identity number must be 9-12 digits";
    }

    // Station validation for staff
    if (formData.role === "staff" && !formData.stationid) {
      newErrors.stationid = "Station is required for staff";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare data based on mode
      const submitData: CreateUserDto | UpdateUserDto = user
        ? {
            // Edit mode - only send changed fields
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role,
            license_number: formData.license_number || undefined,
            identity_number: formData.identity_number || undefined,
            stationid: formData.stationid || undefined,
          }
        : {
            // Create mode - send all required fields
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
            license_number: formData.license_number || undefined,
            identity_number: formData.identity_number || undefined,
            stationid: formData.stationid || undefined,
          };

      await onSubmit(submitData);

      toast({
        title: user ? "User Updated" : "User Created",
        description: user
          ? "User information has been updated successfully"
          : "New user has been created successfully",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {user ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information. Leave password empty to keep current password."
              : "Fill in the information below to create a new user account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-green-100 text-green-700 text-3xl font-bold">
                  {formData.full_name.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              >
                <UploadOutlined />
              </Button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                placeholder="Nguyễn Văn A"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!user && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={user ? "Leave empty to keep current" : "••••••••"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renter">Customer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Station (only for staff) */}
            {formData.role === "staff" && (
              <div className="space-y-2">
                <Label htmlFor="stationid">
                  Station ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stationid"
                  placeholder="station-uuid"
                  value={formData.stationid}
                  onChange={(e) => handleChange("stationid", e.target.value)}
                  className={errors.stationid ? "border-red-500" : ""}
                />
                {errors.stationid && (
                  <p className="text-sm text-red-500">{errors.stationid}</p>
                )}
              </div>
            )}

            {/* License Number */}
            <div className="space-y-2">
              <Label htmlFor="license_number">License Number (GPLX)</Label>
              <Input
                id="license_number"
                placeholder="12345678"
                value={formData.license_number}
                onChange={(e) => handleChange("license_number", e.target.value)}
                className={errors.license_number ? "border-red-500" : ""}
              />
              {errors.license_number && (
                <p className="text-sm text-red-500">{errors.license_number}</p>
              )}
            </div>

            {/* Identity Number */}
            <div className="space-y-2">
              <Label htmlFor="identity_number">Identity Number (CCCD)</Label>
              <Input
                id="identity_number"
                placeholder="001234567890"
                value={formData.identity_number}
                onChange={(e) =>
                  handleChange("identity_number", e.target.value)
                }
                className={errors.identity_number ? "border-red-500" : ""}
              />
              {errors.identity_number && (
                <p className="text-sm text-red-500">{errors.identity_number}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <LoadingOutlined className="mr-2" spin />}
              {user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
