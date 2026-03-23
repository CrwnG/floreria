import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { StoreShell } from '@/components/layout/StoreShell';
import { validateEnv } from '@/lib/env';

validateEnv();

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fiorella Balloons | Flores, Globos y Regalos en Puebla',
    template: '%s | Fiorella Balloons',
  },
  description:
    'Envio de arreglos florales, globos y regalos a domicilio en Puebla. Entregas el mismo dia. La floreria de lujo de Puebla.',
  keywords: ['flores', 'globos', 'regalos', 'Puebla', 'floreria', 'envio', 'arreglos florales', 'Fiorella Balloons'],
  openGraph: {
    title: 'Fiorella Balloons | Flores, Globos y Regalos en Puebla',
    description: 'Envio de arreglos florales, globos y regalos a domicilio en Puebla. Entregas el mismo dia.',
    siteName: 'Fiorella Balloons',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fiorella Balloons | Flores, Globos y Regalos en Puebla',
    description: 'Envio de arreglos florales, globos y regalos a domicilio en Puebla.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
