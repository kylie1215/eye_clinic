import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      console.log('Dashboard API Response:', response);
      console.log('Dashboard data:', response.data);
      console.log('Stats object:', response.data.stats);
      console.log('Total users:', response.data.stats?.total_users);
      setStats(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard';
      toast.error(errorMsg);
      
      // Set default empty stats
      setStats({
        stats: {
          total_users: 0,
          total_doctors: 0,
          total_clients: 0,
          total_products: 0,
          total_appointments: 0,
          pending_appointments: 0,
          total_orders: 0,
          pending_orders: 0,
          total_revenue: 0,
          monthly_revenue: 0,
          low_stock_products: 0,
        },
        recentAppointments: [],
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.stats?.total_users || 0,
      subtitle: `${stats?.stats?.total_doctors || 0} doctors, ${stats?.stats?.total_clients || 0} clients`,
      icon: UsersIcon, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/admin/users'
    },
    { 
      label: 'Total Products', 
      value: stats?.stats?.total_products || 0,
      subtitle: `${stats?.stats?.low_stock_products || 0} low stock`,
      icon: ShoppingBagIcon, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/admin/products'
    },
    { 
      label: 'Total Orders', 
      value: stats?.stats?.total_orders || 0,
      subtitle: `${stats?.stats?.pending_orders || 0} pending`,
      icon: ClipboardDocumentListIcon, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin/orders'
    },
    { 
      label: 'Appointments', 
      value: stats?.stats?.total_appointments || 0,
      subtitle: `${stats?.stats?.pending_appointments || 0} pending`,
      icon: CalendarIcon, 
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      link: '/admin/appointments'
    },
  ];

  // Revenue stats from database
  const revenueStats = [
    { 
      label: 'Total Revenue', 
      value: `₱${(stats?.stats?.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      subtitle: 'All time'
    },
    { 
      label: 'Monthly Revenue', 
      value: `₱${(stats?.stats?.monthly_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      subtitle: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    },
    { 
      label: 'Avg Order Value', 
      value: `₱${((stats?.stats?.total_revenue || 0) / (stats?.stats?.total_orders || 1)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      subtitle: 'Per order'
    },
  ];

  // Quick stats for display
  const quickStats = [
    { 
      label: 'Total Orders', 
      value: stats?.stats?.total_orders || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Pending Orders', 
      value: stats?.stats?.pending_orders || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Low Stock Items', 
      value: stats?.stats?.low_stock_products || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
  ];

  // Generate recent activity from real data
  const generateRecentActivity = () => {
    const activities = [];
    
    if (stats?.recentOrders && stats.recentOrders.length > 0) {
      stats.recentOrders.slice(0, 2).forEach(order => {
        activities.push({
          type: 'order',
          text: `New order from ${order.user?.name || 'Customer'}`,
          amount: `₱${order.total}`,
          time: new Date(order.created_at).toLocaleString(),
          color: 'bg-green-100 text-green-800',
          icon: ClipboardDocumentListIcon
        });
      });
    }

    if (stats?.recentAppointments && stats.recentAppointments.length > 0) {
      stats.recentAppointments.slice(0, 2).forEach(appointment => {
        activities.push({
          type: 'appointment',
          text: `Appointment with Dr. ${appointment.doctor?.name || 'Doctor'}`,
          name: appointment.client?.name || 'Client',
          time: appointment.appointment_date,
          color: 'bg-cyan-100 text-cyan-800',
          icon: CalendarIcon
        });
      });
    }

    if (activities.length === 0) {
      return [
        { type: 'info', text: 'No recent activity', time: 'Now', color: 'bg-gray-100 text-gray-800', icon: ChartBarIcon }
      ];
    }

    return activities;
  };

  const recentActivity = generateRecentActivity();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Main Stats Cards */}
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

      {/* Revenue Overview */}
      <Card title="Revenue Overview" className="mb-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenueStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <CurrencyDollarIcon className="h-5 w-5 text-[#1ABC9C]" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              )}
              <p className="text-sm text-green-600 font-semibold">{stat.change} from last period</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="System Overview" className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">₱{(stats?.stats?.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              </div>
              <Link to="/admin/reports" className="text-[#1ABC9C] hover:text-[#16A085] font-medium text-sm flex items-center gap-1">
                <ChartBarIcon className="h-4 w-4" />
                View Reports →
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Quick Stats" className="animate-fade-in-up animate-delay-300">
          <div className="space-y-4">
            <Link to="/admin/products" className="block">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600 bg-white px-2 py-1 rounded-full">
                    {stats?.totalOrders > 0 ? '+23%' : '0%'}
                  </span>
                </div>
                <p className="text-sm text-purple-900 font-medium mb-1">Sales Growth</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats?.totalOrders > 0 ? '↑ 23.5%' : '0%'}
                </p>
              </div>
            </Link>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <UsersIcon className="h-6 w-6 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600 bg-white px-2 py-1 rounded-full">
                  +{stats?.totalUsers || 0}
                </span>
              </div>
              <p className="text-sm text-amber-900 font-medium mb-1">Active Users</p>
              <p className="text-2xl font-bold text-amber-900">{stats?.totalUsers || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                <span className="text-xs font-semibold text-green-600 bg-white px-2 py-1 rounded-full">Today</span>
              </div>
              <p className="text-sm text-green-900 font-medium mb-1">Revenue</p>
              <p className="text-2xl font-bold text-green-900">{revenueStats[0].value}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card title="Recent Orders" className="animate-fade-in-up animate-delay-400">
          <div className="space-y-3">
            {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-slide-in-right"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div>
                  <p className="font-medium text-[#2C3E50]">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.user?.name}</p>
                </div>
                <p className="font-semibold text-green-600">₱{order.total}</p>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent orders</p>
              </div>
            )}
            <Link to="/admin/orders" className="block text-center mt-4 text-[#1ABC9C] hover:text-[#16A085] font-medium">
              View All Orders →
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" className="animate-fade-in-up animate-delay-500">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-cyan-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  {activity.icon && <activity.icon className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${activity.color}`}>
                    {activity.type}
                  </div>
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  {activity.amount && <p className="text-sm font-semibold text-green-600">{activity.amount}</p>}
                  {activity.name && <p className="text-sm font-medium text-[#1ABC9C]">{activity.name}</p>}
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
