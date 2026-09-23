import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fylynx - Collecte & Vérification Automatisée de Pièces Justificatives',
  description:
    'Fini les relances manuelles et les emails chaotiques. Envoyez un lien unique de dépôt sécurisé à vos clients et certifiez leurs dossiers avec l\'IA Fylynx.',
  openGraph: {
    title: 'Fylynx - Plateforme SaaS de Collecte Documentaire B2B',
    description: 'Relances automatiques et vérification IA instantanée des pièces justificatives.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
