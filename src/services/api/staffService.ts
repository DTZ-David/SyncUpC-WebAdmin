// src/services/api/staffService.ts

import { apiClient } from "./apiClient";

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
      console.log("Sending staff data to backend:", JSON.stringify(staffData, null, 2));

      const response = await apiClient.post<RegisterStaffResponse>(
        "/user/registerstaffmember",
        staffData,
        undefined, // headers
        false // requireAuth = false (registro es público)
      );

      console.log("Registration successful:", response);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      // Re-lanzamos el error para que pueda ser manejado en el componente
      throw error;
    }
  }
}

// Exportamos una instancia del servicio
export const staffService = new StaffService();
