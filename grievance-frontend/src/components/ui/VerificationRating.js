import React, { useState } from 'react';
import { CheckCircle, XCircle, Star, Send } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { complaintAPI } from '../../services/api';

const VerificationRating = ({ complaintId, onUpdate }) => {
  const [step, setStep] = useState('verify'); // 'verify', 'rate', 'completed'
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleVerify = async (action) => {
    setLoading(true);
    try {
      await complaintAPI.verifyResolution(complaintId, { 
        action, 
        feedback: action === 'Reopen' ? feedback : null 
      });
      
      if (action === 'Confirm') {
        showNotification('Resolution confirmed! Please rate the service.', 'success');
        setStep('rate');
      } else {
        showNotification('Complaint has been reopened.', 'info');
        setStep('completed');
        onUpdate();
      }
    } catch (error) {
      showNotification('Action failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      showNotification('Please select a star rating', 'warning');
      return;
    }
    setLoading(true);
    try {
      await complaintAPI.submitRating(complaintId, { rating, feedback });
      showNotification('Thank you for your feedback!', 'success');
      setStep('completed');
      onUpdate();
    } catch (error) {
      showNotification('Failed to submit rating', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'completed') return null;

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-6 mt-6 animate-slide-in-right">
      {step === 'verify' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600 font-semibold">
            <CheckCircle className="w-5 h-5" />
            <h3>Resolve Verification</h3>
          </div>
          <p className="text-sm text-neutral-600">
            The assigned officer has marked this complaint as resolved. Please confirm if the issue is solved to your satisfaction.
          </p>
          
          <div className="pt-2">
            <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">
              Feedback (Required only for reopening)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-xl border-neutral-200 p-3 text-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-50"
              placeholder="Tell us why the issue is still not resolved..."
              rows="3"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleVerify('Reopen')}
              disabled={loading || !feedback}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-danger-600 border border-danger-200 py-2.5 rounded-xl hover:bg-danger-50 transition-colors font-medium disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reopen
            </button>
            <button
              onClick={() => handleVerify('Confirm')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-success-600 text-white py-2.5 rounded-xl hover:bg-success-700 shadow-soft transition-all font-medium disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Resolution
            </button>
          </div>
        </div>
      )}

      {step === 'rate' && (
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">How would you rate our service?</h3>
            <p className="text-sm text-neutral-500">Your feedback helps us improve governance accountability.</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-10 h-10 ${
                    (hover || rating) >= star ? 'fill-warning-400 text-warning-400' : 'text-neutral-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="text-left">
            <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">
              Additional Comments (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-xl border-neutral-200 p-3 text-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-50"
              placeholder="What did we do well? What can we improve?"
              rows="3"
            />
          </div>

          <button
            onClick={handleSubmitRating}
            disabled={loading || rating === 0}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 shadow-card transition-all font-semibold disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationRating;
