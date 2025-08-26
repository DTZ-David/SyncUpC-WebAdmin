export const parseEventDate = (dateString: string): Date | null => {
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
    return null;
  }
};

export const parseEventTime = (dateString: string): string | null => {
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

    const colombianDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    return colombianDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return null;
  }
};

export const formatEndTime = (endTime: string): string => {
  try {
    if (endTime.includes(":")) {
      const [hour, minute] = endTime.split(":");
      const endDate = new Date();
      endDate.setHours(parseInt(hour), parseInt(minute));
      return endDate.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      });
    }
    return endTime;
  } catch (error) {
    return endTime;
  }
};
