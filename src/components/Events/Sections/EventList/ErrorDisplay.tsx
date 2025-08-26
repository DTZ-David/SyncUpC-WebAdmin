import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-3" size={24} />
        <div>
          <h3 className="text-red-800 font-medium">
            Error al cargar los eventos
          </h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={onRetry}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
