import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/app/components/ui/sonner';
import { TranslationProvider } from '@/context/TranslationContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: 'Himmat Tea',
  description: 'Premium tea products from Himalayan foothills and around the world.',
  openGraph: {
    title: 'Himmat Tea',
    description: 'Premium tea products from Himalayan foothills and around the world.',
    url: 'https://himmattea.com', // Replace with your actual domain
    siteName: 'Himmat Tea',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himmat Tea',
    description: 'Premium tea products from Himalayan foothills and around the world.'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <TranslationProvider>
          <StoreProvider>
            <CartProvider>
              <WishlistProvider>
                <AuthProvider>
                  {children}
                  <Toaster />
                </AuthProvider>
              </WishlistProvider>
            </CartProvider>
          </StoreProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
