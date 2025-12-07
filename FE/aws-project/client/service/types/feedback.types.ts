// Feedback Request DTOs
export interface CreateFeedbackRequest {
  bookingId: string;
  vehicleRating: number;
  stationRating: number;
  comment: string;
}

// Feedback Response DTOs
export interface FeedbackResponse {
  id: string;
  bookingId: string;
  bookingCode: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehicleLicensePlate: string;
  stationId: string;
  stationName: string;
  vehicleRating: number;
  stationRating: number;
  comment: string;
  isEdit: boolean;
  response: string | null;
  respondedBy: string | null;
  respondedByName: string | null;
  respondedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FeedbackPageResponse {
  content: FeedbackResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
