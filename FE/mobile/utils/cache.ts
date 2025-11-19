import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "@evstation_cache:";
const CACHE_EXPIRY_KEY = "@evstation_cache_expiry:";
const DEFAULT_TTL = 3600000; // 1 hour in milliseconds

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

/**
 * Save data to cache with optional TTL
 */
export async function saveToCache<T>(
  key: string,
  data: T,
  options?: CacheOptions
): Promise<void> {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_KEY + key;
    const ttl = options?.ttl ?? DEFAULT_TTL;

    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));

    // Set expiry time
    const expiryTime = Date.now() + ttl;
    await AsyncStorage.setItem(expiryKey, expiryTime.toString());
  } catch (error) {
    console.error("Error saving to cache:", error);
    throw error;
  }
}

/**
 * Get data from cache if it exists and hasn't expired
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_KEY + key;

    // Check if cache exists
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (!cachedData) {
      return null;
    }

    // Check expiry
    const expiryTime = await AsyncStorage.getItem(expiryKey);
    if (expiryTime && Date.now() > parseInt(expiryTime, 10)) {
      // Cache expired, remove it
      await removeFromCache(key);
      return null;
    }

    return JSON.parse(cachedData) as T;
  } catch (error) {
    console.error("Error getting from cache:", error);
    return null;
  }
}

/**
 * Remove data from cache
 */
export async function removeFromCache(key: string): Promise<void> {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_KEY + key;

    await AsyncStorage.multiRemove([cacheKey, expiryKey]);
  } catch (error) {
    console.error("Error removing from cache:", error);
    throw error;
  }
}

/**
 * Clear all cache data (except auth tokens)
 */
export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (key) =>
        (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_KEY)) &&
        !key.includes("token") &&
        !key.includes("auth")
    );

    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error("Error clearing cache:", error);
    throw error;
  }
}

/**
 * Check if cached data exists and is valid
 */
export async function isCacheValid(key: string): Promise<boolean> {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_KEY + key;

    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (!cachedData) {
      return false;
    }

    const expiryTime = await AsyncStorage.getItem(expiryKey);
    if (!expiryTime) {
      return false;
    }

    return Date.now() <= parseInt(expiryTime, 10);
  } catch (error) {
    console.error("Error checking cache validity:", error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalItems: number;
  totalSize: number;
  oldestItem: string | null;
  newestItem: string | null;
}> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));

    let totalSize = 0;
    let oldestTime = Infinity;
    let newestTime = 0;
    let oldestItem: string | null = null;
    let newestItem: string | null = null;

    for (const cacheKey of cacheKeys) {
      const data = await AsyncStorage.getItem(cacheKey);
      if (data) {
        totalSize += data.length;

        const key = cacheKey.replace(CACHE_PREFIX, "");
        const expiryKey = CACHE_EXPIRY_KEY + key;
        const expiryTime = await AsyncStorage.getItem(expiryKey);

        if (expiryTime) {
          const time = parseInt(expiryTime, 10);
          if (time < oldestTime) {
            oldestTime = time;
            oldestItem = key;
          }
          if (time > newestTime) {
            newestTime = time;
            newestItem = key;
          }
        }
      }
    }

    return {
      totalItems: cacheKeys.length,
      totalSize,
      oldestItem,
      newestItem,
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return {
      totalItems: 0,
      totalSize: 0,
      oldestItem: null,
      newestItem: null,
    };
  }
}
