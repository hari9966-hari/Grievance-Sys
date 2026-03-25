import React from 'react';
import { Clock, Activity, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  let colorStyles = '';
  let label = status;
  let Icon = HelpCircle;

  switch (status?.toLowerCase()) {
    case 'pending':
      colorStyles = 'bg-warning-50 text-warning-600 ring-warning-500/20';
      label = 'Pending';
      Icon = Clock;
      break;
    case 'in progress':
      colorStyles = 'bg-primary-50 text-primary-600 ring-primary-500/20';
      label = 'In Progress';
      Icon = Activity;
      break;
    case 'resolved':
      colorStyles = 'bg-success-50 text-success-600 ring-success-500/20';
      label = 'Resolved';
      Icon = CheckCircle;
      break;
    case 'escalated':
      colorStyles = 'bg-danger-50 text-danger-600 ring-danger-500/20';
      label = 'Escalated';
      Icon = AlertTriangle;
      break;
    case 'rejected':
      colorStyles = 'bg-neutral-100 text-neutral-600 ring-neutral-500/20';
      label = 'Rejected';
      Icon = XCircle;
      break;
    default:
      colorStyles = 'bg-neutral-100 text-neutral-600 ring-neutral-500/20';
      label = status || 'Unknown';
      Icon = HelpCircle;
  }

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1.5 text-sm gap-2' 
    : 'px-2.5 py-1 text-[11px] gap-1.5';

  const iconSize = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <span className={`inline-flex items-center rounded-md font-bold tracking-wide uppercase ring-1 ring-inset ${sizeClasses} ${colorStyles}`}>
      <Icon className={iconSize} />
      {label}
    </span>
  );
}
