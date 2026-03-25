import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, Clock, ChevronRight, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EscalationWatch = () => {
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchList();
  }, []);

  const fetchWatchList = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEscalationWatch();
      if (response.data.success) {
        setWatchList(response.data.watchList);
      }
    } catch (error) {
      console.error('Error fetching escalation watch list:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-danger-100 text-danger-700 border-danger-200';
      case 'High': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Medium': return 'bg-primary-100 text-primary-700 border-primary-200';
      default: return 'bg-success-100 text-success-700 border-success-200';
    }
  };

  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff < 0) return language === 'en' ? 'OVERDUE' : 'காலாவதியானது';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return language === 'en' ? `${hours}h ${minutes}m` : `${hours}ம ${minutes}நி`;
    return language === 'en' ? `${minutes}m` : `${minutes}நி`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft animate-pulse">
        <div className="h-6 w-48 bg-neutral-100 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-neutral-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-warning-100/30 flex justify-between items-center bg-warning-50/10">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-danger-600" />
          <h2 className="text-lg font-bold text-neutral-900">
            {language === 'en' ? 'Escalation Watch' : 'கண்காணிப்புப் பட்டியல்'}
          </h2>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-danger-100 text-danger-700 text-xs font-bold shadow-sm flex items-center gap-1.5 animate-pulse-slow">
          <span className="w-1.5 h-1.5 bg-danger-500 rounded-full animate-ping"></span>
          {watchList.length} {language === 'en' ? 'Urgent' : 'அவசரம்'}
        </span>
      </div>

      <div className="divide-y divide-neutral-50 max-h-[500px] overflow-y-auto">
        {watchList.length > 0 ? (
          watchList.map((complaint) => (
            <div 
              key={complaint._id}
              onClick={() => navigate(`/complaints/${complaint._id}`)}
              className="p-5 hover:bg-white/50 border-white/50 border-b last:border-0 transition-colors cursor-pointer group backdrop-blur-[2px]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  new Date(complaint.slaDeadline) < new Date() ? 'text-danger-600' : 'text-warning-600'
                }`}>
                  <Clock className="w-3 h-3" />
                  {getTimeRemaining(complaint.slaDeadline)}
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-neutral-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                {complaint.title}
              </h3>
              
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{complaint.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{complaint.assignedTo?.name || (language === 'en' ? 'Unassigned' : 'ஒதுக்கப்படவில்லை')}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-all group-hover:translate-x-2" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="bg-success-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
            <p className="text-sm font-medium text-neutral-600">
              {language === 'en' ? 'All clear! No urgent escalations.' : 'அனைத்தும் சரி! அவசர புகார்கள் ஏதுமில்லை.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalationWatch;
