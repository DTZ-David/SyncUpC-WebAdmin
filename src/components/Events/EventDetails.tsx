import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Globe, Edit, Trash2 } from 'lucide-react';

interface EventDetailsProps {
  event: any;
  onBack: () => void;
  onEdit: (event: any) => void;
}

export default function EventDetails({ event, onBack, onEdit }: EventDetailsProps) {
  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      console.log('Eliminando evento:', event.id);
      alert('Evento eliminado correctamente');
      onBack();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Borrador';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Evento</h1>
            <p className="text-gray-600">Información completa del evento</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(event)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Edit size={20} />
            <span>Editar</span>
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={20} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          {event.image && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={event.image}
                alt={event.eventTitle}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Event Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{event.eventTitle}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {event.eventObjective || 'Este evento tiene como objetivo reunir a profesionales y estudiantes para compartir conocimientos y experiencias en el área de tecnología e innovación.'}
              </p>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Ubicación</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{event.eventLocation}</p>
                  <p className="text-gray-600">{event.address || 'Dirección completa del evento'}</p>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fecha y Hora</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Fecha de Inicio</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Horario</p>
                    <p className="text-gray-600">{event.time} - {event.endTime || '10:00 PM'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modality */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Modalidad</h3>
              <div className="flex items-center space-x-3">
                <Globe className="text-gray-400" size={20} />
                <div>
                  <p className="font-medium text-gray-900">
                    {event.isVirtual ? 'Virtual' : 'Presencial'}
                  </p>
                  {event.isVirtual && event.meetingUrl && (
                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Enlace de la reunión
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Asistentes Registrados</span>
                <span className="font-semibold text-gray-900">{event.attendees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confirmados</span>
                <span className="font-semibold text-green-600">{event.confirmed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Capacidad Máxima</span>
                <span className="font-semibold text-gray-900">
                  {event.maxCapacity || 'Sin límite'}
                </span>
              </div>
            </div>
          </div>

          {/* Event Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Requiere Registro</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.requiresRegistration ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {event.requiresRegistration ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Evento Público</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {event.isPublic ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}