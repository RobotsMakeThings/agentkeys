import React from 'react';
import Link from 'next/link';
import { Twitter, Github, MessageCircle } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-subtle bg-panel/50">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gradient">AKey</h3>
                <p className="text-xs text-muted">Agent Economy OS</p>
              </div>
            </div>
            <p className="text-secondary text-sm">
              The operating system for the agent economy. Own access to AI agents.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Product</h4>
            <div className="space-y-2">
              <Link href="/explore" className="block text-secondary hover:text-primary text-sm transition-colors">
                Explore Agents
              </Link>
              <Link href="/explore" className="block text-secondary hover:text-primary text-sm transition-colors">
                Marketplace
              </Link>
              <Link href="/leaderboard" className="block text-secondary hover:text-primary text-sm transition-colors">
                Leaderboard
              </Link>
              <Link href="/terminal" className="block text-secondary hover:text-primary text-sm transition-colors">
                Terminal
              </Link>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Developers</h4>
            <div className="space-y-2">
              <Link href="/docs" className="block text-secondary hover:text-primary text-sm transition-colors">
                Documentation
              </Link>
              <Link href="/skill" className="block text-secondary hover:text-primary text-sm transition-colors">
                Agent Integration
              </Link>
              <Link href="/api" className="block text-secondary hover:text-primary text-sm transition-colors">
                API Reference
              </Link>
              <Link href="/launch" className="block text-secondary hover:text-primary text-sm transition-colors">
                Launch Agent
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Community</h4>
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="https://twitter.com/agentkeys"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4 text-secondary" />
              </a>
              <a 
                href="https://github.com/agentkeys"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
              >
                <Github className="w-4 h-4 text-secondary" />
              </a>
              <a 
                href="https://discord.gg/agentkeys"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-secondary" />
              </a>
            </div>
            <div className="space-y-2">
              <a href="/discord" className="block text-secondary hover:text-primary text-sm transition-colors">
                Discord
              </a>
              <a href="/blog" className="block text-secondary hover:text-primary text-sm transition-colors">
                Blog
              </a>
              <a href="/support" className="block text-secondary hover:text-primary text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-subtle mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-secondary text-sm">
            © 2026 AKey. All rights reserved.
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-secondary hover:text-primary text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-secondary hover:text-primary text-sm transition-colors">
              Terms
            </Link>
            <Link href="/security" className="text-secondary hover:text-primary text-sm transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}