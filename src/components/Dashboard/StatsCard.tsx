import type { LucideIcon } from "lucide-react"; // <-- importa el tipo

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // ahora sí, es un tipo válido
  change?: string;
  changeType?: "increase" | "decrease";
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "increase",
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === "increase" ? "text-lime-600" : "text-red-600"
              }`}
            >
              {changeType === "increase" ? "+" : "-"}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
