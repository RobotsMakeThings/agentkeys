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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nicosxt/Satoshi@latest/css/satoshi.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
