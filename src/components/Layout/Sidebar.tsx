import {
  LayoutDashboard,
  Calendar,
  Users,
  UserPlus,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "attendees", label: "Asistentes", icon: Users },
    { id: "staff", label: "Personal Admin", icon: UserPlus },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">SyncUpC Admin</h1>
        </div>

        <nav className="mt-6">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleMenuClick(id)}
              className={`
                w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                ${
                  activeTab === id
                    ? "bg-green-50 border-r-3 border-green-500 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }
              `}
              style={
                activeTab === id
                  ? {
                      backgroundColor: "#B9FF5020",
                      borderRightColor: "#B9FF50",
                      color: "#B9FF50",
                    }
                  : {}
              }
            >
              <Icon size={20} className="mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
