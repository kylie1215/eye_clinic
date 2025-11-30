import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Button from '../components/Button';
import {
  BellIcon,
  CalendarIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
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
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
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

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with your activities</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button onClick={markAllAsRead} className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <BellIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Buttons */}
      <Card className="mb-6 animate-fade-in-up">
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
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={`animate-slide-in-right hover:shadow-lg transition-all duration-300 ${
                !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BellIcon className="h-4 w-4" />
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
            </Card>
          ))
        ) : (
          <Card>
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
          </Card>
        )}
      </div>
    </div>
  );
}
