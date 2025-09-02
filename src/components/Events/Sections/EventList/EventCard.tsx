import { Users, Eye, Edit, Trash2 } from "lucide-react";
import {
  parseEventDate,
  getStatusColor,
  getStatusText,
} from "../../utils/eventUtils";

interface EventCardProps {
  event: any;
  onViewAttendees: (eventId: number) => void;
  onViewDetails: (event: any) => void;
  onEditEvent: (event: any) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventCard({
  event,
  onViewAttendees,
  onViewDetails,
  onEditEvent,
  onDeleteEvent,
}: EventCardProps) {
  return (
    <div
      key={event.id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img
          src={event.image || "/logo.svg"}
          alt={event.eventTitle || "Evento sin título"}
          className="w-full h-full object-contain bg-white"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/logo.svg";
          }}
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
              {parseEventDate(event.eventStartDate).toLocaleDateString("es-CO")}{" "}
              a las {event.time}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-16">Lugar:</span>
            <span className="truncate">{event.campus.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
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
              onClick={() => onDeleteEvent(event.id)}
              className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Eliminar Evento"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
