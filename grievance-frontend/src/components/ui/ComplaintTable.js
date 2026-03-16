import React from 'react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { useLanguage } from '../../context/LanguageContext';

export default function ComplaintTable({ 
  complaints, 
  onRowClick, 
  actions,
  emptyStateMessage = "" 
}) {
  const { language, t } = useLanguage();
  const emptyMessage = emptyStateMessage || (language === 'en' ? "No complaints found." : "புகார்கள் எதுவும் இல்லை.");
  
  if (!complaints || complaints.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100 shadow-soft">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                {language === 'en' ? 'ID' : 'அடையாளம்'}
              </th>
              <th scope="col" className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                {language === 'en' ? 'Title & Category' : 'தலைப்பு மற்றும் வகை'}
              </th>
              <th scope="col" className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                {language === 'en' ? 'Date & Deadline' : 'தேதி மற்றும் காலக்கெடு'}
              </th>
              <th scope="col" className="px-6 py-4 text-left font-semibold text-neutral-600 tracking-wider">
                {language === 'en' ? 'Status' : 'நிலை'}
              </th>
              {actions && (
                <th scope="col" className="px-6 py-4 text-right font-semibold text-neutral-600 tracking-wider">
                  {language === 'en' ? 'Actions' : 'நடவடிக்கைகள்'}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {complaints.map((complaint) => (
              <tr 
                key={complaint._id || complaint.id} 
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-neutral-50/80' : 'hover:bg-neutral-50/50'}`}
                onClick={() => onRowClick && onRowClick(complaint)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                    {complaint.trackingId || complaint._id?.substring(0, 8)}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <p className="font-medium text-neutral-900 mb-1 max-w-xs truncate" title={complaint.title}>
                    {complaint.title}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize">
                    {complaint.category || 'General'}
                  </p>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-neutral-900 mb-1">
                    {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                  {complaint.slaDeadline && (
                    <div className="text-xs text-neutral-500 flex items-center">
                      <span className="mr-1">SLA:</span>
                      <span className={new Date(complaint.slaDeadline) < new Date() && complaint.status !== 'resolved' ? 'text-danger-600 font-medium' : ''}>
                        {format(new Date(complaint.slaDeadline), 'MMM dd')}
                      </span>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={complaint.status} />
                </td>
                
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium" onClick={e => e.stopPropagation()}>
                    {actions(complaint)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
