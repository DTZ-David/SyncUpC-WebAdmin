// Types/EventTypes.ts - Actualizado
export interface EventFormData {
  eventTitle: string;
  eventObjective: string;

  // Nuevos campos para campus y espacios
  campusId: string;
  spaceId: string;

  // Fechas y horarios
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  registrationStart: string;
  registrationStartTime: string;
  registrationEnd: string;
  registrationEndTime: string;

  careerIds: string[];
  targetTeachers: boolean;
  targetStudents: boolean;
  targetAdministrative: boolean;
  targetGeneral: boolean;
  isVirtual: boolean;
  meetingUrl: string;
  maxCapacity: string;
  requiresRegistration: boolean;
  isPublic: boolean;

  // Nuevos campos para categorías y tipos
  eventCategoryIds: string[];
  eventTypeIds: string[];

  imageUrls: string[];
  additionalDetails: string;

  // Campos legacy para compatibilidad (opcionales)
  eventLocation?: string;
  address?: string;
  tags?: string[];
}

export interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  onEventCreated?: (event: any) => void;
}

type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export interface BasicInfoProps {
  formData: EventFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export interface LocationInfoProps {
  formData: EventFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCampusChange?: (campusId: string) => void;
  onSpaceChange?: (spaceId: string) => void;
}

export interface DateTimeInfoProps {
  formData: EventFormData;
  onChange: (e: FormChangeEvent) => void;
}

export interface TargetAudienceProps {
  formData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface VirtualEventProps {
  formData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface EventSettingsProps {
  formData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CategoryTypeInputProps {
  categories: string[];
  eventTypes: string[];
  onCategoryChange: (categoryIds: string[]) => void;
  onTypeChange: (typeIds: string[]) => void;
}

export interface ImageUploadProps {
  onImageUpload?: (files: FileList | null) => void;
  currentImage?: string;
  isEditing?: boolean;
}
