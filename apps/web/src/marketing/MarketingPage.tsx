import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingNavbar } from './MarketingNavbar';
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
  AlertTriangle,
  ArrowRight,
  Download,
  Lock,
  ChevronRight,
  HelpCircle,
  HeartPulse,
  Sparkles
} from 'lucide-react';

export const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'patients'>('patients');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* 1. Header Navbar */}
      <MarketingNavbar />

      {/* 2. Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle grid and glow effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Healthcare Technology Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Smarter Healthcare. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-sky-400">
              Simpler for Everyone.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered healthcare platform connecting hospitals, doctors, and patients while making complex medical information intuitive and easy to understand.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 shadow-xl shadow-sky-500/25 transition active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
            >
              Explore Platform
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/60 hover:bg-sky-900/60 transition"
            >
              Login
            </Link>

            <a
              href="#install-app"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 transition"
            >
              <Smartphone className="w-4 h-4" />
              Install Android / PWA
            </a>
          </div>

          {/* Live Trust Banner */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-sm">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA-Ready Architecture</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Multi-Tenant Hospitals</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Safe Clinical AI RAG</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Android Studio + PWA</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Problem vs Solution Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">The Healthcare Reality</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Bridging the gap between clinical data and patient understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Problem Card */}
            <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-900/40 relative">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">The Challenge Today</h3>
              <ul className="space-y-3.5 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Cryptic Medical Reports:</strong> Patients receive lab sheets with technical acronyms and ranges that trigger unnecessary panic or missed warnings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Missed Medication Schedules:</strong> Complicated dosage regimens lead to unintentional non-adherence and delayed recoveries.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Disjointed Hospital Communication:</strong> Receptionists, doctors, and patients struggle with fragmented schedules and long waiting queues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Forgotten Post-Visit Follow-ups:</strong> Lack of automated reminders causes critical recovery milestones to be neglected.</span>
                </li>
              </ul>
            </div>

            {/* The Solution Card */}
            <div className="p-8 rounded-2xl bg-teal-950/20 border border-teal-800/40 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">The Medsync Solution</h3>
              <ul className="space-y-3.5 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 font-bold">•</span>
                  <span><strong>AI Plain-English Report Extraction:</strong> OCR parses uploaded PDFs and lab photos into intuitive summaries while guarding clinical boundaries.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 font-bold">•</span>
                  <span><strong>Digital Medicine Calendars:</strong> Clear morning, afternoon, and night timing reminders with dosage specifications.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 font-bold">•</span>
                  <span><strong>Unified Multi-Tenant Workflows:</strong> Seamless real-time coordination between Super Admins, Hospital Admins, Doctors, and Receptionists.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 font-bold">•</span>
                  <span><strong>Automated Follow-up Reminders:</strong> Proactive alerts ensure patients return on schedule for review consultations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI Healthcare Assistant & Safety Showcase */}
      <section className="py-20 bg-slate-950 relative overflow-hidden" id="security">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
              <Bot className="w-3.5 h-3.5" />
              <span>Ethical & Clinical AI Safety</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Intelligent Assistance with Ironclad Safety Guardrails
            </h2>
            <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200 text-sm font-medium">
              "AI assists understanding. Doctors make medical decisions."
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated OCR & Extraction</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Patients upload blood tests, pathology reports, or doctor slips. The pipeline identifies biomarkers (e.g. Hemoglobin, Glucose, Creatinine) and reference thresholds automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Contextual RAG Explanations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rather than intimidating medical jargon, our RAG-grounded LLM explains what metrics mean in everyday language with citations and source badges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hardcoded Safety Guard</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our safety engine automatically blocks diagnostic pronouncements, rejects dosage modifications, and instantly flags emergency red-flag symptoms with emergency care guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800/80" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Platform Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enterprise Healthcare Infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <FileText className="w-6 h-6 text-sky-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">AI Medical Report Explanation</h3>
              <p className="text-sm text-slate-400">Translates complex laboratory reference values into plain-language summaries patients can digest.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <Calendar className="w-6 h-6 text-teal-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Smart Appointment Booking</h3>
              <p className="text-sm text-slate-400">Token-based queue management, doctor schedule visibility, and real-time intake updates.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <Clock className="w-6 h-6 text-amber-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Prescriptions & Reminders</h3>
              <p className="text-sm text-slate-400">Automated dosage schedule tracking (Morning, Afternoon, Night) with adherence logging.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <Building2 className="w-6 h-6 text-purple-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Multi-Tenant Isolation</h3>
              <p className="text-sm text-slate-400">Hospital A data is strictly partitioned from Hospital B with tenant-scoped PyMongo filters.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Granular Role-Based Access</h3>
              <p className="text-sm text-slate-400">5 distinct authenticated experiences: Super Admin, Hospital Admin, Doctor, Receptionist, and Patient.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <Smartphone className="w-6 h-6 text-blue-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Native Android & PWA Ready</h3>
              <p className="text-sm text-slate-400">Capacitor-powered Android app support alongside an installable Progressive Web App.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works Pipeline */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Clinical Workflow</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From Laboratory Document to Actionable Patient Clarity
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-sky-400/40">01</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">Upload Report</h3>
                <p className="text-xs text-slate-400">Patient or lab uploads a PDF, PNG, or photo of clinical test results.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-400">File Validation & Storage</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-teal-400/40">02</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">OCR & Extraction</h3>
                <p className="text-xs text-slate-400">Engine digitizes text and parses metrics into structured blood markers and ranges.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400">Biomarker Classification</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-purple-400/40">03</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">Safety Validation</h3>
                <p className="text-xs text-slate-400">Automated guards verify zero diagnosis and zero medication alteration claims.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-400">Clinical Guardrails</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-emerald-400/40">04</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">Doctor Review</h3>
                <p className="text-xs text-slate-400">Patient views plain-language summary while doctor reviews the raw clinical records.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400">Informed Consultation</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Audience Solutions (Tabs: Hospitals, Doctors, Patients) */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800/80" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Tailored Experiences</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Purpose-Built for Every Stakeholder
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'patients'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Patients
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'doctors'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Doctors
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'hospitals'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Hospitals
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800">
            {activeTab === 'patients' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Empowering Patients in Their Care Journey</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Say goodbye to confusing diagnostic terminology. Medsync gives you immediate clarity on your health reports, reminds you when it's time for pills, and keeps you connected to your care team.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>Upload lab sheets and get instant, safe explanations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>Daily morning, afternoon, and night medicine reminders</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>Book and reschedule appointments with preferred doctors</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sky-400 text-sm font-semibold hover:text-sky-300">
                      Try Patient Portal <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-mono text-slate-300">
                  <div className="text-sky-400 font-bold font-sans text-sm">Example AI Plain-Language Breakdown</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Hemoglobin:</span> 10.2 g/dL (Reference: 12.0 - 15.5 g/dL)
                  </div>
                  <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-200">
                    <strong>AI Explanation:</strong> Your hemoglobin level is slightly lower than the standard reference range shown in this report. This test helps measure oxygen transport in your red blood cells. Please share this with your doctor during your next appointment.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Streamlined Clinical Consultations</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Spend less time typing and more time interacting with patients. Access patient histories, write electronic prescriptions, and review categorized lab records in seconds.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>Structured electronic prescriptions with automated dosage frequencies</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>Instant access to patient diagnostic logs and previous consult notes</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>One-click scheduling for recommended recovery follow-up dates</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-teal-400 text-sm font-semibold hover:text-teal-300">
                      Try Doctor Portal <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-slate-200">Today's Appointment Queue</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-semibold">8 Scheduled</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Ananya Sharma</div>
                      <div className="text-[11px] text-slate-400">Follow-up: Hypertension</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">10:30 AM</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Rahul Verma</div>
                      <div className="text-[11px] text-slate-400">Review: CBC & Lipid Panel</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">11:15 AM</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hospitals' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Enterprise Hospital Management</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Manage departments, clinical staff, bed capacity, and patient registration throughput with centralized tenant isolation and automated audit logging.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Dedicated hospital tenancy ensuring strict data privacy</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Department oversight (Cardiology, Neurology, Pediatrics, etc.)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Real-time receptionist queue management and patient intake tracking</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold hover:text-purple-300">
                      Try Hospital Admin Portal <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-white">9</div>
                    <div className="text-xs text-slate-400 mt-1">Clinical Departments</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-emerald-400">100%</div>
                    <div className="text-xs text-slate-400 mt-1">Tenant Isolation</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-sky-400">33</div>
                    <div className="text-xs text-slate-400 mt-1">Active Accounts</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-purple-400">HIPAA</div>
                    <div className="text-xs text-slate-400 mt-1">Audit Trail Active</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Install Mobile / Android App Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/80" id="install-app">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-teal-950/60 border border-sky-800/40 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-4">
                <Smartphone className="w-4 h-4" />
                <span>Multi-Platform Mobility</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Run Everywhere: Web, PWA & Android App
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Built with React and Capacitor, Medsync is available as an installable Progressive Web App (PWA) and a native Android application built via Android Studio. Experience fast mobile report uploads and medicine reminders on your mobile device.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition"
                >
                  <Download className="w-4 h-4" />
                  Launch Web Application
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700">
                  <span>Android Studio Package:</span>
                  <code className="text-sky-300 font-mono">com.medsync.healthcare</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Got Questions?</h2>
            <p className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Does the AI assistant provide medical diagnoses?",
                a: "No. Medsync is an assistive and educational platform. Our AI safety guardrails strictly prevent diagnostic claims, prescription recommendations, or dosage adjustments. All clinical decisions remain solely with certified medical doctors."
              },
              {
                q: "How does Medsync protect confidential patient health data (PHI)?",
                a: "Medsync enforces multi-tenant isolation at the database layer. Every hospital's data is strictly partitioned. Platform Super Admins only view aggregate non-PHI metrics, and full audit logs track any medical record access."
              },
              {
                q: "Can I use Medsync on my Android phone?",
                a: "Yes. Medsync can be added to your home screen as a Progressive Web App (PWA) with offline shell caching, or installed as a native Android APK built using Capacitor and Android Studio."
              },
              {
                q: "What types of medical reports can be uploaded?",
                a: "Patients and clinicians can upload PDF documents, PNG images, and JPEG photos of laboratory test results (CBC, Lipid Panel, Blood Glucose, Metabolic Panels, etc.)."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer transition hover:border-slate-700"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{faq.q}</h3>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-90 text-sky-400' : ''}`} />
                </div>
                {activeFaq === index && (
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Explore live interactive demo accounts for Super Admins, Hospital Admins, Doctors, Receptionists, and Patients.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 shadow-xl shadow-sky-500/25 transition active:scale-95"
          >
            Launch Interactive Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Medsync Healthcare Platform</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
          <div className="text-center md:text-right text-slate-500 max-w-md">
            Notice: Medsync is designed to enhance patient understanding and administrative workflow. It does not replace professional medical diagnosis, advice, or emergency treatment.
          </div>
        </div>
      </footer>
    </div>
  );
};
