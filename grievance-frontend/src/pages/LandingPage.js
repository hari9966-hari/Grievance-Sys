import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Activity, ArrowRight, AlertCircle, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900 tracking-tight">
                {language === 'en' ? 'Grievance Sys' : 'குறைதீர்ப்பு அமைப்பு'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all shadow-soft hover:shadow-card hover:-translate-y-0.5">
                {t('nav.register')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
          {language === 'en' ? 'Citizen First Initiative' : 'குடிமக்களுக்கு முன்னுரிமை முன்னெடுப்பு'}
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6 animate-slide-in">
          {language === 'en' ? (
            <>Transparent. Accountable. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Time-Bound Resolution.
            </span></>
          ) : (
            <>வெளிப்படையானது. பொறுப்பானது. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              காலவரையறைக்குட்பட்ட தீர்வு.
            </span></>
          )}
        </h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t('landing.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link 
            to="/register" 
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-card hover:-translate-y-1"
          >
            {t('nav.createComplaint')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 bg-white text-neutral-700 border border-neutral-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-50 transition-all shadow-soft hover:-translate-y-1"
          >
            {language === 'en' ? 'Track Status' : 'நிலையை அறிய'}
          </Link>
          <Link 
            to="/transparency" 
            className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-black transition-all shadow-card hover:-translate-y-1"
          >
            <ShieldCheck className="h-5 w-5" />
            {language === 'en' ? 'Transparency Hub' : 'வெளிப்படைத்தன்மை மையம்'}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t('landing.features')}</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              {language === 'en' 
                ? 'Built to ensure transparency and swift action for every reported grievance.' 
                : 'ஒவ்வொரு புகாருக்கும் வெளிப்படைத்தன்மை மற்றும் விரைவான நடவடிக்கையை உறுதி செய்வதற்காக கட்டப்பட்டது.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {language === 'en' ? 'Time-Bound SLAs' : 'காலவரையறைக்குட்பட்ட SLAக்கள்'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Every category has a strict Service Level Agreement deadline. Failures trigger automatic escalations to higher authorities.' 
                  : 'ஒவ்வொரு வகைக்கும் கடுமையான சேவை நிலை ஒப்பந்தக் காலக்கெடு உள்ளது. தோல்விகள் தானாகவே உயர் அதிகாரிகளுக்கு மேல்முறையீடு செய்யப்படும்.'}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-success-50 text-success-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {language === 'en' ? 'Real-time Tracking' : 'நிகழ்நேர கண்காணிப்பு'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? "Stay updated on your complaint's journey with a comprehensive timeline and visual status indicators." 
                  : 'ஒரு விரிவான காலவரிசை மற்றும் காட்சி நிலை குறிகாட்டிகள் மூலம் உங்கள் புகாரின் பயணத்தைப் பற்றி உடனுக்குடன் தெரிந்து கொள்ளுங்கள்.'}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-warning-50 text-warning-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {language === 'en' ? 'Duplicate Detection' : 'நகல் கண்டறிதல்'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Smart system identifies similar existing issues, streamlining resolution and boosting transparency across the community.' 
                  : 'புத்திசாலித்தனமான அமைப்பு ஏற்கனவே உள்ள ஒத்த சிக்கல்களைக் கண்டறிந்து, தீர்வை முறைப்படுத்துகிறது மற்றும் சமூகம் முழுவதும் வெளிப்படைத்தன்மையை அதிகரிக்கிறது.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <AlertCircle className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-neutral-900">Grievance Sys</span>
          </div>
          <div className="flex space-x-6">
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">
              {language === 'en' ? 'Help Center' : 'உதவி மையம்'}
            </a>
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">
              {language === 'en' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை'}
            </a>
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">
              {language === 'en' ? 'Terms of Service' : 'சேவை விதிமுறைகள்'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
