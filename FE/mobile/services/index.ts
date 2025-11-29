// Service Layer - Export all services
export { default as api } from "./api";
export { authService } from "./auth.service";
export { userService } from "./user.service";
export { stationService } from "./station.service";
export { vehicleService } from "./vehicle.service";
export { paymentService } from "./payment.service";
export { bookingService } from "./booking.service";
export * from "./mockData";

// Legacy services for backward compatibility with mock data
import { useMockData } from "@/config/env";
import { MOCK_TRIPS, MOCK_MESSAGES } from "./mockData";

// Simulate API delay cho mock data
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Trip Service (Legacy - will be replaced with real API in Phase 6)
export const tripService = {
  getAll: async () => {
    if (useMockData()) {
      await delay();
      return MOCK_TRIPS;
    }
    // TODO: Phase 6 - Replace with bookingService
    return MOCK_TRIPS;
  },
};

// Message Service (Legacy - will be replaced with real API in Phase 8)
export const messageService = {
  getAll: async () => {
    if (useMockData()) {
      await delay();
      return MOCK_MESSAGES;
    }
    // TODO: Phase 8 - Replace with messageService
    return MOCK_MESSAGES;
  },
};
