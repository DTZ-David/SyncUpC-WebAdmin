import React from "react";
import { EventFormProps } from "../Types/EventTypes";
import { useEventForm } from "../hooks/useEventForm";
import { useEventSubmission } from "../hooks/useEventSubmission";
import { useFormSteps } from "../hooks/useFormSteps";
import { ErrorDisplay } from "../utils/ErrorDisplay";
import { FormFooter } from "../Sections/EventForm/FormFooter";
import { FormHeader } from "../Sections/EventForm/FormHeader";

export default function EventForm({
  isOpen,
  onClose,
  event,
  onEventCreated,
}: EventFormProps) {
  // Hooks
  // Actualizar las importaciones también
  const {
    formData,
    currentImage,
    selectedImageFile,
    isSubmitting,
    setIsSubmitting,
    submitError,
    setSubmitError,
    isEditMode,

    // Nuevos datos de metadata
    campuses,
    availableSpaces,
    eventCategories,
    eventTypes,
    isLoadingMetadata,

    // Handlers actualizados
    handleInputChange,
    handleCampusChange,
    handleSpaceChange,
    handleCategoryChange,
    handleEventTypeChange,
    handleCareerChange,
    handleImageUpload,

    // Legacy handlers
    handleAddTag,
    handleRemoveTag,
  } = useEventForm(event, isOpen);

  const { submitEvent, isUploadingImage } = useEventSubmission();

  const {
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    canProceedToNext,
    getCurrentStep,
    isFirstStep,
    isLastStep,
    getProgressPercentage,
  } = useFormSteps(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 [EVENT FORM] Iniciando envío del formulario");
    console.log("🚀 [EVENT FORM] Datos del formulario:", formData);
    console.log("🚀 [EVENT FORM] Modo edición:", isEditMode);

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const result = await submitEvent(
        formData,
        selectedImageFile,
        currentImage,
        isEditMode
      );

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

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      e.target &&
      (e.target as HTMLElement).tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
    }
  };

  // En EventForm.tsx, modifica renderCurrentStep():

  // En EventForm.tsx, en renderCurrentStep():

  const renderCurrentStep = () => {
    const currentStepConfig = getCurrentStep();
    const StepComponent = currentStepConfig.component;

    const baseProps = {
      formData,
      onChange: handleInputChange,
      isSubmitting,
    };

    // Props adicionales según el step
    const additionalProps: any = {};

    if (currentStepConfig.id === "audience") {
      additionalProps.onCareerChange = handleCareerChange;
    }

    // ✅ Verifica el ID exacto del paso o usa una condición más amplia
    if (
      currentStepConfig.id === "datetime-location" ||
      currentStepConfig.id.includes("location") ||
      currentStepConfig.id.includes("datetime")
    ) {
      additionalProps.campuses = campuses;
      additionalProps.availableSpaces = availableSpaces;
      additionalProps.isLoadingMetadata = isLoadingMetadata;
      additionalProps.onCampusChange = handleCampusChange;
      additionalProps.onSpaceChange = handleSpaceChange;
    }

    if (
      currentStepConfig.id === "details" ||
      currentStepConfig.id === "final-details"
    ) {
      additionalProps.eventCategories = eventCategories;
      additionalProps.eventTypes = eventTypes;
      additionalProps.isLoadingMetadata = isLoadingMetadata;
      additionalProps.onCategoryChange = handleCategoryChange;
      additionalProps.onTypeChange = handleEventTypeChange;
      additionalProps.onImageUpload = handleImageUpload;
      additionalProps.currentImage = currentImage;
      additionalProps.isEditMode = isEditMode;

      // Para compatibilidad con código legacy
      additionalProps.onAddTag = handleAddTag;
      additionalProps.onRemoveTag = handleRemoveTag;
    }

    return <StepComponent {...baseProps} {...additionalProps} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl my-4 sm:my-8 flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[90vh]">
        <FormHeader
          isEditMode={isEditMode}
          onClose={onClose}
          isSubmitting={isSubmitting}
          currentStep={currentStep}
          steps={steps}
          progressPercentage={getProgressPercentage()}
          onStepClick={goToStep}
        />

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
              <ErrorDisplay
                error={submitError}
                onDismiss={() => setSubmitError("")}
              />

              <div className="min-h-[300px] sm:min-h-[400px]">{renderCurrentStep()}</div>
            </div>
          </div>

          <FormFooter
            isFirstStep={isFirstStep()}
            isLastStep={isLastStep()}
            isSubmitting={isSubmitting}
            isUploadingImage={isUploadingImage}
            isEditMode={isEditMode}
            canProceedToNext={canProceedToNext(formData)}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
}
