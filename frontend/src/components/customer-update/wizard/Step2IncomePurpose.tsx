import React from 'react';
import { Briefcase, Target, User } from 'lucide-react';
import { SOURCE_OF_INCOME_OPTIONS, PURPOSE_OF_ACCOUNT_OPTIONS } from '../../../types';

interface Step2Props {
  data: {
    fatherName: string;
    motherName: string;
    sourceOfIncome: string;
    purposeOfAccount: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const Step2IncomePurpose: React.FC<Step2Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
        <p className="text-sm text-gray-500 mt-1">Provide family information and account details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Father's Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.fatherName}
              onChange={(e) => onChange('fatherName', e.target.value)}
              className="input-field pl-10"
              placeholder="Enter father's full name"
            />
          </div>
        </div>

        <div>
          <label className="label">Mother's Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.motherName}
              onChange={(e) => onChange('motherName', e.target.value)}
              className="input-field pl-10"
              placeholder="Enter mother's full name"
            />
          </div>
        </div>

        <div>
          <label className="label">Source of Income</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={data.sourceOfIncome}
              onChange={(e) => onChange('sourceOfIncome', e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">Select source of income</option>
              {SOURCE_OF_INCOME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Purpose of Account</label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={data.purposeOfAccount}
              onChange={(e) => onChange('purposeOfAccount', e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">Select purpose of account</option>
              {PURPOSE_OF_ACCOUNT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Account Information</p>
            <p className="text-xs text-blue-700 mt-1">
              These details are used for KYC compliance and regulatory requirements.
              Please ensure accuracy of the information provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2IncomePurpose;
