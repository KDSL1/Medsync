import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../components/PortalLayout';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Building2,
  Calendar,
  Plus,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HospitalAdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [receptionists, setReceptionists] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal toggles
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    fullName: '',
    email: '',
    password: 'password123',
    phone: '',
    specialization: '',
    licenseNumber: '',
    departmentId: '',
    consultationFee: 120,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, docRes, recRes, patRes, deptRes] = await Promise.all([
        api.get('/hospital/dashboard'),
        api.get('/hospital/doctors'),
        api.get('/hospital/receptionists'),
        api.get('/hospital/patients'),
        api.get('/hospital/departments'),
      ]);
      setData(dashRes.data.data);
      setDoctors(docRes.data.data);
      setReceptionists(recRes.data.data);
      setPatients(patRes.data.data);
      setDepartments(deptRes.data.data);
    } catch (e) {
      console.error('Hospital Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hospital/doctors', newDoctor);
      setShowDoctorModal(false);
      setNewDoctor({
        fullName: '',
        email: '',
        password: 'password123',
        phone: '',
        specialization: '',
        licenseNumber: '',
        departmentId: '',
        consultationFee: 120,
      });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to add doctor');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Hospital Overview', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'receptionists', label: 'Receptionists', icon: Users },
    { id: 'patients', label: 'Patients', icon: UserCheck },
    { id: 'departments', label: 'Departments', icon: Building2 },
  ];

  return (
    <PortalLayout
      title="Hospital Admin Portal"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading hospital telemetry...</div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Doctors</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{data?.stats?.totalDoctors || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Patients</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{data?.stats?.totalPatients || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Receptionists</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{data?.stats?.totalReceptionists || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Today's Visits</p>
                  <p className="text-xl font-bold text-sky-600 mt-0.5">{data?.stats?.todayAppointments || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Upcoming</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">{data?.stats?.upcomingAppointments || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Follow-Ups</p>
                  <p className="text-xl font-bold text-amber-600 mt-0.5">{data?.stats?.pendingFollowUps || 0}</p>
                </div>
              </div>

              {/* Department Overview */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Clinical Departments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900 text-xs">{dept.name}</h4>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded text-[10px] font-bold">
                          {dept._count?.doctors || 0} Doctors
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{dept.description || 'No description provided.'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Patient Registrations */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Patient Admissions</h3>
                <div className="divide-y divide-slate-100">
                  {data?.recentRegistrations?.map((r: any) => (
                    <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{r.fullName}</p>
                        <p className="text-[11px] text-slate-500">{r.email} • {r.phone}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Medical Staff</h3>
                  <p className="text-xs text-slate-500">Manage licensed clinical doctors and departments.</p>
                </div>
                <button
                  onClick={() => setShowDoctorModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Doctor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {doc.user?.fullName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{doc.user?.fullName}</h4>
                        <p className="text-[11px] text-sky-700 font-medium">{doc.specialization}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <p><span className="text-slate-400">License:</span> <span className="font-mono">{doc.licenseNumber}</span></p>
                      <p><span className="text-slate-400">Department:</span> {doc.department?.name || 'General'}</p>
                      <p><span className="text-slate-400">Consultation Fee:</span> ${doc.consultationFee}</p>
                      <p><span className="text-slate-400">Appointments:</span> {doc._count?.appointments || 0} visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Patient Directory</h3>
                <p className="text-xs text-slate-500">All registered patients within your hospital tenant.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Patient Name</th>
                      <th className="px-5 py-3.5">Blood Group</th>
                      <th className="px-5 py-3.5">Assigned Doctor</th>
                      <th className="px-5 py-3.5">Visits</th>
                      <th className="px-5 py-3.5">Prescriptions</th>
                      <th className="px-5 py-3.5">Reports</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {p.user?.fullName}
                          <span className="block text-[11px] text-slate-400 font-normal">{p.user?.email}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-rose-600 font-bold">{p.bloodGroup || 'N/A'}</td>
                        <td className="px-5 py-3.5">{p.assignedDoctor?.user?.fullName || 'Dr. Rajesh Sharma'}</td>
                        <td className="px-5 py-3.5">{p._count?.appointments || 0}</td>
                        <td className="px-5 py-3.5">{p._count?.prescriptions || 0}</td>
                        <td className="px-5 py-3.5">{p._count?.medicalReports || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Medical Doctor</h3>
            <p className="text-xs text-slate-500 mb-4">Assign doctor credentials and clinical department.</p>

            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. John Watson, MD"
                  value={newDoctor.fullName}
                  onChange={(e) => setNewDoctor({ ...newDoctor, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">License No</label>
                  <input
                    type="text"
                    required
                    placeholder="MD-NY-10293"
                    value={newDoctor.licenseNumber}
                    onChange={(e) => setNewDoctor({ ...newDoctor, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="Cardiologist"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={newDoctor.departmentId}
                  onChange={(e) => setNewDoctor({ ...newDoctor, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
