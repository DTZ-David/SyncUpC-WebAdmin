// src/components/Events/hooks/useEventFormValidation.ts

import { useState } from "react";
import { EventFormData } from "../Types/EventTypes";

export interface ValidationErrors {
  [key: string]: string;
}

export const useEventFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validaciones auxiliares
  const validateTitle = (title: string): string | null => {
    if (!title.trim()) {
      return "El título del evento es requerido";
    }

    if (title.trim().length < 5) {
      return "El título debe tener al menos 5 caracteres";
    }

    if (title.trim().length > 200) {
      return "El título no puede exceder 200 caracteres";
    }

    return null;
  };

  const validateObjective = (objective: string): string | null => {
    if (!objective.trim()) {
      return "El objetivo del evento es requerido";
    }

    if (objective.trim().length < 10) {
      return "El objetivo debe tener al menos 10 caracteres";
    }

    if (objective.trim().length > 1000) {
      return "El objetivo no puede exceder 1000 caracteres";
    }

    return null;
  };

  const validateDate = (date: string, fieldName: string): string | null => {
    if (!date) {
      return `La ${fieldName} es requerida`;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return `La ${fieldName} no puede ser anterior a hoy`;
    }

    return null;
  };

  const validateTime = (time: string, fieldName: string): string | null => {
    if (!time) {
      return `La ${fieldName} es requerida`;
    }

    return null;
  };

  const validateDateRange = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): { endDate?: string; endTime?: string } => {
    const errors: { endDate?: string; endTime?: string } = {};

    if (startDate && endDate && startTime && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (end <= start) {
        errors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
        errors.endTime = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    return errors;
  };

  const validateRegistrationDates = (
    registrationStart: string,
    registrationStartTime: string,
    registrationEnd: string,
    registrationEndTime: string,
    startDate: string,
    startTime: string,
    requiresRegistration: boolean
  ): {
    registrationStart?: string;
    registrationStartTime?: string;
    registrationEnd?: string;
    registrationEndTime?: string;
  } => {
    const errors: {
      registrationStart?: string;
      registrationStartTime?: string;
      registrationEnd?: string;
      registrationEndTime?: string;
    } = {};

    if (!requiresRegistration) {
      return errors;
    }

    if (!registrationStart) {
      errors.registrationStart = "La fecha de inicio de registro es requerida";
    }

    if (!registrationStartTime) {
      errors.registrationStartTime = "La hora de inicio de registro es requerida";
    }

    if (!registrationEnd) {
      errors.registrationEnd = "La fecha de fin de registro es requerida";
    }

    if (!registrationEndTime) {
      errors.registrationEndTime = "La hora de fin de registro es requerida";
    }

    if (
      registrationStart &&
      registrationStartTime &&
      registrationEnd &&
      registrationEndTime
    ) {
      const regStart = new Date(`${registrationStart}T${registrationStartTime}`);
      const regEnd = new Date(`${registrationEnd}T${registrationEndTime}`);

      if (regEnd <= regStart) {
        errors.registrationEnd =
          "La fecha de fin de registro debe ser posterior a la fecha de inicio";
      }

      if (startDate && startTime) {
        const eventStart = new Date(`${startDate}T${startTime}`);
        if (regEnd > eventStart) {
          errors.registrationEnd =
            "El registro debe finalizar antes del inicio del evento";
        }
      }
    }

    return errors;
  };

  const validateLocation = (
    isVirtual: boolean,
    campusId: string,
    spaceId: string,
    meetingUrl: string
  ): { campusId?: string; spaceId?: string; meetingUrl?: string } => {
    const errors: { campusId?: string; spaceId?: string; meetingUrl?: string } = {};

    if (!isVirtual) {
      if (!campusId) {
        errors.campusId = "Debe seleccionar una sede";
      }
      if (!spaceId) {
        errors.spaceId = "Debe seleccionar un espacio";
      }
    }

    if (isVirtual && !meetingUrl.trim()) {
      errors.meetingUrl = "La URL de la reunión virtual es requerida";
    }

    if (isVirtual && meetingUrl.trim()) {
      try {
        new URL(meetingUrl);
      } catch {
        errors.meetingUrl = "La URL de la reunión no es válida";
      }
    }

    return errors;
  };

  const validateCapacity = (capacity: string): string | null => {
    if (!capacity.trim()) {
      return null; // Capacidad es opcional
    }

    const numCapacity = parseInt(capacity);
    if (isNaN(numCapacity) || numCapacity < 1) {
      return "La capacidad debe ser un número mayor a 0";
    }

    if (numCapacity > 10000) {
      return "La capacidad no puede exceder 10,000 personas";
    }

    return null;
  };

  const validateAudience = (
    targetTeachers: boolean,
    targetStudents: boolean,
    targetAdministrative: boolean,
    targetGeneral: boolean
  ): string | null => {
    if (!targetTeachers && !targetStudents && !targetAdministrative && !targetGeneral) {
      return "Debe seleccionar al menos una audiencia objetivo";
    }

    return null;
  };

  // Validación por step
  const validateStep = (step: number, formData: EventFormData): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 0: // Información Básica
        const titleError = validateTitle(formData.eventTitle);
        if (titleError) newErrors.eventTitle = titleError;

        const objectiveError = validateObjective(formData.eventObjective);
        if (objectiveError) newErrors.eventObjective = objectiveError;
        break;

      case 1: // Fecha y Ubicación
        const startDateError = validateDate(formData.startDate, "fecha de inicio");
        if (startDateError) newErrors.startDate = startDateError;

        const startTimeError = validateTime(formData.startTime, "hora de inicio");
        if (startTimeError) newErrors.startTime = startTimeError;

        // Validar rango de fechas si hay fecha de fin
        if (formData.endDate || formData.endTime) {
          const dateRangeErrors = validateDateRange(
            formData.startDate,
            formData.startTime,
            formData.endDate,
            formData.endTime
          );
          Object.assign(newErrors, dateRangeErrors);
        }

        // Validar ubicación
        const locationErrors = validateLocation(
          formData.isVirtual,
          formData.campusId,
          formData.spaceId,
          formData.meetingUrl
        );
        Object.assign(newErrors, locationErrors);

        // Validar fechas de registro si requiere registro
        if (formData.requiresRegistration) {
          const regErrors = validateRegistrationDates(
            formData.registrationStart,
            formData.registrationStartTime,
            formData.registrationEnd,
            formData.registrationEndTime,
            formData.startDate,
            formData.startTime,
            formData.requiresRegistration
          );
          Object.assign(newErrors, regErrors);
        }

        // Validar capacidad
        const capacityError = validateCapacity(formData.maxCapacity);
        if (capacityError) newErrors.maxCapacity = capacityError;
        break;

      case 2: // Audiencia y Configuración
        const audienceError = validateAudience(
          formData.targetTeachers,
          formData.targetStudents,
          formData.targetAdministrative,
          formData.targetGeneral
        );
        if (audienceError) newErrors.audience = audienceError;
        break;

      case 3: // Detalles Finales
        // No hay campos obligatorios en este paso
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateStep,
    clearError,
    clearAllErrors,
  };
};
