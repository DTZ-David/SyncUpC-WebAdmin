// src/services/api/attendanceService.ts
import { apiClient } from "./apiClient";
import { authService } from "./authService";

import type {
  AttendanceResponse,
  AttendanceRequest,
  ProcessedAttendance,
  UserAttendance,
} from "../types/AttendanceTypes";
import { ENDPOINTS } from "../config/apiConfig";

class AttendanceService {
  private ensureAuthenticated(): void {
    const user = authService.getCurrentUser();
    if (!user?.token) {
      throw new Error("No hay token de autenticación disponible");
    }
    apiClient.setAuthToken(user.token);
  }

  /**
   * Obtiene la lista de asistencia de un evento
   */
  async getAttendanceList(eventId: string): Promise<AttendanceResponse> {
    try {
      this.ensureAuthenticated();

      const requestData: AttendanceRequest = { eventId };

      console.log("🔍 Getting attendance list for event:", eventId);

      const response = await apiClient.post<AttendanceResponse>(
        ENDPOINTS.ATTENDANCE.GET_LIST,
        requestData,
        undefined,
        true
      );

      console.log("📋 Attendance list response:", response);

      return response;
    } catch (error) {
      console.error("❌ Error fetching attendance list:", error);
      throw error;
    }
  }

  /**
   * Procesa los datos de asistencia para exportación
   */
  processAttendanceData(
    userAttendances: UserAttendance[]
  ): ProcessedAttendance[] {
    // Validación y logs para debugging
    console.log("🔍 Processing attendance data:", userAttendances);

    if (!userAttendances) {
      console.error("❌ userAttendances is undefined or null");
      return [];
    }

    if (!Array.isArray(userAttendances)) {
      console.error(
        "❌ userAttendances is not an array:",
        typeof userAttendances
      );
      return [];
    }

    if (userAttendances.length === 0) {
      console.warn("⚠️ userAttendances array is empty");
      return [];
    }

    return userAttendances.map((attendance) => {
      const duration = this.calculateDuration(
        attendance.checkInTime,
        attendance.checkOutTime
      );

      return {
        nombre: attendance.nombre,
        apellido: attendance.apellido,
        numero: attendance.numero,
        checkInTime: this.formatTime(attendance.checkInTime),
        checkOutTime: this.formatTime(attendance.checkOutTime),
        duration,
        status: attendance.checkInTime ? "Presente" : "Ausente",
      };
    });
  }

  /**
   * Calcula la duración entre check-in y check-out
   */
  private calculateDuration(checkIn: string, checkOut: string): string {
    if (!checkIn || !checkOut) return "N/A";

    try {
      const startTime = new Date(checkIn);
      const endTime = new Date(checkOut);
      const diffMs = endTime.getTime() - startTime.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "N/A";
    }
  }

  /**
   * Formatea la hora para mostrar
   */
  private formatTime(timeString: string): string {
    if (!timeString) return "N/A";

    try {
      const date = new Date(timeString);
      return date.toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  }

  /**
   * Genera y descarga un archivo Excel con la lista de asistencia
   */
  async downloadExcel(eventId: string, eventTitle: string): Promise<void> {
    try {
      const response = await this.getAttendanceList(eventId);

      console.log(
        "🔍 Excel - Full response structure:",
        JSON.stringify(response, null, 2)
      );

      if (!response.isSuccess || !response.data) {
        throw new Error("No se pudieron obtener los datos de asistencia");
      }

      console.log("🔍 Excel - Response data:", response.data);
      console.log(
        "🔍 Excel - userAttendanceDto:",
        response.data.userAttendanceDto
      );

      // Validación adicional antes del procesamiento
      const attendanceData = response.data.userAttendanceDto;
      if (!attendanceData) {
        throw new Error(
          "No se encontraron datos de asistencia en la respuesta"
        );
      }

      const processedData = this.processAttendanceData(attendanceData);

      if (processedData.length === 0) {
        console.warn("⚠️ No hay datos procesados para generar el Excel");
        throw new Error("No hay datos de asistencia para procesar");
      }

      // Crear contenido CSV (Excel puede abrir archivos CSV)
      const csvContent = this.generateCSVContent(processedData, eventTitle);

      // Crear y descargar archivo
      this.downloadFile(
        csvContent,
        `asistencia_${eventTitle}_${eventId}.csv`,
        "text/csv"
      );

      console.log("✅ Excel file downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading Excel:", error);
      throw error;
    }
  }

  /**
   * Genera y descarga un archivo PDF con la lista de asistencia
   */
  async downloadPDF(eventId: string, eventTitle: string): Promise<void> {
    try {
      const response = await this.getAttendanceList(eventId);

      console.log(
        "🔍 Full response structure:",
        JSON.stringify(response, null, 2)
      );

      if (!response.isSuccess || !response.data) {
        throw new Error("No se pudieron obtener los datos de asistencia");
      }

      console.log("🔍 Response data:", response.data);
      console.log("🔍 userAttendanceDto:", response.data.userAttendanceDto);

      // Validación adicional antes del procesamiento
      const attendanceData = response.data.userAttendanceDto;
      if (!attendanceData) {
        throw new Error(
          "No se encontraron datos de asistencia en la respuesta"
        );
      }

      const processedData = this.processAttendanceData(attendanceData);

      if (processedData.length === 0) {
        console.warn("⚠️ No hay datos procesados para generar el PDF");
        throw new Error("No hay datos de asistencia para procesar");
      }

      // Generar contenido HTML para el PDF
      const htmlContent = this.generateHTMLContent(processedData, eventTitle);

      // Crear PDF usando la API del navegador
      await this.generatePDFFromHTML(
        htmlContent,
        `reporte_asistencia_${eventTitle}_${eventId}.pdf`
      );

      console.log("✅ PDF file downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      throw error;
    }
  }

  /**
   * Genera contenido CSV
   */
  private generateCSVContent(
    data: ProcessedAttendance[],
    eventTitle: string
  ): string {
    const headers = [
      "Nombre",
      "Apellido",
      "Número",
      "Hora Entrada",
      "Hora Salida",
      "Duración",
      "Estado",
    ];

    const csvRows = [
      `Reporte de Asistencia - ${eventTitle}`,
      `Generado el: ${new Date().toLocaleString("es-CO")}`,
      "", // Línea en blanco
      headers.join(","),
      ...data.map((row) =>
        [
          `"${row.nombre}"`,
          `"${row.apellido}"`,
          row.numero,
          `"${row.checkInTime}"`,
          `"${row.checkOutTime}"`,
          row.duration,
          row.status,
        ].join(",")
      ),
    ];

    return csvRows.join("\n");
  }

  /**
   * Genera contenido HTML para PDF
   */
  private generateHTMLContent(
    data: ProcessedAttendance[],
    eventTitle: string
  ): string {
    const rows = data
      .map(
        (row) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.nombre}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.apellido}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.numero}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          row.checkInTime
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          row.checkOutTime
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.duration}</td>
        <td style="border: 1px solid #ddd; padding: 8px; color: ${
          row.status === "Presente" ? "green" : "red"
        };">${row.status}</td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Asistencia - ${eventTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #333; }
            .subtitle { font-size: 14px; color: #666; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4CAF50; color: white; border: 1px solid #ddd; padding: 12px; text-align: left; }
            .summary { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Reporte de Asistencia</div>
            <div class="subtitle">${eventTitle}</div>
            <div class="subtitle">Generado el: ${new Date().toLocaleString(
              "es-CO"
            )}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Número</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Duración</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Resumen</h3>
            <p><strong>Total de registros:</strong> ${data.length}</p>
            <p><strong>Presentes:</strong> ${
              data.filter((d) => d.status === "Presente").length
            }</p>
            <p><strong>Ausentes:</strong> ${
              data.filter((d) => d.status === "Ausente").length
            }</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Genera PDF desde HTML usando window.print
   */
  private async generatePDFFromHTML(
    htmlContent: string,
    filename: string
  ): Promise<void> {
    // Crear una ventana temporal para imprimir
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("No se pudo abrir la ventana de impresión");
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Esperar a que se cargue el contenido
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      setTimeout(resolve, 1000); // Fallback
    });

    // Imprimir/guardar como PDF
    printWindow.print();

    // Cerrar la ventana después de un tiempo
    setTimeout(() => {
      printWindow.close();
    }, 2000);
  }

  /**
   * Descarga un archivo
   */
  private downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const attendanceService = new AttendanceService();
