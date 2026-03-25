import React from 'react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { useLanguage } from '../../context/LanguageContext';
import LiveCountdown from './LiveCountdown';
import { Activity, MapPin } from 'lucide-react';

export default function ComplaintTable({ 
  complaints, 
  onRowClick, 
  actions,
  emptyStateMessage = "" 
}) {
  const { language } = useLanguage();
  const emptyMessage = emptyStateMessage || (language === 'en' ? "No complaints found." : "புகார்கள் எதுவும் இல்லை.");
  
  if (!complaints || complaints.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100 shadow-soft">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {complaints.map((complaint) => (
        <div 
          key={complaint._id || complaint.id} 
          className={`glass-card p-5 relative overflow-hidden group flex flex-col justify-between ${onRowClick ? 'cursor-pointer' : ''}`}
          onClick={() => onRowClick && onRowClick(complaint)}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary-700 bg-primary-50 px-2 py-1 rounded border border-primary-100/50">
                {complaint.trackingId || complaint._id?.substring(0, 8)}
              </span>
              {complaint.priority && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  complaint.priority === 'Critical' ? 'bg-danger-100 text-danger-700' :
                  complaint.priority === 'High' ? 'bg-warning-100 text-warning-700' :
                  'bg-success-100 text-success-700'
                }`}>
                  {complaint.priority}
                </span>
              )}
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          
          {/* Body */}
          <div className="mb-6 flex-grow">
            <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
              {complaint.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100/50 px-2 py-1 rounded">
                {complaint.category || 'General'}
              </span>
              {complaint.location && (
                <span className="inline-flex items-center text-[10px] font-medium text-neutral-500 max-w-[120px] truncate">
                  <MapPin className="w-3 h-3 mr-1" />
                  {complaint.location}
                </span>
              )}
              {(complaint.upvotes > 0 || complaint.supportCount > 0) && (
                <span className="inline-flex items-center text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded ml-auto border border-primary-100/30">
                  <Activity className="w-3 h-3 mr-1" />
                  {complaint.upvotes || complaint.supportCount}
                </span>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Created</span>
              <span className="text-xs font-semibold text-neutral-900">
                {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM dd, yyyy') : 'N/A'}
              </span>
            </div>
            
            {complaint.slaDeadline && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1">SLA Deadline</span>
                <LiveCountdown deadline={complaint.slaDeadline} status={complaint.status} />
              </div>
            )}
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="mt-4 pt-4 border-t border-neutral-100/50 flex justify-end" onClick={e => e.stopPropagation()}>
              {actions(complaint)}
            </div>
          )}
          
          {/* Hover highlight border */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </div>
      ))}
    </div>
  );
}
