import { BasicInfoSection } from "../../Sections/EventForm/BasicInfoSection";

interface BasicInfoStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  isSubmitting: boolean;
}

export function BasicInfoStep({
  formData,
  onChange,
  isSubmitting,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-8">
      <BasicInfoSection formData={formData} onChange={onChange} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detalles Adicionales
        </label>
        <textarea
          name="additionalDetails"
          rows={4}
          value={formData.additionalDetails}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
          placeholder="Información adicional sobre el evento"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
