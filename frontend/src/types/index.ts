export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  role: UserRole;
  active: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'ENGINEER' | 'AUDITOR';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  userId: number;
}

export interface CustomerUpdateRequest {
  id?: number;
  complaintNumber?: string;
  cnic: string;
  mobileNumber: string;
  nextOfKin?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  sourceOfIncome?: string;
  purposeOfAccount?: string;
  latitude?: string;
  longitude?: string;
  ccRemarks?: string;
  selfieCnicVerified: boolean;
  status?: RequestStatus;
  submittedByName?: string;
  approvedByName?: string;
  approvalComments?: string;
  createdAt?: string;
  processedAt?: string;
  errorMessage?: string;
  batchId?: number;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  completedRequests: number;
  failedRequests: number;
  todayRequests: number;
  weekRequests: number;
  successRate: number;
  avgProcessingTimeMinutes: number;
  requestsByStatus: Record<string, number>;
  requestsByDay: Record<string, number>;
}

export interface BulkUpload {
  id: number;
  fileName: string;
  originalFileName: string;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId?: number;
  username: string;
  userRole: string;
  ipAddress?: string;
  description: string;
  oldValues?: string;
  newValues?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApprovalAction {
  requestId: number;
  action: 'APPROVE' | 'REJECT';
  comments?: string;
}

export const SOURCE_OF_INCOME_OPTIONS = [
  { value: 'SALARY', label: 'Salary' },
  { value: 'BUSINESS', label: 'Business Income' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'RENTAL', label: 'Rental Income' },
  { value: 'PENSION', label: 'Pension' },
  { value: 'REMITTANCE', label: 'Foreign Remittance' },
  { value: 'INVESTMENT', label: 'Investment Income' },
  { value: 'FREELANCE', label: 'Freelance/Consultancy' },
  { value: 'OTHER', label: 'Other' },
];

export const PURPOSE_OF_ACCOUNT_OPTIONS = [
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'SALARY', label: 'Salary Account' },
  { value: 'BUSINESS', label: 'Business Transactions' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'REMITTANCE', label: 'Remittance' },
  { value: 'LOAN', label: 'Loan Account' },
  { value: 'UTILITY', label: 'Utility Payments' },
  { value: 'OTHER', label: 'Other' },
];

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};
