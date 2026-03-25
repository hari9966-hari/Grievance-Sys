import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Activity, ArrowRight, AlertCircle, Globe, MapPin, UserCheck, Star, Mail, FileText, FastForward } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export default function LandingPage() {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full top-0 bg-white/90 backdrop-blur-lg z-50 border-b border-neutral-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-2 rounded-xl">
                <AlertCircle className="h-7 w-7 text-primary-600" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {language === 'en' ? 'Grievance Sys' : 'குறைதீர்ப்பு அமைப்பு'}
              </span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>
              <Link to="/login" className="text-sm font-bold text-neutral-600 hover:text-primary-600 transition-colors px-3">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="text-sm font-bold bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-soft hover:shadow-card">
                {language === 'en' ? 'Get Started' : 'தொடங்குங்கள்'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-warning-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-bold mb-8 animate-fade-in shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
          </span>
          {language === 'en' ? 'Next-Gen Public Service Platform' : 'அடுத்த தலைமுறை பொது சேவை தளம்'}
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight mb-6 animate-slide-in leading-[1.1]">
          {language === 'en' ? (
            <>Track. Escalate. <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Resolve with Accountability.
            </span></>
          ) : (
            <>கண்காணிக்கவும். மேல்முறையீடு செய்யவும். <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              பொறுப்புடன் தீர்க்கவும்.
            </span></>
          )}
        </h1>
        
        <p className="text-lg sm:text-2xl text-neutral-500 max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed font-medium">
          {language === 'en' ? 'A modern SaaS platform designed to ensure every citizen grievance is addressed swiftly, transparently, and automatically escalated if delayed.' : 'ஒவ்வொரு குடிமகனின் குறையும் உடனடியாகவும், வெளிப்படையாகவும், தாமதமானால் தானாகவே உயர் அதிகாரிகளுக்குச் செல்லவும் வடிவமைக்கப்பட்ட ஒரு நவீன மென்பொருள் தளம்.'}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in max-w-md sm:max-w-none mx-auto">
          <Link 
            to="/register" 
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-card hover:-translate-y-0.5"
          >
            {language === 'en' ? 'Raise Complaint' : 'புகாரை எழுப்புங்கள்'}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 bg-white text-neutral-700 border border-neutral-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-all shadow-soft hover:-translate-y-0.5"
          >
            {language === 'en' ? 'Track Status (Login)' : 'நிலையை அறிய (உள்நுழைய)'}
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-neutral-900 border-t border-neutral-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{language === 'en' ? 'How It Works' : 'இது எப்படி வேலை செய்கிறது'}</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              {language === 'en' ? 'A streamlined process designed to cut through red tape and deliver results.' : 'இது முடிவுகளை வழங்குவதற்காக வடிவமைக்கப்பட்ட எளிமையான செயல்முறையாகும்.'}
            </p>
          </div>
          
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-900 via-primary-500 to-primary-900 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-6 relative z-10">
              {[
                { icon: FileText, title: 'Raise', desc: 'Submit with photo/location.' },
                { icon: Activity, title: 'Track', desc: 'Real-time routing to officer.' },
                { icon: FastForward, title: 'Escalate', desc: 'Auto-escalation if delayed.' },
                { icon: ShieldCheck, title: 'Verify', desc: 'OTP verification required.' },
                { icon: Star, title: 'Rate', desc: 'Rate officer performance.' }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-6 shadow-card group-hover:-translate-y-2 group-hover:bg-primary-900/50 group-hover:border-primary-500/50 transition-all duration-300 relative">
                    <step.icon className="w-10 h-10 text-primary-400 group-hover:text-primary-300" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow-sm border-[3px] border-neutral-900">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{language === 'en' ? step.title : `படி ${index + 1}`}</h3>
                  <p className="text-neutral-400 text-sm max-w-[200px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6">{language === 'en' ? 'Enterprise-Grade Features' : 'சிறந்த அம்சங்கள்'}</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              {language === 'en' 
                ? 'Built to ensure transparency, accountability, and swift action for every reported grievance.' 
                : 'ஒவ்வொரு புகாருக்கும் வெளிப்படைத்தன்மை மற்றும் விரைவான நடவடிக்கையை உறுதி செய்வதற்காக கட்டப்பட்டது.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Time-Bound SLAs' : 'காலவரையறைக்குட்பட்ட SLAக்கள்'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Every category has a strict Service Level Agreement deadline. Failures automatically trigger alerts.' 
                  : 'ஒவ்வொரு வகைக்கும் கடுமையான சேவை நிலை ஒப்பந்தக் காலக்கெடு உள்ளது. தோல்விகள் தானாகவே எச்சரிக்கப்படும்.'}
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-danger-50 text-danger-600 rounded-2xl flex items-center justify-center mb-8">
                <FastForward className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Automatic Escalation' : 'தானியங்கி மேல்முறையீடு'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? "Unresolved issues past the deadline automatically route to superior officers without manual intervention." 
                  : 'காலக்கெடு தாண்டிய தீர்க்கப்படாத சிக்கல்கள் தானாகவே உயர் அதிகாரிகளுக்கு செல்லும்.'}
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Duplicate Detection' : 'நகல் கண்டறிதல்'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Our smart system identifies similar existing issues to streamline resolution and boost community support.' 
                  : 'புத்திசாலித்தனமான அமைப்பு ஏற்கனவே உள்ள ஒத்த சிக்கல்களைக் கண்டறிந்து, தீர்வை முறைப்படுத்துகிறது.'}
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-success-50 text-success-600 rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Map-based Tracking' : 'வரைபட அடிப்படையிலான கண்காணிப்பு'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Visualize issues across the city with dynamic heatmaps and pinpoint exact geographical bottlenecks.' 
                  : 'மாறும் வரைபடங்கள் மூலம் நகரம் முழுவதும் உள்ள சிக்கல்களைக் காணுங்கள்.'}
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
                <UserCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Citizen Verification' : 'குடிமக்கள் சரிபார்ப்பு'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Closing a complaint requires citizen OTP confirmation, preventing false resolution claims by officers.' 
                  : 'புகாரை முடிக்க குடிமக்களின் OTP சரிபார்ப்பு தேவை.'}
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-soft border border-neutral-200/60 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-14 w-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-8">
                <Star className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {language === 'en' ? 'Officer Rating' : 'அதிகாரி மதிப்பீடு'}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {language === 'en' 
                  ? 'Rate the resolution quality post-verification. Transparent analytics show top-performing departments.' 
                  : 'மதிப்பீடுகள் மூலம் மேல் செயல்பாடு உள்ள துறைகளை அளவிட முடியும்.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-primary-800 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-primary-400/30">
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
                <AnimatedCounter end={54} suffix="K+" />
              </div>
              <div className="text-primary-100 font-bold uppercase tracking-widest text-sm">
                {language === 'en' ? 'Complaints Handled' : 'கையாளப்பட்ட புகார்கள்'}
              </div>
            </div>
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
                <AnimatedCounter end={94} suffix="%" />
              </div>
              <div className="text-primary-100 font-bold uppercase tracking-widest text-sm">
                {language === 'en' ? 'Resolution Rate' : 'தீர்வு விகிதம்'}
              </div>
            </div>
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
                <AnimatedCounter end={48} suffix="h" />
              </div>
              <div className="text-primary-100 font-bold uppercase tracking-widest text-sm">
                {language === 'en' ? 'Average Resolution Time' : 'சராசரி தீர்வு நேரம்'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 pt-20 pb-10 border-t border-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/10 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">Grievance Sys</span>
              </div>
              <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed">
                Empowering citizens with a time-bound, transparent, and accountable public grievance resolution system.
              </p>
              <div className="flex space-x-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary-600 transition-colors cursor-pointer"><Globe className="w-4 h-4" /></div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary-600 transition-colors cursor-pointer"><Mail className="w-4 h-4" /></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><Link to="/register" className="hover:text-primary-400 transition-colors">Raise Complaint</Link></li>
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Track Status</Link></li>
                <li><Link to="/transparency" className="hover:text-primary-400 transition-colors">Transparency Hub</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><a href="/#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="/#" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-neutral-500 text-sm">
            &copy; 2026 Grievance Sys. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
