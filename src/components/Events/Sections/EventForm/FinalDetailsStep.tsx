import { TagsInput } from "../../Sections/EventForm/TagsInput";
import { ImageUpload } from "../../Sections/EventForm/ImageUpload";

interface FinalDetailsStepProps {
  formData: any;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void; // Cambiado de (index: number) a (tag: string)
  onImageUpload: (files: FileList | null) => void; // Cambiado de (file: File) a (files: FileList | null)
  currentImage: string | undefined; // Cambiado de string | null a string | undefined
  isEditMode: boolean;
}

export function FinalDetailsStep({
  formData,
  onAddTag,
  onRemoveTag,
  onImageUpload,
  currentImage,
  isEditMode,
}: FinalDetailsStepProps) {
  return (
    <div className="space-y-8" onKeyDown={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TagsInput
            tags={formData.tags}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <ImageUpload
            onImageUpload={onImageUpload}
            currentImage={currentImage}
            isEditing={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}
