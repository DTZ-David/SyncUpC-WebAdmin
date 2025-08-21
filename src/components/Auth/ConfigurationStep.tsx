// src/components/Auth/RegisterForm/components/ConfigurationStep.tsx

import React from "react";
import {
  StaffFormData,
  Faculty,
  NotificationPreferences as NotificationPrefsType,
} from "../Auth/types";

import NotificationPreferences from "./NotificationPreferences";
import { positionOptions } from "../../constants/positionOptions";

interface ConfigurationStepProps {
  formData: StaffFormData;
  faculties: Faculty[];
  onPreferencesChange: (preferences: NotificationPrefsType) => void;
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  formData,
  faculties,
  onPreferencesChange,
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900">Configuración</h3>
      <p className="text-gray-600">
        Personaliza tus preferencias de notificación
      </p>
    </div>

    <NotificationPreferences
      preferences={formData.notificationPreferences}
      onChange={onPreferencesChange}
    />

    {/* Summary */}
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <h4 className="font-medium text-gray-900 mb-3">Resumen de tu registro</h4>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Nombre:</span> {formData.firstName}{" "}
          {formData.lastName}
        </div>
        <div>
          <span className="font-medium">Email:</span> {formData.email}
        </div>
        <div>
          <span className="font-medium">Profesión:</span> {formData.profession}
        </div>
        <div>
          <span className="font-medium">Cargo:</span>{" "}
          {positionOptions.find((p) => p.value === formData.position)?.label}
        </div>
        <div>
          <span className="font-medium">Facultad:</span>{" "}
          {faculties.find((f) => f.id === formData.facultyId)?.name}
        </div>
      </div>
    </div>
  </div>
);

export default ConfigurationStep;
