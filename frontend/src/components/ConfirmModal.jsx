import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'bg-red-600 hover:bg-red-700',
  icon: Icon = ExclamationTriangleIcon,
  iconColor = 'text-red-600'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <Icon className={`h-12 w-12 ${iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-3 ${confirmColor} text-white rounded-lg font-medium transition-colors shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
