interface EventImageProps {
  imageUrl?: string;
  title: string;
}

export function EventImage({ imageUrl, title }: EventImageProps) {
  if (!imageUrl) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
    </div>
  );
}
