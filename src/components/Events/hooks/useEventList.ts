import { useState, useEffect } from "react";
import { eventService } from "../../../services/api/eventService";
import type { EventModel } from "../../../services/types/EventTypes";

export const useEventList = () => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventService.getAllEvents();

      if (response.isSuccess && response.data) {
        setEvents(response.data);
      } else {
        setError(response.message || "Error al cargar los eventos");
      }
    } catch (err: any) {
      console.error("Error loading events:", err);
      setError("Error de conexión al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        console.log("Deleting event with ID:", eventId);

        const response = await eventService.deleteEvent(eventId);

        if (response.isSuccess) {
          alert("Evento eliminado correctamente");
          loadEvents();
        } else {
          throw new Error(response.message || "Error al eliminar el evento");
        }
      } catch (error: any) {
        console.error("Error deleting event:", error);
        alert(error.message || "Error al eliminar el evento");
      }
    }
  };

  return {
    events,
    loading,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    loadEvents,
    handleDeleteEvent,
  };
};
