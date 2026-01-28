import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { requestsAPI } from '../../services/api';
import {
  CustomerUpdateRequest, PageResponse, RequestStatus,
  SOURCE_OF_INCOME_OPTIONS, PURPOSE_OF_ACCOUNT_OPTIONS, STATUS_COLORS,
} from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight,
  User, Phone, Mail, MapPin, FileText, CheckCircle, X,
} from 'lucide-react';

const CustomerUpdatePage: React.FC = () => {
  const [requests, setRequests] = useState<CustomerUpdateRequest[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchCnic, setSearchCnic] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [form, setForm] = useState({
    complaintNumber: '',
    cnic: '',
    mobileNumber: '',
    nextOfKin: '',
    email: '',
    fatherName: '',
    motherName: '',
    sourceOfIncome: '',
    purposeOfAccount: '',
    latitude: '',
    longitude: '',
    ccRemarks: '',
    selfieCnicVerified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadRequests();
  }, [currentPage, filterStatus]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      let res;
      if (searchCnic || filterStatus) {
        res = await requestsAPI.search({
          cnic: searchCnic || undefined,
          status: filterStatus || undefined,
          page: currentPage,
          size: 15,
        });
      } else {
        res = await requestsAPI.getAll(currentPage, 15);
      }
      const data = res.data as PageResponse<CustomerUpdateRequest>;
      setRequests(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!form.cnic) newErrors.cnic = 'CNIC is required';
      else if (!/^\d{5}-\d{7}-\d{1}$/.test(form.cnic)) newErrors.cnic = 'Format: XXXXX-XXXXXXX-X';
      if (!form.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
      else if (!/^03\d{9}$/.test(form.mobileNumber)) newErrors.mobileNumber = 'Format: 03XXXXXXXXX';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) { setStep(1); return; }
    setSubmitting(true);
    try {
      await requestsAPI.create(form);
      toast.success('Customer update request submitted successfully');
      setShowForm(false);
      setStep(1);
      setForm({
        complaintNumber: '', cnic: '', mobileNumber: '', nextOfKin: '', email: '',
        fatherName: '', motherName: '', sourceOfIncome: '', purposeOfAccount: '',
        latitude: '', longitude: '', ccRemarks: '', selfieCnicVerified: false,
      });
      loadRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const statusColorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <Header title="Customer Updates" subtitle="Manage customer data update requests" />

      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by CNIC..."
                value={searchCnic}
                onChange={(e) => setSearchCnic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadRequests()}
                className="input-field pl-10 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0); }}
              className="input-field w-40"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <button onClick={() => setShowForm(true)} className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> New Update Request
          </button>
        </div>

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">New Customer Update Request</h3>
                  <p className="text-sm text-gray-500">Step {step} of 3</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pt-4">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Customer Info</span>
                  <span>Personal Details</span>
                  <span>Additional Info</span>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Customer Info */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Complaint Number</label>
                      <input
                        type="text"
                        value={form.complaintNumber}
                        onChange={(e) => updateField('complaintNumber', e.target.value)}
                        className="input-field"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="label">CNIC *</label>
                      <input
                        type="text"
                        value={form.cnic}
                        onChange={(e) => updateField('cnic', e.target.value)}
                        className={`input-field ${errors.cnic ? 'input-error' : ''}`}
                        placeholder="XXXXX-XXXXXXX-X"
                      />
                      {errors.cnic && <p className="text-xs text-red-500 mt-1">{errors.cnic}</p>}
                    </div>
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input
                        type="text"
                        value={form.mobileNumber}
                        onChange={(e) => updateField('mobileNumber', e.target.value)}
                        className={`input-field ${errors.mobileNumber ? 'input-error' : ''}`}
                        placeholder="03XXXXXXXXX"
                      />
                      {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                        placeholder="customer@email.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Next of Kin</label>
                      <input
                        type="text"
                        value={form.nextOfKin}
                        onChange={(e) => updateField('nextOfKin', e.target.value)}
                        className="input-field"
                        placeholder="Next of kin name"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Father's Name</label>
                      <input
                        type="text"
                        value={form.fatherName}
                        onChange={(e) => updateField('fatherName', e.target.value)}
                        className="input-field"
                        placeholder="Father's full name"
                      />
                    </div>
                    <div>
                      <label className="label">Mother's Name</label>
                      <input
                        type="text"
                        value={form.motherName}
                        onChange={(e) => updateField('motherName', e.target.value)}
                        className="input-field"
                        placeholder="Mother's full name"
                      />
                    </div>
                    <div>
                      <label className="label">Source of Income</label>
                      <select
                        value={form.sourceOfIncome}
                        onChange={(e) => updateField('sourceOfIncome', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select source of income</option>
                        {SOURCE_OF_INCOME_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Purpose of Account</label>
                      <select
                        value={form.purposeOfAccount}
                        onChange={(e) => updateField('purposeOfAccount', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select purpose of account</option>
                        {PURPOSE_OF_ACCOUNT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Info */}
                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Latitude</label>
                      <input
                        type="text"
                        value={form.latitude}
                        onChange={(e) => updateField('latitude', e.target.value)}
                        className="input-field"
                        placeholder="e.g., 33.6844"
                      />
                    </div>
                    <div>
                      <label className="label">Longitude</label>
                      <input
                        type="text"
                        value={form.longitude}
                        onChange={(e) => updateField('longitude', e.target.value)}
                        className="input-field"
                        placeholder="e.g., 73.0479"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Call Center Remarks</label>
                      <textarea
                        value={form.ccRemarks}
                        onChange={(e) => updateField('ccRemarks', e.target.value)}
                        className="input-field min-h-[80px]"
                        placeholder="Enter remarks..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.selfieCnicVerified}
                          onChange={(e) => updateField('selfieCnicVerified', e.target.checked)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Selfie/CNIC Verification Completed
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : setShowForm(false)}
                  className="btn-secondary"
                >
                  {step > 1 ? 'Previous' : 'Cancel'}
                </button>
                {step < 3 ? (
                  <button onClick={handleNext} className="btn-primary">
                    Next Step
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting} className="btn-primary gap-2">
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Submit Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Update Requests ({totalElements})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">CNIC</th>
                  <th className="table-header">Mobile</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Submitted By</th>
                  <th className="table-header">Date</th>
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
                      <td className="table-cell">
                        <span className={`badge ${statusColorMap[req.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="table-cell">{req.submittedByName}</td>
                      <td className="table-cell text-xs text-gray-500">{formatDate(req.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {currentPage + 1} of {totalPages} ({totalElements} total)
              </p>
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

export default CustomerUpdatePage;
