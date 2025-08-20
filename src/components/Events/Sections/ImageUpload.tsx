// components/Events/sections/ImageUpload.tsx
import React from "react";
import { Upload, X } from "lucide-react";
import { ImageUploadProps } from "../Types/EventTypes";

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  currentImage, 
  isEditing 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onImageUpload) {
      onImageUpload(e.target.files);
    }
  };

  const handleRemoveImage = () => {
    if (onImageUpload) {
      onImageUpload(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen del Evento
      </label>
      
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Vista previa del evento"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="mt-2 text-center">
            <label className="cursor-pointer text-green-600 hover:text-green-700 text-sm">
              Cambiar imagen
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <div className="text-sm text-gray-600">
            <label className="cursor-pointer text-green-600 hover:text-green-700">
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
      )}
    </div>
  );
};
