export interface EventModel {
  id: string;
  eventTitle: string;
  eventObjective: string;
  eventStartDate: string; // ← NUEVO: Campo del backend en formato ISO
  eventEndDate: string; // ← NUEVO: Campo del backend en formato ISO
  eventLocation: string;
  address: string;
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  additionalDetails: string;
  imageUrls: string[];
  participantProfilePictures: string[];
  tags: string[];
  isSaved: boolean;
  status: string; // ← NUEVO: Campo status del backend

  // Campos legacy/opcionales para compatibilidad
  eventDate?: string;
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
  image?: string;
}

export interface EventsResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventModel[];
  message: string;
  errors: string[];
}

export interface CreateEventRequest {
  eventTitle: string;
  eventObjective: string;
  eventLocation: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
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

export interface UpdateEventRequest {
  eventId: string;
  eventTitle: string;
  eventObjective: string;
  eventLocation: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
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
