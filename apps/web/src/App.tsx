import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './portals/LoginPage';
import { SuperAdminPortal } from './portals/SuperAdminPortal';
import { HospitalAdminPortal } from './portals/HospitalAdminPortal';
import { DoctorPortal } from './portals/DoctorPortal';
import { ReceptionistPortal } from './portals/ReceptionistPortal';
import { PatientPortal } from './portals/PatientPortal';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/super-admin" replace />;
    case 'HOSPITAL_ADMIN':
      return <Navigate to="/hospital-admin" replace />;
    case 'DOCTOR':
      return <Navigate to="/doctor" replace />;
    case 'RECEPTIONIST':
      return <Navigate to="/receptionist" replace />;
    case 'PATIENT':
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hospital-admin"
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
                <HospitalAdminPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientPortal />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
