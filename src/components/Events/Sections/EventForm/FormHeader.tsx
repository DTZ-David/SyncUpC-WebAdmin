import { X } from "lucide-react";
import { Step } from "../../Types/StepTypes";

interface FormHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  currentStep: number;
  steps: Step[];
  progressPercentage: number;
  onStepClick: (stepIndex: number) => void;
}

export function FormHeader({
  isEditMode,
  onClose,
  isSubmitting,
  currentStep,
  steps,
  progressPercentage,
  onStepClick,
}: FormHeaderProps) {
  return (
    <header className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b bg-white shrink-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          {isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          disabled={isSubmitting}
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Paso {currentStep + 1} de {steps.length}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            {progressPercentage}% completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-lime-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Navigation - Horizontal scroll on mobile */}
      <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm shrink-0 ${
              currentStep === index
                ? "bg-lime-100 text-lime-700 font-medium shadow-sm"
                : index < currentStep
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base sm:text-lg">{step.icon}</span>
            <span className="hidden sm:inline text-sm">{step.title}</span>
            {index < currentStep && <span className="text-green-500 text-sm">✓</span>}
          </button>
        ))}
      </nav>

      {/* Current Step Description */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
          {steps[currentStep].title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {steps[currentStep].description}
        </p>
      </div>
    </header>
  );
}
