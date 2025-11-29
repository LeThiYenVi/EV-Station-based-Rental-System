export const ENV_CONFIG = {
  USE_MOCK_DATA: false,

  // API Base URL - Update this to your backend server URL
  API_BASE_URL: __DEV__
    ? "http://localhost:8080" // Use localhost when testing on same machine
    : "https://api.evrental.vn", // Production URL

  // Request timeout (ms)
  REQUEST_TIMEOUT: 30000, // Increased to 30s for slower networks

  // Environment
  ENV: __DEV__ ? "development" : "production",
};

// Helper to check if using mock data
export const useMockData = () => ENV_CONFIG.USE_MOCK_DATA;

// Helper to get API URL
export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if exists to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${ENV_CONFIG.API_BASE_URL}${cleanEndpoint}`;
};

console.log("🌍 Environment:", ENV_CONFIG.ENV);
console.log("🎭 Mock Data:", ENV_CONFIG.USE_MOCK_DATA ? "ENABLED" : "DISABLED");
console.log("🔗 API URL:", ENV_CONFIG.API_BASE_URL);
