// src/types/MetricsTypes.ts

export interface MetricsRequest {
  dateRange: "lastMonth" | "last3months" | "last6months" | "lastYear";
  startDate?: string;
  endDate?: string;
}

export interface TopFaculty {
  name: string;
  eventCount: number;
  percentage: number;
  attendeeCount: number;
}

export interface TopCareer {
  name: string;
  eventCount: number;
  percentage: number;
  attendeeCount: number;
  facultyName: string;
}

export interface TopLocation {
  name: string;
  eventCount: number;
  percentage: number;
  attendeeCount: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  events: number;
  attendees: number;
  averageAttendance: number;
}

export interface EventTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  averageAttendees: number;
}

export interface HourlyAttendance {
  hour: string;
  eventCount: number;
  attendeeCount: number;
  averageAttendance: number;
}

export interface AttendanceStats {
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  noShowRate: number;
}

export interface MetricsData {
  // Métricas principales
  totalEvents: number;
  totalAttendees: number;
  totalRegistrations: number;
  averageAttendeesPerEvent: number;
  attendanceStats: AttendanceStats;

  // Top performers
  topFaculties: TopFaculty[];
  topCareers: TopCareer[];
  topLocations: TopLocation[];

  // Tendencias y distribuciones
  monthlyTrend: MonthlyTrend[];
  eventTypeDistribution: EventTypeDistribution[];
  hourlyAttendance: HourlyAttendance[];

  // Métricas adicionales
  peakAttendanceHour: string;
  averageEventDuration: number;
  mostPopularDay: string;
  averageEventsPerMonth: number;
  growthRate: number;

  // Datos para comparación
  previousPeriodComparison: {
    eventsGrowth: number;
    attendeesGrowth: number;
    attendanceRateChange: number;
  };
}

export interface MetricsResponse {
  statusCode: number;
  isSuccess: boolean;
  data: MetricsData;
  message: string;
  errors: string[];
}

// Tipos para exportación
export interface ExportRequest {
  dateRange: string;
  format: "pdf" | "excel";
  includeCharts?: boolean;
  includeDetails?: boolean;
}
