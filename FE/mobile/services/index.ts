// Service Layer - Auto switch giữa Mock và Real API
import { useMockData } from "@/config/env";
import { api } from "./api";
import { MOCK_STATIONS, MOCK_TRIPS, MOCK_MESSAGES } from "./mockData";

// Simulate API delay cho mock data
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Station Service
export const stationService = {
  getAll: async () => {
    if (useMockData()) {
      await delay();
      return MOCK_STATIONS;
    }
    return api.getStations();
  },

  getById: async (id: string) => {
    if (useMockData()) {
      await delay();
      return MOCK_STATIONS.find((s) => s.id === id);
    }
    return api.getStationById(id);
  },
};

// Trip Service
export const tripService = {
  getAll: async () => {
    if (useMockData()) {
      await delay();
      return MOCK_TRIPS;
    }
    return api.getTrips();
  },
};

// Message Service
export const messageService = {
  getAll: async () => {
    if (useMockData()) {
      await delay();
      return MOCK_MESSAGES;
    }
    return api.getMessages();
  },
};

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    if (useMockData()) {
      await delay(800);
      // Mock login success
      return {
        token: "mock_token_" + Date.now(),
        user: {
          id: "1",
          name: "Nguyễn Văn A",
          email: email,
        },
      };
    }
    return api.login(email, password);
  },

  register: async (email: string, password: string, name: string) => {
    if (useMockData()) {
      await delay(800);
      // Mock register success
      return {
        token: "mock_token_" + Date.now(),
        user: {
          id: "1",
          name: name,
          email: email,
        },
      };
    }
    return api.register(email, password, name);
  },
};
