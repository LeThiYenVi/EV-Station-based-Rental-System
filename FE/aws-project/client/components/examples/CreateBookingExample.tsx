import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateBookingRequest } from "@/service";

/**
 * Example Create Booking Component
 */
export default function CreateBookingExample() {
  const [formData, setFormData] = useState<CreateBookingRequest>({
    vehicleId: "",
    pickupStationId: "",
    returnStationId: "",
    pickupTime: "",
    returnTime: "",
    notes: "",
  });

  const { createBooking, loading, error, clearError } = useBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createBooking(formData);

    if (result) {
      console.log("Booking created:", result);

      // Redirect to payment if payment URL exists
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        // Redirect to booking detail
        window.location.href = `/bookings/${result.id}`;
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input
              id="vehicleId"
              type="text"
              value={formData.vehicleId}
              onChange={(e) => {
                setFormData({ ...formData, vehicleId: e.target.value });
                clearError();
              }}
              required
              disabled={loading}
              placeholder="Enter vehicle UUID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupStationId">Pickup Station</Label>
              <Input
                id="pickupStationId"
                type="text"
                value={formData.pickupStationId}
                onChange={(e) =>
                  setFormData({ ...formData, pickupStationId: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="returnStationId">Return Station</Label>
              <Input
                id="returnStationId"
                type="text"
                value={formData.returnStationId}
                onChange={(e) =>
                  setFormData({ ...formData, returnStationId: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                value={formData.pickupTime}
                onChange={(e) =>
                  setFormData({ ...formData, pickupTime: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="returnTime">Return Time</Label>
              <Input
                id="returnTime"
                type="datetime-local"
                value={formData.returnTime}
                onChange={(e) =>
                  setFormData({ ...formData, returnTime: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              disabled={loading}
              placeholder="Any special requests or notes..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating booking..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
