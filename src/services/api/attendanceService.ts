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

    return userAttendances.map((attendance: any) => {
      // Manejar los nuevos nombres de campos del backend
      const isTeacher = !attendance.carrera && !attendance.facultad;

      return {
        nombre: attendance.name || attendance.nombre || "N/A",
        apellido: attendance.lastName || attendance.apellido || "N/A",
        numero: attendance.phoneNumber || attendance.numero || "N/A",
        email: attendance.email || "N/A",
        checkInTime: this.formatTime(attendance.checkInTime),
        carrera: attendance.carrera || (isTeacher ? "Docente" : "N/A"),
        facultad: attendance.facultad || (isTeacher ? "Docente" : "N/A"),
      };
    });
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
   * Genera contenido CSV con todos los campos
   */
  private generateCSVContent(
    data: ProcessedAttendance[],
    eventTitle: string
  ): string {
    const headers = [
      "Nombre",
      "Apellido",
      "Número",
      "Email",
      "Carrera",
      "Facultad",
      "Hora Entrada",
    ];

    const csvRows = [
      `Reporte de Asistencia - ${eventTitle}`,
      `Generado el: ${new Date().toLocaleString("es-CO")}`,
      `Total de asistentes: ${data.length}`,
      "", // Línea en blanco
      headers.join(","),
      ...data.map((row) =>
        [
          `"${row.nombre}"`,
          `"${row.apellido}"`,
          `"${row.numero}"`,
          `"${row.email}"`,
          `"${row.carrera}"`,
          `"${row.facultad}"`,
          `"${row.checkInTime}"`,
        ].join(",")
      ),
    ];

    return csvRows.join("\n");
  }

  /**
   * Genera contenido HTML para PDF con diseño profesional incluyendo los nuevos campos
   */
  private generateHTMLContent(
    data: ProcessedAttendance[],
    eventTitle: string
  ): string {
    const rows = data
      .map(
        (row) => `
    <tr>
      <td>${row.nombre + " " + row.apellido}</td>
      <td>${row.numero}</td>
      <td>${row.email}</td>
      <td>${row.carrera}</td>
      <td>${row.checkInTime}</td>
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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body { 
            font-family: 'Times New Roman', serif;
            margin: 20px; 
            line-height: 1.4;
            color: #000;
            background-color: #fff;
            font-size: 12px;
          }

          /* Header institucional */
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }

          .logo-left {
            width: 70px;
            text-align: center;
          }

          .logo-right {
            width: 70px;
            text-align: center;
          }

          .logo-img {
            width: 50px;
            height: 50px;
            object-fit: contain;
            margin-bottom: 5px;
          }

          .logo-text {
            font-size: 8px;
            color: #333;
            font-weight: bold;
            text-align: center;
            line-height: 1.1;
          }

          /* Contenido central */
          .header-content {
            flex: 1;
            text-align: center;
            margin: 0 20px;
          }

          .institution-name {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          .program-name {
            font-size: 11px;
            color: #000;
            margin-bottom: 15px;
          }

          .report-title {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            margin-bottom: 6px;
            text-transform: uppercase;
          }

          .event-title {
            font-size: 13px;
            color: #000;
            margin-bottom: 10px;
            font-style: italic;
          }

          .generation-date {
            font-size: 10px;
            color: #666;
          }

          /* Información básica del evento */
          .event-summary {
            margin-bottom: 25px;
            text-align: center;
          }

          .summary-text {
            font-size: 11px;
            color: #333;
            margin-bottom: 5px;
          }

          /* Tabla con diseño más compacto */
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 10px;
          }

          th { 
            background-color: #f5f5f5;
            color: #000; 
            padding: 8px 4px; 
            text-align: left; 
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #333;
            text-transform: uppercase;
          }

          td {
            padding: 6px 4px;
            border: 1px solid #333;
            font-size: 9px;
            word-wrap: break-word;
            max-width: 120px;
          }

          tbody tr:nth-child(even) {
            background-color: #fafafa;
          }

          /* Columnas específicas */
          th:nth-child(4), td:nth-child(4) { /* Email */
            min-width: 140px;
          }

          th:nth-child(5), td:nth-child(5) { /* Carrera */
            min-width: 120px;
          }

          th:nth-child(6), td:nth-child(6) { /* Facultad */
            min-width: 100px;
          }

          th:nth-child(7), td:nth-child(7) { /* Hora */
            min-width: 110px;
          }

          /* Footer */
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 9px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 15px;
          }

          /* Estilos de impresión */
          @media print {
            body { 
              margin: 15px;
              font-size: 11px;
            }
            
            .header { 
              break-inside: avoid; 
            }
            
            table { 
              break-inside: auto;
              font-size: 9px;
            }
            
            tr { 
              break-inside: avoid; 
              break-after: auto; 
            }

            th, td {
              padding: 4px 2px;
            }
          }

          /* Responsive para pantallas pequeñas */
          @media screen and (max-width: 1200px) {
            table {
              font-size: 10px;
            }
            
            th, td {
              padding: 6px 3px;
            }

            /* Mantener proporciones */
            th:nth-child(1), td:nth-child(1) { width: 25%; }
            th:nth-child(2), td:nth-child(2) { width: 15%; }
            th:nth-child(3), td:nth-child(3) { width: 30%; }
            th:nth-child(4), td:nth-child(4) { width: 15%; }
            th:nth-child(5), td:nth-child(5) { width: 15%; }
          }
        </style>
      </head>
      <body>
        <!-- Header institucional -->
        <div class="header">
          <div class="logo-left">
            <img src="/upcLogo.png" alt="UPC Logo" class="logo-img" />
            <div class="logo-text">UPC</div>
          </div>
          
          <div class="header-content">
            <div class="institution-name">Universidad Popular del Cesar</div>
            <div class="program-name">Programa de Ingeniería de Sistemas</div>
            <div class="report-title">Reporte de Asistencia</div>
            <div class="event-title">${eventTitle}</div>
            <div class="generation-date">
              Generado el: ${new Date().toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} a las ${new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    })}
            </div>
          </div>
          
          <div class="logo-right">
            <img src="/ingSistemas.png" alt="Ingeniería de Sistemas Logo" class="logo-img" />
            <div class="logo-text">Ingeniería<br>de Sistemas</div>
          </div>
        </div>

        <!-- Resumen del evento -->
        <div class="event-summary">
          <div class="summary-text">Total de asistentes registrados: <strong>${
            data.length
          }</strong></div>
        </div>
        
        <!-- Tabla de asistencia con campos simplificados -->
        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Número</th>
              <th>Email</th>
              <th>Carrera</th>
              <th>Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        
        <!-- Footer institucional -->
        <div class="footer">
          <div>Sistema de Gestión de Asistencia</div>
          <div>Universidad Popular del Cesar - Programa de Ingeniería de Sistemas</div>
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
