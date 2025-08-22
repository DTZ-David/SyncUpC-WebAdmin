// services/api/careerService.ts

import { API_CONFIG, ENDPOINTS } from "../config/apiconfig";

export interface Career {
  id: string;
  name: string;
  creationDate?: string; // Opcional, no lo usaremos pero viene del backend
}

export interface CareerApiResponse {
  statusCode: number;
  isSuccess: boolean;
  data: Career[];
}

class CareerService {
  private baseUrl = API_CONFIG.BASE_URL;

  async getAllCareers(): Promise<CareerApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}${ENDPOINTS.CAREER.GET_ALL}`,
        {
          method: "GET",
          headers: API_CONFIG.HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CareerApiResponse = await response.json();

      return data;
    } catch (error: any) {
      console.error("Error fetching careers:", error);
      return {
        statusCode: 500,
        isSuccess: false,
        data: [],
      };
    }
  }
}

export const careerService = new CareerService();
