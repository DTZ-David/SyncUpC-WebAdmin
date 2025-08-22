// hooks/useEventForm.ts
import { useState, useEffect } from "react";
import { eventService } from "../../../services/api/eventService";
import { EventFormData } from "../Types/EventTypes";

const initialFormData: EventFormData = {
  eventTitle: "",
  eventObjective: "",
  eventLocation: "",
  address: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  registrationStart: "",
  registrationStartTime: "",
  registrationEnd: "",
  registrationEndTime: "",
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

export const useEventForm = (event?: any, isOpen?: boolean) => {
  const [formData, setFormData] = useState<EventFormData>({
    ...initialFormData,
  });
  const [currentImage, setCurrentImage] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Reset form when event or modal state changes
  useEffect(() => {
    if (event) {
      const mappedData = eventService.mapBackendEventToFormData(event);
      setFormData(mappedData);
      setCurrentImage(event.imageUrls?.[0] || event.image || "");
      setIsEditMode(true);
    } else {
      setFormData(initialFormData);
      setCurrentImage("");
      setIsEditMode(false);
      setSelectedImageFile(null);
    }

    setSubmitError("");
    setIsSubmitting(false);
  }, [event, isOpen]);

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

  const handleCareerChange = (careerIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      careerIds,
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setSubmitError("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
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

    setSubmitError("");
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setCurrentImage("");
    setSelectedImageFile(null);
    setSubmitError("");
    setIsSubmitting(false);
    setIsUploadingImage(false);
  };

  return {
    formData,
    setFormData,
    currentImage,
    selectedImageFile,
    isUploadingImage,
    setIsUploadingImage,
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
    resetForm,
  };
};
