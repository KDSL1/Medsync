import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../components/PortalLayout';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Clock,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  UserPlus,
  Stethoscope
} from 'lucide-react';

export const ReceptionistPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Book Appointment Modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookData, setBookData] = useState({
    patientId: '',
    doctorId: '',
    dateTime: '',
    reason: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, patRes, docRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/hospital/patients'),
        api.get('/hospital/doctors'),
      ]);
      setAppointments(aptRes.data.data);
      setPatients(patRes.data.data);
      setDoctors(docRes.data.data);
    } catch (e) {
      console.error('Receptionist fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      fetchData();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', bookData);
      setShowBookModal(false);
      setBookData({ patientId: '', doctorId: '', dateTime: '', reason: '', notes: '' });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to book appointment');
    }
  };

  const tabs = [
    { id: 'queue', label: 'Live Patient Queue & Check-In', icon: Clock },
    { id: 'appointments', label: 'All Scheduled Appointments', icon: Calendar },
    { id: 'patients', label: 'Patient Directory', icon: UserCheck },
  ];

  return (
    <PortalLayout
      title="Receptionist Desk"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Hospital Front Desk & Queue Operations</h3>
          <p className="text-xs text-slate-500">Check in arriving patients, manage waitlists, and schedule consultations.</p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading queue data...</div>
      ) : (
        <>
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Live Queue</h4>
                  <span className="text-xs font-semibold text-sky-700">{appointments.length} Total Visits Scheduled</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-sky-50 text-sky-700 rounded-xl font-bold font-mono text-center min-w-[54px]">
                          <p className="text-[10px] text-slate-400 uppercase font-sans">Token</p>
                          <p className="text-base">#{apt.queueNumber || '—'}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{apt.patient?.user?.fullName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'CHECKED_IN' ? 'bg-sky-100 text-sky-800' :
                              apt.status === 'IN_CONSULTATION' ? 'bg-purple-100 text-purple-800' :
                              apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-0.5"><span className="font-medium">Doctor:</span> {apt.doctor?.user?.fullName} ({apt.department?.name || 'General'})</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            Time: {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Reason: {apt.reason}
                          </p>
                        </div>
                      </div>

                      {/* Receptionist Status Control */}
                      <div className="flex items-center gap-2">
                        {apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CHECKED_IN')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition"
                          >
                            Mark Arrived (Check-In)
                          </button>
                        ) : null}

                        {apt.status === 'CHECKED_IN' ? (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'IN_CONSULTATION')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-xs transition"
                          >
                            Send to Doctor
                          </button>
                        ) : null}

                        {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' ? (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                            className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold text-xs transition"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Patient</th>
                    <th className="px-5 py-3.5">Assigned Doctor</th>
                    <th className="px-5 py-3.5">Reason</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-mono text-slate-800">{new Date(apt.dateTime).toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{apt.patient?.user?.fullName}</td>
                      <td className="px-5 py-3.5">{apt.doctor?.user?.fullName}</td>
                      <td className="px-5 py-3.5">{apt.reason}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Patient Name</th>
                    <th className="px-5 py-3.5">Blood Group</th>
                    <th className="px-5 py-3.5">Phone Number</th>
                    <th className="px-5 py-3.5">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{p.user?.fullName}</td>
                      <td className="px-5 py-3.5 font-mono text-rose-600 font-bold">{p.bloodGroup || 'N/A'}</td>
                      <td className="px-5 py-3.5">{p.user?.phone || 'N/A'}</td>
                      <td className="px-5 py-3.5 font-mono">{p.emergencyContact || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Book New Appointment</h3>
            <p className="text-xs text-slate-500 mb-4">Assign patient to a licensed doctor schedule.</p>

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={bookData.patientId}
                  onChange={(e) => setBookData({ ...bookData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">Choose Patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.user?.fullName} ({p.user?.phone || p.user?.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor *</label>
                <select
                  required
                  value={bookData.doctorId}
                  onChange={(e) => setBookData({ ...bookData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">Choose Doctor...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.user?.fullName} - {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={bookData.dateTime}
                  onChange={(e) => setBookData({ ...bookData, dateTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow-up consultation or routine evaluation"
                  value={bookData.reason}
                  onChange={(e) => setBookData({ ...bookData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
