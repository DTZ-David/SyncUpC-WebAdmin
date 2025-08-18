import { useState } from "react";
import { Search, Download, Mail, Phone, ArrowLeft, Filter } from "lucide-react";

interface Attendee {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "confirmed" | "pending" | "cancelled";
  avatar: string;
}

interface AttendeeListProps {
  eventId?: number;
  onBack?: () => void;
}

export default function AttendeeList({ eventId, onBack }: AttendeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const attendees: Attendee[] = [
    {
      id: 1,
      name: "Maria Gonzales",
      email: "maria@example.com",
      phone: "+1 (555) 123-4567",
      registrationDate: "2024-12-15",
      status: "confirmed",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      email: "carlos@example.com",
      phone: "+1 (555) 234-5678",
      registrationDate: "2024-12-14",
      status: "confirmed",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 3,
      name: "Ana Martinez",
      email: "ana@example.com",
      phone: "+1 (555) 345-6789",
      registrationDate: "2024-12-13",
      status: "pending",
      avatar:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 4,
      name: "Luis Santos",
      email: "luis@example.com",
      phone: "+1 (555) 456-7890",
      registrationDate: "2024-12-12",
      status: "confirmed",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || attendee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportToExcel = () => {
    // In a real application, you would use a library like xlsx to generate the Excel file
    console.log("Exporting attendees to Excel...");
    alert("Excel export functionality would be implemented here");
  };

  const getStatusColor = (status: Attendee["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-lime-100 text-lime-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {eventId ? "Event Attendees" : "All Attendees"}
            </h1>
            <p className="text-gray-600">
              {eventId
                ? "Manage attendees for this specific event"
                : "View and manage all event attendees"}
            </p>
          </div>
        </div>
        <button
          onClick={handleExportToExcel}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export to Excel</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {attendees.filter((a) => a.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {attendees.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {attendees.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Attendee
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Registration Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr
                  key={attendee.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {attendee.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{attendee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{attendee.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(attendee.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        attendee.status
                      )}`}
                    >
                      {attendee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-lime-600 hover:text-lime-700 text-sm"
                        onClick={() => window.open(`mailto:${attendee.email}`)}
                      >
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
