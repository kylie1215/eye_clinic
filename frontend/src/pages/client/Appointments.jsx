import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { 
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  UserIcon,
  XCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from '../../api';

export default function ClientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    doctor_id: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await clientAPI.getAppointments();
      const data = response.data.data || response.data || [];
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error('Appointments error:', error);
      toast.error('Failed to load appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await clientAPI.getDoctors();
      const doctorsList = response.data.doctors || [];
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Doctors error:', error);
      toast.error('Failed to load doctors');
    }
  };

  useEffect(() => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [statusFilter, searchTerm, appointments]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-[#E8F8F5] text-[#3498DB]',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      declined: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate end_time (1 hour after start_time)
      const [hours, minutes] = bookingForm.start_time.split(':');
      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
      const end_time = `${endHour}:${minutes}`;

      const appointmentData = {
        doctor_id: parseInt(bookingForm.doctor_id),
        appointment_date: bookingForm.appointment_date,
        start_time: bookingForm.start_time,
        end_time: end_time,
        reason: bookingForm.reason
      };

      await clientAPI.createAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      setBookingForm({ doctor_id: '', appointment_date: '', start_time: '', end_time: '', reason: '' });
      fetchAppointments(); // Refresh appointments list
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await clientAPI.cancelAppointment(appointmentId);
        toast.success('Appointment cancelled');
        fetchAppointments(); // Refresh appointments list
      } catch (error) {
        console.error('Cancel error:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const stats = [
    { 
      label: 'Total Appointments', 
      value: appointments.length, 
      icon: CalendarIcon,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Upcoming', 
      value: appointments.filter(a => a.status === 'approved' || a.status === 'pending').length, 
      icon: ClockIcon,
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Completed', 
      value: appointments.filter(a => a.status === 'completed').length, 
      icon: CheckCircleIcon,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Cancelled', 
      value: appointments.filter(a => a.status === 'cancelled').length, 
      icon: XCircleIcon,
      color: 'from-red-500 to-red-600'
    },
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your eye care appointments</p>
        </div>
        <Button 
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5" />
          Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'approved', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animate-delay-100">
          {filteredAppointments.map((appointment, index) => (
            <Card 
              key={appointment.id} 
              className="animate-slide-in-right hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] p-3 rounded-xl">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-gray-900">{appointment.doctor?.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.doctor?.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                  {appointment.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarIcon className="h-5 w-5 text-[#1ABC9C]" />
                  <span className="font-medium">{appointment.appointment_date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ClockIcon className="h-5 w-5 text-green-500" />
                  <span>{appointment.start_time} - {appointment.end_time}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg mt-3">
                  <p className="text-sm text-gray-600 font-medium">Reason:</p>
                  <p className="text-gray-900">{appointment.reason}</p>
                </div>
              </div>

              {(appointment.status === 'pending' || appointment.status === 'approved') && (
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]">
                    Reschedule
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="animate-fade-in-up">
          <div className="text-center py-12">
            <CalendarIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No appointments found</p>
            <p className="text-sm text-gray-500 mt-2">Book your first appointment to get started!</p>
            <Button 
              onClick={() => setShowBookingModal(true)}
              className="mt-6 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Book Appointment
            </Button>
          </div>
        </Card>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book New Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                <select
                  value={bookingForm.doctor_id}
                  onChange={(e) => setBookingForm({...bookingForm, doctor_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                <input
                  type="date"
                  value={bookingForm.appointment_date}
                  onChange={(e) => setBookingForm({...bookingForm, appointment_date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                <select
                  value={bookingForm.start_time}
                  onChange={(e) => setBookingForm({...bookingForm, start_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                  placeholder="Describe your concern..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]">
                  Book Appointment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
