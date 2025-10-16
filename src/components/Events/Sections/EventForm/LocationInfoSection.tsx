// components/Events/sections/LocationInfoSection.tsx
import React from "react";
import { MapPin, Building } from "lucide-react";
import { LocationInfoProps } from "../../Types/EventTypes";
import { Campus, Space } from "../../../../services/types/EventTypes";
import { CustomSelect } from "./CustomSelect";

interface UpdatedLocationInfoProps extends Omit<LocationInfoProps, "onChange"> {
  campuses: Campus[];
  availableSpaces: Space[];
  isLoadingMetadata: boolean;
  onCampusChange: (campusId: string) => void;
  onSpaceChange: (spaceId: string) => void;
}
// Agrega estos console.logs al inicio del componente LocationInfoSection

export const LocationInfoSection: React.FC<UpdatedLocationInfoProps> = ({
  formData,
  campuses,
  availableSpaces,
  isLoadingMetadata,
  onCampusChange,
  onSpaceChange,
}) => {
  const campusOptions = (campuses || []).map((campus) => ({
    id: campus.id,
    name: campus.name,
    description: campus.description,
  }));

  const spaceOptions = (availableSpaces || []).map((space) => ({
    id: space.id,
    name: space.name,
    description: space.description,
  }));

  const hasCampus = formData.campusId && formData.campusId !== "";
  const hasSpace = formData.spaceId && formData.spaceId !== "";
  const isVirtual = formData.isVirtual;

  // Solo mostrar errores si el evento NO es virtual
  const showCampusError = !isVirtual && !hasCampus;
  const showSpaceError = !isVirtual && hasCampus && !hasSpace;

  return (
    <div className="space-y-6">
      {!isVirtual && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700">
            Para eventos presenciales, debes seleccionar un campus y un espacio
          </p>
        </div>
      )}

      {/* Campus Selection */}
      <div>
        <CustomSelect
          label="Campus"
          options={campusOptions}
          value={formData.campusId}
          onChange={(value) => onCampusChange(value as string)}
          required={!isVirtual}
          placeholder={
            isLoadingMetadata ? "Cargando campus..." : "Seleccionar campus"
          }
          disabled={isLoadingMetadata || isVirtual}
          loading={isLoadingMetadata}
          icon={<Building size={18} />}
        />
        {showCampusError && (
          <p className="text-xs text-red-500 mt-1">
            Debes seleccionar un campus para eventos presenciales
          </p>
        )}
      </div>

      {/* Space Selection */}
      <div>
        <CustomSelect
          label="Espacio / Salón"
          options={spaceOptions}
          value={formData.spaceId}
          onChange={(value) => onSpaceChange(value as string)}
          required={!isVirtual}
          placeholder={
            !formData.campusId
              ? "Primero selecciona un campus"
              : availableSpaces.length === 0
              ? "No hay espacios disponibles"
              : "Seleccionar espacio"
          }
          disabled={
            !formData.campusId ||
            availableSpaces.length === 0 ||
            isLoadingMetadata ||
            isVirtual
          }
          loading={isLoadingMetadata}
          icon={<MapPin size={18} />}
        />
        {showSpaceError && (
          <p className="text-xs text-red-500 mt-1">
            Debes seleccionar un espacio para eventos presenciales
          </p>
        )}
      </div>
    </div>
  );
};
