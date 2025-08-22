// components/Events/Common/ErrorDisplay.tsx
import React from "react";

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
      <p className="text-sm">{error}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      )}
    </div>
  );
};
