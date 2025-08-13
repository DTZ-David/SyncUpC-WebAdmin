import React, { useState } from 'react';
import { X, Upload, Calendar, Clock, MapPin, Users, Globe, Video, Tag } from 'lucide-react';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
}

export default function EventForm({ isOpen, onClose, event }: EventFormProps) {
  const [formData, setFormData] = useState({
    eventTitle: event?.eventTitle || '',
    eventObjective: event?.eventObjective || '',
    eventLocation: event?.eventLocation || '',
    address: event?.address || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    registrationStart: event?.registrationStart || '',
    registrationEnd: event?.registrationEnd || '',
    careerIds: event?.careerIds || [],
    targetTeachers: event?.targetTeachers || false,
    targetStudents: event?.targetStudents || false,
    targetAdministrative: event?.targetAdministrative || false,
    targetGeneral: event?.targetGeneral || false,
    isVirtual: event?.isVirtual || false,
    meetingUrl: event?.meetingUrl || '',
    maxCapacity: event?.maxCapacity || '',
    requiresRegistration: event?.requiresRegistration || true,
    isPublic: event?.isPublic || true,
    tags: event?.tags || [],
    imageUrls: event?.imageUrls || [],
    additionalDetails: event?.additionalDetails || ''
  });

  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for backend
    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      registrationStart: new Date(formData.registrationStart).toISOString(),
      registrationEnd: new Date(formData.registrationEnd).toISOString(),
      maxCapacity: parseInt(formData.maxCapacity) || 0
    };
    
    console.log('Event data for backend:', eventData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Título del Evento *</label>
              <input
                type="text"
                name="eventTitle"
                required
                value={formData.eventTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Ingrese el título del evento"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo del Evento *</label>
              <textarea
                name="eventObjective"
                required
                rows={3}
                value={formData.eventObjective}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Describa el objetivo del evento"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación del Evento *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="eventLocation"
                  required
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Nombre del lugar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Dirección completa"
              />
            </div>
          </div>

          {/* Date and Time Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora de Inicio *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora de Fin *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Registration Period */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inicio de Registro *</label>
              <input
                type="datetime-local"
                name="registrationStart"
                required
                value={formData.registrationStart}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fin de Registro *</label>
              <input
                type="datetime-local"
                name="registrationEnd"
                required
                value={formData.registrationEnd}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Audiencia Objetivo</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="targetTeachers"
                  checked={formData.targetTeachers}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Profesores</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="targetStudents"
                  checked={formData.targetStudents}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Estudiantes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="targetAdministrative"
                  checked={formData.targetAdministrative}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Administrativos</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="targetGeneral"
                  checked={formData.targetGeneral}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Público General</span>
              </label>
            </div>
          </div>

          {/* Virtual Event Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 mb-3">
                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm font-medium text-gray-700">Evento Virtual</span>
              </label>
              {formData.isVirtual && (
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    name="meetingUrl"
                    value={formData.meetingUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="URL de la reunión"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad Máxima</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="0 = Sin límite"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Event Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="requiresRegistration"
                  checked={formData.requiresRegistration}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Requiere Registro</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">Evento Público</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-lime-600 hover:text-lime-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Agregar etiqueta"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detalles Adicionales</label>
            <textarea
              name="additionalDetails"
              rows={4}
              value={formData.additionalDetails}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="Información adicional sobre el evento"
            />
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Evento</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-lime-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <div className="text-sm text-gray-600">
                <label className="cursor-pointer text-lime-600 hover:text-lime-700">
                  Subir una imagen
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
            >
              {event ? 'Actualizar Evento' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}