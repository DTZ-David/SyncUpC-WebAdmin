interface EventTargetAudienceProps {
  targetTeachers?: boolean;
  targetStudents?: boolean;
  targetAdministrative?: boolean;
  targetGeneral?: boolean;
}

export function EventTargetAudience({
  targetTeachers,
  targetStudents,
  targetAdministrative,
  targetGeneral,
}: EventTargetAudienceProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Dirigido a</h3>
      <div className="flex flex-wrap gap-2">
        {targetTeachers && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            Profesores
          </span>
        )}
        {targetStudents && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Estudiantes
          </span>
        )}
        {targetAdministrative && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            Personal Administrativo
          </span>
        )}
        {targetGeneral && (
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
            Público General
          </span>
        )}
      </div>
    </div>
  );
}
