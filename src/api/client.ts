import appConfig from "../config/appConfig";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string | null;
};

type ApiResponse<T> = {
  data: T;
};

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const response = await fetch(`${appConfig.baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Something went wrong");
  }

  // Handle both flat responses { pre_context_token: "..." }
  // and wrapped responses { success: true, data: { pre_context_token: "..." } }
  return (data?.data ?? data) as T;
}

const apiClient = {
  get: async <T>(endpoint: string, token?: string | null): Promise<ApiResponse<T>> => ({
    data: await apiRequest<T>(endpoint, { method: "GET", token }),
  }),
  post: async <T>(
    endpoint: string,
    body?: any,
    token?: string | null,
  ): Promise<ApiResponse<T>> => ({
    data: await apiRequest<T>(endpoint, { method: "POST", body, token }),
  }),
  put: async <T>(
    endpoint: string,
    body?: any,
    token?: string | null,
  ): Promise<ApiResponse<T>> => ({
    data: await apiRequest<T>(endpoint, { method: "PUT", body, token }),
  }),
  delete: async <T>(endpoint: string, token?: string | null): Promise<ApiResponse<T>> => ({
    data: await apiRequest<T>(endpoint, { method: "DELETE", token }),
  }),
};

export default apiClient;
