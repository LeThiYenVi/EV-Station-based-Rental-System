import { PromoApi } from "@/api/PromoApi";
import { Promo } from "@/types/Promo";
import { useCallback, useEffect, useState } from "react";

export function usePromo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PromoApi.getAll();
      setPromos(data);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  return { promos, isLoading, error, refetch: fetchPromos };
}
export function Delete() {}
