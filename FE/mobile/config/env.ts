export const ENV_CONFIG = {
<<<<<<< HEAD
  // Set to true to use mock data, false to use real API
  USE_MOCK_DATA: false, // 👈 Using REAL API now
=======
  USE_MOCK_DATA: false,
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5

  // API Base URL - Update this to your backend server URL
  API_BASE_URL: __DEV__
<<<<<<< HEAD
    ? "http://localhost:3001/api" // Proxy server (bypass CORS)
    : "https://api.evrental.vn/api", // Production
=======
    ? "http://localhost:8080" // Use localhost when testing on same machine
    : "https://api.evrental.vn", // Production URL
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5

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
