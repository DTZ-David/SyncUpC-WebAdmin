// src/components/Auth/hooks/useStaffRegistration.ts

import { useState } from "react";
import {
  staffService,
  RegisterStaffRequest,
  RegisterStaffResponse,
} from "../../../services/api/staffService";
import { ApiError } from "../../../services/api/apiClient";

export interface UseStaffRegistrationReturn {
  registerStaff: (staffData: RegisterStaffRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  response: RegisterStaffResponse | null;
  clearError: () => void;
  reset: () => void;
}

export const useStaffRegistration = (): UseStaffRegistrationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<RegisterStaffResponse | null>(null);

  const registerStaff = async (
    staffData: RegisterStaffRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);

    try {
      const result = await staffService.registerStaff(staffData);
      setResponse(result);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        // Manejar errores específicos de la API
        switch (err.status) {
          case 400:
            setError(
              "Datos inválidos. Por favor, revisa la información ingresada."
            );
            break;
          case 409:
            setError(
              "Este email ya está registrado. Por favor, usa otro email."
            );
            break;
          case 500:
            setError(
              "Error interno del servidor. Por favor, intenta más tarde."
            );
            break;
          default:
            setError(err.message || "Error al registrar el usuario.");
        }
      } else {
        setError(
          "Error de conexión. Por favor, verifica tu conexión a internet."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    setResponse(null);
  };

  return {
    registerStaff,
    isLoading,
    error,
    success,
    response,
    clearError,
    reset,
  };
};
