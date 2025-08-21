// src/components/Auth/RegisterForm/components/NotificationPreferences.tsx

import React from "react";
import { NotificationPreferences as NotificationPrefsType } from "../Auth/types";

interface NotificationPreferencesProps {
  preferences: NotificationPrefsType;
  onChange: (preferences: NotificationPrefsType) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onChange,
}) => {
  const updatePreference = (
    category: keyof NotificationPrefsType,
    channel: "push" | "email" | "whatsApp",
    value: boolean
  ) => {
    const newPreferences = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [channel]: value,
      },
    };
    onChange(newPreferences);
  };

  const categories = [
    { key: "eventReminder" as const, label: "Recordatorios de Eventos" },
    { key: "eventUpdate" as const, label: "Actualizaciones de Eventos" },
    { key: "forumReply" as const, label: "Respuestas en Foros" },
    { key: "forumMention" as const, label: "Menciones en Foros" },
  ];

  const channels = [
    { key: "push" as const, label: "Push" },
    { key: "email" as const, label: "Email" },
    { key: "whatsApp" as const, label: "WhatsApp" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Preferencias de Notificación
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        {categories.map((category) => (
          <div key={category.key} className="mb-4 last:mb-0">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {category.label}
            </h4>
            <div className="flex space-x-4">
              {channels.map((channel) => (
                <label key={channel.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences[category.key][channel.key]}
                    onChange={(e) =>
                      updatePreference(
                        category.key,
                        channel.key,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {channel.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;
