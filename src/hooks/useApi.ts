import { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import { User, Asset, Movement, DashboardStats } from '../types';
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUsers(search);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (user: Omit<User, 'createdAt'>) => {
    try {
      await apiService.createUser(user);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await apiService.updateUser(id, updates);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiService.deleteUser(id);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  return { 
    users, 
    loading, 
    error, 
    searchUsers: loadUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    reload: () => loadUsers() 
  };
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async (search?: string, status?: string, category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAssets(search, status, category);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const createAsset = async (asset: Omit<Asset, 'createdAt' | 'updatedAt'>) => {
    try {
      await apiService.createAsset(asset);
      await loadAssets(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      await apiService.updateAsset(id, updates);
      await loadAssets(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  return { 
    assets, 
    loading, 
    error, 
    searchAssets: loadAssets, 
    createAsset, 
    updateAsset,
    reload: () => loadAssets() 
  };
}

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovements = async (search?: string, type?: string, limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMovements(search, type, limit);
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  return { 
    movements, 
    loading, 
    error, 
    searchMovements: loadMovements,
    reload: () => loadMovements() 
  };
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, error, reload: loadStats };
}

export function useQRScanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanUserQR = async (qrCode: string) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.getUserByQrCode(qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Utilisateur non trouvé');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const scanAssetQR = async (qrCode: string) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.getAssetByQrCode(qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Équipement non trouvé');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.checkout(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkin = async (data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
    hasIssues?: boolean;
    issueDescription?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.checkin(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du checkin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    scanUserQR, 
    scanAssetQR, 
    checkout, 
    checkin 
  };
}