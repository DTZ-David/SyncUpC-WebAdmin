import React from "react";
import { TargetAudienceProps } from "../Types/EventTypes";
import { FormField } from "../FormField";

export const TargetAudienceSection: React.FC<TargetAudienceProps> = ({
  formData,
  onChange,
  hasError,
  getError,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Audiencia Objetivo
      </h3>

      <FormField
        label="Selecciona la audiencia objetivo"
        name="targetAudience"
        error={getError("targetTeachers")} // Using targetTeachers as the validation field
      >
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="targetTeachers"
              checked={formData.targetTeachers}
              onChange={onChange}
              className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">Profesores</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="targetStudents"
              checked={formData.targetStudents}
              onChange={onChange}
              className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">Estudiantes</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="targetAdministrative"
              checked={formData.targetAdministrative}
              onChange={onChange}
              className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">
              Personal Administrativo
            </span>
          </label>

          <label className="flex items-center space-x-3">
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
      </FormField>
    </div>
  );
};
