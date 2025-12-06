import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NotificationsModal from '../components/NotificationsModal';
import { adminAPI } from '../api';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [auditLogCount, setAuditLogCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleOpenModal = () => setNotificationsModalOpen(true);
    window.addEventListener('openNotificationsModal', handleOpenModal);
    return () => window.removeEventListener('openNotificationsModal', handleOpenModal);
  }, []);

  const fetchAuditLogCount = async () => {
    try {
      const response = await adminAPI.getAuditLogStats();
      setAuditLogCount(response.data.today || 0);
    } catch (error) {
      console.error('Failed to fetch audit log count:', error);
    }
  };

  useEffect(() => {
    fetchAuditLogCount();
    // Refresh count every minute
    const interval = setInterval(fetchAuditLogCount, 60000);
    
    // Listen for audit log refresh event
    const handleRefresh = () => fetchAuditLogCount();
    window.addEventListener('refreshAuditLogBadge', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAuditLogBadge', handleRefresh);
    };
  }, []);

  // Clear badge when visiting audit logs page
  useEffect(() => {
    if (location.pathname === '/admin/audit-logs') {
      setAuditLogCount(0);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Users', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/admin/products', label: 'Products', icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <CalendarIcon className="h-5 w-5" /> },
    { path: '/admin/reports', label: 'Reports', icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: <ShieldCheckIcon className="h-5 w-5" />, badge: auditLogCount },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Admin Panel"
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <NotificationsModal 
        isOpen={notificationsModalOpen} 
        onClose={() => setNotificationsModalOpen(false)} 
      />
    </div>
  );
}
