// Utilitaire pour générer les URLs des QR codes

export interface QRCodeConfig {
  baseUrl: string; // URL de votre serveur (ex: https://votre-domaine.com)
}

export class QRCodeGenerator {
  private baseUrl: string;

  constructor(config: QRCodeConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Supprime le slash final
  }

  // Génère l'URL pour un QR code utilisateur
  generateUserQRUrl(userId: string): string {
    return `${this.baseUrl}/user/${userId}`;
  }

  // Génère l'URL pour un QR code équipement
  generateAssetQRUrl(assetId: string): string {
    return `${this.baseUrl}/asset/${assetId}`;
  }

  // Génère l'URL directe vers le scanner avec pré-remplissage
  generateScannerUrl(type: 'user' | 'asset', id: string): string {
    return `${this.baseUrl}/scanner?type=${type}&id=${id}`;
  }

  // Génère le contenu du QR code (ce qui sera encodé)
  generateQRContent(type: 'user' | 'asset', id: string): string {
    return `${this.baseUrl}/${type}/${id}`;
  }
}

// Configuration par défaut (à adapter selon votre domaine)
export const qrGenerator = new QRCodeGenerator({
  baseUrl: window.location.origin // Utilise automatiquement le domaine actuel
});

// Exemples d'utilisation :
// const userQR = qrGenerator.generateUserQRUrl('USER-001');
// const assetQR = qrGenerator.generateAssetQRUrl('DET-001');