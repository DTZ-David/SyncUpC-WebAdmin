// Interfaces para objetos anidados en las respuestas
export interface CampusInfo {
  name: string;
}

export interface SpaceInfo {
  name: string;
}

export interface CategoryInfo {
  name: string;
}

export interface EventTypeInfo {
  name: string;
}

// Interface principal del modelo de evento (respuesta del backend)
export interface EventModel {
  id: string;
  eventTitle: string;
  eventObjective: string;
  eventStartDate: string; // Fecha de inicio en formato ISO
  eventEndDate: string; // Fecha de fin en formato ISO
  campus: CampusInfo; // ← NUEVO: Objeto anidado del campus
  space: SpaceInfo; // ← NUEVO: Objeto anidado del espacio
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  additionalDetails: string;
  imageUrls: string[];
  participantProfilePictures: string[];
  categories: CategoryInfo[]; // ← NUEVO: Array de categorías
  eventTypes: EventTypeInfo[]; // ← NUEVO: Array de tipos de evento
  isSaved: boolean;
  status: string;

  // Campos legacy/opcionales para compatibilidad con código existente
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  eventLocation?: string;
  address?: string;
  registrationStart?: string;
  registrationEnd?: string;
  careerIds?: string[];
  isVirtual?: boolean;
  meetingUrl?: string;
  maxCapacity?: number;
  requiresRegistration?: boolean;
  isPublic?: boolean;
  image?: string;
  tags?: string[];
}

// Interface para respuesta de obtener eventos
export interface EventsResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventModel[];
  message: string;
  errors: string[];
}

// Interface para crear evento (nueva estructura)
export interface CreateEventRequest {
  eventTitle: string;
  eventObjective: string;
  campusId: string; // ← NUEVO: ID del campus seleccionado
  spaceId: string; // ← NUEVO: ID del espacio seleccionado
  startDate: string; // Fecha en formato ISO
  endDate: string; // Fecha en formato ISO
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
  eventTypesId: string[]; // ← NUEVO: Array de IDs de tipos de evento
  eventCategoryId: string[]; // ← NUEVO: Array de IDs de categorías
  imageUrls: string[];
  additionalDetails: string;
}

// Interface para actualizar evento (nueva estructura)
export interface UpdateEventRequest {
  eventId: string;
  eventTitle: string;
  eventObjective: string;
  campusId: string; // ← NUEVO: ID del campus seleccionado
  spaceId: string; // ← NUEVO: ID del espacio seleccionado
  startDate: string; // Fecha en formato ISO
  endDate: string; // Fecha en formato ISO
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
  eventTypesId: string[]; // ← NUEVO: Array de IDs de tipos de evento
  eventCategoryId: string[]; // ← NUEVO: Array de IDs de categorías
  imageUrls: string[];
  additionalDetails: string;
}

// Las respuestas siguen igual
export interface CreateEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventModel | null;
  message: string;
  errors: string[];
}

export interface UpdateEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventModel | null;
  message: string;
  errors: string[];
}

// Delete sigue igual
export interface DeleteEventRequest {
  id: string;
}

export interface DeleteEventResponse {
  statusCode: number;
  isSuccess: boolean;
  data: any;
  message: string;
  errors: string[];
}

// Tipos TypeScript para las respuestas de la API
export interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[];
}

// Funciones helper para compatibilidad con código existente
export const getEventLocation = (event: EventModel): string => {
  return `${event.campus.name} - ${event.space.name}`;
};

export const getEventCategoryNames = (event: EventModel): string[] => {
  return event.categories.map((cat) => cat.name);
};

export const getEventTypeNames = (event: EventModel): string[] => {
  return event.eventTypes.map((type) => type.name);
};

export const formatEventForLegacyCode = (event: EventModel): EventModel => {
  return {
    ...event,
    // Mapear campos para compatibilidad
    eventLocation: getEventLocation(event),
    address: getEventLocation(event),
    eventDate: event.eventStartDate,
    startDate: event.eventStartDate,
    endDate: event.eventEndDate,
    tags: getEventCategoryNames(event),
  };
};
export interface EventCategory {
  modificationDate: string;
  creationDate: string;
  id: string;
  name: string;
  description: string;
}

export interface EventType {
  modificationDate: string;
  creationDate: string;
  id: string;
  name: string;
  description: string;
}

export interface Campus {
  modificationDate: string;
  creationDate: string;
  id: string;
  name: string;
  description: string;
}

export interface Space {
  modificationDate: string;
  creationDate: string;
  id: string;
  name: string;
  description: string;
  campusId: string;
}
