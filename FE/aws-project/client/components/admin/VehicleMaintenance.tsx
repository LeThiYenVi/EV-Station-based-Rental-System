/**
 * VehicleMaintenance Component
 * Quản lý lịch bảo trì xe
 */

import { useState } from "react";
import { Vehicle, MaintenanceSchedule } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Wrench, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface VehicleMaintenanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export default function VehicleMaintenance({
  open,
  onOpenChange,
  vehicle,
}: VehicleMaintenanceProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  if (!vehicle) return null;

  // Mock maintenance data - Replace with API
  const maintenanceRecords: MaintenanceSchedule[] = [
    {
      id: "m1",
      vehicle_id: vehicle.id,
      maintenance_type: "regular",
      scheduled_date: "2024-06-01",
      status: "scheduled",
      cost: 2000000,
      performed_by: undefined,
      notes: "Regular 10,000km service",
      created_at: "2024-05-20T00:00:00Z",
      updated_at: "2024-05-20T00:00:00Z",
    },
    {
      id: "m2",
      vehicle_id: vehicle.id,
      maintenance_type: "repair",
      scheduled_date: "2024-05-15",
      completed_date: "2024-05-16",
      status: "completed",
      cost: 5000000,
      performed_by: "staff-uuid-1",
      notes: "Replace brake pads",
      created_at: "2024-05-10T00:00:00Z",
      updated_at: "2024-05-16T00:00:00Z",
    },
    {
      id: "m3",
      vehicle_id: vehicle.id,
      maintenance_type: "inspection",
      scheduled_date: "2024-04-20",
      completed_date: "2024-04-20",
      status: "completed",
      cost: 500000,
      performed_by: "staff-uuid-2",
      notes: "Safety inspection",
      created_at: "2024-04-15T00:00:00Z",
      updated_at: "2024-04-20T00:00:00Z",
    },
  ];

  const getStatusBadge = (status: MaintenanceSchedule["status"]) => {
    const config = {
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
      in_progress: {
        label: "In Progress",
        className: "bg-yellow-100 text-yellow-800",
      },
      completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
      },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
    };
    return (
      <Badge className={config[status].className}>{config[status].label}</Badge>
    );
  };

  const getTypeBadge = (type: MaintenanceSchedule["maintenance_type"]) => {
    const config = {
      regular: { label: "Regular", className: "bg-blue-500" },
      repair: { label: "Repair", className: "bg-red-500" },
      inspection: { label: "Inspection", className: "bg-purple-500" },
      emergency: { label: "Emergency", className: "bg-orange-500" },
    };
    return (
      <Badge className={config[type].className}>{config[type].label}</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const totalMaintenanceCost = maintenanceRecords
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Schedule - {vehicle.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Total Maintenance</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {maintenanceRecords.length}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Wrench className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {
                  maintenanceRecords.filter((m) => m.status === "completed")
                    .length
                }
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Total Cost</span>
              </div>
              <div className="text-xl font-bold text-orange-900">
                {formatCurrency(totalMaintenanceCost)}
              </div>
            </div>
          </div>

          {/* Add New Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Schedule
            </Button>
          </div>

          {/* Maintenance Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No maintenance records yet
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {getTypeBadge(record.maintenance_type)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.scheduled_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {record.completed_date
                          ? format(
                              new Date(record.completed_date),
                              "dd/MM/yyyy",
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="font-medium">
                        {record.cost ? formatCurrency(record.cost) : "-"}
                      </TableCell>
                      <TableCell>
                        {record.performed_by ? (
                          <span className="text-blue-600">
                            Staff #{record.performed_by.slice(0, 8)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Next Scheduled Maintenance */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <span className="font-medium text-yellow-900">
                Next Scheduled Maintenance
              </span>
            </div>
            <div className="text-sm text-yellow-800">
              Regular service scheduled for{" "}
              <span className="font-bold">01/06/2024</span> at{" "}
              {vehicle.mileage + 500} km
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
