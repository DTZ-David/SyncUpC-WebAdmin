// src/services/api/eventService.ts
import { apiClient } from "./apiClient";
import { authService } from "./authService";

export interface Event {
  id: string;
  eventTitle: string;
  eventObjective: string;
  eventDate: string;
  eventLocation: string;
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  additionalDetails: string;
  imageUrls: string[];
  participantProfilePictures: string[];
  tags: string[];
  isSaved: boolean;
  // Agregar campos adicionales que puedan venir del backend
  address?: string;
  startDate?: string;
  endDate?: string;
  registrationStart?: string;
  registrationEnd?: string;
  careerIds?: string[];
  isVirtual?: boolean;
  meetingUrl?: string;
  maxCapacity?: number;
  requiresRegistration?: boolean;
  isPublic?: boolean;
  image?: string; // Para compatibilidad con diferentes formatos
}

export interface EventsResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Event[];
  message: string;
  errors: string[];
}

// Interfaces para crear evento
export interface CreateEventRequest {
  eventTitle: string;
  eventObjective: string;
  eventLocation: string;
  address: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  registrationStart: string; // ISO string
  registrationEnd: string; // ISO string
  careerIds: string[];
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  isVirtual: boolean;
  meetingUrl: string;
  maxCapacity: number;
  requiresRegistration: boolean;
  isPublic: boolean;
  tags: string[];
  imageUrls: string[];
  additionalDetails: string;
}

// Interface para actualizar evento
export interface UpdateEventRequest {
  eventId: string;
  eventTitle: string;
  eventObjective: string;
  eventLocation: string;
  address: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  registrationStart: string; // ISO string
  registrationEnd: string; // ISO string
  careerIds: string[];
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  isVirtual: boolean;
  meetingUrl: string;
  maxCapacity: number;
  requiresRegistration: boolean;
  isPublic: boolean;
  tags: string[];
  imageUrls: string[];
  additionalDetails: string;
}

export interface CreateEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Event | null;
  message: string;
  errors: string[];
}

// Interface para respuesta de actualización
export interface UpdateEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Event | null;
  message: string;
  errors: string[];
}

// ← NUEVO: Interface para eliminar evento
export interface DeleteEventRequest {
  id: string;
}

// ← NUEVO: Interface para respuesta de eliminación
export interface DeleteEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: any; // El backend puede retornar null o información adicional
  message: string;
  errors: string[];
}

class EventService {
  private readonly endpoints = {
    GET_ALL_EVENTS: "/event/getalleventsmadeforu",
    CREATE_EVENT: "/event/createevent",
    UPDATE_EVENT: "/event/updateevent",
    DELETE_EVENT: "/event/deleteevent", // ← NUEVO
  };

  async getAllEvents(): Promise<EventsResponse> {
    try {
      // Asegurar que el token esté configurado
      const user = authService.getCurrentUser();
      if (user?.token) {
        apiClient.setAuthToken(user.token);
      }

      const response = await apiClient.get<EventsResponse>(
        this.endpoints.GET_ALL_EVENTS
      );

      return response;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  async createEvent(
    eventData: CreateEventRequest
  ): Promise<CreateEventResponse> {
    try {
      // Asegurar que el token esté configurado
      const user = authService.getCurrentUser();
      if (!user?.token) {
        throw new Error("No hay token de autenticación disponible");
      }

      apiClient.setAuthToken(user.token);

      console.log("Creating event with data:", eventData);

      const response = await apiClient.post<CreateEventResponse>(
        this.endpoints.CREATE_EVENT,
        eventData,
        undefined, // headers
        true // requireAuth = true (necesita autenticación)
      );

      console.log("Create event response:", response);
      return response;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Método para actualizar evento
  async updateEvent(
    eventData: UpdateEventRequest
  ): Promise<UpdateEventResponse> {
    try {
      // Asegurar que el token esté configurado
      const user = authService.getCurrentUser();
      if (!user?.token) {
        throw new Error("No hay token de autenticación disponible");
      }

      apiClient.setAuthToken(user.token);

      console.log("Updating event with data:", eventData);

      const response = await apiClient.post<UpdateEventResponse>(
        this.endpoints.UPDATE_EVENT,
        eventData,
        undefined, // headers
        true // requireAuth = true (necesita autenticación)
      );

      console.log("Update event response:", response);
      return response;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // ← NUEVO: Método para eliminar evento
  async deleteEvent(eventId: string): Promise<DeleteEventResponse> {
    try {
      console.log(
        "🔥 [DELETE EVENT] Iniciando eliminación de evento:",
        eventId
      );

      // Asegurar que el token esté configurado
      const user = authService.getCurrentUser();
      console.log(
        "🔑 [DELETE EVENT] Usuario actual:",
        user ? "Encontrado" : "No encontrado"
      );

      if (!user?.token) {
        console.error(
          "❌ [DELETE EVENT] No hay token de autenticación disponible"
        );
        throw new Error("No hay token de autenticación disponible");
      }

      console.log(
        "🔑 [DELETE EVENT] Token encontrado, configurando apiClient..."
      );
      apiClient.setAuthToken(user.token);

      const deleteData: DeleteEventRequest = {
        id: eventId,
      };

      console.log("📦 [DELETE EVENT] Datos a enviar:", deleteData);
      console.log("🌐 [DELETE EVENT] Endpoint:", this.endpoints.DELETE_EVENT);
      console.log("🔄 [DELETE EVENT] Enviando petición de eliminación...");

      const response = await apiClient.delete<DeleteEventResponse>(
        this.endpoints.DELETE_EVENT,
        deleteData, // body data
        undefined, // headers
        true // requireAuth = true (necesita autenticación)
      );

      console.log("✅ [DELETE EVENT] Respuesta del servidor:");
      console.log("📊 Status Code:", response.statusCode);
      console.log("✅ Is Success:", response.isSuccess);
      console.log("💬 Message:", response.message);
      console.log("📄 Data:", response.data);
      console.log("🚨 Errors:", response.errors);

      if (response.isSuccess) {
        console.log(
          "🎉 [DELETE EVENT] Evento eliminado exitosamente del servidor"
        );
      } else {
        console.warn(
          "⚠️ [DELETE EVENT] El servidor respondió pero indica falla:"
        );
        console.warn("⚠️ Message:", response.message);
        console.warn("⚠️ Errors:", response.errors);
      }

      return response;
    } catch (error) {
      console.error("💥 [DELETE EVENT] Error durante la eliminación:");
      console.error("💥 Error completo:", error);
      console.error(
        "💥 Error message:",
        error instanceof Error ? error.message : "Error desconocido"
      );
      console.error(
        "💥 Stack trace:",
        error instanceof Error ? error.stack : "No disponible"
      );
      throw error;
    }
  }

  // Método para mapear datos del backend al formato del formulario
  mapBackendEventToFormData(event: Event): any {
    return {
      id: event.id, // IMPORTANTE: Incluir el ID
      eventTitle: event.eventTitle || "",
      eventObjective: event.eventObjective || "",
      eventLocation: event.eventLocation || "",
      address: event.address || "",
      startDate: event.startDate
        ? this.formatDateForInput(event.startDate)
        : event.eventDate
        ? this.formatDateForInput(event.eventDate)
        : "",
      endDate: event.endDate ? this.formatDateForInput(event.endDate) : "",
      registrationStart: event.registrationStart
        ? this.formatDateForInput(event.registrationStart)
        : "",
      registrationEnd: event.registrationEnd
        ? this.formatDateForInput(event.registrationEnd)
        : "",
      careerIds: event.careerIds || [],
      targetTeachers: Boolean(event.targetTeachers),
      targetStudents: Boolean(event.targetStudents),
      targetAdministrative: Boolean(event.targetAdministrative),
      targetGeneral: Boolean(event.targetGeneral),
      isVirtual: Boolean(event.isVirtual),
      meetingUrl: event.meetingUrl || "",
      maxCapacity: event.maxCapacity ? event.maxCapacity.toString() : "",
      requiresRegistration: Boolean(event.requiresRegistration),
      isPublic: Boolean(event.isPublic),
      tags: event.tags || [],
      imageUrls: event.imageUrls || [],
      additionalDetails: event.additionalDetails || "",
    };
  }

  // Método para transformar datos del formulario al formato de actualización
  transformFormDataToUpdateRequest(formData: any): UpdateEventRequest {
    // Obtener el ID del evento del formData
    const eventId = formData.id || formData.eventId;

    if (!eventId) {
      throw new Error("Se requiere el ID del evento para actualizar");
    }

    return {
      eventId: eventId,
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",
      eventLocation: formData.eventLocation || "",
      address: formData.address || "",
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : new Date().toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : new Date().toISOString(),
      registrationStart: formData.registrationStart
        ? new Date(formData.registrationStart).toISOString()
        : new Date().toISOString(),
      registrationEnd: formData.registrationEnd
        ? new Date(formData.registrationEnd).toISOString()
        : new Date().toISOString(),
      careerIds: formData.careerIds || [],
      targetTeachers: Boolean(formData.targetTeachers),
      targetStudents: Boolean(formData.targetStudents),
      targetAdministrative: Boolean(formData.targetAdministrative),
      targetGeneral: Boolean(formData.targetGeneral),
      isVirtual: Boolean(formData.isVirtual),
      meetingUrl: formData.meetingUrl || "",
      maxCapacity: parseInt(formData.maxCapacity) || 0,
      requiresRegistration: Boolean(formData.requiresRegistration),
      isPublic: Boolean(formData.isPublic),
      tags: formData.tags || [],
      imageUrls: formData.imageUrls || [],
      additionalDetails: formData.additionalDetails || "",
    };
  }

  // Método helper para transformar datos del form al formato de API (creación)
  transformFormDataToApiRequest(formData: any): CreateEventRequest {
    return {
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",
      eventLocation: formData.eventLocation || "",
      address: formData.address || "",
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : new Date().toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : new Date().toISOString(),
      registrationStart: formData.registrationStart
        ? new Date(formData.registrationStart).toISOString()
        : new Date().toISOString(),
      registrationEnd: formData.registrationEnd
        ? new Date(formData.registrationEnd).toISOString()
        : new Date().toISOString(),
      careerIds: formData.careerIds || [],
      targetTeachers: Boolean(formData.targetTeachers),
      targetStudents: Boolean(formData.targetStudents),
      targetAdministrative: Boolean(formData.targetAdministrative),
      targetGeneral: Boolean(formData.targetGeneral),
      isVirtual: Boolean(formData.isVirtual),
      meetingUrl: formData.meetingUrl || "",
      maxCapacity: parseInt(formData.maxCapacity) || 0,
      requiresRegistration: Boolean(formData.requiresRegistration),
      isPublic: Boolean(formData.isPublic),
      tags: formData.tags || [],
      imageUrls: formData.imageUrls || [],
      additionalDetails: formData.additionalDetails || "",
    };
  }

  // Método helper para formatear fecha para inputs HTML
  private formatDateForInput(dateString: string): string {
    try {
      let date: Date;

      // Si la fecha viene en formato ISO
      if (dateString.includes("T") || dateString.includes("Z")) {
        date = new Date(dateString);
      } else {
        // Si viene en formato "31/07/2025 19:00:00"
        date = this.parseEventDate(dateString);
      }

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return "";
      }

      // Formatear para input datetime-local (YYYY-MM-DDTHH:MM)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateString, error);
      return "";
    }
  }

  // Método helper para parsear la fecha del formato del backend
  private parseEventDate(dateString: string): Date {
    try {
      // El formato viene como "31/07/2025 19:00:00"
      // Necesitamos convertirlo a un formato que Date pueda entender
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hour, minute, second] = timePart.split(":");

      // Crear la fecha con formato ISO (mes es 0-indexado en JavaScript)
      return new Date(
        parseInt(year),
        parseInt(month) - 1, // Mes es 0-indexado
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return new Date(); // Retornar fecha actual como fallback
    }
  }

  // Método helper para formatear fecha
  formatEventDate(dateString: string): string {
    const date = this.parseEventDate(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Método helper para determinar el status del evento
  getEventStatus(eventDate: string): "upcoming" | "confirmed" | "completed" {
    const today = new Date();
    const eventDateObj = this.parseEventDate(eventDate);

    // Verificar si la fecha es válida
    if (isNaN(eventDateObj.getTime())) {
      return "upcoming"; // Valor por defecto si la fecha es inválida
    }

    // Comparar solo las fechas (sin hora)
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const eventDateOnly = new Date(
      eventDateObj.getFullYear(),
      eventDateObj.getMonth(),
      eventDateObj.getDate()
    );

    if (eventDateOnly > todayDateOnly) {
      return "upcoming";
    } else if (eventDateOnly.getTime() === todayDateOnly.getTime()) {
      return "confirmed";
    } else {
      return "completed";
    }
  }

  // Método helper para formatear fecha con hora
  formatEventDateTime(dateString: string): string {
    const date = this.parseEventDate(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Método helper para contar participantes
  getParticipantCount(event: Event): number {
    return event.participantProfilePictures?.length || 0;
  }
}

export const eventService = new EventService();
