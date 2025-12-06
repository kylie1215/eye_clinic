import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NotificationsModal from '../components/NotificationsModal';
import { doctorAPI } from '../api';
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleOpenModal = () => setNotificationsModalOpen(true);
    window.addEventListener('openNotificationsModal', handleOpenModal);
    return () => window.removeEventListener('openNotificationsModal', handleOpenModal);
  }, []);

  const fetchAppointmentCount = async () => {
    try {
      const response = await doctorAPI.getAppointments({ status: 'pending' });
      setAppointmentCount(response.data.data?.length || 0);
    } catch (error) {
      console.error('Failed to fetch appointment count:', error);
    }
  };

  useEffect(() => {
    fetchAppointmentCount();
    const interval = setInterval(fetchAppointmentCount, 60000);
    
    // Listen for appointment refresh event
    const handleRefresh = () => fetchAppointmentCount();
    window.addEventListener('refreshAppointmentBadge', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAppointmentBadge', handleRefresh);
    };
  }, []);

  // Clear badge when visiting appointments page
  useEffect(() => {
    if (location.pathname === '/doctor/appointments') {
      setAppointmentCount(0);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <CalendarIcon className="h-5 w-5" />, badge: appointmentCount },
    { path: '/doctor/patients', label: 'Patients', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { path: '/doctor/schedule', label: 'My Schedule', icon: <ClockIcon className="h-5 w-5" /> },
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
          title="Doctor Portal"
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
