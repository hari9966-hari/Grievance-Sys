import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { adminAPI } from '../services/api';
import DashboardCard from '../components/ui/DashboardCard';
import { Activity, Clock, ShieldCheck, Users } from 'lucide-react';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statusData = [
    { name: 'Open', value: analytics?.openComplaints || 0 },
    { name: 'In Progress', value: analytics?.inProgressComplaints || 0 },
    { name: 'Resolved', value: analytics?.resolvedComplaints || 0 },
    { name: 'Escalated', value: analytics?.escalatedComplaints || 0 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">System Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Detailed breakdown of grievance statistics and system usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Complaints"
          value={analytics?.totalComplaints || 0}
          icon={Activity}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title="Resolved"
          value={analytics?.resolvedComplaints || 0}
          icon={ShieldCheck}
          colorClass="text-success-600"
          bgClass="bg-success-50"
        />
        <DashboardCard
          title="Pending"
          value={analytics?.pendingComplaints || 0}
          icon={Clock}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={Users}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 w-full">Complaint Status Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 flex flex-col justify-center space-y-8">
          <div>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-sm font-semibold text-neutral-600">Resolution Rate</h2>
              <span className="text-2xl font-bold text-success-600">
                {analytics?.totalComplaints ? Math.round((analytics.resolvedComplaints / analytics.totalComplaints) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalComplaints ? (analytics.resolvedComplaints / analytics.totalComplaints) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-sm font-semibold text-neutral-600">Escalation Rate</h2>
              <span className="text-2xl font-bold text-danger-600">
                {analytics?.totalComplaints ? Math.round((analytics.escalatedComplaints / analytics.totalComplaints) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-danger-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalComplaints ? (analytics.escalatedComplaints / analytics.totalComplaints) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-sm font-semibold text-neutral-600">Pending Rate</h2>
              <span className="text-2xl font-bold text-warning-600">
                {analytics?.totalComplaints ? Math.round((analytics.pendingComplaints / analytics.totalComplaints) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-warning-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalComplaints ? (analytics.pendingComplaints / analytics.totalComplaints) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-soft border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Executive Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 divide-x divide-neutral-100">
          <div className="pl-0 sm:pr-6">
            <div className="text-neutral-500 text-sm font-medium mb-1">Avg Resolution Time</div>
            <div className="text-3xl font-bold text-neutral-900">{analytics?.avgResolutionTime || '0'} hrs</div>
          </div>
          <div className="pl-6 sm:pr-6">
            <div className="text-neutral-500 text-sm font-medium mb-1">Total Officers</div>
            <div className="text-3xl font-bold text-neutral-900">{analytics?.totalOfficers || 0}</div>
          </div>
          <div className="pl-6 md:pl-6 col-span-2 md:col-span-1 pt-6 md:pt-0 border-t md:border-t-0 border-neutral-100 mt-2 md:mt-0">
            <div className="text-neutral-500 text-sm font-medium mb-1">Active Citizens</div>
            <div className="text-3xl font-bold text-neutral-900">{analytics?.activeCitizens || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
