import React, { useState } from 'react';
import Header from '../layout/Header';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, Building, Shield, Calendar, Clock,
  Edit, Camera, Key, Save, X, CheckCircle, AlertCircle,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const roleLabels: Record<string, string> = {
    ADMIN: 'System Administrator',
    SUPERVISOR: 'Supervisor',
    AGENT: 'Call Center Agent',
    ENGINEER: 'Engineer',
    AUDITOR: 'Auditor',
  };

  const roleBadgeColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700 border-red-200',
    SUPERVISOR: 'bg-blue-100 text-blue-700 border-blue-200',
    AGENT: 'bg-green-100 text-green-700 border-green-200',
    ENGINEER: 'bg-purple-100 text-purple-700 border-purple-200',
    AUDITOR: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Profile updated successfully');
    setSaving(false);
    setEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Password changed successfully');
    setSaving(false);
    setChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const stats = [
    { label: 'Requests Submitted', value: '247', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Pending Approvals', value: '12', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'This Month', value: '45', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <div>
      <Header title="My Profile" subtitle="View and manage your account information" />

      <div className="p-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="relative h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-xl" />
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600">
                      {user?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-sm text-gray-500">@{user?.username}</p>

                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border ${roleBadgeColors[user?.role || ''] || 'bg-gray-100 text-gray-700'}`}>
                    <Shield className="w-3.5 h-3.5" />
                    {roleLabels[user?.role || ''] || user?.role}
                  </span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.department || 'Not assigned'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined {formatDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card mt-6 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-500">Update your personal details</p>
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-secondary gap-2">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="btn-secondary gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button onClick={handleSaveProfile} disabled={saving} className="btn-primary gap-2">
                      <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      disabled={!editing}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!editing}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!editing}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      disabled={!editing}
                      className="input-field"
                      placeholder="Enter department"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-500">Manage your password and security settings</p>
                </div>
                {!changingPassword && (
                  <button onClick={() => setChangingPassword(true)} className="btn-secondary gap-2">
                    <Key className="w-4 h-4" /> Change Password
                  </button>
                )}
              </div>
              {changingPassword && (
                <div className="card-body border-t border-gray-100">
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="label">Current Password</label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="input-field"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="label">New Password</label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="input-field"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="label">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="input-field"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setChangingPassword(false)} className="btn-secondary">
                        Cancel
                      </button>
                      <button onClick={handleChangePassword} disabled={saving} className="btn-primary">
                        {saving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">{roleLabels[user?.role || '']}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Account Status</p>
                    <p className="font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Active
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Login</p>
                    <p className="font-medium text-gray-900">{formatDate(user?.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
