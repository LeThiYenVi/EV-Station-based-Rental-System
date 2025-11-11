import { useEffect, useState } from "react";
import { useFleet } from "@/hooks/useFleet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fleetService } from "@/service";
import type { VehicleResponse, VehicleStatusSummary } from "@/service";

/**
 * Example Fleet Management Component for Admin/Staff
 */
export default function FleetManagementExample() {
  const [selectedStation, setSelectedStation] = useState("station-uuid-1");
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [summary, setSummary] = useState<VehicleStatusSummary | null>(null);

  const { getVehiclesAtStation, getStatusSummary, loading, error } = useFleet();

  useEffect(() => {
    if (selectedStation) {
      loadFleetData();
    }
  }, [selectedStation]);

  const loadFleetData = async () => {
    // Load vehicles
    const vehiclesResult = await getVehiclesAtStation(selectedStation);
    if (vehiclesResult) {
      setVehicles(vehiclesResult);
    }

    // Load summary
    const summaryResult = await getStatusSummary(selectedStation);
    if (summaryResult) {
      setSummary(summaryResult);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const color = fleetService.getStatusColor(status);
    const variantMap: Record<string, any> = {
      green: "success",
      blue: "default",
      yellow: "warning",
      red: "destructive",
      gray: "secondary",
    };
    return variantMap[color] || "default";
  };

  if (loading && vehicles.length === 0) {
    return <div className="text-center py-10">Loading fleet data...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Fleet Management</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalVehicles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.availableVehicles}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Rented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary.rentedVehicles}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {summary.maintenanceVehicles}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fleetService.calculateUtilizationRate(summary).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles at Station</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No vehicles found</p>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {fleetService.formatVehicleName(vehicle)}
                      </h3>
                      <Badge
                        variant={getStatusBadgeVariant(vehicle.status || "")}
                      >
                        {fleetService.getStatusText(vehicle.status || "")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Color:</span>{" "}
                        {vehicle.color}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>{" "}
                        {vehicle.seats} seats
                      </div>
                      <div>
                        <span className="font-medium">Daily Rate:</span>{" "}
                        {fleetService.formatPrice(vehicle.pricePerDay)}
                      </div>
                      <div>
                        <span className="font-medium">Rent Count:</span>{" "}
                        {vehicle.rentCount}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                      onClick={() =>
                        (window.location.href = `/admin/vehicles/${vehicle.id}`)
                      }
                    >
                      View Details
                    </button>
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                      onClick={() =>
                        (window.location.href = `/admin/vehicles/${vehicle.id}/history`)
                      }
                    >
                      History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
