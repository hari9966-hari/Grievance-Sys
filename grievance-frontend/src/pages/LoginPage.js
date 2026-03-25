import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ArrowRight, Eye, EyeOff, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { login, loading, error } = useAuth();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showNotification(t('auth.loginSuccess') || 'Login successful!', 'success');
      setTimeout(() => {
        const role = result.user?.role;
        if (role === 'citizen') navigate('/citizen/dashboard');
        else if (role === 'officer') navigate('/officer/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }, 100);
    } else {
      showNotification(result.message || 'Invalid email or password', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex-col justify-center p-16 xl:p-24 text-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Grievance Sys</span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {language === 'en' ? 'Smart Grievance Management' : 'சிறந்த குறைதீர்ப்பு மேலாண்மை'}
            </h1>
            <p className="text-primary-100 text-xl leading-relaxed max-w-lg mb-12">
              {language === 'en' ? 'Experience seamless issue resolution with transparent tracking, automated escalation, and total accountability.' : 'வெளிப்படையான கண்காணிப்பு, தானியங்கி மேல்முறையீடு மற்றும் முழுமையான பொறுப்புணர்வுடன் தடையற்ற குறைதீர்ப்பை அனுபவிக்கவும்.'}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="bg-primary-500/30 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{language === 'en' ? 'Transparent Tracking' : 'வெளிப்படையான கண்காணிப்பு'}</h3>
                  <p className="text-primary-200 text-sm mt-0.5">{language === 'en' ? 'Monitor every step of your grievance resolution.' : 'உங்கள் குறைதீர்ப்பின் ஒவ்வொரு படியையும் கண்காணிக்கவும்.'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="bg-primary-500/30 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{language === 'en' ? 'Real-time Updates' : 'நிகழ்நேர புதுப்பிப்புகள்'}</h3>
                  <p className="text-primary-200 text-sm mt-0.5">{language === 'en' ? 'Get notified instantly of any status changes.' : 'எந்த நிலை மாற்றங்களையும் உடனடியாக அறிவிப்பைப் பெறுங்கள்.'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-primary-300 text-sm font-medium mt-16">
            © 2026 Grievance Sys. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto animate-slide-in">
          {/* Mobile Branding */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="flex items-center gap-2">
              <div className="bg-primary-50 p-2.5 rounded-xl">
                <AlertCircle className="w-8 h-8 text-primary-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">Grievance Sys</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              {t('auth.welcome')} 👋
            </h2>
            <p className="text-neutral-500">
              {t('auth.signIn')}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-danger-50 p-4 flex items-center border border-danger-100">
              <div className="ml-3 text-sm text-danger-700 font-medium">
                {error}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.email')}</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-11 py-3.5 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-neutral-700">{t('auth.password')}</label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-11 pr-11 py-3.5 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 py-3.5 px-4 text-sm font-bold text-white shadow-soft hover:shadow-card hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('auth.signingIn') : t('auth.signInBtn')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-neutral-500 font-medium">
            {t('auth.notMember')}{' '}
            <Link to="/register" className="font-bold tracking-wide text-primary-600 hover:text-primary-500 transition-colors">
              {t('auth.registerNow')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
