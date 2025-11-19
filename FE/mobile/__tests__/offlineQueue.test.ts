import {
  clearOfflineQueue,
  getOfflineQueue,
  getQueueStats,
  queueOfflineAction,
  removeFromQueue,
} from "@/utils/offlineQueue";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

describe("Offline Queue", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await clearOfflineQueue();
  });

  it("should queue an action", async () => {
    const action = {
      type: "CREATE_BOOKING" as const,
      endpoint: "/api/bookings",
      method: "POST" as const,
      data: { test: "data" },
      maxRetries: 3,
    };

    await queueOfflineAction(action);
    const queue = await getOfflineQueue();

    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe("CREATE_BOOKING");
    expect(queue[0].endpoint).toBe("/api/bookings");
  });

  it("should get queue statistics", async () => {
    const action1 = {
      type: "CREATE_BOOKING" as const,
      endpoint: "/api/bookings",
      method: "POST" as const,
      data: {},
      maxRetries: 3,
    };

    const action2 = {
      type: "UPDATE_PROFILE" as const,
      endpoint: "/api/users/1",
      method: "PATCH" as const,
      data: {},
      maxRetries: 5,
    };

    await queueOfflineAction(action1);
    await queueOfflineAction(action2);

    const stats = await getQueueStats();

    expect(stats.totalActions).toBe(2);
    expect(stats.actionsByType["CREATE_BOOKING"]).toBe(1);
    expect(stats.actionsByType["UPDATE_PROFILE"]).toBe(1);
  });

  it("should remove action from queue", async () => {
    const action = {
      type: "CREATE_BOOKING" as const,
      endpoint: "/api/bookings",
      method: "POST" as const,
      data: {},
      maxRetries: 3,
    };

    await queueOfflineAction(action);
    const queue = await getOfflineQueue();
    const actionId = queue[0].id;

    await removeFromQueue(actionId);
    const updatedQueue = await getOfflineQueue();

    expect(updatedQueue).toHaveLength(0);
  });

  it("should clear entire queue", async () => {
    await queueOfflineAction({
      type: "CREATE_BOOKING" as const,
      endpoint: "/api/bookings",
      method: "POST" as const,
      data: {},
      maxRetries: 3,
    });

    await queueOfflineAction({
      type: "UPDATE_PROFILE" as const,
      endpoint: "/api/users/1",
      method: "PATCH" as const,
      data: {},
      maxRetries: 3,
    });

    await clearOfflineQueue();
    const queue = await getOfflineQueue();

    expect(queue).toHaveLength(0);
  });
});
