import React from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Building, 
  Shield, 
  Bell,
  Database,
  Download,
  Upload
} from 'lucide-react';

export default function Settings() {
  const settingsCategories = [
    {
      title: 'Général',
      icon: SettingsIcon,
      items: [
        { name: 'Nom de l\'organisation', value: 'Mon Entreprise' },
        { name: 'Fuseau horaire', value: 'Europe/Paris' },
        { name: 'Langue', value: 'Français' },
        { name: 'Format de date', value: 'DD/MM/YYYY' }
      ]
    },
    {
      title: 'Utilisateurs et Permissions',
      icon: Users,
      items: [
        { name: 'Rôles disponibles', value: 'Administrateur, Gestionnaire, Utilisateur' },
        { name: 'Authentification', value: 'Locale' },
        { name: 'Durée de session', value: '8 heures' }
      ]
    },
    {
      title: 'Localisation',
      icon: Building,
      items: [
        { name: 'Localisations par défaut', value: 'Paris, Lyon, Marseille' },
        { name: 'Gestion des sites', value: 'Activée' }
      ]
    },
    {
      title: 'Sécurité',
      icon: Shield,
      items: [
        { name: 'Politique de mot de passe', value: 'Forte' },
        { name: 'Authentification à deux facteurs', value: 'Optionnelle' },
        { name: 'Journalisation des actions', value: 'Activée' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { name: 'Notifications par email', value: 'Activées' },
        { name: 'Rappels de maintenance', value: 'Activés' },
        { name: 'Alertes de retour', value: 'Activées' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category) => (
          <div key={category.title} className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <category.icon className="h-5 w-5 mr-2 text-gray-600" />
                {category.title}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        {item.name}
                      </label>
                    </div>
                    <div className="flex-1 max-w-md">
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {item.value}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Management */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2 text-gray-600" />
            Gestion des Données
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Download className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Exporter les données</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Exportez toutes vos données d'actifs en format CSV ou Excel.
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                Exporter
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Upload className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Importer des données</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Importez des actifs en masse depuis un fichier CSV ou Excel.
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Informations Système</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">v1.0.0</div>
              <div className="text-sm text-gray-500">Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">60</div>
              <div className="text-sm text-gray-500">Actifs totaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-500">Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}