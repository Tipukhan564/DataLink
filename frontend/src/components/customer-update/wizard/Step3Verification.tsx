import React from 'react';
import { MapPin, MessageSquare, Shield, CheckCircle } from 'lucide-react';

interface Step3Props {
  data: {
    latitude: string;
    longitude: string;
    ccRemarks: string;
    selfieCnicVerified: boolean;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

const Step3Verification: React.FC<Step3Props> = ({ data, errors, onChange }) => {
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange('latitude', position.coords.latitude.toFixed(6));
          onChange('longitude', position.coords.longitude.toFixed(6));
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Verification & Location</h3>
        <p className="text-sm text-gray-500 mt-1">Complete verification and add location details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Latitude</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.latitude}
              onChange={(e) => onChange('latitude', e.target.value)}
              className={`input-field pl-10 ${errors.latitude ? 'border-red-500' : ''}`}
              placeholder="e.g., 33.6844"
            />
          </div>
          {errors.latitude && <p className="text-xs text-red-500 mt-1">{errors.latitude}</p>}
        </div>

        <div>
          <label className="label">Longitude</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.longitude}
              onChange={(e) => onChange('longitude', e.target.value)}
              className={`input-field pl-10 ${errors.longitude ? 'border-red-500' : ''}`}
              placeholder="e.g., 73.0479"
            />
          </div>
          {errors.longitude && <p className="text-xs text-red-500 mt-1">{errors.longitude}</p>}
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={handleGetLocation}
            className="btn-secondary gap-2 text-sm"
          >
            <MapPin className="w-4 h-4" />
            Get Current Location
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="label">Call Center Remarks</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={data.ccRemarks}
              onChange={(e) => onChange('ccRemarks', e.target.value)}
              className="input-field pl-10 min-h-[100px] resize-none"
              placeholder="Enter any additional remarks or notes..."
              rows={4}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div
            onClick={() => onChange('selfieCnicVerified', !data.selfieCnicVerified)}
            className={`
              relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${data.selfieCnicVerified
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className={`
              w-6 h-6 rounded-lg flex items-center justify-center transition-all
              ${data.selfieCnicVerified ? 'bg-green-500' : 'bg-gray-200'}
            `}>
              <CheckCircle className={`w-4 h-4 ${data.selfieCnicVerified ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${data.selfieCnicVerified ? 'text-green-900' : 'text-gray-900'}`}>
                Selfie/CNIC Verification Completed
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Check this box to confirm that selfie and CNIC verification has been completed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Verification Notice</p>
            <p className="text-xs text-amber-700 mt-1">
              By submitting this request, you confirm that all information provided is accurate
              and has been verified according to the standard verification procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Verification;
