<<<<<<< HEAD
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Save, FileText, DollarSign, MapPin } from 'lucide-react';
import { requestsAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface CustomerUpdateForm {
  complaintNumber: string;
  mobileNumber: string;
  cnic: string;
  nextOfKin: string;
  email: string;
  fatherName: string;
  motherName: string;
  sourceOfIncome: string;
  purposeOfAccount: string;
  latitude: string;
  longitude: string;
  ccRemarks: string;
}

const CustomerUpdatePage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerUpdateForm>({
    defaultValues: {
      complaintNumber: '',
      mobileNumber: '',
      cnic: '',
      nextOfKin: '',
      email: '',
      fatherName: '',
      motherName: '',
      sourceOfIncome: '',
      purposeOfAccount: '',
      latitude: '31.4592209', // Default Lahore coordinates
      longitude: '74.2762544',
      ccRemarks: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Source of Income options (from your Excel data)
  const incomeSourceOptions = [
    'Salary',
    'Business',
    'Freelancer',
    'Labour',
    'Government Teacher',
    'Fajar Collection',
    'Other',
  ];

  // Purpose of Account options (from your Excel data)
  const purposeOptions = [
    'Personal',
    'Business',
    'Saving',
    'Hajj',
    'Normal Use',
    'Online Transaction',
    'Freelancing',
    'Other',
  ];

  const onSubmit = async (data: CustomerUpdateForm) => {
    try {
      setLoading(true);
      
      // Send as JSON (not FormData since we removed file uploads)
      await requestsAPI.create(data);
      
      toast.success('Customer update request submitted successfully!');
      reset(); // Reset form to default values
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
=======
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
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Customer Update Request</h1>
        <p className="text-gray-600">Update customer information in the banking system</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Section 1: Complaint Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Complaint Information
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="label">Complaint Number (Optional)</label>
              <input
                type="text"
                {...register('complaintNumber')}
                className="input-field"
                placeholder="e.g., 180126-C960791"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div>
              <label className="label">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('mobileNumber', { 
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^(03\d{9}|\+923\d{9})$/,
                      message: 'Invalid mobile format (e.g., 03001234567)'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="e.g., 03001234567"
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* CNIC */}
            <div>
              <label className="label">
                CNIC Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('cnic', { 
                    required: 'CNIC is required',
                    pattern: {
                      value: /^\d{5}-?\d{7}-?\d{1}$/,
                      message: 'Invalid CNIC format (e.g., 42201-1234567-1)'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="e.g., 42201-1234567-1"
                />
              </div>
              {errors.cnic && (
                <p className="text-red-500 text-xs mt-1">{errors.cnic.message}</p>
              )}
            </div>

            {/* Father's Name */}
            <div>
              <label className="label">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('fatherName', { required: "Father's name is required" })}
                className="input-field"
                placeholder="Enter Father's Name"
              />
              {errors.fatherName && (
                <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>
              )}
            </div>

            {/* Mother's Name */}
            <div>
              <label className="label">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('motherName', { required: "Mother's name is required" })}
                className="input-field"
                placeholder="Enter Mother's Name"
              />
              {errors.motherName && (
                <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>
              )}
            </div>

            {/* Next of Kin */}
            <div>
              <label className="label">
                Next of Kin Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('nextOfKin', { required: 'Next of kin is required' })}
                className="input-field"
                placeholder="Enter Next of Kin Name"
              />
              {errors.nextOfKin && (
                <p className="text-red-500 text-xs mt-1">{errors.nextOfKin.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="customer@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Account Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source of Income */}
            <div>
              <label className="label">
                Source of Income <span className="text-red-500">*</span>
              </label>
              <select
                {...register('sourceOfIncome', { required: 'Source of income is required' })}
                className="input-field"
              >
                <option value="">Select Source of Income</option>
                {incomeSourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.sourceOfIncome && (
                <p className="text-red-500 text-xs mt-1">{errors.sourceOfIncome.message}</p>
              )}
            </div>

            {/* Purpose of Account */}
            <div>
              <label className="label">
                Purpose of Account <span className="text-red-500">*</span>
              </label>
              <select
                {...register('purposeOfAccount', { required: 'Purpose of account is required' })}
                className="input-field"
              >
                <option value="">Select Purpose</option>
                {purposeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.purposeOfAccount && (
                <p className="text-red-500 text-xs mt-1">{errors.purposeOfAccount.message}</p>
              )}
            </div>

            {/* Latitude */}
            <div>
              <label className="label">Latitude</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('latitude')}
                  className="input-field pl-10"
                  placeholder="31.4592209"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Default: Lahore coordinates</p>
            </div>

            {/* Longitude */}
            <div>
              <label className="label">Longitude</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('longitude')}
                  className="input-field pl-10"
                  placeholder="74.2762544"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Default: Lahore coordinates</p>
            </div>
          </div>
        </div>

        {/* Section 4: Additional Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Additional Information
          </h2>
          <div>
            <label className="label">Call Center Remarks (Optional)</label>
            <textarea
              {...register('ccRemarks')}
              rows={4}
              className="input-field resize-none"
              placeholder="Enter any additional remarks, notes, or special instructions..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this field to add any relevant information about the request
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
=======
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
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
    </div>
  );
};

<<<<<<< HEAD
export default CustomerUpdatePage;
=======
export default CustomerUpdatePage;
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
