// src/constants/departmentOptions.ts

export interface DepartmentOption {
  value: string;
  label: string;
}

// Departamentos administrativos y académicos de la universidad
export const departmentOptions: DepartmentOption[] = [
  // Coordinaciones Académicas
  { value: "coord_academica", label: "Coordinación Académica" },
  { value: "coord_investigacion", label: "Coordinación de Investigación" },
  { value: "coord_posgrados", label: "Coordinación de Posgrados" },
  { value: "coord_bienestar", label: "Coordinación de Bienestar Universitario" },

  // Departamentos Académicos
  { value: "depto_sistemas", label: "Departamento de Sistemas" },
  { value: "depto_ingenieria", label: "Departamento de Ingeniería" },
  { value: "depto_ciencias_salud", label: "Departamento de Ciencias de la Salud" },
  { value: "depto_ciencias_sociales", label: "Departamento de Ciencias Sociales" },
  { value: "depto_ciencias_basicas", label: "Departamento de Ciencias Básicas" },
  { value: "depto_humanidades", label: "Departamento de Humanidades" },
  { value: "depto_ciencias_economicas", label: "Departamento de Ciencias Económicas" },

  // Departamentos Administrativos
  { value: "depto_recursos_humanos", label: "Departamento de Recursos Humanos" },
  { value: "depto_financiero", label: "Departamento Financiero" },
  { value: "depto_contabilidad", label: "Departamento de Contabilidad" },
  { value: "depto_servicios_generales", label: "Departamento de Servicios Generales" },

  // Áreas de Soporte
  { value: "registro_academico", label: "Registro Académico" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "admisiones", label: "Admisiones y Registro" },
  { value: "tecnologia", label: "Tecnología y Sistemas de Información" },
  { value: "comunicaciones", label: "Comunicaciones y Marketing" },
  { value: "planeacion", label: "Planeación Institucional" },
  { value: "calidad", label: "Aseguramiento de la Calidad" },
  { value: "juridica", label: "Oficina Jurídica" },

  // Otros
  { value: "otro", label: "Otro" },
];
