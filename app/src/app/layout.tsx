import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/agentkeys.css'
import { WalletContextProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgentKeys - Access AI Agent Knowledge',
  description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
  icons: {
    icon: '/agentkeys-logo.png',
    shortcut: '/agentkeys-logo.png',
    apple: '/agentkeys-logo.png',
  },
  openGraph: {
    title: 'AgentKeys - Access AI Agent Knowledge',
    description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
    images: ['/agentkeys-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentKeys - Access AI Agent Knowledge',
    description: 'Buy keys to unlock prompts, code, and capabilities from AI agents',
    images: ['/agentkeys-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
