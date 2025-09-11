import { useState, useEffect } from "react";
import { EventImagesService } from "../../../services/api/eventImagesService";
import { ImageUploadService } from "../../../services/api/imageUploadService";
import { EventImage } from "../../../services/types/EventImagesTypes";

interface UseEventImagesReturn {
  // Estado
  images: EventImage[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: { [key: string]: number };

  // Acciones
  fetchImages: () => Promise<void>;
  uploadImages: (files: File[], eventId: string) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
  getEventImages: (eventId: string) => EventImage[];
  clearError: () => void;
}

export const useEventImages = (): UseEventImagesReturn => {
  const [images, setImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  /**
   * Obtiene todas las imágenes del usuario
   */
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 [HOOK] Obteniendo imágenes...");
      const response = await EventImagesService.getMyEventImages();

      if (response.isSuccess) {
        setImages(response.data);
        console.log("✅ [HOOK] Imágenes cargadas:", response.data.length);
      } else {
        throw new Error(response.message || "Error obteniendo imágenes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("❌ [HOOK] Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sube nuevas imágenes a Supabase y las registra en el backend
   */
  const uploadImages = async (files: File[], eventId: string) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress({});

      console.log(
        `🔄 [HOOK] Iniciando subida de ${files.length} imágenes para evento:`,
        eventId
      );

      // Subir imágenes a Supabase
      const uploadResults = await ImageUploadService.uploadMultipleImages(
        files,
        eventId,
        (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileIndex]: progress,
          }));
        }
      );

      // Filtrar solo las subidas exitosas
      const successfulUploads = uploadResults.filter(
        (result) => result.success
      );

      if (successfulUploads.length === 0) {
        throw new Error("No se pudo subir ninguna imagen a Supabase");
      }

      // Extraer URLs de las subidas exitosas
      const imageUrls = successfulUploads.map((result) => result.url);

      console.log("✅ [HOOK] Imágenes subidas a Supabase:", imageUrls.length);
      console.log("🔄 [HOOK] Registrando en backend...");

      // Registrar en el backend
      const response = await EventImagesService.addEventImages(
        eventId,
        imageUrls
      );

      if (response.isSuccess) {
        console.log("✅ [HOOK] Imágenes registradas en backend");
        // Recargar imágenes para obtener los datos actualizados
        await fetchImages();
      } else {
        throw new Error(
          response.message || "Error registrando imágenes en backend"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error subiendo imágenes";
      console.error("❌ [HOOK] Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  /**
   * Elimina una imagen
   */
  const deleteImage = async (imageId: string) => {
    try {
      setError(null);

      console.log("🔄 [HOOK] Eliminando imagen:", imageId);

      const response = await EventImagesService.deleteEventImages(imageId);

      if (response.isSuccess) {
        console.log("✅ [HOOK] Imagen eliminada del backend");
        // Recargar imágenes
        await fetchImages();
      } else {
        throw new Error(response.message || "Error eliminando imagen");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error eliminando imagen";
      console.error("❌ [HOOK] Error:", errorMessage);
      setError(errorMessage);
    }
  };

  /**
   * Obtiene imágenes de un evento específico
   */
  const getEventImages = (eventId: string): EventImage[] => {
    return images.filter((image) => image.eventId === eventId);
  };

  /**
   * Limpia el error
   */
  const clearError = () => {
    setError(null);
  };

  // Cargar imágenes al montar el componente
  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    error,
    uploading,
    uploadProgress,
    fetchImages,
    uploadImages,
    deleteImage,
    getEventImages,
    clearError,
  };
};
