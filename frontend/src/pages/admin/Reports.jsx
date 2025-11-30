import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports();
      const data = response.data;
      
      // Set default empty data structure
      const defaultData = {
        revenue: { total: 0, monthly: 0, yearly: 0, monthlyData: [] },
        users: { totalClients: 0, newThisMonth: 0 },
        products: { topSelling: [] },
        appointments: { total: 0, pending: 0, completed: 0, trends: [] }
      };
      
      const reportInfo = { ...defaultData, ...data };
      setReportData(reportInfo);
      
      // Calculate stats
      const calculatedStats = [
        { 
          label: 'Monthly Revenue', 
          value: `₱${Number(reportInfo.revenue?.monthly || 0).toLocaleString()}`, 
          change: calculatePercentageChange(reportInfo.revenue?.monthly || 0, (reportInfo.revenue?.yearly || 0) / 12), 
          trend: (reportInfo.revenue?.monthly || 0) >= ((reportInfo.revenue?.yearly || 0) / 12) ? 'up' : 'down', 
          icon: CurrencyDollarIcon, 
          color: 'bg-[#2ECC71]' 
        },
        { 
          label: 'New Clients', 
          value: (reportInfo.users?.newThisMonth || 0).toString(), 
          change: '+' + (reportInfo.users?.newThisMonth || 0), 
          trend: 'up', 
          icon: UsersIcon, 
          color: 'bg-[#3498DB]' 
        },
        { 
          label: 'Total Products', 
          value: (reportInfo.products?.topSelling?.length || 0).toString(), 
          change: 'Active', 
          trend: 'up', 
          icon: ShoppingBagIcon, 
          color: 'bg-purple-500' 
        },
        { 
          label: 'Total Appointments', 
          value: (reportInfo.appointments?.total || 0).toString(), 
          change: `${reportInfo.appointments?.pending || 0} pending`, 
          trend: 'up', 
          icon: CalendarIcon, 
          color: 'bg-[#1ABC9C]' 
        },
      ];
      setStats(calculatedStats);
      
      // Set top products (take first 4)
      setTopProducts((reportInfo.products?.topSelling || []).slice(0, 4));
    } catch (error) {
      console.error('Error fetching report data:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load report data';
      toast.error(errorMsg);
      
      // Set empty data on error
      setReportData({
        revenue: { total: 0, monthly: 0, yearly: 0, monthlyData: [] },
        users: { totalClients: 0, newThisMonth: 0 },
        products: { topSelling: [] },
        appointments: { total: 0, pending: 0, completed: 0, trends: [] }
      });
      setStats([]);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return '+0.0%';
    const change = ((current - previous) / previous) * 100;
    return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">View business insights and performance metrics</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card title="Monthly Revenue (Current Year)" className="animate-fade-in-up animate-delay-200">
          <div className="h-64 flex items-end gap-2 px-4 pb-4">
            {reportData?.revenue?.monthlyData?.length > 0 ? (
              reportData.revenue.monthlyData.map((data, index) => {
                const maxRevenue = Math.max(...reportData.revenue.monthlyData.map(d => d.revenue));
                const heightPercentage = maxRevenue > 0 ? (data.revenue / maxRevenue * 100) : 0;
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                    <div 
                      className="w-full bg-gradient-to-t from-[#1ABC9C] to-[#3498DB] rounded-t-lg transition-all duration-500 hover:opacity-80 relative"
                      style={{ 
                        height: `${heightPercentage}%`,
                        minHeight: data.revenue > 0 ? '10px' : '0px'
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ₱{Number(data.revenue).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{monthNames[data.month - 1]}</p>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <div className="text-center">
                  <ChartBarIcon className="h-16 w-16 text-[#1ABC9C] opacity-30 mx-auto mb-2" />
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card title="Top Products" className="animate-fade-in-up animate-delay-300">
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.category} - Stock: {product.stock}
                    </p>
                  </div>
                  <p className="font-semibold text-[#2ECC71]">₱{Number(product.price).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBagIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No products available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Revenue Breakdown */}
        <Card title="Revenue Breakdown" className="animate-fade-in-up animate-delay-400">
          <div className="space-y-4">
            <div className="animate-fade-in">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₱{Number(reportData?.revenue?.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#1ABC9C] h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Yearly Revenue</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₱{Number(reportData?.revenue?.yearly || 0).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#3498DB] h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${reportData?.revenue?.total > 0 ? (reportData.revenue.yearly / reportData.revenue.total * 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly Revenue</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₱{Number(reportData?.revenue?.monthly || 0).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#2ECC71] h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${reportData?.revenue?.yearly > 0 ? (reportData.revenue.monthly / reportData.revenue.yearly * 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Appointment Statistics */}
        <Card title="Appointment Statistics" className="animate-fade-in-up animate-delay-500">
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-cyan-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1ABC9C]"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Appointments</p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </div>
              <p className="text-lg font-bold text-[#2C3E50]">
                {reportData?.appointments?.total || 0}
              </p>
            </div>
            <div 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-left"
              style={{ animationDelay: '50ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pending</p>
                  <p className="text-xs text-gray-500">Awaiting confirmation</p>
                </div>
              </div>
              <p className="text-lg font-bold text-amber-600">
                {reportData?.appointments?.pending || 0}
              </p>
            </div>
            <div 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-left"
              style={{ animationDelay: '100ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2ECC71]"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500">Successfully finished</p>
                </div>
              </div>
              <p className="text-lg font-bold text-[#2ECC71]">
                {reportData?.appointments?.completed || 0}
              </p>
            </div>
            <div 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-left"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#3498DB]"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Clients</p>
                  <p className="text-xs text-gray-500">Registered users</p>
                </div>
              </div>
              <p className="text-lg font-bold text-[#3498DB]">
                {reportData?.users?.totalClients || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
