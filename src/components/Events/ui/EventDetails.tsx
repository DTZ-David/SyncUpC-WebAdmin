import { EventDateTime } from "../Sections/EventDetails/EventDateTime";
import { EventHeader } from "../Sections/EventDetails/EventHeader";
import { EventImage } from "../Sections/EventDetails/EventImage";
import { EventInfo } from "../Sections/EventDetails/EventInfo";
import { EventLocation } from "../Sections/EventDetails/EventLocation";
import { EventModality } from "../Sections/EventDetails/EventModality";
import { EventSettings } from "../Sections/EventDetails/EventSettings";
import { EventStats } from "../Sections/EventDetails/EventStats";
import { EventTags } from "../Sections/EventDetails/EventTags";
import { EventTargetAudience } from "../Sections/EventDetails/EventTargetAudience";

interface EventDetailsProps {
  event: any;
  onBack: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: string) => void;
}

export default function EventDetails({
  event,
  onBack,
  onEdit,
  onDelete,
}: EventDetailsProps) {
  // Debug logs
  console.log("🎯 [EventDetails] Event prop recibido:");
  console.log("- event.address:", event.address);
  console.log("- event.eventLocation:", event.eventLocation);
  console.log("- event.additionalDetails:", event.additionalDetails);
  console.log("- Tipo de event.address:", typeof event.address);
  console.log("- Longitud de event.address:", event.address?.length);
  console.log("- Todo el objeto event:", JSON.stringify(event, null, 2));

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      console.log("🎯 [EVENT DETAILS] Llamando onDelete con ID:", event.id);
      onDelete(event.id);
    }
  };

  const handleEdit = () => {
    onEdit(event);
  };

  return (
    <div className="space-y-6">
      <EventHeader
        onBack={onBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <EventImage
            imageUrl={event.imageUrls?.[0] || event.image}
            title={event.eventTitle}
          />

          <EventInfo event={event} />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <EventLocation
              address={event.address}
              eventLocation={event.eventLocation}
            />

            <EventDateTime
              eventStartDate={event.eventStartDate}
              endTime={event.endTime}
            />

            <EventModality
              isVirtual={event.isVirtual}
              meetingUrl={event.meetingUrl}
            />

            <EventTargetAudience
              targetTeachers={event.targetTeachers}
              targetStudents={event.targetStudents}
              targetAdministrative={event.targetAdministrative}
              targetGeneral={event.targetGeneral}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EventStats
            participantCount={event.participantProfilePictures?.length}
            attendees={event.attendees}
            maxCapacity={event.maxCapacity}
          />

          <EventSettings
            requiresRegistration={event.requiresRegistration}
            isSaved={event.isSaved}
          />

          <EventTags tags={event.tags} />
        </div>
      </div>
    </div>
  );
}
