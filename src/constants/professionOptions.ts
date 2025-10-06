// src/constants/professionOptions.ts

export interface ProfessionOption {
  value: string;
  label: string;
}

// Profesiones comunes para personal académico
export const professionOptions: ProfessionOption[] = [
  // Ingenierías
  { value: "ingeniero_sistemas", label: "Ingeniero de Sistemas" },
  { value: "ingeniero_civil", label: "Ingeniero Civil" },
  { value: "ingeniero_electronico", label: "Ingeniero Electrónico" },
  { value: "ingeniero_industrial", label: "Ingeniero Industrial" },
  { value: "ingeniero_mecanico", label: "Ingeniero Mecánico" },
  { value: "ingeniero_ambiental", label: "Ingeniero Ambiental" },

  // Ciencias de la Salud
  { value: "medico", label: "Médico" },
  { value: "enfermero", label: "Enfermero Profesional" },
  { value: "odontologo", label: "Odontólogo" },
  { value: "fisioterapeuta", label: "Fisioterapeuta" },

  // Ciencias Sociales y Humanidades
  { value: "abogado", label: "Abogado" },
  { value: "psicologo", label: "Psicólogo" },
  { value: "trabajador_social", label: "Trabajador Social" },
  { value: "comunicador_social", label: "Comunicador Social" },

  // Educación
  { value: "licenciado_educacion", label: "Licenciado en Educación" },
  { value: "pedagogo", label: "Pedagogo" },

  // Ciencias Económicas y Administrativas
  { value: "administrador_empresas", label: "Administrador de Empresas" },
  { value: "contador_publico", label: "Contador Público" },
  { value: "economista", label: "Economista" },

  // Ciencias Básicas
  { value: "matematico", label: "Matemático" },
  { value: "fisico", label: "Físico" },
  { value: "quimico", label: "Químico" },
  { value: "biologo", label: "Biólogo" },

  // Arquitectura y Diseño
  { value: "arquitecto", label: "Arquitecto" },

  // Ciencias Agropecuarias
  { value: "agronomo", label: "Ingeniero Agrónomo" },
  { value: "veterinario", label: "Médico Veterinario" },

  // Otros
  { value: "master", label: "Magíster" },
  { value: "doctor", label: "Doctor (PhD)" },
  { value: "otro", label: "Otra Profesión" },
];
