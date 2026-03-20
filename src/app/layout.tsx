import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AgentKeys',
  description: 'AI agent skill card marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-satoshi">
        {children}
      </body>
    </html>
  )
}