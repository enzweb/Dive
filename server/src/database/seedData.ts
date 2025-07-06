import { Database } from './database';

export async function seedDatabase(db: Database): Promise<void> {
  // Seed users
  const users = [
    {
      id: 'user-1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      certification_level: 'N2',
      phone: '06 12 34 56 78',
      emergency_contact: 'Marie Dupont - 06 87 65 43 21'
    },
    {
      id: 'user-2',
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      certification_level: 'N3',
      phone: '06 23 45 67 89',
      emergency_contact: 'Pierre Martin - 06 98 76 54 32'
    },
    {
      id: 'user-3',
      name: 'Marc Leroy',
      email: 'marc.leroy@email.com',
      certification_level: 'N1',
      phone: '06 34 56 78 90',
      emergency_contact: 'Anne Leroy - 06 09 87 65 43'
    }
  ];

  for (const user of users) {
    await db.run(
      'INSERT INTO users (id, name, email, certification_level, phone, emergency_contact) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.certification_level, user.phone, user.emergency_contact]
    );
  }

  // Seed assets
  const assets = [
    {
      id: 'asset-1',
      name: 'Détendeur Scubapro MK25',
      type: 'regulator',
      size: 'Standard',
      condition: 'excellent',
      location: 'Armoire A1',
      qr_code: 'DET001'
    },
    {
      id: 'asset-2',
      name: 'Combinaison 5mm Taille L',
      type: 'wetsuit',
      size: 'L',
      condition: 'good',
      location: 'Armoire B2',
      qr_code: 'COMB001'
    },
    {
      id: 'asset-3',
      name: 'Masque Cressi Big Eyes',
      type: 'mask',
      size: 'Adulte',
      condition: 'good',
      location: 'Étagère C1',
      qr_code: 'MASK001'
    },
    {
      id: 'asset-4',
      name: 'Palmes Mares Avanti Quattro',
      type: 'fins',
      size: '42-43',
      condition: 'excellent',
      location: 'Étagère C2',
      qr_code: 'PALM001'
    },
    {
      id: 'asset-5',
      name: 'Gilet Stabilisateur Aqualung',
      type: 'bcd',
      size: 'M',
      condition: 'good',
      location: 'Armoire A2',
      qr_code: 'BCD001'
    }
  ];

  for (const asset of assets) {
    await db.run(
      'INSERT INTO assets (id, name, type, size, condition, location, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [asset.id, asset.name, asset.type, asset.size, asset.condition, asset.location, asset.qr_code]
    );
  }
}