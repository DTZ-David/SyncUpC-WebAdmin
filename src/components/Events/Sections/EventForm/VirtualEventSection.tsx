// components/Events/sections/VirtualEventSection.tsx
import React from "react";
import { Video, Users } from "lucide-react";
import { VirtualEventProps } from "../../Types/EventTypes";

export const VirtualEventSection: React.FC<VirtualEventProps> = ({
  formData,
  onChange,
}) => {
  const isVirtual = formData.isVirtual;
  const hasMeetingUrl = formData.meetingUrl && formData.meetingUrl.trim() !== "";
  const showUrlError = isVirtual && !hasMeetingUrl;

  // Validar capacidad
  const capacity = formData.maxCapacity ? parseInt(formData.maxCapacity) : 0;
  const capacityInvalid = formData.maxCapacity && (isNaN(capacity) || capacity < 0 || capacity > 10000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            name="isVirtual"
            checked={formData.isVirtual}
            onChange={onChange}
            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Evento Virtual
          </span>
        </label>
        {formData.isVirtual && (
          <div>
            <div className="relative">
              <Video
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="url"
                name="meetingUrl"
                value={formData.meetingUrl}
                onChange={onChange}
                required
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                  showUrlError ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="https://meet.google.com/... o https://zoom.us/..."
              />
            </div>
            {showUrlError && (
              <p className="text-xs text-red-500 mt-1">
                La URL de la reunión es requerida para eventos virtuales
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capacidad Máxima
          <span className="text-gray-500 font-normal ml-1">(opcional)</span>
        </label>
        <div className="relative">
          <Users
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
              capacityInvalid ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="0 = Sin límite"
            min="0"
            max="10000"
          />
        </div>
        {capacityInvalid && (
          <p className="text-xs text-red-500 mt-1">
            La capacidad debe ser un número entre 0 y 10,000
          </p>
        )}
        {!capacityInvalid && capacity === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Vacío o 0 = Sin límite de capacidad
          </p>
        )}
      </div>
    </div>
  );
};
