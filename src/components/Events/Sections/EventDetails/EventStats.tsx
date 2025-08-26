interface EventStatsProps {
  participantCount?: number;
  attendees?: number;
  maxCapacity?: number;
}

export function EventStats({
  participantCount,
  attendees,
  maxCapacity,
}: EventStatsProps) {
  const totalParticipants = participantCount || attendees || 0;
  const confirmed = Math.round(totalParticipants * 0.8);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Asistentes Registrados</span>
          <span className="font-semibold text-gray-900">
            {totalParticipants}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Confirmados</span>
          <span className="font-semibold text-green-600">{confirmed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Capacidad Máxima</span>
          <span className="font-semibold text-gray-900">
            {maxCapacity || "Sin límite"}
          </span>
        </div>
      </div>
    </div>
  );
}
