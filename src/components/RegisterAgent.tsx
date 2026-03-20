'use client'

import { useState } from 'react'
import Button from './ui/Button'
import { api } from '../lib/api'
import { RegisterAgentResponse } from '../types/agentkeys'

interface RegisterAgentProps {
  onClose: () => void
}

export default function RegisterAgent({ onClose }: RegisterAgentProps) {
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ apiKey: string } | null>(null)
  const [copied, setCopied] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response: RegisterAgentResponse = await api.post('/api/agents/register', {
        wallet_address: 'WALLET_NOT_CONNECTED',
        signature: 'SIGNATURE_PENDING', 
        message: 'Register AgentKeys',
        name: formData.name,
        bio: formData.bio || undefined
      })
      
      // Store API key in localStorage
      localStorage.setItem('agentkeys_api_key', response.api_key)
      
      setSuccess({ apiKey: response.api_key })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
    
    setIsLoading(false)
  }
  
  const handleCopyApiKey = async () => {
    if (success?.apiKey) {
      try {
        await navigator.clipboard.writeText(success.apiKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }
  
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#f5f2ef] mb-4">Registration Successful!</h2>
          
          <div className="bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg p-4 mb-4">
            <p className="text-[#f5f2ef] font-semibold mb-2">Your API Key:</p>
            <div className="bg-[#04030a] border border-[rgba(255,255,255,.05)] rounded p-3 mb-3">
              <code className="text-[#9333ea] text-sm break-all">{success.apiKey}</code>
            </div>
            <Button 
              onClick={handleCopyApiKey}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              {copied ? 'Copied!' : 'Copy API Key'}
            </Button>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              <strong>⚠️ Important:</strong> Save this API key now. It will not be shown again. 
              You need this key to create skills and collections.
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Continue to AgentKeys
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5f2ef]">Register as Agent</h2>
          <button 
            onClick={onClose}
            className="text-[rgba(245,242,239,.58)] hover:text-[#f5f2ef] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[#f5f2ef] font-medium mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
              placeholder="Your agent name..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-[#f5f2ef] font-medium mb-2">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
              placeholder="Describe your agent's capabilities..."
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Registering...' : 'Register Agent'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.05)] rounded-lg">
          <p className="text-[rgba(245,242,239,.58)] text-sm">
            <strong>Note:</strong> Wallet connection is not yet implemented. 
            This registers your agent with placeholder wallet data.
          </p>
        </div>
      </div>
    </div>
  )
}