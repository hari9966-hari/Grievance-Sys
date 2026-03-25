import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DashboardCard from '../components/ui/DashboardCard';
import ComplaintTable from '../components/ui/ComplaintTable';
import FilterBar from '../components/ui/FilterBar';
import LiveCountdown from '../components/ui/LiveCountdown';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchComplaints = async (filterParams = {}) => {
    try {
      const response = await complaintAPI.getComplaints({ ...filterParams, limit: 10 });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await complaintAPI.getStats();
        setStats(response.data.stats);
        await fetchComplaints();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchComplaints(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categoryData = stats?.byCategory || [];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t('nav.dashboard')}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {language === 'en' ? 'Overview of your activity and city-wide grievances.' : 'உங்கள் செயல்பாடு மற்றும் நகர அளவிலான குறைகளின் கண்ணோட்டம்.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={t('dashboard.totalComplaints')}
          value={stats?.total || 0}
          icon={Activity}
          colorClass="text-primary-600"
          bgClass="bg-primary-50"
        />
        <DashboardCard
          title={t('dashboard.resolved')}
          value={stats?.resolved || 0}
          icon={ShieldCheck}
          colorClass="text-success-600"
          bgClass="bg-success-50"
        />
        <DashboardCard
          title={t('dashboard.pending')}
          value={stats?.pending || 0}
          icon={Clock}
          colorClass="text-warning-600"
          bgClass="bg-warning-50"
        />
        <DashboardCard
          title={t('dashboard.escalated')}
          value={stats?.escalated || 0}
          icon={AlertCircle}
          colorClass="text-danger-600"
          bgClass="bg-danger-50"
        />
      </div>

      {/* Live Alerts Section */}
      {complaints.filter(c => {
         const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
         return daysLeft < 2 && c.status !== 'Resolved' && c.status !== 'Closed';
      }).length > 0 && (
        <div className="animate-slide-up bg-warning-50/50 p-6 rounded-3xl border border-warning-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-warning-500"></span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              {language === 'en' ? 'Live Alerts: Action Required' : 'நேரடி விழிப்பூட்டல்கள்: நடவடிக்கை தேவை'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.filter(c => {
               const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
               return daysLeft < 2 && c.status !== 'Resolved' && c.status !== 'Closed';
            }).slice(0, 3).map(c => {
              const daysLeft = c.slaDeadline ? (new Date(c.slaDeadline) - new Date()) / (1000 * 60 * 60 * 24) : 10;
              return (
              <div key={c._id} className={`glass-card p-4 border-l-4 ${daysLeft < 0 ? 'border-l-danger-500 bg-danger-50/10' : 'border-l-warning-500'} flex items-start gap-4 cursor-pointer hover:bg-white/50 transition-colors`} onClick={() => navigate(`/citizen/complaint/${c._id}`)}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Pie Chart */}
        {categoryData.length > 0 && (
          <div className="glass-card p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              {language === 'en' ? 'Complaints by Category' : 'வக வாரியாக புகார்கள்'}
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Complaints Table */}
        <div className="lg:col-span-2 space-y-4">
          <FilterBar 
            onFilterChange={handleFilterChange} 
            categories={stats?.byCategory.map(c => c._id) || []} 
          />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              {filters.search || filters.status || filters.category ? (language === 'en' ? 'Filtered Results' : 'வடிகட்டப்பட்ட முடிவுகள்') : (language === 'en' ? 'Recent Public Complaints' : 'சமீபத்திய பொது புகார்கள்')}
            </h2>
          </div>
          <ComplaintTable 
            complaints={complaints} 
            onRowClick={(complaint) => navigate(`/citizen/complaint/${complaint._id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
