// services/api/eventMetadataService.ts

import { ENDPOINTS } from "../config/apiConfig"; // Solo necesitas ENDPOINTS
import { EventCategory, EventType, Campus, Space } from "../types/EventTypes";
import { authService } from "./authService";
import { apiClient } from "./apiClient";

// Interfaces para las respuestas de la API
export interface EventCategoryApiResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventCategory[];
  message?: string;
  errors?: string[];
}

export interface EventTypeApiResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventType[];
  message?: string;
  errors?: string[];
}

export interface CampusApiResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Campus[];
  message?: string;
  errors?: string[];
}

export interface SpaceApiResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Space[];
  message?: string;
  errors?: string[];
}

class EventMetadataService {
  constructor() {
    // Debug: verificar que ENDPOINTS se está importando correctamente
    console.log("🔍 ENDPOINTS object:", ENDPOINTS);
    console.log("🔍 EVENT endpoints:", ENDPOINTS.EVENT);
    console.log("🔍 GET_CAMPUS endpoint:", ENDPOINTS.EVENT?.GET_CAMPUS);
    console.log("🔍 GET_CATEGORIES endpoint:", ENDPOINTS.EVENT?.GET_CATEGORIES);
    console.log("🔍 GET_TYPES endpoint:", ENDPOINTS.EVENT?.GET_TYPES);
    console.log("🔍 GET_SPACES endpoint:", ENDPOINTS.EVENT?.GET_SPACES);
  }

  // Método helper para configurar el token antes de cada petición
  private setAuthToken(): void {
    const user = authService.getCurrentUser();
    if (user?.token) {
      apiClient.setAuthToken(user.token);
    }
  }

  // Obtener todas las categorías de eventos
  async getAllEventCategories(): Promise<EventCategoryApiResponse> {
    try {
      this.setAuthToken();

      const endpoint = ENDPOINTS.EVENT.GET_CATEGORIES;
      console.log("🎯 Using endpoint for categories:", endpoint);

      if (!endpoint) {
        throw new Error("GET_CATEGORIES endpoint is undefined");
      }

      const response = await apiClient.get<EventCategoryApiResponse>(endpoint);

      console.log("📦 Backend response (GET_CATEGORIES):", response);
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching event categories:", error);
      return {
        statusCode: 500,
        isSuccess: false,
        data: [],
        message: "Error al obtener las categorías de eventos",
        errors: [error.message],
      };
    }
  }

  // Obtener todos los tipos de eventos
  async getAllEventTypes(): Promise<EventTypeApiResponse> {
    try {
      this.setAuthToken();

      const response = await apiClient.get<EventTypeApiResponse>(
        ENDPOINTS.EVENT.GET_TYPES
      );

      console.log("📦 Backend response (GET_TYPES):", response);
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching event types:", error);
      return {
        statusCode: 500,
        isSuccess: false,
        data: [],
        message: "Error al obtener los tipos de eventos",
        errors: [error.message],
      };
    }
  }

  // Obtener todos los campus
  async getAllCampus(): Promise<CampusApiResponse> {
    try {
      this.setAuthToken();

      const response = await apiClient.get<CampusApiResponse>(
        ENDPOINTS.EVENT.GET_CAMPUS
      );

      console.log("📦 Backend response (GET_CAMPUS):", response);
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching campus:", error);
      return {
        statusCode: 500,
        isSuccess: false,
        data: [],
        message: "Error al obtener los campus",
        errors: [error.message],
      };
    }
  }

  // Obtener todos los espacios
  async getAllSpaces(): Promise<SpaceApiResponse> {
    try {
      this.setAuthToken();

      const response = await apiClient.get<SpaceApiResponse>(
        ENDPOINTS.EVENT.GET_SPACES
      );

      console.log("📦 Backend response (GET_SPACES):", response);
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching spaces:", error);
      return {
        statusCode: 500,
        isSuccess: false,
        data: [],
        message: "Error al obtener los espacios",
        errors: [error.message],
      };
    }
  }

  // Método helper para obtener espacios de un campus específico
  async getSpacesByCampus(campusId: string): Promise<Space[]> {
    try {
      const response = await this.getAllSpaces();
      if (response.isSuccess) {
        return response.data.filter((space) => space.campusId === campusId);
      }
      return [];
    } catch (error) {
      console.error("❌ Error filtering spaces by campus:", error);
      return [];
    }
  }
}

export const eventMetadataService = new EventMetadataService();
