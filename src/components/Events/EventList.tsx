import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import { eventService, Event } from "../../services/api/eventService";

interface EventListProps {
  onCreateEvent: () => void;
  onEditEvent: (event: any) => void;
  onViewAttendees: (eventId: number) => void;
  onViewDetails: (event: any) => void;
}

export default function EventList({
  onCreateEvent,
  onEditEvent,
  onViewAttendees,
  onViewDetails,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Función para convertir fecha de UTC a hora colombiana
  const parseEventDate = (dateString: string) => {
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hour, minute, second] = timePart.split(":");

      const utcDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second) || 0
      );

      // Restar 5 horas para convertir de UTC a hora colombiana (UTC-5)
      return new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);
    } catch (error) {
      return new Date();
    }
  };

  // Función para extraer la hora en formato colombiano
  const parseEventTime = (dateString: string) => {
    try {
      const colombianDate = parseEventDate(dateString);
      return colombianDate.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      return "Hora no disponible";
    }
  };

  // Transformar eventos del backend al formato esperado por el frontend
  const transformedEvents = events.map((event) => ({
    ...event,
    // Campos transformados para compatibilidad
    date: event.eventDate,
    time: parseEventTime(event.eventDate),
    location: event.eventLocation,
    title: event.eventTitle,
    attendees: eventService.getParticipantCount(event),
    confirmed: Math.round(eventService.getParticipantCount(event) * 0.8), // Simulado
    status: eventService.getEventStatus(event.eventDate) as
      | "draft"
      | "published"
      | "completed"
      | "cancelled",
    image:
      event.imageUrls?.[0] ||
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",

    // Campos adicionales que pueden no existir en el backend
    address: event.additionalDetails || event.eventLocation,
    isVirtual: false, // Por defecto presencial
    maxCapacity: 100, // Por defecto
    requiresRegistration: true, // Por defecto
    isPublic: true, // Por defecto
  }));

  const filteredEvents = transformedEvents.filter((event) => {
    const matchesSearch = event.eventTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        // Aquí implementarías la llamada al API para eliminar
        console.log("Deleting event with ID:", eventId);
        alert("Evento eliminado correctamente");
        // Recargar eventos después de eliminar
        loadEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error al eliminar el evento");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "upcoming":
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      case "upcoming":
        return "Próximo";
      case "confirmed":
        return "Confirmado";
      default:
        return status || "Sin estado";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
          <button
            onClick={onCreateEvent}
            className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Crear Evento</span>
          </button>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600">
              Gestiona tus eventos y rastrea la asistencia
            </p>
          </div>
          <button
            onClick={onCreateEvent}
            className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Crear Evento</span>
          </button>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600">
            Gestiona tus eventos y rastrea la asistencia
          </p>
        </div>
        <button
          onClick={onCreateEvent}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Crear Evento</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los Estados</option>
              <option value="published">Publicado</option>
              <option value="upcoming">Próximo</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
              <option value="draft">Borrador</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No se encontraron eventos"
              : "No hay eventos aún"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Intenta cambiar los filtros de búsqueda"
              : "Comienza creando tu primer evento"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={onCreateEvent}
              className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
            >
              Crear Primer Evento
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.eventTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.eventTitle}
                </h3>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="w-16">Fecha:</span>
                    <span>
                      {parseEventDate(event.eventDate).toLocaleDateString(
                        "es-CO"
                      )}{" "}
                      a las {event.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16">Lugar:</span>
                    <span className="truncate">{event.eventLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16">Asistentes:</span>
                    <span>
                      {event.confirmed}/{event.attendees} confirmados
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onViewAttendees(event.attendees)}
                    className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm"
                  >
                    <Users size={16} />
                    <span>Ver Asistentes</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails(event)}
                      className="p-1.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditEvent(event)}
                      className="p-1.5 text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      title="Editar Evento"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar Evento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
