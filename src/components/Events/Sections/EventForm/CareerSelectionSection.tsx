// components/Events/Sections/CareerSelectionSection.tsx
import React, { useState, useEffect } from "react";
import { EventFormData } from "../../Types/EventTypes";
import { careerService, Career } from "../../../../services/api/careerService";

interface CareerSelectionSectionProps {
  formData: EventFormData;
  onChange: (careerIds: string[]) => void;
  disabled?: boolean;
}

export const CareerSelectionSection: React.FC<CareerSelectionSectionProps> = ({
  formData,
  onChange,
  disabled = false,
}) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await careerService.getAllCareers();

      if (response.isSuccess) {
        setCareers(response.data);
      } else {
        setError("Error al cargar las carreras");
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar las carreras");
    } finally {
      setLoading(false);
    }
  };

  const handleCareerChange = (careerId: string, isChecked: boolean) => {
    const currentCareerIds = formData.careerIds || [];

    let updatedCareerIds: string[];

    if (isChecked) {
      updatedCareerIds = [...currentCareerIds, careerId];
    } else {
      updatedCareerIds = currentCareerIds.filter((id) => id !== careerId);
    }

    onChange(updatedCareerIds);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          Carreras Dirigidas
        </h3>
        <div className="flex items-center justify-center py-4">
          <div className="text-gray-500">Cargando carreras...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          Carreras Dirigidas
        </h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
          <p className="text-sm">{error}</p>
          <button
            onClick={loadCareers}
            className="text-red-800 underline hover:no-underline text-sm mt-1"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">Carreras Dirigidas</h3>
      <p className="text-sm text-gray-600">
        Selecciona las carreras a las que va dirigido el evento (opcional)
      </p>

      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {careers.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay carreras disponibles</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {careers.map((career) => (
              <label
                key={career.id}
                className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.careerIds?.includes(career.id) || false}
                  onChange={(e) =>
                    handleCareerChange(career.id, e.target.checked)
                  }
                  disabled={disabled}
                  className="mt-0.5 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700">{career.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {formData.careerIds && formData.careerIds.length > 0 && (
        <p className="text-sm text-gray-600">
          {formData.careerIds.length} carrera(s) seleccionada(s)
        </p>
      )}
    </div>
  );
};
