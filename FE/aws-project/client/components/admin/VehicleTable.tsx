/**
 * VehicleTable Component - Theo ERD
 * Hiển thị bảng danh sách xe với các fields khớp database schema
 */

import { useState } from "react";
// Minimal local types to avoid alias issues and normalize fields
type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "charging"
  | "unavailable"
  | string;
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  license_plate: string;
  type: "electricity" | "gasoline" | string;
  capacity: number;
  rating: number;
  rent_count: number;
  hourly_rate: number;
  daily_rate: number;
  deposit_amount: number;
  status: VehicleStatus;
  photos?: string[];
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Zap,
  Fuel,
  Star,
} from "lucide-react";

interface VehicleTableProps {
  vehicles: Vehicle[];
  selectedVehicles: string[];
  onSelectVehicle: (vehicleId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onChangeStatus: (vehicleId: string, status: VehicleStatus) => void;
  onViewDetail: (vehicle: Vehicle) => void;
}

export default function VehicleTable({
  vehicles,
  selectedVehicles,
  onSelectVehicle,
  onSelectAll,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetail,
}: VehicleTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const allSelected =
    vehicles.length > 0 && selectedVehicles.length === vehicles.length;

  // Status badge - theo ERD: available, rented, maintenance, charging, unavailable
  const getStatusBadge = (status: VehicleStatus) => {
    const key = String(status).toLowerCase();
    const configs: Record<
      string,
      { label: string; className: string; icon: string }
    > = {
      available: {
        label: "Available",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: "🟢",
      },
      rented: {
        label: "Rented",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: "🟡",
      },
      maintenance: {
        label: "Maintenance",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: "🔴",
      },
      charging: {
        label: "Charging",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        icon: "⚡",
      },
      unavailable: {
        label: "Unavailable",
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: "⚫",
      },
    };
    const config = configs[key] ?? {
      label: key || "Unknown",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      icon: "❔",
    };
    return (
      <Badge className={config.className}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  // Type badge (ERD: gasoline/electricity)
  const getTypeBadge = (type: Vehicle["type"]) => {
    if (type === "electricity") {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
          <Zap className="h-3 w-3" />
          Electric
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
        <Fuel className="h-3 w-3" />
        Gasoline
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDeleteClick = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      onDelete(vehicleToDelete);
      setVehicleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No vehicles found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </TableHead>
              <TableHead>Vehicle Info</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Rent Count</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedVehicles.includes(vehicle.id)}
                    onCheckedChange={() => onSelectVehicle(vehicle.id)}
                  />
                </TableCell>

                {/* Vehicle Info (name, brand, license_plate, photos) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {vehicle.photos && vehicle.photos.length > 0 ? (
                      <img
                        src={vehicle.photos[0]}
                        alt={vehicle.name}
                        className="w-16 h-16 rounded object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <Car className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.brand}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {vehicle.license_plate}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Type (ERD field) */}
                <TableCell>{getTypeBadge(vehicle.type)}</TableCell>

                {/* Capacity (ERD field, renamed from "seats") */}
                <TableCell>
                  <div className="text-sm font-medium">
                    {vehicle.capacity} seats
                  </div>
                </TableCell>

                {/* Rating (ERD field) */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {vehicle.rating.toFixed(1)}
                    </span>
                  </div>
                </TableCell>

                {/* Rent Count (ERD field) */}
                <TableCell>
                  <div className="text-sm font-medium">
                    {vehicle.rent_count} times
                  </div>
                </TableCell>

                {/* Pricing (hourly_rate, daily_rate) */}
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatCurrency(vehicle.daily_rate)}/day
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(vehicle.hourly_rate)}/hour
                    </div>
                  </div>
                </TableCell>

                {/* Deposit Amount (ERD field) */}
                <TableCell>
                  <div className="text-sm font-medium">
                    {formatCurrency(vehicle.deposit_amount)}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetail(vehicle)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Vehicle
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(vehicle.id, "available")}
                        disabled={vehicle.status === "available"}
                      >
                        🟢 Set Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(vehicle.id, "rented")}
                        disabled={vehicle.status === "rented"}
                      >
                        🟡 Set Rented
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeStatus(vehicle.id, "maintenance")
                        }
                        disabled={vehicle.status === "maintenance"}
                      >
                        🔴 Set Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(vehicle.id, "charging")}
                        disabled={
                          vehicle.status === "charging" ||
                          vehicle.type !== "electricity"
                        }
                      >
                        ⚡ Set Charging
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeStatus(vehicle.id, "unavailable")
                        }
                        disabled={vehicle.status === "unavailable"}
                      >
                        ⚫ Set Unavailable
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(vehicle.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Vehicle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
