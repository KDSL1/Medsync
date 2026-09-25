import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Activity, ShieldCheck, UserCheck, Stethoscope, User, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user } = res.data.data;
      login(accessToken, user);

      // Route according to user role
      switch (user.role) {
        case 'SUPER_ADMIN':
          navigate('/super-admin');
          break;
        case 'HOSPITAL_ADMIN':
          navigate('/hospital-admin');
          break;
        case 'DOCTOR':
          navigate('/doctor');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist');
          break;
        case 'PATIENT':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl shadow-xl shadow-sky-500/10 mb-4">
          <Activity className="h-10 w-10 text-sky-400" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Medsync</h2>
        <p className="mt-2 text-sm text-slate-400">
          AI Healthcare Assistant & Multi-Tenant Hospital Platform
        </p>
        <div className="mt-1 inline-block px-3 py-0.5 rounded-full bg-sky-900/60 border border-sky-500/30 text-sky-300 text-xs font-semibold">
          Sunrise Multispeciality Hospital (HOSP-DEMO-001)
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* Quick Demo Selector */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Sparkles className="w-4 h-4" />
            <span>Select 1-Click Demo Account (MongoDB Live)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('superadmin@demo.com', 'password123')}
              className={`p-2 rounded-xl text-left border text-xs transition flex flex-col items-center justify-center gap-1 ${
                email === 'superadmin@demo.com'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-500 text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-center">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('admin@sunrisehospital.demo', 'Admin@12345')}
              className={`p-2 rounded-xl text-left border text-xs transition flex flex-col items-center justify-center gap-1 ${
                email === 'admin@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-500 text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-center">Hosp Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('arjun.mehta@sunrisehospital.demo', 'Doctor@12345')}
              className={`p-2 rounded-xl text-left border text-xs transition flex flex-col items-center justify-center gap-1 ${
                email === 'arjun.mehta@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-500 text-slate-300'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-center">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('kavya.reddy@sunrisehospital.demo', 'Reception@12345')}
              className={`p-2 rounded-xl text-left border text-xs transition flex flex-col items-center justify-center gap-1 ${
                email === 'kavya.reddy@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-500 text-slate-300'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-center">Receptionist</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('patient001@sunrisehospital.demo', 'Patient@12345')}
              className={`p-2 rounded-xl text-left border text-xs transition flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
                email === 'patient001@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-500 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="font-semibold text-center">Patient</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-xs text-slate-400">
            Strict tenant isolation enforced. Clinical decisions remain the responsibility of qualified doctors.
          </div>
        </div>
      </div>
    </div>
  );
};
