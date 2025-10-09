/**
 * VehicleTable Component
 * Hiển thị bảng danh sách xe với trạng thái real-time và actions
 */

import { useState } from "react";
import { Vehicle, VehicleStatus } from "@shared/types";
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
  TrendingUp,
  Wrench,
  Car,
  Battery,
  Fuel,
  Zap,
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
  onViewStats: (vehicle: Vehicle) => void;
  onViewMaintenance: (vehicle: Vehicle) => void;
  onManagePromotion: (vehicle: Vehicle) => void;
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
  onViewStats,
  onViewMaintenance,
  onManagePromotion,
}: VehicleTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const allSelected =
    vehicles.length > 0 && selectedVehicles.length === vehicles.length;

  // Status badge with colors
  const getStatusBadge = (status: VehicleStatus) => {
    const configs = {
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
      out_of_service: {
        label: "Out of Service",
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: "⚫",
      },
    };
    const config = configs[status];
    return (
      <Badge className={config.className}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  // Fuel type badge
  const getFuelTypeBadge = (fuelType: Vehicle["fuel_type"]) => {
    const configs = {
      electric: {
        label: "Electric",
        className: "bg-blue-100 text-blue-800",
        icon: <Zap className="h-3 w-3" />,
      },
      gasoline: {
        label: "Gasoline",
        className: "bg-orange-100 text-orange-800",
        icon: <Fuel className="h-3 w-3" />,
      },
      diesel: {
        label: "Diesel",
        className: "bg-purple-100 text-purple-800",
        icon: <Fuel className="h-3 w-3" />,
      },
      hybrid: {
        label: "Hybrid",
        className: "bg-teal-100 text-teal-800",
        icon: <Battery className="h-3 w-3" />,
      },
    };
    const config = configs[fuelType];
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
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
              <TableHead>Vehicle</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead>Station</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedVehicles.includes(vehicle.id)}
                    onCheckedChange={() => onSelectVehicle(vehicle.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <Car className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.brand} {vehicle.model} • {vehicle.year}
                      </div>
                      <div className="text-xs text-gray-400">
                        {vehicle.license_plate}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{vehicle.seats} seats</div>
                    <div className="text-gray-500 capitalize">
                      {vehicle.transmission}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getFuelTypeBadge(vehicle.fuel_type)}</TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(vehicle.price_per_day)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(vehicle.price_per_hour)}/hour
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {vehicle.mileage.toLocaleString()} km
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-gray-600">
                    {vehicle.stationid.slice(0, 10)}...
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetail(vehicle)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Vehicle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewStats(vehicle)}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Statistics
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onViewMaintenance(vehicle)}
                      >
                        <Wrench className="mr-2 h-4 w-4" />
                        Maintenance Schedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(vehicle.id, "available")}
                      >
                        Set Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeStatus(vehicle.id, "maintenance")
                        }
                      >
                        Set Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeStatus(vehicle.id, "out_of_service")
                        }
                      >
                        Set Out of Service
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(vehicle.id)}
                        className="text-red-600"
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vehicle and cannot be undone.
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
