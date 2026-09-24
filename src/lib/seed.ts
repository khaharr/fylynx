import { db } from './db';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const existingUser = await db.user.findFirst({ where: { email: 'demo@fylinx.com' } });
  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUser = await db.user.create({
    data: {
      email: 'demo@fylinx.com',
      name: 'Jean Dupont',
      companyName: 'Agence Immobilière Dupont & Co',
      passwordHash,
      role: 'PRO',
      subscriptionStatus: 'PRO',
    },
  });

  // Create Default Templates
  const templateImmo = await db.folderTemplate.create({
    data: {
      userId: demoUser.id,
      name: 'Dossier Location Immobilier',
      requiredDocTypes: JSON.stringify([
        'Pièce d\'identité (CNI ou Passeport)',
        '3 derniers bulletins de salaire',
        'Dernier avis d\'imposition',
        'Justificatif de domicile actuel (-3 mois)',
      ]),
    },
  });

  const templateVehicule = await db.folderTemplate.create({
    data: {
      userId: demoUser.id,
      name: 'Location Véhicule Utilitaire',
      requiredDocTypes: JSON.stringify([
        'Permis de conduire (Recto/Verso)',
        'Justificatif de domicile de moins de 3 mois',
        'RIB pour empreinte bancaire',
      ]),
    },
  });

  // Create Sample Folder Request 1 (Pending)
  const req1 = await db.folderRequest.create({
    data: {
      userId: demoUser.id,
      clientName: 'Marc Martin',
      clientEmail: 'marc.martin@example.com',
      clientPhone: '+33612345678',
      token: 'demo-token-martin-123',
      status: 'PENDING',
      reminderCount: 1,
      lastRemindedAt: new Date(Date.now() - 26 * 3600 * 1000), // 26h ago
      documentRequirements: {
        create: [
          {
            title: 'Pièce d\'identité (CNI ou Passeport)',
            description: 'Capture lisible du recto et verso',
            isRequired: true,
            status: 'WAITING',
          },
          {
            title: '3 derniers bulletins de salaire',
            description: 'Fichiers PDF originaux ou photos nettes',
            isRequired: true,
            status: 'WAITING',
          },
          {
            title: 'Justificatif de domicile actuel (-3 mois)',
            description: 'Facture d\'électricité, gaz, eau ou téléphone fixe',
            isRequired: true,
            status: 'WAITING',
          },
        ],
      },
    },
  });

  // Create Sample Folder Request 2 (In Review / Partial)
  const req2 = await db.folderRequest.create({
    data: {
      userId: demoUser.id,
      clientName: 'Sophie Bernard',
      clientEmail: 'sophie.bernard@example.com',
      clientPhone: '+33698765432',
      token: 'demo-token-bernard-456',
      status: 'IN_REVIEW',
      reminderCount: 0,
      documentRequirements: {
        create: [
          {
            title: 'Permis de conduire (Recto/Verso)',
            description: 'Photo nette du permis',
            isRequired: true,
            status: 'SUBMITTED',
            files: {
              create: [
                {
                  fileKey: 'demo/permis_sophie.jpg',
                  fileName: 'permis_recto.jpg',
                  fileSize: 1420500,
                  mimeType: 'image/jpeg',
                },
              ],
            },
          },
          {
            title: 'Justificatif de domicile de moins de 3 mois',
            description: 'Facture récente',
            isRequired: true,
            status: 'VALIDATED',
            files: {
              create: [
                {
                  fileKey: 'demo/justificatif_domicile.pdf',
                  fileName: 'facture_edf_aout.pdf',
                  fileSize: 524000,
                  mimeType: 'application/pdf',
                },
              ],
            },
          },
        ],
      },
    },
  });

  return demoUser;
}
