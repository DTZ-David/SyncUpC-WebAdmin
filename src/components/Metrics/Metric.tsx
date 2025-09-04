import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  BookOpen,
  GraduationCap,
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
  AlertCircle,
} from "lucide-react";
import { eventMetadataService } from "../../services/api/eventMetadataService";
import { facultyService } from "../../services/api/facultyService";
import { EventType, EventCategory } from "../../services/types/EventTypes";
import { MetricsFilters } from "../../services/types/MetricsTypes";
import { Faculty } from "../Auth/types";
import { useMetrics } from "./hooks/useMetrics";

export default function EventMetricsDashboard() {
  const [activeTab, setActiveTab] = useState<"events" | "users" | "academic">(
    "events"
  );

  // Filtros
  const [dateRange, setDateRange] = useState({
    start: "2025-06-01",
    end: "2025-12-30",
  });
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: "",
    eventType: "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Estados para opciones de filtros
  const [facultyOptions, setFacultyOptions] = useState<Faculty[]>([]);
  const [eventTypeOptions, setEventTypeOptions] = useState<EventType[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<EventCategory[]>([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(false);

  // Crear filtros para la API
  const apiFilters: MetricsFilters = {
    dateFrom: dateRange.start ? `${dateRange.start}T00:00:00.000Z` : undefined,
    dateTo: dateRange.end ? `${dateRange.end}T23:59:59.999Z` : undefined,
    faculty: selectedFilters.faculty || undefined,
    eventType: selectedFilters.eventType || undefined,
    category: selectedFilters.category || undefined,
  };

  // Hook personalizado para métricas
  const { metrics, loading, error, refreshMetrics } = useMetrics(
    apiFilters,
    true
  );

  // Cargar opciones de filtros
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoadingFilterOptions(true);
      try {
        const [faculties, eventTypes, categories] = await Promise.all([
          facultyService.getAllFaculties(),
          eventMetadataService.getAllEventTypes(),
          eventMetadataService.getAllEventCategories(),
        ]);

        setFacultyOptions(faculties);

        if (eventTypes.isSuccess) {
          setEventTypeOptions(eventTypes.data);
        }

        if (categories.isSuccess) {
          setCategoryOptions(categories.data);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoadingFilterOptions(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Efecto para actualizar métricas cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refreshMetrics(apiFilters);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-2 text-gray-600">Cargando métricas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold">
              Error al cargar métricas
            </h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => refreshMetrics(apiFilters)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderEventsMetrics = () => (
    <div className="space-y-6">
      {/* Métricas principales de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Eventos"
          value={metrics.event?.data?.totalEvents || 0}
          icon={Calendar}
          color="bg-blue-500"
          trend={`${
            metrics.event?.data?.percentageChangeEvents! > 0 ? "+" : ""
          }${
            metrics.event?.data?.percentageChangeEvents || 0
          }% vs período anterior`}
        />
        <MetricCard
          title="Tasa Promedio de Asistencia"
          value={`${metrics.event?.data?.averageAttendanceRate || 0}%`}
          icon={UserCheck}
          color="bg-green-500"
          subtitle="Inscritos vs Asistentes"
          trend={`${
            metrics.event?.data?.percentageChangeAttendance! > 0 ? "+" : ""
          }${
            metrics.event?.data?.percentageChangeAttendance || 0
          }% vs período anterior`}
        />
        <MetricCard
          title="Índice de Cumplimiento"
          value={`${metrics.event?.data?.complianceIndex || 0}%`}
          icon={Award}
          color="bg-purple-500"
          subtitle="Asistencia efectiva"
        />
        <MetricCard
          title="Ocupación Promedio"
          value={`${metrics.event?.data?.averageOccupancy || 0}%`}
          icon={Target}
          color="bg-orange-500"
          subtitle="Capacidad utilizada"
        />
      </div>

      {/* Eventos más concurridos */}
      {metrics.event?.data?.topEvents &&
        metrics.event.data.topEvents.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Eventos Más Concurridos
            </h3>
            <div className="space-y-4">
              {metrics.event.data.topEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.eventName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.attendees} asistentes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {event.occupancyPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">ocupación</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Evolución mensual */}
      {metrics.event?.data?.monthlyEvolution &&
        metrics.event.data.monthlyEvolution.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-blue-500" size={20} />
              Evolución de Participación
            </h3>
            <div className="space-y-4">
              {metrics.event.data.monthlyEvolution.map((item, index) => (
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
                        style={{
                          width: `${Math.min(
                            100,
                            (item.attendees /
                              Math.max(
                                ...metrics.event!.data.monthlyEvolution.map(
                                  (m) => m.attendees
                                )
                              )) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );

  const renderUsersMetrics = () => (
    <div className="space-y-6">
      {/* Métricas principales de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Retención de Usuarios"
          value={`${metrics.user?.data?.userRetentionRate || 0}%`}
          icon={Repeat}
          color="bg-teal-500"
          subtitle="Asisten a múltiples eventos"
        />
        <MetricCard
          title="Usuarios Activos"
          value={metrics.user?.data?.activeUsers || 0}
          icon={Users}
          color="bg-indigo-500"
          subtitle="Total de participantes"
        />
        <MetricCard
          title="Promedio de Participación"
          value={`${metrics.user?.data?.averageParticipation || 0}%`}
          icon={Activity}
          color="bg-pink-500"
          subtitle="Nivel de participación"
        />
        <MetricCard
          title="Usuarios Recurrentes"
          value={metrics.user?.data?.recurrentUsers || 0}
          icon={UserCheck}
          color="bg-green-500"
          subtitle="Más de un evento"
        />
      </div>

      {/* Usuarios más activos y análisis nuevos vs recurrentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios más activos */}
        {metrics.user?.data?.topUsers &&
          metrics.user.data.topUsers.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="mr-2 text-yellow-500" size={20} />
                Usuarios Más Activos
              </h3>
              <div className="space-y-3">
                {metrics.user.data.topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.userName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Último evento:{" "}
                        {new Date(user.lastEventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user.totalEvents} eventos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Nuevos vs Recurrentes */}
        {metrics.user?.data?.newVsRecurrentByEvent &&
          metrics.user.data.newVsRecurrentByEvent.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" size={20} />
                Nuevos vs Recurrentes
              </h3>
              <div className="space-y-4">
                {metrics.user.data.newVsRecurrentByEvent.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {item.eventName}
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
          )}
      </div>
    </div>
  );

  const renderAcademicMetrics = () => (
    <div className="space-y-6">
      {/* Distribución por facultad */}
      {metrics.academic?.data?.facultyDistribution &&
        metrics.academic.data.facultyDistribution.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 text-blue-500" size={20} />
              Distribución por Facultad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.academic.data.facultyDistribution.map(
                (faculty, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {faculty.facultyName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {faculty.students} estudiantes
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
                )
              )}
            </div>
          </div>
        )}

      {/* Asistencia por tipo de evento y tendencias por horario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asistencia por tipo de evento */}
        {metrics.academic?.data?.attendanceByEventType &&
          metrics.academic.data.attendanceByEventType.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-green-500" size={20} />
                Asistencia por Tipo de Evento
              </h3>
              <div className="space-y-4">
                {metrics.academic.data.attendanceByEventType.map(
                  (type, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {type.eventType}
                        </p>
                        <p className="text-sm text-gray-600">
                          {type.totalEvents} eventos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {type.averageAttendance}
                        </p>
                        <p className="text-xs text-gray-500">promedio</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Tendencias por horario */}
        {metrics.academic?.data?.timeSlotTrends &&
          metrics.academic.data.timeSlotTrends.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2 text-purple-500" size={20} />
                Tendencias por Horario
              </h3>
              <div className="space-y-4">
                {metrics.academic.data.timeSlotTrends.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {slot.timeSlot}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slot.events} eventos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {slot.averageAttendance}
                      </p>
                      <p className="text-xs text-gray-500">promedio</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Participación por día de la semana */}
      {metrics.academic?.data?.weeklyParticipation &&
        metrics.academic.data.weeklyParticipation.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-orange-500" size={20} />
              Participación por Día de la Semana
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {metrics.academic.data.weeklyParticipation.map((day, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <p className="font-medium text-gray-900">{day.dayOfWeek}</p>
                  <p className="text-2xl font-bold text-orange-600 my-2">
                    {day.averageAttendance}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day.totalEvents} eventos
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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
              disabled={loadingFilterOptions}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingFilterOptions ? "Cargando..." : "Todas las facultades"}
              </option>
              {facultyOptions.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
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
              disabled={loadingFilterOptions}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingFilterOptions ? "Cargando..." : "Todos los tipos"}
              </option>
              {eventTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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
              disabled={loadingFilterOptions}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingFilterOptions ? "Cargando..." : "Todas las categorías"}
              </option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
