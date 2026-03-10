import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, trend, colorClass = 'text-primary-600', bgClass = 'bg-primary-50' }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-900">{value}</h3>
          
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
              <span className="font-medium mr-1">
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-neutral-500">vs last month</span>
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-xl ${bgClass}`}>
          {Icon && <Icon className={`h-6 w-6 ${colorClass}`} strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
}
