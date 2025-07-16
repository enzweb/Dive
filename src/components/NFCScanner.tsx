import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  User, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { nfcReader, extractIdFromNFCData, NFCReadResult } from '../utils/nfcReader';
import { useQRScanner } from '../hooks/useApi';

export default function NFCScanner() {
  const { scanUserQR, scanAssetQR, checkout, checkin } = useQRScanner();
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [lastRead, setLastRead] = useState<NFCReadResult | null>(null);

  useEffect(() => {
    setIsNFCSupported(nfcReader.isNFCSupported());
  }, []);

  const startNFCReading = async () => {
    setMessage({ type: 'info', text: 'Approchez un tag NFC...' });
    
    await nfcReader.startReading(
      // Callback de succès
      async (result: NFCReadResult) => {
        console.log('NFC lu:', result);
        setLastRead(result);
        
        try {
          const id = extractIdFromNFCData(result.data);
          
          if (result.type === 'user') {
            const user = await scanUserQR(id);
            setMessage({ 
              type: 'success', 
              text: `Utilisateur NFC: ${user.name}` 
            });
          } else if (result.type === 'asset') {
            const asset = await scanAssetQR(id);
            setMessage({ 
              type: 'success', 
              text: `Équipement NFC: ${asset.name}` 
            });
          } else {
            setMessage({ 
              type: 'info', 
              text: `Tag NFC détecté: ${result.data}` 
            });
          }
        } catch (error) {
          setMessage({ 
            type: 'error', 
            text: 'Élément non trouvé dans la base de données' 
          });
        }
      },
      // Callback d'erreur
      (error: string) => {
        setMessage({ type: 'error', text: error });
        setIsReading(false);
      }
    );
    
    setIsReading(true);
  };

  const stopNFCReading = () => {
    nfcReader.stopReading();
    setIsReading(false);
    setMessage(null);
  };

  if (!isNFCSupported) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <WifiOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">NFC Non Supporté</h3>
          <p className="text-sm text-gray-500 mb-4">
            Votre navigateur ou appareil ne supporte pas la technologie NFC.
          </p>
          <div className="text-xs text-gray-400">
            <p>NFC est disponible sur :</p>
            <ul className="mt-2 space-y-1">
              <li>• Chrome sur Android</li>
              <li>• Samsung Internet</li>
              <li>• Autres navigateurs compatibles</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Smartphone className="h-6 w-6 mr-2 text-blue-600" />
          Scanner NFC
        </h2>
        <div className="flex items-center space-x-2">
          <Wifi className={`h-5 w-5 ${isReading ? 'text-green-600' : 'text-gray-400'}`} />
          <span className={`text-sm ${isReading ? 'text-green-600' : 'text-gray-500'}`}>
            {isReading ? 'Actif' : 'Inactif'}
          </span>
        </div>
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
              <Smartphone className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Zone de scan NFC */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 ${
            isReading ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'
          }`}>
            <Smartphone className={`h-12 w-12 ${
              isReading ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isReading ? 'Approchez un tag NFC' : 'Scanner NFC'}
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            {isReading 
              ? 'Maintenez votre appareil près du tag NFC à lire'
              : 'Activez le scanner pour lire les tags NFC des utilisateurs et équipements'
            }
          </p>
          
          <div className="space-y-4">
            {!isReading ? (
              <button
                onClick={startNFCReading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Wifi className="h-5 w-5 mr-2" />
                Activer NFC
              </button>
            ) : (
              <button
                onClick={stopNFCReading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <X className="h-5 w-5 mr-2" />
                Arrêter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dernière lecture */}
      {lastRead && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Dernière Lecture NFC</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  lastRead.type === 'user' ? 'bg-blue-100' : 
                  lastRead.type === 'asset' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {lastRead.type === 'user' ? (
                    <User className="h-6 w-6 text-blue-600" />
                  ) : lastRead.type === 'asset' ? (
                    <Package className="h-6 w-6 text-green-600" />
                  ) : (
                    <Smartphone className="h-6 w-6 text-gray-600" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Type: {lastRead.type === 'user' ? 'Utilisateur' : 
                         lastRead.type === 'asset' ? 'Équipement' : 'Inconnu'}
                </div>
                <div className="text-sm text-gray-500">ID: {lastRead.id}</div>
                <div className="text-sm text-gray-500 font-mono">
                  Données: {lastRead.data}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions NFC</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Activez NFC dans les paramètres de votre appareil</li>
          <li>• Autorisez l'accès NFC dans votre navigateur</li>
          <li>• Approchez l'appareil à moins de 4cm du tag</li>
          <li>• Maintenez la position jusqu'à la lecture</li>
        </ul>
      </div>
    </div>
  );
}