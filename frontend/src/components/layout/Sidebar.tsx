import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  Upload,
  CheckSquare,
  FileText,
  BarChart3,
  Users,
  Shield,
  LogOut,
  Database,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER', 'AUDITOR'] as const,
    },
    {
      to: '/customer-update',
      icon: UserPlus,
      label: 'Customer Update',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER'] as const,
    },
    {
      to: '/bulk-upload',
      icon: Upload,
      label: 'Bulk Upload',
      roles: ['ADMIN', 'ENGINEER'] as const,
    },
    {
      to: '/approvals',
      icon: CheckSquare,
      label: 'Approvals',
      roles: ['ADMIN', 'SUPERVISOR', 'ENGINEER'] as const,
    },
    {
      to: '/audit-trail',
      icon: FileText,
      label: 'Audit Trail',
      roles: ['ADMIN', 'AUDITOR'] as const,
    },
    {
      to: '/reports',
      icon: BarChart3,
      label: 'Reports',
      roles: ['ADMIN', 'SUPERVISOR', 'ENGINEER', 'AUDITOR'] as const,
    },
    {
      to: '/user-management',
      icon: Users,
      label: 'User Management',
      roles: ['ADMIN'] as const,
    },
  ];

  const roleLabels: Record<string, string> = {
    ADMIN: 'System Administrator',
    SUPERVISOR: 'Supervisor',
    AGENT: 'Call Center Agent',
    ENGINEER: 'Engineer',
    AUDITOR: 'Auditor',
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200">
        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900">CDUP</h1>
          <p className="text-[10px] text-gray-500 -mt-0.5">Customer Data Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => hasRole([...item.roles]))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{roleLabels[user?.role || ''] || user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
