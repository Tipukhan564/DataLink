import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { requestsAPI } from '../../services/api';
import { DashboardStats, CustomerUpdateRequest, PageResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatNumber, formatPercentage } from '../../utils/formatters';
import {
  Clock, CheckCircle, XCircle, AlertTriangle, FileText,
  TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#FBBF24', '#3B82F6', '#EF4444', '#8B5CF6', '#22C55E', '#F97316'];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<CustomerUpdateRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        requestsAPI.getDashboardStats(),
        requestsAPI.getAll(0, 5),
      ]);
      setStats(statsRes.data);
      setRecentRequests((requestsRes.data as PageResponse<CustomerUpdateRequest>).content);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const statusData = stats?.requestsByStatus
    ? Object.entries(stats.requestsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const statCards = [
    {
      title: 'Total Requests',
      value: stats?.totalRequests || 0,
      icon: FileText,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Completed',
      value: stats?.completedRequests || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Failed',
      value: stats?.failedRequests || 0,
      icon: XCircle,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Today\'s Requests',
      value: stats?.todayRequests || 0,
      icon: Activity,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Success Rate',
      value: stats?.successRate ? `${Math.round(stats.successRate)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
  ];

  const statusColorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle={`Welcome back, ${user?.fullName}`} />

      <div className="p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="card">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.lightColor} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-gray-900">Request Status Distribution</h3>
            </div>
            <div className="card-body">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
                  No data available
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {statusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="card lg:col-span-2">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Recent Requests</h3>
              <a href="/customer-update" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                View All
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">CNIC</th>
                    <th className="table-header">Mobile</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Submitted By</th>
                    <th className="table-header">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="table-cell font-medium">#{req.id}</td>
                        <td className="table-cell font-mono text-xs">{req.cnic}</td>
                        <td className="table-cell">{req.mobileNumber}</td>
                        <td className="table-cell">
                          <span className={`badge ${statusColorMap[req.status || ''] || ''}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="table-cell">{req.submittedByName}</td>
                        <td className="table-cell text-xs text-gray-500">{formatDate(req.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                        No requests yet. Create your first customer update.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/customer-update"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <Users className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">New Update</span>
              </a>
              <a
                href="/bulk-upload"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Bulk Upload</span>
              </a>
              <a
                href="/approvals"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <CheckCircle className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Approvals</span>
              </a>
              <a
                href="/reports"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Reports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
