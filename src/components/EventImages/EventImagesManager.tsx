import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  Download,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ImageGallery from "./ImageGallery";
import ImageUploader from "./ImageUploader";
import { useEventImages } from "./hooks/useEventImages";

// Tipos actualizados basados en el endpoint real
interface EventFromImages {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  imageUrls: string[];
  uploadedByUserId: string;
  uploadedByUserName: string;
}

export default function EventImagesManager() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    images,
    loading,
    error,
    uploading,
    uploadProgress,
    fetchImages,
    uploadImages,
    deleteImage,
    getEventImages,
    clearError,
  } = useEventImages();

  // Extraer eventos únicos de las imágenes
  const uniqueEvents = images.reduce((events: EventFromImages[], image) => {
    const existingEvent = events.find(
      (event) => event.eventId === image.eventId
    );
    if (!existingEvent) {
      events.push({
        id: image.id,
        eventId: image.eventId,
        eventTitle: image.eventTitle,
        eventDate: image.eventDate,
        imageUrls: image.imageUrls,
        uploadedByUserId: image.uploadedByUserId,
        uploadedByUserName: image.uploadedByUserName,
      });
    }
    return events;
  }, []);

  const selectedEvent = selectedEventId
    ? uniqueEvents.find((event) => event.eventId === selectedEventId)
    : null;

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowUploader(false);
    clearError();
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setShowUploader(false);
    clearError();
  };

  const handleUploadComplete = async (files: File[]) => {
    if (selectedEventId) {
      await uploadImages(files, selectedEventId);
      setShowUploader(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      await deleteImage(imageId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mostrar error global si existe
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-600 mr-3" size={24} />
            <h3 className="text-lg font-medium text-red-900">Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchImages();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    const eventImages = getEventImages(selectedEventId!);

    return (
      <div className="space-y-6">
        {/* Header del evento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToEvents}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              disabled={uploading}
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver a mis eventos
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={uploading}
              >
                {viewMode === "grid" ? "Lista" : "Cuadrícula"}
              </button>
              <button
                onClick={() => setShowUploader(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                <span>{uploading ? "Subiendo..." : "Subir Imágenes"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEvent.eventTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(selectedEvent.eventDate)}</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>Creado por: {selectedEvent.uploadedByUserName}</span>
                </div>
                <div className="flex items-center">
                  <ImageIcon size={16} className="mr-2" />
                  <span>
                    {eventImages.reduce(
                      (total, img) => total + img.imageUrls.length,
                      0
                    )}{" "}
                    imágenes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso de subida */}
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Loader2
                  className="animate-spin text-blue-600 mr-2"
                  size={16}
                />
                <span className="text-blue-900 font-medium">
                  Subiendo imágenes...
                </span>
              </div>
              {Object.entries(uploadProgress).map(([fileIndex, progress]) => (
                <div key={fileIndex} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-sm text-blue-700 mb-1">
                    <span>Imagen {parseInt(fileIndex) + 1}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de subida de imágenes */}
        {showUploader && (
          <ImageUploader
            eventId={selectedEvent.eventId}
            onClose={() => setShowUploader(false)}
            onUploadComplete={handleUploadComplete}
            disabled={uploading}
          />
        )}

        {/* Galería de imágenes */}
        <ImageGallery
          eventId={selectedEvent.eventId}
          images={eventImages}
          viewMode={viewMode}
          onDelete={handleDeleteImage}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Imágenes
        </h1>
        <p className="text-gray-600 mt-1">
          Administra las imágenes de tus eventos
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2
            className="animate-spin mx-auto text-blue-600 mb-4"
            size={48}
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cargando eventos...
          </h3>
        </div>
      )}

      {/* Lista de eventos */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Mis Eventos
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Selecciona un evento para gestionar sus imágenes
                </p>
              </div>
              <button
                onClick={fetchImages}
                className="text-blue-600 hover:text-blue-700 px-3 py-1 text-sm transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {uniqueEvents.map((event) => {
              const eventImages = getEventImages(event.eventId);
              const totalImages = eventImages.reduce(
                (total, img) => total + img.imageUrls.length,
                0
              );

              return (
                <div
                  key={event.eventId}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleEventSelect(event.eventId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {event.eventTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          <span>{event.uploadedByUserName}</span>
                        </div>
                        <div className="flex items-center">
                          <ImageIcon size={14} className="mr-1" />
                          <span>{totalImages} imágenes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Completado
                      </span>
                      <ArrowLeft
                        size={16}
                        className="text-gray-400 rotate-180"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {uniqueEvents.length === 0 && !loading && (
            <div className="p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay eventos con imágenes
              </h3>
              <p className="text-gray-600">
                Los eventos con imágenes aparecerán aquí
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
