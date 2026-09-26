import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketingPage } from './marketing/MarketingPage';
import { LoginPage } from './portals/LoginPage';
import { SuperAdminPortal } from './portals/SuperAdminPortal';
import { HospitalAdminPortal } from './portals/HospitalAdminPortal';
import { DoctorPortal } from './portals/DoctorPortal';
import { ReceptionistPortal } from './portals/ReceptionistPortal';
import { PatientPortal } from './portals/PatientPortal';

// Capacitor Android Hardware Back Button Hook
const AndroidBackHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let appPlugin: any = null;
    const setupBackButton = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        appPlugin = CapApp;
        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            CapApp.exitApp();
          }
        });
      } catch (e) {
        // Not in Capacitor environment, standard browser history applies
      }
    };
    setupBackButton();

    return () => {
      if (appPlugin) {
        appPlugin.removeAllListeners();
      }
    };
  }, [navigate]);

  return null;
};

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
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

const AppRoleRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/app/super-admin" replace />;
    case 'HOSPITAL_ADMIN':
      return <Navigate to="/app/hospital-admin" replace />;
    case 'DOCTOR':
      return <Navigate to="/app/doctor" replace />;
    case 'RECEPTIONIST':
      return <Navigate to="/app/receptionist" replace />;
    case 'PATIENT':
      return <Navigate to="/app/patient" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AndroidBackHandler />
        <Routes>
          {/* Public Marketing Website */}
          <Route path="/" element={<MarketingPage />} />
          <Route path="/features" element={<MarketingPage />} />
          <Route path="/how-it-works" element={<MarketingPage />} />
          <Route path="/for-hospitals" element={<MarketingPage />} />
          <Route path="/for-doctors" element={<MarketingPage />} />
          <Route path="/for-patients" element={<MarketingPage />} />
          <Route path="/about" element={<MarketingPage />} />
          <Route path="/contact" element={<MarketingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* Authenticated Application Entry */}
          <Route path="/app" element={<AppRoleRedirect />} />

          {/* /app/* Role Portals */}
          <Route
            path="/app/super-admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/hospital-admin"
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
                <HospitalAdminPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/doctor"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/receptionist"
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/patient"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientPortal />
              </ProtectedRoute>
            }
          />

          {/* Legacy Direct Routes (preserves backwards-compatibility) */}
          <Route path="/super-admin" element={<Navigate to="/app/super-admin" replace />} />
          <Route path="/hospital-admin" element={<Navigate to="/app/hospital-admin" replace />} />
          <Route path="/doctor" element={<Navigate to="/app/doctor" replace />} />
          <Route path="/receptionist" element={<Navigate to="/app/receptionist" replace />} />
          <Route path="/patient" element={<Navigate to="/app/patient" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
