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
    console.log("🔄 Mapeando evento del backend al formulario:", event);

    // Función helper para parsear fecha del backend: "16/10/2025 15:30:00" -> {date, time}
    const parseBackendDate = (dateString: string): { date: string; time: string } => {
      try {
        // Formato backend: "DD/MM/YYYY HH:MM:SS"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');

        return {
          date: `${year}-${month}-${day}`, // YYYY-MM-DD
          time: `${hours}:${minutes}`       // HH:MM
        };
      } catch (error) {
        console.error("❌ Error parseando fecha:", dateString, error);
        return { date: "", time: "" };
      }
    };

    // Extraer fecha y hora de eventStartDate
    let startDate = "";
    let startTime = "";
    if (event.eventStartDate) {
      const parsed = parseBackendDate(event.eventStartDate);
      startDate = parsed.date;
      startTime = parsed.time;
      console.log("✅ startDate mapeado:", startDate, "startTime:", startTime);
    }

    // Extraer fecha y hora de eventEndDate
    let endDate = "";
    let endTime = "";
    if (event.eventEndDate) {
      const parsed = parseBackendDate(event.eventEndDate);
      endDate = parsed.date;
      endTime = parsed.time;
      console.log("✅ endDate mapeado:", endDate, "endTime:", endTime);
    }

    // NOTA: El backend no envía IDs de campus, space, categories ni eventTypes
    // Solo envía nombres, por lo que necesitaremos buscar los IDs en el formulario
    // usando los nombres cuando se cargue la metadata

    const mappedData = {
      id: event.id,
      eventTitle: event.eventTitle || "",
      eventObjective: event.eventObjective || "",

      // El backend NO envía IDs, solo nombres
      // Dejamos vacío para que el usuario los seleccione de nuevo
      // O podríamos buscar el ID por nombre cuando se cargue la metadata
      campusId: "",  // Necesitaremos buscarlo por nombre
      spaceId: "",   // Necesitaremos buscarlo por nombre

      // Guardar los nombres para referencia
      campusName: event.campus?.name || "",
      spaceName: event.space?.name || "",
      eventLocation: getEventLocation(event),
      address: getEventLocation(event),

      // Fechas y horas separadas para el formulario
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,

      // Campos de registro (opcional)
      registrationStart: "",
      registrationStartTime: "",
      registrationEnd: "",
      registrationEndTime: "",

      // Carreras - el backend no las envía en esta respuesta
      careerIds: [],

      // Targets
      targetTeachers: Boolean(event.targetTeachers),
      targetStudents: Boolean(event.targetStudents),
      targetAdministrative: Boolean(event.targetAdministrative),
      targetGeneral: Boolean(event.targetGeneral),

      // Configuración
      isVirtual: Boolean(event.meetingUrl && event.meetingUrl !== ""),
      meetingUrl: event.meetingUrl || "",
      maxCapacity: event.maxCapacity ? event.maxCapacity.toString() : "",
      requiresRegistration: Boolean(event.requiresRegistration),
      isPublic: true, // El backend no envía este campo

      // El backend NO envía IDs, solo nombres
      // Dejamos vacío para que el usuario los seleccione de nuevo
      eventCategoryIds: [],  // Necesitaremos buscarlos por nombre
      eventTypeIds: [],      // Necesitaremos buscarlos por nombre

      // Guardar los nombres para referencia
      categoryNames: event.categories?.map((c: any) => c.name) || [],
      eventTypeNames: event.eventTypes?.map((t: any) => t.name) || [],

      // Mapear nombres para compatibilidad
      tags: getEventCategoryNames(event),
      eventTypes: getEventTypeNames(event),
      categories: getEventCategoryNames(event),

      imageUrls: event.imageUrls || [],
      additionalDetails: event.additionalDetails || "",
      status: event.status || "",
    };

    console.log("✅ Datos mapeados al formulario:", mappedData);
    console.log("⚠️ NOTA: campusId, spaceId, careerIds, eventCategoryIds y eventTypeIds están vacíos");
    console.log("   Necesitamos buscar los IDs por nombre cuando se cargue la metadata");
    return mappedData;
  }

  static formDataToUpdateRequest(formData: any): UpdateEventRequest {
    const eventId = formData.id || formData.eventId;

    if (!eventId) {
      throw new Error("Se requiere el ID del evento para actualizar");
    }

    // Combinar fecha y hora para startDate
    let startDateISO = new Date().toISOString();
    if (formData.startDate && formData.startTime) {
      const combinedStart = `${formData.startDate}T${formData.startTime}:00`;
      startDateISO = new Date(combinedStart).toISOString();
    } else if (formData.startDate) {
      startDateISO = new Date(formData.startDate).toISOString();
    }

    // Combinar fecha y hora para endDate
    let endDateISO = new Date().toISOString();
    if (formData.endDate && formData.endTime) {
      const combinedEnd = `${formData.endDate}T${formData.endTime}:00`;
      endDateISO = new Date(combinedEnd).toISOString();
    } else if (formData.endDate) {
      endDateISO = new Date(formData.endDate).toISOString();
    }

    return {
      eventId,
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",

      // Nuevos campos requeridos
      campusId: formData.campusId || "",
      spaceId: formData.spaceId || "",

      startDate: startDateISO,
      endDate: endDateISO,

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
      eventCategoryId: formData.eventCategoryId || formData.eventCategoryIds || [],

      imageUrls: formData.imageUrls || [],
      additionalDetails: formData.additionalDetails || "",
    };
  }

  static formDataToCreateRequest(formData: any): CreateEventRequest {
    // Combinar fecha y hora para startDate
    let startDateISO = new Date().toISOString();
    if (formData.startDate && formData.startTime) {
      const combinedStart = `${formData.startDate}T${formData.startTime}:00`;
      startDateISO = new Date(combinedStart).toISOString();
    } else if (formData.startDate) {
      startDateISO = new Date(formData.startDate).toISOString();
    }

    // Combinar fecha y hora para endDate
    let endDateISO = new Date().toISOString();
    if (formData.endDate && formData.endTime) {
      const combinedEnd = `${formData.endDate}T${formData.endTime}:00`;
      endDateISO = new Date(combinedEnd).toISOString();
    } else if (formData.endDate) {
      endDateISO = new Date(formData.endDate).toISOString();
    }

    return {
      eventTitle: formData.eventTitle || "",
      eventObjective: formData.eventObjective || "",

      // Nuevos campos requeridos
      campusId: formData.campusId || "",
      spaceId: formData.spaceId || "",

      startDate: startDateISO,
      endDate: endDateISO,

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
      eventCategoryId: formData.eventCategoryId || formData.eventCategoryIds || [],

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
