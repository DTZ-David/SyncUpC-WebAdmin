import Modal from "./Modal";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  confirmText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "Aceptar",
}: AlertModalProps) {
  const icons = {
    info: <Info size={48} className="text-blue-600" />,
    success: <CheckCircle size={48} className="text-green-600" />,
    warning: <AlertCircle size={48} className="text-yellow-600" />,
    error: <XCircle size={48} className="text-red-600" />,
  };

  const buttonStyles = {
    info: "bg-blue-500 hover:bg-blue-600",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    error: "bg-red-500 hover:bg-red-600",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} type={type}>
      <div className="text-center">
        <div className="flex justify-center mb-4">{icons[type]}</div>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${buttonStyles[type]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}