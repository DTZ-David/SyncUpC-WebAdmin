// src/components/Auth/shared/FileUpload.tsx

import React from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  currentFile,
  error,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Foto de Perfil
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-colors ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />
      {currentFile && (
        <p className="text-sm text-green-600 mt-1">
          Archivo seleccionado: {currentFile.name}
        </p>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;
