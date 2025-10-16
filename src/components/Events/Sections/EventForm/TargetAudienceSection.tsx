import React from "react";
import { TargetAudienceProps } from "../../Types/EventTypes";
import { FormField } from "./FormField";

export const TargetAudienceSection: React.FC<TargetAudienceProps> = ({
  formData,
  onChange,
}) => {
  const hasAnyTarget =
    formData.targetTeachers ||
    formData.targetStudents ||
    formData.targetAdministrative ||
    formData.targetGeneral;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Audiencia Objetivo *
      </h3>

      <FormField label="Selecciona al menos una audiencia objetivo" name="targetAudience">
        <div className={`space-y-3 p-4 rounded-lg border ${
          !hasAnyTarget ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
        }`}>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="targetTeachers"
              checked={formData.targetTeachers}
              onChange={onChange}
              className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">Profesores</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="targetStudents"
              checked={formData.targetStudents}
              onChange={onChange}
              className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">Estudiantes</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
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

          <label className="flex items-center space-x-3 cursor-pointer">
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
        {!hasAnyTarget && (
          <p className="text-xs text-red-500 mt-2">
            Debes seleccionar al menos una audiencia objetivo
          </p>
        )}
      </FormField>
    </div>
  );
};
