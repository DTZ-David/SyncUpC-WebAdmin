import type {
  CreateEventRequest,
  UpdateEventRequest,
} from "../types/EventTypes";

export class EventValidator {
  static validateCreateRequest(data: CreateEventRequest): void {
    if (!data.eventTitle?.trim()) {
      throw new Error("El título del evento es obligatorio");
    }
    if (!data.eventObjective?.trim()) {
      throw new Error("El objetivo del evento es obligatorio");
    }
    if (!data.startDate) {
      throw new Error("La fecha de inicio es obligatoria");
    }
    if (!data.endDate) {
      throw new Error("La fecha de fin es obligatoria");
    }
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
    }
  }

  static validateUpdateRequest(data: UpdateEventRequest): void {
    if (!data.eventId?.trim()) {
      throw new Error("El ID del evento es obligatorio para actualizar");
    }
    this.validateCreateRequest(data as CreateEventRequest);
  }

  static validateEventId(eventId: string): void {
    if (!eventId?.trim()) {
      throw new Error("El ID del evento es obligatorio");
    }
  }
}
