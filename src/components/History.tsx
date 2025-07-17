import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Package,
  UserCheck,
  Calendar,
  User
} from 'lucide-react';
import { mockMovements } from '../data/mockData';

export default function History() {
  const [movements, setMovements] = useState(mockMovements);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'checkout':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case 'checkin':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'retired':
        return <Package className="h-5 w-5 text-gray-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMovementText = (movement: any) => {
    switch (movement.type) {
      case 'checkout':
        return `Assigné à ${movement.userName}`;
      case 'checkin':
        return `Récupéré de ${movement.userName}`;
      case 'maintenance':
        return 'Envoyé en maintenance';
      case 'retired':
        return 'Mis au rebut';
      default:
        return 'Action inconnue';
    }
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'checkout':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Attribution
          </span>
        );
      case 'checkin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Récupération
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Maintenance
          </span>
        );
      case 'retired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Retiré
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Historique des Mouvements</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par équipement ou utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="checkout">Attribution</option>
              <option value="checkin">Récupération</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retiré</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activité Récente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {filteredMovements.map((movement, index) => (
              <div key={movement.id} className="relative">
                {index < filteredMovements.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center p-2 bg-white border-2 border-gray-200 rounded-full">
                      {getMovementIcon(movement.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {movement.assetName}
                        </h4>
                        {getMovementBadge(movement.type)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(movement.date)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {getMovementText(movement)}
                    </p>
                    {movement.notes && (
                      <p className="mt-1 text-sm text-gray-500 italic">
                        Note: {movement.notes}
                      </p>
                    )}
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      Effectué par {movement.performedBy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun mouvement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm text-gray-600">
          Total: {filteredMovements.length} mouvement(s)
        </div>
      </div>
    </div>
  );
}