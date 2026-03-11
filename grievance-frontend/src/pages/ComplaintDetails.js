import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, User, MapPin, Calendar, Shield, Clock, AlertTriangle, Image as ImageIcon, Activity } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import Timeline from '../components/ui/Timeline';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Complaint Not Found</h2>
        <p className="text-neutral-600 mb-6">{error || "The complaint you're looking for doesn't exist or you don't have permission to view it."}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  // Generate timeline events based on complaint data for visual demonstration
  const timelineEvents = [
    {
      id: 1,
      title: 'Complaint Logged',
      description: 'The grievance was successfully submitted into the system.',
      date: new Date(complaint.createdAt).toLocaleString(),
      status: 'completed'
    }
  ];

  if (complaint.assignedTo) {
    timelineEvents.push({
      id: 2,
      title: 'Resolution Officer Assigned',
      description: `Assigned to an officer in the ${complaint.category} department.`,
      date: new Date(complaint.createdAt).toLocaleString(), // Mocking date for now
      status: 'completed'
    });
  }

  if (complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Verified') {
    timelineEvents.push({
      id: 3,
      title: 'Investigation In Progress',
      description: 'The assigned officer has begun investigating the reported issue.',
      date: new Date(new Date(complaint.createdAt).getTime() + 86400000).toLocaleString(), // Mocking date
      status: 'completed'
    });
  }

  if (complaint.status === 'Escalated') {
    timelineEvents.push({
      id: 4,
      title: 'Escalated',
      description: 'SLA breached. Complaint moved to higher authorities.',
      date: new Date(complaint.slaDeadline || new Date()).toLocaleString(),
      status: 'error'
    });
  } else if (complaint.status === 'Resolved' || complaint.status === 'Verified') {
    timelineEvents.push({
      id: 5,
      title: 'Issue Resolved',
      description: complaint.resolutionNotes || 'The officer marked this issue as fully resolved.',
      date: new Date(new Date(complaint.createdAt).getTime() + 172800000).toLocaleString(), // Mocking date
      status: 'completed'
    });
  } else {
    timelineEvents.push({
      id: 99,
      title: 'Awaiting Resolution',
      description: 'Authorities are currently processing the next steps.',
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
          Back to Dashboard
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                  {complaint.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    {complaint.userId?.name || 'Citizen'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">
                    {complaint.category}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 pt-1">
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>

            <div className="prose prose-neutral max-w-none mb-8">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed border-l-4 border-neutral-200 pl-4 py-1.5">
                {complaint.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-neutral-400" />
                  Location
                </h3>
                <p className="text-neutral-600">{complaint.location}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-neutral-400" />
                  Filed On
                </h3>
                <p className="text-neutral-600">
                  {format(new Date(complaint.createdAt), 'PPP p')}
                </p>
              </div>

              {complaint.assignedTo && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                    <Shield className="w-4 h-4 mr-1.5 text-primary-500" />
                    Assigned Officer
                  </h3>
                  <p className="text-neutral-600 font-medium">{complaint.assignedTo.name}</p>
                  <p className="text-xs text-neutral-400">{complaint.assignedTo.department}</p>
                </div>
              )}

              {complaint.slaDeadline && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center">
                    <Clock className={'w-4 h-4 mr-1.5 ' + (new Date(complaint.slaDeadline) < new Date() ? 'text-danger-500' : 'text-warning-500')} />
                    SLA Deadline
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
                  Supported by {complaint.upvotes} citizens
                </div>
              </div>
            )}
          </div>

          {/* Evidence/Attachments - Conditionally Rendered */}
          {complaint.imageUrl && (
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6 overflow-hidden">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-neutral-400" />
                Photographic Evidence
              </h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${complaint.imageUrl}`} 
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
        </div>

        {/* Right Column: Timeline & Side Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Resolution History</h2>
            <Timeline events={timelineEvents} />
          </div>

          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start">
            <AlertTriangle className="w-6 h-6 text-primary-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-primary-900 mb-1">Accountability Notice</h3>
              <p className="text-xs text-primary-800 leading-relaxed">
                This grievance is tracked against our Service Level Agreement (SLA). The assigned officer is mandated to respond and resolve this within the stipulated timeframe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
