// src/services/api/staffService.ts

import { apiClient, ApiResponse } from "./apiClient";

// Interfaces para el servicio
export interface RegisterStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  profession: string;
  department: string;
  position: string;
  facultyId: string;
  notificationPreferences: {
    eventReminder: {
      push: boolean;
      email: boolean;
      whatsApp: boolean;
    };
    eventUpdate: {
      push: boolean;
      email: boolean;
      whatsApp: boolean;
    };
    forumReply: {
      push: boolean;
      email: boolean;
      whatsApp: boolean;
    };
    forumMention: {
      push: boolean;
      email: boolean;
      whatsApp: boolean;
    };
  };
}

export interface RegisterStaffResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
}

export class StaffService {
  /**
   * Registra un nuevo miembro del staff
   * @param staffData - Datos del staff a registrar
   * @returns Promise con la respuesta del servidor
   */
  async registerStaff(
    staffData: RegisterStaffRequest
  ): Promise<RegisterStaffResponse> {
    try {
      const response = await apiClient.post<RegisterStaffResponse>(
        "/user/registerstaffmember",
        staffData
      );

      return response;
    } catch (error) {
      // Re-lanzamos el error para que pueda ser manejado en el componente
      throw error;
    }
  }
}

// Exportamos una instancia del servicio
export const staffService = new StaffService();
