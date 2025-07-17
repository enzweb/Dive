import { useState, useEffect } from 'react';
import { mockUsers, mockAssets, mockMovements, mockDashboardStats } from '../data/mockData';
import { User, Asset, Movement, DashboardStats } from '../types';

// Service simulé pour les données locales
const mockApiService = {
  async getUsers(search?: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simule un délai réseau
    let users = mockUsers;
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return users;
  },

  async getAssets(search?: string, status?: string, category?: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let assets = mockAssets;
    if (search) {
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(search.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status && status !== 'all') {
      assets = assets.filter(asset => asset.status === status);
    }
    if (category && category !== 'all') {
      assets = assets.filter(asset => asset.category === category);
    }
    return assets;
  },

  async getMovements(search?: string, type?: string, limit?: number) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let movements = mockMovements;
    if (search) {
      movements = movements.filter(movement => 
        movement.assetName.toLowerCase().includes(search.toLowerCase()) ||
        movement.userName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (type && type !== 'all') {
      movements = movements.filter(movement => movement.type === type);
    }
    if (limit) {
      movements = movements.slice(0, limit);
    }
    return movements;
  },

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDashboardStats;
  },

  async getUserByQrCode(qrCode: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const user = mockUsers.find(u => u.qrCode === qrCode);
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
  },

  async getAssetByQrCode(qrCode: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const asset = mockAssets.find(a => a.qrCode === qrCode);
    if (!asset) throw new Error('Équipement non trouvé');
    return asset;
  },

  async checkout(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Checkout simulé:', data);
    return { success: true };
  },

  async checkin(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Checkin simulé:', data);
    return { success: true };
  },

  async createUser(user: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Création utilisateur simulée:', user);
    return { success: true };
  },

  async updateUser(id: string, updates: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Mise à jour utilisateur simulée:', id, updates);
    return { success: true };
  },

  async deleteUser(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Suppression utilisateur simulée:', id);
    return { success: true };
  },

  async createAsset(asset: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Création équipement simulée:', asset);
    return { success: true };
  },

  async updateAsset(id: string, updates: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Mise à jour équipement simulée:', id, updates);
    return { success: true };
  }
};
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApiService.getUsers(search);
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
      await mockApiService.createUser(user);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await mockApiService.updateUser(id, updates);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await mockApiService.deleteUser(id);
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
      const data = await mockApiService.getAssets(search, status, category);
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
      await mockApiService.createAsset(asset);
      await loadAssets(); // Recharger la liste
    } catch (err) {
      throw err;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      await mockApiService.updateAsset(id, updates);
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
      const data = await mockApiService.getMovements(search, type, limit);
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
      const data = await mockApiService.getStats();
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
      return await mockApiService.getUserByQrCode(qrCode);
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
      return await mockApiService.getAssetByQrCode(qrCode);
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
      return await mockApiService.checkout(data);
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
      return await mockApiService.checkin(data);
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