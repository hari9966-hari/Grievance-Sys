import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function LiveCountdown({ deadline, status }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('safe'); // 'safe', 'warning', 'critical'

  useEffect(() => {
    if (!deadline || status === 'resolved' || status === 'Resolved' || status === 'Closed') {
      setTimeLeft('Resolved');
      setUrgency('safe');
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(deadline) - new Date();
      
      if (difference <= 0) {
        setTimeLeft('Overdue');
        setUrgency('critical');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      // Determine urgency
      if (days < 1) {
        setUrgency('critical');
      } else if (days < 3) {
        setUrgency('warning');
      } else {
        setUrgency('safe');
      }

      // Format string
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // UI updates every minute

    return () => clearInterval(timer);
  }, [deadline, status]);

  if (!deadline) return null;

  let colorClasses = '';
  switch (urgency) {
    case 'critical':
      colorClasses = 'text-danger-600 bg-danger-50 border-danger-200';
      break;
    case 'warning':
      colorClasses = 'text-warning-600 bg-warning-50 border-warning-200';
      break;
    default:
      colorClasses = 'text-success-600 bg-success-50 border-success-200';
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${colorClasses}`}>
      {urgency === 'critical' && timeLeft === 'Overdue' ? (
        <AlertCircle className="w-3 h-3 mr-1 animate-pulse" />
      ) : (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {timeLeft}
    </div>
  );
}
