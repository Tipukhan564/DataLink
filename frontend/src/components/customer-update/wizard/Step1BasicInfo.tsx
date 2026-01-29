import React from 'react';
import { User, Phone, Mail, Users } from 'lucide-react';

interface Step1Props {
  data: {
    complaintNumber: string;
    cnic: string;
    mobileNumber: string;
    email: string;
    nextOfKin: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const Step1BasicInfo: React.FC<Step1Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
        <p className="text-sm text-gray-500 mt-1">Enter the customer's basic identification details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Complaint Number</label>
          <input
            type="text"
            value={data.complaintNumber}
            onChange={(e) => onChange('complaintNumber', e.target.value)}
            className="input-field"
            placeholder="Optional - Enter if available"
          />
        </div>

        <div>
          <label className="label">
            CNIC <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.cnic}
              onChange={(e) => onChange('cnic', e.target.value)}
              className={`input-field ${errors.cnic ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="XXXXX-XXXXXXX-X"
              maxLength={15}
            />
          </div>
          {errors.cnic && <p className="text-xs text-red-500 mt-1">{errors.cnic}</p>}
          <p className="text-xs text-gray-400 mt-1">Format: 12345-1234567-1</p>
        </div>

        <div>
          <label className="label">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.mobileNumber}
              onChange={(e) => onChange('mobileNumber', e.target.value)}
              className={`input-field pl-10 ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="03XXXXXXXXX"
              maxLength={11}
            />
          </div>
          {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
        </div>

        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="customer@email.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label">Next of Kin</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.nextOfKin}
              onChange={(e) => onChange('nextOfKin', e.target.value)}
              className="input-field pl-10"
              placeholder="Enter next of kin name"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
