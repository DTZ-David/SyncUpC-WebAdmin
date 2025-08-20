import React from "react";
import StatsCard from "./StatsCard";
import { Calendar, Users, UserCheck, TrendingUp } from "lucide-react";

interface DashboardProps {
  onViewEventDetails: (event: any) => void;
}

export default function Dashboard({ onViewEventDetails }: DashboardProps) {
  const stats = [
    {
      title: "Total de Eventos",
      value: 24,
      icon: Calendar,
      change: "12% desde el mes pasado",
      changeType: "increase" as const,
      color: "bg-green-500",
    },
    {
      title: "Total de Asistentes",
      value: 1247,
      icon: Users,
      change: "18% desde el mes pasado",
      changeType: "increase" as const,
      color: "bg-blue-500",
    },
    {
      title: "Asistentes Confirmados",
      value: 892,
      icon: UserCheck,
      change: "5% desde el mes pasado",
      changeType: "increase" as const,
      color: "bg-lime-500",
    },
    {
      title: "Tasa de Asistencia",
      value: "76%",
      icon: TrendingUp,
      change: "3% desde el mes pasado",
      changeType: "increase" as const,
      color: "bg-purple-500",
    },
  ];

  const recentEvents = [
    {
      id: 1,
      title: "Summer Camp 2025 - Seminar",
      date: "5 May 2025",
      attendees: 17,
      status: "upcoming",
      location: "Comedor Universitario",
      eventObjective:
        "Semana internacional de descubrimiento con actividades culturales y académicas.",
      image:
        "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      title: "Congreso de Innovación",
      date: "14 February 2025",
      attendees: 320,
      status: "confirmed",
      location: "Auditorio Central",
      eventObjective:
        "Congreso enfocado en las últimas tendencias tecnológicas.",
      image:
        "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      title: "Encuentro de Egresados y Mentores",
      date: "9 January 2025",
      attendees: 43,
      status: "completed",
      location: "Auditorio principal",
      eventObjective:
        "Encuentro para conectar egresados con estudiantes actuales.",
      image:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Panel Principal
        </h1>
        <p className="text-gray-600">
          ¡Bienvenido de nuevo! Aquí tienes un resumen de tus eventos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Eventos Recientes
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onViewEventDetails(event)}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{event.date}</span>
                    <span className="text-sm text-gray-600">
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {event.attendees} asistentes
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : event.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {event.status === "upcoming"
                      ? "Próximo"
                      : event.status === "confirmed"
                      ? "Confirmado"
                      : event.status === "completed"
                      ? "Completado"
                      : event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
