import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: "info" | "success" | "warning" | "error" | "confirm";
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
  showCloseButton = true,
}: ModalProps) {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Colores según el tipo
  const typeStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "bg-yellow-100",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
    },
    confirm: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "bg-gray-100",
      iconColor: "text-gray-600",
      titleColor: "text-gray-900",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${styles.border}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${styles.titleColor}`}>
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
