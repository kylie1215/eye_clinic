import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import ConfirmModal from '../../components/ConfirmModal';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';

export default function AuditLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, this_week: 0, archived: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateeTo] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, data: null });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [pagination.current_page, selectedAction, dateFrom, dateTo, showArchived]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
        search: searchTerm,
        action: selectedAction,
        date_from: dateFrom,
        date_to: dateTo,
        show_archived: showArchived,
      };
      
      const response = await adminAPI.getAuditLogs(params);
      setLogs(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAuditLogStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current_page: 1 });
    fetchLogs();
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800',
      register: 'bg-blue-100 text-blue-800',
      create: 'bg-purple-100 text-purple-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const viewDetails = async (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleArchive = (id) => {
    setConfirmModal({
      isOpen: true,
      action: 'archive',
      data: id,
    });
  };

  const confirmArchive = async (id) => {
    try {
      await adminAPI.archiveAuditLog(id);
      toast.success('Audit log archived successfully');
      fetchLogs();
      fetchStats();
    } catch (error) {
      console.error('Error archiving log:', error);
      toast.error('Failed to archive audit log');
    }
  };

  const handleUnarchive = (id) => {
    setConfirmModal({
      isOpen: true,
      action: 'unarchive',
      data: id,
    });
  };

  const confirmUnarchive = async (id) => {
    try {
      await adminAPI.unarchiveAuditLog(id);
      toast.success('Audit log unarchived successfully');
      fetchLogs();
      fetchStats();
    } catch (error) {
      console.error('Error unarchiving log:', error);
      toast.error('Failed to unarchive audit log');
    }
  };

  const handleBulkArchive = () => {
    if (selectedLogs.length === 0) {
      toast.error('Please select logs to archive');
      return;
    }
    setConfirmModal({
      isOpen: true,
      action: 'bulkArchive',
      data: selectedLogs,
    });
  };

  const confirmBulkArchive = async (ids) => {
    try {
      await adminAPI.bulkArchiveAuditLogs(ids);
      toast.success(`${ids.length} audit logs archived successfully`);
      setSelectedLogs([]);
      fetchLogs();
      fetchStats();
    } catch (error) {
      console.error('Error archiving logs:', error);
      toast.error('Failed to archive audit logs');
    }
  };

  const toggleSelectLog = (id) => {
    setSelectedLogs(prev =>
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedLogs(selectedLogs.length === logs.length ? [] : logs.map(log => log.id));
  };

  const handleConfirmAction = () => {
    const { action, data } = confirmModal;
    if (action === 'archive') {
      confirmArchive(data);
    } else if (action === 'unarchive') {
      confirmUnarchive(data);
    } else if (action === 'bulkArchive') {
      confirmBulkArchive(data);
    }
  };

  const getConfirmModalProps = () => {
    const { action, data } = confirmModal;
    switch (action) {
      case 'archive':
        return {
          title: 'Archive Audit Log',
          message: 'Are you sure you want to archive this audit log? You can restore it later from the archived logs.',
          confirmText: 'Archive',
          confirmColor: 'bg-[#95A5A6] hover:bg-[#7F8C8D]',
          icon: ArchiveBoxIcon,
          iconColor: 'text-[#95A5A6]',
        };
      case 'unarchive':
        return {
          title: 'Restore Audit Log',
          message: 'Are you sure you want to restore this audit log from the archive?',
          confirmText: 'Restore',
          confirmColor: 'bg-[#3498DB] hover:bg-[#2980B9]',
          icon: ArrowUturnLeftIcon,
          iconColor: 'text-[#3498DB]',
        };
      case 'bulkArchive':
        return {
          title: 'Archive Multiple Logs',
          message: `Are you sure you want to archive ${data?.length} audit log(s)? You can restore them later from the archived logs.`,
          confirmText: `Archive ${data?.length} Log(s)`,
          confirmColor: 'bg-[#95A5A6] hover:bg-[#7F8C8D]',
          icon: ArchiveBoxIcon,
          iconColor: 'text-[#95A5A6]',
        };
      default:
        return {};
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">
          Audit Logs
        </h1>
        <p className="text-gray-600 mt-1">Track system activities and user actions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Logs', value: stats.total, icon: ClipboardDocumentListIcon, color: 'bg-[#3498DB]' },
          { label: 'Today', value: stats.today, icon: CalendarIcon, color: 'bg-[#2ECC71]' },
          { label: 'This Week', value: stats.this_week, icon: ShieldCheckIcon, color: 'bg-[#1ABC9C]' },
          { label: 'Archived', value: stats.archived, icon: ArchiveBoxIcon, color: 'bg-[#95A5A6]' },
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

      {/* Filters */}
      <Card className="mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowArchived(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !showArchived
                    ? 'bg-white text-[#1ABC9C] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  Active Logs
                </div>
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  showArchived
                    ? 'bg-white text-[#95A5A6] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArchiveBoxIcon className="h-4 w-4" />
                  Archived Logs
                </div>
              </button>
            </div>
          </div>
          {!showArchived && selectedLogs.length > 0 && (
            <button
              onClick={handleBulkArchive}
              className="flex items-center gap-2 px-4 py-2 bg-[#95A5A6] text-white rounded-lg hover:bg-[#7F8C8D] transition-colors"
            >
              <ArchiveBoxIcon className="h-5 w-5" />
              Archive Selected ({selectedLogs.length})
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="register">Register</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <Input
            type="date"
            placeholder="From Date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <Input
            type="date"
            placeholder="To Date"
            value={dateTo}
            onChange={(e) => setDateeTo(e.target.value)}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="animate-fade-in-up animate-delay-200">
        {loading ? (
          <Loading />
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Logs Found</h3>
            <p className="text-gray-500">No audit logs match your search criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {!showArchived && (
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedLogs.length === logs.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-[#1ABC9C] border-gray-300 rounded focus:ring-[#1ABC9C]"
                        />
                      </th>
                    )}
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Action</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">IP Address</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-[#E8F8F5]/30 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {!showArchived && (
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedLogs.includes(log.id)}
                            onChange={() => toggleSelectLog(log.id)}
                            className="w-4 h-4 text-[#1ABC9C] border-gray-300 rounded focus:ring-[#1ABC9C]"
                          />
                        </td>
                      )}
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {log.user?.name || 'System'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {log.description}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {log.ip_address}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewDetails(log)}
                            className="text-[#1ABC9C] hover:text-[#16A085] transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {showArchived ? (
                            <button
                              onClick={() => handleUnarchive(log.id)}
                              className="text-[#3498DB] hover:text-[#2980B9] transition-colors"
                              title="Unarchive"
                            >
                              <ArchiveBoxXMarkIcon className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(log.id)}
                              className="text-[#95A5A6] hover:text-[#7F8C8D] transition-colors"
                              title="Archive"
                            >
                              <ArchiveBoxIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing page <span className="font-semibold text-gray-900">{pagination.current_page}</span> of <span className="font-semibold text-gray-900">{pagination.last_page}</span>
                  {pagination.total && (
                    <span className="text-gray-500"> ({pagination.total} total logs)</span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: 1 })}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First Page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Previous */}
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisible / 2));
                      let endPage = Math.min(pagination.last_page, startPage + maxVisible - 1);

                      if (endPage - startPage + 1 < maxVisible) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setPagination({ ...pagination, current_page: i })}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              i === pagination.current_page
                                ? 'bg-[#1ABC9C] text-white font-semibold'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: pagination.last_page })}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last Page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Audit Log Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-semibold">{selectedLog.user?.name || 'System'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Action</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IP Address</p>
                  <p className="font-semibold">{selectedLog.ip_address}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{selectedLog.description}</p>
              </div>

              {selectedLog.user_agent && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">User Agent</p>
                  <p className="text-sm text-gray-700 break-all">{selectedLog.user_agent}</p>
                </div>
              )}

              {selectedLog.old_values && Object.keys(selectedLog.old_values).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Old Values</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && Object.keys(selectedLog.new_values).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">New Values</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, data: null })}
        onConfirm={handleConfirmAction}
        {...getConfirmModalProps()}
      />
    </div>
  );
}
