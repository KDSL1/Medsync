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

          {/* Minimalist CTA Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/login"
              className="btn-primary-minimal inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium shadow-sm transition"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#solutions"
              className="btn-secondary-minimal inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition"
            >
              Explore Platform
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>

          {/* Minimalist Stat Ribbon */}
          <div className="mt-20 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <div className="text-2xl font-semibold text-white">99.9%</div>
              <div className="text-xs text-slate-500 mt-0.5">Cloud Uptime & Liveness</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-sky-400">Zero-PHI</div>
              <div className="text-xs text-slate-500 mt-0.5">Super Admin Privacy Gate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-teal-400">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Tenant Data Isolation</div>
            </div>
            <div>
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
            <div className="glass-panel p-8 rounded-2xl">
              <div className="text-xs font-medium text-rose-400 uppercase tracking-wider mb-3">Current Healthcare Friction</div>
              <h3 className="text-lg font-semibold text-white mb-4">Fragmented systems, cryptic diagnostic papers</h3>
              <ul className="space-y-3.5 text-sm text-slate-400">
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
            <div className="glass-panel p-8 rounded-2xl border-sky-950">
              <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">The Medsync Paradigm</div>
              <h3 className="text-lg font-semibold text-white mb-4">Continuous coordination, plain-language insights</h3>
              <ul className="space-y-3.5 text-sm text-slate-300">
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
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <span>&ldquo;AI assists understanding. Certified medical doctors make clinical decisions.&rdquo;</span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">NON-DIAGNOSTIC ADVISORY</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Automated OCR Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingests clinical documents and extracts parameters (Hemoglobin, Glucose, Creatinine) against physiological ranges.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Contextual RAG Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interprets medical values into clear, everyday language with verifiable source citations and educational context.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Hardcoded Safety Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
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

      {/* FAQ — Minimalist Clean Accordion */}
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
