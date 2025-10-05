import { LogOut } from "lucide-react";

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  // Extraer datos del usuario de forma segura
  const userName = user?.name || "Usuario";
  const userRole = user?.role || "staff";
  const userEmail = user?.email || "";
  const profilePicture = user?.profilePicture || user?.profilePhotoUrl;

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido de nuevo, {userName}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* Avatar del usuario */}
              <div className="relative">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                    onError={(e) => {
                      // Si la imagen falla, ocultar el elemento img
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}

                {/* Fallback cuando no hay imagen o falla la carga */}
                <div
                  className={`w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ${
                    profilePicture ? "absolute inset-0" : ""
                  }`}
                  style={{ 
                    display: profilePicture ? "none" : "flex",
                    zIndex: profilePicture ? -1 : 1
                  }}
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
                {/* Email opcional (solo si hay espacio y email existe) */}
                {userEmail && (
                  <p className="text-xs text-gray-500 hidden lg:block truncate max-w-40">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Cerrar Sesión
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}