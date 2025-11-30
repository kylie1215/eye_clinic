export default function Button({ 
    type = 'button', 
    variant = 'primary', 
    size = 'md',
    children, 
    disabled = false,
    className = '',
    ...props 
}) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        accent: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500',
        outline: 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50 focus:ring-blue-900',
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
