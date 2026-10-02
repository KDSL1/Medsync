import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../components/PortalLayout';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Bot,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  Upload,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Heart,
  HelpCircle
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: 'assistant',
      content: 'Hello! I am your Medsync Healthcare Assistant. How can I assist you with your uploaded test results, doctor instructions, or daily medications today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceAttributions: [
        { type: 'general', label: 'Medsync AI', text: 'Ready to explain reports and medicine instructions in plain language.' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // File Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('BLOOD_TEST');
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, medRes, repRes, notifRes, fRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/medicines'),
        api.get('/reports'),
        api.get('/notifications'),
        api.get('/followups'),
      ]);
      setAppointments(aptRes.data.data);
      setMedicines(medRes.data.data);
      setReports(repRes.data.data);
      setNotifications(notifRes.data.data);
      setFollowUps(fRes.data.data);

      if (repRes.data.data.length > 0 && !selectedReport) {
        setSelectedReport(repRes.data.data[0]);
      }
    } catch (e) {
      console.error('Patient fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMedicineAction = async (medicineScheduleId: string, action: 'TAKEN' | 'SKIPPED' | 'SNOOZED') => {
    try {
      await api.post(`/medicines/${medicineScheduleId}/action`, { action });
      fetchData();
    } catch (e) {
      console.error('Medicine action failed:', e);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      const { reply, sourceAttributions, safetyAlert } = res.data.data;

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: reply,
          sourceAttributions,
          safetyAlert,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'Sorry, I encountered an error processing your query. Please check your network or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle || uploadFile.name);
    formData.append('category', uploadCategory);

    try {
      const res = await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadFile(null);
      setUploadTitle('');
      fetchData();
      alert('Report uploaded and analyzed by AI successfully!');
      if (res.data.data?.report) {
        setSelectedReport({
          ...res.data.data.report,
          analysis: res.data.data.analysis
        });
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const parseReportKeyValues = (analysis: any) => {
    if (!analysis || !analysis.keyValuesJson) return [];
    try {
      return JSON.parse(analysis.keyValuesJson);
    } catch {
      return [];
    }
  };

  const parseDoctorQuestions = (analysis: any) => {
    if (!analysis || !analysis.doctorQuestions) return [];
    try {
      return JSON.parse(analysis.doctorQuestions);
    } catch {
      return [];
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'My Health Home', icon: LayoutDashboard },
    { id: 'medicines', label: 'Today’s Medicines', icon: Pill },
    { id: 'reports', label: 'Understand My Reports', icon: FileText },
    { id: 'trends', label: 'Biomarker Trends (Care+)', icon: Sparkles },
    { id: 'ai-assistant', label: 'Ask AI Assistant', icon: Bot },
    { id: 'appointments', label: 'Appointments & Follow-ups', icon: Calendar },
    { id: 'notifications', label: 'Reminders & Alerts', icon: Bell },
  ];

  return (
    <PortalLayout
      title="Patient Health Portal"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      {/* Educational Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex items-start gap-3.5 shadow-sm">
        <div className="p-2 bg-sky-600 text-white rounded-xl shadow-md shadow-sky-600/20 mt-0.5 flex-shrink-0">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">Your AI Medical Companion</h4>
          <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">
            Medsync helps translate complex laboratory reports into clear everyday language and keeps your daily medicines on schedule. <strong>Note:</strong> Medsync does not diagnose diseases or replace your doctor. Always confirm clinical decisions with your healthcare provider.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading your health records...</div>
      ) : (
        <>
          {/* 1. HEALTH DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Quick Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Next Appointment Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 stat-card-3d preserve-3d">
                  <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs mb-3 translate-z-10">
                    <Calendar className="w-4 h-4" />
                    <span>NEXT APPOINTMENT</span>
                  </div>
                  {appointments.length > 0 ? (
                    <div className="translate-z-20">
                      <p className="font-bold text-slate-900 text-sm">{appointments[0].reason}</p>
                      <p className="text-xs text-slate-500 mt-1">With {appointments[0].doctor?.user?.fullName}</p>
                      <div className="mt-3 inline-block px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg font-mono text-xs font-semibold badge-3d">
                        {new Date(appointments[0].dateTime).toLocaleDateString()} at {new Date(appointments[0].dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No scheduled appointments.</p>
                  )}
                </div>

                {/* Upcoming Follow-Up Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 stat-card-3d preserve-3d">
                  <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs mb-3 translate-z-10">
                    <Clock className="w-4 h-4" />
                    <span>RECOMMENDED FOLLOW-UP</span>
                  </div>
                  {followUps.length > 0 ? (
                    <div className="translate-z-20">
                      <p className="font-bold text-slate-900 text-sm">{followUps[0].reason}</p>
                      <p className="text-xs text-slate-500 mt-1">Due: {new Date(followUps[0].dueDate).toLocaleDateString()}</p>
                      <span className="mt-3 inline-block px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold badge-3d">
                        Status: {followUps[0].status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No pending follow-ups required.</p>
                  )}
                </div>

                {/* Recent Report Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 stat-card-3d preserve-3d">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-3 translate-z-10">
                    <FileText className="w-4 h-4" />
                    <span>RECENT LAB REPORT</span>
                  </div>
                  {reports.length > 0 ? (
                    <div className="translate-z-20">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{reports[0].title}</p>
                      <p className="text-xs text-slate-500 mt-1">Analyzed by AI Assistant</p>
                      <button
                        onClick={() => {
                          setSelectedReport(reports[0]);
                          setActiveTab('reports');
                        }}
                        className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read Simple Explanation</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No reports uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Today's Medicines Quick View */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 stat-card-3d">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Today's Medicine Schedule</h3>
                    <p className="text-xs text-slate-500">Track doses prescribed by your doctor. Dosages cannot be changed here.</p>
                  </div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                    {medicines.length} Prescribed Medicines
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {medicines.map((med) => (
                    <div key={med.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{med.medicineName}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono rounded font-semibold text-[11px]">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          ⏰ {med.scheduledTime} • {med.frequency} ({med.timing.replace('_', ' ')})
                        </p>
                        {med.instructions && (
                          <p className="text-[11px] text-slate-600 italic mt-0.5">
                            Instructions: {med.instructions}
                          </p>
                        )}
                      </div>

                      {/* Log Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMedicineAction(med.id, 'TAKEN')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-sm transition"
                        >
                          Mark Taken
                        </button>
                        <button
                          onClick={() => handleMedicineAction(med.id, 'SKIPPED')}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition"
                        >
                          Skipped
                        </button>
                        <button
                          onClick={() => handleMedicineAction(med.id, 'SNOOZED')}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition"
                        >
                          Snooze (15m)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. MEDICINES TAB */}
          {activeTab === 'medicines' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-1">Active Prescription Schedule</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Prescribed medication regimens provided by your attending physician.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicines.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{m.medicineName}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          {m.dosage}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        <span className="font-semibold">Schedule:</span> {m.frequency} at {m.scheduledTime}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-semibold">Timing:</span> {m.timing.replace('_', ' ')}
                      </p>
                      {m.instructions && (
                        <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                          "{m.instructions}"
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          onClick={() => handleMedicineAction(m.id, 'TAKEN')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold text-xs"
                        >
                          Taken
                        </button>
                        <button
                          onClick={() => handleMedicineAction(m.id, 'SKIPPED')}
                          className="px-3 py-1 border border-slate-300 text-slate-700 rounded-lg text-xs"
                        >
                          Skipped
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. UNDERSTAND MY REPORTS (CENTRAL AI FEATURE) */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Upload Report Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Upload New Medical Report</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Upload blood test scans, lab panels, or discharge summaries. The OCR pipeline extracts text and explains findings in plain language.
                </p>

                <form onSubmit={handleFileUpload} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Report Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lipid Profile Lab Test"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                    >
                      <option value="BLOOD_TEST">Blood Test / CBC</option>
                      <option value="LAB">General Lab Panel</option>
                      <option value="RADIOLOGY">Radiology / X-Ray</option>
                      <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select File (PDF / Image)</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Processing OCR...' : 'Upload & Analyze'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Report Viewer & AI Explanation Breakdown */}
              {selectedReport && selectedReport.analysis ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-semibold text-[10px]">
                          {selectedReport.category}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {new Date(selectedReport.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{selectedReport.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/10 rounded-xl text-white font-medium text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>AI Explained</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Summary Section */}
                    <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl">
                      <h4 className="font-bold text-sky-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span>Plain-Language Summary</span>
                      </h4>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {selectedReport.analysis.summary}
                      </p>
                    </div>

                    {/* Key Laboratory Values */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-3">Key Laboratory Findings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {parseReportKeyValues(selectedReport.analysis).map((kv: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-slate-800 text-xs">{kv.parameter}</h5>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  kv.status === 'ABNORMAL'
                                    ? 'bg-rose-100 text-rose-800'
                                    : kv.status === 'NORMAL'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {kv.status || 'REPORTED'}
                              </span>
                            </div>
                            <p className="text-slate-900 font-mono font-bold text-sm">
                              {kv.value} <span className="text-slate-400 text-xs font-normal">({kv.referenceRange || 'Ref Range Varies'})</span>
                            </p>
                            <p className="text-slate-600 text-[11px] leading-relaxed pt-1 border-t border-slate-200">
                              {kv.simpleExplanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why It Matters */}
                    {selectedReport.analysis.whyItMatters && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-1">Why This Matters For Your Health</h4>
                        <p className="text-slate-600 leading-relaxed">
                          {selectedReport.analysis.whyItMatters}
                        </p>
                      </div>
                    )}

                    {/* Questions For Your Doctor */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                      <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Recommended Questions to Ask Your Doctor</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs">
                        {parseDoctorQuestions(selectedReport.analysis).map((q: string, qIdx: number) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Medical AI Disclaimer */}
                    <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 italic border border-slate-200">
                      <strong>AI Disclaimer:</strong> {selectedReport.analysis.disclaimer}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  Select or upload a report to view the automated plain-language explanation.
                </div>
              )}
            </div>
          )}

          {/* 3.5 BIOMARKER TRENDS (CARE+ PREMIUM) */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Care+ Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-sky-950 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 font-semibold text-[10px] border border-purple-500/40">
                      CARE+ PREMIUM INTELLIGENCE
                    </span>
                    <span className="text-[11px] text-slate-400">Multi-Report Progression</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Biomarker Evolution Over Time</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Track critical blood parameters (Hemoglobin, Glucose, Creatinine, Platelets) across successive pathology visits to detect subtle physiological trends.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-right">
                  <div className="text-xs text-slate-400">Current Status: <span className="text-emerald-400 font-bold">Active Patient</span></div>
                  <div className="text-[11px] text-purple-300 mt-0.5">Family WhatsApp Alerts: Enabled</div>
                </div>
              </div>

              {/* Sample Interactive Biomarker Trend Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hemoglobin Trend */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Hemoglobin (Hb)</h4>
                      <p className="text-[11px] text-slate-400">Oxygen-carrying capacity • Ref: 12.0 – 15.5 g/dL</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs font-mono">13.8 g/dL</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Visit 1 (3 mos ago):</span>
                      <span className="font-mono text-slate-700 font-semibold">10.2 g/dL (Mild Low)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '65%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">Visit 2 (1 mo ago):</span>
                      <span className="font-mono text-slate-700 font-semibold">12.1 g/dL (Normal)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: '80%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">Latest Review:</span>
                      <span className="font-mono text-emerald-600 font-bold">13.8 g/dL (Optimal)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                    AI Clinical Insight: Consistent upward normalization following prescribed iron supplements.
                  </p>
                </div>

                {/* Fasting Blood Glucose Trend */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Fasting Blood Glucose</h4>
                      <p className="text-[11px] text-slate-400">Metabolic glycemic control • Ref: 70 – 99 mg/dL</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold text-xs font-mono">94 mg/dL</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Visit 1 (3 mos ago):</span>
                      <span className="font-mono text-slate-700 font-semibold">112 mg/dL (Pre-Diabetic)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '75%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">Visit 2 (1 mo ago):</span>
                      <span className="font-mono text-slate-700 font-semibold">102 mg/dL (Borderline)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: '68%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">Latest Review:</span>
                      <span className="font-mono text-emerald-600 font-bold">94 mg/dL (Normal)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                    AI Clinical Insight: Glycemic levels have returned within the target laboratory fasting threshold.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. ASK AI ASSISTANT (CHAT WITH RAG & SAFETY) */}
          {activeTab === 'ai-assistant' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px] overflow-hidden text-xs">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-600 text-white rounded-xl shadow-md shadow-sky-600/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Healthcare Assistant</h3>
                    <p className="text-[11px] text-slate-500">Retrieves context from your uploaded reports and doctor notes.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safety Guard Active</span>
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm text-xs leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content}

                      {/* Source Attributions */}
                      {msg.sourceAttributions && msg.sourceAttributions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Verified Clinical Sources:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sourceAttributions.map((src: any, sIdx: number) => (
                              <span
                                key={sIdx}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  src.type === 'report'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                    : src.type === 'doctor'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                [{src.label}]
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                    <Sparkles className="w-4 h-4 animate-spin text-sky-600" />
                    <span>Analyzing your clinical context safely...</span>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask about your test results, prescribed medicines, or appointments..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-xs"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || chatLoading}
                  className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 5. APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-xs">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Your Medical Appointments</h3>
                <p className="text-slate-500">Upcoming visits and consultation history.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{apt.reason}</h4>
                      <p className="text-slate-500 mt-0.5">Doctor: {apt.doctor?.user?.fullName} ({apt.department?.name || 'General'})</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Date: {new Date(apt.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] bg-sky-100 text-sky-800">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Notifications & Reminders</h3>
                  <p className="text-slate-500">Medicine alerts, follow-up reminders, and doctor updates.</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 flex items-start gap-3">
                    <div className="p-2 bg-sky-50 text-sky-700 rounded-xl mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
};
