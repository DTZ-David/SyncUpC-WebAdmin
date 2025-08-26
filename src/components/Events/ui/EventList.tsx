import { useEventList } from "../hooks/useEventList";
import { EmptyState } from "../Sections/EventList/EmptyState";
import { EventGrid } from "../Sections/EventList/EventGrid";
import { EventListHeader } from "../Sections/EventList/EventListHeader";
import { LoadingSkeleton } from "../Sections/EventList/LoadingSkeleton";
import { SearchAndFilter } from "../Sections/EventList/SearchAndFilter";
import { ErrorDisplay } from "../utils/ErrorDisplay";
import { transformEvent } from "../utils/eventUtils";

interface EventListProps {
  onCreateEvent: () => void;
  onEditEvent: (event: any) => void;
  onViewAttendees: (eventId: number) => void;
  onViewDetails: (event: any) => void;
}

export default function EventList({
  onCreateEvent,
  onEditEvent,
  onViewAttendees,
  onViewDetails,
}: EventListProps) {
  const {
    events,
    loading,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    loadEvents,
    handleDeleteEvent,
  } = useEventList();

  // Transformar eventos del backend al formato esperado
  const transformedEvents = events.map(transformEvent);

  // Filtrar eventos
  const filteredEvents = transformedEvents.filter((event) => {
    const matchesSearch = event.eventTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <EventListHeader onCreateEvent={onCreateEvent} loading={true} />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <EventListHeader onCreateEvent={onCreateEvent} error={true} />
        <ErrorDisplay error={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EventListHeader onCreateEvent={onCreateEvent} />

      <SearchAndFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      {filteredEvents.length === 0 ? (
        <EmptyState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onCreateEvent={onCreateEvent}
        />
      ) : (
        <EventGrid
          events={filteredEvents}
          onViewAttendees={onViewAttendees}
          onViewDetails={onViewDetails}
          onEditEvent={onEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
    </div>
  );
}
