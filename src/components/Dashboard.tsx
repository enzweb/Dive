import React from 'react';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Activity,
  Users,
  Clock,
  AlertCircle,
  Bell,
  UserCheck
} from 'lucide-react';
import { mockDashboardStats, mockNotifications, mockIssues } from '../data/mockData';

export default function Dashboard() {
  const stats = mockDashboardStats;
  const criticalNotifications = mockNotifications.filter(n => n.severity === 'critical' || n.severity === 'high');
  const openIssues = mockIssues.filter(i => i.status === 'open' || i.status === 'in_progress');

  const statusCards = [
    {
      name: 'Total Équipements',
      value: stats.totalAssets,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Disponibles',
      value: stats.availableAssets,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    {
      name: 'En Sortie',
      value: stats.checkedOutAssets,
      icon: UserCheck,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'En Défaut',
      value: stats.defectiveAssets,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      alert: stats.defectiveAssets > 0
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex items-center space-x-3">
          {stats.unreadNotifications > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
              <Bell className="h-4 w-4" />
              <span>{stats.unreadNotifications} notification(s) non lue(s)</span>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalNotifications.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-900">Alertes Critiques</h3>
          </div>
          <div className="space-y-2">
            {criticalNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between bg-white p-3 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.assetName}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(notification.severity)}`}>
                  {notification.severity === 'critical' ? 'Critique' : 'Élevé'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <div key={card.name} className={`bg-white overflow-hidden shadow-sm rounded-lg border ${card.alert ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-200'}`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-3 rounded-md ${card.bgColor} ${card.alert ? 'animate-pulse' : ''}`}>
                    <card.icon className={`h-6 w-6 ${card.textColor}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className={`text-lg font-semibold ${card.alert ? 'text-red-600' : 'text-gray-900'}`}>
                      {card.value}
                      {card.alert && (
                        <AlertTriangle className="inline h-4 w-4 ml-1 text-red-500" />
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Categories and Issues Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Categories */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Répartition par Catégorie
            </h3>
          </div>
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Détendeurs</span>
                <span className="font-medium">8 équipements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Combinaisons</span>
                <span className="font-medium">15 équipements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Masques</span>
                <span className="font-medium">12 équipements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Palmes</span>
                <span className="font-medium">18 équipements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gilets</span>
                <span className="font-medium">10 équipements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bouteilles</span>
                <span className="font-medium">25 équipements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Overview */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Problèmes en Cours
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {openIssues.length > 0 ? (
                openIssues.slice(0, 3).map((issue) => (
                  <div key={issue.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`inline-flex items-center justify-center p-2 rounded-full ${getSeverityColor(issue.severity)}`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {issue.assetName}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(issue.reportedAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-gray-500">Aucun problème en cours</p>
                </div>
              )}
            </div>
            {openIssues.length > 3 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Et {openIssues.length - 3} autre(s) problème(s)...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Activité Récente
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {stats.recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-2 rounded-full ${
                    movement.hasIssues ? 'bg-red-100' :
                    movement.type === 'checkout' ? 'bg-green-100' :
                    movement.type === 'checkin' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {movement.hasIssues ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : movement.type === 'checkout' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : movement.type === 'checkin' ? (
                      <Package className="h-4 w-4 text-blue-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {movement.assetName}
                    {movement.hasIssues && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Problème signalé
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {movement.type === 'checkout' ? `Sorti par ${movement.userName}` :
                     movement.type === 'checkin' ? `Retourné par ${movement.userName}` :
                     'Envoyé en maintenance'}
                  </p>
                  {movement.issueDescription && (
                    <p className="text-xs text-red-600 mt-1">
                      {movement.issueDescription}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {formatDate(movement.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}