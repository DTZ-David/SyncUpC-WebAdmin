import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "./hooks/useAuth";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { login, isLoading, error, success, user, clearError } = useAuth();

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Limpiar errores cuando el usuario empiece a escribir
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  // Si el login es exitoso, llamar a onLogin
  useEffect(() => {
    if (success && user) {
      onLogin(formData.email, formData.password);
    }
  }, [success, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Mostrar mensaje de éxito
  if (success && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido/a!
          </h2>
          <p className="text-gray-600 mb-2">Hola {user.name}</p>
          <p className="text-sm text-gray-500 mb-6">Rol: {user.role}</p>
          <div className="animate-pulse text-gray-500">Redirigiendo...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Green Background with Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div
              className={`transition-all duration-1000 ease-out ${
                animationComplete
                  ? "transform translate-y-0 opacity-100 flex items-center justify-center space-x-4"
                  : "transform translate-y-8 opacity-0"
              }`}
            >
              {/* Logo SVG */}
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-black opacity-50"></div>

              {/* Brand Text */}
              <div className="text-left">
                <h1 className="text-4xl font-bold text-black">SyncUpC</h1>
                <p className="text-xl text-black opacity-90 mt-1">
                  Gestiona tus eventos de manera profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SyncUpC</h1>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600">
                Inicia sesión para gestionar tus eventos
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle
                  className="text-red-500 mr-3 flex-shrink-0"
                  size={20}
                />
                <div className="text-red-700">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Ingresa tu correo"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Ingresa tu contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={onSwitchToRegister}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Crear Cuenta
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
