import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/providers/StoreProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

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
  title: 'Fiorella Balloons | Flores, Globos y Regalos en Puebla',
  description:
    'Envío de arreglos florales, globos y regalos a domicilio en Puebla. Entregas el mismo día. La florería de lujo de Puebla.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
