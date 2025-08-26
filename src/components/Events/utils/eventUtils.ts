import { eventService } from "../../../services/api/eventService";

export const parseEventDate = (dateString: string) => {
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
    return new Date();
  }
};

export const parseEventTime = (dateString: string) => {
  try {
    const colombianDate = parseEventDate(dateString);
    return colombianDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "Hora no disponible";
  }
};

export const transformEvent = (event: any) => ({
  ...event,
  date: event.eventStartDate,
  time: parseEventTime(event.eventStartDate),
  location: event.eventLocation,
  title: event.eventTitle,
  attendees: eventService.getParticipantCount(event),
  confirmed: Math.round(eventService.getParticipantCount(event) * 0.8),
  status: eventService.getEventStatus(event) as "created" | "completed",
  image:
    event.imageUrls?.[0] ||
    "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",
  isVirtual: false,
  maxCapacity: 100,
  requiresRegistration: true,
  isPublic: true,
});

export const getStatusColor = (status: string) => {
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

export const getStatusText = (status: string) => {
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
