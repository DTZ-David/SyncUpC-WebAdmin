import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import EventList from "./components/Events/ui/EventList";
import EventForm from "./components/Events/ui/EventForm";
import AttendeeList from "./components/Attendees/AttendeeList";
import Metrics from "./components/Metrics/Metric";
import EventDetails from "./components/Events/ui/EventDetails";
import { authService } from "./services/api/authService";
import { eventService } from "./services/api/eventService";
import EventImagesManager from "./components/EventImages/EventImagesManager";
import AlertModal from "./components/shared/AlertModal";
import ConfirmModal from "./components/shared/ConfirmModal";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEventAttendees, setViewingEventAttendees] = useState<
    number | null
  >(null);
  const [viewingEventDetails, setViewingEventDetails] = useState<any>(null);

  // Estados para los modales
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "error" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: () => {},
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (response.isSuccess && response.data) {
        // Obtiene el usuario guardado en localStorage
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } else {
        setAlertModal({
          isOpen: true,
          title: "Error de Autenticación",
          message: response.message || "Credenciales inválidas",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      setAlertModal({
        isOpen: true,
        title: "Error de Conexión",
        message: "No se pudo conectar con el servidor. Por favor, intenta nuevamente.",
        type: "error",
      });
    }
  };

  const handleRegister = (userData: any) => {
    // In a real app, you would send this data to your backend
    const newUser = {
      id: Date.now(),
      ...userData,
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab("dashboard");
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleViewAttendees = (eventId: number) => {
    setViewingEventAttendees(eventId);
    setActiveTab("attendees");
  };

  const handleBackFromAttendees = () => {
    setViewingEventAttendees(null);
    setActiveTab("events");
  };

  const handleViewEventDetails = (event: any) => {
    setViewingEventDetails(event);
    // No cambiar activeTab para mantener la navegación activa
  };

  const handleBackFromEventDetails = () => {
    setViewingEventDetails(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirmar Eliminación",
      message: "¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.",
      type: "error",
      onConfirm: async () => {
        try {
          const response = await eventService.deleteEvent(eventId);

          if (response.isSuccess) {
            setAlertModal({
              isOpen: true,
              title: "Evento Eliminado",
              message: "El evento ha sido eliminado correctamente",
              type: "success",
            });
            // Volver a la lista de eventos después de eliminar
            setViewingEventDetails(null);
            setActiveTab("events");
          } else {
            throw new Error(response.message || "Error al eliminar el evento");
          }
        } catch (error: any) {
          console.error("Error deleting event:", error);
          setAlertModal({
            isOpen: true,
            title: "Error al Eliminar",
            message: error.message || "No se pudo eliminar el evento. Intenta nuevamente.",
            type: "error",
          });
        }
      },
    });
  };

  if (!isAuthenticated) {
    if (authMode === "login") {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode("register")}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }
  }

  const renderMainContent = () => {
    if (viewingEventAttendees) {
      return <AttendeeList onBack={handleBackFromAttendees} />;
    }

    if (viewingEventDetails) {
      return (
        <EventDetails
          event={viewingEventDetails}
          onBack={handleBackFromEventDetails}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard onViewEventDetails={handleViewEventDetails} />;
      case "events":
        return (
          <EventList
            onCreateEvent={handleCreateEvent}
            onEditEvent={handleEditEvent}
            onViewAttendees={handleViewAttendees}
            onViewDetails={handleViewEventDetails}
          />
        );
      case "attendees":
        return <AttendeeList />;
      case "metrics":
        return <Metrics />;
      case "settings":
        return <EventImagesManager />;
      default:
        return <Dashboard onViewEventDetails={handleViewEventDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 lg:ml-64 overflow-auto">
        <Header user={currentUser} onLogout={handleLogout} />
        <div className="p-4 lg:p-8">{renderMainContent()}</div>
      </main>

      <EventForm
        isOpen={showEventForm}
        onClose={handleCloseEventForm}
        event={editingEvent}
      />

      {/* Modales */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
}

export default App;
