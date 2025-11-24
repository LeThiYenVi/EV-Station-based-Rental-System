import { useEffect, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/service";
import type { BookingResponse } from "@/service";

/**
 * Example My Bookings List Component
 */
export default function MyBookingsExample() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const { getMyBookings, cancelBooking, loading, error } = useBooking();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const result = await getMyBookings();
    if (result) {
      setBookings(result);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const result = await cancelBooking(bookingId);
      if (result) {
        // Reload bookings
        loadBookings();
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const color = bookingService.getStatusColor(status as any);
    const variantMap: Record<string, any> = {
      yellow: "warning",
      blue: "default",
      green: "success",
      gray: "secondary",
      red: "destructive",
    };
    return variantMap[color] || "default";
  };

  if (loading && bookings.length === 0) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No bookings found. Create your first booking!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Booking #{booking.bookingCode}
                  </CardTitle>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {bookingService.getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {booking.vehicleName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">
                      {booking.totalPrice.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium">
                      {bookingService.formatBookingDate(booking.pickupTime)}
                    </p>
                    <p className="text-sm">{booking.pickupStationName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return</p>
                    <p className="font-medium">
                      {bookingService.formatBookingDate(booking.returnTime)}
                    </p>
                    <p className="text-sm">{booking.returnStationName}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/bookings/${booking.id}`)
                    }
                  >
                    View Details
                  </Button>

                  {bookingService.canCancelBooking(booking) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={loading}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
