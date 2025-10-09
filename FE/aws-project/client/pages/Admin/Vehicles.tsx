/**
 * Vehicles Page - Quản lý Xe
 * Main page cho Vehicle Management Module
 */

import { useState, useMemo } from "react";
import {
  Vehicle,
  VehicleFilterParams,
  VehicleStatus,
  CreateVehicleDto,
  UpdateVehicleDto,
} from "@shared/types";
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
import VehicleStats from "../../components/admin/VehicleStats";
import VehicleMaintenance from "../../components/admin/VehicleMaintenance";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";

export default function Vehicles() {
  const { toast } = useToast();

  // Mock data - Replace with API calls
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "v1",
      name: "Tesla Model 3 Long Range",
      model: "Model 3",
      brand: "Tesla",
      year: 2023,
      license_plate: "30A-12345",
      color: "Pearl White",
      seats: 5,
      transmission: "automatic",
      fuel_type: "electric",
      price_per_hour: 150000,
      price_per_day: 2000000,
      price_per_week: 12000000,
      battery_capacity: 82,
      range: 580,
      charging_time: 8,
      engine_power: 450,
      max_speed: 225,
      status: "available",
      mileage: 15000,
      images: ["/placeholder.svg"],
      features: ["Autopilot", "Premium Sound", "Heated Seats"],
      description: "Premium electric sedan",
      stationid: "station-1",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-05-20T00:00:00Z",
    },
    {
      id: "v2",
      name: "VinFast VF8 Plus",
      model: "VF8",
      brand: "VinFast",
      year: 2024,
      license_plate: "29B-67890",
      color: "Midnight Blue",
      seats: 5,
      transmission: "automatic",
      fuel_type: "electric",
      price_per_hour: 120000,
      price_per_day: 1500000,
      price_per_week: 9000000,
      battery_capacity: 87.7,
      range: 447,
      charging_time: 7,
      status: "rented",
      mileage: 8000,
      images: ["/placeholder.svg"],
      features: ["ADAS Level 2", "Sunroof"],
      stationid: "station-1",
      created_at: "2024-03-01T00:00:00Z",
      updated_at: "2024-05-21T00:00:00Z",
    },
    {
      id: "v3",
      name: "Toyota Camry 2.5Q",
      model: "Camry",
      brand: "Toyota",
      year: 2023,
      license_plate: "51G-11111",
      color: "Silver Metallic",
      seats: 5,
      transmission: "automatic",
      fuel_type: "gasoline",
      price_per_hour: 80000,
      price_per_day: 1000000,
      price_per_week: 6000000,
      fuel_consumption: 7.5,
      status: "maintenance",
      mileage: 25000,
      images: ["/placeholder.svg"],
      features: ["Cruise Control", "Leather Seats"],
      stationid: "station-2",
      created_at: "2023-08-10T00:00:00Z",
      updated_at: "2024-05-19T00:00:00Z",
    },
  ]);

  const [filters, setFilters] = useState<VehicleFilterParams>({});
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [statsVehicle, setStatsVehicle] = useState<Vehicle | null>(null);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceVehicle, setMaintenanceVehicle] = useState<Vehicle | null>(
    null,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filtered vehicles
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
      if (filters.fuel_type && vehicle.fuel_type !== filters.fuel_type)
        return false;
      if (filters.transmission && vehicle.transmission !== filters.transmission)
        return false;
      if (filters.seats && vehicle.seats !== filters.seats) return false;
      return true;
    });
  }, [vehicles, filters]);

  // Statistics
  const stats = useMemo(() => {
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
  }, [vehicles]);

  // Handlers
  const handleCreate = async (data: CreateVehicleDto) => {
    const newVehicle: Vehicle = {
      id: `v${vehicles.length + 1}`,
      ...data,
      status: "available",
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleUpdate = async (data: UpdateVehicleDto) => {
    if (!editingVehicle) return;
    setVehicles(
      vehicles.map((v) =>
        v.id === editingVehicle.id
          ? { ...v, ...data, updated_at: new Date().toISOString() }
          : v,
      ),
    );
  };

  const handleDelete = () => {
    setVehicles(vehicles.filter((v) => !selectedVehicles.includes(v.id)));
    setSelectedVehicles([]);
    setShowDeleteDialog(false);
    toast({
      title: "Vehicles Deleted",
      description: `${selectedVehicles.length} vehicle(s) deleted successfully`,
    });
  };

  const handleStatusChange = (status: VehicleStatus) => {
    setVehicles(
      vehicles.map((v) =>
        selectedVehicles.includes(v.id) ? { ...v, status } : v,
      ),
    );
    setSelectedVehicles([]);
    toast({
      title: "Status Updated",
      description: `Updated status for ${selectedVehicles.length} vehicle(s)`,
    });
  };

  const handleExportCSV = () => {
    const csvData = filteredVehicles.map((v) => ({
      Name: v.name,
      Brand: v.brand,
      Model: v.model,
      Year: v.year,
      "License Plate": v.license_plate,
      Seats: v.seats,
      "Fuel Type": v.fuel_type,
      Status: v.status,
      "Price/Day": v.price_per_day,
      Mileage: v.mileage,
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
      Model: v.model,
      Year: v.year,
      "License Plate": v.license_plate,
      Seats: v.seats,
      "Fuel Type": v.fuel_type,
      Status: v.status,
      "Price/Day": v.price_per_day,
      Mileage: v.mileage,
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
                      onClick={() => handleStatusChange("out_of_service")}
                    >
                      Set Out of Service
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
              setEditingVehicle(vehicle);
              setShowForm(true);
            }}
            onDelete={(vehicleId) => {
              setSelectedVehicles([vehicleId]);
              setShowDeleteDialog(true);
            }}
            onChangeStatus={(vehicleId, status) => {
              setVehicles(
                vehicles.map((v) =>
                  v.id === vehicleId ? { ...v, status } : v,
                ),
              );
            }}
            onViewDetail={(vehicle) => {
              setStatsVehicle(vehicle);
              setShowStats(true);
            }}
            onViewStats={(vehicle) => {
              setStatsVehicle(vehicle);
              setShowStats(true);
            }}
            onViewMaintenance={(vehicle) => {
              setMaintenanceVehicle(vehicle);
              setShowMaintenance(true);
            }}
            onManagePromotion={(vehicle) => {
              toast({
                title: "Coming Soon",
                description: "Promotion management feature",
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

      <VehicleStats
        open={showStats}
        onOpenChange={setShowStats}
        vehicle={statsVehicle}
      />

      <VehicleMaintenance
        open={showMaintenance}
        onOpenChange={setShowMaintenance}
        vehicle={maintenanceVehicle}
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
