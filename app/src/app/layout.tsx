import './globals.css';
import { Inter } from 'next/font/google';
import { WalletAdapter } from '@/components/providers/WalletAdapter';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import NeuralGrid from '@/components/backgrounds/NeuralGrid';

const inter = Inter({ subsets: ['latin'] });

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-canvas text-primary antialiased`}>
        <WalletAdapter>
          {/* Neural Grid Background */}
          <div className="fixed inset-0 pointer-events-none">
            <NeuralGrid intensity="subtle" animated={true} />
          </div>
          
          {/* Ambient Glow */}
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <MarketingHeader />
            <main className="min-h-screen">
              {children}
            </main>
            <SiteFooter />
          </div>
        </WalletAdapter>
      </body>
    </html>
  );
}