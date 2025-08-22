// components/Events/EventForm.tsx
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EventFormProps } from "./Types/EventTypes";

// Componentes de secciones
import { BasicInfoSection } from "./Sections/BasicInfoSection";
import { LocationInfoSection } from "./Sections/LocationInfoSection";
import { DateTimeInfoSection } from "./Sections/DateTimeInfoSection";
import { TargetAudienceSection } from "./Sections/TargetAudienceSection";
import { VirtualEventSection } from "./Sections/VirtualEventSection";
import { EventSettingsSection } from "./Sections/EventSettingsSection";
import { RegistrationTimeSection } from "./Sections/RegistrationTimeSection";
import { CareerSelectionSection } from "./Sections/CareerSelectionSection";
import { TagsInput } from "./Sections/TagsInput";
import { ImageUpload } from "./Sections/ImageUpload";
import { useEventForm } from "./hooks/useEventForm";
import { useEventSubmission } from "./hooks/useEventSubmission";
import { ErrorDisplay } from "./utils/ErrorDisplay";

export default function EventForm({
  isOpen,
  onClose,
  event,
  onEventCreated,
}: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset currentStep to 0 when opening the modal for editing
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(0); // Siempre empezar en el paso 1 (índice 0)
    }
  }, [isOpen, event]);

  // Definición de los pasos
  const steps = [
    {
      id: "basic",
      title: "Información Básica",
      icon: "📝",
      description: "Título, objetivo y detalles principales del evento",
    },
    {
      id: "datetime",
      title: "Fecha y Ubicación",
      icon: "📅",
      description: "Cuándo y dónde se realizará el evento",
    },
    {
      id: "audience",
      title: "Audiencia y Configuración",
      icon: "👥",
      description: "A quién está dirigido y configuraciones especiales",
    },
    {
      id: "details",
      title: "Detalles Finales",
      icon: "✨",
      description: "Información adicional, etiquetas e imagen",
    },
  ];

  // Hook para manejo del estado del formulario
  const {
    formData,
    currentImage,
    selectedImageFile,
    isSubmitting,
    setIsSubmitting,
    submitError,
    setSubmitError,
    isEditMode,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleImageUpload,
    handleCareerChange,
  } = useEventForm(event, isOpen);

  // Hook para manejo del envío del formulario
  const { submitEvent, isUploadingImage } = useEventSubmission();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 [EVENT FORM] Iniciando envío del formulario");
    console.log("🚀 [EVENT FORM] Datos del formulario:", formData);
    console.log("🚀 [EVENT FORM] Modo edición:", isEditMode);
    console.log(
      "🚀 [EVENT FORM] Imagen seleccionada:",
      selectedImageFile?.name
    );

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const result = await submitEvent(
        formData,
        selectedImageFile,
        currentImage,
        isEditMode
      );

      console.log("📡 [EVENT FORM] Respuesta del backend:", result);

      if (result.success) {
        console.log("✅ [EVENT FORM] Evento creado/actualizado exitosamente");
        if (onEventCreated && result.data) {
          onEventCreated(result.data);
        }
        onClose();
        alert(`Evento ${isEditMode ? "actualizado" : "creado"} exitosamente`);
      } else {
        console.error("❌ [EVENT FORM] Error en submitEvent:", result.error);
        setSubmitError(
          result.error || "Error desconocido al procesar el evento"
        );
      }
    } catch (error) {
      console.error("💥 [EVENT FORM] Error capturado:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(`Error al procesar la solicitud: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Función para validar si se puede avanzar al siguiente paso
  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Información Básica
        return (
          formData.eventTitle.trim() !== "" &&
          formData.eventObjective.trim() !== ""
        );
      case 1: // Fecha y Ubicación
        return formData.startDate !== "" && formData.startTime !== "";
      case 2: // Audiencia
        return (
          formData.targetTeachers ||
          formData.targetStudents ||
          formData.targetAdministrative ||
          formData.targetGeneral
        );
      default:
        return true;
    }
  };

  // Función para prevenir submit accidental
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    // Prevenir submit con Enter excepto en textareas
    if (
      e.key === "Enter" &&
      e.target &&
      (e.target as HTMLElement).tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <BasicInfoSection
              formData={formData}
              onChange={handleInputChange}
            />

            {/* Detalles Adicionales en el primer paso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalles Adicionales
              </label>
              <textarea
                name="additionalDetails"
                rows={4}
                value={formData.additionalDetails}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                placeholder="Información adicional sobre el evento"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DateTimeInfoSection
                formData={formData}
                onChange={handleInputChange}
                showRegistrationDates={formData.requiresRegistration}
              />

              <div className="space-y-6">
                <LocationInfoSection
                  formData={formData}
                  onChange={handleInputChange}
                />

                <VirtualEventSection
                  formData={formData}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <TargetAudienceSection
                  formData={formData}
                  onChange={handleInputChange}
                />

                <EventSettingsSection
                  formData={formData}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-6">
                <CareerSelectionSection
                  formData={formData}
                  onChange={handleCareerChange}
                  disabled={isSubmitting}
                />

                {formData.requiresRegistration && (
                  <RegistrationTimeSection
                    formData={formData}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8" onKeyDown={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <TagsInput
                  tags={formData.tags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={currentImage}
                  isEditing={isEditMode}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Paso {currentStep + 1} de {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
                completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Step Navigation */}
          <nav className="flex space-x-4 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  currentStep === index
                    ? "bg-lime-100 text-lime-700 font-medium shadow-sm"
                    : index < currentStep
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
                {index < currentStep && (
                  <span className="text-green-500">✓</span>
                )}
              </button>
            ))}
          </nav>

          {/* Current Step Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </header>

        {/* Form Content - SOLUCIÓN: Todo el form envuelve el contenido Y los botones */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
              {/* Error Display */}
              <ErrorDisplay
                error={submitError}
                onDismiss={() => setSubmitError("")}
              />

              {/* Step Content */}
              <div className="min-h-[400px]">{renderStepContent()}</div>
            </div>
          </div>

          {/* Footer with Navigation - AHORA DENTRO DEL FORM */}
          <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0 || isSubmitting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft size={18} />
              <span>Anterior</span>
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  onClick={(e) => {
                    console.log(
                      "🎯 [SUBMIT BUTTON] Botón submit clickeado explícitamente"
                    );
                  }}
                >
                  {isSubmitting || isUploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {isUploadingImage
                          ? "Subiendo imagen..."
                          : isEditMode
                          ? "Actualizando..."
                          : "Creando..."}
                      </span>
                    </>
                  ) : (
                    <span>
                      {isEditMode ? "Actualizar Evento" : "Crear Evento"}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    nextStep();
                  }}
                  disabled={!canProceedToNext() || isSubmitting}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    canProceedToNext() && !isSubmitting
                      ? "bg-lime-500 text-white hover:bg-lime-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Siguiente</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
