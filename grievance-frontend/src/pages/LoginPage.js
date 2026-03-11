import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
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
      setTimeout(() => {
        const role = result.user?.role;
        if (role === 'citizen') navigate('/citizen/dashboard');
        else if (role === 'officer') navigate('/officer/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-neutral-50">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-50/50 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-100/50 blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-slide-in">
        <div className="flex justify-center mb-6 text-primary-600">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-soft flex items-center justify-center">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Welcome back
        </h2>
        <p className="text-center text-sm text-neutral-500 mb-8">
          Sign in to access your dashboard
        </p>

        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-10 border border-neutral-100">
          {error && (
            <div className="mb-6 rounded-xl bg-danger-50 p-4 flex items-center border border-danger-100">
              <div className="ml-3 text-sm text-danger-700 font-medium">
                {error}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Email address</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-10 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">Password</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-neutral-300 pl-10 pr-10 py-3 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-primary-600 py-3 px-4 text-sm font-semibold text-white shadow-soft hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>


        </div>
        
        <p className="mt-8 text-center text-sm text-neutral-500">
          Not a member?{' '}
          <Link to="/register" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
