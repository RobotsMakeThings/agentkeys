import './globals.css';
import { Inter } from 'next/font/google';
import { WalletAdapter } from '@/components/providers/WalletAdapter';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import NeuralGrid from '@/components/backgrounds/NeuralGrid';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | AgentKeys',
    default: 'AgentKeys - AI Agent Trading Platform',
  },
  description: 'Trade AI agent keys, access advanced analytics, and build your portfolio in the future of artificial intelligence.',
  keywords: ['AI agents', 'trading', 'blockchain', 'Solana', 'decentralized', 'artificial intelligence'],
  authors: [{ name: 'AgentKeys Team' }],
  creator: 'AgentKeys',
  publisher: 'AgentKeys',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agentkeys.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AgentKeys - AI Agent Trading Platform',
    description: 'Trade AI agent keys and access the future of artificial intelligence',
    url: 'https://agentkeys.ai',
    siteName: 'AgentKeys',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AgentKeys Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentKeys - AI Agent Trading Platform',
    description: 'Trade AI agent keys and access the future of artificial intelligence',
    images: ['/og-image.png'],
    creator: '@agentkeys',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#0066ff' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgentKeys',
    startupImage: [
      {
        url: '/icons/apple-splash-2048-2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'AgentKeys',
    'msapplication-TileColor': '#0066ff',
    'msapplication-TileImage': '/icons/mstile-150x150.png',
    'theme-color': '#0066ff',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="AgentKeys" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AgentKeys" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0066ff" />
        <meta name="theme-color" content="#0066ff" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.className} bg-canvas text-primary antialiased`}
        suppressHydrationWarning={true}
      >
        <AccessibilityProvider>
          <WalletAdapter>
            {/* Skip Links */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <a href="#navigation" className="skip-link">
              Skip to navigation
            </a>
            
            {/* Neural Grid Background */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
              <NeuralGrid intensity="subtle" animated={true} />
            </div>
            
            {/* Ambient Glow */}
            <div 
              className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" 
              aria-hidden="true"
            />
            
            <div className="relative z-10">
              <MarketingHeader />
              <main id="main-content" className="min-h-screen" role="main">
                {children}
              </main>
              <SiteFooter />
            </div>
            
            {/* Accessibility Controls */}
            <AccessibilityControls />
          </WalletAdapter>
        </AccessibilityProvider>
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Web Vitals monitoring
              function sendToAnalytics(metric) {
                console.log('Web Vital:', metric);
                // In production, send to analytics service
              }
              
              // Core Web Vitals
              if ('web-vitals' in window) {
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(sendToAnalytics);
                  getFID(sendToAnalytics);
                  getFCP(sendToAnalytics);
                  getLCP(sendToAnalytics);
                  getTTFB(sendToAnalytics);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}