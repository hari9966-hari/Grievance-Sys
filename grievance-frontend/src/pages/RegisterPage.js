import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, User, Mail, Lock, Shield, Building, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import translations from '../utils/translations';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { register, loading, error } = useAuth();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    department: ''
  });

  const departments = [
    'Water Supply', 'Sanitation', 'Roads & Infrastructure', 
    'Public Health', 'Education', 'Police', 'Electricity', 
    'Parks & Recreation', 'Transportation', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.role === 'officer' ? formData.department : undefined
    });

    if (result.success) {
      showNotification(t('auth.registerSuccess') || 'Account created successfully!', 'success');
      const role = result.user?.role;
      if (role === 'citizen') navigate('/citizen/dashboard');
      else if (role === 'officer') navigate('/officer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      showNotification(result.message || 'Registration failed', 'error');
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 1) return { score, text: language === 'en' ? 'Weak' : 'பலவீனமான', color: 'bg-danger-500 text-danger-700 w-1/4' };
    if (score === 2) return { score, text: language === 'en' ? 'Fair' : 'சுமாரான', color: 'bg-warning-500 text-warning-700 w-2/4' };
    if (score === 3) return { score, text: language === 'en' ? 'Good' : 'நல்ல', color: 'bg-primary-500 text-primary-700 w-3/4' };
    return { score, text: language === 'en' ? 'Strong' : 'வலுவான', color: 'bg-success-500 text-success-700 w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex-col justify-center p-16 xl:p-24 text-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Grievance Sys</span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {language === 'en' ? 'Join the Community' : 'சமூகத்தில் சேரவும்'}
            </h1>
            <p className="text-primary-100 text-xl leading-relaxed max-w-lg mb-12">
              {language === 'en' ? 'Create an account to report issues, track resolutions in real-time, and hold authorities accountable.' : 'சிக்கல்களைப் புகாரளிக்க கணக்கை உருவாக்கவும், நிகழ்நேரத் தீர்வுகளைக் கண்காணிக்கவும் மற்றும் அதிகாரிகளைப் பொறுப்பாக்கவும்.'}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="bg-primary-500/30 p-3 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{language === 'en' ? 'Citizen Verified' : 'குடிமகன் சரிபார்க்கப்பட்டது'}</h3>
                  <p className="text-primary-200 text-sm mt-0.5">{language === 'en' ? 'Trustworthy platform for authenticated users.' : 'அங்கீகரிக்கப்பட்ட பயனர்களுக்கான நம்பகமான தளம்.'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <div className="bg-primary-500/30 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{language === 'en' ? 'Secure Data' : 'பாதுகாப்பான தரவு'}</h3>
                  <p className="text-primary-200 text-sm mt-0.5">{language === 'en' ? 'Your personal details are encrypted & safe.' : 'உங்கள் தனிப்பட்ட விவரங்கள் குறியாக்கம் மற்றும் பாதுகாப்பானவை.'}</p>
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
        <div className="w-full max-w-md mx-auto my-12 animate-slide-in">
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
              {t('auth.createAccount')} 🚀
            </h2>
            <p className="text-neutral-500">
              {t('auth.joinPlatform')}
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
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.fullName')}</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-11 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  className="block w-full rounded-xl border-neutral-300 pl-11 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.role')}</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Shield className="h-5 w-5 text-neutral-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-11 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors font-medium"
                >
                  <option value="citizen">{language === 'en' ? 'Citizen' : 'குடிமகன்'}</option>
                  <option value="officer">{language === 'en' ? 'Officer' : 'அதிகாரி'}</option>
                </select>
              </div>
            </div>

            {formData.role === 'officer' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.department')}</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Building className="h-5 w-5 text-neutral-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-neutral-300 pl-11 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white font-medium transition-colors"
                    required
                  >
                    <option value="">{language === 'en' ? 'Select Department' : 'துறையைத் தேர்ந்தெடுக்கவும்'}</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{language === 'en' ? dept : (translations.ta.categories?.[dept] || dept)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.password')}</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-neutral-300 pl-11 pr-11 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 animate-fade-in">
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color}`}></div>
                    </div>
                    <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${strength.color.split(' ')[1]}`}>
                      {strength.text} {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{t('auth.confirmPassword')}</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full rounded-xl pl-11 pr-11 py-3 text-neutral-900 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-danger-300 focus:border-danger-500' 
                      : 'border-neutral-300 focus:border-primary-500'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 py-3.5 px-4 text-sm font-bold text-white shadow-soft hover:shadow-card hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('auth.registering') : t('auth.registerBtn')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        
          <p className="mt-8 text-center text-sm text-neutral-500">
            {t('auth.alreadyAccount')}{' '}
            <Link to="/login" className="font-bold tracking-wide text-primary-600 hover:text-primary-500 transition-colors">
              {t('auth.loginHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
