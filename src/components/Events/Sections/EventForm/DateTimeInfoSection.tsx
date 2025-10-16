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
  const hasStartDate = formData.startDate && formData.startDate !== "";
  const hasStartTime = formData.startTime && formData.startTime !== "";
  const hasEndDate = formData.endDate && formData.endDate !== "";
  const hasEndTime = formData.endTime && formData.endTime !== "";

  // Calcular fecha mínima (hoy o mañana si ya es tarde)
  const now = new Date();
  const currentHour = now.getHours();

  // Crear fecha mínima usando valores locales para evitar problemas de zona horaria
  const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Si ya son más de las 7 PM (19:00), la fecha mínima es mañana
  if (currentHour >= 19) {
    minDate.setDate(minDate.getDate() + 1);
  }

  // Formatear fecha manualmente para evitar problemas de zona horaria
  const minDateString = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}-${String(minDate.getDate()).padStart(2, '0')}`;

  // Validar si la fecha/hora está en el pasado
  let isStartInPast = false;
  let eventStartDateTime: Date | null = null;
  if (hasStartDate && hasStartTime) {
    eventStartDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    isStartInPast = eventStartDateTime <= now;
  }

  // Validar que la fecha de fin sea después de la fecha de inicio
  let isEndBeforeStart = false;
  if (hasStartDate && hasStartTime && hasEndDate && hasEndTime) {
    const eventEndDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    isEndBeforeStart = eventEndDateTime <= eventStartDateTime!;
  }

  // Filtrar opciones de hora según la fecha seleccionada
  const getAvailableTimeOptions = (selectedDate: string) => {
    if (!selectedDate) return timeOptions;

    // Parsear la fecha seleccionada (formato YYYY-MM-DD)
    const [year, month, day] = selectedDate.split('-').map(Number);
    const selected = new Date(year, month - 1, day);

    // Crear fecha de hoy sin hora para comparar
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Si la fecha seleccionada es hoy, filtrar horas pasadas
    if (selected.getTime() === today.getTime()) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      return timeOptions.filter(option => {
        const [hour, minute] = option.value.split(':').map(Number);
        if (hour > currentHour) return true;
        if (hour === currentHour && minute > currentMinute) return true;
        return false;
      });
    }

    // Si la fecha seleccionada es futura, mostrar todas las horas
    return timeOptions;
  };

  const availableStartTimes = getAvailableTimeOptions(formData.startDate);
  const availableEndTimes = getAvailableTimeOptions(formData.endDate);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Fechas y Horarios del Evento
      </h3>

      {currentHour >= 19 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            ℹ️ Son más de las 7 PM, por lo que solo puedes seleccionar fechas a partir de mañana
          </p>
        </div>
      )}

      {isStartInPast && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ La fecha y hora del evento no puede estar en el pasado
          </p>
        </div>
      )}

      {isEndBeforeStart && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3">
          <p className="text-sm text-red-800 font-medium">
            ❌ La fecha de fin debe ser posterior a la fecha de inicio
          </p>
        </div>
      )}

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
              min={minDateString}
              value={formData.startDate}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                !hasStartDate || isStartInPast ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>
          {!hasStartDate && (
            <p className="text-xs text-red-500 mt-1">
              La fecha de inicio es requerida
            </p>
          )}
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
              onChange={onChange}
              disabled={!hasStartDate || availableStartTimes.length === 0}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white ${
                !hasStartTime || isStartInPast ? "border-red-300 bg-red-50" : "border-gray-300"
              } ${!hasStartDate || availableStartTimes.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {!hasStartDate
                  ? "Primero selecciona una fecha"
                  : availableStartTimes.length === 0
                  ? "No hay horas disponibles hoy"
                  : "Seleccionar hora"}
              </option>
              {availableStartTimes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {!hasStartTime && hasStartDate && (
            <p className="text-xs text-red-500 mt-1">
              La hora de inicio es requerida
            </p>
          )}
          {availableStartTimes.length === 0 && hasStartDate && (
            <p className="text-xs text-amber-600 mt-1">
              No hay horas disponibles para hoy. Selecciona mañana o una fecha futura.
            </p>
          )}
        </div>
      </div>

      {/* Event End Date and Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Fin
            <span className="text-gray-500 font-normal ml-1">(opcional)</span>
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              name="endDate"
              min={formData.startDate || minDateString}
              value={formData.endDate}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                isEndBeforeStart ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>
          {isEndBeforeStart && (
            <p className="text-xs text-red-500 mt-1">
              La fecha de fin debe ser posterior al inicio
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de Fin
            <span className="text-gray-500 font-normal ml-1">(opcional)</span>
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="endTime"
              value={formData.endTime}
              onChange={onChange}
              disabled={!hasEndDate}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white ${
                isEndBeforeStart ? "border-red-300 bg-red-50" : "border-gray-300"
              } ${!hasEndDate ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {!hasEndDate ? "Primero selecciona fecha de fin" : "Seleccionar hora"}
              </option>
              {availableEndTimes.map((option) => (
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
