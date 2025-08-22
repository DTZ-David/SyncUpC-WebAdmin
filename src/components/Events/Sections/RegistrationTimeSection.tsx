// components/Events/Sections/RegistrationTimeSection.tsx
import React from "react";
import { EventFormData } from "../Types/EventTypes";

interface RegistrationTimeSectionProps {
  formData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const RegistrationTimeSection: React.FC<
  RegistrationTimeSectionProps
> = ({ formData, onChange, disabled = false }) => {
  if (!formData.requiresRegistration) {
    return null;
  }

  return (
    <div className="space-y-4 pl-6 border-l-2 border-lime-200">
      <h4 className="text-md font-medium text-gray-800">
        Horarios de Registro
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de Inicio de Registro *
          </label>
          <input
            type="time"
            name="registrationStartTime"
            value={formData.registrationStartTime}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            required={formData.requiresRegistration}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de Fin de Registro *
          </label>
          <input
            type="time"
            name="registrationEndTime"
            value={formData.registrationEndTime}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            required={formData.requiresRegistration}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
