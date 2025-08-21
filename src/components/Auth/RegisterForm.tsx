// src/components/Auth/RegisterForm.tsx

import React, { useState, useEffect } from "react";
import { Users, CheckCircle, AlertCircle } from "lucide-react";
import {
  RegisterFormProps,
  StaffFormData,
  NotificationPreferences,
} from "./types";
import { useFormValidation } from "./hooks/useFormValidation";
import { useFaculties } from "./hooks/useFaculties";
import { useStaffRegistration } from "./hooks/useStaffRegistration";
import PersonalDataStep from "./PersonalDataStep";
import ProfessionalDataStep from "./ProfessionalDataStep";
import ConfigurationStep from "./ConfigurationStep";
import StepIndicator from "./StepIndicator";

export default function RegisterForm({
  onRegister,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profilePhotoUrl: "",
    profession: "",
    department: "",
    position: "",
    facultyId: "",
    notificationPreferences: {
      eventReminder: { push: true, email: true, whatsApp: false },
      eventUpdate: { push: true, email: true, whatsApp: false },
      forumReply: { push: false, email: true, whatsApp: false },
      forumMention: { push: true, email: true, whatsApp: false },
    },
  });

  const { errors, validateStep, clearError } = useFormValidation();
  const { faculties, loading: loadingFaculties } = useFaculties();
  const {
    registerStaff,
    isLoading,
    error: registrationError,
    success,
    response,
    clearError: clearRegistrationError,
    reset,
  } = useStaffRegistration();

  // Limpiar error cuando el usuario empiece a escribir
  useEffect(() => {
    if (registrationError) {
      clearRegistrationError();
    }
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError(e.target.name);
  };

  const handlePreferencesChange = (preferences: NotificationPreferences) => {
    setFormData({ ...formData, notificationPreferences: preferences });
  };

  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3, formData)) return;

    try {
      let profilePhotoUrl = "";
      if (selectedFile) {
        // Aquí podrías implementar la subida de imagen
        // Por ahora usamos una URL placeholder
        profilePhotoUrl = "https://via.placeholder.com/150";
      }

      // Preparar datos para enviar al backend (sin confirmPassword)
      const { confirmPassword, ...submitData } = formData;
      const staffData = {
        ...submitData,
        profilePhotoUrl,
      };

      // Llamar al servicio de registro
      await registerStaff(staffData);

      // Si el registro es exitoso, llamar a onRegister
      if (success && response) {
        onRegister(staffData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDataStep
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            selectedFile={selectedFile}
            onInputChange={handleInputChange}
            onFileSelect={setSelectedFile}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />
        );
      case 2:
        return (
          <ProfessionalDataStep
            formData={formData}
            errors={errors}
            faculties={faculties}
            loadingFaculties={loadingFaculties}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ConfigurationStep
            formData={formData}
            faculties={faculties}
            onPreferencesChange={handlePreferencesChange}
          />
        );
      default:
        return null;
    }
  };

  // Mostrar mensaje de éxito
  if (success && response) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-600 mb-6">
            Bienvenido/a {response.firstName} {response.lastName}. Tu cuenta ha
            sido creada exitosamente.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lime-400 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <img
          src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Staff Registration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8">
              <Users className="mx-auto mb-4" size={64} />
              <h1 className="text-4xl font-bold mb-4">Únete al Staff</h1>
              <p className="text-xl opacity-90">
                Forma parte del equipo académico y administrativo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="bg-lime-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Staff Portal
            </h1>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Registro de Staff
              </h2>
              <p className="text-gray-600">Paso {currentStep} de 3</p>
            </div>

            {/* Error Message */}
            {registrationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={20} />
                <div className="text-red-700">
                  <p className="font-medium">Error en el registro</p>
                  <p className="text-sm">{registrationError}</p>
                </div>
              </div>
            )}

            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || loadingFaculties}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando Cuenta...
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
