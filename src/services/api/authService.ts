// src/services/api/authService.ts

import { apiClient } from "./apiClient";

// Interfaces para el servicio de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  refreshToken: string;
  name: string;
  profilePicture: string;
  role: string;
}

export interface LoginResponse {
  statusCode: number;
  isSuccess: boolean;
  data: LoginData;
  message: string;
  errors: string[];
}

export interface User {
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  token: string;
  refreshToken: string;
}

export class AuthService {
  private readonly TOKEN_KEY = "syncupc_token";
  private readonly REFRESH_TOKEN_KEY = "syncupc_refresh_token";
  private readonly USER_KEY = "syncupc_user";

  /**
   * Realiza el login del usuario
   * @param credentials - Email y contraseña del usuario
   * @returns Promise con la respuesta del servidor
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("Attempting login with:", { email: credentials.email });

      // ← CORREGIDO: Login SIN autorización (requireAuth: false)
      const response = await apiClient.post<LoginResponse>(
        "/user/loginapp",
        credentials,
        undefined, // headers
        false // requireAuth = false ← ESTO ES CLAVE
      );

      console.log("Login response:", response);

      // Si el login es exitoso, guardar tokens y datos del usuario
      if (response.isSuccess && response.data) {
        this.saveAuthData(response.data, credentials.email);
        apiClient.setAuthToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpiar localStorage (si está disponible)
    if (typeof Storage !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    // Remover token del API client
    apiClient.removeAuthToken();
  }

  /**
   * Obtiene el usuario actual desde el almacenamiento local
   */
  getCurrentUser(): User | null {
    if (typeof Storage === "undefined") {
      return null;
    }

    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa
   */
  isAuthenticated(): boolean {
    if (typeof Storage === "undefined") {
      return false;
    }

    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = this.getCurrentUser();

    if (token && user) {
      // Configurar el token en el API client
      apiClient.setAuthToken(token);
      return true;
    }

    return false;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    if (typeof Storage === "undefined") {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el refresh token actual
   */
  getRefreshToken(): string | null {
    if (typeof Storage === "undefined") {
      return null;
    }
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Guarda los datos de autenticación
   */
  private saveAuthData(data: LoginData, email: string): void {
    if (typeof Storage === "undefined") {
      return;
    }

    const user: User = {
      name: data.name,
      email: email,
      profilePicture: data.profilePicture,
      role: data.role,
      token: data.token,
      refreshToken: data.refreshToken,
    };

    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Refresca el token de acceso
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      // Cuando implementes el refresh, también sin auth inicial:
      // const response = await apiClient.post('/auth/refresh',
      //   { refreshToken },
      //   undefined,
      //   false  // requireAuth = false
      // );

      return false;
    } catch {
      this.logout();
      return false;
    }
  }
}

// Exportamos una instancia del servicio
export const authService = new AuthService();
