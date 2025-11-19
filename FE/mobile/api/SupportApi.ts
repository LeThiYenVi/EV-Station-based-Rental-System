import { SupportContactFormData } from "@/validators/support.schema";
import apiClient from "./apiClient";

export const SupportApi = {
  async sendContact(data: SupportContactFormData): Promise<void> {
    // Endpoint assumption: POST /api/support/contact
    await apiClient.post("/api/support/contact", data);
  },
};

export default SupportApi;
