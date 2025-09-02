import React from "react";
import { Tag, Type } from "lucide-react";
import {
  EventCategory,
  EventType,
} from "../../../../services/types/EventTypes";
import { CustomSelect } from "./CustomSelect";
import { ImageUpload } from "./ImageUpload";

interface FinalDetailsStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  eventCategories: EventCategory[];
  eventTypes: EventType[];
  isLoadingMetadata: boolean;
  onCategoryChange: (categoryIds: string[]) => void;
  onTypeChange: (typeIds: string[]) => void;
  onImageUpload: (files: FileList | null) => void;
  currentImage: string | undefined;
  isEditMode: boolean;
}

export function FinalDetailsStep({
  formData,
  onChange,
  eventCategories,
  eventTypes,
  isLoadingMetadata,
  onCategoryChange,
  onTypeChange,
  onImageUpload,
  currentImage,
  isEditMode,
}: FinalDetailsStepProps) {
  return (
    <div className="space-y-8" onKeyDown={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-medium text-gray-900">
        Detalles Finales del Evento
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categorías y Tipos */}
        <div className="space-y-6">
          {/* Categorías del Evento */}
          <CustomSelect
            label="Categorías del Evento"
            options={eventCategories.map((category) => ({
              id: category.id,
              name: category.name,
              description: category.description,
            }))}
            value={formData.eventCategoryIds || []}
            onChange={(value) => onCategoryChange(value as string[])}
            multiple={true}
            required={true}
            placeholder={
              isLoadingMetadata
                ? "Cargando categorías..."
                : "Seleccionar categorías"
            }
            disabled={isLoadingMetadata}
            loading={isLoadingMetadata}
            icon={<Tag size={18} />}
          />

          {/* Tipos de Evento */}
          <CustomSelect
            label="Tipos de Evento"
            options={eventTypes.map((type) => ({
              id: type.id,
              name: type.name,
              description: type.description,
            }))}
            value={formData.eventTypeIds || []}
            onChange={(value) => onTypeChange(value as string[])}
            multiple={true}
            required={true}
            placeholder={
              isLoadingMetadata ? "Cargando tipos..." : "Seleccionar tipos"
            }
            disabled={isLoadingMetadata}
            loading={isLoadingMetadata}
            icon={<Type size={18} />}
          />

          {/* Preview de selecciones */}
          {(formData.eventCategoryIds?.length > 0 ||
            formData.eventTypeIds?.length > 0) && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Clasificación del Evento:
              </h4>

              {formData.eventCategoryIds?.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Categorías:{" "}
                  </span>
                  <span className="text-xs text-gray-700">
                    {formData.eventCategoryIds
                      .map(
                        (id: string) =>
                          eventCategories.find((cat) => cat.id === id)?.name
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}

              {formData.eventTypeIds?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-600">
                    Tipos:{" "}
                  </span>
                  <span className="text-xs text-gray-700">
                    {formData.eventTypeIds
                      .map(
                        (id: string) =>
                          eventTypes.find((type) => type.id === id)?.name
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Imagen del Evento */}
        <div onClick={(e) => e.stopPropagation()}>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Imagen del Evento
            </label>
          </div>
          <ImageUpload
            onImageUpload={onImageUpload}
            currentImage={currentImage}
            isEditing={isEditMode}
          />
        </div>
      </div>

      {/* Detalles Adicionales */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detalles Adicionales
        </label>
        <textarea
          name="additionalDetails"
          value={formData.additionalDetails || ""}
          onChange={onChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-vertical"
          placeholder="Información adicional sobre el evento..."
        />
      </div>
    </div>
  );
}
