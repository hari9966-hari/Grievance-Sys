import React from 'react';

export default function StatusBadge({ status }) {
  let colorStyles = '';
  let label = status;

  switch (status?.toLowerCase()) {
    case 'pending':
      colorStyles = 'bg-warning-50 text-warning-600 ring-warning-500/20';
      label = 'Pending';
      break;
    case 'in progress':
      colorStyles = 'bg-primary-50 text-primary-600 ring-primary-500/20';
      label = 'In Progress';
      break;
    case 'resolved':
      colorStyles = 'bg-success-50 text-success-600 ring-success-500/20';
      label = 'Resolved';
      break;
    case 'escalated':
      colorStyles = 'bg-danger-50 text-danger-600 ring-danger-500/20';
      label = 'Escalated';
      break;
    case 'rejected':
      colorStyles = 'bg-neutral-100 text-neutral-600 ring-neutral-500/20';
      label = 'Rejected';
      break;
    default:
      colorStyles = 'bg-neutral-100 text-neutral-600 ring-neutral-500/20';
      label = status || 'Unknown';
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorStyles}`}>
      {label}
    </span>
  );
}
