import { db } from './db';
import bcrypt from 'bcryptjs';

export async function ensureAdminUser() {
  const adminEmail = 'info@fylynx.com';
  const passwordHash = await bcrypt.hash('fylynx_team01', 10);

  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    const updated = await db.user.update({
      where: { email: adminEmail },
      data: {
        role: 'ADMIN',
        subscriptionStatus: 'AI_ENTERPRISE',
        passwordHash,
      },
    });
    return updated;
  }

  const oldAdmin = await db.user.findUnique({ where: { email: 'admin@fylynx.app' } });
  if (oldAdmin) {
    const updated = await db.user.update({
      where: { id: oldAdmin.id },
      data: {
        email: adminEmail,
        name: 'Administrateur Fylynx',
        companyName: 'Fylynx Admin HQ',
        passwordHash,
        role: 'ADMIN',
        subscriptionStatus: 'AI_ENTERPRISE',
      },
    });
    return updated;
  }

  const newAdmin = await db.user.create({
    data: {
      email: adminEmail,
      name: 'Administrateur Fylynx',
      companyName: 'Fylynx Admin HQ',
      passwordHash,
      role: 'ADMIN',
      subscriptionStatus: 'AI_ENTERPRISE',
    },
  });

  return newAdmin;
}
