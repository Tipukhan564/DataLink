import React, { useState, useEffect, useRef } from 'react';
import Header from '../layout/Header';
import { bulkUploadAPI } from '../../services/api';
import { BulkUpload, CustomerUpdateRequest, PageResponse } from '../../types';
import { formatDate, formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  Upload, FileSpreadsheet, Play, Eye, CheckCircle,
  XCircle, Clock, AlertTriangle, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const BulkUploadPage: React.FC = () => {
  const [uploads, setUploads] = useState<BulkUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CustomerUpdateRequest[] | null>(null);
  const [previewUploadId, setPreviewUploadId] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    try {
      const res = await bulkUploadAPI.getAll();
      setUploads((res.data as PageResponse<BulkUpload>).content);
    } catch {
      toast.error('Failed to load uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Only Excel files (.xlsx, .xls) are accepted');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const res = await bulkUploadAPI.upload(selectedFile);
      toast.success('File uploaded successfully');
      setSelectedFile(null);
      loadUploads();
      setPreviewUploadId(res.data.id);
      const preview = await bulkUploadAPI.preview(res.data.id);
      setPreviewData(preview.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (id: number) => {
    try {
      await bulkUploadAPI.process(id);
      toast.success('Bulk processing started');
      loadUploads();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Processing failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PROCESSING': return <Clock className="w-4 h-4 text-purple-500 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'UPLOADED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      <Header title="Bulk Upload" subtitle="Upload and process Excel files with customer data" />

      <div className="p-6 space-y-6">
        {/* Upload Area */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Upload Excel File</h3>
            <p className="text-xs text-gray-500 mt-1">
              Upload an Excel file matching the UpgradedUltraAccountsData.xlsx format
            </p>
          </div>
          <div className="card-body">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your Excel file here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  browse to upload
                </button>
              </p>
              <p className="text-xs text-gray-400">Supports .xlsx and .xls files up to 50MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedFile(null)} className="btn-secondary py-1.5 px-3 text-xs">
                    Remove
                  </button>
                  <button onClick={handleUpload} disabled={uploading} className="btn-primary py-1.5 px-3 text-xs gap-1.5">
                    {uploading ? (
                      <>
                        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" /> Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        {previewData && (
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Preview (First 10 Records)</h3>
              <div className="flex gap-2">
                <button onClick={() => setPreviewData(null)} className="btn-secondary py-1.5 px-3 text-xs">
                  Close Preview
                </button>
                {previewUploadId && (
                  <button
                    onClick={() => { handleProcess(previewUploadId); setPreviewData(null); }}
                    className="btn-primary py-1.5 px-3 text-xs gap-1.5"
                  >
                    <Play className="w-3 h-3" /> Process All
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">#</th>
                    <th className="table-header">CNIC</th>
                    <th className="table-header">Mobile</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Father</th>
                    <th className="table-header">Income</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="table-cell text-gray-500">{idx + 1}</td>
                      <td className="table-cell font-mono text-xs">{row.cnic}</td>
                      <td className="table-cell">{row.mobileNumber}</td>
                      <td className="table-cell text-xs">{row.email || '-'}</td>
                      <td className="table-cell">{row.fatherName || '-'}</td>
                      <td className="table-cell">{row.sourceOfIncome || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload History */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Upload History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">File Name</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Success</th>
                  <th className="table-header">Failed</th>
                  <th className="table-header">Progress</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
                    </td>
                  </tr>
                ) : uploads.length > 0 ? (
                  uploads.map((upload) => {
                    const progress = upload.totalRecords > 0
                      ? Math.round((upload.processedRecords / upload.totalRecords) * 100) : 0;
                    return (
                      <tr key={upload.id} className="hover:bg-gray-50">
                        <td className="table-cell font-medium">#{upload.id}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            <span className="text-xs">{upload.originalFileName}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${getStatusColor(upload.status)}`}>
                            {upload.status}
                          </span>
                        </td>
                        <td className="table-cell">{upload.totalRecords}</td>
                        <td className="table-cell text-green-600">{upload.successfulRecords}</td>
                        <td className="table-cell text-red-600">{upload.failedRecords}</td>
                        <td className="table-cell">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-primary-600 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500">{progress}%</span>
                        </td>
                        <td className="table-cell text-xs text-gray-500">{formatDate(upload.createdAt)}</td>
                        <td className="table-cell">
                          {upload.status === 'UPLOADED' && (
                            <button
                              onClick={() => handleProcess(upload.id)}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Process
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                      No uploads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
