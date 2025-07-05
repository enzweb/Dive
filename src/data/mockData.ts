import { Asset, User, Category, Movement, DashboardStats, Notification, Issue } from '../types';

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Détendeur Scubapro MK25 EVO',
    serialNumber: 'SP2023001',
    assetTag: 'DET-001',
    category: 'Détendeurs',
    model: 'MK25 EVO',
    manufacturer: 'Scubapro',
    status: 'checked_out',
    assignedTo: 'Jean Dupont',
    location: 'Club de Plongée - Vestiaire',
    notes: 'Révision effectuée en janvier 2024',
    qrCode: 'DET-001-QR',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Combinaison Néoprène 5mm',
    serialNumber: 'NEO2023002',
    assetTag: 'COM-002',
    category: 'Combinaisons',
    model: 'Néoprène 5mm Taille L',
    manufacturer: 'Beuchat',
    status: 'available',
    location: 'Club de Plongée - Stock',
    notes: 'Taille L, bon état général',
    qrCode: 'COM-002-QR',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Masque Cressi Big Eyes Evolution',
    serialNumber: 'CR2023003',
    assetTag: 'MAS-003',
    category: 'Masques',
    model: 'Big Eyes Evolution',
    manufacturer: 'Cressi',
    status: 'defective',
    location: 'Club de Plongée - Maintenance',
    notes: 'Sangle cassée - en attente de réparation',
    hasIssues: true,
    issueCount: 1,
    lastIssueDate: '2024-01-08T09:15:00Z',
    qrCode: 'MAS-003-QR',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    name: 'Palmes Mares Avanti Quattro Plus',
    serialNumber: 'MA2023004',
    assetTag: 'PAL-004',
    category: 'Palmes',
    model: 'Avanti Quattro Plus Taille 42-43',
    manufacturer: 'Mares',
    status: 'maintenance',
    location: 'Club de Plongée - Maintenance',
    notes: 'Nettoyage et vérification des sangles',
    hasIssues: true,
    issueCount: 1,
    lastIssueDate: '2024-01-05T11:45:00Z',
    qrCode: 'PAL-004-QR',
    createdAt: '2023-04-05T11:45:00Z',
    updatedAt: '2024-01-05T11:45:00Z'
  },
  {
    id: '5',
    name: 'Gilet Stabilisateur Aqualung Pro HD',
    serialNumber: 'AQ2023005',
    assetTag: 'GIL-005',
    category: 'Gilets',
    model: 'Pro HD Taille M',
    manufacturer: 'Aqualung',
    status: 'checked_out',
    assignedTo: 'Marie Martin',
    location: 'Club de Plongée - En sortie',
    notes: 'Taille M, excellent état',
    qrCode: 'GIL-005-QR',
    createdAt: '2023-05-12T16:20:00Z',
    updatedAt: '2024-01-10T16:20:00Z'
  },
  {
    id: '6',
    name: 'Bouteille 12L Acier',
    serialNumber: 'BT2023006',
    assetTag: 'BOU-006',
    category: 'Bouteilles',
    model: '12L Acier 232 bars',
    manufacturer: 'Roth',
    status: 'available',
    location: 'Club de Plongée - Compresseur',
    notes: 'Contrôle technique valide jusqu\'en 2025',
    qrCode: 'BOU-006-QR',
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2023-06-01T08:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@club-plongee.com',
    licenseNumber: 'FFESSM-123456',
    certificationLevel: 'Niveau 2',
    role: 'user',
    qrCode: 'USER-001-QR',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@club-plongee.com',
    licenseNumber: 'FFESSM-789012',
    certificationLevel: 'Niveau 3',
    role: 'user',
    qrCode: 'USER-002-QR',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Pierre Dubois',
    email: 'pierre.dubois@club-plongee.com',
    licenseNumber: 'FFESSM-345678',
    certificationLevel: 'Moniteur E3',
    role: 'manager',
    qrCode: 'USER-003-QR',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Sophie Leroy',
    email: 'sophie.leroy@club-plongee.com',
    licenseNumber: 'FFESSM-901234',
    certificationLevel: 'Instructeur',
    role: 'admin',
    qrCode: 'USER-004-QR',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Détendeurs',
    description: 'Détendeurs et octopus',
    count: 8
  },
  {
    id: '2',
    name: 'Combinaisons',
    description: 'Combinaisons néoprène et étanches',
    count: 15
  },
  {
    id: '3',
    name: 'Masques',
    description: 'Masques de plongée',
    count: 12
  },
  {
    id: '4',
    name: 'Palmes',
    description: 'Palmes de plongée',
    count: 18
  },
  {
    id: '5',
    name: 'Gilets',
    description: 'Gilets stabilisateurs',
    count: 10
  },
  {
    id: '6',
    name: 'Bouteilles',
    description: 'Bouteilles de plongée',
    count: 25
  }
];

export const mockMovements: Movement[] = [
  {
    id: '1',
    assetId: '1',
    assetName: 'Détendeur Scubapro MK25 EVO',
    type: 'checkout',
    userId: '1',
    userName: 'Jean Dupont',
    date: '2024-01-15T10:30:00Z',
    notes: 'Sortie plongée épave',
    performedBy: 'Pierre Dubois',
    method: 'qr_scan'
  },
  {
    id: '2',
    assetId: '3',
    assetName: 'Masque Cressi Big Eyes Evolution',
    type: 'checkin',
    userId: '2',
    userName: 'Marie Martin',
    date: '2024-01-08T14:20:00Z',
    notes: 'Retour avec sangle cassée',
    performedBy: 'Pierre Dubois',
    hasIssues: true,
    issueDescription: 'Sangle du masque cassée pendant la plongée',
    method: 'manual'
  },
  {
    id: '3',
    assetId: '4',
    assetName: 'Palmes Mares Avanti Quattro Plus',
    type: 'maintenance',
    userId: '3',
    userName: 'Pierre Dubois',
    date: '2024-01-05T09:15:00Z',
    notes: 'Maintenance préventive',
    performedBy: 'Pierre Dubois',
    method: 'manual'
  },
  {
    id: '4',
    assetId: '5',
    assetName: 'Gilet Stabilisateur Aqualung Pro HD',
    type: 'checkout',
    userId: '2',
    userName: 'Marie Martin',
    date: '2024-01-10T16:20:00Z',
    notes: 'Formation Niveau 1',
    performedBy: 'Sophie Leroy',
    method: 'qr_scan'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'issue',
    title: 'Équipement défaillant',
    message: 'Masque Cressi retourné avec sangle cassée',
    assetId: '3',
    assetName: 'Masque Cressi Big Eyes Evolution',
    severity: 'high',
    isRead: false,
    createdAt: '2024-01-08T14:25:00Z',
    createdBy: 'Pierre Dubois'
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance programmée',
    message: 'Palmes Mares - nettoyage et vérification',
    assetId: '4',
    assetName: 'Palmes Mares Avanti Quattro Plus',
    severity: 'medium',
    isRead: false,
    createdAt: '2024-01-05T09:20:00Z',
    createdBy: 'Pierre Dubois'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Contrôle technique',
    message: 'Bouteille 12L - contrôle technique à prévoir',
    assetId: '6',
    assetName: 'Bouteille 12L Acier',
    severity: 'low',
    isRead: true,
    createdAt: '2024-01-03T16:00:00Z',
    createdBy: 'Système'
  }
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    assetId: '3',
    assetName: 'Masque Cressi Big Eyes Evolution',
    title: 'Sangle cassée',
    description: 'La sangle du masque s\'est cassée pendant la plongée. Nécessite un remplacement complet de la sangle.',
    severity: 'high',
    status: 'open',
    reportedBy: 'Pierre Dubois',
    reportedAt: '2024-01-08T14:25:00Z'
  },
  {
    id: '2',
    assetId: '4',
    assetName: 'Palmes Mares Avanti Quattro Plus',
    title: 'Usure des sangles',
    description: 'Les sangles montrent des signes d\'usure. Maintenance préventive recommandée.',
    severity: 'medium',
    status: 'in_progress',
    reportedBy: 'Pierre Dubois',
    reportedAt: '2024-01-05T09:20:00Z',
    assignedTo: 'Pierre Dubois'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalAssets: 88,
  availableAssets: 45,
  checkedOutAssets: 28,
  maintenanceAssets: 8,
  retiredAssets: 5,
  defectiveAssets: 2,
  recentMovements: mockMovements.slice(0, 5),
  unreadNotifications: 2,
  criticalIssues: 0,
  openIssues: 2,
  activeUsers: 4
};