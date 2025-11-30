import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { 
  CalendarIcon, 
  ClockIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { doctorAPI } from '../../api';
import toast from 'react-hot-toast';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data.data || response.data || []);
    } catch (error) {
      console.error('Appointments error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await doctorAPI.updateAppointmentStatus(id, { status });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total', count: appointments.length, color: 'bg-[#3498DB]' },
    { label: 'Approved', count: appointments.filter(a => a.status === 'approved').length, color: 'bg-green-500' },
    { label: 'Pending', count: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-purple-500' },
  ];

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Appointments</h1>
        <p className="text-gray-600 mt-1">Manage your appointment schedule and patient visits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 animate-fade-in-up animate-delay-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by patient name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.length > 0 ? filteredAppointments.map((appointment, index) => (
          <Card 
            key={appointment.id} 
            className="animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] p-3 rounded-xl">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{appointment.client?.name || 'Unknown Patient'}</h3>
                  <p className="text-sm text-gray-500">{appointment.client?.email || 'No email'}</p>
                  {appointment.client?.phone && (
                    <p className="text-xs text-gray-500">{appointment.client.phone}</p>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                appointment.status === 'approved' ? 'bg-green-100 text-green-700' :
                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                appointment.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                appointment.status === 'declined' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {appointment.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarIcon className="h-5 w-5 text-[#1ABC9C]" />
                <span className="font-medium">{appointment.appointment_date || 'No date set'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ClockIcon className="h-5 w-5 text-cyan-500" />
                <span>{appointment.start_time && appointment.end_time ? `${appointment.start_time} - ${appointment.end_time}` : 'No time set'}</span>
              </div>
              {appointment.reason && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                </div>
              )}
            </div>

            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && appointment.status !== 'declined' && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {appointment.status === 'pending' && (
                  <>
                    <Button 
                      variant="success" 
                      onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleStatusUpdate(appointment.id, 'declined')}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Decline
                    </Button>
                  </>
                )}
                {appointment.status === 'approved' && (
                  <Button 
                    variant="primary" 
                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
            )}
          </Card>
        )) : (
          <div className="col-span-2">
            <Card>
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No appointments found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
