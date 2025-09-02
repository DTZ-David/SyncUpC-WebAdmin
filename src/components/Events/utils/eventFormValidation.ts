// utils/eventFormValidation.ts

import { EventFormData } from "../Types/EventTypes";

export const validateEventForm = (formData: EventFormData): string[] => {
  const errors: string[] = [];

  // Validaciones básicas requeridas
  if (!formData.eventTitle.trim()) {
    errors.push("El título del evento es obligatorio");
  }

  if (!formData.eventObjective.trim()) {
    errors.push("El objetivo del evento es obligatorio");
  }

  if (!formData.startDate) {
    errors.push("La fecha de inicio es obligatoria");
  }

  if (!formData.startTime) {
    errors.push("La hora de inicio es obligatoria");
  }

  // Validaciones de fechas y horas
  const dateTimeValidationErrors = validateEventDateTime(formData);
  errors.push(...dateTimeValidationErrors);

  // Validación de audiencia objetivo
  if (!hasTargetAudience(formData)) {
    errors.push("Debe seleccionar al menos una audiencia objetivo");
  }

  // Validación de evento virtual
  if (formData.isVirtual && !formData.meetingUrl.trim()) {
    errors.push("La URL de reunión es obligatoria para eventos virtuales");
  }

  return errors;
};

const validateEventDateTime = (formData: EventFormData): string[] => {
  const errors: string[] = [];

  if (
    formData.startDate &&
    formData.endDate &&
    formData.startTime &&
    formData.endTime
  ) {
    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      errors.push(
        "La fecha y hora de fin debe ser posterior a la fecha y hora de inicio"
      );
    }
  }

  return errors;
};

const hasTargetAudience = (formData: EventFormData): boolean => {
  return (
    formData.targetTeachers ||
    formData.targetStudents ||
    formData.targetAdministrative ||
    formData.targetGeneral
  );
};
