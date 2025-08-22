// components/Events/Common/FormActions.tsx
import React from "react";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  isEditMode: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  isUploadingImage,
  isEditMode,
}) => {
  const getSubmitButtonText = () => {
    if (isUploadingImage) return "Subiendo imagen...";
    if (isSubmitting) return isEditMode ? "Actualizando..." : "Creando...";
    return isEditMode ? "Actualizar Evento" : "Crear Evento";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        disabled={isSubmitting}
      >
        Cancelar
      </button>

      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isSubmitting || isUploadingImage}
      >
        {getSubmitButtonText()}
      </button>
    </div>
  );
};
