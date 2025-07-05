export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  assetTag: string;
  category: string;
  model: string;
  manufacturer: string;
  status: 'available' | 'checked_out' | 'maintenance' | 'retired' | 'defective';
  assignedTo?: string;
  location: string;
  notes?: string;
  hasIssues?: boolean;
  issueCount?: number;
  lastIssueDate?: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  licenseNumber?: string;
  certificationLevel: string;
  role: 'admin' | 'manager' | 'user';
  qrCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface Movement {
  id: string;
  assetId: string;
  assetName: string;
  type: 'checkout' | 'checkin' | 'maintenance' | 'retired';
  userId: string;
  userName: string;
  date: string;
  notes?: string;
  performedBy: string;
  hasIssues?: boolean;
  issueDescription?: string;
  method: 'manual' | 'qr_scan';
}

export interface Notification {
  id: string;
  type: 'issue' | 'maintenance' | 'warning' | 'info';
  title: string;
  message: string;
  assetId?: string;
  assetName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
  createdBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Issue {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  images?: string[];
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  checkedOutAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  defectiveAssets: number;
  recentMovements: Movement[];
  unreadNotifications: number;
  criticalIssues: number;
  openIssues: number;
  activeUsers: number;
}

export interface CheckoutSession {
  id: string;
  userId?: string;
  userName?: string;
  scannedAssets: string[];
  startedAt: string;
  completedAt?: string;
  status: 'scanning_user' | 'scanning_equipment' | 'completed';
}