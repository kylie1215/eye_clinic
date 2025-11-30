import React from 'react';
import { cn } from '../utils/helpers';

export default function Input({ 
  label, 
  error, 
  className,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent focus:scale-[1.02]',
          error ? 'border-red-500 animate-pulse' : 'border-gray-300 hover:border-blue-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
