/**
 * VehicleStats Component
 * Hiển thị thống kê performance của xe (bookings, revenue, rating)
 */

import { Vehicle } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Star, Calendar, Activity } from "lucide-react";

interface VehicleStatsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export default function VehicleStats({
  open,
  onOpenChange,
  vehicle,
}: VehicleStatsProps) {
  if (!vehicle) return null;

  // Mock data - Replace with API calls
  const stats = {
    totalBookings: 45,
    totalRevenue: 125000000,
    averageRating: 4.7,
    completedTrips: 42,
    activeBookings: 3,
    monthlyRevenue: [
      { month: "Jan", revenue: 18000000 },
      { month: "Feb", revenue: 22000000 },
      { month: "Mar", revenue: 19000000 },
      { month: "Apr", revenue: 25000000 },
      { month: "May", revenue: 21000000 },
      { month: "Jun", revenue: 20000000 },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vehicle Statistics - {vehicle.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedTrips} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {stats.averageRating}
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  From {stats.completedTrips} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.monthlyRevenue.map((item) => (
                  <div key={item.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-gray-600">
                      {item.month}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${(item.revenue / 25000000) * 100}%`,
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Model:</span>{" "}
                  <span className="font-medium">
                    {vehicle.brand} {vehicle.model}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Year:</span>{" "}
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div>
                  <span className="text-gray-600">License Plate:</span>{" "}
                  <span className="font-medium">{vehicle.license_plate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mileage:</span>{" "}
                  <span className="font-medium">
                    {vehicle.mileage.toLocaleString()} km
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Price/Day:</span>{" "}
                  <span className="font-medium">
                    {formatCurrency(vehicle.price_per_day)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Fuel Type:</span>{" "}
                  <span className="font-medium capitalize">
                    {vehicle.fuel_type}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
