import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  History, 
  Settings, 
  Menu,
  X,
  Bell,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Smartphone,
  UserCheck
} from 'lucide-react';
import { mockNotifications } from '../data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', icon: BarChart3, key: 'dashboard' },
    { name: 'Scanner QR', icon: QrCode, key: 'scanner' },
    { name: 'Équipements', icon: Package, key: 'assets' },
    { name: 'Utilisateurs', icon: Users, key: 'users' },
    { name: 'Emprunts', icon: UserCheck, key: 'user-assets' },
    { name: 'Historique', icon: History, key: 'history' },
    { name: 'Problèmes', icon: AlertTriangle, key: 'issues' },
    { name: 'Paramètres', icon: Settings, key: 'settings' }
  ];

  const unreadNotifications = mockNotifications.filter(n => !n.isRead);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">DiveManager</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onViewChange(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    currentView === item.key
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.key === 'issues' && unreadNotifications.length > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center h-16 px-4 bg-white border-b border-gray-200">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DiveManager</span>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === item.key
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.key === 'issues' && unreadNotifications.length > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                      mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 p-1 rounded-full ${getSeverityColor(notification.severity)}`}>
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p>Aucune notification</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => onViewChange('issues')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Voir tous les problèmes
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Club de Plongée
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">CP</span>
            </div>
          </div>
        </div>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close notifications */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  );
}