import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Trophy, Medal, Star, Shield, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await adminAPI.getLeaderboard();
        if (response.data.success) {
          setLeaderboard(response.data.leaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft animate-pulse">
        <div className="h-6 w-48 bg-neutral-100 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-neutral-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-warning-500" />;
      case 1: return <Medal className="w-5 h-5 text-neutral-400" />;
      case 2: return <Medal className="w-5 h-5 text-warning-700" />;
      default: return <span className="text-sm font-bold text-neutral-400 w-5 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-50 bg-primary-50/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-neutral-900">
            {language === 'en' ? 'Officer Leaderboard' : 'அதிகாரிகள் தரவரிசை'}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-primary-600 uppercase tracking-widest">
          <Star className="w-3 h-3 fill-primary-600" />
          {language === 'en' ? 'Top Performers' : 'சிறந்த அதிகாரிகள்'}
        </div>
      </div>

      <div className="p-2">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-5">{language === 'en' ? 'Officer' : 'அதிகாரி'}</div>
          <div className="col-span-3 text-center">{language === 'en' ? 'Resolved' : 'தீர்க்கப்பட்டவை'}</div>
          <div className="col-span-3 text-right">{language === 'en' ? 'Trust Score' : 'நம்பிக்கை'}</div>
        </div>

        <div className="space-y-1">
          {leaderboard.map((officer, index) => (
            <div 
              key={officer._id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-xl transition-all items-center ${
                index === 0 ? 'bg-primary-50/50 ring-1 ring-primary-100' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="col-span-1 flex justify-center">
                {getRankIcon(index)}
              </div>
              <div className="col-span-5">
                <p className="text-sm font-bold text-neutral-900 truncate">{officer.name}</p>
                <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary-400" />
                  {officer.department}
                </p>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-sm font-bold text-neutral-900 bg-white px-2 py-1 rounded-lg border border-neutral-100 shadow-sm inline-block min-w-[40px]">
                  {officer.resolvedComplaintCount}
                </span>
              </div>
              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-sm font-bold text-success-600">{officer.trustScore}</span>
                  <TrendingUp className="w-3 h-3 text-success-500" />
                </div>
                <p className="text-[10px] text-neutral-400">{Math.round(officer.resolutionRate)}% Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-neutral-50/50 border-t border-neutral-50 text-center">
        <p className="text-[10px] text-neutral-500 font-medium">
          {language === 'en' ? 'Ranking based on resolution count and trust score.' : 'தீர்வு எண்ணிக்கை மற்றும் நம்பிக்கை மதிப்பெண் அடிப்படையில் தரவரிசை.'}
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
