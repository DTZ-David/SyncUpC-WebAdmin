import {
  EventModel,
  UpdateEventRequest,
  CreateEventRequest,
} from "../types/EventTypes";
import { DateHelper } from "./DateHelper";

export class EventMapper {
  static backendEventToFormData(event: EventModel): any {
    return {
      id: event.id,
      eventTitle: event.eventTitle || "",
      eventObjective: event.eventObjective || "",
      eventLocation: event.eventLocation || "",
      address: event.address || "",
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
      registrationStart: event.registrationStart
        ? DateHelper.formatDateForInput(event.registrationStart)
        : "",
      registrationEnd: event.registrationEnd
        ? DateHelper.formatDateForInput(event.registrationEnd)
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

  static formDataToCreateRequest(formData: any): CreateEventRequest {
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
}
