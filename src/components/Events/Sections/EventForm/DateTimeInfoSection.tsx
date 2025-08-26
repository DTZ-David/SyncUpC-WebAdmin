// components/Events/sections/DateTimeInfoSection.tsx
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { DateTimeInfoProps } from "../../Types/EventTypes";

// Generar opciones de hora de 8 AM a 7 PM en intervalos de 30 minutos
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 19; hour++) {
    // 8 AM a 7 PM
    for (let minute = 0; minute < 60; minute += 30) {
      const hourString = hour.toString().padStart(2, "0");
      const minuteString = minute.toString().padStart(2, "0");
      const timeValue = `${hourString}:${minuteString}`;

      // Formato de 12 horas para mostrar
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayTime = `${displayHour}:${minuteString} ${ampm}`;

      options.push({ value: timeValue, label: displayTime });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export const DateTimeInfoSection: React.FC<
  DateTimeInfoProps & { showRegistrationDates?: boolean }
> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Fechas y Horarios del Evento
      </h3>

      {/* Event Start Date and Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio *
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de Inicio *
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="startTime"
              required
              value={formData.startTime}
              onChange={onChange} // 👈 faltaba esto
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccionar hora</option>
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Event End Date and Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Fin
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de Fin
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="endTime"
              value={formData.endTime}
              onChange={onChange} // 👈 igual acá
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccionar hora</option>
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
