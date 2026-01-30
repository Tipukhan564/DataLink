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
  Settings,
  Bell,
  User,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  roles: readonly string[];
  badge?: number;
}

const Sidebar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNavItems: NavItem[] = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER', 'AUDITOR'],
    },
    {
      to: '/customer-update',
      icon: UserPlus,
      label: 'Customer Update',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER'],
    },
    {
      to: '/bulk-upload',
      icon: Upload,
      label: 'Bulk Upload',
      roles: ['ADMIN', 'ENGINEER'],
    },
    {
      to: '/approvals',
      icon: CheckSquare,
      label: 'Approvals',
      roles: ['ADMIN', 'SUPERVISOR', 'ENGINEER'],
      badge: 3,
    },
    {
      to: '/audit-trail',
      icon: FileText,
      label: 'Audit Trail',
      roles: ['ADMIN', 'AUDITOR'],
    },
    {
      to: '/reports',
      icon: BarChart3,
      label: 'Reports & Analytics',
      roles: ['ADMIN', 'SUPERVISOR', 'ENGINEER', 'AUDITOR'],
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      to: '/user-management',
      icon: Users,
      label: 'User Management',
      roles: ['ADMIN'],
    },
    {
      to: '/settings',
      icon: Settings,
      label: 'System Settings',
      roles: ['ADMIN', 'ENGINEER'],
    },
  ];

  const userNavItems: NavItem[] = [
    {
      to: '/notifications',
      icon: Bell,
      label: 'Notifications',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER', 'AUDITOR'],
      badge: 5,
    },
    {
      to: '/profile',
      icon: User,
      label: 'My Profile',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER', 'AUDITOR'],
    },
    {
      to: '/help',
      icon: HelpCircle,
      label: 'Help & Support',
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'ENGINEER', 'AUDITOR'],
    },
  ];

  const roleLabels: Record<string, string> = {
    ADMIN: 'System Administrator',
    SUPERVISOR: 'Supervisor',
    AGENT: 'Call Center Agent',
    ENGINEER: 'Engineer',
    AUDITOR: 'Auditor',
  };

  const roleBadgeColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    SUPERVISOR: 'bg-blue-100 text-blue-700',
    AGENT: 'bg-green-100 text-green-700',
    ENGINEER: 'bg-purple-100 text-purple-700',
    AUDITOR: 'bg-orange-100 text-orange-700',
  };

  const renderNavItem = (item: NavItem) => {
    if (!hasRole([...item.roles] as any)) return null;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `sidebar-link group ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
        }
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
            {item.badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
      </NavLink>
    );
  };

  const renderNavSection = (items: NavItem[], title?: string) => {
    const visibleItems = items.filter((item) => hasRole([...item.roles] as any));
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {title && (
          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
        )}
        {visibleItems.map(renderNavItem)}
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200">
        <img
          src="/zindag.png"
          alt="Zindagi Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">CDUP</h1>
          <p className="text-[10px] text-gray-500 -mt-0.5">Customer Data Update Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        {renderNavSection(mainNavItems, 'Main Menu')}
        {renderNavSection(adminNavItems, 'Administration')}
        {renderNavSection(userNavItems, 'Account')}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
            <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded-full ${roleBadgeColors[user?.role || ''] || 'bg-gray-100 text-gray-700'}`}>
              {roleLabels[user?.role || ''] || user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-white hover:bg-red-500 bg-gray-100 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
