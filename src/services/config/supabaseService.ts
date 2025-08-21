// src/services/supabase/supabaseService.ts
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase - debes reemplazar con tus datos
const supabaseUrl = "https://osavzgjbmuazpsyeqjfv.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zYXZ6Z2pibXVhenBzeWVxamZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDU5MTYsImV4cCI6MjA2ODg4MTkxNn0.64PbEO6H4IOuITkI01Ccm_0zIt6l4yscrDsuR8_JGGQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UploadImageResponse {
  success: boolean;
  url?: string;
  error?: string;
}

class SupabaseService {
  private readonly BUCKET_NAME = "eventpictures"; // Nombre de tu bucket en Supabase

  /**
   * Sube una imagen al storage de Supabase
   * @param file - Archivo de imagen a subir
   * @param folder - Carpeta dentro del bucket (opcional)
   * @returns Promise con la URL pública de la imagen
   */
  async uploadImage(file: File): Promise<UploadImageResponse> {
    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `$${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      console.log("Uploading image:", fileName);

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      console.log("Image uploaded successfully:", publicUrlData.publicUrl);

      return {
        success: true,
        url: publicUrlData.publicUrl,
      };
    } catch (error: any) {
      console.error("Error uploading image:", error);
      return {
        success: false,
        error: error.message || "Error desconocido al subir la imagen",
      };
    }
  }

  /**
   * Elimina una imagen del storage
   * @param imagePath - Path de la imagen a eliminar
   */
  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([imagePath]);

      if (error) {
        console.error("Delete error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  }

  /**
   * Extrae el path de una URL pública de Supabase
   * @param publicUrl - URL pública de Supabase
   * @returns Path del archivo
   */
  extractPathFromUrl(publicUrl: string): string {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split("/");
    // Generalmente la estructura es: /storage/v1/object/public/bucket-name/path
    return pathParts.slice(5).join("/");
  }
}

export const supabaseService = new SupabaseService();
