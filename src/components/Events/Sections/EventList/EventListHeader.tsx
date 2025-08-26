import { Plus } from "lucide-react";

interface EventListHeaderProps {
  onCreateEvent: () => void;
  loading?: boolean;
  error?: boolean;
}

export function EventListHeader({
  onCreateEvent,
  loading = false,
  error = false,
}: EventListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <p className="text-gray-600">
          {loading
            ? "Cargando eventos..."
            : error
            ? "Error al cargar eventos"
            : "Gestiona tus eventos y rastrea la asistencia"}
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
  );
}
