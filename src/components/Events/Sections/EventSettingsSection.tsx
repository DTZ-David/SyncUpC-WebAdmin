// components/Events/sections/EventSettingsSection.tsx
import React from "react";
import { EventSettingsProps } from "../Types/EventTypes";

export const EventSettingsSection: React.FC<EventSettingsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="requiresRegistration"
            checked={formData.requiresRegistration}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Requiere Registro</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Evento Público</span>
        </label>
      </div>
    </div>
  );
};
