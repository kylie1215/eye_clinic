export default function Badge({ status, children, size = 'md' }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-blue-100 text-blue-800',
        declined: 'bg-red-100 text-red-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-gray-100 text-gray-800',
        processing: 'bg-cyan-100 text-cyan-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        paid: 'bg-emerald-100 text-emerald-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-orange-100 text-orange-800',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'} ${sizes[size]}`}>
            {children || status}
        </span>
    );
}
