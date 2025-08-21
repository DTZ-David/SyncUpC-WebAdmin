// src/components/Auth/RegisterForm/components/StepIndicator.tsx

import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const steps = [
    { number: 1, title: "Datos Personales" },
    { number: 2, title: "Información Profesional" },
    { number: 3, title: "Configuración" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  currentStep === step.number
                    ? "bg-lime-500 text-white"
                    : completedSteps.includes(step.number)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {completedSteps.includes(step.number) ? "✓" : step.number}
              </div>
              <span className="text-xs mt-2 text-gray-600 text-center max-w-20">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-colors ${
                  completedSteps.includes(step.number)
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
