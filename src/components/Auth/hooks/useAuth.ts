// src/components/Auth/hooks/useAuth.ts

import { useState } from "react";
import {
  authService,
  LoginRequest,
  LoginResponse,
} from "../../../services/api/authService";
import { ApiError } from "../../../services/api/apiClient";

export interface UseAuthReturn {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  user: any | null;
  isAuthenticated: boolean;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response: LoginResponse = await authService.login(credentials);

      if (response.isSuccess && response.data) {
        setUser(authService.getCurrentUser());
        setIsAuthenticated(true);
        setSuccess(true);
      } else {
        // Manejar errores del backend basados en la respuesta
        const errorMessage =
          response.errors && response.errors.length > 0
            ? response.errors.join(", ")
            : response.message || "Error al iniciar sesión";

        setError(errorMessage);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Manejar errores específicos de la API
        switch (err.status) {
          case 400:
            setError("Credenciales inválidas. Revisa tu email y contraseña.");
            break;
          case 401:
            setError("Email o contraseña incorrectos.");
            break;
          case 404:
            setError("Usuario no encontrado.");
            break;
          case 429:
            setError("Demasiados intentos. Intenta más tarde.");
            break;
          case 500:
            setError("Error interno del servidor. Intenta más tarde.");
            break;
          default:
            setError(err.message || "Error al conectar con el servidor.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setSuccess(false);
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    login,
    logout,
    isLoading,
    error,
    success,
    user,
    isAuthenticated,
    clearError,
  };
};
