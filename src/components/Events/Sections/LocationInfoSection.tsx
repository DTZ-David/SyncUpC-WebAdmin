// components/Events/sections/LocationInfoSection.tsx
import React from "react";
import { MapPin } from "lucide-react";
import { LocationInfoProps } from "../Types/EventTypes";

export const LocationInfoSection: React.FC<LocationInfoProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación del Evento *
        </label>
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="eventLocation"
            required
            value={formData.eventLocation}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="Nombre del lugar"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          placeholder="Dirección completa"
        />
      </div>
    </div>
  );
};
