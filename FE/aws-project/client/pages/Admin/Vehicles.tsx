/**
 * Vehicles Page - Quản lý Xe
 * Main page cho Vehicle Management Module
 */

import { useState, useMemo, useEffect } from "react";
import adminService from "@/services/admin.service";
// Local minimal typings for this page to avoid external alias dependency
type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "charging"
  | "unavailable";

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  license_plate: string;
  type: string;
  capacity: number;
  status: VehicleStatus;
  rating: number;
  rent_count: number;
  hourly_rate: number;
  daily_rate: number;
  deposit_amount: number;
}

interface VehicleFilterParams {
  search?: string;
  status?: VehicleStatus;
  type?: string;
  capacity?: number;
  min_price?: number;
  max_price?: number;
}

interface CreateVehicleDto {
  station_id: string;
  license_plate: string;
  name: string;
  brand: string;
  color: string;
  type: string;
  capacity: number;
  hourly_rate: number;
  daily_rate: number;
  deposit_amount: number;
  polices?: string;
}

interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Download,
  MoreVertical,
  Car,
  Activity,
  Wrench,
  AlertCircle,
} from "lucide-react";
import VehicleTable from "../../components/admin/VehicleTable";
import VehicleFilter from "../../components/admin/VehicleFilter";
import VehicleForm from "../../components/admin/VehicleForm";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";

export default function Vehicles() {
  const { toast } = useToast();

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchMetrics();
    fetchVehicles();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await adminService.vehicles.getVehicleMetrics();
      setMetricsData(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminService.vehicles.filterVehicles({});
      setVehicles(response.data as any);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState<VehicleFilterParams>({});
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filtered vehicles - Theo ERD fields
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !vehicle.name.toLowerCase().includes(search) &&
          !vehicle.brand.toLowerCase().includes(search) &&
          !vehicle.license_plate.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      if (filters.status && vehicle.status !== filters.status) return false;
      if (filters.type && vehicle.type !== filters.type) return false; // type thay vì fuel_type
      if (filters.capacity && vehicle.capacity !== filters.capacity)
        return false; // capacity thay vì seats
      if (filters.min_price && vehicle.daily_rate < filters.min_price)
        return false;
      if (filters.max_price && vehicle.daily_rate > filters.max_price)
        return false;
      return true;
    });
  }, [vehicles, filters]);

  // Statistics - Use API metrics if available
  const stats = useMemo(() => {
    if (metricsData) {
      return {
        total: metricsData.totalVehicles,
        available: metricsData.totalAvailable,
        inService: metricsData.totalAvailable + metricsData.totalOnGoing,
        maintenance: metricsData.totalMaintenance,
      };
    }

    // Fallback calculation (based on current vehicles list)
    const available = vehicles.filter((v) => v.status === "available").length;
    const rented = vehicles.filter((v) => v.status === "rented").length;
    const maintenance = vehicles.filter(
      (v) => v.status === "maintenance",
    ).length;
    const inService = available + rented;

    return {
      total: vehicles.length,
      available,
      inService,
      maintenance,
    };
  }, [vehicles, metricsData]);

  // Handlers với API integration
  const handleCreate = async (data: CreateVehicleDto) => {
    try {
      await adminService.vehicles.createVehicle({
        stationId: data.station_id,
        licensePlate: data.license_plate,
        name: data.name,
        brand: data.brand,
        color: data.color,
        fuelType: data.type, // Map type -> fuelType
        capacity: data.capacity,
        hourlyRate: data.hourly_rate,
        dailyRate: data.daily_rate,
        depositAmount: data.deposit_amount,
        polices: Array.isArray(data.polices)
          ? data.polices
          : data.polices
            ? [data.polices]
            : [],
      });

      await fetchVehicles(); // Refresh list
      toast({
        title: "Vehicle Created",
        description: "New vehicle has been added successfully",
      });
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to create vehicle",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: UpdateVehicleDto) => {
    if (!editingVehicle) return;

    try {
      await adminService.vehicles.updateVehicle(editingVehicle.id, {
        licensePlate: data.license_plate,
        name: data.name,
        brand: data.brand,
        color: data.color,
        fuelType: data.type,
        capacity: data.capacity,
        hourlyRate: data.hourly_rate,
        dailyRate: data.daily_rate,
        depositAmount: data.deposit_amount,
        polices: Array.isArray(data.polices)
          ? data.polices
          : data.polices
            ? [data.polices]
            : [],
      });

      await fetchVehicles();
      toast({
        title: "Vehicle Updated",
        description: "Vehicle information has been updated",
      });
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedVehicles.map((id) => adminService.vehicles.deleteVehicle(id)),
      );

      await fetchVehicles();
      setSelectedVehicles([]);
      setShowDeleteDialog(false);
      toast({
        title: "Vehicles Deleted",
        description: `${selectedVehicles.length} vehicle(s) deleted successfully`,
      });
    } catch (error) {
      console.error("Failed to delete vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to delete vehicles",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (status: VehicleStatus) => {
    try {
      await Promise.all(
        selectedVehicles.map((id) =>
          adminService.vehicles.changeVehicleStatus(id, status),
        ),
      );

      await fetchVehicles();
      setSelectedVehicles([]);
      toast({
        title: "Status Updated",
        description: `Updated status for ${selectedVehicles.length} vehicle(s)`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle status",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredVehicles.map((v) => ({
      Name: v.name,
      Brand: v.brand,
      "License Plate": v.license_plate,
      Type: v.type,
      Capacity: v.capacity,
      Status: v.status,
      Rating: v.rating,
      "Rent Count": v.rent_count,
      "Hourly Rate": v.hourly_rate,
      "Daily Rate": v.daily_rate,
      "Deposit Amount": v.deposit_amount,
    }));
    exportToCSV(csvData as any, "vehicles");
    toast({
      title: "CSV Exported",
      description: "Vehicle data exported successfully",
    });
  };

  const handleExportExcel = () => {
    const excelData = filteredVehicles.map((v) => ({
      Name: v.name,
      Brand: v.brand,
      "License Plate": v.license_plate,
      Type: v.type,
      Capacity: v.capacity,
      Status: v.status,
      Rating: v.rating,
      "Rent Count": v.rent_count,
      "Hourly Rate": v.hourly_rate,
      "Daily Rate": v.daily_rate,
      "Deposit Amount": v.deposit_amount,
    }));
    exportToExcel(excelData as any, "vehicles");
    toast({
      title: "Excel Exported",
      description: "Vehicle data exported successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Management</h1>
          <p className="text-gray-600">Manage your rental fleet</p>
        </div>
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All vehicles in fleet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <p className="text-xs text-muted-foreground">Ready to rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Service</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inService}
            </div>
            <p className="text-xs text-muted-foreground">Active vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.maintenance}
            </div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vehicles</CardTitle>
              <CardDescription>
                {filteredVehicles.length} vehicle(s) found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedVehicles.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Bulk Actions ({selectedVehicles.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("available")}
                    >
                      Set Available
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("maintenance")}
                    >
                      Set Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("charging")}
                    >
                      Set Charging
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("unavailable")}
                    >
                      Set Unavailable
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600"
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <VehicleFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
          <VehicleTable
            vehicles={filteredVehicles}
            selectedVehicles={selectedVehicles}
            onSelectVehicle={(id) => {
              setSelectedVehicles((prev) =>
                prev.includes(id)
                  ? prev.filter((v) => v !== id)
                  : [...prev, id],
              );
            }}
            onSelectAll={(checked) => {
              setSelectedVehicles(
                checked ? filteredVehicles.map((v) => v.id) : [],
              );
            }}
            onEdit={(vehicle) => {
              setEditingVehicle(vehicle as any);
              setShowForm(true);
            }}
            onDelete={(vehicleId) => {
              setSelectedVehicles([vehicleId]);
              setShowDeleteDialog(true);
            }}
            onChangeStatus={(vehicleId, status) => {
              setVehicles(
                vehicles.map((v) =>
                  v.id === vehicleId ? ({ ...v, status } as Vehicle) : v,
                ),
              );
            }}
            onViewDetail={(vehicle) => {
              toast({
                title: "Vehicle Details",
                description: `Viewing details for ${vehicle.name}`,
              });
            }}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <VehicleForm
        open={showForm}
        onOpenChange={setShowForm}
        vehicle={editingVehicle}
        onSubmit={editingVehicle ? handleUpdate : handleCreate}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Delete {selectedVehicles.length} vehicle(s)?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected vehicle(s) and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
