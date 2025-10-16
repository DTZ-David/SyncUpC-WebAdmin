// hooks/useEventForm.ts
import { useState, useEffect } from "react";
import { eventService } from "../../../services/api/eventService";
import { eventMetadataService } from "../../../services/api/eventMetadataService";
import { EventFormData } from "../Types/EventTypes";
import {
  Campus,
  Space,
  EventCategory,
  EventType,
} from "../../../services/types/EventTypes";

const initialFormData: EventFormData = {
  eventTitle: "",
  eventObjective: "",
  campusId: "",
  spaceId: "",
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
  eventCategoryIds: [],
  eventTypeIds: [],
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

  // Estados para los datos del metadata
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(false);

  // Cargar datos de metadata al abrir el formulario
  useEffect(() => {
    if (isOpen) {
      loadMetadata();
    }
  }, [isOpen]);

  // Filtrar espacios cuando cambia el campus seleccionado
  useEffect(() => {
    if (formData.campusId) {
      const filteredSpaces = spaces.filter(
        (space) => space.campusId === formData.campusId
      );
      setAvailableSpaces(filteredSpaces);

      // Si el espacio actual no pertenece al campus seleccionado, limpiarlo
      if (
        formData.spaceId &&
        !filteredSpaces.find((space) => space.id === formData.spaceId)
      ) {
        setFormData((prev) => ({ ...prev, spaceId: "" }));
      }
    } else {
      setAvailableSpaces([]);
    }
  }, [formData.campusId, spaces]);

  // En el hook useEventForm.ts, modifica la función loadMetadata:

  const loadMetadata = async () => {
    console.log("🚀 Iniciando carga de metadata...");
    setIsLoadingMetadata(true);

    try {
      const [
        campusResponse,
        spacesResponse,
        categoriesResponse,
        typesResponse,
      ] = await Promise.all([
        eventMetadataService.getAllCampus(),
        eventMetadataService.getAllSpaces(),
        eventMetadataService.getAllEventCategories(),
        eventMetadataService.getAllEventTypes(),
      ]);

      console.log("📦 Respuestas recibidas:");
      console.log("Campus response:", campusResponse);
      console.log("Spaces response:", spacesResponse);

      if (campusResponse.isSuccess) {
        console.log("✅ Setting campuses:", campusResponse.data);
        setCampuses(campusResponse.data);
      } else {
        console.log("❌ Campus response not successful:", campusResponse);
      }

      if (spacesResponse.isSuccess) {
        console.log("✅ Setting spaces:", spacesResponse.data);
        setSpaces(spacesResponse.data);
      } else {
        console.log("❌ Spaces response not successful:", spacesResponse);
      }

      if (categoriesResponse.isSuccess)
        setEventCategories(categoriesResponse.data);
      if (typesResponse.isSuccess) setEventTypes(typesResponse.data);
    } catch (error) {
      console.error("❌ Error loading metadata:", error);
      setSubmitError("Error al cargar los datos del formulario");
    } finally {
      console.log("🏁 Finalizando carga de metadata...");
      setIsLoadingMetadata(false);
    }
  };

  // Y también agrega este useEffect para monitorear los cambios de estado:
  useEffect(() => {
    console.log("📊 Estado actual del hook:");
    console.log("campuses length:", campuses.length);
    console.log("spaces length:", spaces.length);
    console.log("availableSpaces length:", availableSpaces.length);
    console.log("isLoadingMetadata:", isLoadingMetadata);
  }, [campuses, spaces, availableSpaces, isLoadingMetadata]);

  // Reset form when event or modal state changes
  useEffect(() => {
    if (event) {
      const mappedData = eventService.mapBackendEventToFormData(event);
      setFormData(mappedData);
      setCurrentImage(event.imageUrls?.[0] || event.image || "");
      setIsEditMode(true);
    } else {
      setFormData({ ...initialFormData });
      setCurrentImage("");
      setIsEditMode(false);
      setSelectedImageFile(null);
    }

    setSubmitError("");
    setIsSubmitting(false);
  }, [event, isOpen]);

  // Mapear nombres a IDs una vez que se cargue la metadata
  useEffect(() => {
    if (isEditMode && formData && campuses.length > 0 && spaces.length > 0 && eventCategories.length > 0 && eventTypes.length > 0) {
      console.log("🔄 Buscando IDs por nombre...");

      // Buscar campusId por nombre
      if (formData.campusName && !formData.campusId) {
        const campus = campuses.find(c => c.name === formData.campusName);
        if (campus) {
          console.log("✅ Campus encontrado:", campus.name, "->", campus.id);
          setFormData(prev => ({ ...prev, campusId: campus.id }));
        }
      }

      // Buscar spaceId por nombre
      if (formData.spaceName && !formData.spaceId) {
        const space = spaces.find(s => s.name === formData.spaceName);
        if (space) {
          console.log("✅ Space encontrado:", space.name, "->", space.id);
          setFormData(prev => ({ ...prev, spaceId: space.id }));
        }
      }

      // Buscar categoryIds por nombres
      if (formData.categoryNames && formData.categoryNames.length > 0 && formData.eventCategoryIds.length === 0) {
        const categoryIds = formData.categoryNames
          .map((name: string) => eventCategories.find(c => c.name === name)?.id)
          .filter((id: string | undefined) => id !== undefined);

        if (categoryIds.length > 0) {
          console.log("✅ Categorías encontradas:", formData.categoryNames, "->", categoryIds);
          setFormData(prev => ({ ...prev, eventCategoryIds: categoryIds }));
        }
      }

      // Buscar typeIds por nombres
      if (formData.eventTypeNames && formData.eventTypeNames.length > 0 && formData.eventTypeIds.length === 0) {
        const typeIds = formData.eventTypeNames
          .map((name: string) => eventTypes.find(t => t.name === name)?.id)
          .filter((id: string | undefined) => id !== undefined);

        if (typeIds.length > 0) {
          console.log("✅ Tipos encontrados:", formData.eventTypeNames, "->", typeIds);
          setFormData(prev => ({ ...prev, eventTypeIds: typeIds }));
        }
      }
    }
  }, [isEditMode, formData.campusName, formData.spaceName, formData.categoryNames, formData.eventTypeNames, campuses, spaces, eventCategories, eventTypes]);

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

  const handleCampusChange = (campusId: string) => {
    setFormData((prev) => ({ ...prev, campusId, spaceId: "" }));
  };

  const handleSpaceChange = (spaceId: string) => {
    setFormData((prev) => ({ ...prev, spaceId }));
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setFormData((prev) => ({ ...prev, eventCategoryIds: categoryIds }));
  };

  const handleEventTypeChange = (typeIds: string[]) => {
    setFormData((prev) => ({ ...prev, eventTypeIds: typeIds }));
  };

  const handleCareerChange = (careerIds: string[]) => {
    setFormData((prev) => ({ ...prev, careerIds }));
  };

  // Funciones legacy para compatibilidad
  const handleAddTag = (tag: string) => {
    // Para compatibilidad con código existente
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tag],
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    // Para compatibilidad con código existente
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag: string) => tag !== tagToRemove),
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

    // Metadata
    campuses,
    availableSpaces,
    eventCategories,
    eventTypes,
    isLoadingMetadata,

    // Handlers
    handleInputChange,
    handleCampusChange,
    handleSpaceChange,
    handleCategoryChange,
    handleEventTypeChange,
    handleCareerChange,

    // Legacy handlers para compatibilidad
    handleAddTag,
    handleRemoveTag,
    handleImageUpload,
    resetForm,
  };
};
