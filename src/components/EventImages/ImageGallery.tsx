import React, { useState } from "react";
import {
  Grid3X3,
  List,
  Image as ImageIcon,
  User,
  Calendar,
  Eye,
  Download,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { EventImage } from "../../services/types/EventImagesTypes";

interface ImageGalleryProps {
  eventId: string;
  images: EventImage[];
  viewMode: "grid" | "list";
  onDelete?: (imageId: string) => Promise<void>; // NUEVO: Función para eliminar
  loading?: boolean; // NUEVO: Estado de carga
}

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      <div className="max-w-4xl max-h-screen p-4">
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {currentIndex + 1} de {images.length}
        </span>
      </div>
    </div>
  );
}

export default function ImageGallery({
  eventId,
  images,
  viewMode,
  onDelete,
  loading = false,
}: ImageGalleryProps) {
  const [selectedImageSet, setSelectedImageSet] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageClick = (imageUrls: string[], imageIndex: number) => {
    setSelectedImageSet({ images: imageUrls, index: imageIndex });
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Error descargando la imagen");
    }
  };

  const handleDelete = async (imageSetId: string) => {
    if (!onDelete) return;

    if (
      window.confirm("¿Estás seguro de que quieres eliminar estas imágenes?")
    ) {
      try {
        setDeletingId(imageSetId);
        await onDelete(imageSetId);
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error eliminando las imágenes");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredImages = images.filter((imageSet) => {
    if (filter === "mine") {
      // TODO: Aquí filtrarías por el usuario actual
      return true; // Por ahora mostrar todas
    }
    return true;
  });

  const totalImages = filteredImages.reduce(
    (total, imageSet) => total + imageSet.imageUrls.length,
    0
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Loader2
          className="animate-spin mx-auto text-blue-600 mb-4"
          size={48}
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cargando imágenes...
        </h3>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Galería de Imágenes ({totalImages} imágenes)
            </h2>
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "mine")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las imágenes</option>
                <option value="mine">Mis imágenes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de conjuntos de imágenes */}
        <div className="space-y-4">
          {filteredImages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay imágenes disponibles
              </h3>
              <p className="text-gray-600">
                Las imágenes aparecerán aquí una vez que se suban al evento
              </p>
            </div>
          ) : (
            filteredImages.map((imageSet) => (
              <div
                key={imageSet.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {imageSet.uploadedByUserName}
                      </span>
                      <Calendar size={16} className="text-gray-400 ml-4 mr-2" />
                      <span className="text-gray-600 text-sm">
                        {formatDate(imageSet.eventDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(imageSet.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        title="Eliminar conjunto de imágenes"
                        disabled={deletingId === imageSet.id}
                      >
                        {deletingId === imageSet.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid de imágenes dentro del conjunto */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {imageSet.imageUrls.map((imageUrl, imageIndex) => (
                    <div key={imageIndex} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Imagen ${imageIndex + 1} de ${
                          imageSet.uploadedByUserName
                        }`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() =>
                          handleImageClick(imageSet.imageUrls, imageIndex)
                        }
                      />

                      {/* Overlay con acciones */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(imageSet.imageUrls, imageIndex);
                            }}
                            className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                            title="Ver imagen"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(imageUrl);
                            }}
                            className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                            title="Descargar imagen"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visor de imágenes modal */}
        {selectedImageSet && (
          <ImageViewer
            images={selectedImageSet.images}
            initialIndex={selectedImageSet.index}
            onClose={() => setSelectedImageSet(null)}
          />
        )}
      </div>
    );
  }

  // Vista de cuadrícula
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Galería de Imágenes ({totalImages} imágenes)
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "mine")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las imágenes</option>
              <option value="mine">Mis imágenes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de imágenes */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay imágenes disponibles
          </h3>
          <p className="text-gray-600">
            Las imágenes aparecerán aquí una vez que se suban al evento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredImages.flatMap((imageSet) =>
            imageSet.imageUrls.map((imageUrl, imageIndex) => (
              <div
                key={`${imageSet.id}-${imageIndex}`}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={`Imagen de ${imageSet.uploadedByUserName}`}
                    className="w-full h-40 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() =>
                      handleImageClick(imageSet.imageUrls, imageIndex)
                    }
                  />

                  {/* Overlay con información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white text-xs mb-2">
                        <div className="flex items-center mb-1">
                          <User size={12} className="mr-1" />
                          <span>{imageSet.uploadedByUserName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span>{formatDate(imageSet.eventDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(imageSet.imageUrls, imageIndex);
                      }}
                      className="bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white transition-colors shadow-sm"
                      title="Ver imagen"
                    >
                      <ZoomIn size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(imageUrl);
                      }}
                      className="bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white transition-colors shadow-sm"
                      title="Descargar imagen"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Visor de imágenes modal */}
      {selectedImageSet && (
        <ImageViewer
          images={selectedImageSet.images}
          initialIndex={selectedImageSet.index}
          onClose={() => setSelectedImageSet(null)}
        />
      )}
    </div>
  );
}
