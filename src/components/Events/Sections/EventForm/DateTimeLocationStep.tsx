import React from "react";
import { DateTimeInfoSection } from "../../Sections/EventForm/DateTimeInfoSection";
import { LocationInfoSection } from "../../Sections/EventForm/LocationInfoSection";
import { VirtualEventSection } from "../../Sections/EventForm/VirtualEventSection";
import { Campus, Space } from "../../../../services/types/EventTypes";

interface DateTimeLocationStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  campuses: Campus[];
  availableSpaces: Space[];
  isLoadingMetadata: boolean;
  onCampusChange: (campusId: string) => void;
  onSpaceChange: (spaceId: string) => void;
}

export function DateTimeLocationStep({
  formData,
  onChange,
  campuses,
  availableSpaces,
  isLoadingMetadata,
  onCampusChange,
  onSpaceChange,
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
          <LocationInfoSection
            formData={formData}
            campuses={campuses}
            availableSpaces={availableSpaces}
            isLoadingMetadata={isLoadingMetadata}
            onCampusChange={onCampusChange}
            onSpaceChange={onSpaceChange}
          />
          <VirtualEventSection formData={formData} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
