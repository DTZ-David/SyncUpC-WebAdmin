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
  // 🔍 DEBUG: Agregar estos logs temporalmente
  console.log("🏫 LocationInfoSection - Props recibidos:");
  console.log("campuses:", campuses);
  console.log("availableSpaces:", availableSpaces);
  console.log("isLoadingMetadata:", isLoadingMetadata);
  console.log("formData.campusId:", formData.campusId);

  // 🔍 DEBUG: Ver qué se está pasando al CustomSelect
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

  console.log("🎯 Opciones mapeadas para Campus:", campusOptions);
  console.log("🎯 Opciones mapeadas para Spaces:", spaceOptions);

  return (
    <div className="space-y-6">
      {/* ... resto del componente igual ... */}

      {/* Campus Selection - usar la variable mapeada */}
      <CustomSelect
        label="Campus"
        options={campusOptions} // usar la variable en lugar del mapeo inline
        value={formData.campusId}
        onChange={(value) => onCampusChange(value as string)}
        required={true}
        placeholder={
          isLoadingMetadata ? "Cargando campus..." : "Seleccionar campus"
        }
        disabled={isLoadingMetadata}
        loading={isLoadingMetadata}
        icon={<Building size={18} />}
      />

      {/* Space Selection - usar la variable mapeada */}
      <CustomSelect
        label="Espacio / Salón"
        options={spaceOptions} // usar la variable en lugar del mapeo inline
        value={formData.spaceId}
        onChange={(value) => onSpaceChange(value as string)}
        required={true}
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
          isLoadingMetadata
        }
        loading={isLoadingMetadata}
        icon={<MapPin size={18} />}
      />
    </div>
  );
};
