import React, { useState, useEffect } from 'react';
import { systemAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Shield, CheckCircle, Activity, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await systemAPI.getStats();
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching public stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" />
          {language === 'en' ? 'Open Governance' : 'திறந்த ஆளுகை'}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight transition-all">
          {language === 'en' ? 'System Transparency Dashboard' : 'அமைப்பு வெளிப்படைத்தன்மை தகவல் பலகை'}
        </h1>
        <p className="text-lg text-neutral-600 font-medium leading-relaxed">
          {language === 'en' 
            ? 'Live tracking of grievances, department performance, and resolution metrics for public accountability.' 
            : 'பொதுப் பொறுப்புணர்விற்கான குறைகள், துறை செயல்திறன் மற்றும் தீர்வு அளவீடுகளின் நேரடி கண்காணிப்பு.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-neutral-100 flex flex-col justify-between group hover:border-primary-200 transition-all duration-300">
          <div className="bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 mb-1">{language === 'en' ? 'Total Grievances' : 'மொத்த குறைகள்'}</p>
            <h2 className="text-4xl font-black text-neutral-900 tracking-tighter">{data?.stats.total || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-soft border border-neutral-100 flex flex-col justify-between group hover:border-success-200 transition-all duration-300">
          <div className="bg-success-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 mb-1">{language === 'en' ? 'Resolved' : 'தீர்க்கப்பட்டவை'}</p>
            <h2 className="text-4xl font-black text-success-600 tracking-tighter">{data?.stats.resolved || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-soft border border-neutral-100 flex flex-col justify-between group hover:border-warning-200 transition-all duration-300">
          <div className="bg-warning-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 mb-1">{language === 'en' ? 'In Progress' : 'நடவடிக்கையில்'}</p>
            <h2 className="text-4xl font-black text-warning-600 tracking-tighter">{data?.stats.inProgress || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-soft border border-neutral-100 flex flex-col justify-between group hover:border-primary-200 transition-all duration-300">
          <div className="bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 mb-1">{language === 'en' ? 'Resolution Rate' : 'தீர்வு விகிதம்'}</p>
            <h2 className="text-4xl font-black text-primary-600 tracking-tighter">{data?.stats.resolutionRate || 0}%</h2>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <BarChart className="w-5 h-5 text-primary-600" />
            {language === 'en' ? 'Department Breakdown' : 'துறை வாரியான முறிவு'}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Resolutions */}
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success-600" />
            {language === 'en' ? 'Recent Resolutions' : 'சமீபத்திய தீர்வுகளானவை'}
          </h2>
          <div className="space-y-4">
            {data?.recentResolutions.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100 group">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm group-hover:text-primary-600 transition-colors">{res.title}</h4>
                  <p className="text-xs text-neutral-500 font-medium">
                    {res.category} • {res.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-success-600 bg-success-50 px-2 py-1 rounded-full uppercase tracking-wider">
                    {language === 'en' ? 'Resolved' : 'தீர்க்கப்பட்டது'}
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium">
                    {new Date(res.resolvedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/login" className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-2xl transition-all group">
              {language === 'en' ? 'File Your Own Grievance' : 'உங்கள் புகாரைப் பதிவு செய்யுங்கள்'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-neutral-900 rounded-3xl p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Shield className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Our Commitment to Accountability' : 'பொறுப்புணர்விற்கான எமது அர்ப்பணிப்பு'}</h2>
          <p className="text-neutral-400 font-medium leading-relaxed mb-6">
            {language === 'en' 
              ? 'We believe that public data belongs to the public. Every grievance filed is tracked through its entire lifecycle with strict SLA compliance and automated escalation to ensure no issue goes ignored.'
              : 'பொதுத் தரவு பொதுமக்களுக்குச் சொந்தமானது என்று நாங்கள் நம்புகிறோம். தாக்கல் செய்யப்படும் ஒவ்வொரு புகாரும் அதன் முழு வாழ்க்கைச் சுழற்சியிலும் கடுமையான SLA இணக்கம் மற்றும் தானியங்கி மேல்முறையீடு மூலம் கண்காணிக்கப்படுகிறது.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest">{language === 'en' ? 'Live System' : 'நேரடி அமைப்பு'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <ExternalLink className="w-3 h-3 text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-widest">{language === 'en' ? 'Immutable Logs' : 'மாற்ற முடியாத பதிவுகள்'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;
