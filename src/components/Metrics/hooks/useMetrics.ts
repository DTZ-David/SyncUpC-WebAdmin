// src/hooks/useMetrics.ts

import { useState, useEffect } from "react";
import { MetricsService } from "../../../services/api/metricsService";
import {
  AcademicMetricsResponse,
  UserMetricsResponse,
  EventMetricsResponse,
  MetricsFilters,
} from "../../../services/types/MetricsTypes";

interface MetricsState {
  academic: AcademicMetricsResponse | null;
  user: UserMetricsResponse | null;
  event: EventMetricsResponse | null;
}

interface UseMetricsReturn {
  metrics: MetricsState;
  loading: boolean;
  error: string | null;
  refreshMetrics: (filters?: MetricsFilters) => Promise<void>;
  getAcademicMetrics: (filters?: MetricsFilters) => Promise<void>;
  getUserMetrics: (filters?: MetricsFilters) => Promise<void>;
  getEventMetrics: (filters?: MetricsFilters) => Promise<void>;
}

export const useMetrics = (
  initialFilters: MetricsFilters = {},
  autoLoad: boolean = true
): UseMetricsReturn => {
  const [metrics, setMetrics] = useState<MetricsState>({
    academic: null,
    user: null,
    event: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAcademicMetrics = async (filters: MetricsFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MetricsService.getAcademicMetrics(filters);
      setMetrics((prev) => ({ ...prev, academic: data }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar métricas académicas: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserMetrics = async (filters: MetricsFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MetricsService.getUserMetrics(filters);
      setMetrics((prev) => ({ ...prev, user: data }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar métricas de usuario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getEventMetrics = async (filters: MetricsFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MetricsService.getEventMetrics(filters);
      setMetrics((prev) => ({ ...prev, event: data }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar métricas de eventos: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async (filters: MetricsFilters = initialFilters) => {
    try {
      setLoading(true);
      setError(null);
      const allMetrics = await MetricsService.getAllMetrics(filters);
      setMetrics({
        academic: allMetrics.academic,
        user: allMetrics.user,
        event: allMetrics.event,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar métricas: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      refreshMetrics(initialFilters);
    }
  }, [autoLoad]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics,
    getAcademicMetrics,
    getUserMetrics,
    getEventMetrics,
  };
};
