import axiosInstance from './axiosConfig';

/**
 * Authentication API calls
 */

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  getMe: () => axiosInstance.get('/auth/me'),
  updateProfile: (data) => axiosInstance.put('/auth/update-profile', data),
  verifyEmail: () => axiosInstance.post('/auth/verify-email'),
  getUserStats: () => axiosInstance.get('/auth/stats')
};

/**
 * Complaint API calls
 */

export const complaintAPI = {
  createComplaint: (formData) => 
    axiosInstance.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getComplaints: (params) => axiosInstance.get('/complaints', { params }),
  getComplaintById: (id) => axiosInstance.get(`/complaints/${id}`),
  updateComplaintStatus: (id, data) => axiosInstance.put(`/complaints/${id}`, data),
  supportComplaint: (complaintId) => axiosInstance.post(`/complaints/${complaintId}/support`),
  getStats: () => axiosInstance.get('/complaints/stats/dashboard'),
  markAsFake: (id) => axiosInstance.post(`/complaints/${id}/mark-fake`)
};

/**
 * Admin API calls
 */

export const adminAPI = {
  // Officer Management
  createOfficer: (data) => axiosInstance.post('/admin/officers', data),
  getOfficers: () => axiosInstance.get('/admin/officers'),
  updateOfficer: (id, data) => axiosInstance.put(`/admin/officers/${id}`, data),
  deleteOfficer: (id) => axiosInstance.delete(`/admin/officers/${id}`),

  // SLA Rules
  createSLARule: (data) => axiosInstance.post('/admin/sla-rules', data),
  getSLARules: () => axiosInstance.get('/admin/sla-rules'),

  // Complaint Management
  reassignComplaint: (id, data) => axiosInstance.put(`/admin/complaints/${id}/reassign`, data),
  forceCloseComplaint: (id, data) => axiosInstance.put(`/admin/complaints/${id}/force-close`, data),

  // Analytics
  getAnalytics: () => axiosInstance.get('/admin/analytics'),
  getEscalationReport: () => axiosInstance.get('/admin/escalation-report'),

  // User Management
  penalizeUser: (id, data) => axiosInstance.post(`/admin/users/${id}/penalize`, data)
};
