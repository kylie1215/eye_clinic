export default function Card({ title, icon: Icon, value, subtitle, trend, className = '' }) {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    {title && (
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    )}
                    {value !== undefined && (
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className="ml-4">
                        <div className="p-3 bg-gradient-to-br from-blue-900 to-cyan-500 rounded-lg">
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                )}
            </div>
            {trend && (
                <div className="mt-3 flex items-center text-sm">
                    <span className={`font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trend.value}
                    </span>
                    <span className="text-gray-500 ml-2">{trend.label}</span>
                </div>
            )}
        </div>
    );
}
