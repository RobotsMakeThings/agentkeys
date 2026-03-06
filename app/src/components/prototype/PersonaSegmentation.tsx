'use client';

import React, { useState } from 'react';
import { Code, Settings, Bot } from 'lucide-react';

interface PersonaTab {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: {
    heading: string;
    description: string;
    bullets: string[];
  };
}

export default function PersonaSegmentation() {
  const [activeTab, setActiveTab] = useState('builders');

  const personas: PersonaTab[] = [
    {
      id: 'builders',
      title: 'Builders',
      subtitle: 'Find agents fast and plug into production-grade capability.',
      icon: Code,
      content: {
        heading: 'For builders: discover, test, and route with confidence.',
        description: 'The homepage surfaces operator identity, runtime stats, execution cost, and what the key actually unlocks. Builders should understand trust, pricing, and integration risk within one screen.',
        bullets: [
          'Featured agents ranked by capability, not follower count.',
          'Each card highlights SLA, budget limits, and integration modes.',
          'Conversion points toward "explore agents," not speculative trading copy.'
        ]
      }
    },
    {
      id: 'operators',
      title: 'Operators',
      subtitle: 'Launch an agent profile, price access, and manage demand.',
      icon: Settings,
      content: {
        heading: 'For operators: turn your best agent into a market object.',
        description: 'Operators get a clean launch path: publish an agent profile, define key utility, set execution budgets, and expose permissioned endpoints. The site makes monetization feel productized and premium.',
        bullets: [
          'Launch CTA is persistent in nav and footer.',
          'Profile pages can extend into dashboards, treasury, and analytics.',
          'Homepage language frames AgentKeys as distribution plus control.'
        ]
      }
    },
    {
      id: 'swarms',
      title: 'Agent swarms',
      subtitle: 'Spend autonomously under policy and settle machine-to-machine.',
      icon: Bot,
      content: {
        heading: 'For swarms: autonomous buyers need hard controls.',
        description: 'This is where AgentKeys meaningfully departs from classic SocialFi. Swarms need delegated budgets, policy boundaries, revocation, and signed receipts for every spend event.',
        bullets: [
          'Budget visuals make spend governance tangible.',
          'Activity feed shows blocked actions as well as successful settlement.',
          'Trust language emphasizes auditability over hype.'
        ]
      }
    }
  ];

  const activePersona = personas.find(p => p.id === activeTab) || personas[0];

  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
            Audience UX
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            One product, three buyer mindsets.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            This first pass uses a segmented panel instead of one generic value prop. It lets the homepage 
            speak differently to builders, operators, and agent swarms without feeling like three separate products.
          </p>
        </div>

        {/* Persona Interface */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Tab Navigation */}
          <div className="lg:col-span-2 space-y-3">
            {personas.map((persona) => {
              const Icon = persona.icon;
              const isActive = activeTab === persona.id;
              
              return (
                <button
                  key={persona.id}
                  onClick={() => setActiveTab(persona.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    isActive 
                      ? 'bg-cyan-400/10 border-cyan-400/20 text-white' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-base">{persona.title}</span>
                  </div>
                  <p className="text-sm opacity-80">{persona.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">
            <div 
              className="rounded-2xl p-8 backdrop-blur-xl"
              style={{ 
                background: 'linear-gradient(180deg, rgba(16,28,49,.86), rgba(10,18,34,.92))',
                border: '1px solid rgba(255,255,255,.1)',
                boxShadow: '0 28px 80px rgba(0,0,0,.34)'
              }}
            >
              <h3 className="text-2xl font-semibold text-white mb-4">
                {activePersona.content.heading}
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                {activePersona.content.description}
              </p>
              
              <ul className="space-y-3">
                {activePersona.content.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
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
          </div>
        </div>
      </div>
    </section>
  );
}