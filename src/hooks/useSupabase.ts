import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Asset = Database['public']['Tables']['assets']['Row'] & { assignedTo?: string | null };
type Movement = Database['public']['Tables']['movements']['Row'] & { 
  assetName: string; 
  userName: string; 
};

// Hook pour les utilisateurs
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getUsers(search);
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

  const createUser = async (user: Database['public']['Tables']['users']['Insert']) => {
    try {
      await supabaseService.createUser(user);
      await loadUsers();
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Database['public']['Tables']['users']['Update']) => {
    try {
      await supabaseService.updateUser(id, updates);
      await loadUsers();
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await supabaseService.deleteUser(id);
      await loadUsers();
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

// Hook pour les équipements
export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async (search?: string, status?: string, category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getAssets(search, status, category);
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

  const createAsset = async (asset: Database['public']['Tables']['assets']['Insert']) => {
    try {
      await supabaseService.createAsset(asset);
      await loadAssets();
    } catch (err) {
      throw err;
    }
  };

  const updateAsset = async (id: string, updates: Database['public']['Tables']['assets']['Update']) => {
    try {
      await supabaseService.updateAsset(id, updates);
      await loadAssets();
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

// Hook pour les mouvements
export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovements = async (search?: string, type?: string, limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getMovements(search, type, limit);
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

// Hook pour le tableau de bord
export function useDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getStats();
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

// Hook pour le scanner QR
export function useQRScanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanUserQR = async (qrCode: string) => {
    try {
      setLoading(true);
      setError(null);
      return await supabaseService.getUserByQrCode(qrCode);
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
      return await supabaseService.getAssetByQrCode(qrCode);
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
      return await supabaseService.checkout(data);
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
      return await supabaseService.checkin(data);
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