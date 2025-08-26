interface EventSettingsProps {
  requiresRegistration?: boolean;
  isSaved?: boolean;
}

export function EventSettings({
  requiresRegistration,
  isSaved,
}: EventSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Configuración
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Requiere Registro</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              requiresRegistration !== false
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {requiresRegistration !== false ? "Sí" : "No"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Guardado</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isSaved
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isSaved ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
