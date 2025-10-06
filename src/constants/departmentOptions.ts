// src/constants/departmentOptions.ts

export interface DepartmentOption {
  value: string;
  label: string;
}

// Departamentos comunes en universidades
export const departmentOptions: DepartmentOption[] = [
  // Ingeniería
  { value: "sistemas", label: "Ingeniería de Sistemas" },
  { value: "civil", label: "Ingeniería Civil" },
  { value: "electronica", label: "Ingeniería Electrónica" },
  { value: "industrial", label: "Ingeniería Industrial" },
  { value: "mecanica", label: "Ingeniería Mecánica" },
  { value: "ambiental", label: "Ingeniería Ambiental" },

  // Ciencias de la Salud
  { value: "medicina", label: "Medicina" },
  { value: "enfermeria", label: "Enfermería" },
  { value: "odontologia", label: "Odontología" },
  { value: "fisioterapia", label: "Fisioterapia" },

  // Ciencias Sociales y Humanidades
  { value: "derecho", label: "Derecho" },
  { value: "psicologia", label: "Psicología" },
  { value: "trabajo_social", label: "Trabajo Social" },
  { value: "comunicacion_social", label: "Comunicación Social" },

  // Educación
  { value: "educacion_basica", label: "Educación Básica" },
  { value: "educacion_fisica", label: "Educación Física" },
  { value: "pedagogia", label: "Pedagogía" },

  // Ciencias Económicas y Administrativas
  { value: "administracion_empresas", label: "Administración de Empresas" },
  { value: "contaduria", label: "Contaduría Pública" },
  { value: "economia", label: "Economía" },
  { value: "mercadeo", label: "Mercadeo" },

  // Ciencias Básicas
  { value: "matematicas", label: "Matemáticas" },
  { value: "fisica", label: "Física" },
  { value: "quimica", label: "Química" },
  { value: "biologia", label: "Biología" },

  // Otros
  { value: "arquitectura", label: "Arquitectura" },
  { value: "agronomia", label: "Agronomía" },
  { value: "veterinaria", label: "Medicina Veterinaria" },
  { value: "otro", label: "Otro" },
];
