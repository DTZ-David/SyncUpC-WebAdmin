// src/components/Auth/RegisterForm/components/ProfessionalDataStep.tsx

import React from "react";
import { positionOptions } from "../../constants/positionOptions";
import InputField from "./shared/InputField";
import SelectField from "./shared/SelectField";
import { StaffFormData, Faculty } from "./types";

interface ProfessionalDataStepProps {
  formData: StaffFormData;
  errors: any;
  faculties: Faculty[];
  loadingFaculties: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ProfessionalDataStep: React.FC<ProfessionalDataStepProps> = ({
  formData,
  errors,
  faculties,
  loadingFaculties,
  onInputChange,
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Información Profesional
      </h3>
      <p className="text-gray-600">
        Completa tu información académica y laboral
      </p>
    </div>

    <InputField
      label="Profesión"
      name="profession"
      value={formData.profession}
      onChange={onInputChange}
      placeholder="Ej: Ingeniero de Sistemas"
      required
      error={errors.profession}
    />

    <InputField
      label="Departamento"
      name="department"
      value={formData.department}
      onChange={onInputChange}
      placeholder="Ej: Departamento de Sistemas"
      required
      error={errors.department}
    />

    <div className="grid md:grid-cols-2 gap-4">
      <SelectField
        label="Cargo"
        name="position"
        value={formData.position}
        onChange={onInputChange}
        options={positionOptions}
        required
        error={errors.position}
      />

      <SelectField
        label="Facultad"
        name="facultyId"
        value={formData.facultyId}
        onChange={onInputChange}
        options={faculties.map((f) => ({ value: f.id, label: f.name }))}
        placeholder={
          loadingFaculties
            ? "Cargando facultades..."
            : "Selecciona una facultad"
        }
        required
        error={errors.facultyId}
        disabled={loadingFaculties}
      />
    </div>
  </div>
);

export default ProfessionalDataStep;
