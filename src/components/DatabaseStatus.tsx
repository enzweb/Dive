import React from 'react';
import { Database, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

export default function DatabaseStatus() {
  const { isInitialized, error } = useDatabase();

  if (!isInitialized && !error) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <Loader className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Initialisation</h4>
            <p className="text-sm text-blue-700">Chargement de la base de données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <h4 className="text-sm font-medium text-red-900">Erreur Base de Données</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isInitialized) {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <h4 className="text-sm font-medium text-green-900">Base de Données</h4>
            <p className="text-sm text-green-700">SQLite connectée</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}