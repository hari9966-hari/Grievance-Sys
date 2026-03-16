import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DashboardCard from '../components/ui/DashboardCard';
import ComplaintTable from '../components/ui/ComplaintTable';
import FilterBar from '../components/ui/FilterBar';

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Pie Chart */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-neutral-100 lg:col-span-1">
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
