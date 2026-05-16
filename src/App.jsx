import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ScanDetails from './pages/ScanDetails';
import VulnerabilityReport from './pages/VulnerabilityReport';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScanProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15,23,42,0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(0,255,157,0.2)',
                borderRadius: '0.75rem',
                backdropFilter: 'blur(12px)',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: { primary: '#00ff9d', secondary: '#020617' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#020617' },
              },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Dashboard */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/scans/:id" element={<ScanDetails />} />
                <Route path="/scans/:id/report" element={<VulnerabilityReport />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScanProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
