// src/types/AttendanceTypes.ts

export interface UserAttendance {
  nombre: string;
  apellido: string;
  numero: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface AttendanceData {
  creationDate: string;
  eventId: string;
  useerAttendanceDto: UserAttendance[]; // Mantenemos el typo del backend
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
  numero: string;
  checkInTime: string;
  checkOutTime: string;
  duration?: string; // Duración calculada entre checkIn y checkOut
  status: "Presente" | "Ausente";
}
