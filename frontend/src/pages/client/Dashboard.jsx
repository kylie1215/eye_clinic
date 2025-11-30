import React, { useEffect, useState } from 'react';
import { clientAPI } from '../../api';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { 
  CalendarIcon, 
  ShoppingCartIcon, 
  ClipboardDocumentListIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await clientAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    { 
      label: 'Upcoming Appointments', 
      value: stats?.stats?.upcoming_appointments || 0, 
      icon: CalendarIcon, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/client/appointments',
      change: 'This month'
    },
    { 
      label: 'Pending Orders', 
      value: stats?.stats?.pending_orders || 0, 
      icon: ShoppingCartIcon, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/client/orders',
      change: 'Processing'
    },
    { 
      label: 'Total Orders', 
      value: stats?.stats?.total_orders || 0, 
      icon: ClipboardDocumentListIcon, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/client/orders',
      change: `₱${stats?.stats?.total_spent || 0}`
    },
    { 
      label: 'Prescriptions', 
      value: stats?.stats?.prescriptions_count || 0, 
      icon: DocumentTextIcon, 
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      link: '/client/prescriptions',
      change: 'View all'
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your health and shopping overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="animate-scale-in cursor-pointer group" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-105">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <div className="space-y-3">
            {stats?.upcomingAppointments?.length > 0 ? stats.upcomingAppointments.map((appointment, index) => (
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
                    <p className="font-semibold text-gray-900">Dr. {appointment.doctor?.name || 'TBA'}</p>
                    <p className="text-sm text-gray-600">{appointment.reason || 'General Checkup'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-xs text-gray-500">{appointment.start_time} - {appointment.end_time}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#2C3E50]">{appointment.appointment_date}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                    appointment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appointment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No upcoming appointments</p>
                <Link to="/client/appointments">
                  <Button variant="primary" className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
            {stats?.upcomingAppointments?.length > 0 && (
              <Link to="/client/appointments" className="block text-center mt-4 text-[#1ABC9C] hover:text-[#16A085] font-medium">
                View All Appointments →
              </Link>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="animate-fade-in-up animate-delay-300">
          <div className="space-y-3">
            <Link to="/client/appointments">
              <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C3E50]">Book Appointment</p>
                    <p className="text-xs text-[#1ABC9C]">Schedule a visit</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/client/shop">
              <button className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <ShoppingCartIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Shop Products</p>
                    <p className="text-xs text-green-700">Browse eyewear</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/client/prescriptions">
              <button className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">View Prescriptions</p>
                    <p className="text-xs text-purple-700">Check records</p>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="Recent Orders" className="animate-fade-in-up animate-delay-400">
        <div className="space-y-3">
          {stats?.recentOrders?.length > 0 ? stats.recentOrders.slice(0, 5).map((order, index) => (
            <div 
              key={order.id} 
              className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slide-in-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-semibold text-green-600">₱{order.total}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-[#E8F8F5] text-[#3498DB]' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <Link to={`/client/orders/${order.id}`}>
                  <button className="p-2 text-[#1ABC9C] hover:bg-[#E8F8F5] rounded-lg transition-colors">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-500">
              <ClipboardDocumentListIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No orders yet</p>
              <Link to="/client/shop">
                <Button variant="primary" className="mt-4">
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
          {stats?.recentOrders?.length > 0 && (
            <Link to="/client/orders" className="block text-center mt-4 text-[#1ABC9C] hover:text-[#16A085] font-medium">
              View All Orders →
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
