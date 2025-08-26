export const getStatusColor = (status: string): string => {
  switch (status) {
    case "published":
    case "upcoming":
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Borrador";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    case "upcoming":
      return "Próximo";
    case "confirmed":
      return "Confirmado";
    default:
      return status || "Sin estado";
  }
};
