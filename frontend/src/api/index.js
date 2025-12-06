import api from './axios';

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/login', credentials),
  register: (data) => api.post('/api/register', data),
  logout: () => api.post('/api/logout'),
  getUser: () => api.get('/api/user'),
  forgotPassword: (email) => api.post('/api/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/reset-password', data),
};

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/api/admin/dashboard/stats'),
  
  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  createUser: (data) => api.post('/api/admin/users', data),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  restoreUser: (id) => api.post(`/api/admin/users/${id}/restore`),
  forceDeleteUser: (id) => api.delete(`/api/admin/users/${id}/force`),
  
  // Products
  getProducts: (params) => api.get('/api/admin/products', { params }),
  createProduct: (data) => api.post('/api/admin/products', data),
  updateProduct: (id, data) => api.put(`/api/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`),
  
  // Orders
  getOrders: (params) => api.get('/api/admin/orders', { params }),
  getOrder: (id) => api.get(`/api/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/api/admin/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, payment_status) => api.patch(`/api/admin/orders/${id}/payment`, { payment_status }),
  
  // Appointments
  getAppointments: (params) => api.get('/api/admin/appointments', { params }),
  
  // Reports
  getReports: () => api.get('/api/admin/reports'),
  
  // Audit Logs
  getAuditLogs: (params) => api.get('/api/admin/audit-logs', { params }),
  getAuditLogStats: () => api.get('/api/admin/audit-logs/stats'),
  getAuditLog: (id) => api.get(`/api/admin/audit-logs/${id}`),
  archiveAuditLog: (id) => api.patch(`/api/admin/audit-logs/${id}/archive`),
  unarchiveAuditLog: (id) => api.patch(`/api/admin/audit-logs/${id}/unarchive`),
  bulkArchiveAuditLogs: (ids) => api.post('/api/admin/audit-logs/bulk-archive', { ids }),
};

// Doctor APIs
export const doctorAPI = {
  // Dashboard
  getDashboard: () => api.get('/api/doctor/dashboard/stats'),
  
  // Appointments
  getAppointments: (params) => api.get('/api/doctor/appointments', { params }),
  getAppointment: (id) => api.get(`/api/doctor/appointments/${id}`),
  updateAppointmentStatus: (id, data) => api.patch(`/api/doctor/appointments/${id}/status`, data),
  rescheduleAppointment: (id, data) => api.patch(`/api/doctor/appointments/${id}/reschedule`, data),
  
  // Patients
  getPatients: (params) => api.get('/api/doctor/patients', { params }),
  getPatient: (id) => api.get(`/api/doctor/patients/${id}`),
  
  // Prescriptions
  getPrescriptions: (params) => api.get('/api/doctor/prescriptions', { params }),
  createPrescription: (data) => api.post('/api/doctor/prescriptions', data),
  updatePrescription: (id, data) => api.put(`/api/doctor/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/api/doctor/prescriptions/${id}`),
  
  // Schedule
  getSchedule: () => api.get('/api/doctor/schedule'),
  createSchedule: (data) => api.post('/api/doctor/schedule', data),
  updateSchedule: (id, data) => api.put(`/api/doctor/schedule/${id}`, data),
  deleteSchedule: (id) => api.delete(`/api/doctor/schedule/${id}`),
};

// Client APIs
export const clientAPI = {
  // Dashboard
  getDashboard: () => api.get('/api/client/dashboard/stats'),
  
  // Appointments
  getAppointments: (params) => api.get('/api/client/appointments', { params }),
  createAppointment: (data) => api.post('/api/client/appointments', data),
  getDoctors: () => api.get('/api/client/appointments/create'),
  getDoctorSchedule: (doctorId) => api.get(`/api/client/appointments/doctors/${doctorId}/schedule`),
  cancelAppointment: (id) => api.patch(`/api/client/appointments/${id}/cancel`),
  
  // Shop
  getProducts: (params) => api.get('/api/client/shop', { params }),
  getProduct: (id) => api.get(`/api/client/shop/${id}`),
  
  // Cart
  getCart: () => api.get('/api/client/cart'),
  addToCart: (data) => api.post('/api/client/cart', data),
  updateCartItem: (id, data) => api.put(`/api/client/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/api/client/cart/${id}`),
  clearCart: () => api.delete('/api/client/cart'),
  
  // Orders
  getOrders: (params) => api.get('/api/client/orders', { params }),
  getOrder: (id) => api.get(`/api/client/orders/${id}`),
  createOrder: (data) => api.post('/api/client/orders', data),
  
  // Prescriptions
  getPrescriptions: () => api.get('/api/client/prescriptions'),
  getPrescription: (id) => api.get(`/api/client/prescriptions/${id}`),
  
  // Profile
  updateProfile: (data) => api.put('/api/client/profile', data),
  updatePassword: (data) => api.put('/api/client/profile/password', data),
};

// Notifications API
export const notificationAPI = {
  getNotifications: () => api.get('/api/notifications'),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
};
