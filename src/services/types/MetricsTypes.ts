// src/types/metrics.ts

// Filtros opcionales para todas las métricas
export interface MetricsFilters {
  dateFrom?: string;
  dateTo?: string;
  faculty?: string;
  program?: string;
  eventType?: string;
  category?: string;
}

// Respuesta base de la API
export interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[];
}

// --- ACADEMIC METRICS ---
export interface FacultyDistribution {
  facultyName: string;
  students: number;
  percentage: number;
}

export interface AttendanceByEventType {
  eventType: string;
  totalEvents: number;
  averageAttendance: number;
}

export interface TimeSlotTrends {
  timeSlot: string;
  events: number;
  averageAttendance: number;
}

export interface WeeklyParticipation {
  dayOfWeek: string;
  averageAttendance: number;
  totalEvents: number;
}

export interface AcademicMetricsData {
  facultyDistribution: FacultyDistribution[];
  attendanceByEventType: AttendanceByEventType[];
  timeSlotTrends: TimeSlotTrends[];
  weeklyParticipation: WeeklyParticipation[];
}

export type AcademicMetricsResponse = ApiResponse<AcademicMetricsData>;

// --- USER METRICS ---
export interface TopUser {
  userName: string;
  lastEventDate: string;
  totalEvents: number;
}

export interface NewVsRecurrentByEvent {
  eventName: string;
  newUsers: number;
  recurrentUsers: number;
}

export interface UserMetricsData {
  userRetentionRate: number;
  activeUsers: number;
  averageParticipation: number;
  recurrentUsers: number;
  topUsers: TopUser[];
  newVsRecurrentByEvent: NewVsRecurrentByEvent[];
}

export type UserMetricsResponse = ApiResponse<UserMetricsData>;

// --- EVENT METRICS ---
export interface TopEvent {
  eventName: string;
  attendees: number;
  occupancyPercentage: number;
}

export interface MonthlyEvolution {
  month: string;
  events: number;
  attendees: number;
}

export interface EventMetricsData {
  totalEvents: number;
  percentageChangeEvents: number;
  averageAttendanceRate: number;
  percentageChangeAttendance: number;
  complianceIndex: number;
  averageOccupancy: number;
  topEvents: TopEvent[];
  monthlyEvolution: MonthlyEvolution[];
}

export type EventMetricsResponse = ApiResponse<EventMetricsData>;
