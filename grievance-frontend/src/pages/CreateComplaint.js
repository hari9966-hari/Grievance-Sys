import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI, authAPI } from '../services/api';
import FileUpload from '../components/ui/FileUpload';
import LocationPicker from '../components/ui/LocationPicker';
import Modal from '../components/ui/Modal';
import { AlertTriangle, MapPin, Tag, Type, AlignLeft, ShieldAlert } from 'lucide-react';
import translations from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';

export const CreateComplaint = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    severity: 'Medium',
    image: null,
    coordinates: null,
    email: ''
  });

  const severities = ['Low', 'Medium', 'High', 'Critical'];

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

  const handleLocationSelect = (coords) => {
    setFormData(prev => ({ ...prev, coordinates: coords }));
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
      data.append('email', formData.email);
      data.append('priority', formData.severity); // existing field in model is 'priority'
      
      if (formData.coordinates) {
        data.append('lat', formData.coordinates.lat);
        data.append('lng', formData.coordinates.lng);
      }

      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await complaintAPI.createComplaint(data);
      
      if (response.data.success) {
        showNotification('Complaint submitted successfully!', 'success');
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('Email verification required')) {
        // Workaround: Trigger verification and retry
        try {
          await authAPI.verifyEmail();
          // Retry logic (redeclaring data for simplicity in catch scope)
          const data = new FormData();
          data.append('title', formData.title);
          data.append('description', formData.description);
          data.append('category', formData.category);
          data.append('location', formData.location);
          data.append('email', formData.email);
          data.append('priority', formData.severity);
          
          if (formData.coordinates) {
            data.append('lat', formData.coordinates.lat);
            data.append('lng', formData.coordinates.lng);
          }

          if (formData.image) data.append('image', formData.image);

          const retryResponse = await complaintAPI.createComplaint(data);
          if (retryResponse.data.success) {
            showNotification('Complaint submitted successfully!', 'success');
            navigate('/citizen/dashboard');
            return;
          }
        } catch (verifyErr) {
          showNotification('Email verification required. Please check your settings.', 'warning');
          setError('Email verification required. Please check your settings.');
          return;
        }
      }

      if (err.response?.data?.duplicateComplaintId) {
        setDuplicate({
          id: err.response.data.duplicateComplaintId,
          title: err.response.data.duplicateComplaintTitle,
          status: err.response.data.duplicateComplaintStatus
        });
        showNotification('Similar complaint detected in this area.', 'warning');
        setDuplicateModalOpen(true);
      } else {
        showNotification(err.response?.data?.message || 'Error creating complaint', 'error');
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
      showNotification('Thank you for supporting this issue!', 'success');
      setDuplicateModalOpen(false);
      navigate('/citizen/dashboard');
    } catch (err) {
      showNotification('Error supporting complaint', 'error');
      setError('Error supporting complaint');
      setDuplicateModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t('nav.createComplaint')}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {language === 'en' ? 'Submit a new issue to the authorities for rapid resolution.' : 'விரைவான தீர்வுக்காக அதிகாரிகளிடம் புதிய புகாரைச் சமர்ப்பிக்கவும்.'}
        </p>
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
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.title')} *</label>
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
                placeholder={language === 'en' ? "Brief summary of the issue (e.g. Broken Pipe on Main St)" : "சிக்கலின் சுருக்கமான விவரம் (எ.கா. மெயின் தெருவில் உடைந்த குழாய்)"}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.category')} *</label>
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
                <option value="">{language === 'en' ? 'Select category...' : 'வகையைத் தேர்ந்தெடுக்கவும்...'}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{language === 'en' ? cat : (translations.ta.categories?.[cat] || cat)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.location')} *</label>
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
                placeholder={language === 'en' ? "Specific address or landmark" : "குறிப்பிட்ட முகவரி அல்லது அடையாளம்"}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                {language === 'en' ? 'Pin accurate location on map' : 'வரைபடத்தில் துல்லியமான இருப்பிடத்தைக் குறிக்கவும்'}
              </label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>
          </div>

          {/* Email for Notifications */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {language === 'en' ? 'Email for Notifications' : 'அறிவிப்புகளுக்கான மின்னஞ்சல்'}
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                placeholder={language === 'en' ? "Email address to receive updates" : "புதுப்பிப்புகளைப் பெறுவதற்கான மின்னஞ்சல் முகவரி"}
              />
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              {language === 'en' ? 'Leave blank to use your account email.' : 'உங்கள் கணக்கு மின்னஞ்சலைப் பயன்படுத்த இதைக் காலியாக விடவும்.'}
            </p>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.severity')} *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldAlert className="h-4 w-4 text-neutral-400" />
              </div>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-neutral-300 pl-10 py-2.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors font-medium text-primary-700"
                required
              >
                {severities.map(sev => (
                  <option key={sev} value={sev}>{t(`severity.${sev.toLowerCase()}`)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.description')} *</label>
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
                placeholder={language === 'en' ? "Elaborate on the details..." : "விவரங்களை விரிவாகக் கூறவும்..."}
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('form.uploadImage')}</label>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="mr-4 bg-white text-neutral-700 px-6 py-2.5 rounded-xl font-medium border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors"
          >
            {t('form.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-soft hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-card"
          >
            {loading ? (language === 'en' ? 'Submitting...' : 'சமர்ப்பிக்கிறது...') : t('form.submit')}
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
