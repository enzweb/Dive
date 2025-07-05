import React from 'react';
import { QrCode, Download, Printer as Print } from 'lucide-react';
import { qrGenerator } from '../utils/qrCodeGenerator';

interface QRCodeDisplayProps {
  type: 'user' | 'asset';
  id: string;
  name: string;
  size?: number;
}

export default function QRCodeDisplay({ type, id, name, size = 200 }: QRCodeDisplayProps) {
  const qrUrl = qrGenerator.generateQRContent(type, id);
  
  // URL pour générer le QR code via une API externe (QR Server)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}&format=png&margin=10`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `qr-${type}-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                display: inline-block;
                border: 2px solid #000;
                padding: 20px;
                margin: 20px;
              }
              .qr-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .qr-subtitle {
                font-size: 14px;
                color: #666;
                margin-bottom: 15px;
              }
              .qr-code {
                margin: 15px 0;
              }
              .qr-url {
                font-size: 10px;
                font-family: monospace;
                word-break: break-all;
                margin-top: 10px;
                color: #333;
              }
              @media print {
                body { margin: 0; }
                .qr-container { border: 1px solid #000; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">${name}</div>
              <div class="qr-subtitle">${type === 'user' ? 'Utilisateur' : 'Équipement'} - ${id}</div>
              <div class="qr-code">
                <img src="${qrImageUrl}" alt="QR Code" />
              </div>
              <div class="qr-url">${qrUrl}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <QrCode className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">QR Code</h3>
        </div>
        
        <div className="mb-4">
          <img 
            src={qrImageUrl} 
            alt={`QR Code pour ${name}`}
            className="mx-auto border border-gray-200 rounded"
            style={{ width: size, height: size }}
          />
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500 mt-1 font-mono break-all">
            {qrUrl}
          </div>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Print className="h-4 w-4 mr-2" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}