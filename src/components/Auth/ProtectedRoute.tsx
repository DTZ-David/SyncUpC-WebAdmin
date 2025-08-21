// src/components/Auth/ProtectedRoute.tsx

import React, { ReactNode } from "react";
import { useAuthContext } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar el fallback
  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acceso Denegado
              </h2>
              <p className="text-gray-600 mb-6">
                Debes iniciar sesión para acceder a esta página.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sin Permisos
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Rol requerido: {requiredRole}
            <br />
            Tu rol: {user?.role}
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
