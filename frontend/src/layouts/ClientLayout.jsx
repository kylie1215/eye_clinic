import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NotificationsModal from '../components/NotificationsModal';
import { clientAPI } from '../api';
import {
  HomeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ClientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleOpenModal = () => setNotificationsModalOpen(true);
    window.addEventListener('openNotificationsModal', handleOpenModal);
    return () => window.removeEventListener('openNotificationsModal', handleOpenModal);
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch pending appointments
      const appointmentsResponse = await clientAPI.getAppointments({ status: 'pending' });
      setAppointmentCount(appointmentsResponse.data.data?.length || 0);

      // Fetch cart items
      const cartResponse = await clientAPI.getCart();
      setCartCount(cartResponse.data.items?.length || 0);
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    
    // Listen for refresh events
    const handleRefreshAppointment = () => {
      clientAPI.getAppointments({ status: 'pending' })
        .then(res => setAppointmentCount(res.data.data?.length || 0))
        .catch(err => console.error('Failed to refresh appointment count:', err));
    };
    const handleRefreshCart = () => {
      clientAPI.getCart()
        .then(res => setCartCount(res.data.items?.length || 0))
        .catch(err => console.error('Failed to refresh cart count:', err));
    };
    
    window.addEventListener('refreshAppointmentBadge', handleRefreshAppointment);
    window.addEventListener('refreshCartBadge', handleRefreshCart);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAppointmentBadge', handleRefreshAppointment);
      window.removeEventListener('refreshCartBadge', handleRefreshCart);
    };
  }, []);

  // Clear badges when visiting respective pages
  useEffect(() => {
    if (location.pathname === '/client/appointments') {
      setAppointmentCount(0);
    } else if (location.pathname === '/client/cart') {
      setCartCount(0);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/client/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/client/appointments', label: 'Appointments', icon: <CalendarIcon className="h-5 w-5" />, badge: appointmentCount },
    { path: '/client/shop', label: 'Shop', icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { path: '/client/cart', label: 'Cart', icon: <ShoppingCartIcon className="h-5 w-5" />, badge: cartCount },
    { path: '/client/orders', label: 'My Orders', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
    { path: '/client/prescriptions', label: 'Prescriptions', icon: <DocumentTextIcon className="h-5 w-5" /> },
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
          title="Client Portal"
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
