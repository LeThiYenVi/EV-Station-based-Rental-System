// Environment Configuration
// Toggle between mock data and real API

export const ENV_CONFIG = {
  // Set to true to use mock data, false to use real API
  USE_MOCK_DATA: true, // 👈 CHANGE THIS TO false TO USE REAL API

  // API Base URL
  API_BASE_URL: __DEV__
    ? "http://localhost:3000/api" // Local development
    : "https://api.evrental.vn/api", // Production

  // Request timeout (ms)
  REQUEST_TIMEOUT: 10000,

  // Environment
  ENV: __DEV__ ? "development" : "production",
};

// Helper to check if using mock data
export const useMockData = () => ENV_CONFIG.USE_MOCK_DATA;

// Helper to get API URL
export const getApiUrl = (endpoint: string) => {
  return `${ENV_CONFIG.API_BASE_URL}${endpoint}`;
};

console.log("🌍 Environment:", ENV_CONFIG.ENV);
console.log("🎭 Mock Data:", ENV_CONFIG.USE_MOCK_DATA ? "ENABLED" : "DISABLED");
console.log("🔗 API URL:", ENV_CONFIG.API_BASE_URL);
