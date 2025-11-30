import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock orders data - replace with API call
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        order_number: 'ORD-2024-001',
        created_at: '2024-01-15T10:30:00',
        status: 'delivered',
        total_amount: 4200,
        items: [
          { name: 'Blue Light Blocking Glasses', quantity: 1, price: 1800 },
          { name: 'Monthly Contact Lenses', quantity: 2, price: 1200 }
        ],
        shipping_address: '123 Main St, Quezon City',
        tracking_number: 'TRK-123456789',
        delivered_at: '2024-01-20T14:30:00'
      },
      {
        id: 2,
        order_number: 'ORD-2024-002',
        created_at: '2024-01-18T14:20:00',
        status: 'processing',
        total_amount: 2500,
        items: [
          { name: 'Classic Aviator Sunglasses', quantity: 1, price: 2500 }
        ],
        shipping_address: '456 Oak Ave, Makati City',
        tracking_number: 'TRK-987654321',
        estimated_delivery: '2024-01-25'
      },
      {
        id: 3,
        order_number: 'ORD-2024-003',
        created_at: '2024-01-20T09:15:00',
        status: 'pending',
        total_amount: 3400,
        items: [
          { name: 'Round Frame Eyeglasses', quantity: 1, price: 2200 },
          { name: 'Daily Contact Lenses', quantity: 1, price: 1500 }
        ],
        shipping_address: '789 Pine Rd, Pasig City'
      },
      {
        id: 4,
        order_number: 'ORD-2024-004',
        created_at: '2024-01-22T16:45:00',
        status: 'cancelled',
        total_amount: 3200,
        items: [
          { name: 'Sport Sunglasses', quantity: 1, price: 3200 }
        ],
        shipping_address: '321 Elm St, Manila',
        cancelled_at: '2024-01-23T10:00:00',
        cancel_reason: 'Customer requested cancellation'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm, orders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-[#E8F8F5] text-[#3498DB]',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      processing: TruckIcon,
      delivered: CheckCircleIcon,
      cancelled: XCircleIcon
    };
    return icons[status] || ClockIcon;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const stats = [
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: ClipboardDocumentListIcon,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Processing', 
      value: orders.filter(o => o.status === 'processing').length, 
      icon: TruckIcon,
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      label: 'Delivered', 
      value: orders.filter(o => o.status === 'delivered').length, 
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Total Spent', 
      value: `₱${orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}`, 
      icon: ClipboardDocumentListIcon,
      color: 'from-purple-500 to-purple-600'
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your order history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4 animate-fade-in-up animate-delay-100">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <Card 
                key={order.id} 
                className="animate-slide-in-right hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${getStatusColor(order.status).replace('bg-', 'from-').replace('text-', 'to-')} p-3 rounded-xl`}>
                      <StatusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{order.order_number}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(order.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      {order.tracking_number && (
                        <p className="text-xs text-[#1ABC9C] mt-1">Tracking: {order.tracking_number}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-[#1ABC9C]">₱{order.total_amount.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => viewOrderDetails(order)}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="animate-fade-in-up">
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No orders found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        </Card>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.order_number}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Status */}
            <div className={`p-4 rounded-lg mb-6 ${getStatusColor(selectedOrder.status)}`}>
              <div className="flex items-center gap-2">
                {React.createElement(getStatusIcon(selectedOrder.status), { className: "h-5 w-5" })}
                <span className="font-semibold">Status: {selectedOrder.status.toUpperCase()}</span>
              </div>
              {selectedOrder.tracking_number && (
                <p className="text-sm mt-2">Tracking Number: {selectedOrder.tracking_number}</p>
              )}
              {selectedOrder.estimated_delivery && (
                <p className="text-sm mt-1">Estimated Delivery: {selectedOrder.estimated_delivery}</p>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#1ABC9C]">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600">{selectedOrder.shipping_address}</p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-[#1ABC9C]">₱{selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {selectedOrder.cancel_reason && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                <p className="font-semibold">Cancellation Reason:</p>
                <p className="text-sm">{selectedOrder.cancel_reason}</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
