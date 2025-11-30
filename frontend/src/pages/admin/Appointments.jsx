import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { CalendarIcon, MagnifyingGlassIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    confirmed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [pagination.current_page, searchTerm, selectedStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAppointments({
        page: pagination.current_page,
        search: searchTerm,
        status: selectedStatus || 'all',
      });
      const appointmentData = response.data.data || [];
      setAppointments(appointmentData);
      setPagination({
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        total: response.data.total || 0,
      });

      // Calculate stats
      calculateStats(appointmentData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load appointments';
      toast.error(errorMsg);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const todayCount = data.filter(apt => apt.appointment_date?.split('T')[0] === today).length;
    const weekCount = data.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= new Date() && aptDate <= weekFromNow;
    }).length;
    const confirmedCount = data.filter(apt => apt.status === 'confirmed' || apt.status === 'approved').length;
    const pendingCount = data.filter(apt => apt.status === 'pending').length;

    setStats({
      today: todayCount,
      week: weekCount,
      confirmed: confirmedCount,
      pending: pendingCount
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Appointment Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor all appointments across doctors</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Today's Appointments", value: stats.today, icon: CalendarIcon, color: 'bg-[#1ABC9C]' },
          { label: 'This Week', value: stats.week, icon: CalendarIcon, color: 'bg-cyan-500' },
          { label: 'Confirmed', value: stats.confirmed, icon: CalendarIcon, color: 'bg-[#2ECC71]' },
          { label: 'Pending', value: stats.pending, icon: CalendarIcon, color: 'bg-amber-500' },
        ].map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full transition-all duration-300 hover:scale-110`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 animate-fade-in-up">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search appointments by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] transition-all duration-300"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Appointments List */}
      {loading ? (
        <Loading />
      ) : appointments.length === 0 ? (
        <Card className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments found</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {appointments.map((appointment, index) => (
              <Card 
                key={appointment.id} 
                className="hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{appointment.client?.name || 'N/A'}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>{appointment.doctor?.name || 'N/A'}</span>
                    </div>
                  </div>
                  <Badge status={getStatusColor(appointment.status)} className="capitalize">
                    {appointment.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{appointment.start_time || 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Reason: </span>
                    {appointment.reason || 'No reason specified'}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <Card className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{appointments.length}</span> of <span className="font-semibold">{pagination.total}</span> appointments
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
