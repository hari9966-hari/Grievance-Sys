import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Activity, ArrowRight, AlertCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900 tracking-tight">Grievance Sys</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all shadow-soft hover:shadow-card hover:-translate-y-0.5">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
          Citizen First Initiative
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6 animate-slide-in">
          Transparent. Accountable. <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
            Time-Bound Resolution.
          </span>
        </h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          A modern unified platform for citizens and students to report issues, track their progress in real-time, and guarantee accountability within strict deadlines.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link 
            to="/register" 
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-card hover:-translate-y-1"
          >
            Raise a Complaint
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 bg-white text-neutral-700 border border-neutral-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-50 transition-all shadow-soft hover:-translate-y-1"
          >
            Track Status
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Core Platform Features</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Built to ensure transparency and swift action for every reported grievance.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Time-Bound SLAs</h3>
              <p className="text-neutral-500 leading-relaxed">
                Every category has a strict Service Level Agreement deadline. Failures trigger automatic escalations to higher authorities.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-success-50 text-success-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Real-time Tracking</h3>
              <p className="text-neutral-500 leading-relaxed">
                Stay updated on your complaint's journey with a comprehensive timeline and visual status indicators.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-100 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 bg-warning-50 text-warning-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Duplicate Detection</h3>
              <p className="text-neutral-500 leading-relaxed">
                Smart system identifies similar existing issues, streamlining resolution and boosting transparency across the community.
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
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">Help Center</a>
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="/#" className="text-neutral-500 hover:text-primary-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
