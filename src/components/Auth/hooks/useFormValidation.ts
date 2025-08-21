// src/components/Auth/hooks/useFormValidation.ts

import { useState } from "react";
import { StaffFormData } from "../types";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<any>({});

  const validateStep = (step: number, formData: StaffFormData) => {
    const newErrors: any = {};

    switch (step) {
      case 1: // Datos Personales
        if (!formData.firstName.trim()) {
          newErrors.firstName = "El nombre es requerido";
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = "El apellido es requerido";
        }
        if (!formData.email.trim()) {
          newErrors.email = "El correo electrónico es requerido";
        }
        if (formData.password.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        break;

      case 2: // Información Profesional
        if (!formData.profession.trim()) {
          newErrors.profession = "La profesión es requerida";
        }
        if (!formData.department.trim()) {
          newErrors.department = "El departamento es requerido";
        }
        if (!formData.position) {
          newErrors.position = "Debe seleccionar un cargo";
        }
        if (!formData.facultyId) {
          newErrors.facultyId = "Debe seleccionar una facultad";
        }
        break;

      case 3: // Configuración - no hay campos obligatorios
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  return { errors, validateStep, clearError };
};
