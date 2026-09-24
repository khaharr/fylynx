import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import LiveChatWidget from '@/components/LiveChatWidget';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://fylynx.com'),
  title: 'Fylynx | Collecte & Vérification Automatisée de Pièces Justificatives B2B',
  description:
    'Fini les relances manuelles et les emails chaotiques. Envoyez un lien unique de dépôt sécurisé à vos clients, relancez automatiquement par email/SMS et certifiez les dossiers avec l\'IA Vision Fylynx.',
  keywords: [
    'collecte de pièces justificatives',
    'vérification de documents IA',
    'relances automatiques client',
    'portail documentaire marque blanche',
    'KYC anti-fraude',
    'collecte justificatifs comptable immobilier',
    'Fylynx SaaS',
  ],
  alternates: {
    canonical: 'https://fylynx.com',
  },
  icons: {
    icon: '/fylynx-logo.png',
    shortcut: '/fylynx-logo.png',
    apple: '/fylynx-logo.png',
  },
  openGraph: {
    title: 'Fylynx - Plateforme SaaS de Collecte Documentaire B2B',
    description: 'Relances automatiques quotidiennes e-mail & SMS + vérification IA instantanée des CNI, passeports et justificatifs.',
    url: 'https://fylynx.com',
    siteName: 'Fylynx',
    images: [
      {
        url: '/fylynx-logo.png',
        width: 800,
        height: 800,
        alt: 'Fylynx Logo Officiel',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fylynx | Collecte Documentaire Automatisée & IA',
    description: 'Relances automatiques quotidiennes e-mail & SMS + vérification IA instantanée.',
    images: ['/fylynx-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fylynx',
    url: 'https://fylynx.com',
    logo: 'https://fylynx.com/fylynx-logo.png',
    image: 'https://fylynx.com/fylynx-logo.png',
    description: 'Plateforme SaaS B2B de collecte et vérification automatisée de pièces justificatives par IA.',
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fylynx',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '29.00',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
    },
  };

  return (
    <html lang="fr" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/fylynx-logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/fylynx-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className="h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          {children}
          <LiveChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
