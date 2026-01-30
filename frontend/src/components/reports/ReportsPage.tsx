import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { reportsAPI } from '../../services/api';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  BarChart3, TrendingUp, Calendar, Download, RefreshCw,
  CheckCircle, XCircle, Clock, FileText,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#22C55E', '#EF4444', '#FBBF24', '#3B82F6', '#8B5CF6', '#F97316'];

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = reportType === 'daily'
        ? await reportsAPI.daily()
        : reportType === 'weekly'
        ? await reportsAPI.weekly()
        : await reportsAPI.monthly();
      setReport(res.data);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const statusData = report?.statusBreakdown
    ? Object.entries(report.statusBreakdown).map(([name, value]) => ({
        name,
        value: value as number,
      }))
    : [];

  const barData = statusData.map(item => ({
    name: item.name,
    count: item.value,
  }));

  return (
    <div>
      <Header title="Reports & Analytics" subtitle="Performance metrics and operational insights" />

      <div className="p-6 space-y-6">
        {/* Report Type Selector */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {(['daily', 'weekly', 'monthly'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  reportType === type
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={loadReport} className="btn-secondary gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : report ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(report.totalRequests)}</p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{report.successRate}%</p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{report.activeUsers}</p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{report.totalUsers}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-gray-900">Status Distribution</h3>
                </div>
                <div className="card-body">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {statusData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                      No data available for this period
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-gray-900">Requests by Status</h3>
                </div>
                <div className="card-body">
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {barData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                      No data available for this period
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Breakdown Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-gray-900">Detailed Status Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Status</th>
                      <th className="table-header">Count</th>
                      <th className="table-header">Percentage</th>
                      <th className="table-header">Visualization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {statusData.map((item, index) => {
                      const total = statusData.reduce((sum, i) => sum + i.value, 0);
                      const pct = total > 0 ? (item.value / total) * 100 : 0;
                      return (
                        <tr key={item.name} className="hover:bg-gray-50">
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="table-cell font-bold">{formatNumber(item.value)}</td>
                          <td className="table-cell text-gray-500">{pct.toFixed(1)}%</td>
                          <td className="table-cell">
                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: COLORS[index % COLORS.length],
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">Failed to load report data</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
