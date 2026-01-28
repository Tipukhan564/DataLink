import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { approvalsAPI, requestsAPI } from '../../services/api';
import { CustomerUpdateRequest, PageResponse } from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  CheckCircle, XCircle, Eye, Clock, MessageSquare,
  ChevronLeft, ChevronRight, X, AlertCircle,
} from 'lucide-react';

const ApprovalsPage: React.FC = () => {
  const [requests, setRequests] = useState<CustomerUpdateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<CustomerUpdateRequest | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPending();
  }, [currentPage]);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await approvalsAPI.getPending(currentPage, 15);
      const data = res.data as PageResponse<CustomerUpdateRequest>;
      setRequests(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest?.id) return;
    setProcessing(true);
    try {
      await approvalsAPI.action({
        requestId: selectedRequest.id,
        action: actionType,
        comments: comments,
      });
      toast.success(`Request ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      setShowActionModal(false);
      setSelectedRequest(null);
      setComments('');
      loadPending();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${actionType.toLowerCase()} request`);
    } finally {
      setProcessing(false);
    }
  };

  const openAction = (request: CustomerUpdateRequest, action: 'APPROVE' | 'REJECT') => {
    setSelectedRequest(request);
    setActionType(action);
    setComments('');
    setShowActionModal(true);
  };

  return (
    <div>
      <Header title="Approvals" subtitle="Review and approve pending customer update requests" />

      <div className="p-6 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
              <p className="text-xs text-gray-500">Pending Approvals</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500">Approved Today</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500">Rejected Today</p>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Pending Requests Queue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">CNIC</th>
                  <th className="table-header">Mobile</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Submitted By</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell font-medium">#{req.id}</td>
                      <td className="table-cell font-mono text-xs">{req.cnic}</td>
                      <td className="table-cell">{req.mobileNumber}</td>
                      <td className="table-cell text-xs">{req.email || '-'}</td>
                      <td className="table-cell">{req.submittedByName}</td>
                      <td className="table-cell text-xs text-gray-500">{formatDate(req.createdAt)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAction(req, 'APPROVE')}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAction(req, 'REJECT')}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">All caught up! No pending approvals.</p>
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

        {/* Action Modal */}
        {showActionModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {actionType === 'APPROVE' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {actionType === 'APPROVE' ? 'Approve' : 'Reject'} Request #{selectedRequest.id}
                  </h3>
                </div>
                <button onClick={() => setShowActionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">CNIC</span>
                    <span className="font-mono font-medium">{selectedRequest.cnic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-medium">{selectedRequest.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted By</span>
                    <span className="font-medium">{selectedRequest.submittedByName}</span>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Comments {actionType === 'REJECT' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="input-field min-h-[100px]"
                    placeholder={`Add your comments for ${actionType === 'APPROVE' ? 'approval' : 'rejection'}...`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setShowActionModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing || (actionType === 'REJECT' && !comments.trim())}
                  className={actionType === 'APPROVE' ? 'btn-success gap-2' : 'btn-danger gap-2'}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === 'APPROVE' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {actionType === 'APPROVE' ? 'Approve' : 'Reject'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Panel */}
        {selectedRequest && !showActionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">Request Details #{selectedRequest.id}</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Complaint #', selectedRequest.complaintNumber],
                    ['CNIC', selectedRequest.cnic],
                    ['Mobile', selectedRequest.mobileNumber],
                    ['Email', selectedRequest.email],
                    ['Next of Kin', selectedRequest.nextOfKin],
                    ['Father\'s Name', selectedRequest.fatherName],
                    ['Mother\'s Name', selectedRequest.motherName],
                    ['Source of Income', selectedRequest.sourceOfIncome],
                    ['Purpose of Account', selectedRequest.purposeOfAccount],
                    ['Latitude', selectedRequest.latitude],
                    ['Longitude', selectedRequest.longitude],
                    ['Selfie Verified', selectedRequest.selfieCnicVerified ? 'Yes' : 'No'],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <p className="text-gray-500 text-xs mb-1">{label}</p>
                      <p className="font-medium text-gray-900">{value || '-'}</p>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs mb-1">CC Remarks</p>
                    <p className="font-medium text-gray-900">{selectedRequest.ccRemarks || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button onClick={() => openAction(selectedRequest, 'APPROVE')} className="btn-success gap-2 flex-1">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => openAction(selectedRequest, 'REJECT')} className="btn-danger gap-2 flex-1">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
