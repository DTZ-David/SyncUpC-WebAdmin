// src/services/api/apiClient.ts

import { API_CONFIG } from "../config/apiconfig";
import { DeleteEventRequest } from "./eventService";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null; // ← NUEVO: Token separado

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = {
      ...API_CONFIG.HEADERS,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true // ← NUEVO: Parámetro para controlar auth
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Configurar headers base
    const headers = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
    } as Record<string, string>;

    // ← NUEVO: Solo añadir Authorization si se requiere Y existe token
    if (requireAuth && this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    // Configurar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log("Making request to:", url);
      console.log("Require auth:", requireAuth);
      console.log("Headers:", headers);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no se puede parsear como JSON, usar el mensaje por defecto
        }

        throw new ApiError(errorMessage, response.status, response.statusText);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return (await response.text()) as unknown as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, "Request Timeout");
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        0,
        "Network Error"
      );
    }
  }

  async get<T>(
    endpoint: string,
    headers?: Record<string, string>,
    requireAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "GET",
        headers,
      },
      requireAuth
    );
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    requireAuth: boolean = true // ← NUEVO: Parámetro opcional
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
        headers,
      },
      requireAuth
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    requireAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
        headers,
      },
      requireAuth
    );
  }

  async delete<T>(
    endpoint: string,
    deleteData?: any, // Hacer opcional por si no siempre necesitas enviar data
    headers?: Record<string, string>,
    requireAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "DELETE",
        headers,
        body: deleteData ? JSON.stringify(deleteData) : undefined, // ← AGREGAR ESTA LÍNEA
      },
      requireAuth
    );
  }

  // ← MODIFICADO: Ahora guarda el token separadamente
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // ← MODIFICADO: Limpia el token
  removeAuthToken() {
    this.authToken = null;
  }
}

export const apiClient = new ApiClient();
