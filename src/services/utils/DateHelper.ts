export class DateHelper {
  static formatDateForInput(dateString: string): string {
    if (!dateString) return "";

    try {
      // Ahora el backend devuelve fechas en formato ISO
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateString, error);
      return "";
    }
  }

  static parseEventDate(dateString: string): Date {
    if (!dateString) {
      console.warn(
        "DateHelper.parseEventDate: dateString is undefined or empty"
      );
      return new Date(); // Fecha actual como fallback
    }

    try {
      // Si es formato ISO (nuevo formato del backend)
      if (dateString.includes("T") || dateString.includes("Z")) {
        return new Date(dateString);
      }

      // Formato legacy "31/07/2025 19:00:00"
      const [datePart, timePart] = dateString.split(" ");
      if (!datePart || !timePart) {
        console.warn(
          "DateHelper.parseEventDate: Invalid date format:",
          dateString
        );
        return new Date();
      }

      const [day, month, year] = datePart.split("/");
      const [hour, minute, second] = timePart.split(":");

      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second || "0")
      );
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return new Date();
    }
  }

  static formatEventDate(dateString: string): string {
    if (!dateString) return "Fecha no disponible";

    const date = this.parseEventDate(dateString);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  static formatEventDateTime(dateString: string): string {
    if (!dateString) return "Fecha no disponible";

    const date = this.parseEventDate(dateString);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static getEventStatus(event: any): "upcoming" | "confirmed" | "completed" {
    // Si el backend ya proporciona el status, usarlo
    if (event.status) {
      const backendStatus = event.status.toLowerCase();
      if (
        backendStatus.includes("upcoming") ||
        backendStatus.includes("pendiente")
      ) {
        return "upcoming";
      }
      if (
        backendStatus.includes("confirmed") ||
        backendStatus.includes("confirmado")
      ) {
        return "confirmed";
      }
      if (
        backendStatus.includes("completed") ||
        backendStatus.includes("completado")
      ) {
        return "completed";
      }
    }

    // Fallback: calcular basado en fechas
    const eventDate =
      event.eventStartDate || event.startDate || event.eventDate;

    if (!eventDate) {
      console.warn(
        "DateHelper.getEventStatus: No date available for event:",
        event.id
      );
      return "upcoming";
    }

    const today = new Date();
    const eventDateObj = this.parseEventDate(eventDate);

    if (isNaN(eventDateObj.getTime())) {
      return "upcoming";
    }

    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const eventDateOnly = new Date(
      eventDateObj.getFullYear(),
      eventDateObj.getMonth(),
      eventDateObj.getDate()
    );

    if (eventDateOnly > todayDateOnly) {
      return "upcoming";
    } else if (eventDateOnly.getTime() === todayDateOnly.getTime()) {
      return "confirmed";
    } else {
      return "completed";
    }
  }

  // ← NUEVO: Método para obtener la fecha principal del evento
  static getMainEventDate(event: any): string {
    return event.eventStartDate || event.startDate || event.eventDate || "";
  }
}
