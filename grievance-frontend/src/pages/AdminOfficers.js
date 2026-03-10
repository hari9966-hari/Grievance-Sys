import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { UserPlus, Edit3, Trash2, X } from 'lucide-react';
import Modal from '../components/ui/Modal';

export const AdminOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', department: '', authorityLevel: 1
  });

  const departments = [
    'Water Supply', 'Sanitation', 'Roads & Infrastructure', 
    'Public Health', 'Education', 'Police', 'Electricity', 
    'Parks & Recreation', 'Transportation', 'Other'
  ];

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await adminAPI.getOfficers();
      setOfficers(response.data.officers || []);
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      alert("Please fill all fields");
      return;
    }
    
    setSubmitting(true);
    try {
      await adminAPI.createOfficer(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', department: '', authorityLevel: 1 });
      fetchOfficers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating officer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOfficer = async (id) => {
    if (window.confirm("Are you sure you want to delete this officer? This action cannot be undone.")) {
      try {
        await adminAPI.deleteOfficer(id);
        fetchOfficers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting officer');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-soft border border-neutral-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Officers Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Add, update, and manage official personnel.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-soft hover:bg-primary-700 hover:shadow-card transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Officer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider hidden md:table-cell">Department</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">Level & Status</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {officers.length > 0 ? (
                officers.map((officer) => (
                  <tr key={officer._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{officer.name}</p>
                      <p className="text-neutral-500 sm:hidden">{officer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 hidden sm:table-cell">{officer.email}</td>
                    <td className="px-6 py-4 text-neutral-600 hidden md:table-cell">
                      {officer.department ? (
                        <span className="bg-neutral-100 px-2 py-1 rounded-md text-neutral-700 font-medium text-xs border border-neutral-200">{officer.department}</span>
                      ) : (
                        <span className="text-neutral-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-medium text-xs border border-primary-200/50">
                          Level {officer.authorityLevel}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          officer.isActive 
                            ? 'bg-success-50 text-success-700 border-success-200/50' 
                            : 'bg-danger-50 text-danger-700 border-danger-200/50'
                        }`}>
                          {officer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-primary-600 hover:text-primary-800 p-1.5 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOfficer(officer._id)}
                          className="text-danger-600 hover:text-danger-800 p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                    No officers have been added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Officer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Add New Officer</h3>
          <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleCreateOfficer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-xl border-neutral-300 py-2.5 px-3 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              placeholder="Officer Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full rounded-xl border-neutral-300 py-2.5 px-3 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              placeholder="officer@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Department</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full rounded-xl border-neutral-300 py-2.5 px-3 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              required
            >
              <option value="">Select a Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Authority Level</label>
              <select 
                value={formData.authorityLevel}
                onChange={(e) => setFormData({...formData, authorityLevel: parseInt(e.target.value)})}
                className="w-full rounded-xl border-neutral-300 py-2.5 px-3 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              >
                <option value={1}>Level 1 (Standard)</option>
                <option value={2}>Level 2 (Supervisor)</option>
                <option value={3}>Level 3 (Director)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full rounded-xl border-neutral-300 py-2.5 px-3 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                placeholder="Temporary Password"
                required
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
            <button 
              type="button" 
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl shadow-soft hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl shadow-soft hover:bg-primary-700 transition-colors disabled:opacity-70"
            >
              {submitting ? 'Creating...' : 'Create Officer'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminOfficers;
