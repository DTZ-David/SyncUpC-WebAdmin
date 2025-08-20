// components/Events/EventForm.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { EventFormData, EventFormProps } from "./Types/EventTypes";
import { BasicInfoSection } from "./Sections/BasicInfoSection";
import { LocationInfoSection } from "./Sections/LocationInfoSection";
import { DateTimeInfoSection } from "./Sections/DateTimeInfoSection";
import { TargetAudienceSection } from "./Sections/TargetAudienceSection";
import { VirtualEventSection } from "./Sections/VirtualEventSection";
import { EventSettingsSection } from "./Sections/EventSettingsSection";
import { TagsInput } from "./Sections/TagsInput";
import { ImageUpload } from "./Sections/ImageUpload";

const initialFormData: EventFormData = {
  eventTitle: "",
  eventObjective: "",
  eventLocation: "",
  address: "",
  startDate: "",
  endDate: "",
  registrationStart: "",
  registrationEnd: "",
  careerIds: [],
  targetTeachers: false,
  targetStudents: false,
  targetAdministrative: false,
  targetGeneral: false,
  isVirtual: false,
  meetingUrl: "",
  maxCapacity: "",
  requiresRegistration: true,
  isPublic: true,
  tags: [],
  imageUrls: [],
  additionalDetails: "",
};

export default function EventForm({ isOpen, onClose, event }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    ...initialFormData,
  });
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (event) {
      // Precargar datos del evento para edición
      setFormData({
        eventTitle: event.eventTitle || "",
        eventObjective: event.eventObjective || "",
        eventLocation: event.eventLocation || "",
        address: event.address || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        registrationStart: event.registrationStart || "",
        registrationEnd: event.registrationEnd || "",
        careerIds: event.careerIds || [],
        targetTeachers: event.targetTeachers || false,
        targetStudents: event.targetStudents || false,
        targetAdministrative: event.targetAdministrative || false,
        targetGeneral: event.targetGeneral || false,
        isVirtual: event.isVirtual || false,
        meetingUrl: event.meetingUrl || "",
        maxCapacity: event.maxCapacity?.toString() || "",
        requiresRegistration:
          event.requiresRegistration !== undefined
            ? event.requiresRegistration
            : true,
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
        tags: event.tags || [],
        imageUrls: event.imageUrls || [],
        additionalDetails: event.additionalDetails || "",
      });
      setCurrentImage(event.image || "");
    } else {
      // Resetear formulario para nuevo evento
      setFormData(initialFormData);
      setCurrentImage("");
    }
  }, [event]);
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      registrationStart: new Date(formData.registrationStart).toISOString(),
      registrationEnd: new Date(formData.registrationEnd).toISOString(),
      maxCapacity: parseInt(formData.maxCapacity) || 0,
    };

    console.log("Event data for backend:", eventData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCurrentImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <BasicInfoSection formData={formData} onChange={handleInputChange} />

          {/* Location Information */}
          <LocationInfoSection
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Date and Time Information */}
          <DateTimeInfoSection
            formData={formData}
            onChange={handleInputChange}
            showRegistrationDates={formData.requiresRegistration}
          />

          {/* Target Audience */}
          <TargetAudienceSection
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Virtual Event Settings */}
          <VirtualEventSection
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Event Settings */}
          <EventSettingsSection
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Tags */}
          <TagsInput
            tags={formData.tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles Adicionales
            </label>
            <textarea
              name="additionalDetails"
              rows={4}
              value={formData.additionalDetails}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="Información adicional sobre el evento"
            />
          </div>

          {/* Event Image */}
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={currentImage}
            isEditing={!!event}
          />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {event ? "Actualizar Evento" : "Crear Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
