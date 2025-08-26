import { TargetAudienceSection } from "../../Sections/EventForm/TargetAudienceSection";
import { EventSettingsSection } from "../../Sections/EventForm/EventSettingsSection";
import { CareerSelectionSection } from "../../Sections/EventForm/CareerSelectionSection";
import { RegistrationTimeSection } from "../../Sections/EventForm/RegistrationTimeSection";
interface AudienceConfigStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCareerChange: (careerIds: string[]) => void; // ← CORREGIDO: Ahora acepta array de strings
  isSubmitting: boolean;
}

export function AudienceConfigStep({
  formData,
  onChange,
  onCareerChange,
  isSubmitting,
}: AudienceConfigStepProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TargetAudienceSection formData={formData} onChange={onChange} />
          <EventSettingsSection formData={formData} onChange={onChange} />
        </div>

        <div className="space-y-6">
          <CareerSelectionSection
            formData={formData}
            onChange={onCareerChange}
            disabled={isSubmitting}
          />

          {formData.requiresRegistration && (
            <RegistrationTimeSection
              formData={formData}
              onChange={onChange}
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
