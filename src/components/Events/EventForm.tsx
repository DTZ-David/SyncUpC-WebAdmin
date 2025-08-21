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
import { eventService } from "../../services/api/eventService";
import { supabaseService } from "../../services/config/supabaseService";

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

export default function EventForm({
  isOpen,
  onClose,
  event,
  onEventCreated,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    ...initialFormData,
  });
  const [currentImage, setCurrentImage] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (event) {
      // Modo edición: mapear datos del backend al formulario
      console.log("Evento recibido para editar:", event);

      const mappedData = eventService.mapBackendEventToFormData(event);
      console.log("Datos mapeados para el formulario:", mappedData);

      setFormData(mappedData);
      setCurrentImage(event.imageUrls?.[0] || event.image || "");
      setIsEditMode(true);
    } else {
      // Modo creación: resetear formulario
      setFormData(initialFormData);
      setCurrentImage("");
      setIsEditMode(false);
      setSelectedImageFile(null);
    }

    // Limpiar estados de error y carga cuando se abre/cierra
    setSubmitError("");
    setIsSubmitting(false);
  }, [event, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.eventTitle.trim()) {
      errors.push("El título del evento es obligatorio");
    }

    if (!formData.eventObjective.trim()) {
      errors.push("El objetivo del evento es obligatorio");
    }

    if (!formData.startDate) {
      errors.push("La fecha de inicio es obligatoria");
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    if (formData.requiresRegistration) {
      if (!formData.registrationStart) {
        errors.push("La fecha de inicio de registro es obligatoria");
      }
      if (!formData.registrationEnd) {
        errors.push("La fecha de fin de registro es obligatoria");
      }
    }

    if (
      !formData.targetTeachers &&
      !formData.targetStudents &&
      !formData.targetAdministrative &&
      !formData.targetGeneral
    ) {
      errors.push("Debe seleccionar al menos una audiencia objetivo");
    }

    if (formData.isVirtual && !formData.meetingUrl.trim()) {
      errors.push("La URL de reunión es obligatoria para eventos virtuales");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError("");
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(", "));
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = currentImage;

      // Si hay una imagen nueva, subirla a Supabase
      if (selectedImageFile) {
        setIsUploadingImage(true);
        const uploadResult = await supabaseService.uploadImage(
          selectedImageFile,
          "events"
        );

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log("Imagen subida a Supabase:", imageUrl);
        } else {
          throw new Error(uploadResult.error || "Error al subir la imagen");
        }
      }

      // Preparar datos finales con la URL de la imagen
      const finalFormData = {
        ...formData,
        imageUrls: imageUrl ? [imageUrl] : [],
      };

      let response;

      if (isEditMode) {
        // Actualizar evento existente
        console.log("Actualizando evento con datos:", finalFormData);
        const apiData =
          eventService.transformFormDataToUpdateRequest(finalFormData);
        console.log("Datos transformados para API de actualización:", apiData);
        response = await eventService.updateEvent(apiData);
      } else {
        // Crear nuevo evento
        console.log("Creando nuevo evento con datos:", finalFormData);
        const apiData =
          eventService.transformFormDataToApiRequest(finalFormData);
        console.log("Datos transformados para API de creación:", apiData);
        response = await eventService.createEvent(apiData);
      }

      if (response.isSuccess) {
        console.log(
          `Evento ${isEditMode ? "actualizado" : "creado"} exitosamente:`,
          response
        );

        // Callback para notificar al componente padre
        if (onEventCreated && response.data) {
          onEventCreated(response.data);
        }

        onClose();

        // Mostrar mensaje de éxito
        alert(`Evento ${isEditMode ? "actualizado" : "creado"} exitosamente`);
      } else {
        throw new Error(
          response.message ||
            `Error al ${isEditMode ? "actualizar" : "crear"} el evento`
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} event:`,
        error
      );
      setSubmitError(
        error.message ||
          `Ocurrió un error al ${
            isEditMode ? "actualizar" : "crear"
          } el evento. Por favor intenta nuevamente.`
      );
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
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

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setSubmitError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSubmitError("La imagen debe ser menor a 5MB");
        return;
      }

      setSelectedImageFile(file);

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCurrentImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Limpiar error si había uno
      setSubmitError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mostrar error de validación/API */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{submitError}</p>
            </div>
          )}

          {/* Mostrar información de depuración en desarrollo */}
          {process.env.NODE_ENV === "development" && isEditMode && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Modo edición:</strong> Editando evento ID: {event?.id}
              </p>
              <p className="text-sm">
                <strong>Fecha de inicio:</strong> {formData.startDate}
              </p>
            </div>
          )}

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
              disabled={isSubmitting}
            />
          </div>

          {/* Event Image */}
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={currentImage}
            isEditing={isEditMode}
          />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage
                ? "Subiendo imagen..."
                : isSubmitting
                ? isEditMode
                  ? "Actualizando..."
                  : "Creando..."
                : isEditMode
                ? "Actualizar Evento"
                : "Crear Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
