import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../../api';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import { 
  CalendarIcon, 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await doctorAPI.getDashboard();
      console.log('Doctor Dashboard API Response:', response);
      console.log('Doctor Dashboard data:', response.data);
      console.log('Doctor Stats:', response.data.stats);
      setStats(response.data);
    } catch (error) {
      console.error('Doctor Dashboard error:', error);
      toast.error('Failed to load dashboard');
      // Set default empty stats
      setStats({
        stats: {
          today_appointments: 0,
          pending_appointments: 0,
          total_patients: 0,
          prescriptions_issued: 0,
        },
        todayAppointments: [],
        upcomingAppointments: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    { 
      label: 'Today\'s Appointments', 
      value: stats?.stats?.today_appointments || 0,
      subtitle: `${stats?.todayAppointments?.length || 0} scheduled`,
      icon: CalendarIcon, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/doctor/appointments'
    },
    { 
      label: 'Total Patients', 
      value: stats?.stats?.total_patients || 0,
      subtitle: 'Unique patients',
      icon: UsersIcon, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/doctor/patients'
    },
    { 
      label: 'Pending Appointments', 
      value: stats?.stats?.pending_appointments || 0,
      subtitle: 'Awaiting confirmation',
      icon: ClockIcon, 
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      link: '/doctor/appointments'
    },
    { 
      label: 'Prescriptions (Month)', 
      value: stats?.stats?.prescriptions_issued || 0,
      subtitle: 'This month',
      icon: ClipboardDocumentCheckIcon, 
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      link: '/doctor/prescriptions'
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your schedule and patient overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="animate-scale-in cursor-pointer group" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.color} p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-105 mb-1">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Schedule */}
        <Card title="Today's Schedule" className="lg:col-span-2 animate-fade-in-up animate-delay-300">
          <div className="space-y-3">
            {stats?.todayAppointments?.length > 0 ? stats.todayAppointments.map((appointment, index) => (
              <div 
                key={appointment.id} 
                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slide-in-right border-l-4 border-blue-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] p-3 rounded-xl">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.client?.name || 'Patient'}</p>
                    <p className="text-sm text-gray-600">{appointment.reason || 'Regular Checkup'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-xs text-gray-500">{appointment.appointment_time}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No appointments scheduled for today</p>
                <p className="text-sm mt-1">Enjoy your free day!</p>
              </div>
            )}
            <Link to="/doctor/appointments" className="block text-center mt-4 text-[#1ABC9C] hover:text-[#16A085] font-medium">
              View All Appointments →
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="animate-fade-in-up animate-delay-400">
          <div className="space-y-3">
            <Link to="/doctor/prescriptions">
              <button className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">New Prescription</p>
                    <p className="text-xs text-purple-700">Create prescription</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/doctor/patients">
              <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <UsersIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C3E50]">View Patients</p>
                    <p className="text-xs text-[#1ABC9C]">Patient records</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/doctor/schedule">
              <button className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Manage Schedule</p>
                    <p className="text-xs text-green-700">Set availability</p>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card title="Recent Patients" className="animate-fade-in-up animate-delay-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.recentPatients?.length > 0 ? stats.recentPatients.slice(0, 6).map((patient, index) => (
            <div 
              key={patient.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs px-2 py-1 bg-[#E8F8F5] text-[#1ABC9C] rounded-full font-medium">
                  {patient.visit_count || 0} visits
                </span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">{patient.name}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-3 w-3" />
                  <span>{patient.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-3 w-3" />
                  <span className="truncate">{patient.email}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <UsersIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p>No recent patient data</p>
            </div>
          )}
        </div>
        {stats?.recentPatients?.length > 0 && (
          <Link to="/doctor/patients" className="block text-center mt-4 text-[#1ABC9C] hover:text-[#16A085] font-medium">
            View All Patients →
          </Link>
        )}
      </Card>
    </div>
  );
}
