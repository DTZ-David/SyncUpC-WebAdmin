// src/services/metricsService.ts

import { ENDPOINTS } from "../config/apiConfig";
import {
  MetricsFilters,
  AcademicMetricsResponse,
  UserMetricsResponse,
  EventMetricsResponse,
} from "../types/MetricsTypes";
import { apiClient } from "./apiClient";

export class MetricsService {
  /**
   * Obtiene métricas académicas (distribución por facultad, asistencia por tipo de evento, etc.)
   */
  static async getAcademicMetrics(
    filters: MetricsFilters = {}
  ): Promise<AcademicMetricsResponse> {
    try {
      const response = await apiClient.post<AcademicMetricsResponse>(
        ENDPOINTS.METRICS.GET_ACADEMIC,
        filters,
        undefined,
        true // requireAuth = true
      );
      return response;
    } catch (error) {
      console.error("Error getting academic metrics:", error);
      throw error;
    }
  }

  /**
   * Obtiene métricas de usuario (retención, usuarios activos, participación, etc.)
   */
  static async getUserMetrics(
    filters: MetricsFilters = {}
  ): Promise<UserMetricsResponse> {
    try {
      const response = await apiClient.post<UserMetricsResponse>(
        ENDPOINTS.METRICS.GET_USER,
        filters,
        undefined,
        true // requireAuth = true
      );
      return response;
    } catch (error) {
      console.error("Error getting user metrics:", error);
      throw error;
    }
  }

  /**
   * Obtiene métricas de eventos (total de eventos, asistencia promedio, etc.)
   */
  static async getEventMetrics(
    filters: MetricsFilters = {}
  ): Promise<EventMetricsResponse> {
    try {
      console.log("📊 [EVENT METRICS] Enviando filtros:", filters);
      console.log("📊 [EVENT METRICS] URL:", ENDPOINTS.METRICS.GET_EVENT);

      const response = await apiClient.post<EventMetricsResponse>(
        ENDPOINTS.METRICS.GET_EVENT,
        filters,
        undefined,
        true // requireAuth = true
      );

      console.log("✅ [EVENT METRICS] Respuesta recibida:", response);
      console.log("✅ [EVENT METRICS] Success:", response?.isSuccess);
      console.log("✅ [EVENT METRICS] Data:", response?.data);

      return response;
    } catch (error) {
      console.error("❌ [EVENT METRICS] Error completo:", error);
      console.error("❌ [EVENT METRICS] Filtros que causaron error:", filters);
      throw error;
    }
  }

  /**
   * Obtiene todas las métricas de una vez
   */
  static async getAllMetrics(filters: MetricsFilters = {}) {
    try {
      const [academicMetrics, userMetrics, eventMetrics] = await Promise.all([
        this.getAcademicMetrics(filters),
        this.getUserMetrics(filters),
        this.getEventMetrics(filters),
      ]);

      return {
        academic: academicMetrics,
        user: userMetrics,
        event: eventMetrics,
      };
    } catch (error) {
      console.error("Error getting all metrics:", error);
      throw error;
    }
  }
}
