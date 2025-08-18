// components/Events/sections/BasicInfoSection.tsx
import React from "react";
import { BasicInfoProps } from "../Types/EventTypes";

export const BasicInfoSection: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título del Evento *
        </label>
        <input
          type="text"
          name="eventTitle"
          required
          value={formData.eventTitle}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          placeholder="Ingrese el título del evento"
        />
      </div>

      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objetivo del Evento *
        </label>
        <textarea
          name="eventObjective"
          required
          rows={3}
          value={formData.eventObjective}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          placeholder="Describa el objetivo del evento"
        />
      </div>
    </div>
  );
};
