// components/Events/sections/ImageUpload.tsx
import React from "react";
import { Upload } from "lucide-react";
import { ImageUploadProps } from "../Types/EventTypes";

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onImageUpload) {
      onImageUpload(e.target.files);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen del Evento
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-lime-400 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <div className="text-sm text-gray-600">
          <label className="cursor-pointer text-lime-600 hover:text-lime-700">
            Subir una imagen
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB</p>
        </div>
      </div>
    </div>
  );
};
