// src/components/Auth/types/index.ts

export interface Faculty {
  id: string;
  name: string;
}

export interface NotificationPreferences {
  eventReminder: { push: boolean; email: boolean; whatsApp: boolean };
  eventUpdate: { push: boolean; email: boolean; whatsApp: boolean };
  forumReply: { push: boolean; email: boolean; whatsApp: boolean };
  forumMention: { push: boolean; email: boolean; whatsApp: boolean };
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  profession: string;
  department: string;
  position: string;
  facultyId: string;
  notificationPreferences: NotificationPreferences;
}

export interface RegisterFormProps {
  onRegister: (userData: Omit<StaffFormData, "confirmPassword">) => void;
  onSwitchToLogin: () => void;
}

export interface PositionOption {
  value: string;
  label: string;
}
