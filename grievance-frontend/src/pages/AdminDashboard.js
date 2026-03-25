import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, CheckCircle, Activity, Star, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DashboardCard from '../components/ui/DashboardCard';
import EscalationWatch from '../components/ui/EscalationWatch';
import Leaderboard from '../components/ui/Leaderboard';

export const AdminDashboard = () => {
  const { language, t } = useLanguage();
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
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{language === 'en' ? 'System Overview' : 'அமைப்பு கண்ணோட்டம்'}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {language === 'en' ? 'High-level metrics and system performance.' : 'உயர்மட்ட அளவீடுகள் மற்றும் கணினி செயல்திறன்.'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={t('dashboard.totalComplaints')}
          value={analytics?.totalComplaints || 0}
          icon={Activity}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title={t('dashboard.resolved')}
          value={analytics?.resolvedComplaints || 0}
          icon={CheckCircle}
          colorClass="text-success-600"
          bgClass="bg-success-50"
          trend={{ value: `${analytics?.resolutionRate || 0}%`, label: language === 'en' ? 'resolution rate' : 'தீர்வு விகிதம்' }}
        />
        <DashboardCard
          title={language === 'en' ? 'Pending Actions' : 'நிலுவையில் உள்ள நடவடிக்கைகள்'}
          value={(analytics?.totalComplaints || 0) - (analytics?.resolvedComplaints || 0)}
          icon={Clock}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title={language === 'en' ? 'Escalated Actions' : 'எடுக்கப்பட்ட மேல்முறையீட்டு நடவடிக்கைகள்'}
          value={analytics?.escalatedComplaints || 0}
          icon={AlertTriangle}
          colorClass="text-danger-600"
          bgClass="bg-danger-50"
        />
      </div>

      {/* Live Alerts Section */}
      <div className="animate-slide-up bg-danger-50/40 p-6 rounded-3xl border border-danger-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-danger-500"></span>
          </div>
          <h2 className="text-lg font-bold text-neutral-900">
            {language === 'en' ? 'Live System Alerts' : 'நேரடி கணினி எச்சரிக்கைகள்'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 border-l-4 border-l-danger-500 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-danger-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">{analytics?.escalatedComplaints || 0} Complaints Escalated</p>
              <p className="text-sm text-danger-700 mt-0.5">Immediate officer intervention required to resolve overdue SLAs.</p>
            </div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-warning-500 flex items-start gap-4">
            <TrendingDown className="w-6 h-6 text-warning-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">{analytics?.recurringIssues || 0} Recurring Issues</p>
              <p className="text-sm text-warning-700 mt-0.5">High volume of similar complaints detected in affected zones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        {analytics?.departmentStats && analytics.departmentStats.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">{language === 'en' ? 'Department Performance' : 'துறை செயல்திறன்'}</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                  <Bar dataKey="total" fill="#3b82f6" name={language === 'en' ? 'Total Actions' : 'மொத்த நடவடிக்கைகள்'} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10b981" name={t('dashboard.resolved')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="escalated" fill="#ef4444" name={t('dashboard.escalated')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Summary Insight */}
            <div className="mt-6 p-4 bg-primary-50/50 rounded-xl border border-primary-100 flex items-start gap-3 animate-fade-in shadow-sm">
              <Activity className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <p className="text-sm text-primary-900 leading-relaxed font-medium">
                <strong>{language === 'en' ? 'System Insight:' : 'கணினி நுண்ணறிவு:'}</strong> {language === 'en' ? `The system is currently tracking ${analytics?.totalComplaints || 0} total issues. ${analytics?.resolvedComplaints || 0} issues have been successfully resolved, maintaining a ${analytics?.resolutionRate || 0}% resolution rate. Immediate organizational priority should be given to resolving the ${analytics?.escalatedComplaints || 0} escalated cases.` : `${analytics?.totalComplaints || 0} மொத்த சிக்கல்களை அமைப்பு தற்போது கண்காணிக்கிறது. ${analytics?.resolvedComplaints || 0} வெற்றிகரமாக தீர்க்கப்பட்டுள்ளது.`}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Officer Performance */}
          {analytics?.officerStats && analytics.officerStats.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                {language === 'en' ? 'Top Performing Officers' : 'சிறப்பாக செயல்படும் அதிகாரிகள்'}
              </h2>
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
                        <p className="text-xs text-neutral-500">{t('dashboard.resolved')}</p>
                      </div>
                      <div className="text-right min-w-[3rem]">
                        <p className="text-sm font-semibold text-warning-600 flex items-center justify-end gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {officer.averageRating ? Number(officer.averageRating).toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-xs text-neutral-500">Rating</p>
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

          <EscalationWatch />

          <Leaderboard />

          {/* Department Category Breakdown */}
          {analytics?.departmentStats && analytics.departmentStats.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                {language === 'en' ? 'Volume by Department' : 'துறை வாரியான அளவு'}
              </h2>
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
