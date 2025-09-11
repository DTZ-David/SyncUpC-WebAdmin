import React, { useState, useCallback } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Trash2,
  FileImage,
} from "lucide-react";

interface ImageUploaderProps {
  eventId: string;
  onClose: () => void;
  onUploadComplete: (files: File[]) => Promise<void>; // ACTUALIZADO: Acepta File[] en lugar de string[]
  disabled?: boolean; // NUEVO: Para deshabilitar durante upload
}

interface UploadedImage {
  id: string;
  url: string;
  file: File;
  status: "waiting" | "uploading" | "success" | "error";
  progress: number;
}

export default function ImageUploader({
  eventId,
  onClose,
  onUploadComplete,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [description, setDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      handleFiles(files);
    },
    [disabled]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Validar tamaño de archivos (5MB máximo)
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} es muy grande (máximo 5MB)`);
        return false;
      }
      return true;
    });

    const newImages: UploadedImage[] = validFiles.map((file) => ({
      id: Date.now() + Math.random().toString(),
      url: URL.createObjectURL(file),
      file,
      status: "waiting",
      progress: 0,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      alert("Por favor, selecciona al menos una imagen");
      return;
    }

    if (disabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Extraer archivos de las imágenes
      const files = uploadedImages.map((img) => img.file);

      // Llamar a la función de upload
      await onUploadComplete(files);

      // Limpiar URLs de objeto
      uploadedImages.forEach((img) => {
        URL.revokeObjectURL(img.url);
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error al subir las imágenes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Limpiar URLs de objeto antes de cerrar
    uploadedImages.forEach((img) => {
      URL.revokeObjectURL(img.url);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Subir Imágenes del Evento
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Zona de arrastre */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              disabled
                ? "border-gray-200 bg-gray-50"
                : isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => !disabled && setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            <FileImage
              size={48}
              className={`mx-auto mb-4 ${
                disabled ? "text-gray-300" : "text-gray-400"
              }`}
            />
            <p
              className={`text-lg font-medium mb-2 ${
                disabled ? "text-gray-500" : "text-gray-900"
              }`}
            >
              {disabled ? "Subiendo archivos..." : "Arrastra las imágenes aquí"}
            </p>
            <p
              className={`mb-4 ${disabled ? "text-gray-400" : "text-gray-600"}`}
            >
              {disabled
                ? "Por favor espera..."
                : "o haz clic para seleccionar archivos"}
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              disabled={disabled}
            />
            <label
              htmlFor="file-input"
              className={`px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block ${
                disabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Seleccionar Imágenes
            </label>
            <p className="text-sm text-gray-500 mt-4">
              Formatos soportados: JPG, PNG, GIF (máximo 5MB por imagen)
            </p>
          </div>

          {/* Descripción opcional */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Describe las imágenes que estás subiendo..."
              disabled={disabled || isSubmitting}
            />
          </div>

          {/* Imágenes seleccionadas */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Imágenes seleccionadas ({uploadedImages.length})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                    />

                    {/* Botón de eliminar */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen */}
          {uploadedImages.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <ImageIcon className="text-blue-600 mr-3" size={20} />
                <div>
                  <p className="text-blue-900 font-medium">
                    {uploadedImages.length} imágenes listas para subir
                  </p>
                  <p className="text-blue-700 text-sm">
                    Las imágenes se subirán a Supabase y se registrarán en el
                    evento
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploadedImages.length === 0 || isSubmitting || disabled}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && <Upload className="animate-spin" size={16} />}
              <span>
                {isSubmitting
                  ? "Procesando..."
                  : `Subir ${uploadedImages.length} Imágenes`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
