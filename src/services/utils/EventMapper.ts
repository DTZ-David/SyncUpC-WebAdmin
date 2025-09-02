import {
  EventModel,
  UpdateEventRequest,
  CreateEventRequest,
  getEventLocation,
  getEventCategoryNames,
  getEventTypeNames,
} from "../types/EventTypes";
import { DateHelper } from "./DateHelper";

export class EventMapper {
  static backendEventToFormData(event: EventModel): any {
    return {
      id: event.id,
      eventTitle: event.eventTitle || "",
      eventObjective: event.eventObjective || "",

      // Mapear los nuevos campos anidados
      eventLocation: getEventLocation(event), // Combina campus y space
      address: getEventLocation(event), // Para compatibilidad
      campusName: event.campus?.name || "",
      spaceName: event.space?.name || "",

      // Fechas - priorizar los nuevos campos del backend
      startDate: event.eventStartDate
        ? DateHelper.formatDateForInput(event.eventStartDate)
        : event.startDate
        ? DateHelper.formatDateForInput(event.startDate)
        : event.eventDate
        ? DateHelper.formatDateForInput(event.eventDate)
        : "",
      endDate: event.eventEndDate
        ? DateHelper.formatDateForInput(event.eventEndDate)
        : event.endDate
        ? DateHelper.formatDateForInput(event.endDate)
        : "",

      // Campos legacy para compatibilidad
      registrationStart: event.registrationStart
        ? DateHelper.formatDateForInput(event.registrationStart)
        : "",
      registrationEnd: event.registrationEnd
        ? DateHelper.formatDateForInput(event.registrationEnd)
        : "",
      careerIds: event.careerIds || [],

      // Targets
      targetTeachers: Boolean(event.targetTeachers),
      targetStudents: Boolean(event.targetStudents),
      targetAdministrative: Boolean(event.targetAdministrative),
      targetGeneral: Boolean(event.targetGeneral),

      // Campos legacy
      isVirtual: Boolean(event.isVirtual),
      meetingUrl: event.meetingUrl || "",
      maxCapacity: event.maxCapacity ? event.maxCapacity.toString() : "",
      requiresRegistration: Boolean(event.requiresRegistration),
      isPublic: Boolean(event.isPublic),

      // Mapear categorías y tipos a tags para compatibilidad
      tags: getEventCategoryNames(event),
      eventTypes: getEventTypeNames(event),
      categories: getEventCategoryNames(event),

      imageUrls: event.imageUrls || [],
      additionalDetails: event.additionalDetails || "",
      status: event.status || "",
    };
  }

  static formDataToUpdateRequest(formData: any): UpdateEventRequest {
    const eventId = formData.id || formData.eventId;

    if (!eventId) {
      throw new Error("Se requiere el ID del evento para actualizar");
    }

    return {
      eventId,
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",

      // Nuevos campos requeridos
      campusId: formData.campusId || "",
      spaceId: formData.spaceId || "",

      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : new Date().toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
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

      // Nuevos arrays de IDs
      eventTypesId: formData.eventTypesId || formData.eventTypeIds || [],
      eventCategoryId: formData.eventCategoryId || formData.categoryIds || [],

      imageUrls: formData.imageUrls || [],
      additionalDetails: formData.additionalDetails || "",
    };
  }

  static formDataToCreateRequest(formData: any): CreateEventRequest {
    return {
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",

      // Nuevos campos requeridos
      campusId: formData.campusId || "",
      spaceId: formData.spaceId || "",

      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : new Date().toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
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

      // Nuevos arrays de IDs
      eventTypesId: formData.eventTypesId || formData.eventTypeIds || [],
      eventCategoryId: formData.eventCategoryId || formData.categoryIds || [],

      imageUrls: formData.imageUrls || [],
      additionalDetails: formData.additionalDetails || "",
    };
  }

  // Método helper para extraer IDs de espacios basado en campus seleccionado
  static getSpacesForCampus(spaces: any[], campusId: string): any[] {
    return spaces.filter((space) => space.campusId === campusId);
  }

  // Método helper para convertir nombres a IDs (útil cuando tienes los nombres pero necesitas los IDs)
  static findIdsByNames(items: any[], names: string[]): string[] {
    return names
      .map((name) => {
        const item = items.find((item) => item.name === name);
        return item ? item.id : null;
      })
      .filter((id) => id !== null);
  }

  // Método helper para manejar la migración de datos legacy
  static migrateLegacyFormData(
    formData: any,
    availableData: {
      campuses: any[];
      spaces: any[];
      categories: any[];
      eventTypes: any[];
    }
  ): any {
    const migratedData = { ...formData };

    // Si tiene eventLocation legacy, intentar mapear a campusId y spaceId
    if (formData.eventLocation && !formData.campusId) {
      // Lógica para intentar mapear ubicación legacy a campus/space
      // Esto dependería de cómo esté estructurada tu data legacy
    }

    // Si tiene tags legacy, mapear a categoryIds
    if (formData.tags && !formData.eventCategoryId) {
      migratedData.eventCategoryId = this.findIdsByNames(
        availableData.categories,
        formData.tags
      );
    }

    return migratedData;
  }
}
