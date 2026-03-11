import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { complaintAPI } from '../services/api';
import DashboardCard from '../components/ui/DashboardCard';
import { Activity, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const OfficerPerformance = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await complaintAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalAssigned = stats?.total || 0;
  const inProgress = stats?.pending || 0;
  const resolved = stats?.resolved || 0;
  const escalated = stats?.escalated || 0;

  const data = [
    { name: 'Assigned', value: totalAssigned },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
    { name: 'Escalated', value: escalated }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Performance Metrics</h1>
        <p className="text-sm text-neutral-500 mt-1">Review your resolution rates and task distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Assigned"
          value={totalAssigned}
          icon={Activity}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title="In Progress"
          value={inProgress}
          icon={Clock}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title="Resolved"
          value={resolved}
          icon={ShieldCheck}
          colorClass="text-success-600"
          bgClass="bg-success-50"
        />
        <DashboardCard
          title="Escalated"
          value={escalated}
          icon={AlertCircle}
          colorClass="text-danger-600"
          bgClass="bg-danger-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Status Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 flex flex-col justify-center space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Resolution Rate</h2>
            <p className="text-sm text-neutral-500 mb-3">Percentage of assigned issues successfully resolved</p>
            <div className="text-4xl font-bold text-success-600">
              {resolved && totalAssigned ? Math.round((resolved / totalAssigned) * 100) : 0}%
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 mt-3">
              <div className="bg-success-500 h-2 rounded-full" style={{ width: `${resolved && totalAssigned ? Math.round((resolved / totalAssigned) * 100) : 0}%` }}></div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Escalation Rate</h2>
            <p className="text-sm text-neutral-500 mb-3">Tasks delayed past SLA</p>
            <div className="text-4xl font-bold text-danger-600">
              {escalated && totalAssigned ? Math.round((escalated / totalAssigned) * 100) : 0}%
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 mt-3">
              <div className="bg-danger-500 h-2 rounded-full" style={{ width: `${escalated && totalAssigned ? Math.round((escalated / totalAssigned) * 100) : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerPerformance;
