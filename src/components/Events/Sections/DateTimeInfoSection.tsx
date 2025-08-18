// components/Events/sections/DateTimeInfoSection.tsx
import React from "react";
import { Calendar } from "lucide-react";
import { DateTimeInfoProps } from "../Types/EventTypes";

export const DateTimeInfoSection: React.FC<DateTimeInfoProps> = ({
  formData,
  onChange,
}) => {
  return (
    <>
      {/* Event Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora de Inicio *
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="datetime-local"
              name="startDate"
              required
              value={formData.startDate}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora de Fin *
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="datetime-local"
              name="endDate"
              required
              value={formData.endDate}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Registration Period */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inicio de Registro *
          </label>
          <input
            type="datetime-local"
            name="registrationStart"
            required
            value={formData.registrationStart}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fin de Registro *
          </label>
          <input
            type="datetime-local"
            name="registrationEnd"
            required
            value={formData.registrationEnd}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};
