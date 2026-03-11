import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Clock, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import DashboardCard from '../components/ui/DashboardCard';
import Modal from '../components/ui/Modal';

export const OfficerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsRes = await complaintAPI.getComplaints({ limit: 50 });
        setComplaints(complaintsRes.data.complaints);

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
    } catch (error) {
      alert('Error updating complaint');
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
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Officer Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage and resolve your assigned complaints.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Open"
          value={stats?.pending || 0}
          icon={AlertCircle}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title="In Progress"
          value={stats?.pending || 0}
          icon={Clock}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          colorClass="text-success-600"
          bgClass="bg-success-50"
        />
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">Complaint</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">Status & SLA</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">Created</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">
                    No assigned complaints.
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
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{complaint.category}</span>
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update
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

      {/* Update Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={<div className="text-neutral-900 font-semibold">{selectedComplaint?.title}</div>}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Update Status</label>
            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="block w-full rounded-xl border-neutral-300 py-2.5 px-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
            >
              <option value="">Select status</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Resolution Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="block w-full rounded-xl border-neutral-300 py-2.5 px-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
              placeholder="Add details about the resolution or next steps..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="flex-1 bg-white text-neutral-700 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={!updateStatus}
              className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium shadow-soft hover:shadow-card"
            >
              Save Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
