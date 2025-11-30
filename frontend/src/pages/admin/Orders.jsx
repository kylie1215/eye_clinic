import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { ClipboardDocumentListIcon, MagnifyingGlassIcon, EyeIcon, CheckCircleIcon, XMarkIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, pagination.current_page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.current_page };
      if (selectedStatus) params.status = selectedStatus;
      const response = await adminAPI.getOrders(params);
      setOrders(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      });
      calculateStats(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    setStats({
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      processing: ordersData.filter(o => o.status === 'processing').length,
      completed: ordersData.filter(o => o.status === 'completed').length
    });
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await adminAPI.getOrder(order.id);
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await adminAPI.updatePaymentStatus(orderId, paymentStatus);
      toast.success('Payment status updated');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'shipped': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Order Management</h1>
        <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, icon: ClipboardDocumentListIcon, color: 'bg-[#3498DB]' },
          { label: 'Pending', value: stats.pending, icon: ClipboardDocumentListIcon, color: 'bg-yellow-500' },
          { label: 'Processing', value: stats.processing, icon: ClipboardDocumentListIcon, color: 'bg-orange-500' },
          { label: 'Completed', value: stats.completed, icon: CheckCircleIcon, color: 'bg-[#2ECC71]' },
        ].map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full transition-all duration-300 hover:scale-110`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 animate-fade-in-up">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search orders by number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] transition-all duration-300"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="animate-fade-in-up animate-delay-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1ABC9C]"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500">No orders match your search criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Order</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-gray-100 hover:bg-[#E8F8F5]/30 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-[#2C3E50]">{order.order_number}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#2ECC71]">₱{Number(order.total).toFixed(2)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={getStatusColor(order.status)} className="capitalize">{order.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={order.payment_status === 'paid' ? 'success' : 'warning'} className="capitalize">
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-[#1ABC9C] hover:bg-[#E8F8F5] rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{pagination.total}</span> orders
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  disabled={pagination.current_page === 1}
                  onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                >
                  Previous
                </Button>
                <Button 
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Order Details"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold text-gray-900">{selectedOrder.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-gray-900">{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-[#2ECC71] text-xl">
                  ₱{Number(selectedOrder.total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <div className="flex gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                      selectedOrder.status === status
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <div className="flex gap-2">
                {['pending', 'paid', 'failed', 'refunded'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdatePaymentStatus(selectedOrder.id, status)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                      selectedOrder.payment_status === status
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            {selectedOrder.shipping_address && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-[#1ABC9C]" />
                  Shipping Information
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{selectedOrder.shipping_address}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
