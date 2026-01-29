import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import CustomerUpdatePage from './components/customer-update/CustomerUpdatePage';
import BulkUploadPage from './components/bulk-upload/BulkUploadPage';
import ApprovalsPage from './components/approvals/ApprovalsPage';
import AuditTrailPage from './components/audit/AuditTrailPage';
import ReportsPage from './components/reports/ReportsPage';
import UserManagementPage from './components/admin/UserManagementPage';
import SettingsPage from './components/settings/SettingsPage';
import ProfilePage from './components/profile/ProfilePage';
import NotificationsPage from './components/notifications/NotificationsPage';
import HelpPage from './components/help/HelpPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes with Layout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="customer-update" element={<CustomerUpdatePage />} />
              <Route path="bulk-upload" element={<BulkUploadPage />} />
              <Route path="approvals" element={<ApprovalsPage />} />
              <Route path="audit-trail" element={<AuditTrailPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
