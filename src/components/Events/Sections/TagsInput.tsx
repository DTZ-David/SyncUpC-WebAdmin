// components/Events/sections/TagsInput.tsx
import React, { useState } from "react";
import { X, Tag } from "lucide-react";
import { TagsInputProps } from "../Types/EventTypes";

export const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Etiquetas
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-lime-600 hover:text-lime-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Tag
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="Agregar etiqueta"
          />
        </div>
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};
