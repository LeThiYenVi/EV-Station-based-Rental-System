// Feedback Request DTOs
export interface CreateFeedbackRequest {
  bookingId: string; // Required - UUID of the booking
  vehicleRating: number;
  stationRating: number;
  comment: string;
}

export interface UpdateFeedbackRequest {
  vehicleRating?: number;
  stationRating?: number;
  comment?: string;
}

export interface RespondFeedbackRequest {
  response: string; // 1-1000 chars
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

// Detailed Feedback Response (from GET by ID)
export interface FeedbackDetailResponse extends FeedbackResponse {
  // Booking details
  bookingStartTime: string;
  bookingEndTime: string;
  bookingTotalAmount: number;

  // Renter details
  renterPhone: string;

  // Vehicle details
  vehicleBrand: string;
  vehiclePhotos: string[];

  // Station details
  stationAddress: string;

  // Response details
  respondedByEmail: string | null;
}

// Summary Response
export interface FeedbackSummaryResponse {
  vehicleId?: string;
  vehicleName?: string;
  vehicleLicensePlate?: string;
  stationId?: string;
  stationName?: string;
  stationAddress?: string;
  averageRating: number;
  totalFeedbackCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  recentFeedbacks: FeedbackResponse[];
}

// Statistics Response
export interface FeedbackStatisticsResponse {
  totalFeedbacks: number;
  averageVehicleRating: number;
  averageStationRating: number;
  overallAverageRating: number;
  respondedCount: number;
  pendingCount: number;
  // Distribution
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  // Top vehicles/stations
  topRatedVehicles?: Array<{
    vehicleId: string;
    vehicleName: string;
    averageRating: number;
    feedbackCount: number;
  }>;
  topRatedStations?: Array<{
    stationId: string;
    stationName: string;
    averageRating: number;
    feedbackCount: number;
  }>;
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

// Admin filter params
export interface FeedbackAdminFilterParams {
  stationId?: string;
  vehicleId?: string;
  renterId?: string;
  fromDate?: string; // ISO datetime
  toDate?: string; // ISO datetime
  minRating?: number;
  maxRating?: number;
  page?: number;
  size?: number;
}
