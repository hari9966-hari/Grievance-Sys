import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, trend, colorClass = 'text-primary-600', bgClass = 'bg-primary-50' }) {
      // Determine a border color mapping based on the colorClass passed
      let borderColor = 'border-t-primary-500';
      if (colorClass.includes('success')) borderColor = 'border-t-success-500';
      if (colorClass.includes('warning')) borderColor = 'border-t-warning-500';
      if (colorClass.includes('danger')) borderColor = 'border-t-danger-500';

  return (
    <div className={`glass-card p-6 border-t-4 ${borderColor} bg-gradient-to-br from-white to-neutral-50/50 hover:-translate-y-2 relative overflow-hidden group`}>
      <div className={`absolute -right-6 -top-6 w-32 h-32 ${bgClass} opacity-30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">{value}</h3>
          
          {trend && (
            <div className={`text-xs mt-3 flex items-center px-2 py-1 rounded-full w-fit ${trend.value.includes('%') ? 'bg-success-50 text-success-700' : 'bg-primary-50 text-primary-700'}`}>
              <span className="font-bold mr-1">{trend.value}</span>
              <span className="opacity-80">{trend.label || 'vs last month'}</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-2xl ${bgClass} shadow-inner transition-transform group-hover:rotate-6 group-hover:scale-110 duration-300`}>
          {Icon && <Icon className={`h-8 w-8 ${colorClass}`} strokeWidth={2.5} />}
        </div>
      </div>
    </div>
  );
}
