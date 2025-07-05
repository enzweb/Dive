import { UserRepository } from '../database/repositories/UserRepository';
import { AssetRepository } from '../database/repositories/AssetRepository';
import { MovementRepository } from '../database/repositories/MovementRepository';
import { User, Asset, Movement, DashboardStats } from '../types';

export class DataService {
  private userRepo: UserRepository;
  private assetRepo: AssetRepository;
  private movementRepo: MovementRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.assetRepo = new AssetRepository();
    this.movementRepo = new MovementRepository();
  }

  // === UTILISATEURS ===
  
  getUsers(): User[] {
    return this.userRepo.findAll();
  }

  getUserById(id: string): User | null {
    return this.userRepo.findById(id);
  }

  getUserByQrCode(qrCode: string): User | null {
    return this.userRepo.findByQrCode(qrCode);
  }

  searchUsers(searchTerm: string): User[] {
    return this.userRepo.search(searchTerm);
  }

  createUser(user: Omit<User, 'createdAt'>): User {
    return this.userRepo.create(user);
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    return this.userRepo.update(id, updates);
  }

  deleteUser(id: string): boolean {
    return this.userRepo.delete(id);
  }

  // === ÉQUIPEMENTS ===

  getAssets(): Asset[] {
    return this.assetRepo.findAll();
  }

  getAssetById(id: string): Asset | null {
    return this.assetRepo.findById(id);
  }

  getAssetByQrCode(qrCode: string): Asset | null {
    return this.assetRepo.findByQrCode(qrCode);
  }

  searchAssets(searchTerm: string, statusFilter?: string, categoryFilter?: string): Asset[] {
    return this.assetRepo.search(searchTerm, statusFilter, categoryFilter);
  }

  getAssetsByUser(userName: string): Asset[] {
    return this.assetRepo.findByUser(userName);
  }

  createAsset(asset: Omit<Asset, 'createdAt' | 'updatedAt'>): Asset {
    return this.assetRepo.create(asset);
  }

  updateAsset(id: string, updates: Partial<Asset>): Asset | null {
    return this.assetRepo.update(id, updates);
  }

  // === MOUVEMENTS ===

  getMovements(): Movement[] {
    return this.movementRepo.findAll();
  }

  getMovementById(id: string): Movement | null {
    return this.movementRepo.findById(id);
  }

  searchMovements(searchTerm: string, typeFilter?: string): Movement[] {
    return this.movementRepo.search(searchTerm, typeFilter);
  }

  getRecentMovements(limit: number = 10): Movement[] {
    return this.movementRepo.getRecent(limit);
  }

  createMovement(movement: Omit<Movement, 'date'>): Movement {
    return this.movementRepo.create(movement);
  }

  // === CHECKOUT/CHECKIN ===

  checkoutAsset(assetId: string, userId: string, performedBy: string, notes?: string): { success: boolean; message: string; movement?: Movement } {
    const asset = this.getAssetById(assetId);
    const user = this.getUserById(userId);

    if (!asset) {
      return { success: false, message: 'Équipement non trouvé' };
    }

    if (!user) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    if (asset.status !== 'available') {
      return { success: false, message: `Équipement non disponible (${asset.status})` };
    }

    // Mettre à jour l'équipement
    this.updateAsset(assetId, {
      status: 'checked_out',
      assignedTo: user.name
    });

    // Créer le mouvement
    const movement = this.createMovement({
      id: Date.now().toString(),
      assetId,
      assetName: asset.name,
      type: 'checkout',
      userId,
      userName: user.name,
      performedBy,
      notes,
      method: 'qr_scan'
    });

    return {
      success: true,
      message: `${asset.name} assigné à ${user.name}`,
      movement
    };
  }

  checkinAsset(assetId: string, userId: string, performedBy: string, notes?: string, hasIssues?: boolean, issueDescription?: string): { success: boolean; message: string; movement?: Movement } {
    const asset = this.getAssetById(assetId);
    const user = this.getUserById(userId);

    if (!asset) {
      return { success: false, message: 'Équipement non trouvé' };
    }

    if (!user) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    if (asset.status !== 'checked_out') {
      return { success: false, message: 'Équipement non en sortie' };
    }

    if (asset.assignedTo !== user.name) {
      return { success: false, message: `Équipement assigné à ${asset.assignedTo}` };
    }

    // Mettre à jour l'équipement
    const newStatus = hasIssues ? 'defective' : 'available';
    this.updateAsset(assetId, {
      status: newStatus,
      assignedTo: undefined,
      hasIssues,
      issueCount: hasIssues ? (asset.issueCount || 0) + 1 : asset.issueCount,
      lastIssueDate: hasIssues ? new Date().toISOString() : asset.lastIssueDate
    });

    // Créer le mouvement
    const movement = this.createMovement({
      id: Date.now().toString(),
      assetId,
      assetName: asset.name,
      type: 'checkin',
      userId,
      userName: user.name,
      performedBy,
      notes,
      hasIssues,
      issueDescription,
      method: 'qr_scan'
    });

    return {
      success: true,
      message: `${asset.name} retourné par ${user.name}${hasIssues ? ' (avec problème)' : ''}`,
      movement
    };
  }

  // === STATISTIQUES ===

  getDashboardStats(): DashboardStats {
    const assetStats = this.assetRepo.getStats();
    const recentMovements = this.getRecentMovements(5);
    const users = this.getUsers();

    return {
      totalAssets: assetStats.total,
      availableAssets: assetStats.available,
      checkedOutAssets: assetStats.checked_out,
      maintenanceAssets: assetStats.maintenance,
      retiredAssets: assetStats.retired,
      defectiveAssets: assetStats.defective,
      recentMovements,
      unreadNotifications: 0, // À implémenter avec les notifications
      criticalIssues: 0, // À implémenter avec les issues
      openIssues: 0, // À implémenter avec les issues
      activeUsers: users.filter(u => u.isActive).length
    };
  }
}

// Instance singleton du service
export const dataService = new DataService();