import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Users, Eye } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  confirmed: number;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  image: string;
}

interface EventListProps {
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
  onViewAttendees: (eventId: number) => void;
}

export default function EventList({ onCreateEvent, onEditEvent, onViewAttendees }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const events: Event[] = [
    {
      id: 1,
      title: 'Summer Camp 2025 - International Discovery Week',
      date: '2025-05-05',
      time: '6:00 PM',
      location: 'Comedor Universitario, UPC Sabanas',
      attendees: 17,
      confirmed: 17,
      status: 'published',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Congreso de Innovación Tecnológica',
      date: '2025-02-14',
      time: '9:00 AM',
      location: 'Auditorio Central',
      attendees: 320,
      confirmed: 280,
      status: 'published',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Encuentro de Egresados y Mentores',
      date: '2025-01-09',
      time: '4:03 PM',
      location: 'Auditorio principal',
      attendees: 43,
      confirmed: 35,
      status: 'completed',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      title: 'Workshop de Desarrollo Web',
      date: '2025-03-15',
      time: '2:00 PM',
      location: 'Sala de Conferencias A',
      attendees: 25,
      confirmed: 20,
      status: 'draft',
      image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'published':
        return 'bg-lime-100 text-lime-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage your events and track attendance</p>
        </div>
        <button
          onClick={onCreateEvent}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Event</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="w-16">Date:</span>
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16">Location:</span>
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16">Attendees:</span>
                  <span>{event.confirmed}/{event.attendees} confirmed</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onViewAttendees(event.id)}
                  className="text-lime-600 hover:text-lime-700 flex items-center space-x-1 text-sm"
                >
                  <Users size={16} />
                  <span>View Attendees</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEditEvent(event)}
                    className="p-1.5 text-gray-600 hover:text-lime-600 rounded-lg hover:bg-lime-50 transition-colors"
                    title="Edit Event"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}