// src/components/Auth/hooks/useFormValidation.ts

import { useState } from "react";
import { StaffFormData } from "../types";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<any>({});

  // Validaciones auxiliares
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "El correo electrónico es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "El formato del correo electrónico no es válido";
    }

    if (!email.toLowerCase().endsWith("@unicesar.edu.co")) {
      return "Debe usar un correo institucional @unicesar.edu.co";
    }

    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "La contraseña es requerida";
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }

    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una mayúscula";
    }

    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una minúscula";
    }

    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }

    return null;
  };

  const validatePhoneNumber = (phone: string): string | null => {
    if (!phone.trim()) {
      return null; // El teléfono es opcional
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "El número de teléfono debe tener 10 dígitos";
    }

    return null;
  };

  const validateStep = (step: number, formData: StaffFormData) => {
    const newErrors: any = {};

    switch (step) {
      case 1: // Datos Personales
        if (!formData.firstName.trim()) {
          newErrors.firstName = "El nombre es requerido";
        } else if (formData.firstName.trim().length < 2) {
          newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
        }

        if (!formData.lastName.trim()) {
          newErrors.lastName = "El apellido es requerido";
        } else if (formData.lastName.trim().length < 2) {
          newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
        }

        const emailError = validateEmail(formData.email);
        if (emailError) {
          newErrors.email = emailError;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) {
          newErrors.phoneNumber = phoneError;
        }
        break;

      case 2: // Información Profesional
        if (!formData.profession.trim()) {
          newErrors.profession = "La profesión es requerida";
        } else if (formData.profession.trim().length < 3) {
          newErrors.profession = "La profesión debe tener al menos 3 caracteres";
        }

        if (!formData.department.trim()) {
          newErrors.department = "El departamento es requerido";
        } else if (formData.department.trim().length < 3) {
          newErrors.department = "El departamento debe tener al menos 3 caracteres";
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
