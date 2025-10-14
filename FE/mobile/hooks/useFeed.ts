import { useState, useEffect } from "react";
import { Feed, getFeed } from "../types/Feed";

export const useFeed = () => {
  const [feeds, setFeed] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const loadFeed = async () => {
      try {
        setIsLoading(true);
        const data = await getFeed();
        setFeed(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeed();
  }, []);

  return { feeds, isLoading, error };
};
