import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Building2,
  Users,
  Calendar,
  FileText,
  Clock,
  Shield,
  Stethoscope,
  Heart,
  Bot
} from 'lucide-react';
import { api } from '../services/api';

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: Array<{ id: string; label: string; icon: any }>;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  title,
  activeTab,
  onTabChange,
  tabs = []
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.data.results || []);
      setShowSearchResults(true);
    } catch (e) {
      console.error('Search error:', e);
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">Super Admin</span>;
      case 'HOSPITAL_ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Hospital Admin</span>;
      case 'DOCTOR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Doctor</span>;
      case 'RECEPTIONIST':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Receptionist</span>;
      case 'PATIENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 border border-pink-200">Patient</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-sky-500 rounded-xl text-white shadow-lg shadow-sky-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Medsync</h1>
            <p className="text-xs text-sky-400 font-medium truncate max-w-[150px]">
              {user?.hospitalName || 'Platform Owner'}
            </p>
          </div>
        </div>

        {/* Tab Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            {getRoleBadge()}
          </div>

          {/* Search Bar & User actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200 w-64 md:w-80">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Role-aware search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="bg-transparent text-xs w-full focus:outline-none text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Floating search dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Authorized Search Results
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <p className="text-xs font-medium text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Portal View */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
