import apiClient from "@/api/apiClient";

// Mock SecureStore
jest.mock("expo-secure-store");

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(apiClient).toBeDefined();
  });

  it("should have interceptors configured", () => {
    expect(apiClient.interceptors).toBeDefined();
    expect(apiClient.interceptors.request).toBeDefined();
    expect(apiClient.interceptors.response).toBeDefined();
  });
});
