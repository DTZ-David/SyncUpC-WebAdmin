import React, { useState } from 'react';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/EventList';
import EventForm from './components/Events/EventForm';
import AttendeeList from './components/Attendees/AttendeeList';
import StaffManagement from './components/Staff/StaffManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEventAttendees, setViewingEventAttendees] = useState<number | null>(null);

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    // For demo purposes, we'll accept any credentials
    const userData = {
      id: 1,
      name: email === 'admin@company.com' ? 'Admin User' : 'Staff Member',
      email: email,
      role: email === 'admin@company.com' ? 'admin' : 'organizer'
    };
    
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (userData: any) => {
    // In a real app, you would send this data to your backend
    const newUser = {
      id: Date.now(),
      ...userData
    };
    
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
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
    setActiveTab('attendees');
  };

  const handleBackFromAttendees = () => {
    setViewingEventAttendees(null);
    setActiveTab('events');
  };

  // Show authentication forms if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
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

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return (
          <EventList 
            onCreateEvent={handleCreateEvent}
            onEditEvent={handleEditEvent}
            onViewAttendees={handleViewAttendees}
          />
        );
      case 'attendees':
        return <AttendeeList />;
      case 'staff':
        return <StaffManagement />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your application settings</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
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
        <div className="p-4 lg:p-8">
        {renderMainContent()}
        </div>
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