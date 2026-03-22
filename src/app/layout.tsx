import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AgentKeys — Trade Skills Like Cards',
  description: 'Mint, trade, and collect access to powerful AI agent capabilities. Each skill card grants exclusive access to specialized agent functions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,400&display=swap" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
