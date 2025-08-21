import React from "react";
import { LogOut, User, Bell } from "lucide-react";

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  // 🔍 DEBUG: Console log para ver qué datos llegan
  console.log("🔍 Header - User data:", user);
  console.log("🔍 Header - User type:", typeof user);
  console.log("🔍 Header - User keys:", user ? Object.keys(user) : "No user");

  // Extraer datos del usuario de forma segura
  const userName = user?.name || "Usuario";
  const userRole = user?.role || "staff";
  const userEmail = user?.email || "";
  const profilePicture = user?.profilePicture || user?.profilePhotoUrl;

  // 🔍 DEBUG: Console log de datos procesados
  console.log("🔍 Header - Processed data:", {
    userName,
    userRole,
    userEmail,
    profilePicture,
    hasProfilePicture: !!profilePicture,
  });

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido de nuevo, {userName}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            {/* Badge de notificaciones (opcional) */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* Avatar del usuario */}
              <div className="relative">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                    onError={(e) => {
                      console.log(
                        "🔍 Header - Image load error, using fallback"
                      );
                      // Si la imagen falla, mostrar el fallback
                    }}
                  />
                ) : null}

                {/* Fallback cuando no hay imagen o falla la carga */}
                <div
                  className={`w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ${
                    profilePicture ? "hidden" : "flex"
                  }`}
                  style={{ display: profilePicture ? "none" : "flex" }}
                >
                  <span className="text-white text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-600 capitalize">{userRole}</p>
                {/* Email opcional (solo si hay espacio) */}
                {userEmail && (
                  <p className="text-xs text-gray-500 hidden lg:block truncate max-w-32">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                console.log("🔍 Header - Logout clicked");
                onLogout();
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cerrar Sesión
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
