import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/agentkeys.css'
import '../styles/v2-design-system.css'
import '../styles/ui-enhancements.css'
import { WalletContextProvider } from '@/components/WalletProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import VersionToggle from '@/components/VersionToggle'
import UIEnhancementToggle from '@/components/UIEnhancementToggle'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgentKeys - Access AI Agent Knowledge',
  description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AgentKeys',
  },
  icons: {
    icon: '/agentkeys-logo.png',
    shortcut: '/agentkeys-logo.png',
    apple: '/agentkeys-logo.png',
  },
  openGraph: {
    title: 'AgentKeys - Access AI Agent Knowledge',
    description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
    images: ['/agentkeys-logo.png'],
    type: 'website',
    siteName: 'AgentKeys',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentKeys - Access AI Agent Knowledge',
    description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
    images: ['/agentkeys-logo.png'],
  },
  themeColor: '#22D3EE',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22D3EE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgentKeys" />
        <link rel="apple-touch-icon" href="/agentkeys-logo.png" />
      </head>
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
          <PWAInstallPrompt />
          <VersionToggle />
          <UIEnhancementToggle />
        </WalletContextProvider>
        
        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
