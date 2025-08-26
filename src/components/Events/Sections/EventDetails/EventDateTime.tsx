import { Calendar, Clock } from "lucide-react";
import { parseEventDate, parseEventTime, formatEndTime } from "./EventHeader";

interface EventDateTimeProps {
  eventStartDate: string;
  endTime?: string;
}

export function EventDateTime({ eventStartDate, endTime }: EventDateTimeProps) {
  const formattedDate = eventStartDate ? parseEventDate(eventStartDate) : null;
  const formattedTime = eventStartDate ? parseEventTime(eventStartDate) : null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Fecha y Hora</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Calendar className="text-gray-400" size={20} />
          <div>
            <p className="font-medium text-gray-900">Fecha de Inicio</p>
            <p className="text-gray-600">
              {formattedDate
                ? formattedDate.toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha no disponible"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="text-gray-400" size={20} />
          <div>
            <p className="font-medium text-gray-900">Horario</p>
            <p className="text-gray-600">
              {formattedTime || "Hora no disponible"} -{" "}
              {endTime ? formatEndTime(endTime) : "Hora fin no disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
