// types/eventTypes.ts
export interface EventFormData {
  eventTitle: string;
  eventObjective: string;
  eventLocation: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
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
  tags: string[];
  imageUrls: string[];
  additionalDetails: string;
}

export interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
}

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface DateTimeInfoProps {
  formData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export interface TagsInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export interface ImageUploadProps {
  onImageUpload?: (files: FileList | null) => void;
  currentImage?: string;
  isEditing?: boolean;
}
