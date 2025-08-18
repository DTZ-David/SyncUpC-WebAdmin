// components/Events/sections/TargetAudienceSection.tsx
import React from "react";
import { TargetAudienceProps } from "../Types/EventTypes";

export const TargetAudienceSection: React.FC<TargetAudienceProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Audiencia Objetivo
      </label>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="targetTeachers"
            checked={formData.targetTeachers}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Profesores</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="targetStudents"
            checked={formData.targetStudents}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Estudiantes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="targetAdministrative"
            checked={formData.targetAdministrative}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Administrativos</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="targetGeneral"
            checked={formData.targetGeneral}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm text-gray-700">Público General</span>
        </label>
      </div>
    </div>
  );
};
