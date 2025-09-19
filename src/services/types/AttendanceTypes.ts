// src/types/AttendanceTypes.ts

export interface UserAttendance {
  name: string; // Cambió de 'nombre' a 'name'
  lastName: string; // Cambió de 'apellido' a 'lastName'
  email: string;
  phoneNumber: string; // Cambió de 'numero' a 'phoneNumber'
  checkInTime: string;
  carrera?: string; // Opcional para docentes
  facultad?: string; // Opcional para docentes
}

export interface AttendanceData {
  creationDate: string;
  eventId: string;
  userAttendanceDto: UserAttendance[];
}

export interface AttendanceResponse {
  statusCode: number;
  isSuccess: boolean;
  data: AttendanceData;
  message: string;
  errors: string[];
}

export interface AttendanceRequest {
  eventId: string;
}

// Tipo para los datos procesados que se usarán en Excel/PDF
export interface ProcessedAttendance {
  nombre: string;
  apellido: string;
  email: string;
  numero: string;
  checkInTime: string;
  carrera: string;
  facultad: string;
}
