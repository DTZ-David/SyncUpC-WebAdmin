// components/Events/sections/VirtualEventSection.tsx
import React from "react";
import { Video, Users } from "lucide-react";
import { VirtualEventProps } from "../Types/EventTypes";

export const VirtualEventSection: React.FC<VirtualEventProps> = ({
  formData,
  onChange,
}) => {
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="URL de la reunión"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capacidad Máxima
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="0 = Sin límite"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};
