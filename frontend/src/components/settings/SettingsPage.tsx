import React, { useState } from 'react';
import Header from '../layout/Header';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Settings, Bell, Shield, Database, Mail, Globe,
  Moon, Sun, Save, RefreshCw, Zap, Lock,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: 'en',
    timezone: 'Asia/Karachi',
    dateFormat: 'DD/MM/YYYY',
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnApproval: true,
    notifyOnRejection: true,
    notifyOnCompletion: true,
    dailyDigest: false,
    // Security
    sessionTimeout: '30',
    twoFactorAuth: false,
    loginAlerts: true,
    // System
    autoRefresh: true,
    refreshInterval: '30',
    darkMode: false,
    compactView: false,
    // Database
    connectionPool: '10',
    queryTimeout: '30',
    enableCaching: true,
  });

  const sections: SettingSection[] = [
    { id: 'general', title: 'General', description: 'Basic application settings', icon: Settings },
    { id: 'notifications', title: 'Notifications', description: 'Email, SMS and push notifications', icon: Bell },
    { id: 'security', title: 'Security', description: 'Authentication and access control', icon: Shield },
    { id: 'system', title: 'System', description: 'Performance and display options', icon: Zap },
    { id: 'database', title: 'Database', description: 'Database connection settings', icon: Database },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderToggle = (key: string, label: string, description?: string) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          settings[key as keyof typeof settings] ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            settings[key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const renderSelect = (key: string, label: string, options: { value: string; label: string }[]) => (
    <div className="py-3">
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <select
        value={settings[key as keyof typeof settings] as string}
        onChange={(e) => updateSetting(key, e.target.value)}
        className="input-field"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <Header title="System Settings" subtitle="Configure application preferences and system options" />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="card p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">{section.title}</p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sections.find((s) => s.id === activeSection)?.title} Settings
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {sections.find((s) => s.id === activeSection)?.description}
                  </p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="card-body divide-y divide-gray-100">
                {activeSection === 'general' && (
                  <>
                    {renderSelect('language', 'Language', [
                      { value: 'en', label: 'English' },
                      { value: 'ur', label: 'Urdu' },
                    ])}
                    {renderSelect('timezone', 'Timezone', [
                      { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT)' },
                      { value: 'UTC', label: 'UTC' },
                    ])}
                    {renderSelect('dateFormat', 'Date Format', [
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ])}
                  </>
                )}

                {activeSection === 'notifications' && (
                  <>
                    {renderToggle('emailNotifications', 'Email Notifications', 'Receive notifications via email')}
                    {renderToggle('smsNotifications', 'SMS Notifications', 'Receive notifications via SMS')}
                    {renderToggle('pushNotifications', 'Push Notifications', 'Browser push notifications')}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Events</p>
                      {renderToggle('notifyOnApproval', 'Approval Notifications', 'When requests are approved')}
                      {renderToggle('notifyOnRejection', 'Rejection Notifications', 'When requests are rejected')}
                      {renderToggle('notifyOnCompletion', 'Completion Notifications', 'When processing completes')}
                      {renderToggle('dailyDigest', 'Daily Digest', 'Receive a daily summary email')}
                    </div>
                  </>
                )}

                {activeSection === 'security' && (
                  <>
                    {renderSelect('sessionTimeout', 'Session Timeout (minutes)', [
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' },
                    ])}
                    {renderToggle('twoFactorAuth', 'Two-Factor Authentication', 'Require 2FA for login')}
                    {renderToggle('loginAlerts', 'Login Alerts', 'Email alerts for new logins')}
                  </>
                )}

                {activeSection === 'system' && (
                  <>
                    {renderToggle('autoRefresh', 'Auto Refresh', 'Automatically refresh data')}
                    {settings.autoRefresh && renderSelect('refreshInterval', 'Refresh Interval', [
                      { value: '15', label: 'Every 15 seconds' },
                      { value: '30', label: 'Every 30 seconds' },
                      { value: '60', label: 'Every minute' },
                    ])}
                    {renderToggle('darkMode', 'Dark Mode', 'Enable dark theme')}
                    {renderToggle('compactView', 'Compact View', 'Reduce spacing and padding')}
                  </>
                )}

                {activeSection === 'database' && (
                  <>
                    {renderSelect('connectionPool', 'Connection Pool Size', [
                      { value: '5', label: '5 connections' },
                      { value: '10', label: '10 connections' },
                      { value: '20', label: '20 connections' },
                    ])}
                    {renderSelect('queryTimeout', 'Query Timeout (seconds)', [
                      { value: '15', label: '15 seconds' },
                      { value: '30', label: '30 seconds' },
                      { value: '60', label: '60 seconds' },
                    ])}
                    {renderToggle('enableCaching', 'Enable Query Caching', 'Cache frequent queries')}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Database Status</p>
                          <p className="text-xs text-gray-500">Oracle DB Connection</p>
                        </div>
                        <span className="flex items-center gap-2 text-sm text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Connected
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
