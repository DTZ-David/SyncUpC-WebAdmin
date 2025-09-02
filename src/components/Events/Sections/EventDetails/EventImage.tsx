interface EventImageProps {
  imageUrl?: string;
  title: string;
}

export function EventImage({ imageUrl, title }: EventImageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <img
        src={imageUrl || "/logo.svg"} // 👈 Fallback si no hay imagen
        alt={title || "Evento sin título"}
        className="w-full h-64 md:h-96 object-contain bg-white"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = "/logo.svg"; // 👈 Fallback si la URL falla
        }}
      />
    </div>
  );
}
