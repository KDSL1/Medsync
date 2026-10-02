import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Shield,
  ShieldCheck,
  Bot,
  FileText,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  Users,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Download,
  Lock,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  HeartPulse
} from 'lucide-react';
import { MarketingNavbar } from './MarketingNavbar';

export const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'patients'>('patients');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        {/* Subtle Ambient Mesh & Grid Background */}
        <div className="ambient-glow -top-20 left-1/4 w-[500px] h-[500px] bg-sky-600/20" />
        <div className="ambient-glow top-40 right-1/4 w-[400px] h-[400px] bg-teal-500/15" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Subtle Minimal Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-sky-400 text-xs font-medium tracking-wide mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Healthcare Intelligence Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Web, Android & PWA</span>
          </div>

          {/* Clean Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Smarter Healthcare. <br />
            <span className="text-slate-400 font-light">Simpler for Everyone.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered infrastructure connecting hospitals, clinicians, and patients — turning complex medical data into clear, human-understandable clarity.
          </p>

          {/* Minimalist CTA Row with 3D tactile buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="btn-3d inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-sky-600 text-white transition cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 translate-z-10" />
            </Link>

            <a
              href="#solutions"
              className="btn-3d-secondary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 transition"
            >
              Explore Platform
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>

          {/* 3D Isometric Interactive Clinical AI Showcase */}
          <div className="mt-16 isometric-stage max-w-4xl mx-auto px-2">
            <div className="isometric-card-3d glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 text-left relative overflow-hidden">
              {/* Internal ambient lighting layer */}
              <div className="ambient-glow -top-10 -right-10 w-64 h-64 bg-sky-500/20" />
              <div className="ambient-glow -bottom-10 -left-10 w-64 h-64 bg-teal-500/15" />

              {/* Top Bar with 3D Depth */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 translate-z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-sky-500/25">
                    <Activity className="w-5 h-5 text-slate-950 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>Medsync Clinical Intelligence Core</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        LIVE
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">Node ID: MED-ATLAS-991 • Tenant Isolated</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-medium">AI Safety Guardrails Active</span>
                </div>
              </div>

              {/* 3D Dashboard Mockup Content Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 preserve-3d">
                {/* 3D Floating Biomarker Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl transition-all duration-300 hover:border-sky-500/50 translate-z-30 card-3d">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-sky-400">AI Report OCR</span>
                    <span className="font-mono text-emerald-400">Normal Range</span>
                  </div>
                  <div className="text-lg font-bold text-white">Hemoglobin (Hb)</div>
                  <div className="text-2xl font-extrabold text-sky-400 mt-0.5 font-mono">
                    14.2 <span className="text-xs font-normal text-slate-400 font-sans">g/dL</span>
                  </div>
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-sky-400 font-semibold">Plain-English:</span> Oxygen-carrying protein count is balanced. No immediate clinical flags.
                  </div>
                </div>

                {/* 3D Floating Medication Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl transition-all duration-300 hover:border-teal-500/50 translate-z-40 card-3d">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-teal-400">Prescription Sync</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono text-[10px]">Today</span>
                  </div>
                  <div className="text-lg font-bold text-white">Metformin 500mg</div>
                  <div className="text-xs text-slate-400 mt-0.5">Post-dinner schedule</div>
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <div className="text-[11px] font-medium text-slate-200">Scheduled: 8:30 PM</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmed Taken</span>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold">
                      1x
                    </span>
                  </div>
                </div>

                {/* 3D Clinical Queue & Safety Gate */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl transition-all duration-300 hover:border-purple-500/50 translate-z-30 card-3d">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-purple-400">Hospital Queue</span>
                    <span className="font-mono text-purple-300">Room 204</span>
                  </div>
                  <div className="text-lg font-bold text-white">Dr. Arjun Mehta</div>
                  <div className="text-xs text-slate-400 mt-0.5">Internal Medicine</div>
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-[11px] text-purple-200 leading-relaxed flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Next Patient Token #14 • Digital Prescription Ready</span>
                  </div>
                </div>
              </div>

              {/* Floating 3D Accent Pill */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/60 translate-z-20 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>Real-time RAG context translation with medical source citations</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Hover to inspect 3D perspective
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Stat Ribbon */}
          <div className="mt-16 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
            <div className="card-3d p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="text-2xl font-semibold text-white">99.9%</div>
              <div className="text-xs text-slate-500 mt-0.5">Cloud Uptime & Liveness</div>
            </div>
            <div className="card-3d p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="text-2xl font-semibold text-sky-400">Zero-PHI</div>
              <div className="text-xs text-slate-500 mt-0.5">Super Admin Privacy Gate</div>
            </div>
            <div className="card-3d p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="text-2xl font-semibold text-teal-400">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Tenant Data Isolation</div>
            </div>
            <div className="card-3d p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="text-2xl font-semibold text-slate-300">FastAPI + Atlas</div>
              <div className="text-xs text-slate-500 mt-0.5">Production Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution — Minimal Split Grid */}
      <section className="py-24 border-t border-slate-900 bg-[#050914] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Core Purpose</h2>
            <p className="text-3xl font-semibold text-white tracking-tight">The friction in healthcare today, resolved.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Challenge */}
            <div className="glass-panel card-3d p-8 rounded-2xl border border-rose-500/20 preserve-3d">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3 translate-z-10">Current Healthcare Friction</div>
              <h3 className="text-lg font-semibold text-white mb-4 translate-z-20">Fragmented systems, cryptic diagnostic papers</h3>
              <ul className="space-y-3.5 text-sm text-slate-400 translate-z-10">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 mt-2 flex-shrink-0" />
                  <span>Lab reports contain raw clinical abbreviations and numerical ranges that cause panic or get overlooked.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 mt-2 flex-shrink-0" />
                  <span>Complex multi-medication schedules lead to unintended dosage errors and missed treatment windows.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 mt-2 flex-shrink-0" />
                  <span>Admins and receptionists battle separate scheduling sheets, resulting in long waiting-room delays.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="glass-panel card-3d p-8 rounded-2xl border border-sky-500/30 preserve-3d">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 translate-z-10">The Medsync Paradigm</div>
              <h3 className="text-lg font-semibold text-white mb-4 translate-z-20">Continuous coordination, plain-language insights</h3>
              <ul className="space-y-3.5 text-sm text-slate-300 translate-z-10">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span><strong>AI Report Translation:</strong> Optical extraction transforms complex lab markers into safe, accessible summaries.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span><strong>Digital Medicine Calendars:</strong> Structured morning, afternoon, and night timing reminders.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span><strong>Unified Tenant Workflows:</strong> Real-time coordination across Super Admins, Hospital Admins, Doctors, and Patients.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Intelligence & Safety Notice */}
      <section className="py-24 border-t border-slate-900 bg-[#030712]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Responsible AI</h2>
            <p className="text-3xl font-semibold text-white tracking-tight">Clinical precision with strict ethical guardrails.</p>
          </div>

          {/* Prominent Medical Notice */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium flex items-center justify-between mb-10 card-3d">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <span>&ldquo;AI assists understanding. Certified medical doctors make clinical decisions.&rdquo;</span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">NON-DIAGNOSTIC ADVISORY</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel card-3d p-6 rounded-2xl preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 translate-z-30 shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 translate-z-20">Automated OCR Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed translate-z-10">
                Ingests clinical documents and extracts parameters (Hemoglobin, Glucose, Creatinine) against physiological ranges.
              </p>
            </div>

            <div className="glass-panel card-3d p-6 rounded-2xl preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 translate-z-30 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 translate-z-20">Contextual RAG Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed translate-z-10">
                Interprets medical values into clear, everyday language with verifiable source citations and educational context.
              </p>
            </div>

            <div className="glass-panel card-3d p-6 rounded-2xl preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 translate-z-30 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 translate-z-20">Hardcoded Safety Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed translate-z-10">
                Strictly blocks prescription attempts or dosage modification. Immediately detects red-flag emergency symptoms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Stakeholder Solutions */}
      <section className="py-24 border-t border-slate-900 bg-[#050914]" id="solutions">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Tailored Experiences</h2>
              <p className="text-3xl font-semibold text-white tracking-tight">Dedicated portals for every stakeholder.</p>
            </div>

            {/* Clean Segmented Tab Control */}
            <div className="mt-4 sm:mt-0 inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
              {(['patients', 'doctors', 'hospitals'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeTab === tab
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'patients' ? 'For Patients' : tab === 'doctors' ? 'For Doctors' : 'For Hospitals'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Display Panel */}
          <div className="glass-panel p-8 sm:p-10 rounded-2xl">
            {activeTab === 'patients' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Clarity over your health records</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Upload lab sheets from your phone or desktop to receive safe, plain-English explanations. Track prescription schedules and keep your healthcare team updated.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>Instant report breakdown without diagnostic claims</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>Daily morning, afternoon, and night medicine schedules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>Book and reschedule appointments with direct confirmation</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link to="/login" className="text-xs font-medium text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5">
                      Launch Patient Portal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-3">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-sans">Sample Plain-English Translation</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-slate-500 font-medium">Hemoglobin:</span> 10.2 g/dL (Normal Range: 12.0 - 15.5 g/dL)
                  </div>
                  <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-900/40 text-sky-200/90 leading-relaxed">
                    <strong>AI Note:</strong> Your hemoglobin reading is slightly below the laboratory reference interval. This indicator reflects red blood cell oxygen transport. Share this reading with your physician.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Structured clinical workflow</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Spend less time dealing with paperwork. Access organized patient histories, issue structured e-prescriptions, and review categorized lab summaries.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>Standardized electronic prescription generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>Rapid chronological view of previous visits and notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>One-click scheduling for clinical follow-up dates</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link to="/login" className="text-xs font-medium text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5">
                      Launch Doctor Portal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider">Today&apos;s Appointments Queue</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Ananya Sharma</div>
                      <div className="text-[11px] text-slate-500">Hypertension Follow-up</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[11px] font-mono">10:30 AM</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Rahul Verma</div>
                      <div className="text-[11px] text-slate-500">CBC & Lipid Panel Review</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[11px] font-mono">11:15 AM</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hospitals' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Enterprise multi-tenant isolation</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Centralized operational control across departments, clinical staff, bed capacity, and patient registration throughput with automated audit logging.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Guaranteed tenant isolation (Hospital A never sees Hospital B)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Department oversight across 9 medical specialties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>HIPAA-ready audit log trail of clinical interactions</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link to="/login" className="text-xs font-medium text-purple-400 hover:text-purple-300 inline-flex items-center gap-1.5">
                      Launch Hospital Admin Portal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-xl font-semibold text-white">9</div>
                    <div className="text-[11px] text-slate-500 mt-1">Clinical Departments</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-xl font-semibold text-emerald-400">100%</div>
                    <div className="text-[11px] text-slate-500 mt-1">Tenant Isolation</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-xl font-semibold text-sky-400">33</div>
                    <div className="text-[11px] text-slate-500 mt-1">Seeded Accounts</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-xl font-semibold text-purple-400">HIPAA</div>
                    <div className="text-[11px] text-slate-500 mt-1">Audit Logging</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* App Access & Mobile Download Banner with 3D Isometric Device Showcase */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/70 relative" id="app-access">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden border border-sky-500/20 card-3d preserve-3d">
            <div className="ambient-glow top-0 right-0 w-80 h-80 bg-sky-500/15 pointer-events-none" />
            <div className="ambient-glow bottom-0 left-0 w-64 h-64 bg-teal-500/10 pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4 badge-3d">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Multi-Platform Available</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                  Experience Medsync on Web & Android
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xl">
                  Seamlessly launch the authenticated clinical web application or install the native Android APK package directly to your phone for mobile report uploads, live queue status, and medicine reminders.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/app"
                    className="btn-3d inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-sky-600 text-white transition cursor-pointer"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Launch Web Portal</span>
                  </Link>

                  <a
                    href="/app-debug.apk"
                    download
                    className="btn-3d-secondary inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-700 text-slate-200 transition"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Android APK</span>
                  </a>
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-mono">
                  <span>Package: com.medsync.healthcare</span>
                  <span>•</span>
                  <span>Build: Android 14+ / JVM 21</span>
                </div>
              </div>

              {/* Right Column: 3D Isometric Smartphone Mockup */}
              <div className="lg:col-span-5 isometric-stage flex justify-center">
                <div className="isometric-card-3d w-72 rounded-[2.5rem] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-black border-2 border-slate-700/80 shadow-2xl relative">
                  {/* Phone Notch/Speaker */}
                  <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>

                  {/* Phone Screen Display */}
                  <div className="rounded-[2rem] bg-slate-950 p-4 border border-slate-800/80 text-left space-y-3.5 overflow-hidden relative">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-slate-800">
                      <span>9:41 AM</span>
                      <span className="text-sky-400">Medsync Mobile</span>
                      <span>5G 100%</span>
                    </div>

                    {/* 3D Floating Mobile Pill 1 */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/30 card-3d translate-z-20">
                      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Daily Dose Alert</span>
                      </div>
                      <div className="text-xs font-medium text-white">Atorvastatin 20mg</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Scheduled for 9:00 PM tonight</div>
                    </div>

                    {/* 3D Floating Mobile Pill 2 */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 card-3d translate-z-30">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Report OCR Analyzed</span>
                      </div>
                      <div className="text-xs font-medium text-white">Complete Blood Count (CBC)</div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">3 parameters extracted in plain language</div>
                    </div>

                    {/* Quick Button Mockup */}
                    <div className="w-full py-2 bg-gradient-to-r from-sky-600 to-teal-500 rounded-lg text-center text-xs font-semibold text-white shadow-md">
                      Ask Medsync AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial SaaS Pricing & Monetization */}
      <section className="py-24 border-t border-slate-900 bg-[#040815] relative" id="pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3 badge-3d">
              <span>Transparent Commercial Tiers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Predictable Plans for Hospitals, Clinics & Patients
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Start with a 30-day free pilot. Upgrade or downgrade anytime with instant multi-tenant activation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch perspective-1200">
            {/* Tier 1: Clinic Starter */}
            <div className="glass-panel card-3d p-8 rounded-3xl flex flex-col justify-between border-slate-800 preserve-3d">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Polyclinics & Small Clinics</span>
                <h3 className="text-xl font-bold text-white mt-1 translate-z-10">Clinic Starter</h3>
                <div className="mt-4 flex items-baseline gap-1 translate-z-20">
                  <span className="text-4xl font-extrabold text-white">$49</span>
                  <span className="text-xs text-slate-400">/ month (or ₹3,999)</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Essential workflow automation and clinical AI reports for small medical practices.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to 5 Certified Doctors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>100 AI Lab Report Scans / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Digital Prescription Writer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Patient Token Queue Intake</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Automated Dosage Reminders</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <Link
                  to="/login"
                  className="btn-3d-secondary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-200 transition"
                >
                  <span>Start 30-Day Pilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tier 2: Hospital Pro (Highlighted 3D Card) */}
            <div className="glass-panel card-3d p-8 rounded-3xl flex flex-col justify-between border-sky-500/50 relative shadow-2xl shadow-sky-500/20 preserve-3d scale-105 z-10 translate-z-20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-[10px] tracking-wider uppercase shadow-md badge-3d">
                Most Popular for Hospitals
              </div>
              <div>
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Multi-Specialty Centers</span>
                <h3 className="text-xl font-bold text-white mt-1 translate-z-10">Hospital Pro</h3>
                <div className="mt-4 flex items-baseline gap-1 translate-z-20">
                  <span className="text-4xl font-extrabold text-white">$199</span>
                  <span className="text-xs text-slate-400">/ month (or ₹14,999)</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Complete multi-department clinical infrastructure with priority OCR compute.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Up to 25 Certified Doctors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>1,000 AI Lab Report Scans / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Multi-Department Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Automated WhatsApp Reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>HIPAA-Ready Audit Logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>24/7 Dedicated Support</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <Link
                  to="/login"
                  className="btn-3d w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-sky-600 text-white transition cursor-pointer"
                >
                  <span>Activate Hospital Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tier 3: Enterprise & Lab Chains */}
            <div className="glass-panel card-3d p-8 rounded-3xl flex flex-col justify-between border-slate-800 preserve-3d">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Chains & Diagnostic Labs</span>
                <h3 className="text-xl font-bold text-white mt-1 translate-z-10">Enterprise Health</h3>
                <div className="mt-4 flex items-baseline gap-1 translate-z-20">
                  <span className="text-4xl font-extrabold text-white">$599</span>
                  <span className="text-xs text-slate-400">/ month (or ₹44,999)</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Dedicated cloud tenancy, custom hospital domain, and direct EHR integrations.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Unlimited Doctors & Patients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>10,000+ AI Lab Scans / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Custom Hospital Domain & Logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Dedicated MongoDB Cluster</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Custom BAA & SLA Guarantees</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <Link
                  to="/login"
                  className="btn-3d-secondary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-200 transition"
                >
                  <span>Contact Sales</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-slate-900 bg-[#030712]" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Common Questions</h2>
            <p className="text-3xl font-semibold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Does the AI assistant provide medical diagnoses?",
                a: "No. Medsync is strictly an assistive educational system. Built-in guardrails block diagnostic statements, medication prescriptions, or dosage modifications. Certified physicians make all medical conclusions."
              },
              {
                q: "How does Medsync ensure patient data isolation?",
                a: "Every hospital data record is assigned a tenant identifier and queried through strict PyMongo filters. Cross-tenant access is structurally disallowed, and Super Admins view aggregate platform analytics without patient PHI access."
              },
              {
                q: "How do I run the app on Android?",
                a: "The web project compiles cleanly into an Android application via Capacitor. The Android Studio project is located in apps/web/android and can be built directly into an APK or run in the Android emulator."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer transition hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === idx ? 'rotate-90 text-sky-400' : ''}`} />
                </div>
                {activeFaq === idx && (
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed pt-3 border-t border-slate-800/60">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-12 border-t border-slate-900 bg-[#02050c] text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">Medsync</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center md:text-right text-[11px] text-slate-500 max-w-sm">
            Designed for educational clarity and hospital efficiency. Does not replace professional medical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
};
