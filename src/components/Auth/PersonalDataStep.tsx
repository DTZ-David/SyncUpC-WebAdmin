// src/components/Auth/RegisterForm/components/PersonalDataStep.tsx

import React from "react";
import { Users } from "lucide-react";
import FileUpload from "./shared/FileUpload";
import InputField from "./shared/InputField";
import { StaffFormData } from "./types";

interface PersonalDataStepProps {
  formData: StaffFormData;
  errors: any;
  showPassword: boolean;
  showConfirmPassword: boolean;
  selectedFile: File | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (file: File | null) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  selectedFile,
  onInputChange,
  onFileSelect,
  onTogglePassword,
  onToggleConfirmPassword,
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900">Datos Personales</h3>
      <p className="text-gray-600">Ingresa tu información personal básica</p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <InputField
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={onInputChange}
        placeholder="Tu nombre"
        required
        error={errors.firstName}
        icon={<Users size={20} />}
      />
      <InputField
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={onInputChange}
        placeholder="Tu apellido"
        required
        error={errors.lastName}
        icon={<Users size={20} />}
      />
    </div>

    <InputField
      label="Correo Electrónico"
      name="email"
      type="email"
      value={formData.email}
      onChange={onInputChange}
      placeholder="correo@universidad.edu"
      required
      error={errors.email}
    />

    <InputField
      label="Número de Teléfono"
      name="phoneNumber"
      type="tel"
      value={formData.phoneNumber}
      onChange={onInputChange}
      placeholder="+57 300 123 4567"
    />

    <FileUpload
      onFileSelect={onFileSelect}
      currentFile={selectedFile}
      error={errors.profilePhotoUrl}
    />

    <div className="grid md:grid-cols-2 gap-4">
      <div className="relative">
        <InputField
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={onInputChange}
          placeholder="Mínimo 6 caracteres"
          required
          error={errors.password}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="relative">
        <InputField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={onInputChange}
          placeholder="Repite tu contraseña"
          required
          error={errors.confirmPassword}
        />
        <button
          type="button"
          onClick={onToggleConfirmPassword}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  </div>
);

export default PersonalDataStep;
