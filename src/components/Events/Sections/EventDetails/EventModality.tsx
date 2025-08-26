import { Globe } from "lucide-react";

interface EventModalityProps {
  isVirtual: boolean;
  meetingUrl?: string;
}

export function EventModality({ isVirtual, meetingUrl }: EventModalityProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Modalidad</h3>
      <div className="flex items-center space-x-3">
        <Globe className="text-gray-400" size={20} />
        <div>
          <p className="font-medium text-gray-900">
            {isVirtual ? "Virtual" : "Presencial"}
          </p>
          {isVirtual && meetingUrl && (
            <a
              href={meetingUrl}
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
  );
}
