import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Clock, AlertCircle, CheckCircle, Edit3, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DashboardCard from '../components/ui/DashboardCard';
import Modal from '../components/ui/Modal';
import FilterBar from '../components/ui/FilterBar';
import LiveCountdown from '../components/ui/LiveCountdown';
import translations from '../utils/translations';
import { useNotification } from '../context/NotificationContext';

const OfficerDashboard = () => {
  const { language, t } = useLanguage();
  const { showNotification } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async (filterParams = {}) => {
    try {
      const response = await complaintAPI.getComplaints({ ...filterParams, limit: 50 });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchComplaints();

        const statsRes = await complaintAPI.getStats();
        setStats(statsRes.data.stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    fetchComplaints(newFilters);
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !updateStatus) return;

    try {
      await complaintAPI.updateComplaintStatus(selectedComplaint._id, {
        status: updateStatus,
        resolutionNotes: notes
      });

      setSelectedComplaint(null);
      setUpdateStatus('');
      setNotes('');

      // Refresh complaints
      const res = await complaintAPI.getComplaints({ limit: 50 });
      setComplaints(res.data.complaints);
      
      const statsRes = await complaintAPI.getStats();
      setStats(statsRes.data.stats);
      showNotification(`Complaint status updated to ${updateStatus}`, 'success');
    } catch (error) {
      showNotification('Error updating complaint', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-success-50 text-success-600 ring-1 ring-inset ring-success-500/20">Resolved</span>;
      case 'In Progress':
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-500/20">In Progress</span>;
      case 'Verified':
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-500/20">Verified</span>;
      case 'Escalated':
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-500/20">Escalated</span>;
      case 'Closed':
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-neutral-50 text-neutral-600 ring-1 ring-inset ring-neutral-500/20">Closed</span>;
      default:
        return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-500/20">{status || 'Pending'}</span>;
    }
  };

  const calculateSLAStatus = (deadline) => {
    if (!deadline) return { status: 'No SLA', color: 'text-neutral-500' };
    const now = new Date();
    const daysLeft = (new Date(deadline) - now) / (1000 * 60 * 60 * 24);
    
    if (daysLeft < 0) return { status: 'Overdue', color: 'text-danger-600' };
    if (daysLeft < 1) return { status: 'Urgent', color: 'text-warning-600' };
    return { status: `${Math.floor(daysLeft)} days left`, color: 'text-success-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{language === 'en' ? 'Officer Dashboard' : 'அதிகாரி டாஷ்போர்டு'}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {language === 'en' ? 'Manage and resolve your assigned complaints.' : 'உங்களுக்கு ஒதுக்கப்பட்ட புகார்களை நிர்வகிக்கவும் மற்றும் தீர்க்கவும்.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={language === 'en' ? 'Total Assigned' : 'மொத்தம்'}
          value={stats?.total || 0}
          icon={Clock}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title={t('dashboard.resolved')}
          value={stats?.resolved || 0}
          icon={CheckCircle}
          colorClass="text-success-600"
          bgClass="bg-success-50"
        />
        <DashboardCard
          title={t('dashboard.pending')}
          value={stats?.pending || 0}
          icon={AlertCircle}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title={t('dashboard.escalated')}
          value={stats?.escalated || 0}
          icon={AlertTriangle}
          colorClass="text-danger-600"
          bgClass="bg-danger-50"
        />
      </div>

      {/* Live Alerts Section */}
      {complaints.filter(c => {
         const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
         return daysLeft < 2 && c.status !== 'Resolved' && c.status !== 'Closed';
      }).length > 0 && (
        <div className="animate-slide-up bg-warning-50/50 p-6 rounded-3xl border border-warning-100/50 backdrop-blur-sm -mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-warning-500"></span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              {language === 'en' ? 'Urgent Actions Required' : 'அவசர நடவடிக்கை தேவை'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.filter(c => {
               const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
               return daysLeft < 2 && c.status !== 'Resolved' && c.status !== 'Closed';
            }).slice(0, 3).map(c => {
              const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
              return (
              <div key={c._id} className={`glass-card p-4 border-l-4 ${daysLeft < 0 ? 'border-l-danger-500 bg-danger-50/10' : 'border-l-warning-500'} flex items-start gap-4 cursor-pointer hover:bg-white/50 transition-colors`} onClick={() => setSelectedComplaint(c)}>
                <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${daysLeft < 0 ? 'text-danger-500' : 'text-warning-500'}`} />
                <div className="w-full">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-neutral-900 line-clamp-1 pr-2">{c.title}</p>
                    <LiveCountdown deadline={c.slaDeadline} status={c.status} />
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    {c.trackingId || c._id.slice(0,8)} • {c.priority || 'High Priority'}
                  </p>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        <FilterBar 
          onFilterChange={handleFilterChange} 
          categories={stats?.byCategory.map(c => c._id) || []} 
        />
        <div className="glass-card overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                    {language === 'en' ? 'Complaint' : 'புகார்'}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                    {language === 'en' ? 'Status & SLA' : 'நிலை மற்றும் SLA'}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                    {language === 'en' ? 'Created' : 'உருவாக்கப்பட்டது'}
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-600 tracking-wider">
                    {language === 'en' ? 'Action' : 'நடவடிக்கை'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">
                      {language === 'en' ? 'No assigned complaints.' : 'ஒதுக்கப்பட்ட புகார்கள் எதுவும் இல்லை.'}
                    </td>
                  </tr>
                ) : (
                  complaints.map(complaint => {
                    const sla = calculateSLAStatus(complaint.slaDeadline);
                    return (
                      <tr key={complaint._id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-neutral-900 mb-1">{complaint.title}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-2">
                              <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                                  {language === 'en' ? complaint.category : (translations.ta.categories?.[complaint.category] || complaint.category)}
                              </span>
                              <span className="truncate max-w-[200px]">{complaint.location}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            {getStatusBadge(complaint.status)}
                            <div className={`text-xs font-semibold ${sla.color}`}>
                              {sla.status}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                          {complaint.rating && (
                            <div className="flex items-center gap-1 mt-1 text-warning-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-bold">{complaint.rating}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            {language === 'en' ? 'Update' : 'புதுப்பி'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={<div className="text-neutral-900 font-semibold">{selectedComplaint?.title}</div>}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {language === 'en' ? 'Update Status' : 'நிலையைப் புதுப்பிக்கவும்'}
            </label>
            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="block w-full rounded-xl border-neutral-300 py-2.5 px-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
            >
              <option value="">{language === 'en' ? 'Select status' : 'நிலையைத் தேர்ந்தெடுக்கவும்'}</option>
              <option value="Verified">{t('status.verified')}</option>
              <option value="In Progress">{t('status.inProgress')}</option>
              <option value="Resolved">{t('status.resolved')}</option>
              <option value="Escalated">{t('status.escalated')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {language === 'en' ? 'Resolution Notes' : 'தீர்வு குறிப்புகள்'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="block w-full rounded-xl border-neutral-300 py-2.5 px-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              placeholder={language === 'en' ? "Add details about the resolution or next steps..." : "தீர்வு அல்லது அடுத்த படிகள் பற்றிய விவரங்களைச் சேர்க்கவும்..."}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="flex-1 bg-white text-neutral-700 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium shadow-sm"
            >
              {t('form.cancel')}
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={!updateStatus}
              className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium shadow-soft hover:shadow-card"
            >
              {language === 'en' ? 'Save Update' : 'புதுப்பிப்பைச் சேமி'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
