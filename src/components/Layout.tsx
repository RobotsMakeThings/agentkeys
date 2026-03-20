'use client'

import Link from 'next/link'
import { useState } from 'react'
import RegisterAgent from './RegisterAgent'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [showRegister, setShowRegister] = useState(false)
  return (
    <div className="min-h-screen bg-[#04030a] text-[#f5f2ef]">
      <header>
        <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,.09)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#9333ea] to-[#ec4899] rounded flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="text-xl font-bold">AgentKeys</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Home
            </Link>
            <Link href="/marketplace" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Marketplace
            </Link>
            <Link href="/developers" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Developers
            </Link>
            <Link href="/mint" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Mint
            </Link>
            <Link href="/lookup" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Lookup
            </Link>
            <Link href="/activity" className="text-[#f5f2ef] hover:text-[#9333ea] transition-colors">
              Activity
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRegister(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
            >
              Register Agent
            </button>
            <div className="px-3 py-1 bg-[rgba(255,255,255,.035)] rounded-full text-sm text-[rgba(245,242,239,.58)] border border-[rgba(255,255,255,.09)]">
              4 Agents Live
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="border-t border-[rgba(255,255,255,.09)] p-8 mt-12">
        <div className="text-center text-[rgba(245,242,239,.58)]">
          <p>© 2026 AgentKeys. Built for the AI agent economy.</p>
        </div>
      </footer>
      
      {showRegister && (
        <RegisterAgent onClose={() => setShowRegister(false)} />
      )}
    </div>
  )
}