import React from 'react';
import { cn } from '../utils/helpers';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  loading,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white hover:from-[#16A085] hover:to-[#148F77] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#1ABC9C]',
    secondary: 'bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white hover:from-[#34495E] hover:to-[#2C3E50] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#2C3E50]',
    success: 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white hover:from-[#27AE60] hover:to-[#229954] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#2ECC71]',
    danger: 'bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white hover:from-[#C0392B] hover:to-[#A93226] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#E74C3C]',
    accent: 'bg-gradient-to-r from-[#3498DB] to-[#2980B9] text-white hover:from-[#2980B9] hover:to-[#21618C] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#3498DB]',
    outline: 'border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white hover:shadow-md hover:-translate-y-0.5 focus:ring-[#1ABC9C]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
