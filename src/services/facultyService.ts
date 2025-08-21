// src/services/facultyService.ts

import { apiClient, ApiError } from "./api/apiClient";
import { Faculty } from "../components/Auth/types";
import { ENDPOINTS } from "./config/apiconfig";

export interface FacultyDTO {
  id: string;
  name: string;
  // Agrega más campos según lo que devuelva tu API
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class FacultyService {
  async getAllFaculties(): Promise<Faculty[]> {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.FACULTY.GET_ALL);

      // Debug: vamos a ver qué estructura tiene la respuesta
      console.log("Raw API response:", response);
      console.log("Type of response:", typeof response);
      console.log("Is array?", Array.isArray(response));

      // Manejar diferentes estructuras de respuesta
      let facultiesData: FacultyDTO[];

      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        facultiesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Si la respuesta tiene estructura { data: [...] }
        facultiesData = response.data;
      } else if (
        response &&
        response.result &&
        Array.isArray(response.result)
      ) {
        // Si la respuesta tiene estructura { result: [...] }
        facultiesData = response.result;
      } else if (
        response &&
        response.faculties &&
        Array.isArray(response.faculties)
      ) {
        // Si la respuesta tiene estructura { faculties: [...] }
        facultiesData = response.faculties;
      } else {
        // Si no podemos determinar la estructura, loggear y lanzar error
        console.error("Unexpected API response structure:", response);
        throw new Error("Estructura de respuesta inesperada de la API");
      }

      // Mapear la respuesta del backend al formato esperado por el frontend
      return facultiesData.map((faculty: any) => ({
        id:
          faculty.id ||
          faculty.facultyId ||
          faculty.Id ||
          faculty.FacultyId ||
          String(faculty.id),
        name:
          faculty.name ||
          faculty.facultyName ||
          faculty.Name ||
          faculty.FacultyName ||
          "Nombre no disponible",
      }));
    } catch (error) {
      console.error("Error fetching faculties:", error);

      if (error instanceof ApiError) {
        throw new Error(`Error ${error.status}: ${error.message}`);
      }

      throw new Error("Error desconocido al cargar facultades");
    }
  }
}

export const facultyService = new FacultyService();
