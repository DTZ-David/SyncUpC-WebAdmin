import { AudienceConfigStep } from "../Sections/EventForm/AudienceConfigStep";
import { BasicInfoStep } from "../Sections/EventForm/BasicInfoStep";
import { DateTimeLocationStep } from "../Sections/EventForm/DateTimeLocationStep";
import { FinalDetailsStep } from "../Sections/EventForm/FinalDetailsStep";

export interface Step {
  id: string;
  title: string;
  icon: string;
  description: string;
  component: React.ComponentType<any>;
  validation?: (formData: any) => boolean;
}

// Funciones de validación mejoradas
const validateBasicInfo = (formData: any): boolean => {
  const title = formData.eventTitle?.trim() || "";
  const objective = formData.eventObjective?.trim() || "";

  return (
    title.length >= 5 &&
    title.length <= 200 &&
    objective.length >= 10 &&
    objective.length <= 1000
  );
};

const validateDateTimeLocation = (formData: any): boolean => {
  const hasStartDate = formData.startDate !== "" && formData.startDate !== undefined;
  const hasStartTime = formData.startTime !== "" && formData.startTime !== undefined;

  // Validar que la fecha y hora no estén en el pasado
  let dateTimeValid = true;
  let eventDateTime: Date | null = null;
  if (hasStartDate && hasStartTime) {
    const now = new Date();
    eventDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    dateTimeValid = eventDateTime > now;
  }

  // Validar que la fecha de fin sea después de la fecha de inicio (si se proporcionan ambas)
  let endDateValid = true;
  const hasEndDate = formData.endDate && formData.endDate !== "";
  const hasEndTime = formData.endTime && formData.endTime !== "";
  if (hasStartDate && hasStartTime && hasEndDate && hasEndTime) {
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    endDateValid = endDateTime > eventDateTime!;
  }

  // Validar ubicación
  let locationValid = true;
  if (!formData.isVirtual) {
    locationValid = formData.campusId !== "" && formData.campusId !== undefined &&
                    formData.spaceId !== "" && formData.spaceId !== undefined;
  } else {
    locationValid = formData.meetingUrl?.trim() !== "" && formData.meetingUrl !== undefined;
  }

  // Validar fechas de registro si requiere registro
  // NOTA: Por ahora no validamos fechas de registro porque no hay campos en la UI
  // TODO: Agregar campos de registro en DateTimeInfoSection si se necesitan
  let registrationValid = true;
  // if (formData.requiresRegistration) {
  //   registrationValid =
  //     formData.registrationStart !== "" && formData.registrationStart !== undefined &&
  //     formData.registrationStartTime !== "" && formData.registrationStartTime !== undefined &&
  //     formData.registrationEnd !== "" && formData.registrationEnd !== undefined &&
  //     formData.registrationEndTime !== "" && formData.registrationEndTime !== undefined;
  // }

  // Validar capacidad si se proporciona
  let capacityValid = true;
  if (formData.maxCapacity !== undefined && formData.maxCapacity !== null && formData.maxCapacity.toString().trim() !== "") {
    const capacity = parseInt(formData.maxCapacity);
    // Permitir 0 o mayor (0 = sin límite)
    capacityValid = !isNaN(capacity) && capacity >= 0 && capacity <= 10000;
  }

  const isValid = hasStartDate && hasStartTime && dateTimeValid && endDateValid && locationValid && registrationValid && capacityValid;

  console.log("🔍 Validation Debug - Fecha y Ubicación:", {
    "✅ hasStartDate": hasStartDate,
    "✅ hasStartTime": hasStartTime,
    "⏰ dateTimeValid": dateTimeValid,
    "📅 endDateValid": endDateValid,
    "📍 locationValid": locationValid,
    "📝 registrationValid": registrationValid,
    "👥 capacityValid": capacityValid,
    "---": "--- Valores actuales ---",
    "startDate": formData.startDate,
    "startTime": formData.startTime,
    "endDate": formData.endDate,
    "endTime": formData.endTime,
    "eventDateTime": eventDateTime?.toLocaleString(),
    "now": new Date().toLocaleString(),
    "maxCapacity": formData.maxCapacity,
    "isVirtual": formData.isVirtual,
    "campusId": formData.campusId,
    "spaceId": formData.spaceId,
    "requiresRegistration": formData.requiresRegistration,
    "meetingUrl": formData.meetingUrl,
    "🎯 FINAL_RESULT": isValid,
  });

  return isValid;
};

const validateAudience = (formData: any): boolean => {
  // Validar que al menos una audiencia esté seleccionada
  const hasAudience =
    formData.targetTeachers ||
    formData.targetStudents ||
    formData.targetAdministrative ||
    formData.targetGeneral;

  // Validar que al menos una carrera esté seleccionada
  const hasCareer = formData.careerIds && formData.careerIds.length > 0;

  const isValid = hasAudience && hasCareer;

  console.log("🔍 Validation Debug - Audiencia:", {
    "✅ hasAudience": hasAudience,
    "🎓 hasCareer": hasCareer,
    "---": "--- Valores actuales ---",
    "targetTeachers": formData.targetTeachers,
    "targetStudents": formData.targetStudents,
    "targetAdministrative": formData.targetAdministrative,
    "targetGeneral": formData.targetGeneral,
    "careerIds": formData.careerIds,
    "🎯 FINAL_RESULT": isValid,
  });

  return isValid;
};

const validateFinalDetails = (formData: any): boolean => {
  // Validar que al menos una categoría esté seleccionada
  const hasCategory = formData.eventCategoryIds && formData.eventCategoryIds.length > 0;

  // Validar que al menos un tipo esté seleccionado
  const hasType = formData.eventTypeIds && formData.eventTypeIds.length > 0;

  const isValid = hasCategory && hasType;

  console.log("🔍 Validation Debug - Detalles Finales:", {
    "🏷️ hasCategory": hasCategory,
    "📋 hasType": hasType,
    "---": "--- Valores actuales ---",
    "eventCategoryIds": formData.eventCategoryIds,
    "eventTypeIds": formData.eventTypeIds,
    "🎯 FINAL_RESULT": isValid,
  });

  return isValid;
};

export const FORM_STEPS: Step[] = [
  {
    id: "basic",
    title: "Información Básica",
    icon: "📝",
    description: "Título, objetivo y detalles principales del evento",
    component: BasicInfoStep,
    validation: validateBasicInfo,
  },
  {
    id: "datetime",
    title: "Fecha y Ubicación",
    icon: "📅",
    description: "Cuándo y dónde se realizará el evento",
    component: DateTimeLocationStep,
    validation: validateDateTimeLocation,
  },
  {
    id: "audience",
    title: "Audiencia y Configuración",
    icon: "👥",
    description: "A quién está dirigido y configuraciones especiales",
    component: AudienceConfigStep,
    validation: validateAudience,
  },
  {
    id: "details",
    title: "Detalles Finales",
    icon: "✨",
    description: "Información adicional, etiquetas e imagen",
    component: FinalDetailsStep,
    validation: validateFinalDetails,
  },
];
