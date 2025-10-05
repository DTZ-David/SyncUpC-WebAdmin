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
  const hasStartDate = formData.startDate !== "";
  const hasStartTime = formData.startTime !== "";

  // Validar ubicación
  let locationValid = true;
  if (!formData.isVirtual) {
    locationValid = formData.campusId !== "" && formData.spaceId !== "";
  } else {
    locationValid = formData.meetingUrl?.trim() !== "";
  }

  // Validar fechas de registro si requiere registro
  let registrationValid = true;
  if (formData.requiresRegistration) {
    registrationValid =
      formData.registrationStart !== "" &&
      formData.registrationStartTime !== "" &&
      formData.registrationEnd !== "" &&
      formData.registrationEndTime !== "";
  }

  // Validar capacidad si se proporciona
  let capacityValid = true;
  if (formData.maxCapacity?.trim()) {
    const capacity = parseInt(formData.maxCapacity);
    capacityValid = !isNaN(capacity) && capacity > 0 && capacity <= 10000;
  }

  return hasStartDate && hasStartTime && locationValid && registrationValid && capacityValid;
};

const validateAudience = (formData: any): boolean => {
  return (
    formData.targetTeachers ||
    formData.targetStudents ||
    formData.targetAdministrative ||
    formData.targetGeneral
  );
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
    validation: () => true,
  },
];
