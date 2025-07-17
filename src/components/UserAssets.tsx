import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Package, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { mockUsers, mockAssets } from '../data/mockData';

export default function UserAssets() {
  const users = mockUsers;
  const assets = mockAssets;
  const loading = false;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cette fonction devra être adaptée avec l'API
  const getUserAssets = (userName: string) => {
    return assets.filter(asset => asset.assigned_to_name === userName);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Gestionnaire';
      case 'user':
        return 'Utilisateur';
      default:
        return role;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Équipements par Utilisateur</h1>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des utilisateurs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Utilisateurs</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const userAssets = getUserAssets(user.name);
                  const hasIssues = userAssets.some(asset => asset.hasIssues);
                  
                  return (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        selectedUser?.id === user.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      } ${hasIssues ? 'border-l-4 border-l-red-400' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              hasIssues ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              <User className={`h-4 w-4 ${
                                hasIssues ? 'text-red-600' : 'text-blue-600'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.certificationLevel}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hasIssues && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          <div className="text-sm font-medium text-gray-900">
                            {userAssets.length}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails de l'utilisateur sélectionné */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="space-y-6">
              {/* Informations utilisateur */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Informations Utilisateur
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom</label>
                      <div className="text-sm text-gray-900">{selectedUser.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="text-sm text-gray-900">{selectedUser.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Niveau</label>
                      <div className="text-sm text-gray-900">{selectedUser.certificationLevel}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Licence</label>
                      <div className="text-sm text-gray-900">{selectedUser.licenseNumber || 'Non renseigné'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">QR Code</label>
                      <div className="text-sm text-gray-900 font-mono">{selectedUser.qrCode}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Équipements en cours */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Équipements en Cours ({getUserAssets(selectedUser.name).length})
                  </h3>
                </div>
                <div className="p-6">
                  {getUserAssets(selectedUser.name).length > 0 ? (
                    <div className="space-y-3">
                      {getUserAssets(selectedUser.name).map((asset) => (
                        <div 
                          key={asset.id} 
                          className={`p-4 border rounded-md ${
                            asset.hasIssues ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                                asset.hasIssues ? 'bg-red-100' : 'bg-blue-100'
                              }`}>
                                {asset.hasIssues ? (
                                  <AlertTriangle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <Package className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {asset.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {asset.assetTag} • {asset.category}
                                </div>
                                {asset.hasIssues && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {asset.issueCount} problème(s) signalé(s)
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                asset.hasIssues ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {asset.hasIssues ? 'Avec problème' : 'En cours'}
                              </span>
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
                      <p className="text-sm text-gray-500">Aucun équipement en cours</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un utilisateur
                </h3>
                <p className="text-sm text-gray-500">
                  Choisissez un utilisateur dans la liste pour voir ses équipements
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}