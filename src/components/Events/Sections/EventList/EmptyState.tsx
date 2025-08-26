interface EmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onCreateEvent: () => void;
}

export function EmptyState({
  searchTerm,
  statusFilter,
  onCreateEvent,
}: EmptyStateProps) {
  const hasFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? "No se encontraron eventos" : "No hay eventos aún"}
      </h3>
      <p className="text-gray-600 mb-4">
        {hasFilters
          ? "Intenta cambiar los filtros de búsqueda"
          : "Comienza creando tu primer evento"}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateEvent}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
        >
          Crear Primer Evento
        </button>
      )}
    </div>
  );
}
