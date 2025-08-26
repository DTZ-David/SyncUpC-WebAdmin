import { getStatusColor, getStatusText } from "./EventHeader";

interface EventInfoProps {
  event: any;
}

export function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {event.eventTitle}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {getStatusText(event.status)}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
        <p className="text-gray-600 leading-relaxed">
          {event.eventObjective || "Sin descripción disponible"}
        </p>
      </div>

      {event.additionalDetails && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Detalles Adicionales
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {event.additionalDetails}
          </p>
        </div>
      )}
    </div>
  );
}
