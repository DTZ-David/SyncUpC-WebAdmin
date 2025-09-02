import React from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  id: string;
  name: string;
  description?: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  required = false,
  placeholder = "Seleccionar...",
  disabled = false,
  icon,
  loading = false,
  error,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionId: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionId)
        ? currentValues.filter((id) => id !== optionId)
        : [...currentValues, optionId];
      onChange(newValues);
    } else {
      onChange(optionId);
      setIsOpen(false);
    }
  };

  const removeSelectedItem = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((id) => id !== optionId);
      onChange(newValues);
    }
  };

  const getSelectedOptions = () => {
    if (multiple && Array.isArray(value)) {
      return options.filter((option) => value.includes(option.id));
    } else if (!multiple && value) {
      return options.find((option) => option.id === value);
    }
    return null;
  };

  const selectedOptions = getSelectedOptions();
  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : !!value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative" ref={selectRef}>
        <div
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          className={`
            relative w-full px-3 py-2 border rounded-lg bg-white cursor-pointer
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-lime-500"
            }
            ${
              disabled || loading
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:border-gray-400"
            }
            ${isOpen ? "ring-2 ring-lime-500 border-transparent" : ""}
          `}
        >
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {loading ? (
                <span className="text-gray-500">Cargando...</span>
              ) : hasValue ? (
                multiple && Array.isArray(selectedOptions) ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                      <span
                        key={option.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-lime-100 text-lime-800 text-xs rounded-full"
                      >
                        {option.name}
                        <button
                          type="button"
                          onClick={(e) => removeSelectedItem(option.id, e)}
                          className="hover:bg-lime-200 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-900">
                    {selectedOptions &&
                    typeof selectedOptions === "object" &&
                    "name" in selectedOptions
                      ? selectedOptions.name
                      : placeholder}
                  </span>
                )
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>

            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !loading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No hay opciones disponibles
              </div>
            ) : (
              options.map((option) => {
                const isSelected =
                  multiple && Array.isArray(value)
                    ? value.includes(option.id)
                    : value === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}
                    className={`
                      px-3 py-2 cursor-pointer hover:bg-gray-100
                      ${
                        isSelected
                          ? "bg-lime-50 text-lime-900 font-medium"
                          : "text-gray-900"
                      }
                    `}
                  >
                    <div className="font-medium">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
