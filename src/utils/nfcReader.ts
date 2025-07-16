// Utilitaire pour la lecture NFC
// Utilise l'API Web NFC (disponible sur Chrome Android et autres navigateurs compatibles)

export interface NFCReadResult {
  id: string;
  data: string;
  type: 'user' | 'asset' | 'unknown';
}

export class NFCReader {
  private isSupported: boolean = false;
  private isReading: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    this.isSupported = 'NDEFReader' in window;
  }

  public isNFCSupported(): boolean {
    return this.isSupported;
  }

  public isCurrentlyReading(): boolean {
    return this.isReading;
  }

  // Démarrer la lecture NFC
  public async startReading(
    onRead: (result: NFCReadResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.isSupported) {
      onError('NFC non supporté sur ce navigateur');
      return;
    }

    if (this.isReading) {
      onError('Lecture NFC déjà en cours');
      return;
    }

    try {
      // Demander les permissions
      const permission = await navigator.permissions.query({ name: 'nfc' as any });
      if (permission.state === 'denied') {
        onError('Permission NFC refusée');
        return;
      }

      // @ts-ignore - NDEFReader n'est pas encore dans les types TypeScript standard
      const ndef = new NDEFReader();
      
      this.isReading = true;

      // Démarrer le scan
      await ndef.scan();
      console.log('🔍 Scan NFC démarré');

      // Écouter les lectures
      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        console.log('📱 Tag NFC détecté:', serialNumber);
        
        try {
          // Traiter les données du tag
          const result = this.processNFCMessage(message, serialNumber);
          onRead(result);
        } catch (error) {
          console.error('Erreur traitement NFC:', error);
          onError('Erreur lors du traitement du tag NFC');
        }
      });

      ndef.addEventListener('readingerror', () => {
        onError('Erreur de lecture NFC');
        this.isReading = false;
      });

    } catch (error) {
      console.error('Erreur NFC:', error);
      this.isReading = false;
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            onError('Permission NFC refusée');
            break;
          case 'NotSupportedError':
            onError('NFC non supporté sur cet appareil');
            break;
          case 'NotReadableError':
            onError('Erreur de lecture NFC');
            break;
          default:
            onError(`Erreur NFC: ${error.message}`);
        }
      } else {
        onError('Erreur inconnue lors de l\'initialisation NFC');
      }
    }
  }

  // Arrêter la lecture NFC
  public stopReading(): void {
    this.isReading = false;
    console.log('⏹️ Scan NFC arrêté');
  }

  // Traiter le message NFC
  private processNFCMessage(message: any, serialNumber: string): NFCReadResult {
    let data = '';
    let type: 'user' | 'asset' | 'unknown' = 'unknown';

    // Parcourir les enregistrements du message NDEF
    for (const record of message.records) {
      if (record.recordType === 'text') {
        // Décoder le texte
        const textDecoder = new TextDecoder(record.encoding || 'utf-8');
        data = textDecoder.decode(record.data);
        
        // Déterminer le type basé sur le contenu
        if (data.includes('USER-') || data.includes('/user/')) {
          type = 'user';
        } else if (data.includes('DET-') || data.includes('COM-') || data.includes('MAS-') || 
                   data.includes('PAL-') || data.includes('GIL-') || data.includes('BOU-') ||
                   data.includes('/asset/')) {
          type = 'asset';
        }
        
        break;
      } else if (record.recordType === 'url') {
        // URL directe
        const textDecoder = new TextDecoder();
        data = textDecoder.decode(record.data);
        
        if (data.includes('/user/')) {
          type = 'user';
        } else if (data.includes('/asset/')) {
          type = 'asset';
        }
        
        break;
      }
    }

    // Si pas de données dans les enregistrements, utiliser le numéro de série
    if (!data) {
      data = serialNumber;
    }

    return {
      id: serialNumber,
      data: data,
      type: type
    };
  }

  // Écrire des données sur un tag NFC (pour programmer les tags)
  public async writeNFC(
    data: string,
    onSuccess: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.isSupported) {
      onError('NFC non supporté sur ce navigateur');
      return;
    }

    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      
      await ndef.write({
        records: [{
          recordType: 'text',
          data: data
        }]
      });

      console.log('✅ Tag NFC programmé avec succès');
      onSuccess();

    } catch (error) {
      console.error('Erreur écriture NFC:', error);
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            onError('Permission NFC refusée pour l\'écriture');
            break;
          case 'NetworkError':
            onError('Tag NFC non accessible pour l\'écriture');
            break;
          default:
            onError(`Erreur écriture NFC: ${error.message}`);
        }
      } else {
        onError('Erreur inconnue lors de l\'écriture NFC');
      }
    }
  }
}

// Instance globale
export const nfcReader = new NFCReader();

// Fonction utilitaire pour extraire l'ID depuis les données NFC
export function extractIdFromNFCData(data: string): string {
  // Si c'est une URL, extraire l'ID
  const urlMatch = data.match(/\/(user|asset)\/([^\/\?]+)/);
  if (urlMatch) {
    return urlMatch[2];
  }
  
  // Si c'est un code direct
  if (data.includes('-')) {
    return data;
  }
  
  // Sinon retourner tel quel
  return data;
}