import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Users, Eye } from "lucide-react";

interface Event {
  id: number;
  eventTitle: string;
  date: string;
  time: string;
  eventLocation: string;
  attendees: number;
  confirmed: number;
  eventObjective: string;
  address: string;
  isVirtual: boolean;
  maxCapacity: number;
  requiresRegistration: boolean;
  isPublic: boolean;
  tags: Array<string>;
  meetingUrl?: string;
  status: "draft" | "published" | "completed" | "cancelled";
  image: string;
}

interface EventListProps {
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
  onViewAttendees: (eventId: number) => void;
  onViewDetails: (event: Event) => void;
}

export default function EventList({
  onCreateEvent,
  onEditEvent,
  onViewAttendees,
  onViewDetails,
}: EventListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const events: Event[] = [
    {
      id: 1,
      eventTitle: "Summer Camp 2025 - International Discovery Week",
      date: "2025-05-05",
      time: "6:00 PM",
      eventLocation: "Comedor Universitario, UPC Sabanas",
      attendees: 17,
      confirmed: 17,
      status: "published",
      image:
        "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",
      eventObjective:
        "Semana internacional de descubrimiento con actividades culturales y académicas para estudiantes.",
      address: "Campus UPC Sabanas, Edificio Principal",
      isVirtual: false,
      maxCapacity: 50,
      requiresRegistration: true,
      isPublic: true,
      tags: ["educación", "internacional", "estudiantes"],
    },
    {
      id: 2,
      eventTitle: "Congreso de Innovación Tecnológica",
      date: "2025-02-14",
      time: "9:00 AM",
      eventLocation: "Auditorio Central",
      attendees: 320,
      confirmed: 280,
      status: "published",
      image:
        "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400",
      eventObjective:
        "Congreso enfocado en las últimas tendencias tecnológicas y su impacto en la industria.",
      address: "Centro de Convenciones, Auditorio Central",
      isVirtual: false,
      maxCapacity: 500,
      requiresRegistration: true,
      isPublic: true,
      tags: ["tecnología", "innovación", "congreso"],
    },
    {
      id: 3,
      eventTitle: "Encuentro de Egresados y Mentores",
      date: "2025-01-09",
      time: "4:03 PM",
      eventLocation: "Auditorio principal",
      attendees: 43,
      confirmed: 35,
      status: "completed",
      image:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
      eventObjective:
        "Encuentro para conectar egresados con estudiantes actuales y facilitar mentorías profesionales.",
      address: "Universidad, Auditorio Principal",
      isVirtual: false,
      maxCapacity: 100,
      requiresRegistration: true,
      isPublic: false,
      tags: ["networking", "mentores", "egresados"],
    },
    {
      id: 4,
      eventTitle: "Workshop de Desarrollo Web",
      date: "2025-03-15",
      time: "2:00 PM",
      eventLocation: "Sala de Conferencias A",
      attendees: 25,
      confirmed: 20,
      status: "draft",
      image:
        "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400",
      eventObjective:
        "Taller práctico sobre desarrollo web moderno con tecnologías actuales.",
      address: "Laboratorio de Computación A",
      isVirtual: true,
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      maxCapacity: 30,
      requiresRegistration: true,
      isPublic: true,
      tags: ["desarrollo", "web", "taller"],
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      // In a real app, you would call your API to delete the event
      console.log("Deleting event with ID:", eventId);
      // For now, just show an alert
      alert("Evento eliminado correctamente");
    }
  };

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "published":
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
              <option value="draft">Borrador</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
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
                  {event.status === "published"
                    ? "Publicado"
                    : event.status === "draft"
                    ? "Borrador"
                    : event.status === "completed"
                    ? "Completado"
                    : event.status === "cancelled"
                    ? "Cancelado"
                    : event.status}
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
                    {new Date(event.date).toLocaleDateString()} at {event.time}
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
                  onClick={() => onViewAttendees(event.id)}
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
    </div>
  );
}
