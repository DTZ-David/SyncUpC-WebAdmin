import { useState, useEffect } from "react";
import { FORM_STEPS } from "../Types/StepTypes";

export const useFormSteps = (isOpen: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const canProceedToNext = (formData: any) => {
    const currentStepConfig = FORM_STEPS[currentStep];
    return currentStepConfig.validation
      ? currentStepConfig.validation(formData)
      : true;
  };

  const getCurrentStep = () => FORM_STEPS[currentStep];
  const isFirstStep = () => currentStep === 0;
  const isLastStep = () => currentStep === FORM_STEPS.length - 1;
  const getProgressPercentage = () =>
    Math.round(((currentStep + 1) / FORM_STEPS.length) * 100);

  return {
    currentStep,
    steps: FORM_STEPS,
    nextStep,
    prevStep,
    goToStep,
    canProceedToNext,
    getCurrentStep,
    isFirstStep,
    isLastStep,
    getProgressPercentage,
  };
};
