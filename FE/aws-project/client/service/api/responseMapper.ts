import type { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string | number;
}

export function unwrap<T = any>(response: AxiosResponse<any, any>): T {
  const payload = response?.data;
  if (payload && typeof payload === "object") {
    if ("data" in payload && payload.data !== undefined) {
      return payload.data as T;
    }
    return payload as T;
  }
  return payload as T;
}

export function unwrapArray<T = any>(response: AxiosResponse<any, any>): T[] {
  const data = unwrap<T | T[]>(response);
  return Array.isArray(data) ? data : data ? [data as T] : [];
}

export function getMessage(responseOrError: any): string | undefined {
  try {
    if (responseOrError?.data?.message) return responseOrError.data.message;
    if (responseOrError?.response?.data?.message)
      return responseOrError.response.data.message;
    if (typeof responseOrError?.message === "string")
      return responseOrError.message;
  } catch {}
  return undefined;
}
