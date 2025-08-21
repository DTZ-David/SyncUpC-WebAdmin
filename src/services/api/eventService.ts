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
}

export interface EventsResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Event[];
  message: string;
  errors: string[];
}

// ← NUEVO: Interfaces para crear evento
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

export interface CreateEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Event | null;
  message: string;
  errors: string[];
}

class EventService {
  private readonly endpoints = {
    GET_ALL_EVENTS: "/event/getalleventsmadeforu",
    CREATE_EVENT: "/event/createevent", // ← NUEVO
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

  // ← NUEVO: Método para crear evento
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

  // ← NUEVO: Método helper para transformar datos del form al formato de API
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
