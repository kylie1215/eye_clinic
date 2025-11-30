import { forwardRef } from 'react';

const Input = forwardRef(({ 
    type = 'text', 
    label, 
    error, 
    required = false,
    className = '',
    ...props 
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 disabled:bg-gray-50 disabled:text-gray-500 ${
                    error ? 'border-red-500' : ''
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
