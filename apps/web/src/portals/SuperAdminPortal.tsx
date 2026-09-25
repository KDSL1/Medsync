import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../components/PortalLayout';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldAlert,
  BarChart3,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const SuperAdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Hospital Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHosp, setNewHosp] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, hospRes, auditRes] = await Promise.all([
        api.get('/super-admin/dashboard'),
        api.get('/super-admin/hospitals'),
        api.get('/super-admin/audit-logs'),
      ]);
      setData(dashRes.data.data);
      setHospitals(hospRes.data.data);
      setAuditLogs(auditRes.data.data);
    } catch (e) {
      console.error('Super Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.patch(`/super-admin/hospitals/${id}/status`, { status: nextStatus });
      fetchData();
    } catch (e) {
      console.error('Failed to update hospital status:', e);
    }
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/super-admin/hospitals', newHosp);
      setShowAddModal(false);
      setNewHosp({
        name: '',
        code: '',
        address: '',
        phone: '',
        adminFullName: '',
        adminEmail: '',
        adminPassword: '',
      });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to create hospital');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Platform KPIs', icon: LayoutDashboard },
    { id: 'hospitals', label: 'Hospital Directory', icon: Building2 },
    { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  return (
    <PortalLayout
      title="Super Admin Portal"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      {/* Platform Privacy & Compliance Notice */}
      <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-700 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-purple-900 leading-relaxed">
          <strong className="font-semibold">Platform Governance Notice:</strong> In accordance with strict healthcare privacy principles, the Super Admin portal does not expose individual patient medical documents, prescriptions, or clinical notes. Only platform metrics and tenant administrative controls are accessible here.
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading platform telemetry...</div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hospitals</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{data?.stats?.totalHospitals || 0}</p>
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    {data?.stats?.activeHospitals || 0} active tenants
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Doctors</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{data?.stats?.totalDoctors || 0}</p>
                  <div className="mt-2 text-xs text-sky-600 font-medium">Verified medical licenses</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Patients</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{data?.stats?.totalPatients || 0}</p>
                  <div className="mt-2 text-xs text-slate-500 font-medium">Across all hospital tenants</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Platform Users</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{data?.stats?.totalUsers || 0}</p>
                  <div className="mt-2 text-xs text-purple-600 font-medium">Active RBAC sessions</div>
                </div>
              </div>

              {/* Growth Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">User Growth & Tenant Scaling</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.charts?.userGrowth || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="patients" stackId="1" stroke="#0284c7" fill="#e0f2fe" name="Patients" />
                        <Area type="monotone" dataKey="doctors" stackId="1" stroke="#10b981" fill="#d1fae5" name="Doctors" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Tenant Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hospitals.map(h => ({ name: h.name.split(' ')[0], Doctors: h.doctorCount, Patients: h.patientCount }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="Doctors" fill="#0284c7" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Patients" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Directory</h3>
                  <p className="text-xs text-slate-500">Manage tenant isolation, approvals, and administrator assignments.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard Hospital</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Hospital Name</th>
                      <th className="px-5 py-3.5">Code</th>
                      <th className="px-5 py-3.5">Admin Contact</th>
                      <th className="px-5 py-3.5">Doctors</th>
                      <th className="px-5 py-3.5">Patients</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hospitals.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 font-semibold text-slate-900">{h.name}</td>
                        <td className="px-5 py-4 font-mono text-sky-700">{h.code}</td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">{h.adminName}</p>
                          <p className="text-[11px] text-slate-400">{h.adminEmail || h.phone}</p>
                        </td>
                        <td className="px-5 py-4">{h.doctorCount}</td>
                        <td className="px-5 py-4">{h.patientCount}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              h.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {h.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(h.id, h.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              h.status === 'ACTIVE'
                                ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                                : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                            }`}
                          >
                            {h.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit-logs' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Platform Security & Audit Trail</h3>
                <p className="text-xs text-slate-500">Immutable logging of cross-tenant actions, logins, and permission checks.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Actor</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Action</th>
                      <th className="px-5 py-3.5">Resource</th>
                      <th className="px-5 py-3.5">Hospital</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-5 py-3 font-sans font-medium text-slate-800">{log.user?.fullName || 'System'}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {log.userRole || 'SYSTEM'}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-sky-700">{log.action}</td>
                        <td className="px-5 py-3 text-slate-600">{log.resource}</td>
                        <td className="px-5 py-3 text-slate-500 font-sans">{log.hospital?.name || 'Platform'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Onboard New Hospital Tenant</h3>
            <p className="text-xs text-slate-500 mb-4">Initialize a new isolated hospital database tenancy.</p>

            <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude Regional Center"
                  value={newHosp.name}
                  onChange={(e) => setNewHosp({ ...newHosp, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="SJR-01"
                    value={newHosp.code}
                    onChange={(e) => setNewHosp({ ...newHosp, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555 0199"
                    value={newHosp.phone}
                    onChange={(e) => setNewHosp({ ...newHosp, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="742 Evergreen Terrace"
                  value={newHosp.address}
                  onChange={(e) => setNewHosp({ ...newHosp, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-800 mb-2">Hospital Administrator Account</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Admin Full Name"
                    value={newHosp.adminFullName}
                    onChange={(e) => setNewHosp({ ...newHosp, adminFullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="admin@hospital.com"
                    value={newHosp.adminEmail}
                    onChange={(e) => setNewHosp({ ...newHosp, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Admin Password"
                    value={newHosp.adminPassword}
                    onChange={(e) => setNewHosp({ ...newHosp, adminPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-sm"
                >
                  Create Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
