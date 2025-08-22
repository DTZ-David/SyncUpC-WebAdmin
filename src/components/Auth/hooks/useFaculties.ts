// src/components/Auth/hooks/useFaculties.ts

import { useState, useEffect } from "react";
import { Faculty } from "../types";
import { facultyService } from "../../../services/api/facultyService";

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculties = async () => {
    setLoading(true);
    setError(null);

    try {
      const facultiesData = await facultyService.getAllFaculties();
      setFaculties(facultiesData);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar facultades";
      setError(errorMessage);

      const mockFaculties: Faculty[] = [
        { id: "1", name: "Facultad de Ingeniería" },
        { id: "2", name: "Facultad de Medicina" },
        { id: "3", name: "Facultad de Derecho" },
        { id: "4", name: "Facultad de Educación" },
        { id: "5", name: "Facultad de Ciencias Económicas" },
      ];
      setFaculties(mockFaculties);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Función para recargar facultades
  const refetch = () => {
    fetchFaculties();
  };

  return { faculties, loading, error, refetch };
};
