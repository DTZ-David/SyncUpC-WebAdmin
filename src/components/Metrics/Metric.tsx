import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  BookOpen,
  GraduationCap,
  MapPin,
  Clock,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Award,
  Target,
  UserCheck,
  Repeat,
  Activity,
  Filter,
  X,
} from "lucide-react";

interface EventMetrics {
  // Métricas de eventos
  totalEvents: number;
  attendanceRateByEvent: {
    eventName: string;
    rate: number;
    registered: number;
    attended: number;
  }[];
  mostPopularEvents: { name: string; attendees: number; capacity: number }[];
  monthlyParticipation: { month: string; attendees: number; events: number }[];
  capacityUtilization: {
    eventName: string;
    utilization: number;
    attended: number;
    capacity: number;
  }[];

  // Métricas de usuarios
  participationFrequency: {
    userId: string;
    userName: string;
    eventsAttended: number;
  }[];
  mostActiveUsers: { name: string; eventsCount: number; lastEvent: string }[];
  userRetention: {
    total: number;
    multipleEvents: number;
    retentionRate: number;
  };
  newVsRecurrent: { event: string; newUsers: number; recurrentUsers: number }[];

  // Métricas de gestión académica
  complianceIndex: number;
  facultyDistribution: { faculty: string; count: number; percentage: number }[];
  avgAttendanceByEventType: {
    type: string;
    avgAttendance: number;
    totalEvents: number;
  }[];
  timeSlotTrends: {
    timeSlot: string;
    avgAttendance: number;
    eventCount: number;
  }[];
  dayTrends: { day: string; avgAttendance: number; eventCount: number }[];
}

export default function EventMetricsDashboard() {
  const [metricsData, setMetricsData] = useState<EventMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "users" | "academic">(
    "events"
  );

  // Filtros
  const [dateRange, setDateRange] = useState({
    start: "2024-09-01",
    end: "2024-12-01",
  });
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: "",
    eventType: "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const facultyOptions = [
    "Ingeniería",
    "Ciencias",
    "Humanidades",
    "Administración",
  ];
  const eventTypeOptions = [
    "Conferencia",
    "Taller",
    "Seminario",
    "Mesa Redonda",
    "Workshop",
  ];
  const categoryOptions = [
    "Académico",
    "Cultural",
    "Deportivo",
    "Tecnológico",
    "Investigación",
  ];

  // Datos simulados
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMetricsData({
        totalEvents: 85,
        attendanceRateByEvent: [
          {
            eventName: "IA y Futuro",
            rate: 92.5,
            registered: 120,
            attended: 111,
          },
          {
            eventName: "Desarrollo Web",
            rate: 78.3,
            registered: 150,
            attended: 117,
          },
          {
            eventName: "Ciberseguridad",
            rate: 88.1,
            registered: 109,
            attended: 96,
          },
        ],
        mostPopularEvents: [
          { name: "Conferencia de IA", attendees: 245, capacity: 250 },
          { name: "Taller React", attendees: 198, capacity: 200 },
          { name: "Seminario Python", attendees: 187, capacity: 200 },
        ],
        monthlyParticipation: [
          { month: "Sep", attendees: 892, events: 18 },
          { month: "Oct", attendees: 1156, events: 24 },
          { month: "Nov", attendees: 1334, events: 28 },
          { month: "Dic", attendees: 987, events: 15 },
        ],
        capacityUtilization: [
          {
            eventName: "Workshop Python",
            utilization: 98,
            attended: 98,
            capacity: 100,
          },
          {
            eventName: "Charla StartUps",
            utilization: 85,
            attended: 85,
            capacity: 100,
          },
          {
            eventName: "Mesa Redonda Tech",
            utilization: 76,
            attended: 152,
            capacity: 200,
          },
        ],
        participationFrequency: [
          { userId: "1", userName: "Carlos Mendez", eventsAttended: 12 },
          { userId: "2", userName: "Ana García", eventsAttended: 9 },
          { userId: "3", userName: "Luis Torres", eventsAttended: 8 },
        ],
        mostActiveUsers: [
          { name: "María López", eventsCount: 15, lastEvent: "2024-11-28" },
          { name: "Juan Pérez", eventsCount: 12, lastEvent: "2024-11-25" },
          { name: "Sofia Rivera", eventsCount: 11, lastEvent: "2024-11-30" },
        ],
        userRetention: {
          total: 1247,
          multipleEvents: 523,
          retentionRate: 41.9,
        },
        newVsRecurrent: [
          { event: "IA Conference", newUsers: 45, recurrentUsers: 78 },
          { event: "Web Dev Workshop", newUsers: 62, recurrentUsers: 34 },
          { event: "Data Science Talk", newUsers: 38, recurrentUsers: 89 },
        ],
        complianceIndex: 82.3,
        facultyDistribution: [
          { faculty: "Ingeniería", count: 1245, percentage: 52.1 },
          { faculty: "Ciencias", count: 687, percentage: 28.7 },
          { faculty: "Humanidades", count: 324, percentage: 13.5 },
          { faculty: "Administración", count: 136, percentage: 5.7 },
        ],
        avgAttendanceByEventType: [
          { type: "Conferencia", avgAttendance: 156, totalEvents: 25 },
          { type: "Taller", avgAttendance: 78, totalEvents: 32 },
          { type: "Seminario", avgAttendance: 95, totalEvents: 18 },
          { type: "Mesa Redonda", avgAttendance: 45, totalEvents: 10 },
        ],
        timeSlotTrends: [
          { timeSlot: "08:00-12:00", avgAttendance: 67, eventCount: 15 },
          { timeSlot: "14:00-18:00", avgAttendance: 98, eventCount: 45 },
          { timeSlot: "18:00-20:00", avgAttendance: 134, eventCount: 25 },
        ],
        dayTrends: [
          { day: "Lunes", avgAttendance: 78, eventCount: 12 },
          { day: "Martes", avgAttendance: 92, eventCount: 18 },
          { day: "Miércoles", avgAttendance: 105, eventCount: 22 },
          { day: "Jueves", avgAttendance: 87, eventCount: 20 },
          { day: "Viernes", avgAttendance: 123, eventCount: 13 },
        ],
      });
      setIsLoading(false);
    };

    fetchMetrics();
  }, [dateRange, selectedFilters]);

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: string;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <TrendingUp size={14} className="text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );

  const clearFilters = () => {
    setSelectedFilters({ faculty: "", eventType: "", category: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-2 text-gray-600">Cargando métricas...</span>
      </div>
    );
  }

  const renderEventsMetrics = () => (
    <div className="space-y-6">
      {/* Métricas principales de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Eventos"
          value={metricsData?.totalEvents || 0}
          icon={Calendar}
          color="bg-blue-500"
          trend="+8% vs período anterior"
        />
        <MetricCard
          title="Tasa Promedio de Asistencia"
          value="86.3%"
          icon={UserCheck}
          color="bg-green-500"
          subtitle="Inscritos vs Asistentes"
          trend="+3.2% vs período anterior"
        />
        <MetricCard
          title="Índice de Cumplimiento"
          value={`${metricsData?.complianceIndex}%`}
          icon={Award}
          color="bg-purple-500"
          subtitle="Asistencia efectiva"
        />
        <MetricCard
          title="Ocupación Promedio"
          value="86.4%"
          icon={Target}
          color="bg-orange-500"
          subtitle="Capacidad utilizada"
        />
      </div>

      {/* Eventos más concurridos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-500" size={20} />
          Eventos Más Concurridos
        </h3>
        <div className="space-y-4">
          {metricsData?.mostPopularEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-600">
                  {event.attendees} asistentes
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {((event.attendees / event.capacity) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">ocupación</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolución mensual */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2 text-blue-500" size={20} />
          Evolución de Participación
        </h3>
        <div className="space-y-4">
          {metricsData?.monthlyParticipation.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-12">
                {item.month}
              </span>
              <div className="flex-1 mx-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{item.events} eventos</span>
                  <span>{item.attendees} asistentes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                    style={{ width: `${(item.attendees / 1500) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersMetrics = () => (
    <div className="space-y-6">
      {/* Métricas principales de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Retención de Usuarios"
          value={`${metricsData?.userRetention.retentionRate}%`}
          icon={Repeat}
          color="bg-teal-500"
          subtitle="Asisten a múltiples eventos"
        />
        <MetricCard
          title="Usuarios Activos"
          value={metricsData?.userRetention.total || 0}
          icon={Users}
          color="bg-indigo-500"
          subtitle="Total de participantes"
        />
        <MetricCard
          title="Promedio de Participación"
          value="3.2"
          icon={Activity}
          color="bg-pink-500"
          subtitle="Eventos por usuario"
        />
        <MetricCard
          title="Usuarios Recurrentes"
          value={metricsData?.userRetention.multipleEvents || 0}
          icon={UserCheck}
          color="bg-green-500"
          subtitle="Más de un evento"
        />
      </div>

      {/* Usuarios más activos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="mr-2 text-yellow-500" size={20} />
            Usuarios Más Activos
          </h3>
          <div className="space-y-3">
            {metricsData?.mostActiveUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">
                    Último evento: {user.lastEvent}
                  </p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user.eventsCount} eventos
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 text-blue-500" size={20} />
            Nuevos vs Recurrentes
          </h3>
          <div className="space-y-4">
            {metricsData?.newVsRecurrent.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.event}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Nuevos: {item.newUsers}</span>
                      <span>Recurrentes: {item.recurrentUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 flex">
                      <div
                        className="bg-blue-500 h-2 rounded-l-full"
                        style={{
                          width: `${
                            (item.newUsers /
                              (item.newUsers + item.recurrentUsers)) *
                            100
                          }%`,
                        }}
                      ></div>
                      <div
                        className="bg-green-500 h-2 rounded-r-full"
                        style={{
                          width: `${
                            (item.recurrentUsers /
                              (item.newUsers + item.recurrentUsers)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademicMetrics = () => (
    <div className="space-y-6">
      {/* Distribución por facultad */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="mr-2 text-blue-500" size={20} />
          Distribución por Facultad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricsData?.facultyDistribution.map((faculty, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">
                  {faculty.faculty}
                </span>
                <span className="text-sm text-gray-600">
                  {faculty.count} estudiantes
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${faculty.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {faculty.percentage}% del total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Promedio por tipo de evento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="mr-2 text-green-500" size={20} />
            Asistencia por Tipo de Evento
          </h3>
          <div className="space-y-4">
            {metricsData?.avgAttendanceByEventType.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{type.type}</p>
                  <p className="text-sm text-gray-600">
                    {type.totalEvents} eventos
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {type.avgAttendance}
                  </p>
                  <p className="text-xs text-gray-500">promedio</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 text-purple-500" size={20} />
            Tendencias por Horario
          </h3>
          <div className="space-y-4">
            {metricsData?.timeSlotTrends.map((slot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{slot.timeSlot}</p>
                  <p className="text-sm text-gray-600">
                    {slot.eventCount} eventos
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    {slot.avgAttendance}
                  </p>
                  <p className="text-xs text-gray-500">promedio</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendencias por día */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2 text-orange-500" size={20} />
          Participación por Día de la Semana
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {metricsData?.dayTrends.map((day, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="font-medium text-gray-900">{day.day}</p>
              <p className="text-2xl font-bold text-orange-600 my-2">
                {day.avgAttendance}
              </p>
              <p className="text-xs text-gray-500">{day.eventCount} eventos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Métricas
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de eventos y participación
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filtros de fecha */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">hasta</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>

          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 text-sm">
            <Download size={16} />
            <span>PDF</span>
          </button>

          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 text-sm">
            <FileSpreadsheet size={16} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedFilters.faculty}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  faculty: e.target.value,
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las facultades</option>
              {facultyOptions.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            <select
              value={selectedFilters.eventType}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  eventType: e.target.value,
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              {eventTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedFilters.category}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  category: e.target.value,
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 text-sm"
            >
              <X size={14} />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      )}

      {/* Pestañas de navegación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Calendar className="inline mr-2" size={16} />
              Métricas de Eventos
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="inline mr-2" size={16} />
              Métricas de Usuarios
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "academic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap className="inline mr-2" size={16} />
              Gestión Académica
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "events" && renderEventsMetrics()}
          {activeTab === "users" && renderUsersMetrics()}
          {activeTab === "academic" && renderAcademicMetrics()}
        </div>
      </div>
    </div>
  );
}
