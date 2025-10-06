// src/components/Auth/RegisterForm/components/ProfessionalDataStep.tsx

import React from "react";
import { positionOptions } from "../../constants/positionOptions";
import { departmentOptions } from "../../constants/departmentOptions";
import { professionOptions } from "../../constants/professionOptions";
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

    <div className="grid md:grid-cols-2 gap-4">
      <SelectField
        label="Departamento"
        name="department"
        value={formData.department}
        onChange={onInputChange}
        options={departmentOptions}
        placeholder="Selecciona un departamento"
        required
        error={errors.department}
      />

      <SelectField
        label="Profesión"
        name="profession"
        value={formData.profession}
        onChange={onInputChange}
        options={professionOptions}
        placeholder="Selecciona tu profesión"
        required
        error={errors.profession}
      />
    </div>

    <SelectField
      label="Cargo"
      name="position"
      value={formData.position}
      onChange={onInputChange}
      options={positionOptions}
      placeholder="Selecciona tu cargo"
      required
      error={errors.position}
    />
  </div>
);

export default ProfessionalDataStep;
