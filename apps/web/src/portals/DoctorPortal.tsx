import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../components/PortalLayout';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  FileText,
  Clock,
  Plus,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  Stethoscope,
  Pill
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Prescription Modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [prescData, setPrescData] = useState({
    diagnosis: '',
    instructions: '',
    notes: '',
    followUpRequired: true,
    followUpDate: '',
    followUpInstructions: '',
    medicines: [
      {
        medicineName: 'Metformin',
        dosage: '500 mg',
        frequency: 'Once daily',
        timing: 'AFTER_MEAL',
        scheduledTime: '08:00 AM',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        instructions: 'Take with or after meals.',
      }
    ]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, patRes, prescRes, fRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/hospital/patients'),
        api.get('/prescriptions'),
        api.get('/followups'),
      ]);
      setAppointments(aptRes.data.data);
      setPatients(patRes.data.data);
      setPrescriptions(prescRes.data.data);
      setFollowUps(fRes.data.data);
    } catch (e) {
      console.error('Doctor fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      await api.post('/prescriptions', {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        diagnosis: prescData.diagnosis,
        instructions: prescData.instructions,
        notes: prescData.notes,
        followUpRequired: prescData.followUpRequired,
        followUpDate: prescData.followUpDate,
        followUpInstructions: prescData.followUpInstructions,
        medicines: prescData.medicines,
      });

      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      fetchData();
      alert('Prescription created, appointment completed, and medicine schedule generated!');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to create prescription');
    }
  };

  const handleAddMedicineRow = () => {
    setPrescData({
      ...prescData,
      medicines: [
        ...prescData.medicines,
        {
          medicineName: '',
          dosage: '',
          frequency: 'Once daily',
          timing: 'AFTER_MEAL',
          scheduledTime: '08:00 AM',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          instructions: '',
        }
      ]
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Doctor Schedule & Queue', icon: LayoutDashboard },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'patients', label: 'Patients & History', icon: UserCheck },
    { id: 'followups', label: 'Follow-ups', icon: Clock },
  ];

  return (
    <PortalLayout
      title="Doctor Clinical Portal"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading clinical records...</div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">My Appointments</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Active Patients</p>
                  <p className="text-2xl font-bold text-sky-600 mt-1">{patients.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Prescriptions Issued</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{prescriptions.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Pending Follow-ups</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{followUps.length}</p>
                </div>
              </div>

              {/* Consultation Appointment Queue */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Clinical Consultation Queue</h3>
                    <p className="text-xs text-slate-500">Conduct consultations, record diagnosis notes, and prescribe medicines.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 text-[11px]">
                            Queue #{apt.queueNumber || 'N/A'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'IN_CONSULTATION' ? 'bg-purple-100 text-purple-800' :
                            apt.status === 'CHECKED_IN' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.patient?.user?.fullName}</h4>
                        <p className="text-slate-500 mt-0.5"><span className="font-medium">Reason:</span> {apt.reason}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          {new Date(apt.dateTime).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowPrescriptionModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm transition"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Consult & Prescribe</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issued Prescriptions</h3>
                <p className="text-xs text-slate-500">Prescriptions with structured medicine reminders.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((p) => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{p.patient?.user?.fullName}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded font-semibold text-[11px]">
                        Rx Verified
                      </span>
                    </div>

                    <div>
                      <p className="text-slate-500 font-semibold">Diagnosis:</p>
                      <p className="text-slate-800 font-medium">{p.diagnosis}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Prescribed Medicines ({p.medicineSchedules?.length || 0}):</p>
                      <div className="space-y-1">
                        {p.medicineSchedules?.map((m: any) => (
                          <div key={m.id} className="p-2 bg-slate-50 rounded-lg flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-slate-800">{m.medicineName} ({m.dosage})</span>
                            <span className="text-slate-500">{m.frequency} • {m.scheduledTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {p.instructions && (
                      <p className="text-[11px] text-slate-600 italic bg-amber-50/60 p-2 rounded border border-amber-100">
                        "{p.instructions}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Patients Under My Care</h3>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Name</th>
                      <th className="px-5 py-3.5">Gender / Blood</th>
                      <th className="px-5 py-3.5">Contact</th>
                      <th className="px-5 py-3.5">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">{p.user?.fullName}</td>
                        <td className="px-5 py-3.5">{p.gender || 'N/A'} • <span className="font-bold text-rose-600">{p.bloodGroup || 'N/A'}</span></td>
                        <td className="px-5 py-3.5">{p.user?.phone || p.user?.email}</td>
                        <td className="px-5 py-3.5 font-mono">{p.emergencyContact || 'None Listed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recommended Follow-Ups</h3>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 text-xs">
                  {followUps.map((f) => (
                    <div key={f.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{f.patient?.user?.fullName}</h4>
                        <p className="text-slate-500 mt-0.5">{f.reason}</p>
                        <p className="text-[11px] text-sky-700 font-medium font-mono mt-0.5">
                          Due Date: {new Date(f.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] bg-amber-100 text-amber-800">
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Prescription & Consultation Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Consultation & Prescription for {selectedAppointment.patient?.user?.fullName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formulate clinical diagnosis, prescribe structured medicines, and set follow-up requirements.
            </p>

            <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type 2 Diabetes & Mild Hypertension"
                  value={prescData.diagnosis}
                  onChange={(e) => setPrescData({ ...prescData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Clinical Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Maintain low glycemic index diet, avoid skipping doses, hydrate frequently."
                  value={prescData.instructions}
                  onChange={(e) => setPrescData({ ...prescData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* Medicine Table */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">Prescribed Medicine Schedule</span>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {prescData.medicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Medicine Name (e.g. Metformin)"
                          value={med.medicineName}
                          onChange={(e) => {
                            const newMeds = [...prescData.medicines];
                            newMeds[idx].medicineName = e.target.value;
                            setPrescData({ ...prescData, medicines: newMeds });
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Dosage (e.g. 500 mg)"
                          value={med.dosage}
                          onChange={(e) => {
                            const newMeds = [...prescData.medicines];
                            newMeds[idx].dosage = e.target.value;
                            setPrescData({ ...prescData, medicines: newMeds });
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                        <select
                          value={med.timing}
                          onChange={(e) => {
                            const newMeds = [...prescData.medicines];
                            newMeds[idx].timing = e.target.value;
                            setPrescData({ ...prescData, medicines: newMeds });
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        >
                          <option value="AFTER_MEAL">After Meal</option>
                          <option value="BEFORE_MEAL">Before Meal</option>
                          <option value="WITH_MEAL">With Meal</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Time (e.g. 08:00 AM)"
                          value={med.scheduledTime}
                          onChange={(e) => {
                            const newMeds = [...prescData.medicines];
                            newMeds[idx].scheduledTime = e.target.value;
                            setPrescData({ ...prescData, medicines: newMeds });
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Section */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="followupCheck"
                    checked={prescData.followUpRequired}
                    onChange={(e) => setPrescData({ ...prescData, followUpRequired: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="followupCheck" className="font-semibold text-slate-800">
                    Recommend Follow-Up Visit
                  </label>
                </div>

                {prescData.followUpRequired && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Follow-up Date</label>
                      <input
                        type="date"
                        value={prescData.followUpDate}
                        onChange={(e) => setPrescData({ ...prescData, followUpDate: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Follow-up Instructions</label>
                      <input
                        type="text"
                        placeholder="Repeat blood sugar test before visit"
                        value={prescData.followUpInstructions}
                        onChange={(e) => setPrescData({ ...prescData, followUpInstructions: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm"
                >
                  Submit Prescription & Complete Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
