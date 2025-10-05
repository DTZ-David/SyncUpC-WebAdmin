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

    // Login SIN autorización (requireAuth: false)
    const response = await apiClient.post<LoginResponse>(
      "/user/loginapp",
      credentials,
      undefined, // headers
      false // requireAuth = false
    );

    console.log("Login response:", response);

    // Verificar si el login fue exitoso
    if (response.isSuccess && response.data) {
      // 🔒 VALIDACIÓN DE ROL - Rechazar estudiantes
      const userRole = response.data.role?.toLowerCase();
      
      if (userRole === 'student' || userRole === 'estudiante') {
        console.warn("Access denied: Student role not allowed in web platform");
        
        // Limpiar cualquier dato que se haya guardado
        this.clearAuthData();
        
        // Lanzar error específico para estudiantes
        throw new Error("Acceso denegado: Los estudiantes deben usar la aplicación móvil");
      }

      // 🔒 Solo permitir roles autorizados (staff, admin, etc.)
      const allowedRoles = ['staffmember', 'admin', 'administrator', 'staff'];
      const isAuthorizedRole = allowedRoles.includes(userRole || '');
      
      if (!isAuthorizedRole) {
        console.warn("Access denied: Unauthorized role:", userRole);
        
        this.clearAuthData();
        throw new Error("Acceso denegado: Tu rol no tiene permisos para acceder a la plataforma web");
      }

      console.log("✅ Role validation passed:", userRole);
      
      // Si la validación pasa, guardar tokens y datos del usuario
      this.saveAuthData(response.data, credentials.email);
      apiClient.setAuthToken(response.data.token);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    
    // Si es nuestro error de rol, mantener el mensaje específico
    if (error instanceof Error && error.message.includes("Acceso denegado")) {
      throw error;
    }
    
    // Para otros errores, usar mensaje genérico
    throw error;
  }
}

// 🔒 Método auxiliar para limpiar datos de auth
private clearAuthData(): void {
  try {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    
    // Limpiar token del apiClient
    apiClient.removeAuthToken();
    
    console.log("Auth data cleared");
  } catch (error) {
    console.warn("Error clearing auth data:", error);
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
