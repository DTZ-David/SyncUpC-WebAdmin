import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Filter,
  FileSpreadsheet,
  FileText,
  Loader,
} from "lucide-react";
import { attendanceService } from "../../services/api/attendanceService";
import { eventService } from "../../services/api/eventService";

interface CompletedEvent {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  imageUrl?: string;
  tags: string[];
}

interface CompletedEventsListProps {
  onBack?: () => void;
}

export default function CompletedEventsList({
  onBack,
}: CompletedEventsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [completedEvents, setCompletedEvents] = useState<CompletedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingExcel, setDownloadingExcel] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  // Cargar eventos completados desde el backend
  useEffect(() => {
    const loadCompletedEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await eventService.getCompletedEvents();

        if (response.isSuccess && response.data) {
          // Transformar los datos del backend al formato requerido por la vista
          const transformedEvents = response.data
            .filter((event) => {
              // Solo incluir eventos que estén completados
              return eventService.getEventStatus(event) === "completed";
            })
            .map((event) =>
              eventService.transformToCompletedEventFormat(event)
            );

          setCompletedEvents(transformedEvents);
        } else {
          setError(response.message || "Error al cargar eventos completados");
        }
      } catch (err) {
        console.error("Error loading completed events:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    loadCompletedEvents();
  }, []);

  const filteredEvents = completedEvents.filter((event) => {
    const matchesSearch =
      event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
      case "attendance":
        return b.attendanceRate - a.attendanceRate;
      case "participants":
        return b.totalAttended - a.totalAttended;
      default:
        return 0;
    }
  });

  const handleDownloadExcel = async (eventId: string, eventTitle: string) => {
    try {
      setDownloadingExcel(eventId);
      await attendanceService.downloadExcel(eventId, eventTitle);
      console.log(`✅ Excel descargado para evento ${eventId}: ${eventTitle}`);
    } catch (error) {
      console.error("❌ Error descargando Excel:", error);
      alert(
        `Error al descargar Excel: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setDownloadingExcel(null);
    }
  };

  const handleDownloadPDF = async (eventId: string, eventTitle: string) => {
    try {
      setDownloadingPDF(eventId);
      await attendanceService.downloadPDF(eventId, eventTitle);
      console.log(`✅ PDF generado para evento ${eventId}: ${eventTitle}`);
    } catch (error) {
      console.error("❌ Error generando PDF:", error);
      alert(
        `Error al generar PDF: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setDownloadingPDF(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  // Calcular estadísticas usando el método del servicio
  const totalStats =
    completedEvents.length > 0
      ? eventService.getCompletedEventsStats(completedEvents)
      : {
          totalEvents: 0,
          totalRegistered: 0,
          totalAttended: 0,
          averageAttendance: 0,
        };

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando eventos completados...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Eventos Completados
              </h1>
              <p className="text-gray-600">
                Gestiona los reportes de asistencia de eventos finalizados
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Error al cargar eventos
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Eventos Completados
            </h1>
            <p className="text-gray-600">
              Gestiona los reportes de asistencia de eventos finalizados
            </p>
          </div>
        </div>
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
              placeholder="Buscar eventos completados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="date">Ordenar por Fecha</option>
              <option value="attendance">Ordenar por Asistencia</option>
              <option value="participants">Ordenar por Participantes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {totalStats.totalEvents}
          </div>
          <div className="text-sm text-gray-600">Eventos Completados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {totalStats.totalRegistered}
          </div>
          <div className="text-sm text-gray-600">Total Registrados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {totalStats.totalAttended}
          </div>
          <div className="text-sm text-gray-600">Total Asistentes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {totalStats.averageAttendance}%
          </div>
          <div className="text-sm text-gray-600">Asistencia Promedio</div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Event Image */}
            {event.imageUrl && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.eventTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Event Content */}
            <div className="p-6">
              {/* Title and Tags */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.eventTitle}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2" size={16} />
                  <span className="truncate">{event.eventLocation}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2" size={16} />
                  <span>
                    {event.totalAttended} de {event.totalRegistered} asistieron
                  </span>
                </div>
              </div>

              {/* Attendance Rate */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Tasa de Asistencia
                  </span>
                  <span
                    className={`text-sm font-semibold ${getAttendanceColor(
                      event.attendanceRate
                    )}`}
                  >
                    {event.attendanceRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${event.attendanceRate}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleDownloadExcel(event.id, event.eventTitle)
                  }
                  disabled={downloadingExcel === event.id}
                  className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {downloadingExcel === event.id ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <FileSpreadsheet size={16} />
                  )}
                  <span>
                    {downloadingExcel === event.id ? "Descargando..." : "Excel"}
                  </span>
                </button>
                <button
                  onClick={() => handleDownloadPDF(event.id, event.eventTitle)}
                  disabled={downloadingPDF === event.id}
                  className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {downloadingPDF === event.id ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                  <span>
                    {downloadingPDF === event.id ? "Generando..." : "PDF"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron eventos
          </h3>
          <p className="text-gray-600">
            {completedEvents.length === 0
              ? "No hay eventos completados disponibles."
              : "No hay eventos completados que coincidan con tu búsqueda."}
          </p>
        </div>
      )}
    </div>
  );
}
