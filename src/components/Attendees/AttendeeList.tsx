import { useState } from "react";
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
  Mail,
} from "lucide-react";

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

  // Datos de ejemplo - estos vendrán del backend
  const completedEvents: CompletedEvent[] = [
    {
      id: "1",
      eventTitle:
        "Congreso Internacional de Innovación y Tecnología Educativa 2024",
      eventDate: "2024-11-15T09:00:00",
      eventLocation: "Universidad Nacional, Valledupar",
      totalRegistered: 150,
      totalAttended: 132,
      attendanceRate: 88,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      tags: ["Tecnología", "Educación", "Innovación"],
    },
    {
      id: "2",
      eventTitle: "Seminario de Investigación en Ciencias Aplicadas",
      eventDate: "2024-10-22T14:00:00",
      eventLocation: "Centro de Convenciones, Valledupar",
      totalRegistered: 89,
      totalAttended: 76,
      attendanceRate: 85,
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      tags: ["Ciencia", "Investigación"],
    },
    {
      id: "3",
      eventTitle: "Workshop de Desarrollo Sostenible",
      eventDate: "2024-09-10T10:00:00",
      eventLocation: "Auditorio Principal UNICESAR",
      totalRegistered: 65,
      totalAttended: 58,
      attendanceRate: 89,
      imageUrl:
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop",
      tags: ["Sostenibilidad", "Medio Ambiente"],
    },
  ];

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

  const handleDownloadExcel = (eventId: string, eventTitle: string) => {
    console.log(`Descargando Excel para evento ${eventId}: ${eventTitle}`);
    // Aquí se implementaría la descarga real
    alert(`Descargando lista de asistentes del evento: ${eventTitle}`);
  };

  const handleDownloadPDF = (eventId: string, eventTitle: string) => {
    console.log(`Descargando PDF para evento ${eventId}: ${eventTitle}`);
    alert(`Generando reporte PDF del evento: ${eventTitle}`);
  };

  const handleSendEmails = (eventId: string, eventTitle: string) => {
    console.log(`Enviando emails para evento ${eventId}: ${eventTitle}`);
    alert(`Preparando envío masivo de emails para: ${eventTitle}`);
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

  const totalStats = {
    totalEvents: completedEvents.length,
    totalRegistered: completedEvents.reduce(
      (sum, event) => sum + event.totalRegistered,
      0
    ),
    totalAttended: completedEvents.reduce(
      (sum, event) => sum + event.totalAttended,
      0
    ),
    averageAttendance: Math.round(
      completedEvents.reduce((sum, event) => sum + event.attendanceRate, 0) /
        completedEvents.length
    ),
  };

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
                  className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <FileSpreadsheet size={16} />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => handleDownloadPDF(event.id, event.eventTitle)}
                  className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <FileText size={16} />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleSendEmails(event.id, event.eventTitle)}
                  className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Mail size={16} />
                  <span>Emails</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron eventos
          </h3>
          <p className="text-gray-600">
            No hay eventos completados que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
