import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  User,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

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
          navigate('/app/super-admin');
          break;
        case 'HOSPITAL_ADMIN':
          navigate('/app/hospital-admin');
          break;
        case 'DOCTOR':
          navigate('/app/doctor');
          break;
        case 'RECEPTIONIST':
          navigate('/app/receptionist');
          break;
        case 'PATIENT':
          navigate('/app/patient');
          break;
        default:
          navigate('/app');
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
    <div className="min-h-screen bg-[#030712] radial-mesh-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="ambient-glow top-1/4 left-1/4 w-[450px] h-[450px] bg-sky-500/15" />
      <div className="ambient-glow bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10" />

      {/* Top back link to website */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 perspective-1000">
        <div className="inline-flex items-center justify-center p-3.5 bg-sky-500/10 border border-sky-500/30 rounded-2xl shadow-xl shadow-sky-500/20 mb-4 animate-float-3d badge-3d">
          <Activity className="h-8 w-8 text-sky-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Medsync</h2>
        <p className="mt-1 text-xs text-slate-400">
          AI Healthcare Assistant & Multi-Tenant Hospital Platform
        </p>
        <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-sky-400 text-[11px] font-medium badge-3d">
          Sunrise Multispeciality Hospital (HOSP-DEMO-001)
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 relative z-10 perspective-1200">
        {/* Quick Demo Selector */}
        <div className="glass-panel card-3d rounded-2xl p-4 sm:p-5 mb-5 preserve-3d">
          <div className="flex items-center justify-between mb-3 text-xs font-medium tracking-wider text-sky-400 translate-z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>SELECT 1-CLICK DEMO ACCOUNT (LIVE MONGODB)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 preserve-3d">
            <button
              type="button"
              onClick={() => setDemoCredentials('superadmin@demo.com', 'password123')}
              className={`p-2.5 rounded-xl text-left border text-xs transition card-3d flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                email === 'superadmin@demo.com'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-105'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-center text-[11px]">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('admin@sunrisehospital.demo', 'Admin@12345')}
              className={`p-2.5 rounded-xl text-left border text-xs transition card-3d flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                email === 'admin@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-105'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-center text-[11px]">Hosp Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('arjun.mehta@sunrisehospital.demo', 'Doctor@12345')}
              className={`p-2.5 rounded-xl text-left border text-xs transition card-3d flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                email === 'arjun.mehta@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-105'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-center text-[11px]">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('kavya.reddy@sunrisehospital.demo', 'Reception@12345')}
              className={`p-2.5 rounded-xl text-left border text-xs transition card-3d flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                email === 'kavya.reddy@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-105'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-center text-[11px]">Receptionist</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('patient001@sunrisehospital.demo', 'Patient@12345')}
              className={`p-2.5 rounded-xl text-left border text-xs transition card-3d flex flex-col items-center justify-center gap-1.5 col-span-2 sm:col-span-1 cursor-pointer ${
                email === 'patient001@sunrisehospital.demo'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-105'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="font-medium text-center text-[11px]">Patient</span>
            </button>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div className="glass-panel card-3d py-8 px-6 sm:px-10 rounded-2xl preserve-3d">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-center gap-3 text-rose-200 text-xs translate-z-10">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 preserve-3d">
            <div className="translate-z-10">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition"
                />
              </div>
            </div>

            <div className="translate-z-10">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-sky-600 text-white transition disabled:opacity-50 cursor-pointer translate-z-20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <span>Sign In to Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Protected by multi-tenant authentication & zero-trust database encryption.
          </div>
        </div>
      </div>
    </div>
  );
};
