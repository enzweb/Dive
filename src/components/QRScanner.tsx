import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  User, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  X,
  Camera,
  Scan
} from 'lucide-react';
import { CheckoutSession, User as UserType, Asset } from '../types';
import { mockUsers, mockAssets } from '../data/mockData';

export default function QRScanner() {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [scannedUser, setScannedUser] = useState<UserType | null>(null);
  const [scannedAssets, setScannedAssets] = useState<Asset[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Gestion des paramètres URL pour les QR codes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');
    
    if (type && id) {
      // Si on arrive via un QR code, démarrer automatiquement une session
      if (!session) {
        startNewSession();
      }
      
      // Simuler le scan du QR code
      setTimeout(() => {
        if (type === 'user') {
          handleScan(`USER-${id}-QR`);
        } else if (type === 'asset') {
          handleScan(`${id}-QR`);
        }
      }, 500);
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Gestion des routes directes /user/ID et /asset/ID
  useEffect(() => {
    const path = window.location.pathname;
    const userMatch = path.match(/^\/user\/(.+)$/);
    const assetMatch = path.match(/^\/asset\/(.+)$/);
    
    if (userMatch || assetMatch) {
      // Rediriger vers le scanner avec les paramètres appropriés
      const type = userMatch ? 'user' : 'asset';
      const id = userMatch ? userMatch[1] : assetMatch![1];
      
      if (!session) {
        startNewSession();
      }
      
      setTimeout(() => {
        if (type === 'user') {
          const user = mockUsers.find(u => u.id === id || u.qrCode.includes(id));
          if (user) handleScan(user.qrCode);
        } else {
          const asset = mockAssets.find(a => a.id === id || a.qrCode.includes(id));
          if (asset) handleScan(asset.qrCode);
        }
      }, 500);
      
      // Rediriger vers la page scanner
      window.history.replaceState({}, document.title, '/scanner');
    }
  }, []);

  const startNewSession = () => {
    const newSession: CheckoutSession = {
      id: Date.now().toString(),
      scannedAssets: [],
      startedAt: new Date().toISOString(),
      status: 'scanning_user'
    };
    setSession(newSession);
    setScannedUser(null);
    setScannedAssets([]);
    setMessage({ type: 'info', text: 'Scannez le QR code de l\'utilisateur' });
  };

  const handleScan = (qrCode: string) => {
    if (!session) return;

    if (session.status === 'scanning_user') {
      // Recherche de l'utilisateur
      const user = mockUsers.find(u => u.qrCode === qrCode || u.id === qrCode);
      if (user) {
        if (!user.isActive) {
          setMessage({ type: 'error', text: 'Utilisateur inactif' });
          return;
        }
        setScannedUser(user);
        setSession({ ...session, userId: user.id, userName: user.name, status: 'scanning_equipment' });
        setMessage({ type: 'success', text: `Utilisateur: ${user.name} - Scannez maintenant les équipements` });
      } else {
        setMessage({ type: 'error', text: 'Utilisateur non trouvé' });
      }
    } else if (session.status === 'scanning_equipment') {
      // Recherche de l'équipement
      const asset = mockAssets.find(a => a.qrCode === qrCode || a.id === qrCode);
      if (asset) {
        handleAssetScan(asset);
      } else {
        setMessage({ type: 'error', text: 'Équipement non trouvé' });
      }
    }
  };

  const handleAssetScan = (asset: Asset) => {
    if (!session || !scannedUser) return;

    // Vérifier si l'équipement est déjà scanné
    if (scannedAssets.find(a => a.id === asset.id)) {
      setMessage({ type: 'error', text: 'Équipement déjà scanné' });
      return;
    }

    // Logique de check-in/check-out
    if (asset.status === 'available') {
      // Check-out
      const updatedAsset = { ...asset, status: 'checked_out' as const, assignedTo: scannedUser.name };
      setScannedAssets([...scannedAssets, updatedAsset]);
      setMessage({ type: 'success', text: `${asset.name} - SORTIE enregistrée` });
    } else if (asset.status === 'checked_out' && asset.assignedTo === scannedUser.name) {
      // Check-in
      const updatedAsset = { ...asset, status: 'available' as const, assignedTo: undefined };
      setScannedAssets([...scannedAssets, updatedAsset]);
      setMessage({ type: 'success', text: `${asset.name} - RETOUR enregistré` });
    } else if (asset.status === 'checked_out' && asset.assignedTo !== scannedUser.name) {
      setMessage({ type: 'error', text: `Équipement assigné à ${asset.assignedTo}` });
    } else if (asset.status === 'defective') {
      setMessage({ type: 'error', text: 'Équipement défaillant - non disponible' });
    } else if (asset.status === 'maintenance') {
      setMessage({ type: 'error', text: 'Équipement en maintenance' });
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const completeSession = () => {
    if (session && scannedAssets.length > 0) {
      // Ici on sauvegarderait les mouvements en base
      setMessage({ type: 'success', text: `Session terminée - ${scannedAssets.length} mouvement(s) enregistré(s)` });
      setSession(null);
      setScannedUser(null);
      setScannedAssets([]);
    }
  };

  const cancelSession = () => {
    setSession(null);
    setScannedUser(null);
    setScannedAssets([]);
    setMessage(null);
  };

  const getUserAssets = (userName: string) => {
    return mockAssets.filter(asset => asset.assignedTo === userName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Scanner QR Code</h1>
        {!session && (
          <button
            onClick={startNewSession}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Nouvelle Session
          </button>
        )}
      </div>

      {/* Message d'état */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : message.type === 'error' ? (
              <AlertTriangle className="h-5 w-5 mr-2" />
            ) : (
              <QrCode className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Interface de scan */}
      {session ? (
        <div className="space-y-6">
          {/* Utilisateur scanné */}
          {scannedUser && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{scannedUser.name}</h3>
                  <p className="text-sm text-gray-500">{scannedUser.certificationLevel}</p>
                  <p className="text-sm text-gray-500">{scannedUser.licenseNumber}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserAssets(scannedUser.name).length} équipement(s) en cours
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zone de scan optimisée mobile */}
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {session.status === 'scanning_user' ? 'Scanner l\'utilisateur' : 'Scanner l\'équipement'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {session.status === 'scanning_user' 
                  ? 'Positionnez le QR code de l\'utilisateur devant la caméra'
                  : 'Scannez les QR codes des équipements à emprunter ou retourner'
                }
              </p>
              
              {/* Interface mobile optimisée */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Saisie manuelle
                </button>
                
                {showManualInput && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 max-w-md mx-auto">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Code QR ou ID"
                      className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
                    />
                    <button
                      onClick={handleManualInput}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                      Valider
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Équipements scannés */}
          {scannedAssets.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Équipements scannés ({scannedAssets.length})
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {scannedAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Package className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.assetTag}</div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          asset.status === 'checked_out' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {asset.status === 'checked_out' ? 'SORTIE' : 'RETOUR'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
            <button
              onClick={cancelSession}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </button>
            
            {scannedAssets.length > 0 && (
              <button
                onClick={completeSession}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Terminer la session
              </button>
            )}
          </div>
        </div>
      ) : (
        /* État initial */
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Scanner QR Code</h3>
          <p className="text-sm text-gray-500 mb-6">
            Démarrez une nouvelle session pour scanner les utilisateurs et équipements
          </p>
          <button
            onClick={startNewSession}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Commencer
          </button>
        </div>
      )}

      {/* Raccourcis de test */}
      {session && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Raccourcis de test :</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {session.status === 'scanning_user' ? (
              mockUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleScan(user.qrCode)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors text-center"
                >
                  {user.name}
                </button>
              ))
            ) : (
              mockAssets.slice(0, 8).map(asset => (
                <button
                  key={asset.id}
                  onClick={() => handleScan(asset.qrCode)}
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors text-center"
                >
                  {asset.assetTag}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}