import { MapPin } from "lucide-react";

interface EventLocationProps {
  address?: string;
  eventLocation?: string;
}

export function EventLocation({ address, eventLocation }: EventLocationProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Ubicación</h3>
      <div className="flex items-start space-x-3">
        <MapPin className="text-gray-400 mt-1" size={20} />
        <div>
          {address && (
            <p className="font-medium text-gray-900 mb-1">{address}</p>
          )}
          {eventLocation && <p className="text-gray-600">{eventLocation}</p>}
          {!address && eventLocation && (
            <p className="font-medium text-gray-900">{eventLocation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
