import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  BellIcon,
  CalendarIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Button from './Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function NotificationsModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, notificationId: null, resolve: null });

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/notifications');
      const notifs = response.data.data || response.data || [];
      setNotifications(notifs);
    } catch (error) {
      console.error('Notifications error:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      ));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifs.map(n => api.patch(`/api/notifications/${n.id}/read`))
      );
      setNotifications(notifications.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    // Show custom confirmation modal instead of browser alert
    const confirmed = await showConfirmDialog(notificationId);
    if (!confirmed) return;
    
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const showConfirmDialog = (notificationId) => {
    return new Promise((resolve) => {
      setDeleteConfirm({ show: true, notificationId, resolve });
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <CalendarIcon className="h-6 w-6 text-blue-500" />;
      case 'order':
        return <ShoppingBagIcon className="h-6 w-6 text-green-500" />;
      case 'prescription':
        return <DocumentTextIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <ExclamationCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return time.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const stats = [
    { label: 'Total', count: notifications.length, color: 'bg-blue-500' },
    { label: 'Unread', count: notifications.filter(n => !n.is_read).length, color: 'bg-red-500' },
    { label: 'Read', count: notifications.filter(n => n.is_read).length, color: 'bg-green-500' },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">
                      Notifications
                    </Dialog.Title>
                    <p className="text-gray-600 text-sm mt-1">Stay updated with your activities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {notifications.some(n => !n.is_read) && (
                      <Button onClick={markAllAsRead} className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="h-4 w-4" />
                        Mark All Read
                      </Button>
                    )}
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`${stat.color} p-2 rounded-lg`}>
                          <BellIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filter Buttons */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    {['all', 'unread', 'read'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          filter === f
                            ? 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[500px] overflow-y-auto p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABC9C]"></div>
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                            !notification.is_read 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                {getIcon(notification.type)}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-semibold text-gray-900">
                                      {notification.title}
                                    </h3>
                                    {!notification.is_read && (
                                      <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <BellIcon className="h-3 w-3" />
                                      {notification.type}
                                    </span>
                                    <span>{getTimeAgo(notification.created_at)}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  {!notification.is_read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Mark as read"
                                    >
                                      <CheckCircleIcon className="h-5 w-5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BellIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">
                        {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                      </p>
                      <p className="text-sm mt-1">
                        {filter === 'all' 
                          ? "You're all caught up!"
                          : `You don't have any ${filter} notifications.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Transition appear show={deleteConfirm.show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[60]"
            onClose={() => {
              deleteConfirm.resolve?.(false);
              setDeleteConfirm({ show: false, notificationId: null, resolve: null });
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                      <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    
                    <Dialog.Title className="text-lg font-semibold text-gray-900 text-center mb-2">
                      Delete Notification
                    </Dialog.Title>
                    
                    <p className="text-sm text-gray-600 text-center mb-6">
                      Are you sure you want to delete this notification? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          deleteConfirm.resolve?.(false);
                          setDeleteConfirm({ show: false, notificationId: null, resolve: null });
                        }}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          deleteConfirm.resolve?.(true);
                          setDeleteConfirm({ show: false, notificationId: null, resolve: null });
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Dialog>
    </Transition>
  );
}
