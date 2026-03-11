import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, trend, colorClass = 'text-primary-600', bgClass = 'bg-primary-50' }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 transition-all duration-300 hover:shadow-card hover:-translate-y-1 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${bgClass} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</h3>
          
          {trend && (
            <div className={`text-xs mt-3 flex items-center px-2 py-1 rounded-full w-fit ${trend.value.includes('%') ? 'bg-success-50 text-success-700' : 'bg-primary-50 text-primary-700'}`}>
              <span className="font-bold mr-1">{trend.value}</span>
              <span className="opacity-80">{trend.label || 'vs last month'}</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-xl ${bgClass} transition-transform group-hover:scale-110 duration-300`}>
          {Icon && <Icon className={`h-6 w-6 ${colorClass}`} strokeWidth={2.5} />}
        </div>
      </div>
    </div>
  );
}
