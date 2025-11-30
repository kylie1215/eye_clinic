import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ConfirmDialog from './ConfirmDialog';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <nav className="bg-white shadow-lg px-6 py-4 border-b border-gray-100 animate-fade-in-down relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 hover:text-[#2C3E50] transition-all duration-300 hover:scale-110 hover:rotate-180"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsDropdown />

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 text-gray-700 hover:text-[#2C3E50] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:ring-offset-2 rounded-lg px-2 py-1">
              <UserCircleIcon className="h-8 w-8" />
              <span className="hidden md:block font-medium">{user?.name}</span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/${user?.role}/profile`}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </nav>
  );
}
