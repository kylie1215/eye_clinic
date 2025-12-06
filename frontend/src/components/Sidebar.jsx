import React from 'react';
import { NavLink } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ menuItems, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#34495E]">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#1ABC9C] bg-clip-text text-transparent">Eye Clinic</h2>
          <button onClick={onClose} className="lg:hidden text-white hover:scale-110 hover:rotate-90 transition-all duration-300">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group animate-slide-in-left ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:bg-[#34495E]/50 hover:text-white hover:translate-x-2'
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <span className="font-medium flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
