import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import FileUpload from '../components/ui/FileUpload';
import Modal from '../components/ui/Modal';
import { AlertTriangle, MapPin, Tag, Type, AlignLeft } from 'lucide-react';

export const CreateComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null
  });

  const categories = [
    'Water Supply',
    'Sanitation',
    'Roads & Infrastructure',
    'Public Health',
    'Education',
    'Police',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await complaintAPI.createComplaint(data);
      
      if (response.data.success) {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.duplicateComplaintId) {
        setDuplicate({
          id: err.response.data.duplicateComplaintId,
          title: err.response.data.duplicateComplaintTitle,
          status: err.response.data.duplicateComplaintStatus
        });
        setDuplicateModalOpen(true);
      } else {
        setError(err.response?.data?.message || 'Error creating complaint');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async () => {
    if (!duplicate) return;
    
    try {
      setLoading(true);
      await complaintAPI.supportComplaint(duplicate.id);
      setDuplicateModalOpen(false);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError('Error supporting complaint');
      setDuplicateModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Raise Complaint</h1>
        <p className="text-sm text-neutral-500 mt-1">Submit a new issue to the authorities for rapid resolution.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-danger-50 p-4 border border-danger-100 flex items-start">
          <AlertTriangle className="h-5 w-5 text-danger-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-danger-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 border border-neutral-100 space-y-6">
        
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Title Box */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Complaint Title *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Type className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                placeholder="Brief summary of the issue (e.g. Broken Pipe on Main St)"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Tag className="h-4 w-4 text-neutral-400" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                required
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Location *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                placeholder="Specific address or landmark"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Detailed Description *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute top-3 left-3">
                <AlignLeft className="h-4 w-4 text-neutral-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                placeholder="Elaborate on the details..."
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Photographic Evidence (Optional)</label>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="mr-4 bg-white text-neutral-700 px-6 py-2.5 rounded-xl font-medium border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-soft hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-card"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>

      {/* Duplicate Modal */}
      <Modal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        title={
          <div className="flex items-center text-warning-600">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Similar Complaint Detected
          </div>
        }
      >
        <div className="text-sm text-neutral-600 space-y-4">
          <p>
            It looks like this issue has already been reported. Centralizing reports helps the authorities resolve issues faster!
          </p>
          
          {duplicate && (
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <p className="font-semibold text-neutral-900 mb-1">{duplicate.title}</p>
              <p className="text-neutral-500 text-xs">Current Status: <span className="font-medium text-neutral-700">{duplicate.status}</span></p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 mt-6 border-t border-neutral-100">
            <button
              onClick={() => setDuplicateModalOpen(false)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSupport}
              disabled={loading}
              className="px-4 py-2 bg-warning-500 rounded-lg text-sm font-medium text-white hover:bg-warning-600 disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Support Existing Issue'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateComplaint;
