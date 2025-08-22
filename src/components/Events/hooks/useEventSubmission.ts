// hooks/useEventSubmission.ts
import { useState } from "react";

import { validateEventForm } from "../utils/eventFormValidation";
import { eventService } from "../../../services/api/eventService";
import { supabaseService } from "../../../services/config/supabaseService";
import { EventFormData } from "../Types/EventTypes";

interface SubmissionResult {
  success: boolean;
  error?: string;
  data?: any; // Datos del evento creado/actualizado
}

export const useEventSubmission = () => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const uploadImageIfNeeded = async (
    selectedImageFile: File | null,
    currentImage: string
  ): Promise<{ url: string; error?: string }> => {
    if (!selectedImageFile) {
      return { url: currentImage };
    }

    try {
      setIsUploadingImage(true);
      const uploadResult = await supabaseService.uploadImage(
        selectedImageFile,
        "events"
      );

      if (uploadResult.success && uploadResult.url) {
        return { url: uploadResult.url };
      } else {
        return {
          url: currentImage,
          error: uploadResult.error || "Error al subir la imagen",
        };
      }
    } catch (error: any) {
      return {
        url: currentImage,
        error: error.message || "Error al subir la imagen",
      };
    } finally {
      setIsUploadingImage(false);
    }
  };

  const prepareSubmissionData = (
    formData: EventFormData,
    imageUrl: string
  ): EventFormData => {
    return {
      ...formData,
      startDate: `${formData.startDate}T${formData.startTime}`,
      endDate:
        formData.endDate && formData.endTime
          ? `${formData.endDate}T${formData.endTime}`
          : "",
      registrationStart:
        formData.requiresRegistration &&
        formData.registrationStart &&
        formData.registrationStartTime
          ? `${formData.registrationStart}T${formData.registrationStartTime}`
          : "",
      registrationEnd:
        formData.requiresRegistration &&
        formData.registrationEnd &&
        formData.registrationEndTime
          ? `${formData.registrationEnd}T${formData.registrationEndTime}`
          : "",
      imageUrls: imageUrl ? [imageUrl] : [],
    };
  };

  const submitEvent = async (
    formData: EventFormData,
    selectedImageFile: File | null,
    currentImage: string,
    isEditMode: boolean
  ): Promise<SubmissionResult> => {
    // Validar formulario
    const validationErrors = validateEventForm(formData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join(", "),
      };
    }

    try {
      // Subir imagen si es necesario
      const imageResult = await uploadImageIfNeeded(
        selectedImageFile,
        currentImage
      );
      if (imageResult.error) {
        return {
          success: false,
          error: imageResult.error,
        };
      }

      // Preparar datos para envío
      const finalFormData = prepareSubmissionData(formData, imageResult.url);

      let response;

      if (isEditMode) {
        const apiData =
          eventService.transformFormDataToUpdateRequest(finalFormData);
        response = await eventService.updateEvent(apiData);
      } else {
        const apiData =
          eventService.transformFormDataToApiRequest(finalFormData);
        response = await eventService.createEvent(apiData);
      }

      if (response.isSuccess) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error:
            response.message ||
            `Error al ${isEditMode ? "actualizar" : "crear"} el evento`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error:
          error.message ||
          `Ocurrió un error al ${
            isEditMode ? "actualizar" : "crear"
          } el evento. Por favor intenta nuevamente.`,
      };
    }
  };

  return {
    submitEvent,
    isUploadingImage,
  };
};
