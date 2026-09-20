import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Cinzel } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';
import { CheckoutModal } from '@/components/checkout-modal';
import { QuickViewModal } from '@/components/quick-view-modal';
import { WhatsAppConcierge } from '@/components/whatsapp-concierge';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ACR Cottons',
  description: 'Textiles Woven for Everyday Luxury. Artisanal bedspreads and matching pillow suites crafted in Erode, Tamil Nadu.',
  icons: {
    icon: '/favicon_mark.png',
    shortcut: '/favicon_mark.png',
    apple: '/favicon_mark.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${cinzel.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon_mark.png" type="image/png" />
      </head>
      <body className="font-sans antialiased bg-[#F8F5EE] text-[#332C26] min-h-screen flex flex-col selection:bg-[#B89A52] selection:text-[#F8F5EE]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <AuthModal />
        <CheckoutModal />
        <QuickViewModal />
        <WhatsAppConcierge />
      </body>
    </html>
  );
}
