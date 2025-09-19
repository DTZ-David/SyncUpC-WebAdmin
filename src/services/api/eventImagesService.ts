import { ENDPOINTS } from "../config/apiConfig";
import {
  EventImagesResponse,
  AddEventImagesRequest,
  DeleteEventImagesRequest,
  ApiResponse,
  EventImage,
} from "../types/EventImagesTypes";
import { apiClient } from "./apiClient";

export class EventImagesService {
  /**
   * Obtiene todas las imágenes de eventos del usuario autenticado
   */
  static async getMyEventImages(): Promise<EventImagesResponse> {
    try {
      console.log("📸 [EVENT IMAGES] Obteniendo mis imágenes de eventos");
      console.log(
        "📸 [EVENT IMAGES] URL:",
        ENDPOINTS.EVENT_IMAGES.GET_MY_IMAGES
      );

      const response = await apiClient.get<EventImagesResponse>(
        ENDPOINTS.EVENT_IMAGES.GET_MY_IMAGES,
        undefined,
        true // requireAuth = true
      );

      console.log(
        "✅ [EVENT IMAGES] Imágenes obtenidas:",
        response?.data?.length
      );
      console.log("✅ [EVENT IMAGES] Success:", response?.isSuccess);

      return response;
    } catch (error) {
      console.error("❌ [EVENT IMAGES] Error obteniendo imágenes:", error);
      throw error;
    }
  }

  /**
   * Agrega nuevas imágenes a un evento
   */
  static async addEventImages(
    eventId: string,
    imageUrls: string[]
  ): Promise<ApiResponse> {
    try {
      const payload: AddEventImagesRequest = {
        eventId,
        imageUrls,
      };

      console.log("📸 [EVENT IMAGES] Agregando imágenes al evento:", eventId);
      console.log("📸 [EVENT IMAGES] URLs:", imageUrls);
      console.log("📸 [EVENT IMAGES] Payload:", payload);

      const response = await apiClient.post<ApiResponse>(
        ENDPOINTS.EVENT_IMAGES.ADD_IMAGES,
        payload,
        undefined,
        true // requireAuth = true
      );

      console.log("✅ [EVENT IMAGES] Imágenes agregadas exitosamente");
      console.log("✅ [EVENT IMAGES] Response:", response);

      return response;
    } catch (error) {
      console.error("❌ [EVENT IMAGES] Error agregando imágenes:", error);
      console.error("❌ [EVENT IMAGES] EventId:", eventId);
      console.error("❌ [EVENT IMAGES] URLs:", imageUrls);
      throw error;
    }
  }

  /**
   * Elimina una imagen de evento por su ID
   */
  static async deleteEventImages(imageId: string): Promise<ApiResponse> {
    try {
      const payload: DeleteEventImagesRequest = {
        id: imageId,
      };

      console.log("📸 [EVENT IMAGES] Eliminando imagen con ID:", imageId);
      console.log("📸 [EVENT IMAGES] Payload:", payload);

      const response = await apiClient.post<ApiResponse>(
        ENDPOINTS.EVENT_IMAGES.DELETE_IMAGES,
        payload,
        undefined,
        true // requireAuth = true
      );

      console.log("✅ [EVENT IMAGES] Imagen eliminada exitosamente");
      console.log("✅ [EVENT IMAGES] Response:", response);

      return response;
    } catch (error) {
      console.error("❌ [EVENT IMAGES] Error eliminando imagen:", error);
      console.error("❌ [EVENT IMAGES] ImageId:", imageId);
      throw error;
    }
  }

  /**
   * Obtiene las imágenes de un evento específico
   * (Método auxiliar que filtra las imágenes por eventId)
   */
  static async getEventImages(eventId: string): Promise<EventImage[]> {
    try {
      const response = await this.getMyEventImages();

      if (response.isSuccess && response.data) {
        // Filtrar las imágenes por el eventId específico
        const eventImages = response.data.filter(
          (image) => image.eventId === eventId
        );

        console.log(
          `📸 [EVENT IMAGES] Imágenes encontradas para evento ${eventId}:`,
          eventImages.length
        );
        return eventImages;
      }

      return [];
    } catch (error) {
      console.error(
        "❌ [EVENT IMAGES] Error obteniendo imágenes del evento:",
        error
      );
      throw error;
    }
  }

  /**
   * Agrega múltiples imágenes en lotes para mejorar la performance
   */
  static async addMultipleEventImages(
    eventId: string,
    imageUrls: string[],
    batchSize: number = 10
  ): Promise<ApiResponse[]> {
    try {
      const results: ApiResponse[] = [];

      // Dividir las URLs en lotes
      for (let i = 0; i < imageUrls.length; i += batchSize) {
        const batch = imageUrls.slice(i, i + batchSize);
        console.log(
          `📸 [EVENT IMAGES] Procesando lote ${Math.floor(i / batchSize) + 1}:`,
          batch.length,
          "imágenes"
        );

        const response = await this.addEventImages(eventId, batch);
        results.push(response);

        // Pequeña pausa entre lotes para no saturar el servidor
        if (i + batchSize < imageUrls.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      console.log(
        "✅ [EVENT IMAGES] Todos los lotes procesados:",
        results.length
      );
      return results;
    } catch (error) {
      console.error(
        "❌ [EVENT IMAGES] Error en procesamiento por lotes:",
        error
      );
      throw error;
    }
  }
}
