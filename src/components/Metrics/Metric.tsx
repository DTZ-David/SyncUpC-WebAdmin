import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  BookOpen,
  GraduationCap,
  MapPin,
  Clock,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Award,
  Target,
} from "lucide-react";

interface MetricsData {
  totalEvents: number;
  totalAttendees: number;
  averageAttendeesPerEvent: number;
  topFaculty: {
    name: string;
    eventCount: number;
    percentage: number;
  };
  topCareer: {
    name: string;
    eventCount: number;
    percentage: number;
  };
  topLocation: {
    name: string;
    eventCount: number;
    percentage: number;
  };
  monthlyTrend: {
    month: string;
    events: number;
    attendees: number;
  }[];
  eventTypeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  attendanceRate: number;
  peakAttendanceHour: string;
  averageEventDuration: number;
}

export default function EventMetrics() {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last3months");

  // Datos simulados - en el mundo real vendrían del backend
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMetricsData({
        totalEvents: 127,
        totalAttendees: 3456,
        averageAttendeesPerEvent: 27.2,
        topFaculty: {
          name: "Ingeniería",
          eventCount: 45,
          percentage: 35.4,
        },
        topCareer: {
          name: "Ingeniería de Sistemas",
          eventCount: 28,
          percentage: 22.0,
        },
        topLocation: {
          name: "Auditorio Principal",
          eventCount: 32,
          percentage: 25.2,
        },
        monthlyTrend: [
          { month: "Jun", events: 18, attendees: 487 },
          { month: "Jul", events: 22, attendees: 612 },
          { month: "Ago", events: 31, attendees: 834 },
          { month: "Sep", events: 28, attendees: 756 },
          { month: "Oct", events: 35, attendees: 945 },
          { month: "Nov", events: 41, attendees: 1124 },
        ],
        eventTypeDistribution: [
          { type: "Conferencia", count: 42, percentage: 33.1 },
          { type: "Taller", count: 35, percentage: 27.6 },
          { type: "Seminario", count: 28, percentage: 22.0 },
          { type: "Mesa Redonda", count: 22, percentage: 17.3 },
        ],
        attendanceRate: 78.5,
        peakAttendanceHour: "14:00",
        averageEventDuration: 2.3,
      });
      setIsLoading(false);
    };

    fetchMetrics();
  }, [dateRange]);

  const handleExportPDF = () => {
    console.log("Exportando métricas a PDF...");
    // Aquí iría la lógica para generar PDF
  };

  const handleExportExcel = () => {
    console.log("Exportando métricas a Excel...");
    // Aquí iría la lógica para generar Excel
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: string;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <TrendingUp size={14} className="text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-green-500" size={32} />
        <span className="ml-2 text-gray-600">Cargando métricas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Métricas de Eventos
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis y estadísticas de tus eventos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="lastMonth">Último mes</option>
            <option value="last3months">Últimos 3 meses</option>
            <option value="last6months">Últimos 6 meses</option>
            <option value="lastYear">Último año</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download size={16} />
            <span>PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 text-sm"
          >
            <FileSpreadsheet size={16} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Eventos"
          value={metricsData?.totalEvents || 0}
          icon={Calendar}
          color="bg-blue-500"
          trend="+12% vs mes anterior"
        />
        <MetricCard
          title="Total de Asistentes"
          value={metricsData?.totalAttendees.toLocaleString() || 0}
          icon={Users}
          color="bg-green-500"
          trend="+18% vs mes anterior"
        />
        <MetricCard
          title="Promedio de Asistentes"
          value={metricsData?.averageAttendeesPerEvent.toFixed(1) || 0}
          icon={Target}
          color="bg-purple-500"
          subtitle="Por evento"
        />
        <MetricCard
          title="Tasa de Asistencia"
          value={`${metricsData?.attendanceRate}%`}
          icon={Award}
          color="bg-orange-500"
          trend="+5.2% vs mes anterior"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Facultad Líder
            </h3>
            <BookOpen className="text-blue-500" size={24} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {metricsData?.topFaculty.name}
                </span>
                <span className="text-sm text-gray-600">
                  {metricsData?.topFaculty.eventCount} eventos
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${metricsData?.topFaculty.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metricsData?.topFaculty.percentage}% del total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Carrera Líder
            </h3>
            <GraduationCap className="text-green-500" size={24} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {metricsData?.topCareer.name}
                </span>
                <span className="text-sm text-gray-600">
                  {metricsData?.topCareer.eventCount} eventos
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${metricsData?.topCareer.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metricsData?.topCareer.percentage}% del total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ubicación Favorita
            </h3>
            <MapPin className="text-purple-500" size={24} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {metricsData?.topLocation.name}
                </span>
                <span className="text-sm text-gray-600">
                  {metricsData?.topLocation.eventCount} eventos
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${metricsData?.topLocation.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metricsData?.topLocation.percentage}% del total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tendencia Mensual
            </h3>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
          <div className="space-y-4">
            {metricsData?.monthlyTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">
                  {item.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.events} eventos</span>
                    <span>{item.attendees} asistentes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.events / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Types Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tipos de Eventos
            </h3>
            <Calendar className="text-green-500" size={24} />
          </div>
          <div className="space-y-4">
            {metricsData?.eventTypeDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {item.type}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Hora Pico de Asistencia"
          value={metricsData?.peakAttendanceHour || "N/A"}
          icon={Clock}
          color="bg-indigo-500"
          subtitle="Hora con mayor asistencia"
        />
        <MetricCard
          title="Duración Promedio"
          value={`${metricsData?.averageEventDuration}h`}
          icon={TrendingUp}
          color="bg-pink-500"
          subtitle="Por evento"
        />
        <MetricCard
          title="Eventos Activos"
          value="12"
          icon={Users}
          color="bg-teal-500"
          subtitle="En curso actualmente"
        />
      </div>
    </div>
  );
}
