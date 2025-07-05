import { useState, useEffect } from 'react';
import { dataService } from '../services/DataService';
import { seedDatabase } from '../database/seedData';
import { User, Asset, Movement, DashboardStats } from '../types';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await seedDatabase();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur d\'initialisation');
      }
    };

    initializeDatabase();
  }, []);

  return { isInitialized, error };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    try {
      const data = dataService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const searchUsers = (searchTerm: string) => {
    try {
      const data = dataService.searchUsers(searchTerm);
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const createUser = (user: Omit<User, 'createdAt'>) => {
    try {
      dataService.createUser(user);
      loadUsers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  };

  return { users, loading, searchUsers, createUser, reload: loadUsers };
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = () => {
    try {
      const data = dataService.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Erreur lors du chargement des équipements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const searchAssets = (searchTerm: string, statusFilter?: string, categoryFilter?: string) => {
    try {
      const data = dataService.searchAssets(searchTerm, statusFilter, categoryFilter);
      setAssets(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    try {
      dataService.updateAsset(id, updates);
      loadAssets(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  return { assets, loading, searchAssets, updateAsset, reload: loadAssets };
}

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovements = () => {
    try {
      const data = dataService.getMovements();
      setMovements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const searchMovements = (searchTerm: string, typeFilter?: string) => {
    try {
      const data = dataService.searchMovements(searchTerm, typeFilter);
      setMovements(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  return { movements, loading, searchMovements, reload: loadMovements };
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    try {
      const data = dataService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, reload: loadStats };
}