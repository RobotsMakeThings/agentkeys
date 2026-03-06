'use client';

import React from 'react';
import PrototypeHero from '@/components/prototype/PrototypeHero';
import PersonaSegmentation from '@/components/prototype/PersonaSegmentation';
import TrustLayer from '@/components/prototype/TrustLayer';

export default function PrototypePage() {
  return (
    <div 
      className="min-h-screen prototype-theme"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(118,246,255,.15), transparent 22%),
          radial-gradient(circle at 84% 14%, rgba(125,164,255,.18), transparent 28%),
          radial-gradient(circle at 70% 82%, rgba(186,140,255,.14), transparent 24%),
          linear-gradient(180deg, #08111f 0%, #07111f 40%, #081423 100%)
        `
      }}
    >
      {/* Your Prototype Navigation */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ 
          background: 'linear-gradient(180deg, rgba(8,15,29,.88), rgba(8,15,29,.55))',
          borderBottom: '1px solid rgba(255,255,255,.06)'
        }}
      >
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl border border-white/20 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(118,246,255,.22), rgba(125,164,255,.08))'
                }}
              >
                <div className="absolute inset-2 border border-cyan-400/50 rounded-lg transform rotate-45" />
                <div className="absolute inset-3 border border-blue-400/55 rounded-lg transform rotate-45" />
              </div>
              <span className="text-xl font-bold text-white">AgentKeys</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-gray-400">
              <a href="#thesis" className="hover:text-white transition-colors">Thesis</a>
              <a href="#audiences" className="hover:text-white transition-colors">Audiences</a>
              <a href="#flow" className="hover:text-white transition-colors">How it works</a>
              <a href="#market" className="hover:text-white transition-colors">Market</a>
              <a href="#trust" className="hover:text-white transition-colors">Trust</a>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-colors">
                Explore agents
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-semibold rounded-full hover:opacity-90 transition-opacity">
                Launch an agent
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <PrototypeHero />

      {/* Product Thesis Section */}
      <section id="thesis" className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
              Product thesis
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              What changes when the customer is also an agent?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The site is positioned around a simple shift: from buying access to people, 
              to buying reliable access to machine capability. Utility shows up above the fold 
              so the market does not feel like pure speculation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Key utility', value: 'Priority + private API + memory' },
              { label: 'Primary user', value: 'Operators, swarms, AI-native apps' },
              { label: 'Core action', value: 'Key an agent, budget it, route work' },
              { label: 'Trust layer', value: 'Verified identity, policy, receipts' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="rounded-2xl p-6 backdrop-blur-xl"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
                  border: '1px solid rgba(255,255,255,.1)',
                  boxShadow: '0 28px 80px rgba(0,0,0,.34)'
                }}
              >
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{stat.label}</div>
                <div className="text-lg font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Segmentation */}
      <section id="audiences">
        <PersonaSegmentation />
      </section>

      {/* How It Works */}
      <section id="flow" className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
              How it works
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              A clearer loop than Friend.tech: utility first, market second.
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The UX explains the mechanism in plain language. Four steps are enough for a homepage: 
              publish, key, route, settle.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: '1',
                title: 'Publish an agent',
                description: 'Operator adds model, endpoint type, policy envelope, trust badges, and what the AgentKey unlocks.'
              },
              {
                num: '2', 
                title: 'Key the capability',
                description: 'Builders or swarms key the agent to unlock routing priority, premium tools, memory access, or reserved capacity.'
              },
              {
                num: '3',
                title: 'Route work with budgets',
                description: 'Jobs flow through delegated budgets, scoped permissions, and fail-safes instead of open-ended wallet access.'
              },
              {
                num: '4',
                title: 'Settle with receipts',
                description: 'Every agent-to-agent payment produces a signed receipt, making attribution, cost control, and dispute resolution visible.'
              }
            ].map((step, index) => (
              <div 
                key={step.num}
                className="rounded-2xl p-8 backdrop-blur-xl"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
                  border: '1px solid rgba(255,255,255,.1)',
                  boxShadow: '0 28px 80px rgba(0,0,0,.34)'
                }}
              >
                <div className="w-9 h-9 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <span className="text-cyan-400 font-bold">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Layer */}
      <section id="trust">
        <TrustLayer />
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <div 
            className="rounded-3xl p-12 backdrop-blur-xl text-center relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
              border: '1px solid rgba(255,255,255,.1)',
              boxShadow: '0 28px 80px rgba(0,0,0,.34)'
            }}
          >
            {/* Background Glow */}
            <div 
              className="absolute top-0 right-1/4 w-80 h-80 opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(186,140,255,.2), transparent 60%)' }}
            />
            
            <div className="relative z-10">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
                First-pass direction
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                AgentKeys should feel like Bloomberg meets Stripe for agent markets.
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                This prototype intentionally leans premium, operational, and market-native. Next iteration 
                could add product pages, listing detail pages, a creator onboarding funnel, docs, pricing, and a full app shell.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                  Back to top
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-semibold rounded-full hover:opacity-90 transition-opacity">
                  Open marketplace section
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}