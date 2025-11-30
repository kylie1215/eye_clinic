import React from 'react';

export default function Card({ title, children, className = '', actions, hover = true }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 animate-fade-in-up ${
      hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''
    } ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-[#2C3E50] to-[#1ABC9C] rounded-full"></span>
            {title}
          </h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
