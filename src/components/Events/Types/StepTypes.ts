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

export const FORM_STEPS: Step[] = [
  {
    id: "basic",
    title: "Información Básica",
    icon: "📝",
    description: "Título, objetivo y detalles principales del evento",
    component: BasicInfoStep,
    validation: (formData) =>
      formData.eventTitle.trim() !== "" &&
      formData.eventObjective.trim() !== "",
  },
  {
    id: "datetime",
    title: "Fecha y Ubicación",
    icon: "📅",
    description: "Cuándo y dónde se realizará el evento",
    component: DateTimeLocationStep,
    validation: (formData) =>
      formData.startDate !== "" && formData.startTime !== "",
  },
  {
    id: "audience",
    title: "Audiencia y Configuración",
    icon: "👥",
    description: "A quién está dirigido y configuraciones especiales",
    component: AudienceConfigStep,
    validation: (formData) =>
      formData.targetTeachers ||
      formData.targetStudents ||
      formData.targetAdministrative ||
      formData.targetGeneral,
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
