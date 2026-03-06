'use client';

import React, { useState } from 'react';
import { 
  ArrowRight,
  ArrowLeft, 
  Upload,
  Settings,
  DollarSign,
  Rocket,
  Bot,
  Brain,
  Shield,
  Zap,
  BarChart3,
  GitBranch,
  Globe,
  Key,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  Home,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface LaunchFormData {
  // Step 1: Identity
  agentName: string;
  symbol: string;
  category: string;
  avatar: string;
  description: string;
  
  // Step 2: Capabilities  
  capabilities: string[];
  apis: string[];
  integrations: string[];
  githubRepo: string;
  
  // Step 3: Economics
  keySupply: number;
  basePrice: number;
  creatorFee: number;
  revenueShare: number;
  
  // Step 4: Access Tiers
  tiers: {
    keys: number;
    name: string;
    features: string[];
  }[];
}

export default function LaunchAgentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LaunchFormData>({
    agentName: '',
    symbol: '',
    category: '',
    avatar: '',
    description: '',
    capabilities: [],
    apis: [],
    integrations: [],
    githubRepo: '',
    keySupply: 10000,
    basePrice: 0.001,
    creatorFee: 2,
    revenueShare: 95,
    tiers: [
      { keys: 1, name: 'Basic', features: ['Standard access'] },
      { keys: 5, name: 'Pro', features: ['Priority routing', 'Advanced features'] },
      { keys: 20, name: 'Enterprise', features: ['Dedicated capacity', 'Custom integrations'] }
    ]
  });

  const steps = [
    { id: 1, name: 'Identity', icon: Bot },
    { id: 2, name: 'Capabilities', icon: Brain },
    { id: 3, name: 'Economics', icon: DollarSign },
    { id: 4, name: 'Launch', icon: Rocket }
  ];

  const categories = [
    { id: 'research', name: 'Research & Analysis', icon: BarChart3 },
    { id: 'trading', name: 'Trading & DeFi', icon: BarChart3 },
    { id: 'security', name: 'Security & Auditing', icon: Shield },
    { id: 'automation', name: 'Automation & Workflow', icon: Zap },
    { id: 'creative', name: 'Creative & Design', icon: Bot },
    { id: 'infrastructure', name: 'Infrastructure & Tools', icon: Settings }
  ];

  const predefinedCapabilities = [
    'Market Research', 'Data Analysis', 'Report Generation', 'API Integration',
    'Real-time Monitoring', 'Automated Trading', 'Risk Assessment', 'Security Auditing',
    'Smart Contract Analysis', 'Content Creation', 'Image Generation', 'Code Review',
    'Workflow Automation', 'Email Processing', 'Social Media Management', 'Customer Support'
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive 
                ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400'
                : isCompleted
                  ? 'bg-green-400/10 border border-green-400/20 text-green-400'
                  : 'bg-gray-800 border border-gray-700 text-gray-400'
            }`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-600 mx-3" />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Agent Identity</h2>
        <p className="text-gray-400">Define your agent's core identity and positioning</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label>
          <input 
            type="text"
            value={formData.agentName}
            onChange={(e) => updateFormData('agentName', e.target.value)}
            placeholder="e.g., ResearchOS"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Symbol *</label>
          <input 
            type="text"
            value={formData.symbol}
            onChange={(e) => updateFormData('symbol', e.target.value.toUpperCase())}
            placeholder="e.g., RSCH"
            maxLength={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Category *</label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = formData.category === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => updateFormData('category', category.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <div className="font-medium text-sm">{category.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea 
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe what your agent does and its unique capabilities..."
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.description.length}/500 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Agent Avatar</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            {formData.agentName ? (
              <span className="text-white font-bold text-lg">
                {formData.agentName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Bot className="w-8 h-8 text-white" />
            )}
          </div>
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Capabilities</h2>
        <p className="text-gray-400">Define what your agent can do and how it integrates</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Agent Capabilities</label>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {predefinedCapabilities.map(capability => {
            const isSelected = formData.capabilities.includes(capability);
            
            return (
              <button
                key={capability}
                onClick={() => {
                  if (isSelected) {
                    updateFormData('capabilities', formData.capabilities.filter(c => c !== capability));
                  } else {
                    updateFormData('capabilities', [...formData.capabilities, capability]);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  isSelected
                    ? 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {capability}
              </button>
            );
          })}
        </div>
        <input 
          type="text"
          placeholder="Add custom capability..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              updateFormData('capabilities', [...formData.capabilities, e.currentTarget.value]);
              e.currentTarget.value = '';
            }
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Repository</label>
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-gray-400" />
          <input 
            type="url"
            value={formData.githubRepo}
            onChange={(e) => updateFormData('githubRepo', e.target.value)}
            placeholder="https://github.com/username/repo"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Link to your agent's source code for transparency and capability verification
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">API Integrations</label>
          <div className="space-y-2">
            {['OpenAI API', 'Anthropic API', 'Google Search', 'Twitter API', 'Discord API', 'Webhook Support'].map(api => (
              <label key={api} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={formData.apis.includes(api)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFormData('apis', [...formData.apis, api]);
                    } else {
                      updateFormData('apis', formData.apis.filter(a => a !== api));
                    }
                  }}
                  className="rounded border-gray-700 bg-gray-800 text-cyan-400"
                />
                <span className="text-gray-300 text-sm">{api}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Platform Integrations</label>
          <div className="space-y-2">
            {['Slack', 'Discord', 'Telegram', 'Zapier', 'Make.com', 'Custom Webhooks'].map(integration => (
              <label key={integration} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={formData.integrations.includes(integration)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFormData('integrations', [...formData.integrations, integration]);
                    } else {
                      updateFormData('integrations', formData.integrations.filter(i => i !== integration));
                    }
                  }}
                  className="rounded border-gray-700 bg-gray-800 text-cyan-400"
                />
                <span className="text-gray-300 text-sm">{integration}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Economics</h2>
        <p className="text-gray-400">Set your agent's pricing and revenue model</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Key Supply</label>
          <input 
            type="number"
            value={formData.keySupply}
            onChange={(e) => updateFormData('keySupply', Number(e.target.value))}
            min="1000"
            max="1000000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
          <div className="text-xs text-gray-500 mt-1">
            Total number of keys that can exist (1,000 - 1,000,000)
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Base Price (SOL)</label>
          <input 
            type="number"
            value={formData.basePrice}
            onChange={(e) => updateFormData('basePrice', Number(e.target.value))}
            min="0.001"
            step="0.001"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
          <div className="text-xs text-gray-500 mt-1">
            Starting price per key (increases with demand via bonding curve)
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Creator Fee</span>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                value={formData.creatorFee}
                onChange={(e) => {
                  const fee = Number(e.target.value);
                  updateFormData('creatorFee', Math.min(Math.max(fee, 1), 10));
                  updateFormData('revenueShare', 100 - fee - 5); // 5% is platform fee
                }}
                min="1"
                max="10"
                className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
              />
              <span className="text-gray-300">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Platform Fee</span>
            <span className="text-gray-300">5%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Key Holder Value</span>
            <span className="text-gray-300">{formData.revenueShare}%</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 mt-0.5" />
            <div className="text-sm text-cyan-300">
              <strong>How it works:</strong> When someone buys a key, {formData.creatorFee}% goes to you immediately, 
              5% goes to AgentKeys platform, and {formData.revenueShare}% stays with key holders as value appreciation.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Projected Economics</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {(formData.basePrice * 100 * formData.creatorFee / 100).toFixed(3)} SOL
            </div>
            <div className="text-sm text-gray-400">Revenue from first 100 keys</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">
              {(formData.basePrice * Math.pow(1000, 1.5) / 1000).toFixed(2)} SOL
            </div>
            <div className="text-sm text-gray-400">Price at 1,000 keys</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {(formData.keySupply / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-gray-400">Max supply</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Launch Preview</h2>
        <p className="text-gray-400">Review your agent before deployment</p>
      </div>

      {/* Agent Preview Card */}
      <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {formData.agentName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">{formData.agentName}</h3>
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-400 font-mono">
                {formData.symbol}
              </span>
            </div>
            <p className="text-gray-400 mb-4">{formData.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {formData.capabilities.slice(0, 4).map(capability => (
                <span key={capability} className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded text-xs text-cyan-400">
                  {capability}
                </span>
              ))}
              {formData.capabilities.length > 4 && (
                <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
                  +{formData.capabilities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">{formData.basePrice.toFixed(3)} SOL</div>
            <div className="text-sm text-gray-400">Starting price</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">{(formData.keySupply / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-400">Max supply</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-green-400">{formData.creatorFee}%</div>
            <div className="text-sm text-gray-400">Creator fee</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-cyan-400">{formData.capabilities.length}</div>
            <div className="text-sm text-gray-400">Capabilities</div>
          </div>
        </div>

        <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-green-400">Ready to Launch</h4>
          </div>
          <div className="text-sm text-green-300">
            Your agent configuration is complete and ready for deployment to the AgentKeys marketplace.
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">What happens next:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs">1</div>
              <span className="text-gray-300">Smart contract deployment (~30 seconds)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs">2</div>
              <span className="text-gray-300">Agent profile goes live on marketplace</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs">3</div>
              <span className="text-gray-300">Users can start buying keys immediately</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs">4</div>
              <span className="text-gray-300">You start earning creator fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/agentkeys-logo.png" 
                alt="AgentKeys" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-lg text-gradient">AgentKeys</h1>
                <p className="text-xs text-gray-400">Token-gated agent platform</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/capabilities" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <Home className="w-4 h-4" />
                Explore
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/launch" 
                className="px-4 py-2 rounded-lg transition-colors bg-gray-800 text-white"
              >
                Launch
              </Link>
              <Link 
                href="/skill" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <Bot className="w-4 h-4" />
                AI Agents
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="container max-w-4xl mx-auto px-6">
          {renderStepIndicator()}
        
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-400 disabled:opacity-50 hover:text-white transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!formData.agentName || !formData.symbol || !formData.category || !formData.description)) ||
                  (currentStep === 2 && formData.capabilities.length === 0) ||
                  (currentStep === 3 && (!formData.basePrice || formData.basePrice < 0.001))
                }
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold">
                <Rocket className="w-4 h-4" />
                Deploy Agent
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}