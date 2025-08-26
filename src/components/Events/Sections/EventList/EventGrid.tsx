import { EventCard } from "./EventCard";

interface EventGridProps {
  events: any[];
  onViewAttendees: (eventId: number) => void;
  onViewDetails: (event: any) => void;
  onEditEvent: (event: any) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventGrid({
  events,
  onViewAttendees,
  onViewDetails,
  onEditEvent,
  onDeleteEvent,
}: EventGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onViewAttendees={onViewAttendees}
          onViewDetails={onViewDetails}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      ))}
    </div>
  );
}
