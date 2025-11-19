import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const QUEUE_KEY = "@evstation_offline_queue";

export interface QueuedAction {
  id: string;
  type:
    | "CREATE_BOOKING"
    | "UPDATE_BOOKING"
    | "CANCEL_BOOKING"
    | "UPDATE_PROFILE"
    | "OTHER";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  // internal flag to indicate processing state (not persisted intentionally)
  processing?: boolean;
}

/**
 * Add action to offline queue
 */
export async function queueOfflineAction(
  action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">
): Promise<void> {
  try {
    const queue = await getOfflineQueue();

    const newAction: QueuedAction = {
      ...action,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      retryCount: 0,
    };

    queue.push(newAction);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error queuing offline action:", error);
    throw error;
  }
}

/**
 * Get all queued actions
 */
export async function getOfflineQueue(): Promise<QueuedAction[]> {
  try {
    const queueData = await AsyncStorage.getItem(QUEUE_KEY);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error("Error getting offline queue:", error);
    return [];
  }
}

/**
 * Remove action from queue
 */
export async function removeFromQueue(actionId: string): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const filteredQueue = queue.filter((action) => action.id !== actionId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filteredQueue));
  } catch (error) {
    console.error("Error removing from queue:", error);
    throw error;
  }
}

/**
 * Update action in queue (for retry count)
 */
export async function updateQueuedAction(
  actionId: string,
  updates: Partial<QueuedAction>
): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.map((action) =>
      action.id === actionId ? { ...action, ...updates } : action
    );
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
  } catch (error) {
    console.error("Error updating queued action:", error);
    throw error;
  }
}

/**
 * Clear entire offline queue
 */
export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error("Error clearing offline queue:", error);
    throw error;
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
  totalActions: number;
  actionsByType: Record<string, number>;
  oldestAction: QueuedAction | null;
  failedActions: number;
}> {
  try {
    const queue = await getOfflineQueue();

    const stats = {
      totalActions: queue.length,
      actionsByType: {} as Record<string, number>,
      oldestAction: null as QueuedAction | null,
      failedActions: 0,
    };

    queue.forEach((action) => {
      // Count by type
      stats.actionsByType[action.type] =
        (stats.actionsByType[action.type] || 0) + 1;

      // Find oldest
      if (
        !stats.oldestAction ||
        action.timestamp < stats.oldestAction.timestamp
      ) {
        stats.oldestAction = action;
      }

      // Count failed (exceeded max retries)
      if (action.retryCount >= action.maxRetries) {
        stats.failedActions++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting queue stats:", error);
    return {
      totalActions: 0,
      actionsByType: {},
      oldestAction: null,
      failedActions: 0,
    };
  }
}

/**
 * Process offline queue (call this when connection is restored)
 * @param apiClient axios-like client or function that accepts { method, url, data }
 * @param onProgress optional callback to receive progress updates
 */
export async function processOfflineQueue(
  apiClient: any,
  onProgress?: (info: {
    actionId: string;
    status: "success" | "failed" | "skipped";
    error?: string;
  }) => void
): Promise<{
  successful: number;
  failed: number;
  errors: Array<{ actionId: string; error: string }>;
}> {
  const queue = await getOfflineQueue();
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ actionId: string; error: string }>,
  };

  for (const action of queue) {
    try {
      // Skip actions that exceeded max retries
      if (action.retryCount >= action.maxRetries) {
        results.failed++;
        results.errors.push({
          actionId: action.id,
          error: "Max retries exceeded",
        });
        onProgress?.({ actionId: action.id, status: "skipped" });
        continue;
      }

      // Execute the API call
      await apiClient({
        method: action.method,
        url: action.endpoint,
        data: action.data,
      });

      // Remove from queue on success
      await removeFromQueue(action.id);
      results.successful++;
      onProgress?.({ actionId: action.id, status: "success" });
    } catch (error: any) {
      // Increment retry count
      try {
        await updateQueuedAction(action.id, {
          retryCount: action.retryCount + 1,
        });
      } catch (uErr) {
        console.error("Error updating retry count:", uErr);
      }

      results.failed++;
      const errMsg = error?.message || "Unknown error";
      results.errors.push({ actionId: action.id, error: errMsg });
      onProgress?.({ actionId: action.id, status: "failed", error: errMsg });
    }
  }

  return results;
}

let _netUnsubscribe: (() => void) | null = null;

/**
 * Start a background processor that listens for connectivity changes and processes the queue when online.
 * Returns a stop function.
 */
export function startOfflineQueueProcessor(
  apiClient: any,
  onProgress?: (info: {
    actionId: string;
    status: string;
    error?: string;
  }) => void
): () => void {
  // If already started, return existing stop
  if (_netUnsubscribe) return stopOfflineQueueProcessor;

  const handle = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      // Fire and forget
      processOfflineQueue(apiClient, onProgress).catch((err) => {
        console.error("Error processing offline queue:", err);
      });
    }
  });

  _netUnsubscribe = () => handle();
  return stopOfflineQueueProcessor;
}

export function stopOfflineQueueProcessor() {
  if (_netUnsubscribe) {
    _netUnsubscribe();
    _netUnsubscribe = null;
  }
}
