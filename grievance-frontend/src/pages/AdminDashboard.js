import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, TrendingDown, CheckCircle, Activity } from 'lucide-react';
import DashboardCard from '../components/ui/DashboardCard';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">System Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">High-level metrics and system performance.</p>
      </div>

      {/* Key Metrics */}
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
          icon={CheckCircle}
          colorClass="text-success-600"
          bgClass="bg-success-50"
          trend={{ value: `${analytics?.resolutionRate || 0}%`, label: 'resolution rate' }}
        />
        <DashboardCard
          title="Escalated Actions"
          value={analytics?.escalatedComplaints || 0}
          icon={AlertTriangle}
          colorClass="text-danger-600"
          bgClass="bg-danger-50"
        />
        <DashboardCard
          title="Recurring Issues"
          value={analytics?.recurringIssues || 0}
          icon={TrendingDown}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        {analytics?.departmentStats && analytics.departmentStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Department Performance</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                  <Bar dataKey="total" fill="#3b82f6" name="Total Actions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="escalated" fill="#ef4444" name="Escalated" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Officer Performance */}
          {analytics?.officerStats && analytics.officerStats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Top Performing Officers</h2>
              <div className="space-y-6">
                {analytics.officerStats.slice(0, 5).map((officer, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">{officer.name}</p>
                      <p className="text-xs text-neutral-500">{officer.department}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-neutral-900">{officer.resolvedComplaintCount}</p>
                        <p className="text-xs text-neutral-500">Resolved</p>
                      </div>
                      <div className="w-24 bg-neutral-100 rounded-full h-2 hidden sm:block">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${(officer.performanceScore || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Category Breakdown */}
          {analytics?.departmentStats && analytics.departmentStats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Volume by Department</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.departmentStats}
                      dataKey="total"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {analytics.departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
