import { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        // Check if backend API is available
        const response = await fetch('/api/health');
        if (response.ok) {
          setIsInitialized(true);
        } else {
          setError('Backend API non disponible');
        }
      } catch (err) {
        setError('Impossible de se connecter au backend');
      }
    };

    checkBackendHealth();
  }, []);

  return { isInitialized, error };
}