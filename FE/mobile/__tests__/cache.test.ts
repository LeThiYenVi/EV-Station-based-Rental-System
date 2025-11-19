import { getFromCache, removeFromCache, saveToCache } from "@/utils/cache";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");

describe("Cache Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save and retrieve data from cache", async () => {
    const key = "test-key";
    const data = { name: "Test User", id: 123 };

    // Save to cache
    await saveToCache(key, data, { ttl: 5 }); // 5 minute TTL

    // Retrieve from cache
    const cached = await getFromCache<typeof data>(key);
    expect(cached).toEqual(data);
  });

  it("should return null for expired cache", async () => {
    const key = "expired-key";
    const data = { value: "old data" };

    // Save with 0 TTL (immediately expired)
    await saveToCache(key, data, { ttl: 0 });

    // Wait a bit to ensure it's expired
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cached = await getFromCache<typeof data>(key);
    expect(cached).toBeNull();
  });

  it("should remove data from cache", async () => {
    const key = "remove-key";
    const data = { test: "data" };

    await saveToCache(key, data, { ttl: 5 });
    await removeFromCache(key);

    const cached = await getFromCache<typeof data>(key);
    expect(cached).toBeNull();
  });
});
