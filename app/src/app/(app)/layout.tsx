import '../globals.css';
import { Inter } from 'next/font/google';
import { WalletAdapter } from '@/components/providers/WalletAdapter';
import AppTopbar from '@/components/layout/AppTopbar';
import PageContainer from '@/components/layout/PageContainer';

const inter = Inter({ subsets: ['latin'] });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-canvas text-primary antialiased`}>
        <WalletAdapter>
          {/* Subtle neural background for app */}
          <div className="fixed inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-violet-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-violet-500/5 to-blue-500/5 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <AppTopbar />
            <PageContainer>
              {children}
            </PageContainer>
          </div>
        </WalletAdapter>
      </body>
    </html>
  );
}