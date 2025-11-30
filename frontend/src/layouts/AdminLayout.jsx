import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Users', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/admin/products', label: 'Products', icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <CalendarIcon className="h-5 w-5" /> },
    { path: '/admin/reports', label: 'Reports', icon: <ChartBarIcon className="h-5 w-5" /> },
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
    </div>
  );
}
