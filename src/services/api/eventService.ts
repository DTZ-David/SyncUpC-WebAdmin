// src/services/api/eventService.ts
import { apiClient } from "./apiClient";
import { authService } from "./authService";

import type {
  EventModel,
  EventsResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  DeleteEventResponse,
} from "../types/EventTypes";
import { DateHelper } from "../utils/DateHelper";
import { EventMapper } from "../utils/EventMapper";
import { EventValidator } from "../utils/EventValidator";

class EventService {
  private readonly endpoints = {
    GET_ALL_EVENTS: "/event/getallevents",
    GET_COMPLETED_EVENTS: "/event/getalleventsmadeforu", 
    CREATE_EVENT: "/event/createevent",
    UPDATE_EVENT: "/event/updateevent",
    DELETE_EVENT: "/event/deleteevent",
  };

  private ensureAuthenticated(): void {
    const user = authService.getCurrentUser();
    if (!user?.token) {
      throw new Error("No hay token de autenticación disponible");
    }
    apiClient.setAuthToken(user.token);
  }

  async getAllEvents(): Promise<EventsResponse> {
    try {
      const user = authService.getCurrentUser();
      if (user?.token) {
        apiClient.setAuthToken(user.token);
      }

      const response = await apiClient.get<EventsResponse>(
        this.endpoints.GET_ALL_EVENTS
      );

      console.log("📦 Backend response (GET_ALL_EVENTS):", response);

      return response;
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      throw error;
    }
  }

  // ← NUEVO: Método para obtener eventos completados
  async getCompletedEvents(): Promise<EventsResponse> {
    try {
      const user = authService.getCurrentUser();
      if (user?.token) {
        apiClient.setAuthToken(user.token);
      }

      const response = await apiClient.get<EventsResponse>(
        this.endpoints.GET_COMPLETED_EVENTS
      );

      console.log("📦 Backend response (GET_COMPLETED_EVENTS):", response);

      return response;
    } catch (error) {
      console.error("❌ Error fetching completed events:", error);
      throw error;
    }
  }

  async createEvent(
    eventData: CreateEventRequest
  ): Promise<CreateEventResponse> {
    try {
      this.ensureAuthenticated();
      EventValidator.validateCreateRequest(eventData);

      console.log("Creating event with data:", eventData);

      const response = await apiClient.post<CreateEventResponse>(
        this.endpoints.CREATE_EVENT,
        eventData,
        undefined,
        true
      );

      console.log("Create event response:", response);
      return response;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async updateEvent(
    eventData: UpdateEventRequest
  ): Promise<UpdateEventResponse> {
    try {
      this.ensureAuthenticated();
      EventValidator.validateUpdateRequest(eventData);

      console.log("Updating event with data:", eventData);

      const response = await apiClient.post<UpdateEventResponse>(
        this.endpoints.UPDATE_EVENT,
        eventData,
        undefined,
        true
      );

      console.log("Update event response:", response);
      return response;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<DeleteEventResponse> {
    try {
      this.ensureAuthenticated();
      EventValidator.validateEventId(eventId);

      const deleteData = { id: eventId };

      const response = await apiClient.delete<DeleteEventResponse>(
        this.endpoints.DELETE_EVENT,
        deleteData,
        undefined,
        true
      );

      if (response.isSuccess) {
        console.log("🎉 [DELETE EVENT] Evento eliminado exitosamente");
      } else {
        console.warn("⚠️ [DELETE EVENT] Error del servidor:", response.message);
      }

      return response;
    } catch (error) {
      console.error("💥 [DELETE EVENT] Error durante la eliminación:", error);
      throw error;
    }
  }

  // ← NUEVO: Método para obtener estadísticas de eventos completados
  getCompletedEventsStats(
    events: { totalRegistered: number; totalAttended: number }[]
  ) {
    const totalEvents = events.length;
    const totalRegistered = events.reduce(
      (sum, event) => sum + event.totalRegistered,
      0
    );
    const totalAttended = events.reduce(
      (sum, event) => sum + event.totalAttended,
      0
    );
    const averageAttendance =
      totalEvents > 0 && totalRegistered > 0
        ? Math.round((totalAttended / totalRegistered) * 100)
        : 100;

    return {
      totalEvents,
      totalRegistered,
      totalAttended,
      averageAttendance,
    };
  }

  // ← NUEVO: Método para convertir EventModel a formato requerido por la vista
  transformToCompletedEventFormat(event: EventModel) {
    const participantCount = this.getParticipantCount(event);

    return {
      id: event.id,
      eventTitle: event.eventTitle,
      eventDate: event.eventStartDate,
      campusName: event.campus?.name || "Campus no especificado",
      spaceName: event.space?.name || "Espacio no especificado",
      totalRegistered: participantCount,
      totalAttended: participantCount, // Asumimos 100% asistencia para eventos completados
      attendanceRate: 100,
      imageUrl: event.imageUrls?.[0], // Primera imagen como principal
      tags: event.tags || [],
    };
  }

  // Delegamos las operaciones de mapeo y utilidades
  mapBackendEventToFormData(event: EventModel) {
    return EventMapper.backendEventToFormData(event);
  }

  transformFormDataToUpdateRequest(formData: any): UpdateEventRequest {
    return EventMapper.formDataToUpdateRequest(formData);
  }

  transformFormDataToApiRequest(formData: any): CreateEventRequest {
    return EventMapper.formDataToCreateRequest(formData);
  }

  formatEventDate(dateString: string): string {
    return DateHelper.formatEventDate(dateString);
  }

  formatEventDateTime(dateString: string): string {
    return DateHelper.formatEventDateTime(dateString);
  }

  getEventStatus(event: EventModel): "upcoming" | "confirmed" | "completed" {
    return DateHelper.getEventStatus(event);
  }

  // Método para obtener la fecha principal del evento
  getMainEventDate(event: EventModel): string {
    return DateHelper.getMainEventDate(event);
  }

  getParticipantCount(event: EventModel): number {
    return event.participantProfilePictures?.length || 0;
  }
}

export const eventService = new EventService();
