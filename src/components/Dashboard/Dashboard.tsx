import { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import {
  Calendar,
  Users,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { eventService } from "../../services/api/eventService";
import type { EventModel } from "../../services/types/EventTypes";
interface DashboardProps {
  onViewEventDetails: (event: any) => void;
}

export default function Dashboard({ onViewEventDetails }: DashboardProps) {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventService.getAllEvents();

      if (response.isSuccess && response.data) {
        setEvents(response.data);
      } else {
        setError(response.message || "Error al cargar los eventos");
      }
    } catch (err: any) {
      console.error("Error loading events:", err);
      setError("Error de conexión al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas basadas en los datos reales
  const calculateStats = () => {
    const totalEvents = events.length;
    const totalAttendees = events.reduce(
      (sum, event) => sum + eventService.getParticipantCount(event),
      0
    );

    // Eventos confirmados (próximos y del día)
    const confirmedEvents = events.filter((event) => {
      const status = eventService.getEventStatus(event);
      return status === "upcoming" || status === "confirmed";
    }).length;

    // Calcular tasa de asistencia (simulada - podrías necesitar datos adicionales del backend)
    const attendanceRate =
      totalEvents > 0 ? Math.round((confirmedEvents / totalEvents) * 100) : 0;

    return {
      totalEvents,
      totalAttendees,
      confirmedAttendees: Math.round(totalAttendees * 0.8), // Simulado
      attendanceRate: `${attendanceRate}%`,
    };
  };

  const stats = calculateStats();

  const statsCards = [
    {
      title: "Total de Eventos",
      value: stats.totalEvents,
      icon: Calendar,

      color: "bg-green-500",
    },
    {
      title: "Total de Asistentes",
      value: stats.totalAttendees,
      icon: Users,

      color: "bg-blue-500",
    },
    {
      title: "Asistentes Confirmados",
      value: stats.confirmedAttendees,
      icon: UserCheck,

      color: "bg-lime-500",
    },
    {
      title: "Tasa de Asistencia",
      value: stats.attendanceRate,
      icon: TrendingUp,

      color: "bg-purple-500",
    },
  ];

  // En tu Dashboard.tsx, cambia la parte donde preparas los recentEvents:

  const recentEvents = events
    .sort(
      (a, b) =>
        new Date(
          b.eventStartDate.split(" ")[0].split("/").reverse().join("-")
        ).getTime() -
        new Date(
          a.eventStartDate.split(" ")[0].split("/").reverse().join("-")
        ).getTime()
    )
    .slice(0, 3)
    .map((event) => {
      // Extraer fecha y hora del campo eventDate
      const [, timePart] = event.eventStartDate.split(" ");

      return {
        // Campos originales del backend
        ...event,

        // Campos adicionales para compatibilidad
        title: event.eventTitle,
        date: eventService.formatEventDate(event.eventStartDate),
        location: event.eventLocation,
        time: timePart, // Extraer la hora del campo eventDate

        // Otros campos calculados
        attendees: eventService.getParticipantCount(event),
        status: eventService.getEventStatus(event),
        image:
          event.imageUrls?.[0] ||
          "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",

        // Campos adicionales que EventDetails espera
        confirmed: Math.round(eventService.getParticipantCount(event) * 0.8), // Simulado
        requiresRegistration: true, // Por defecto
        isPublic: true, // Por defecto
        isVirtual: false, // Por defecto presencial
      };
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel Principal
          </h1>
          <p className="text-gray-600">Cargando datos...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel Principal
          </h1>
          <p className="text-gray-600">¡Bienvenido de nuevo!</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-red-800 font-medium">
                Error al cargar los eventos
              </h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={loadEvents}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Panel Principal
        </h1>
        <p className="text-gray-600">
          ¡Bienvenido de nuevo! Aquí tienes un resumen de tus eventos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Eventos Recientes
            </h2>
            <button
              onClick={loadEvents}
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes eventos aún
              </h3>
              <p className="text-gray-600">
                Comienza creando tu primer evento para ver la actividad aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onViewEventDetails(event)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {event.date}
                      </span>
                      <span className="text-sm text-gray-600">
                        {event.location}
                      </span>
                    </div>
                    {event.eventObjective && (
                      <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                        {event.eventObjective}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      {event.attendees} asistentes
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : event.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.status === "upcoming"
                        ? "Próximo"
                        : event.status === "confirmed"
                        ? "Confirmado"
                        : event.status === "completed"
                        ? "Completado"
                        : event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
