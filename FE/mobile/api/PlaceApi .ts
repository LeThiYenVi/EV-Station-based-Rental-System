import { Place } from "@/types/Place";
import apiClient from "./apiClient";

export const PlaceApi = {
  async getAll(): Promise<Place[]> {
    const response = await apiClient.get<Place[]>("/Places");
    return response.data;
  },
  async getById(): Promise<Place[]> {
    const response = await apiClient.get<Place[]>("/Places/${id}");
    return response.data;
  },

  async create(data: Partial<Place>): Promise<Place[]> {
    const response = await apiClient.post<Place[]>("/Places", data);
    return response.data;
  },

  async update(id: string, data: Partial<Place>): Promise<Place[]> {
    const response = await apiClient.patch<Place[]>("/Places/${id}", data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<Place[]>("/Places/${id}");
  },
};
