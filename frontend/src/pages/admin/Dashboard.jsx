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
    <div className="animate-fade-in relative">
      {/* Floating Background Elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      
      {/* Header */}
      <div className="mb-8 animate-fade-in-down relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1ABC9C] bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <EyeIcon className="h-5 w-5 text-[#1ABC9C] group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="animate-scale-in cursor-pointer group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-[#1ABC9C]/30 overflow-hidden relative" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    {/* Enhanced Glow Effect */}
                    <div className={`absolute inset-0 ${stat.color} rounded-xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500 animate-pulse`}></div>
                    <div className={`relative ${stat.color} p-3 rounded-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl`}>
                      <stat.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-green-100 transition-colors duration-300">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 group-hover:translate-y-[-2px] transition-transform duration-300" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110 group-hover:text-[#1ABC9C] mb-2 cursor-pointer">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 group-hover:text-gray-600 transition-colors">
                    <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#1ABC9C] transition-colors"></span>
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Revenue Overview */}
      <Card className="mb-8 animate-fade-in-up border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#1ABC9C]/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Financial performance summary</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-6 rounded-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-scale-in border border-blue-100/50 group cursor-pointer"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#1ABC9C] transition-colors duration-300">{stat.label}</p>
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-lg">
                    <CurrencyDollarIcon className="h-4 w-4 text-[#1ABC9C] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-[#16A085] transition-colors">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-600 flex items-center gap-1 group-hover:text-gray-700 transition-colors">
                    <CalendarIcon className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                    {stat.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Stats & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="System Overview" className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 animate-scale-in cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{stat.label}</p>
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

        <Card className="animate-fade-in-up animate-delay-300 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-[#1ABC9C]" />
            Quick Stats
          </h2>
          <div className="space-y-4">
            <Link to="/admin/products" className="block">
              <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 p-5 rounded-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-purple-200/50 group cursor-pointer hover:border-purple-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    {stats?.totalOrders > 0 ? '+23%' : '0%'}
                  </span>
                </div>
                <p className="text-sm text-purple-700 font-semibold mb-1 group-hover:text-purple-800 transition-colors">Sales Growth</p>
                <p className="text-2xl font-bold text-purple-900 flex items-center gap-1 group-hover:scale-110 transition-transform">
                  {stats?.totalOrders > 0 ? '↑ 23.5%' : '0%'}
                </p>
              </div>
            </Link>

            <div className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 p-5 rounded-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-amber-200/50 group cursor-pointer hover:border-amber-300">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <UsersIcon className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-amber-600 bg-white px-3 py-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  +{stats?.stats?.total_users || 0}
                </span>
              </div>
              <p className="text-sm text-amber-700 font-semibold mb-1 group-hover:text-amber-800 transition-colors">Active Users</p>
              <p className="text-2xl font-bold text-amber-900 group-hover:scale-110 transition-transform">{stats?.stats?.total_users || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-5 rounded-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-green-200/50 group cursor-pointer hover:border-green-300">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-white px-3 py-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">Total</span>
              </div>
              <p className="text-sm text-green-700 font-semibold mb-1 group-hover:text-green-800 transition-colors">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900 group-hover:scale-110 transition-transform">{revenueStats[0].value}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="animate-fade-in-up animate-delay-400 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-[#1ABC9C]" />
              Recent Orders
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {stats?.recentOrders?.length || 0} orders
            </span>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-in-right border border-gray-100 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <ShoppingBagIcon className="h-5 w-5 text-[#1ABC9C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C3E50]">{order.order_number}</p>
                    <p className="text-sm text-gray-600">{order.client?.name || order.user?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₱{order.total}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-500">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClipboardDocumentListIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="font-medium">No recent orders</p>
                <p className="text-sm mt-1">Orders will appear here</p>
              </div>
            )}
            <Link to="/admin/orders" className="flex items-center justify-center gap-2 mt-4 text-[#1ABC9C] hover:text-[#16A085] font-semibold bg-[#1ABC9C]/5 hover:bg-[#1ABC9C]/10 py-2 rounded-lg transition-colors">
              View All Orders →
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-fade-in-up animate-delay-500 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-[#1ABC9C]" />
              Recent Activity
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live</span>
          </div>
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
