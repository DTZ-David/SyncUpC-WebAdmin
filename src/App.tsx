import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import EventList from "./components/Events/EventList";
import EventForm from "./components/Events/EventForm";
import AttendeeList from "./components/Attendees/AttendeeList";
import EventDetails from "./components/Events/EventDetails";
import StaffManagement from "./components/Staff/StaffManagement";
import { authService } from "./services/api/authService";
import { eventService } from "./services/api/eventService";

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
        alert(response.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión");
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

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        const response = await eventService.deleteEvent(eventId);

        if (response.isSuccess) {
          alert("Evento eliminado correctamente");
          // Volver a la lista de eventos después de eliminar
          setViewingEventDetails(null);
          setActiveTab("events");
        } else {
          throw new Error(response.message || "Error al eliminar el evento");
        }
      } catch (error: any) {
        console.error("Error deleting event:", error);
        alert(error.message || "Error al eliminar el evento");
      }
    }
  };

  // Show authentication forms if not authenticated
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
      return (
        <AttendeeList
          eventId={viewingEventAttendees}
          onBack={handleBackFromAttendees}
        />
      );
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
      case "staff":
        return <StaffManagement />;
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Configuración
              </h1>
              <p className="text-gray-600">
                Gestiona la configuración de tu aplicación
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                Panel de configuración próximamente...
              </p>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            onViewEventDetails={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        );
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
    </div>
  );
}

export default App;
