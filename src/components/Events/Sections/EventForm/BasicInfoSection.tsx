// components/Events/sections/BasicInfoSection.tsx
import React from "react";
import { BasicInfoProps } from "../../Types/EventTypes";

export const BasicInfoSection: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
}) => {
  const titleLength = formData.eventTitle?.trim().length || 0;
  const objectiveLength = formData.eventObjective?.trim().length || 0;

  const titleValid = titleLength >= 5 && titleLength <= 200;
  const objectiveValid = objectiveLength >= 10 && objectiveLength <= 1000;

  const getCharCountColor = (current: number, min: number, max: number) => {
    if (current < min) return "text-red-500";
    if (current > max * 0.9) return "text-amber-500";
    return "text-green-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Título del Evento *
          </label>
          <span className={`text-xs font-medium ${getCharCountColor(titleLength, 5, 200)}`}>
            {titleLength}/200 {titleLength < 5 && `(mínimo 5)`}
          </span>
        </div>
        <input
          type="text"
          name="eventTitle"
          required
          value={formData.eventTitle}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
            titleLength > 0 && !titleValid ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Ingrese el título del evento"
        />
        {titleLength > 0 && titleLength < 5 && (
          <p className="text-xs text-red-500 mt-1">
            El título debe tener al menos 5 caracteres
          </p>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo del Evento *
          </label>
          <span className={`text-xs font-medium ${getCharCountColor(objectiveLength, 10, 1000)}`}>
            {objectiveLength}/1000 {objectiveLength < 10 && `(mínimo 10)`}
          </span>
        </div>
        <textarea
          name="eventObjective"
          required
          rows={3}
          value={formData.eventObjective}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none ${
            objectiveLength > 0 && !objectiveValid ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Describa el objetivo del evento"
        />
        {objectiveLength > 0 && objectiveLength < 10 && (
          <p className="text-xs text-red-500 mt-1">
            El objetivo debe tener al menos 10 caracteres
          </p>
        )}
      </div>
    </div>
  );
};
