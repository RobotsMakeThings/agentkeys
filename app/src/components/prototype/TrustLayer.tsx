'use client';

import React from 'react';
import { Shield, FileCheck, Eye } from 'lucide-react';

export default function TrustLayer() {
  const trustFeatures = [
    {
      icon: 'ID',
      title: 'Identity + provenance',
      description: 'Link operators, runtimes, model lineage, and vendor attestations so buyers know what is actually behind an agent listing.',
      bullets: [
        'Verified operator profile',
        'Runtime provenance and deployment region',
        'Public changelog for model updates'
      ]
    },
    {
      icon: 'PG',
      title: 'Policy + guardrails',
      description: 'Every autonomous spend should sit inside budget caps, permitted tools, and escalation rules that a human can revoke instantly.',
      bullets: [
        'Delegated spend caps',
        'Scope-limited tool calls',
        'Manual and automatic revocation'
      ]
    },
    {
      icon: 'RX',
      title: 'Receipts + observability',
      description: 'Signed receipts turn every machine-to-machine payment into something finance, ops, and security teams can inspect.',
      bullets: [
        'Signed settlement records',
        'Attribution per task and sub-agent',
        'Dispute and replay tooling later'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-500/5">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
            Trust layer
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            This is the part Friend.tech never really solved.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            For AgentKeys, trust cannot be an afterthought. The homepage should make the safety model 
            legible enough that the product feels operational, not just speculative.
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="rounded-2xl p-8 backdrop-blur-xl"
              style={{ 
                background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
                border: '1px solid rgba(255,255,255,.1)',
                boxShadow: '0 28px 80px rgba(0,0,0,.34)'
              }}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                <span className="text-cyan-400 font-bold text-sm">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                {feature.description}
              </p>
              
              <ul className="space-y-3">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ 
                        background: '#76f6ff',
                        boxShadow: '0 0 0 4px rgba(118,246,255,.07)'
                      }}
                    />
                    <span className="text-gray-300">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            className="rounded-2xl p-6 text-center backdrop-blur-xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
              border: '1px solid rgba(255,255,255,.1)'
            }}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Verified operators</div>
            <div className="text-2xl font-bold text-white">847</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center backdrop-blur-xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
              border: '1px solid rgba(255,255,255,.1)'
            }}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Signed receipts</div>
            <div className="text-2xl font-bold text-white">2.4M</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center backdrop-blur-xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
              border: '1px solid rgba(255,255,255,.1)'
            }}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Uptime SLA</div>
            <div className="text-2xl font-bold text-green-400">99.97%</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center backdrop-blur-xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
              border: '1px solid rgba(255,255,255,.1)'
            }}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Security audits</div>
            <div className="text-2xl font-bold text-white">12</div>
          </div>
        </div>
      </div>
    </section>
  );
}