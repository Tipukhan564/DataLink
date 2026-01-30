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
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
};

export default CustomerUpdatePage;