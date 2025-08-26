import { DateTimeInfoSection } from "../../Sections/EventForm/DateTimeInfoSection";
import { LocationInfoSection } from "../../Sections/EventForm/LocationInfoSection";
import { VirtualEventSection } from "../../Sections/EventForm/VirtualEventSection";

interface DateTimeLocationStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export function DateTimeLocationStep({
  formData,
  onChange,
}: DateTimeLocationStepProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DateTimeInfoSection
          formData={formData}
          onChange={onChange}
          showRegistrationDates={formData.requiresRegistration}
        />

        <div className="space-y-6">
          <LocationInfoSection formData={formData} onChange={onChange} />
          <VirtualEventSection formData={formData} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
