import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  isEditMode: boolean;
  canProceedToNext: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onClose: () => void;
}

export function FormFooter({
  isFirstStep,
  isLastStep,
  isSubmitting,
  isUploadingImage,
  isEditMode,
  canProceedToNext,
  onPrevStep,
  onNextStep,
  onClose,
}: FormFooterProps) {
  return (
    <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
      <button
        type="button"
        onClick={onPrevStep}
        disabled={isFirstStep || isSubmitting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isFirstStep || isSubmitting
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        <ChevronLeft size={18} />
        <span>Anterior</span>
      </button>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>

        {isLastStep ? (
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting || isUploadingImage ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {isUploadingImage
                    ? "Subiendo imagen..."
                    : isEditMode
                    ? "Actualizando..."
                    : "Creando..."}
                </span>
              </>
            ) : (
              <span>{isEditMode ? "Actualizar Evento" : "Crear Evento"}</span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onNextStep();
            }}
            disabled={!canProceedToNext || isSubmitting}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              canProceedToNext && !isSubmitting
                ? "bg-lime-500 text-white hover:bg-lime-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
