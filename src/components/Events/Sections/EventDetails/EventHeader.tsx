// utils/dateUtils.ts
export const parseEventDate = (dateString: string): Date | null => {
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

    return new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);
  } catch (error) {
    return null;
  }
};

export const parseEventTime = (dateString: string): string | null => {
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

    const colombianDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    return colombianDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return null;
  }
};

export const formatEndTime = (endTime: string): string => {
  try {
    if (endTime.includes(":")) {
      const [hour, minute] = endTime.split(":");
      const endDate = new Date();
      endDate.setHours(parseInt(hour), parseInt(minute));
      return endDate.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      });
    }
    return endTime;
  } catch (error) {
    return endTime;
  }
};

// utils/statusUtils.ts
export const getStatusColor = (status: string): string => {
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

export const getStatusText = (status: string): string => {
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

// components/EventHeader.tsx
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface EventHeaderProps {
  onBack: () => void;
  onEdit: (event: any) => void;
  onDelete: () => void;
}

export function EventHeader({ onBack, onEdit, onDelete }: EventHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Detalles del Evento
          </h1>
          <p className="text-gray-600">Información completa del evento</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onEdit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <Edit size={20} />
          <span>Editar</span>
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
        >
          <Trash2 size={20} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
