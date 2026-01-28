import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { auditAPI } from '../../services/api';
import { AuditLog, PageResponse } from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Shield, FileText, User, Clock, Activity,
} from 'lucide-react';

const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchUsername, setSearchUsername] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  useEffect(() => {
    loadLogs();
  }, [currentPage]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let res;
      if (searchUsername || filterAction || filterEntity) {
        res = await auditAPI.search({
          username: searchUsername || undefined,
          action: filterAction || undefined,
          entityType: filterEntity || undefined,
          page: currentPage,
          size: 30,
        });
      } else {
        res = await auditAPI.getAll(currentPage, 30);
      }
      const data = res.data as PageResponse<AuditLog>;
      setLogs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('LOGIN')) return 'bg-green-100 text-green-800';
    if (action.includes('APPROVE')) return 'bg-blue-100 text-blue-800';
    if (action.includes('REJECT') || action.includes('FAILED')) return 'bg-red-100 text-red-800';
    if (action.includes('UPDATE') || action.includes('PROCESS')) return 'bg-purple-100 text-purple-800';
    if (action.includes('BULK')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <User className="w-4 h-4" />;
    if (action.includes('CREATE')) return <FileText className="w-4 h-4" />;
    if (action.includes('APPROVE') || action.includes('REJECT')) return <Shield className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  return (
    <div>
      <Header title="Audit Trail" subtitle="Complete log of all system activities" />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
                className="input-field pl-10"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(0); }}
              className="input-field w-48"
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="CREATE_REQUEST">Create Request</option>
              <option value="APPROVE_REQUEST">Approve Request</option>
              <option value="REJECT_REQUEST">Reject Request</option>
              <option value="PROCESS_REQUEST">Process Request</option>
              <option value="BULK_UPLOAD">Bulk Upload</option>
              <option value="CREATE_USER">Create User</option>
            </select>
            <select
              value={filterEntity}
              onChange={(e) => { setFilterEntity(e.target.value); setCurrentPage(0); }}
              className="input-field w-48"
            >
              <option value="">All Entities</option>
              <option value="CustomerUpdateRequest">Customer Requests</option>
              <option value="User">Users</option>
              <option value="BulkUpload">Bulk Uploads</option>
            </select>
            <button onClick={loadLogs} className="btn-primary gap-2">
              <Filter className="w-4 h-4" /> Apply
            </button>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Audit Logs ({totalElements} entries)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Timestamp</th>
                  <th className="table-header">Action</th>
                  <th className="table-header">Entity</th>
                  <th className="table-header">User</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
                    </td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="table-cell text-xs">
                        {log.entityType}
                        {log.entityId && <span className="text-gray-400 ml-1">#{log.entityId}</span>}
                      </td>
                      <td className="table-cell font-medium">{log.username}</td>
                      <td className="table-cell">
                        <span className="badge bg-gray-100 text-gray-700">{log.userRole}</span>
                      </td>
                      <td className="table-cell text-xs text-gray-600 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="table-cell text-xs font-mono text-gray-400">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Page {currentPage + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="btn-secondary py-1.5 px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="btn-secondary py-1.5 px-3"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPage;
