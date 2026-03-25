import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, User, MapPin, Calendar, Shield, Clock, AlertTriangle, Image as ImageIcon, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StatusBadge from '../components/ui/StatusBadge';
import Timeline from '../components/ui/Timeline';
import VerificationRating from '../components/ui/VerificationRating';
import translations from '../utils/translations';
import { useAuth } from '../context/AuthContext';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await complaintAPI.getComplaintById(id);
        setComplaint(response.data.complaint);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching complaint details');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white rounded-2xl shadow-soft border border-neutral-100">
        <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">{t('details.notFound')}</h2>
        <p className="text-neutral-600 mb-6">{error || (language === 'en' ? "The complaint you're looking for doesn't exist or you don't have permission to view it." : "நீங்கள் தேடும் புகார் இல்லை அல்லது அதைப் பார்க்க உங்களுக்கு அனுமதி இல்லை.")}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Go Back' : 'பின்செல்லவும்'}
        </button>
      </div>
    );
  }

  // Generate timeline events based on complaint data for visual demonstration
  const timelineEvents = [
    {
      id: 1,
      title: language === 'en' ? 'Complaint Logged' : 'புகார் பதிவு செய்யப்பட்டது',
      description: language === 'en' ? 'The grievance was successfully submitted into the system.' : 'முறைப்பாடு வெற்றிகரமாக அமைப்பில் சமர்ப்பிக்கப்பட்டது.',
      date: new Date(complaint.createdAt).toLocaleString(),
      status: 'completed'
    }
  ];

  if (complaint.assignedTo) {
    timelineEvents.push({
      id: 2,
      title: language === 'en' ? 'Resolution Officer Assigned' : 'தீர்வு அதிகாரி நியமிக்கப்பட்டார்',
      description: language === 'en' ? `Assigned to an officer in the ${complaint.category} department.` : `${complaint.category} துறையில் உள்ள ஒரு அதிகாரிக்கு ஒதுக்கப்பட்டது.`,
      date: new Date(complaint.createdAt).toLocaleString(), // Mocking date for now
      status: 'completed'
    });
  }

  if (complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Verified') {
    timelineEvents.push({
      id: 3,
      title: language === 'en' ? 'Investigation In Progress' : 'விசாரணை செயல்பாட்டில் உள்ளது',
      description: language === 'en' ? 'The assigned officer has begun investigating the reported issue.' : 'ஒதுக்கப்பட்ட அதிகாரி புகாரளிக்கப்பட்ட சிக்கலை விசாரிக்கத் தொடங்கியுள்ளார்.',
      date: new Date(new Date(complaint.createdAt).getTime() + 86400000).toLocaleString(), // Mocking date
      status: 'completed'
    });
  }

  if (complaint.status === 'Escalated') {
    timelineEvents.push({
      id: 4,
      title: t('status.escalated'),
      description: language === 'en' ? 'SLA breached. Complaint moved to higher authorities.' : 'SLA மீறப்பட்டது. புகார் உயர் அதிகாரிகளுக்கு மாற்றப்பட்டது.',
      date: new Date(complaint.slaDeadline || new Date()).toLocaleString(),
      status: 'error'
    });
  } else if (complaint.status === 'Resolved' || complaint.status === 'Verified') {
    timelineEvents.push({
      id: 5,
      title: language === 'en' ? 'Issue Resolved' : 'சிக்கல் தீர்க்கப்பட்டது',
      description: complaint.resolutionNotes || (language === 'en' ? 'The officer marked this issue as fully resolved.' : 'அதிகாரி இந்த சிக்கலை முழுமையாக தீர்க்கப்பட்டதாகக் குறித்தார்.'),
      date: new Date(new Date(complaint.createdAt).getTime() + 172800000).toLocaleString(), // Mocking date
      status: 'completed'
    });
  } else {
    timelineEvents.push({
      id: 99,
      title: language === 'en' ? 'Awaiting Resolution' : 'தீர்வுக்காக காத்திருக்கிறது',
      description: language === 'en' ? 'Authorities are currently processing the next steps.' : 'அதிகாரிகள் தற்போது அடுத்த கட்ட நடவடிக்கைகளை மேற்கொண்டு வருகின்றனர்.',
      date: 'Pending',
      status: 'pending'
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Page Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {t('details.backToDashboard')}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                  {complaint.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    {complaint.createdBy?.name || 'Citizen'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">
                    {language === 'en' ? complaint.category : (translations.ta.categories?.[complaint.category] || complaint.category)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 pt-1">
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>

            <div className="prose prose-neutral max-w-none mb-8">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-2">{t('details.description')}</h3>
              <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed border-l-4 border-neutral-200 pl-4 py-1.5">
                {complaint.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-neutral-400" />
                  {t('details.location')}
                </h3>
                <p className="text-neutral-600">{complaint.location}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-neutral-400" />
                  {t('details.filedOn')}
                </h3>
                <p className="text-neutral-600">
                  {format(new Date(complaint.createdAt), 'PPP p')}
                </p>
              </div>

              {complaint.assignedTo && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                    <Shield className="w-4 h-4 mr-1.5 text-primary-500" />
                    {t('details.assignedOfficer')}
                  </h3>
                  <p className="text-neutral-600 font-medium">{complaint.assignedTo.name}</p>
                  <p className="text-xs text-neutral-400">{complaint.assignedTo.department}</p>
                </div>
              )}

              {complaint.slaDeadline && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                    <Clock className={'w-4 h-4 mr-1.5 ' + (new Date(complaint.slaDeadline) < new Date() ? 'text-danger-500' : 'text-warning-500')} />
                    {t('details.slaDeadline')}
                  </h3>
                  <p className={'font-medium ' + (new Date(complaint.slaDeadline) < new Date() ? 'text-danger-600' : 'text-neutral-600')}>
                    {format(new Date(complaint.slaDeadline), 'PPP p')}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDistanceToNow(new Date(complaint.slaDeadline), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>

            {complaint.upvotes > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <div className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-100">
                  <Activity className="w-4 h-4 mr-2" />
                  {t('details.supportedBy')} {complaint.upvotes} {t('details.citizens')}
                </div>
              </div>
            )}
          </div>

          {/* Evidence/Attachments - Conditionally Rendered */}
          {complaint.image && (
            <div className="glass-card p-6 overflow-hidden">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-neutral-400" />
                {t('details.evidence')}
              </h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${complaint.image}`} 
                  alt="Complaint Evidence" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.parentElement.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center text-neutral-400"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="mt-2 text-sm font-medium">Image could not be loaded</span></div>';
                  }}
                />
              </div>
            </div>
          )}

          {/* Verification & Rating Section */}
          {currentUser?._id === complaint.createdBy?._id && 
            (complaint.status === 'Resolved' || (complaint.status === 'Closed' && !complaint.rating)) && (
            <VerificationRating 
              complaintId={complaint._id} 
              onUpdate={() => {
                // Refresh complaint data
                complaintAPI.getComplaintById(id).then(res => setComplaint(res.data.complaint));
              }} 
            />
          )}
        </div>

        {/* Right Column: Timeline & Side Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">{t('details.history')}</h2>
            <Timeline items={timelineEvents} />
          </div>

          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start">
            <AlertTriangle className="w-6 h-6 text-primary-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-primary-900 mb-1">
                {language === 'en' ? 'Accountability Notice' : 'பொறுப்புக்கூறல் அறிவிப்பு'}
              </h3>
              <p className="text-xs text-primary-800 leading-relaxed">
                {language === 'en' 
                  ? 'This grievance is tracked against our Service Level Agreement (SLA). The assigned officer is mandated to respond and resolve this within the stipulated timeframe.' 
                  : 'இந்த குறை எமது சேவை நிலை ஒப்பந்தத்திற்கு (SLA) எதிராக கண்காணிக்கப்படுகிறது. ஒதுக்கப்பட்ட அதிகாரி குறிப்பிட்ட காலக்கெடுவுக்குள் பதிலளிக்கவும் தீர்க்கவும் கட்டாயப்படுத்தப்படுகிறார்.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
