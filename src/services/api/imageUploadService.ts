import { supabase } from "./supabaseClient";

export interface UploadResult {
  url: string;
  fileName: string;
  success: boolean;
  error?: string;
}

export class ImageUploadService {
  private static BUCKET_NAME = "eventpictures"; // Asegúrate de crear este bucket en Supabase

  /**
   * Sube una imagen a Supabase organizándola por evento
   */
  static async uploadImage(
    file: File,
    eventId: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${eventId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      console.log("📤 [SUPABASE] Subiendo imagen:", fileName);
      console.log("📤 [SUPABASE] Tamaño del archivo:", file.size, "bytes");

      // Simular progreso si se proporciona callback
      if (onProgress) {
        onProgress(0);
        const progressInterval = setInterval(() => {
          onProgress(Math.random() * 50); // Progreso simulado hasta 50%
        }, 200);

        // Limpiar el intervalo después de un tiempo
        setTimeout(() => clearInterval(progressInterval), 1000);
      }

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (onProgress) {
        onProgress(100);
      }

      if (error) {
        console.error("❌ [SUPABASE] Error subiendo imagen:", error);
        return {
          url: "",
          fileName: "",
          success: false,
          error: error.message,
        };
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log(
        "✅ [SUPABASE] Imagen subida exitosamente:",
        urlData.publicUrl
      );

      return {
        url: urlData.publicUrl,
        fileName: data.path,
        success: true,
      };
    } catch (error) {
      console.error("❌ [SUPABASE] Error inesperado:", error);
      return {
        url: "",
        fileName: "",
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Sube múltiples imágenes de forma paralela
   */
  static async uploadMultipleImages(
    files: File[],
    eventId: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResult[]> {
    try {
      console.log(
        `📤 [SUPABASE] Subiendo ${files.length} imágenes para evento:`,
        eventId
      );

      const uploadPromises = files.map((file, index) =>
        this.uploadImage(file, eventId, (progress) => {
          if (onProgress) {
            onProgress(index, progress);
          }
        })
      );

      const results = await Promise.all(uploadPromises);

      const successCount = results.filter((r) => r.success).length;
      console.log(
        `✅ [SUPABASE] ${successCount}/${files.length} imágenes subidas exitosamente`
      );

      return results;
    } catch (error) {
      console.error("❌ [SUPABASE] Error subiendo múltiples imágenes:", error);
      return files.map(() => ({
        url: "",
        fileName: "",
        success: false,
        error: "Error en carga múltiple",
      }));
    }
  }

  /**
   * Elimina una imagen de Supabase
   */
  static async deleteImage(fileName: string): Promise<boolean> {
    try {
      console.log("🗑️ [SUPABASE] Eliminando imagen:", fileName);

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error("❌ [SUPABASE] Error eliminando imagen:", error);
        return false;
      }

      console.log("✅ [SUPABASE] Imagen eliminada exitosamente");
      return true;
    } catch (error) {
      console.error("❌ [SUPABASE] Error inesperado eliminando imagen:", error);
      return false;
    }
  }
}
