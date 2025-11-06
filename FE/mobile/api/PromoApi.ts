import { Promo } from "@/types/Promo";
import apiClient from "./apiClient";

export const PromoApi = {
  async getAll(): Promise<Promo[]> {
    const response = await apiClient.get<Promo[]>("/Promotion");
    return response.data;
  },
  async getById(): Promise<Promo[]> {
    const response = await apiClient.get<Promo[]>("/Promotion/${id}");
    return response.data;
  },

  async create(data: Partial<Promo>): Promise<Promo[]> {
    const response = await apiClient.post<Promo[]>("/Promotion", data);
    return response.data;
  },

  async update(id: string, data: Partial<Promo>): Promise<Promo[]> {
    const response = await apiClient.patch<Promo[]>("/Promotion/${id}", data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<Promo[]>("/Promotion/${id}");
  },
};
